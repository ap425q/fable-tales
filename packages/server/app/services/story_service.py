"""
Story Service
Main business logic for story creation, management, and reading workflow
"""

import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import config
from app.models.schemas import (CharacterAssignment, CharacterRole,
                                GenerationStatus, ImageVersion, Location,
                                LocationImageGenerationStatus, NodeType,
                                PresetCharacter, ReadingCompletionRequest,
                                ReadingNode, ReadingProgress,
                                ReadingProgressRequest, SceneGenerationStatus,
                                ShareLinkResponse, Story, StoryEdge,
                                StoryForReading, StoryListItem,
                                StoryListResponse, StoryNode, StoryStatus,
                                StoryTree)
from app.storage.supabase_data_manager import SupabaseDataManager
from external_services import FALAIService, OpenAIService
from gemini_service import GeminiService
from master_prompts import (STORY_GENERATION_SYSTEM_PROMPT,
                            STORY_GENERATION_USER_PROMPT_TEMPLATE)


class StoryService:
    """
    Main service for story creation, management, and reading workflow
    Orchestrates between storage, external APIs, and business logic
    """
    
    def __init__(self):
        """Initialize story service"""
        self.data_manager = SupabaseDataManager()
        self.openai_service = OpenAIService()
        self.fal_ai_service = FALAIService()
        self.gemini_service = GeminiService()
        
        # Get frontend URL from config (use first CORS origin)
        cors_origins = config.CORS_ORIGINS
        self.frontend_url = cors_origins[0] if cors_origins else "http://localhost:3000"
        
        # Initialize preset characters
        self._initialize_preset_characters()
    
    def _initialize_preset_characters(self):
        """Initialize preset characters if not already done"""
        # Preset characters are already initialized in the Supabase schema
        # This method is kept for compatibility but doesn't need to do anything
        pass
    
    # ========================================================================
    # Story Generation and Management
    # ========================================================================
    
    def _convert_ids_to_uuids(self, story_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert all simple string IDs (node_1, choice_1, etc.) to UUIDs
        and update all references throughout the story structure
        """
        # Create ID mappings
        node_id_map = {}
        choice_id_map = {}
        char_id_map = {}
        loc_id_map = {}
        
        # Generate UUIDs for all nodes
        for node in story_data["tree"]["nodes"]:
            node_id_map[node["id"]] = str(uuid.uuid4())
        
        # Generate UUIDs for all choices
        for node in story_data["tree"]["nodes"]:
            for choice in node.get("choices", []):
                choice_id_map[choice["id"]] = str(uuid.uuid4())
        
        # Generate UUIDs for all characters
        for char in story_data.get("characters", []):
            char_id_map[char["id"]] = str(uuid.uuid4())
        
        # Generate UUIDs for all locations
        for loc in story_data.get("locations", []):
            loc_id_map[loc["id"]] = str(uuid.uuid4())
        
        # Update node IDs and choice references
        for node in story_data["tree"]["nodes"]:
            # Update node ID
            node["id"] = node_id_map[node["id"]]
            
            # Update choice IDs and nextNodeId references
            for choice in node.get("choices", []):
                choice["id"] = choice_id_map[choice["id"]]
                if choice.get("nextNodeId"):
                    choice["nextNodeId"] = node_id_map[choice["nextNodeId"]]
        
        # Update edge references
        for edge in story_data["tree"]["edges"]:
            # Handle both 'from' and 'from_' keys
            from_key = "from_" if "from_" in edge else "from"
            edge[from_key] = node_id_map[edge[from_key]]
            edge["to"] = node_id_map[edge["to"]]
            edge["choiceId"] = choice_id_map[edge["choiceId"]]
        
        # Update character IDs
        for char in story_data.get("characters", []):
            char["id"] = char_id_map[char["id"]]
        
        # Update location IDs
        for loc in story_data.get("locations", []):
            loc["id"] = loc_id_map[loc["id"]]
        
        print(f"✓ Converted IDs to UUIDs: {len(node_id_map)} nodes, {len(choice_id_map)} choices", flush=True)
        
        return story_data
    
    def _validate_tree_connectivity(self, tree_data: Dict[str, Any]) -> None:
        """
        Validate that the tree structure is fully connected
        Expected: 4 nodes, 3 edges
        
        Raises:
            Exception: If tree validation fails
        """
        nodes = tree_data.get("nodes", [])
        edges = tree_data.get("edges", [])
        
        validation_errors = []
        
        # Check 1: Must have exactly 4 nodes
        if len(nodes) != 4:
            validation_errors.append(f"Expected exactly 4 nodes, but got {len(nodes)}")
        
        # Check 2: Must have exactly 3 edges
        if len(edges) != 3:
            validation_errors.append(f"Expected exactly 3 edges, but got {len(edges)}")
        
        # Build a map of node IDs
        node_ids = {node["id"] for node in nodes}
        
        # Collect all choices and their nextNodeIds
        all_choices = []
        for node in nodes:
            for choice in node.get("choices", []):
                all_choices.append({
                    "node_id": node["id"],
                    "choice_id": choice["id"],
                    "next_node_id": choice.get("nextNodeId")
                })
        
        # Check 3: Must have exactly 3 choices total
        if len(all_choices) != 3:
            validation_errors.append(f"Expected exactly 3 choices total, but got {len(all_choices)}")
        
        # Validate: Every choice must have a corresponding edge
        edge_map = {(edge["from"], edge["choiceId"]): edge["to"] for edge in edges}
        
        # Check 4: Every choice must have a corresponding edge
        for choice in all_choices:
            edge_key = (choice["node_id"], choice["choice_id"])
            if edge_key not in edge_map:
                validation_errors.append(
                    f"Missing edge for choice '{choice['choice_id']}' in node '{choice['node_id']}'"
                )
            elif edge_map[edge_key] != choice["next_node_id"]:
                validation_errors.append(
                    f"Edge mismatch for choice '{choice['choice_id']}': "
                    f"choice points to '{choice['next_node_id']}' but edge points to '{edge_map[edge_key]}'"
                )
        
        # Check 5: All nextNodeIds must reference valid nodes
        for choice in all_choices:
            if choice["next_node_id"] and choice["next_node_id"] not in node_ids:
                validation_errors.append(
                    f"Invalid nextNodeId '{choice['next_node_id']}' in choice '{choice['choice_id']}' - node doesn't exist"
                )
        
        if validation_errors:
            error_msg = "Tree validation failed:\n" + "\n".join(f"  - {err}" for err in validation_errors)
            print(f"VALIDATION ERROR:\n{error_msg}", flush=True)
            raise Exception(error_msg)
        
        print(f"✓ Tree validation passed: 4 nodes, 3 edges, 3 choices", flush=True)
    
    def generate_story(self, lesson: str, theme: str, story_format: str, character_count: int = 4) -> Dict[str, Any]:
        """Generate a new story with AI"""
        story_id = str(uuid.uuid4())
        print('Generating story...', flush=True)
        try:
            # Generate story content using AI
            user_prompt = STORY_GENERATION_USER_PROMPT_TEMPLATE.format(
                lesson=lesson,
                theme=theme,
                story_format=story_format,
                character_count=character_count
            )
            
            # Call OpenAI to generate the story structure
            story_data = self.openai_service.generate_branched_story(
                lesson=lesson,
                theme=theme,
                story_format=story_format,
                character_count=character_count,
                system_prompt=STORY_GENERATION_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )
            print(story_data, flush=True)
            
            # Validate tree connectivity
            self._validate_tree_connectivity(story_data["tree"])
            
            # Convert all simple IDs to UUIDs and update references
            story_data = self._convert_ids_to_uuids(story_data)
            
            # Convert the response to our schema objects
            from app.models.schemas import (CharacterRole, Choice, Location,
                                            StoryEdge, StoryNode, StoryTree)

            # Convert nodes
            nodes = []
            for node_data in story_data["tree"]["nodes"]:
                choices = []
                for choice_data in node_data.get("choices", []):
                    choice = Choice(
                        id=choice_data.get("id"),
                        text=choice_data["text"],
                        nextNodeId=choice_data.get("nextNodeId"),
                        isCorrect=choice_data.get("isCorrect", True)
                    )
                    choices.append(choice)
                
                node = StoryNode(
                    id=node_data["id"],
                    sceneNumber=node_data["sceneNumber"],
                    title=node_data["title"],
                    text=node_data["text"],
                    location=node_data["location"],
                    type=node_data["type"],
                    choices=choices
                )
                nodes.append(node)
            
            # Convert edges
            edges = []
            for edge_data in story_data["tree"]["edges"]:
                edge = StoryEdge(
                    **edge_data  # This will handle the alias correctly
                )
                edges.append(edge)
            
            # Create tree
            tree = StoryTree(nodes=nodes, edges=edges)
            
            # Convert characters
            characters = []
            for char_data in story_data["characters"]:
                character = CharacterRole(
                    id=char_data["id"],
                    role=char_data["role"],
                    description=char_data["description"]
                )
                characters.append(character)
            
            # Convert locations
            locations = []
            for loc_data in story_data["locations"]:
                location = Location(
                    id=loc_data["id"],
                    name=loc_data["name"],
                    sceneNumbers=loc_data["sceneNumbers"],
                    description=loc_data["description"]
                )
                locations.append(location)
            
            # Save story
            story = Story(
                id=story_id,
                lesson=lesson,
                theme=theme,
                storyFormat=story_format,
                status=StoryStatus.DRAFT,
                tree=tree,
                characters=characters,
                locations=locations,
                createdAt=datetime.now(),
                updatedAt=datetime.now()
            )
            
            self.data_manager.save_story(story)
            
            return {
                "storyId": story_id,
                "tree": tree.model_dump(by_alias=True),
                "characters": [char.model_dump(by_alias=True) for char in characters],
                "locations": [loc.model_dump(by_alias=True) for loc in locations]
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate story: {str(e)}")
    
    def _create_sample_story(self, lesson: str, theme: str, story_format: str, character_count: int) -> Dict[str, Any]:
        """Create a sample story structure (placeholder for AI generation)"""
        
        # Create sample nodes
        from app.models.schemas import Choice
        
        nodes = [
            StoryNode(
                id="node_1",
                sceneNumber=1,
                title="The Beginning",
                text=f"Once upon a time in a {theme.lower()}, there was a brave little character who learned that {lesson.lower()}.",
                location="Magical Forest",
                type=NodeType.START,
                choices=[
                    Choice(
                        id="choice_1",
                        text="Help a friend in need",
                        nextNodeId="node_2",
                        isCorrect=True
                    ),
                    Choice(
                        id="choice_2",
                        text="Ignore the friend",
                        nextNodeId="node_3",
                        isCorrect=False
                    )
                ]
            ),
            StoryNode(
                id="node_2",
                sceneNumber=2,
                title="A Good Choice",
                text="The character helped their friend and felt proud of their decision.",
                location="Magical Forest",
                type=NodeType.NORMAL,
                choices=[
                    Choice(
                        id="choice_3",
                        text="Continue the adventure",
                        nextNodeId="node_4",
                        isCorrect=True
                    )
                ]
            ),
            StoryNode(
                id="node_3",
                sceneNumber=3,
                title="A Missed Opportunity",
                text="The character ignored their friend and later felt sad about their choice.",
                location="Magical Forest",
                type=NodeType.BAD_ENDING,
                choices=[]
            ),
            StoryNode(
                id="node_4",
                sceneNumber=4,
                title="The Happy Ending",
                text="The character learned the importance of helping others and lived happily ever after.",
                location="Magical Forest",
                type=NodeType.GOOD_ENDING,
                choices=[]
            )
        ]
        
        # Create edges
        edges = [
            StoryEdge(**{"from": "node_1", "to": "node_2", "choiceId": "choice_1"}),
            StoryEdge(**{"from": "node_1", "to": "node_3", "choiceId": "choice_2"}),
            StoryEdge(**{"from": "node_2", "to": "node_4", "choiceId": "choice_3"})
        ]
        
        # Create tree
        tree = StoryTree(nodes=nodes, edges=edges)
        
        # Create characters
        characters = [
            CharacterRole(id="char_1", role="Protagonist", description="Main character"),
            CharacterRole(id="char_2", role="Friend", description="Supporting character"),
            CharacterRole(id="char_3", role="Helper", description="Wise guide"),
            CharacterRole(id="char_4", role="Antagonist", description="Challenge character")
        ][:character_count]
        
        # Create locations
        locations = [
            Location(
                id="loc_1",
                name="Magical Forest",
                sceneNumbers=[1, 2, 3, 4],
                description="A beautiful forest where the story takes place"
            )
        ]
        
        return {
            "tree": tree,
            "characters": characters,
            "locations": locations
        }
    
    def get_story(self, story_id: str) -> Optional[Story]:
        """Get a story by ID"""
        return self.data_manager.get_story(story_id)
    
    def get_stories_list(self, limit: int, offset: int, status: Optional[str] = None) -> StoryListResponse:
        """Get list of stories with pagination"""
        stories = self.data_manager.get_stories_list(limit, offset, status)
        return StoryListResponse(
            stories=stories,
            total=self.data_manager.get_stories_count(status),
            hasMore=len(stories) == limit
        )
    
    
    def get_all_stories(self, limit: int, offset: int, status: Optional[str] = None, sort_by: Optional[str] = None) -> StoryListResponse:
        """Get all stories with detailed information"""
        stories = self.data_manager.get_all_stories(limit, offset, status, sort_by)
        return StoryListResponse(
            stories=stories,
            total=self.data_manager.get_stories_count(status),
            hasMore=len(stories) == limit
        )
    
    # ========================================================================
    # Story Tree Editing
    # ========================================================================
    
    def update_node(self, story_id: str, node_id: str, request) -> Optional[StoryNode]:
        """Update a story node"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        # Find and update the node
        for node in story.tree.nodes:
            if node.id == node_id:
                if request.title:
                    node.title = request.title
                if request.text:
                    node.text = request.text
                if request.location:
                    node.location = request.location
                if request.choices:
                    node.choices = request.choices
                
                # Update story
                story.updatedAt = datetime.now()
                self.data_manager.save_story(story)
                return node
        
        return None
    
    def add_node(self, story_id: str, request) -> Optional[StoryNode]:
        """Add a new node to the story"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        # Create new node
        new_node = StoryNode(
            id=str(uuid.uuid4()),
            sceneNumber=len(story.tree.nodes) + 1,
            title=request.title,
            text=request.text,
            location=request.location,
            type=request.type,
            choices=request.choices if hasattr(request, 'choices') else []
        )
        
        # Add to story tree
        story.tree.nodes.append(new_node)
        
        # Add edge from parent to new node
        if hasattr(request, 'parentNodeId') and request.parentNodeId:
            new_edge = StoryEdge(
                from_node=request.parentNodeId,
                to=new_node.id
            )
            story.tree.edges.append(new_edge)
            
            # If choiceId is provided, update the parent node's choice to point to new node
            if hasattr(request, 'choiceId') and request.choiceId:
                for node in story.tree.nodes:
                    if node.id == request.parentNodeId:
                        for choice in node.choices:
                            if choice.id == request.choiceId:
                                choice.nextNodeId = new_node.id
                                break
                        break
        
        story.updatedAt = datetime.now()
        self.data_manager.save_story(story)
        
        return new_node
    
    def delete_node(self, story_id: str, node_id: str) -> Optional[Dict[str, Any]]:
        """Delete a node from the story"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        # Find and remove the node
        node_to_remove = None
        affected_nodes = []
        
        for node in story.tree.nodes:
            if node.id == node_id:
                node_to_remove = node
                # Check which nodes have choices pointing to this node
                for other_node in story.tree.nodes:
                    if other_node != node_to_remove:
                        for choice in other_node.choices:
                            if choice.nextNodeId == node_id:
                                affected_nodes.append(other_node.id)
                                choice.nextNodeId = None
        
        if node_to_remove:
            story.tree.nodes.remove(node_to_remove)
            # Remove edges involving this node
            story.tree.edges = [edge for edge in story.tree.edges if edge.from_ != node_id and edge.to != node_id]
            story.updatedAt = datetime.now()
            self.data_manager.save_story(story)
            
            return {
                "deletedNodeId": node_id,
                "affectedNodes": affected_nodes,
                "message": "Node deleted successfully"
            }
        
        return None
    
    
    # ========================================================================
    # Character Management
    # ========================================================================
    
    def get_preset_characters(self) -> List[PresetCharacter]:
        """Get preset characters"""
        characters_data = self.data_manager.get_preset_characters()
        return [PresetCharacter(**char) for char in characters_data]
    
    def save_character_assignments(self, story_id: str, assignments) -> Optional[List[CharacterAssignment]]:
        """Save character assignments for a story"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        preset_chars = {char.id: char for char in self.get_preset_characters()}
        story_chars = {char.id: char for char in story.characters}
        
        character_assignments = []
        for assignment in assignments:
            char_role_id = assignment.characterRoleId
            preset_char_id = assignment.presetCharacterId
            
            if char_role_id in story_chars and preset_char_id in preset_chars:
                preset_char = preset_chars[preset_char_id]
                story_char = story_chars[char_role_id]
                
                assignment_obj = CharacterAssignment(
                    characterRoleId=char_role_id,
                    presetCharacterId=preset_char_id,
                    roleName=story_char.role,
                    characterName=preset_char.name
                )
                character_assignments.append(assignment_obj)
        
        # Save assignments to database
        assignment_data = [{"characterRoleId": a.characterRoleId, "presetCharacterId": a.presetCharacterId} for a in assignments]
        self.data_manager.save_character_assignments(story_id, assignment_data)
        
        return character_assignments
    
    def get_character_assignments(self, story_id: str) -> Optional[List[CharacterAssignment]]:
        """Get character assignments for a story"""
        assignments_data = self.data_manager.get_character_assignments(story_id)
        if assignments_data is None:
            return None
        
        return [CharacterAssignment(**assignment) for assignment in assignments_data]
    
    # ========================================================================
    # Location Image Management
    # ========================================================================
    
    def get_story_locations(self, story_id: str) -> Optional[List[Location]]:
        """Get locations for a story"""
        locations_data = self.data_manager.get_story_locations(story_id)
        if locations_data is None:
            return None
        
        return [Location(**loc) for loc in locations_data]
    
    def update_location_description(self, story_id: str, location_id: str, request) -> Optional[Location]:
        """Update location description"""
        locations = self.get_story_locations(story_id)
        if not locations:
            return None
        
        for location in locations:
            if location.id == location_id:
                if request.name:
                    location.name = request.name
                if request.description:
                    location.description = request.description
                
                # Save updated location
                self.data_manager.save_story_locations(story_id, [loc.model_dump() for loc in locations])
                return location
        
        return None
    
    def generate_all_location_images(self, story_id: str, locations) -> Optional[str]:
        """Generate location background image using FAL.ai and return URL"""
        try:
            story = self.data_manager.get_story(story_id)
            if not story:
                raise Exception("Story not found")
            
            # For now, we'll generate the first location's image
            # In the future, you might want to handle multiple locations
            if not locations or len(locations) == 0:
                raise Exception("No locations provided")
            
            first_location = locations[0]
            description = first_location.description
            
            # Generate image using FAL.ai
            fal_image_url = self.fal_ai_service.generate_image(
                prompt=description,
                width=1024,
                height=768
            )
            
            if not fal_image_url:
                raise Exception("Failed to generate image from FAL.ai")
            
            # Try to upload to Supabase storage, but fall back to FAL.ai URL if it fails
            filename = f"locations/{story_id}_{first_location.locationId}_{str(uuid.uuid4())[:8]}.jpg"
            try:
                supabase_url = self.data_manager.upload_image_to_storage(fal_image_url, filename)
                final_url = supabase_url if supabase_url else fal_image_url
                if not supabase_url:
                    print("⚠️ Supabase storage upload failed, using FAL.ai URL as fallback", flush=True)
            except Exception as e:
                print(f"⚠️ Supabase storage error: {str(e)}, using FAL.ai URL as fallback", flush=True)
                final_url = fal_image_url
                supabase_url = None
            
            # Generate a version ID for this image
            version_id = str(uuid.uuid4())
            
            # Update the location with the generated image
            location_data = {
                "id": first_location.locationId,
                "story_id": story_id,
                "location_id": first_location.locationId,
                "name": f"Location {first_location.locationId}",
                "description": description,
                "image_url": final_url,
                "status": "completed",
                "selected_version_id": version_id,  # Set the new version as selected
                "updated_at": datetime.now().isoformat()
            }
            
            # Save to database
            self.data_manager.update_location_image(location_data)
            
            # Create a version entry for this generated image
            version_entry = {
                "id": str(uuid.uuid4()),  # Use a plain UUID for the primary key
                "background_id": first_location.locationId,
                "version_id": version_id,
                "image_url": final_url,
                "created_at": datetime.now().isoformat()
            }
            self.data_manager.supabase.table("background_versions").insert(version_entry).execute()
            
            if supabase_url:
                print(f"✅ Image uploaded to Supabase storage: {supabase_url}", flush=True)
            else:
                print("⚠️ Supabase storage upload failed, using FAL.ai URL", flush=True)
            
            return final_url
            
        except Exception as e:
            print(f"Error in generate_all_location_images: {str(e)}", flush=True)
            raise Exception(f"Location image generation failed: {str(e)}")
    
    def check_location_image_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[LocationImageGenerationStatus]:
        """Check location image generation status"""
        status_data = self.data_manager.get_location_image_generation_status(story_id, job_id)
        if not status_data:
            return None
        
        return LocationImageGenerationStatus(**status_data)
    
    def regenerate_individual_location_image(self, story_id: str, location_id: str, description: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Regenerate individual location image using FAL.ai"""
        locations = self.get_story_locations(story_id)
        if not locations:
            return None
        
        for location in locations:
            if location.id == location_id:
                try:
                    # Use provided description or existing description
                    prompt = description if description else location.description
                    
                    # Generate new image using FAL.ai
                    fal_image_url = self.fal_ai_service.generate_image(
                        prompt=prompt,
                        width=1024,
                        height=768
                    )
                    
                    if not fal_image_url:
                        raise Exception("Failed to generate image from FAL.ai")
                    
                    # Try to upload to Supabase storage, fall back to FAL.ai URL if it fails
                    filename = f"locations/{story_id}_{location_id}_{str(uuid.uuid4())[:8]}.jpg"
                    try:
                        supabase_url = self.data_manager.upload_image_to_storage(fal_image_url, filename)
                        final_url = supabase_url if supabase_url else fal_image_url
                        if not supabase_url:
                            print("⚠️ Supabase storage upload failed, using FAL.ai URL as fallback", flush=True)
                    except Exception as e:
                        print(f"⚠️ Supabase storage error: {str(e)}, using FAL.ai URL as fallback", flush=True)
                        final_url = fal_image_url
                    
                    # Create new version
                    version_id = str(uuid.uuid4())
                    new_version = ImageVersion(
                        versionId=version_id,
                        imageUrl=final_url,
                        createdAt=datetime.now()
                    )
                    
                    location.imageVersions.append(new_version)
                    location.imageUrl = final_url
                    location.generationStatus = GenerationStatus.COMPLETED
                    location.selectedVersionId = version_id  # Auto-select the new version
                    
                    # Update description if provided
                    if description:
                        location.description = description
                    
                    # Save updated location to database
                    self.data_manager.save_story_locations(story_id, [loc.model_dump() for loc in locations])
                    
                    # Also create a version entry in the database
                    version_data = {
                        "id": str(uuid.uuid4()),  # Use a plain UUID for the primary key
                        "background_id": location_id,
                        "version_id": version_id,
                        "image_url": final_url,
                        "created_at": datetime.now().isoformat()
                    }
                    self.data_manager.supabase.table("background_versions").insert(version_data).execute()
                    
                    return {
                        "locationId": location_id,
                        "versionId": version_id,
                        "imageUrl": final_url,
                        "status": "completed"
                    }
                    
                except Exception as e:
                    print(f"Error regenerating location {location_id}: {str(e)}", flush=True)
                    location.generationStatus = GenerationStatus.FAILED
                    self.data_manager.save_story_locations(story_id, [loc.model_dump() for loc in locations])
                    
                    return {
                        "locationId": location_id,
                        "error": str(e),
                        "status": "failed"
                    }
        
        return None
    
    def select_location_image_version(self, story_id: str, location_id: str, version_id: str) -> Optional[Dict[str, Any]]:
        """Select location image version"""
        locations = self.get_story_locations(story_id)
        if not locations:
            return None
        
        for location in locations:
            if location.id == location_id:
                for version in location.imageVersions:
                    if version.versionId == version_id:
                        location.selectedVersionId = version_id
                        location.imageUrl = version.url
                        
                        # Save updated location
                        self.data_manager.save_story_locations(story_id, [loc.model_dump() for loc in locations])
                        
                        return {
                            "locationId": location_id,
                            "selectedVersionId": version_id,
                            "imageUrl": version.url
                        }
        
        return None
    
    # ========================================================================
    # Scene Image Management
    # ========================================================================
    
    def generate_all_scene_images(self, story_id: str, scene_ids: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """
        Generate all scene images using OpenAI Vision + Gemini
        
        Flow:
        1. Get character assignments and their selected images
        2. Use OpenAI Vision to describe the characters
        3. Get story nodes (scenes) and their backgrounds
        4. For each scene, combine character description + background + scene details
        5. Generate image with Gemini
        6. Save the results
        """
        try:
            print(f"🎬 Starting scene generation for story {story_id}")
            
            # Get the story
            story = self.data_manager.get_story(story_id)
            if not story:
                raise Exception("Story not found")
            
            # Get character assignments
            character_assignments = self.data_manager.get_character_assignments(story_id)
            if not character_assignments:
                raise Exception("No character assignments found. Please assign characters first.")
            
            # Collect character image URLs from selected characters
            character_image_urls = []
            character_descriptions_map = {}
            
            for assignment in character_assignments:
                image_url = assignment.get("imageUrl")
                if image_url:
                    # Convert relative URLs to absolute URLs for OpenAI Vision API
                    if image_url.startswith("/"):
                        absolute_url = f"{self.frontend_url}{image_url}"
                        print(f"🔗 Converting relative URL: {image_url} -> {absolute_url}")
                        character_image_urls.append(absolute_url)
                    else:
                        character_image_urls.append(image_url)
                    
                    # Map character role to image for later reference
                    character_descriptions_map[assignment.get("characterRoleId")] = {
                        "name": assignment.get("characterName", "Unknown"),
                        "imageUrl": image_url
                    }
            
            if not character_image_urls:
                raise Exception("No character images found. Please ensure all characters have images assigned.")
            
            print(f"📸 Found {len(character_image_urls)} character images")
            
            # Use OpenAI Vision to describe the characters
            print("🔍 Analyzing characters with OpenAI Vision...")
            character_description = self.openai_service.describe_characters_from_images(character_image_urls)
            
            # Get locations/backgrounds
            locations = self.get_story_locations(story_id)
            location_map = {}
            if locations:
                for loc in locations:
                    for scene_num in loc.sceneNumbers:
                        location_map[scene_num] = {
                            "name": loc.name,
                            "description": loc.description,
                            "imageUrl": loc.imageUrl
                        }
            
            # Get story tree nodes
            nodes = story.tree.nodes if story.tree else []
            if not nodes:
                raise Exception("No story nodes found")
            
            # Filter nodes by scene_ids if provided
            if scene_ids:
                nodes = [node for node in nodes if node.id in scene_ids]
            
            print(f"📝 Generating images for {len(nodes)} scenes")
            
            # Generate image for each scene
            generated_scenes = []
            
            for node in nodes:
                try:
                    scene_num = node.sceneNumber
                    location_info = location_map.get(scene_num, {})
                    
                    # Build comprehensive prompt for Gemini
                    prompt = f"""Create a children's storybook illustration for this scene:

CHARACTERS IN THE SCENE:
{character_description}

SCENE DETAILS:
Scene Number: {scene_num}
Scene Text: {node.text}
Location: {location_info.get('name', 'Unknown location')}
Location Description: {location_info.get('description', 'A story setting')}

STYLE REQUIREMENTS:
- Children's storybook illustration style
- Bright, vibrant colors
- Clear, friendly character expressions
- Educational and age-appropriate
- Consistent with the character descriptions above
- Include the location/background described
- Warm, inviting atmosphere

Generate a single illustration that captures this scene with the characters described above in the specified location."""
                    
                    print(f"🎨 Generating scene {scene_num}...")
                    
                    # Generate image with Gemini
                    image_data = self.gemini_service.generate_image(prompt)
                    
                    # Create version ID
                    version_id = str(uuid.uuid4())
                    
                    # Save scene image data
                    scene_data = {
                        "sceneId": node.id,
                        "sceneNumber": scene_num,
                        "imageUrl": image_data,
                        "versionId": version_id,
                        "generatedAt": datetime.now().isoformat(),
                        "prompt": prompt[:500]  # Save truncated prompt for reference
                    }
                    
                    generated_scenes.append(scene_data)
                    
                    print(f"✅ Scene {scene_num} generated successfully")
                    
                except Exception as e:
                    print(f"❌ Error generating scene {scene_num}: {str(e)}")
                    # Continue with other scenes
                    generated_scenes.append({
                        "sceneId": node.id,
                        "sceneNumber": scene_num,
                        "error": str(e),
                        "status": "failed"
                    })
            
            # Create job ID for tracking
            job_id = str(uuid.uuid4())
            
            # Save generation job with results
            self.data_manager.create_scene_generation_job(story_id, job_id, scene_ids)
            
            print(f"✅ Scene generation completed! Generated {len(generated_scenes)} scenes")
            
            return {
                "jobId": job_id,
                "message": "Scene image generation completed",
                "sceneCount": len(generated_scenes),
                "scenes": generated_scenes,
                "characterDescription": character_description[:200] + "..."  # Truncated for response
            }
            
        except Exception as e:
            print(f"❌ Error in generate_all_scene_images: {str(e)}")
            raise Exception(f"Scene generation failed: {str(e)}")
    
    def check_scene_image_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[SceneGenerationStatus]:
        """Check scene image generation status"""
        status_data = self.data_manager.get_scene_generation_status(story_id, job_id)
        if not status_data:
            return None
        
        return SceneGenerationStatus(**status_data)
    
    
    def regenerate_individual_scene_image(self, story_id: str, scene_id: str, additional_prompt: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Regenerate individual scene image"""
        versions_data = self.data_manager.get_scene_image_versions(story_id, scene_id)
        if not versions_data:
            return None
        
        # Generate new version
        version_id = str(uuid.uuid4())
        new_version = {
            "versionId": version_id,
            "imageUrl": f"https://cdn.example.com/scene_{scene_id}_v{len(versions_data['versions']) + 1}.png",
            "createdAt": datetime.now().isoformat()
        }
        
        versions_data["versions"].append(new_version)
        versions_data["currentVersionId"] = version_id
        
        # Save updated versions
        self.data_manager.save_scene_image_versions(story_id, scene_id, versions_data)
        
        return {
            "sceneId": scene_id,
            "versionId": version_id,
            "imageUrl": new_version["imageUrl"],
            "status": "completed"
        }
    
    def select_scene_image_version(self, story_id: str, scene_id: str, version_id: str) -> Optional[Dict[str, Any]]:
        """Select scene image version"""
        versions = self.get_scene_image_version_history(story_id, scene_id)
        if not versions:
            return None
        
        for version in versions["versions"]:
            if version["versionId"] == version_id:
                versions["currentVersionId"] = version_id
                
                # Save updated versions
                self.data_manager.save_scene_image_versions(story_id, scene_id, versions)
                
                return {
                    "sceneId": scene_id,
                    "selectedVersionId": version_id,
                    "imageUrl": version["imageUrl"]
                }
        
        return None
    
    def bulk_regenerate_scene_images(self, story_id: str, scene_ids: List[str]) -> Optional[Dict[str, Any]]:
        """Bulk regenerate scene images"""
        job_id = str(uuid.uuid4())
        
        # Start bulk regeneration job
        self.data_manager.create_scene_regeneration_job(story_id, job_id, scene_ids)
        
        return {
            "jobId": job_id,
            "message": "Regeneration started for {} scenes".format(len(scene_ids)),
            "sceneIds": scene_ids
        }
    
    def complete_story(self, story_id: str, title: str) -> Optional[Dict[str, Any]]:
        """Complete a story"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        story.status = StoryStatus.COMPLETED
        story.updatedAt = datetime.now()
        self.data_manager.save_story(story)
        
        return {
            "storyId": story_id,
            "status": story.status.value,
            "title": title,
            "shareUrl": f"https://app.com/story/{story_id}",
            "completedAt": datetime.now().isoformat()
        }
    
    # ========================================================================
    # Reading Mode
    # ========================================================================
    
    def get_story_for_reading(self, story_id: str) -> Optional[StoryForReading]:
        """Get story formatted for reading"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        # Allow reading draft stories for testing purposes
        # In production, you might want to restrict this to completed stories only
        # if story.status != StoryStatus.COMPLETED:
        #     return None
        
        # Convert nodes to reading format
        reading_nodes = []
        for node in story.tree.nodes:
            reading_node = ReadingNode(
                id=node.id,
                sceneNumber=node.sceneNumber,
                title=node.title,
                text=node.text,
                imageUrl=f"https://cdn.example.com/scene_{node.id}_final.png",
                type=node.type,
                choices=node.choices,
                lessonMessage=node.text if node.type in ["good_ending", "bad_ending"] else None,
                previousNodeId=None  # Would need to calculate this from edges
            )
            reading_nodes.append(reading_node)
        
        return StoryForReading(
            id=story_id,
            title=f"{story.lesson.title()} Story",
            lesson=story.lesson,
            nodes=reading_nodes,
            startNodeId=story.tree.nodes[0].id if story.tree.nodes else None
        )
    
    def save_reading_progress(self, story_id: str, request: ReadingProgressRequest) -> Optional[Dict[str, Any]]:
        """Save reading progress"""
        progress = ReadingProgress(
            storyId=story_id,
            currentNodeId=request.currentNodeId,
            visitedNodeIds=request.visitedNodeIds,
            choicesMade=request.choicesMade,
            lastReadAt=datetime.now()
        )
        
        self.data_manager.save_reading_progress(story_id, progress)
        
        return {
            "storyId": story_id,
            "progressId": str(uuid.uuid4()),
            "savedAt": datetime.now().isoformat()
        }
    
    def get_reading_progress(self, story_id: str) -> Optional[ReadingProgress]:
        """Get reading progress"""
        progress_data = self.data_manager.get_reading_progress(story_id)
        if not progress_data:
            return None
        
        return ReadingProgress(**progress_data)
    
    def record_reading_completion(self, story_id: str, request: ReadingCompletionRequest) -> Optional[Dict[str, Any]]:
        """Record reading completion"""
        self.data_manager.record_reading_completion(story_id, request)
        
        # Get read count
        read_count = self.data_manager.get_story_read_count(story_id)
        
        return {
            "storyId": story_id,
            "completionId": str(uuid.uuid4()),
            "readCount": read_count,
            "congratsMessage": "Congratulations! You made great choices!"
        }
    
    # ========================================================================
    # Story Management
    # ========================================================================
    
    def delete_story(self, story_id: str) -> Optional[Dict[str, Any]]:
        """Delete a story"""
        if self.data_manager.delete_story(story_id):
            return {
                "deletedStoryId": story_id,
                "message": "Story deleted successfully"
            }
        return None
    
    
    
    def generate_share_link(self, story_id: str, expires_in: int = 2592000) -> Optional[ShareLinkResponse]:
        """Generate share link"""
        story = self.data_manager.get_story(story_id)
        if not story:
            return None
        
        short_code = str(uuid.uuid4())[:8]
        expires_at = datetime.now() + timedelta(seconds=expires_in)
        
        share_url = f"https://app.com/shared/{short_code}"
        
        # Save share link
        self.data_manager.save_share_link(story_id, short_code, expires_at)
        
        return ShareLinkResponse(
            shareUrl=share_url,
            shortCode=short_code,
            expiresAt=expires_at
        )
    
