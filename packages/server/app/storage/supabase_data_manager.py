"""
Supabase Data Manager
Handles data storage and retrieval using Supabase PostgreSQL database
"""

import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from supabase import Client, create_client

# Load environment variables from .env file
load_dotenv('.env')
from app.models.schemas import (CharacterRole, Choice, Location, Story,
                                StoryEdge, StoryNode, StoryStatus, StoryTree)


class SupabaseDataManager:
    """
    Manages data storage for stories, characters, backgrounds, and reading progress
    Uses Supabase PostgreSQL database
    """
    
    def __init__(self):
        """Initialize Supabase client"""
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
    
    # ========================================================================
    # Story Management
    # ========================================================================
    
    def save_story(self, story: Story):
        """Save a story to Supabase"""
        try:
            # Save story
            story_data = {
                "id": story.id,
                "lesson": story.lesson,
                "theme": story.theme,
                "story_format": story.storyFormat,
                "status": story.status.value,
                "title": story.title if story.title else f"{story.lesson} Story",
                "created_at": story.createdAt.isoformat(),
                "updated_at": story.updatedAt.isoformat()
            }
            
            result = self.supabase.table("stories").upsert(story_data).execute()
            
            # Create mapping from original IDs to UUIDs
            node_id_mapping = {}
            choice_id_mapping = {}
            
            # First pass: create all nodes and build ID mapping
            for node in story.tree.nodes:
                # Generate UUID for node if it's not already a UUID
                node_uuid = node.id if len(node.id) == 36 and node.id.count('-') == 4 else str(uuid.uuid4())
                node_id_mapping[node.id] = node_uuid
                
                node_data = {
                    "id": node_uuid,
                    "story_id": story.id,
                    "scene_number": node.sceneNumber,
                    "title": node.title,
                    "text": node.text,
                    "location": node.location,
                    "type": node.type.value,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                self.supabase.table("story_nodes").upsert(node_data).execute()
            
            # Delete existing choices for all nodes in this story
            for node in story.tree.nodes:
                node_uuid = node_id_mapping[node.id]
                self.supabase.table("story_choices").delete().eq("node_id", node_uuid).execute()
            
            # Second pass: create all choices with proper UUID references
            for node in story.tree.nodes:
                node_uuid = node_id_mapping[node.id]
                print(f"Saving choices for node {node.id} (UUID: {node_uuid}): {len(node.choices)} choices", flush=True)
                
                for i, choice in enumerate(node.choices):
                    choice_uuid = choice.id if choice.id and len(choice.id) == 36 and choice.id.count('-') == 4 else str(uuid.uuid4())
                    choice_id_mapping[choice.id] = choice_uuid
                    
                    # Use mapped UUID for next node
                    next_node_uuid = node_id_mapping.get(choice.nextNodeId) if choice.nextNodeId else None
                    
                    print(f"  Saving choice: {choice.text} -> {choice.nextNodeId} (UUID: {next_node_uuid})", flush=True)
                    
                    choice_data = {
                        "id": choice_uuid,
                        "node_id": node_uuid,
                        "text": choice.text,
                        "next_node_id": next_node_uuid,
                        "is_correct": choice.isCorrect,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("story_choices").insert(choice_data).execute()
            
            # Delete existing edges for this story before inserting new ones
            self.supabase.table("story_edges").delete().eq("story_id", story.id).execute()
            
            # Save story edges
            for edge in story.tree.edges:
                edge_data = {
                    "id": str(uuid.uuid4()),
                    "story_id": story.id,
                    "from_node_id": node_id_mapping.get(edge.from_),
                    "to_node_id": node_id_mapping.get(edge.to),
                    "choice_id": choice_id_mapping.get(edge.choiceId),
                    "created_at": datetime.now().isoformat()
                }
                
                self.supabase.table("story_edges").insert(edge_data).execute()
            
            # Save character roles
            for char in story.characters:
                char_uuid = char.id if len(char.id) == 36 and char.id.count('-') == 4 else str(uuid.uuid4())
                char_data = {
                    "id": char_uuid,
                    "story_id": story.id,
                    "role": char.role,
                    "description": char.description,
                    "created_at": datetime.now().isoformat()
                }
                
                self.supabase.table("character_roles").upsert(char_data).execute()
            
            # Save locations
            for loc in story.locations:
                loc_uuid = loc.id if len(loc.id) == 36 and loc.id.count('-') == 4 else str(uuid.uuid4())
                loc_data = {
                    "id": loc_uuid,
                    "story_id": story.id,
                    "name": loc.name,
                    "description": loc.description,
                    "created_at": datetime.now().isoformat()
                }
                
                self.supabase.table("locations").upsert(loc_data).execute()
                
                # Delete existing location scene numbers for this location
                self.supabase.table("location_scene_numbers").delete().eq("location_id", loc_uuid).execute()
                
                # Save location scene numbers
                for scene_num in loc.sceneNumbers:
                    scene_data = {
                        "id": str(uuid.uuid4()),
                        "location_id": loc_uuid,
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("location_scene_numbers").insert(scene_data).execute()
                
                # Also save to backgrounds table for image generation tracking
                background_data = {
                    "id": loc_uuid,
                    "story_id": story.id,
                    "location_id": loc_uuid,
                    "name": loc.name,
                    "description": loc.description,
                    "image_url": None,
                    "status": "pending",
                    "selected_version_id": None,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                self.supabase.table("backgrounds").upsert(background_data).execute()
                
                # Delete existing background scene numbers for this location
                self.supabase.table("background_scene_numbers").delete().eq("background_id", loc_uuid).execute()
                
                # Save background scene numbers
                for scene_num in loc.sceneNumbers:
                    bg_scene_data = {
                        "id": str(uuid.uuid4()),
                        "background_id": loc_uuid,
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("background_scene_numbers").insert(bg_scene_data).execute()
            
        except Exception as e:
            raise Exception(f"Failed to save story to Supabase: {str(e)}")
    
    def get_story(self, story_id: str) -> Optional[Story]:
        """Get a story by ID from Supabase"""
        try:
            # Get story
            story_result = self.supabase.table("stories").select("*").eq("id", story_id).execute()
            if not story_result.data:
                return None
            
            story_data = story_result.data[0]
            
            # Get story nodes
            nodes_result = self.supabase.table("story_nodes").select("*").eq("story_id", story_id).order("scene_number").execute()
            nodes = []
            
            for node_data in nodes_result.data:
                # Get choices for this node
                choices_result = self.supabase.table("story_choices").select("*").eq("node_id", node_data["id"]).execute()
                choices = []
                
                print(f"Loading node {node_data['id']}: Found {len(choices_result.data)} choices", flush=True)
                
                for choice_data in choices_result.data:
                    print(f"  Choice: {choice_data['text']} -> {choice_data['next_node_id']}", flush=True)
                    choice = Choice(
                        id=choice_data["id"],
                        text=choice_data["text"],
                        nextNodeId=choice_data["next_node_id"],
                        isCorrect=choice_data["is_correct"]
                    )
                    choices.append(choice)
                
                node = StoryNode(
                    id=node_data["id"],
                    sceneNumber=node_data["scene_number"],
                    title=node_data["title"],
                    text=node_data["text"],
                    location=node_data["location"],
                    type=node_data["type"],
                    choices=choices
                )
                nodes.append(node)
            
            # Get story edges
            edges_result = self.supabase.table("story_edges").select("*").eq("story_id", story_id).execute()
            edges = []
            
            for edge_data in edges_result.data:
                edge = StoryEdge(
                    **{"from": edge_data["from_node_id"]},
                    to=edge_data["to_node_id"],
                    choiceId=edge_data["choice_id"]
                )
                edges.append(edge)
            
            # Get character roles
            chars_result = self.supabase.table("character_roles").select("*").eq("story_id", story_id).execute()
            characters = []
            
            for char_data in chars_result.data:
                char = CharacterRole(
                    id=char_data["id"],
                    role=char_data["role"],
                    description=char_data["description"]
                )
                characters.append(char)
            
            # Get locations
            locs_result = self.supabase.table("locations").select("*").eq("story_id", story_id).execute()
            locations = []
            
            for loc_data in locs_result.data:
                # Get scene numbers for this location
                scene_nums_result = self.supabase.table("location_scene_numbers").select("scene_number").eq("location_id", loc_data["id"]).execute()
                scene_numbers = [sn["scene_number"] for sn in scene_nums_result.data]
                
                loc = Location(
                    id=loc_data["id"],
                    name=loc_data["name"],
                    sceneNumbers=scene_numbers,
                    description=loc_data["description"]
                )
                locations.append(loc)
            
            # Create story tree
            tree = StoryTree(nodes=nodes, edges=edges)
            
            # Create story object
            story = Story(
                id=story_data["id"],
                lesson=story_data["lesson"],
                theme=story_data["theme"],
                storyFormat=story_data["story_format"],
                status=StoryStatus(story_data["status"]),
                tree=tree,
                characters=characters,
                locations=locations,
                createdAt=datetime.fromisoformat(story_data["created_at"].replace('Z', '+00:00')),
                updatedAt=datetime.fromisoformat(story_data["updated_at"].replace('Z', '+00:00'))
            )
            
            return story
            
        except Exception as e:
            print(f"Error getting story from Supabase: {str(e)}")
            return None
    
    def get_stories_list(self, limit: int, offset: int, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get list of stories with pagination from Supabase"""
        try:
            query = self.supabase.table("stories").select("*")
            
            if status:
                query = query.eq("status", status)
            
            query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
            result = query.execute()
            
            stories = []
            for story_data in result.data:
                # Get read count
                read_count_result = self.supabase.table("reading_completions").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                read_count = read_count_result.count or 0
                
                # Get last read time
                last_read_result = self.supabase.table("reading_completions").select("completed_at").eq("story_id", story_data["id"]).order("completed_at", desc=True).limit(1).execute()
                last_read_at = None
                if last_read_result.data:
                    last_read_at = datetime.fromisoformat(last_read_result.data[0]["completed_at"].replace('Z', '+00:00'))
                
                # Get scene count
                scene_count_result = self.supabase.table("story_nodes").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                scene_count = scene_count_result.count or 0
                
                story = {
                    "id": story_data["id"],
                    "title": story_data["title"] or f"{story_data['lesson']} Story",
                    "lesson": story_data["lesson"],
                    "coverImage": None,
                    "status": story_data["status"],
                    "createdAt": story_data["created_at"],
                    "sceneCount": scene_count,
                    "readCount": read_count,
                    "lastReadAt": last_read_at
                }
                stories.append(story)
            
            return stories
            
        except Exception as e:
            print(f"Error getting stories list from Supabase: {str(e)}")
            return []
    
    def get_stories_count(self, status: Optional[str] = None) -> int:
        """Get total count of stories from Supabase"""
        try:
            query = self.supabase.table("stories").select("id", count="exact")
            
            if status:
                query = query.eq("status", status)
            
            result = query.execute()
            return result.count or 0
            
        except Exception as e:
            print(f"Error getting stories count from Supabase: {str(e)}")
            return 0
    
    def get_all_stories(self, limit: int, offset: int, status: Optional[str] = None, sort_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all stories with pagination and filtering from Supabase"""
        try:
            query = self.supabase.table("stories").select("*")
            
            if status:
                query = query.eq("status", status)
            
            # Apply sorting
            if sort_by == "created_at":
                query = query.order("created_at", desc=True)
            elif sort_by == "updated_at":
                query = query.order("updated_at", desc=True)
            elif sort_by == "title":
                query = query.order("title")
            else:
                # Default sorting by created_at desc
                query = query.order("created_at", desc=True)
            
            # Apply pagination
            query = query.range(offset, offset + limit - 1)
            result = query.execute()
            
            stories = []
            for story_data in result.data:
                # Get read count
                read_count_result = self.supabase.table("reading_completions").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                read_count = read_count_result.count or 0
                
                # Get last read time
                last_read_result = self.supabase.table("reading_completions").select("completed_at").eq("story_id", story_data["id"]).order("completed_at", desc=True).limit(1).execute()
                last_read_at = None
                if last_read_result.data:
                    last_read_at = datetime.fromisoformat(last_read_result.data[0]["completed_at"].replace('Z', '+00:00'))
                
                # Get scene count
                scene_count_result = self.supabase.table("story_nodes").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                scene_count = scene_count_result.count or 0
                
                story = {
                    "id": story_data["id"],
                    "title": story_data["title"] or f"{story_data['lesson']} Story",
                    "lesson": story_data["lesson"],
                    "coverImage": None,
                    "status": story_data["status"],
                    "createdAt": story_data["created_at"],
                    "sceneCount": scene_count,
                    "readCount": read_count,
                    "lastReadAt": last_read_at
                }
                stories.append(story)
            
            return stories
            
        except Exception as e:
            print(f"Error getting all stories from Supabase: {str(e)}")
            return []
    
    def delete_story(self, story_id: str) -> bool:
        """Delete a story from Supabase"""
        try:
            result = self.supabase.table("stories").delete().eq("id", story_id).execute()
            return len(result.data) > 0
            
        except Exception as e:
            print(f"Error deleting story from Supabase: {str(e)}")
            return False
    
    # ========================================================================
    # Character Management
    # ========================================================================
    
    def get_preset_characters(self) -> List[Dict[str, Any]]:
        """Get preset characters from Supabase"""
        try:
            result = self.supabase.table("preset_characters").select("*").execute()
            
            # Transform the data to match the expected format
            characters = []
            for char_data in result.data:
                # Determine gender from ID (f_ = female, m_ = male)
                gender = "Female" if char_data["id"].startswith("f_") else "Male"
                
                character = {
                    "id": char_data["id"],
                    "name": char_data["name"],
                    "imageUrl": char_data["image_url"],  # Convert snake_case to camelCase
                    "category": gender
                }
                characters.append(character)
            
            return characters
            
        except Exception as e:
            print(f"Error getting preset characters from Supabase: {str(e)}")
            return []
    
    def populate_preset_characters(self) -> bool:
        """Populate preset characters table with default characters"""
        try:
            import json
            import os

            # Load preset characters from JSON file
            json_path = os.path.join("data", "characters", "preset_characters.json")
            if not os.path.exists(json_path):
                print(f"Preset characters file not found: {json_path}")
                return False
            
            with open(json_path, 'r') as f:
                characters_data = json.load(f)
            
            # Transform data for Supabase (convert camelCase to snake_case)
            supabase_characters = []
            for char in characters_data:
                supabase_char = {
                    "id": char["id"],
                    "name": char["name"],
                    "image_url": char["imageUrl"]
                }
                supabase_characters.append(supabase_char)
            
            # Insert characters into Supabase (upsert to handle duplicates)
            result = self.supabase.table("preset_characters").upsert(supabase_characters).execute()
            
            print(f"Successfully populated {len(supabase_characters)} preset characters")
            return True
            
        except Exception as e:
            print(f"Error populating preset characters: {str(e)}")
            return False
    
    def save_character_assignments(self, story_id: str, assignments: List[Dict[str, Any]]):
        """Save character assignments to Supabase"""
        try:
            for assignment in assignments:
                assignment_data = {
                    "story_id": story_id,
                    "character_role_id": assignment["characterRoleId"],
                    "preset_character_id": assignment["presetCharacterId"],
                    "created_at": datetime.now().isoformat()
                }
                
                # Use upsert with on_conflict to handle the unique constraint
                self.supabase.table("character_assignments").upsert(
                    assignment_data,
                    on_conflict="story_id,character_role_id"
                ).execute()
                
        except Exception as e:
            print(f"Error saving character assignments to Supabase: {str(e)}")
    
    def get_character_assignments(self, story_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get character assignments from Supabase"""
        try:
            result = self.supabase.table("character_assignments").select(
                "character_role_id, preset_character_id, character_roles(role), preset_characters(name, image_url)"
            ).eq("story_id", story_id).execute()
            
            if not result.data:
                return None
            
            assignments = []
            for assignment in result.data:
                char_role = assignment["character_roles"]
                preset_char = assignment["preset_characters"]
                
                assignment_data = {
                    "characterRoleId": assignment["character_role_id"],
                    "presetCharacterId": assignment["preset_character_id"],
                    "roleName": char_role["role"],
                    "characterName": preset_char["name"],
                    "imageUrl": preset_char["image_url"]
                }
                assignments.append(assignment_data)
            
            return assignments
            
        except Exception as e:
            print(f"Error getting character assignments from Supabase: {str(e)}")
            return None
    
    # ========================================================================
    # Location Image Management
    # ========================================================================
    
    def get_story_locations(self, story_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get locations with background images for a story from Supabase"""
        try:
            # Database tables may still be called "backgrounds" but we treat them as locations
            result = self.supabase.table("backgrounds").select(
                "*, background_versions(*), background_scene_numbers(scene_number)"
            ).eq("story_id", story_id).execute()
            
            if not result.data:
                return None
            
            locations = []
            for loc_data in result.data:
                # Get scene numbers
                scene_numbers = [sn["scene_number"] for sn in loc_data["background_scene_numbers"]]
                
                # Get versions (map to imageVersions for frontend compatibility)
                image_versions = []
                for version in loc_data["background_versions"]:
                    version_data = {
                        "versionId": version["version_id"],
                        "url": version["image_url"],  # Map imageUrl to url
                        "generatedAt": version["created_at"]  # Map createdAt to generatedAt
                    }
                    image_versions.append(version_data)
                
                location = {
                    "id": loc_data["id"],
                    "name": loc_data["name"],
                    "description": loc_data["description"],
                    "sceneNumbers": scene_numbers,
                    "imageUrl": loc_data["image_url"],
                    "generationStatus": loc_data["status"],  # Map status to generationStatus
                    "imageVersions": image_versions,  # Use imageVersions instead of versions
                    "selectedVersionId": loc_data.get("selected_version_id")
                }
                locations.append(location)
            
            return locations
            
        except Exception as e:
            print(f"Error getting story locations from Supabase: {str(e)}")
            return None
    
    def save_story_locations(self, story_id: str, locations: List[Dict[str, Any]]):
        """Save locations with background images for a story to Supabase"""
        try:
            for loc in locations:
                loc_data = {
                    "id": loc["id"],
                    "story_id": story_id,
                    "location_id": loc["id"],
                    "name": loc["name"],
                    "description": loc["description"],
                    "image_url": loc.get("imageUrl"),
                    "status": loc["status"],
                    "selected_version_id": loc.get("selectedVersionId"),
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                self.supabase.table("backgrounds").upsert(loc_data).execute()
                
                # Save versions
                for version in loc.get("versions", []):
                    version_data = {
                        "id": f"bg_version_{loc['id']}_{version['versionId']}",
                        "background_id": loc["id"],
                        "version_id": version["versionId"],
                        "image_url": version["imageUrl"],
                        "created_at": version["createdAt"]
                    }
                    
                    self.supabase.table("background_versions").upsert(version_data).execute()
                
                # Save scene numbers
                for scene_num in loc.get("sceneNumbers", []):
                    scene_data = {
                        "id": f"bg_scene_{loc['id']}_{scene_num}",
                        "background_id": loc["id"],
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("background_scene_numbers").upsert(scene_data).execute()
                    
        except Exception as e:
            print(f"Error saving story locations to Supabase: {str(e)}")
    
    # ========================================================================
    # Reading Progress Management
    # ========================================================================
    
    def save_reading_progress(self, story_id: str, progress: Dict[str, Any]):
        """Save reading progress to Supabase"""
        try:
            progress_data = {
                "id": f"progress_{story_id}",
                "story_id": story_id,
                "current_node_id": progress.get("currentNodeId"),
                "visited_node_ids": progress.get("visitedNodeIds", []),
                "choices_made": progress.get("choicesMade", []),
                "last_read_at": datetime.now().isoformat(),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.supabase.table("reading_progress").upsert(progress_data).execute()
            
        except Exception as e:
            print(f"Error saving reading progress to Supabase: {str(e)}")
    
    def get_reading_progress(self, story_id: str) -> Optional[Dict[str, Any]]:
        """Get reading progress from Supabase"""
        try:
            result = self.supabase.table("reading_progress").select("*").eq("story_id", story_id).execute()
            
            if not result.data:
                return None
            
            progress_data = result.data[0]
            return {
                "storyId": progress_data["story_id"],
                "currentNodeId": progress_data["current_node_id"],
                "visitedNodeIds": progress_data["visited_node_ids"],
                "choicesMade": progress_data["choices_made"],
                "lastReadAt": progress_data["last_read_at"]
            }
            
        except Exception as e:
            print(f"Error getting reading progress from Supabase: {str(e)}")
            return None
    
    def record_reading_completion(self, story_id: str, completion_data: Dict[str, Any]):
        """Record reading completion to Supabase"""
        try:
            completion_record = {
                "id": f"completion_{story_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "story_id": story_id,
                "ending_node_id": completion_data.get("endingNodeId"),
                "ending_type": completion_data.get("endingType"),
                "total_nodes_visited": completion_data.get("totalNodesVisited"),
                "reading_time_seconds": completion_data.get("readingTimeSeconds"),
                "completed_at": datetime.now().isoformat()
            }
            
            self.supabase.table("reading_completions").insert(completion_record).execute()
            
        except Exception as e:
            print(f"Error recording reading completion to Supabase: {str(e)}")
    
    def get_story_read_count(self, story_id: str) -> int:
        """Get read count for a story from Supabase"""
        try:
            result = self.supabase.table("reading_completions").select("id", count="exact").eq("story_id", story_id).execute()
            return result.count or 0
            
        except Exception as e:
            print(f"Error getting story read count from Supabase: {str(e)}")
            return 0
    
    def get_last_read_time(self, story_id: str) -> Optional[datetime]:
        """Get last read time for a story from Supabase"""
        try:
            result = self.supabase.table("reading_completions").select("completed_at").eq("story_id", story_id).order("completed_at", desc=True).limit(1).execute()
            
            if result.data:
                return datetime.fromisoformat(result.data[0]["completed_at"].replace('Z', '+00:00'))
            
            return None
            
        except Exception as e:
            print(f"Error getting last read time from Supabase: {str(e)}")
            return None
    
    # ========================================================================
    # Generation Jobs Management
    # ========================================================================
    
    def create_location_image_generation_job(self, story_id: str, job_id: str, locations: List[Dict[str, str]]):
        """Create location image generation job in Supabase"""
        try:
            job_data = {
                "id": job_id,
                "story_id": story_id,
                "job_type": "location_image_generation",
                "status": "in_progress",
                "job_data": {"locations": locations},
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.supabase.table("generation_jobs").insert(job_data).execute()
            
        except Exception as e:
            print(f"Error creating location image generation job in Supabase: {str(e)}")
    
    def get_location_image_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get location image generation status from Supabase"""
        try:
            query = self.supabase.table("generation_jobs").select("*").eq("story_id", story_id).eq("job_type", "location_image_generation")
            
            if job_id:
                query = query.eq("id", job_id)
            
            result = query.order("created_at", desc=True).limit(1).execute()
            
            if not result.data:
                return None
            
            job_data = result.data[0]
            return {
                "status": job_data["status"],
                "locations": [],  # This would be populated based on actual generation status
                "progress": {
                    "completed": 0,
                    "total": 0
                }
            }
            
        except Exception as e:
            print(f"Error getting location image generation status from Supabase: {str(e)}")
            return None
    
    def create_scene_generation_job(self, story_id: str, job_id: str, scene_ids: Optional[List[str]] = None):
        """Create scene generation job in Supabase"""
        try:
            job_data = {
                "id": job_id,
                "story_id": story_id,
                "job_type": "scene_generation",
                "status": "in_progress",
                "job_data": {"sceneIds": scene_ids or []},
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.supabase.table("generation_jobs").insert(job_data).execute()
            
        except Exception as e:
            print(f"Error creating scene generation job in Supabase: {str(e)}")
    
    def get_scene_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get scene generation status from Supabase"""
        try:
            query = self.supabase.table("generation_jobs").select("*").eq("story_id", story_id).eq("job_type", "scene_generation")
            
            if job_id:
                query = query.eq("id", job_id)
            
            result = query.order("created_at", desc=True).limit(1).execute()
            
            if not result.data:
                return None
            
            job_data = result.data[0]
            return {
                "status": job_data["status"],
                "scenes": [],  # This would be populated based on actual generation status
                "progress": {
                    "completed": 0,
                    "total": 0
                }
            }
            
        except Exception as e:
            print(f"Error getting scene generation status from Supabase: {str(e)}")
            return None
    
    # ========================================================================
    # Scene Image Versions Management
    # ========================================================================
    
    def save_scene_image_versions(self, story_id: str, scene_id: str, versions: Dict[str, Any]):
        """Save scene image versions to Supabase"""
        try:
            print(f"💾 save_scene_image_versions called:", flush=True)
            print(f"   story_id: {story_id}", flush=True)
            print(f"   scene_id: {scene_id}", flush=True)
            print(f"   versions: {versions}", flush=True)
            
            for version in versions.get("versions", []):
                version_data = {
                    "id": str(uuid.uuid4()),  # Generate a proper UUID
                    "story_id": story_id,
                    "scene_id": scene_id,
                    "version_id": version["versionId"],
                    "image_url": version["imageUrl"],
                    "audio_url": version.get("audioUrl"),  # Add audio URL support
                    "is_current": version["versionId"] == versions.get("currentVersionId"),
                    "created_at": version["createdAt"]
                }
                
                print(f"   Upserting version data: {version_data}", flush=True)
                result = self.supabase.table("scene_image_versions").upsert(version_data).execute()
                print(f"   ✅ Upsert result: {result}", flush=True)
                
        except Exception as e:
            print(f"❌ Error saving scene image versions to Supabase: {str(e)}", flush=True)
            import traceback
            traceback.print_exc()
    
    def get_scene_image_versions(self, story_id: str, scene_id: str) -> Optional[Dict[str, Any]]:
        """Get scene image versions from Supabase"""
        try:
            print(f"🔍 Querying scene_image_versions for story_id={story_id}, scene_id={scene_id}", flush=True)
            result = self.supabase.table("scene_image_versions").select("*").eq("story_id", story_id).eq("scene_id", scene_id).order("created_at").execute()
            
            print(f"   Query result: {len(result.data) if result.data else 0} rows found", flush=True)
            
            if not result.data:
                return None
            
            versions = []
            current_version_id = None
            
            for version_data in result.data:
                version = {
                    "versionId": version_data["version_id"],
                    "imageUrl": version_data["image_url"],
                    "audioUrl": version_data.get("audio_url"),  # Add audio URL support
                    "createdAt": version_data["created_at"]
                }
                versions.append(version)
                print(f"   Found version: {version_data['version_id']} - {version_data['image_url']}", flush=True)
                if version_data.get("audio_url"):
                    print(f"   Audio URL: {version_data['audio_url']}", flush=True)
                
                if version_data["is_current"]:
                    current_version_id = version_data["version_id"]
            
            return {
                "sceneId": scene_id,
                "currentVersionId": current_version_id,
                "versions": versions
            }
            
        except Exception as e:
            print(f"❌ Error getting scene image versions from Supabase: {str(e)}", flush=True)
            import traceback
            traceback.print_exc()
            return None
    
    # ========================================================================
    # Share Links Management
    # ========================================================================
    
    def save_share_link(self, story_id: str, short_code: str, expires_at: datetime):
        """Save share link to Supabase"""
        try:
            share_data = {
                "id": f"share_{short_code}",
                "story_id": story_id,
                "short_code": short_code,
                "expires_at": expires_at.isoformat(),
                "created_at": datetime.now().isoformat()
            }
            
            self.supabase.table("share_links").upsert(share_data).execute()
            
        except Exception as e:
            print(f"Error saving share link to Supabase: {str(e)}")
    
    def get_share_link(self, short_code: str) -> Optional[Dict[str, Any]]:
        """Get share link by short code from Supabase"""
        try:
            result = self.supabase.table("share_links").select("*").eq("short_code", short_code).execute()
            
            if not result.data:
                return None
            
            share_data = result.data[0]
            return {
                "storyId": share_data["story_id"],
                "shortCode": share_data["short_code"],
                "expiresAt": share_data["expires_at"],
                "createdAt": share_data["created_at"]
            }
            
        except Exception as e:
            print(f"Error getting share link from Supabase: {str(e)}")
            return None
    
    # ========================================================================
    # Statistics
    # ========================================================================
    
    def get_story_statistics(self, story_id: str) -> Optional[Dict[str, Any]]:
        """Get story statistics from Supabase"""
        try:
            # Get total reads
            reads_result = self.supabase.table("reading_completions").select("id", count="exact").eq("story_id", story_id).execute()
            total_reads = reads_result.count or 0
            
            # Get unique readers
            unique_readers_result = self.supabase.table("reading_completions").select("reader_id").eq("story_id", story_id).execute()
            unique_readers = len(set(completion.get("reader_id", "anonymous") for completion in unique_readers_result.data))
            
            # Get average reading time
            reading_times_result = self.supabase.table("reading_completions").select("reading_time_seconds").eq("story_id", story_id).execute()
            reading_times = [completion["reading_time_seconds"] for completion in reading_times_result.data if completion["reading_time_seconds"]]
            average_reading_time = sum(reading_times) / len(reading_times) if reading_times else 0
            
            # Mock choice distribution and most visited scenes
            choice_distribution = [
                {
                    "nodeId": "node_1",
                    "choices": [
                        {
                            "choiceId": "choice_1",
                            "text": "Help a friend",
                            "selectedCount": max(1, total_reads - 2)
                        },
                        {
                            "choiceId": "choice_2",
                            "text": "Ignore friend",
                            "selectedCount": min(2, total_reads)
                        }
                    ]
                }
            ]
            
            most_visited_scenes = [
                {
                    "nodeId": "node_1",
                    "sceneNumber": 1,
                    "visitCount": total_reads
                }
            ]
            
            return {
                "storyId": story_id,
                "totalReads": total_reads,
                "uniqueReaders": unique_readers,
                "averageReadingTime": int(average_reading_time),
                "completionRate": 75,  # Mock value
                "choiceDistribution": choice_distribution,
                "mostVisitedScenes": most_visited_scenes
            }
            
        except Exception as e:
            print(f"Error getting story statistics from Supabase: {str(e)}")
            return None
    
    def get_completed_stories(self, limit: int, offset: int, sort_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get completed stories with pagination and sorting from Supabase"""
        try:
            query = self.supabase.table("stories").select("*").eq("status", "completed")
            
            # Apply sorting
            if sort_by == "created_at":
                query = query.order("created_at", desc=True)
            elif sort_by == "updated_at":
                query = query.order("updated_at", desc=True)
            elif sort_by == "title":
                query = query.order("title")
            else:
                # Default sorting by created_at desc
                query = query.order("created_at", desc=True)
            
            # Apply pagination
            query = query.range(offset, offset + limit - 1)
            result = query.execute()
            
            stories = []
            for story_data in result.data:
                # Get read count
                read_count_result = self.supabase.table("reading_completions").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                read_count = read_count_result.count or 0
                
                # Get last read time
                last_read_result = self.supabase.table("reading_completions").select("completed_at").eq("story_id", story_data["id"]).order("completed_at", desc=True).limit(1).execute()
                last_read_at = None
                if last_read_result.data:
                    last_read_at = datetime.fromisoformat(last_read_result.data[0]["completed_at"].replace('Z', '+00:00'))
                
                # Get scene count
                scene_count_result = self.supabase.table("story_nodes").select("id", count="exact").eq("story_id", story_data["id"]).execute()
                scene_count = scene_count_result.count or 0
                
                story = {
                    "id": story_data["id"],
                    "title": story_data["title"] or f"{story_data['lesson']} Story",
                    "lesson": story_data["lesson"],
                    "coverImage": None,
                    "status": story_data["status"],
                    "createdAt": story_data["created_at"],
                    "sceneCount": scene_count,
                    "readCount": read_count,
                    "lastReadAt": last_read_at
                }
                stories.append(story)
            
            return stories
            
        except Exception as e:
            print(f"Error getting completed stories from Supabase: {str(e)}")
            return []
    
    def create_scene_regeneration_job(self, story_id: str, job_id: str, scene_ids: Optional[List[str]] = None):
        """Create scene regeneration job in Supabase"""
        try:
            job_data = {
                "id": job_id,
                "story_id": story_id,
                "job_type": "scene_regeneration",
                "status": "in_progress",
                "job_data": {"sceneIds": scene_ids or []},
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.supabase.table("generation_jobs").insert(job_data).execute()
            
        except Exception as e:
            print(f"Error creating scene regeneration job in Supabase: {str(e)}")
    
    def update_location_image(self, location_data: Dict[str, Any]):
        """Update a location's image in Supabase (stored in backgrounds table)"""
        try:
            self.supabase.table("backgrounds").upsert(location_data).execute()
            print(f"✅ Location image updated in database: {location_data['id']}")
        except Exception as e:
            print(f"❌ Error updating location image in Supabase: {str(e)}")
            raise e
    
    def save_location(self, location_data: Dict[str, Any]):
        """Save a single location to Supabase"""
        try:
            # For now, locations with images are stored in backgrounds table
            # This maintains database compatibility
            self.supabase.table("backgrounds").insert(location_data).execute()
            print(f"✅ Location saved to database: {location_data['id']}")
        except Exception as e:
            print(f"❌ Error saving location to Supabase: {str(e)}")
            raise e
    
    def upload_image_to_storage(self, image_url: str, filename: str) -> Optional[str]:
        """Download image from URL and upload to Supabase storage"""
        try:
            from io import BytesIO

            import requests

            # Download the image from the URL
            print(f"📥 Downloading image from: {image_url}")
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Upload to Supabase storage
            print(f"📤 Uploading image to Supabase storage: {filename}")
            result = self.supabase.storage.from_("frame-fable").upload(
                filename,
                response.content,
                file_options={"content-type": "image/jpeg"}
            )
            
            if result:
                # Get the public URL
                public_url = self.supabase.storage.from_("frame-fable").get_public_url(filename)
                print(f"✅ Image uploaded successfully: {public_url}")
                return public_url
            else:
                print("❌ Failed to upload image to Supabase storage")
                return None
                
        except requests.RequestException as e:
            print(f"❌ Error downloading image: {str(e)}")
            return None
        except Exception as e:
            print(f"❌ Error uploading image to Supabase storage: {str(e)}")
            # Check if it's an RLS policy error
            if "row-level security policy" in str(e).lower():
                print("💡 This appears to be a Row Level Security (RLS) policy issue.")
                print("💡 You may need to configure RLS policies for the 'frame-fable' storage bucket.")
            return None
    
    def upload_base64_image_to_storage(self, base64_data: str, filename: str) -> Optional[str]:
        """Upload base64 encoded image to Supabase storage"""
        try:
            import base64

            # Remove data URI prefix if present
            if base64_data.startswith('data:'):
                base64_data = base64_data.split(',')[1]
            
            # Decode base64 to binary
            image_bytes = base64.b64decode(base64_data)
            
            # Upload to Supabase storage
            print(f"📤 Uploading base64 image to Supabase storage: {filename}")
            result = self.supabase.storage.from_("frame-fable").upload(
                filename,
                image_bytes,
                file_options={"content-type": "image/png"}
            )
            
            if result:
                # Get the public URL
                public_url = self.supabase.storage.from_("frame-fable").get_public_url(filename)
                print(f"✅ Base64 image uploaded successfully: {public_url}")
                return public_url
            else:
                print("❌ Failed to upload base64 image to Supabase storage")
                return None
                
        except Exception as e:
            print(f"❌ Error uploading base64 image to Supabase storage: {str(e)}")
            # Check if it's an RLS policy error
            if "row-level security policy" in str(e).lower():
                print("💡 This appears to be a Row Level Security (RLS) policy issue.")
                print("💡 You may need to configure RLS policies for the 'frame-fable' storage bucket.")
            return None
    
    def upload_audio_to_storage(self, audio_bytes: bytes, filename: str) -> Optional[str]:
        """Upload audio bytes to Supabase storage"""
        try:
            # Upload to Supabase storage
            print(f"📤 Uploading audio to Supabase storage: {filename}")
            result = self.supabase.storage.from_("frame-fable").upload(
                filename,
                audio_bytes,
                file_options={"content-type": "audio/mpeg"}
            )
            
            if result:
                # Get the public URL
                public_url = self.supabase.storage.from_("frame-fable").get_public_url(filename)
                print(f"✅ Audio uploaded successfully: {public_url}")
                return public_url
            else:
                print("❌ Failed to upload audio to Supabase storage")
                return None
                
        except Exception as e:
            print(f"❌ Error uploading audio to Supabase storage: {str(e)}")
            # Check if it's an RLS policy error
            if "row-level security policy" in str(e).lower():
                print("💡 This appears to be a Row Level Security (RLS) policy issue.")
                print("💡 You may need to configure RLS policies for the 'frame-fable' storage bucket.")
            return None