"""
Story Service
Main business logic for story creation, management, and reading workflow
"""

import uuid
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

from app.storage.supabase_data_manager import SupabaseDataManager
from app.models.schemas import (
    Story, StoryNode, StoryEdge, StoryTree, StoryStatus, NodeType,
    CharacterRole, Location, PresetCharacter, CharacterAssignment,
    Background, BackgroundVersion, GenerationStatus,
    StoryListItem, StoryListResponse, StoryForReading, ReadingNode,
    ReadingProgress, ReadingProgressRequest, ReadingCompletionRequest,
    ShareLinkResponse,
    SceneGenerationStatus, BackgroundGenerationStatus
)
from external_services import OpenAIService, FALAIService
from master_prompts import (
    STORY_GENERATION_SYSTEM_PROMPT,
    STORY_GENERATION_USER_PROMPT_TEMPLATE,
)


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
    
    def generate_story(self, lesson: str, theme: str, story_format: str, character_count: int = 4) -> Dict[str, Any]:
        """Generate a new story with AI"""
        story_id = str(uuid.uuid4())
        
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
            
            # Convert the response to our schema objects
            from app.models.schemas import StoryNode, StoryEdge, StoryTree, CharacterRole, Location, Choice
            
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
                "tree": tree.model_dump(),
                "characters": [char.model_dump() for char in characters],
                "locations": [loc.model_dump() for loc in locations]
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
    # Background Management
    # ========================================================================
    
    def get_story_backgrounds(self, story_id: str) -> Optional[List[Background]]:
        """Get backgrounds for a story"""
        backgrounds_data = self.data_manager.get_story_backgrounds(story_id)
        if backgrounds_data is None:
            return None
        
        return [Background(**bg) for bg in backgrounds_data]
    
    def update_background_description(self, story_id: str, background_id: str, request) -> Optional[Background]:
        """Update background description"""
        backgrounds = self.get_story_backgrounds(story_id)
        if not backgrounds:
            return None
        
        for background in backgrounds:
            if background.id == background_id:
                if request.name:
                    background.name = request.name
                if request.description:
                    background.description = request.description
                
                # Save updated background
                self.data_manager.save_story_backgrounds(story_id, [bg.model_dump() for bg in backgrounds])
                return background
        
        return None
    
    def generate_all_backgrounds(self, story_id: str, backgrounds) -> Optional[str]:
        """Generate background image using FAL.ai and return URL"""
        try:
            story = self.data_manager.get_story(story_id)
            if not story:
                raise Exception("Story not found")
            
            # For now, we'll generate the first background's image
            # In the future, you might want to handle multiple backgrounds
            if not backgrounds or len(backgrounds) == 0:
                raise Exception("No backgrounds provided")
            
            first_background = backgrounds[0]
            description = first_background.description
            
            # Generate image using FAL.ai
            fal_image_url = self.fal_ai_service.generate_image(
                prompt=description,
                width=1024,
                height=768
            )
            
            if not fal_image_url:
                raise Exception("Failed to generate image from FAL.ai")
            
            # Download and upload to Supabase storage
            filename = f"backgrounds/{story_id}_{first_background.backgroundId}_{str(uuid.uuid4())[:8]}.jpg"
            supabase_url = self.data_manager.upload_image_to_storage(fal_image_url, filename)
            
            # Use Supabase URL if available, otherwise use FAL.ai URL
            final_url = supabase_url if supabase_url else fal_image_url
            
            # Get the first available location for this story
            location_id = None
            if story.locations and len(story.locations) > 0:
                location_id = story.locations[0].id
            else:
                # If no locations exist, create a default one
                location_id = str(uuid.uuid4())
                location_data = {
                    "id": location_id,
                    "story_id": story_id,
                    "name": "Generated Location",
                    "description": "Auto-generated location for background",
                    "created_at": datetime.now().isoformat()
                }
                self.data_manager.save_location(location_data)
            
            # Save the background to the database
            background_data = {
                "id": str(uuid.uuid4()),
                "story_id": story_id,
                "location_id": location_id,
                "name": f"Background for {first_background.backgroundId}",
                "description": description,
                "image_url": final_url,
                "status": "completed",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Save to database
            self.data_manager.save_background(background_data)
            
            if supabase_url:
                print(f"✅ Image uploaded to Supabase storage: {supabase_url}")
            else:
                print("⚠️ Supabase storage upload failed, using FAL.ai URL")
            
            return final_url
            
        except Exception as e:
            print(f"Error in generate_all_backgrounds: {str(e)}")
            raise Exception(f"Background generation failed: {str(e)}")
    
    def check_background_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[BackgroundGenerationStatus]:
        """Check background generation status"""
        status_data = self.data_manager.get_background_generation_status(story_id, job_id)
        if not status_data:
            return None
        
        return BackgroundGenerationStatus(**status_data)
    
    def regenerate_individual_background(self, story_id: str, background_id: str, description: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Regenerate individual background using FAL.ai"""
        backgrounds = self.get_story_backgrounds(story_id)
        if not backgrounds:
            return None
        
        for background in backgrounds:
            if background.id == background_id:
                try:
                    # Use provided description or existing description
                    prompt = description if description else background.description
                    
                    # Generate new image using FAL.ai
                    image_url = self.fal_ai_service.generate_image(
                        prompt=prompt,
                        width=1024,
                        height=768
                    )
                    
                    # Create new version
                    version_id = str(uuid.uuid4())
                    new_version = BackgroundVersion(
                        versionId=version_id,
                        imageUrl=image_url,
                        createdAt=datetime.now()
                    )
                    
                    background.versions.append(new_version)
                    background.imageUrl = image_url
                    background.status = GenerationStatus.COMPLETED
                    
                    # Update description if provided
                    if description:
                        background.description = description
                    
                    # Save updated background
                    self.data_manager.save_story_backgrounds(story_id, [bg.model_dump() for bg in backgrounds])
                    
                    return {
                        "backgroundId": background_id,
                        "versionId": version_id,
                        "imageUrl": image_url,
                        "status": "completed"
                    }
                    
                except Exception as e:
                    print(f"Error regenerating background {background_id}: {str(e)}")
                    background.status = GenerationStatus.FAILED
                    self.data_manager.save_story_backgrounds(story_id, [bg.model_dump() for bg in backgrounds])
                    
                    return {
                        "backgroundId": background_id,
                        "error": str(e),
                        "status": "failed"
                    }
        
        return None
    
    def select_background_version(self, story_id: str, background_id: str, version_id: str) -> Optional[Dict[str, Any]]:
        """Select background version"""
        backgrounds = self.get_story_backgrounds(story_id)
        if not backgrounds:
            return None
        
        for background in backgrounds:
            if background.id == background_id:
                for version in background.versions:
                    if version.versionId == version_id:
                        background.selectedVersionId = version_id
                        background.imageUrl = version.imageUrl
                        
                        # Save updated background
                        self.data_manager.save_story_backgrounds(story_id, [bg.model_dump() for bg in backgrounds])
                        
                        return {
                            "backgroundId": background_id,
                            "selectedVersionId": version_id,
                            "imageUrl": version.imageUrl
                        }
        
        return None
    
    # ========================================================================
    # Scene Image Management
    # ========================================================================
    
    def generate_all_scene_images(self, story_id: str, scene_ids: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """Generate all scene images"""
        job_id = str(uuid.uuid4())
        
        # Start scene generation job
        self.data_manager.create_scene_generation_job(story_id, job_id, scene_ids)
        
        return {
            "jobId": job_id,
            "message": "Scene image generation started",
            "sceneCount": len(scene_ids) if scene_ids else 0
        }
    
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
    
