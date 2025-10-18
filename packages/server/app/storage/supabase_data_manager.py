"""
Supabase Data Manager
Handles data storage and retrieval using Supabase PostgreSQL database
"""

import os
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('.env')
from app.models.schemas import Story, StoryStatus, StoryNode, StoryEdge, StoryTree, CharacterRole, Location, Choice


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
                "title": f"{story.lesson} Story",
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
            
            # Second pass: create all choices with proper UUID references
            for node in story.tree.nodes:
                node_uuid = node_id_mapping[node.id]
                
                for i, choice in enumerate(node.choices):
                    choice_uuid = choice.id if choice.id and len(choice.id) == 36 and choice.id.count('-') == 4 else str(uuid.uuid4())
                    choice_id_mapping[choice.id] = choice_uuid
                    
                    # Use mapped UUID for next node
                    next_node_uuid = node_id_mapping.get(choice.nextNodeId) if choice.nextNodeId else None
                    
                    choice_data = {
                        "id": choice_uuid,
                        "node_id": node_uuid,
                        "text": choice.text,
                        "next_node_id": next_node_uuid,
                        "is_correct": choice.isCorrect,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("story_choices").upsert(choice_data).execute()
            
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
                
                self.supabase.table("story_edges").upsert(edge_data).execute()
            
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
                
                # Save location scene numbers
                for scene_num in loc.sceneNumbers:
                    scene_data = {
                        "id": str(uuid.uuid4()),
                        "location_id": loc_uuid,
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("location_scene_numbers").upsert(scene_data).execute()
            
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
                
                for choice_data in choices_result.data:
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
                character = {
                    "id": char_data["id"],
                    "name": char_data["name"],
                    "imageUrl": char_data["image_url"],  # Convert snake_case to camelCase
                    "category": char_data.get("category", "Animal")
                }
                characters.append(character)
            
            return characters
            
        except Exception as e:
            print(f"Error getting preset characters from Supabase: {str(e)}")
            return []
    
    def save_character_assignments(self, story_id: str, assignments: List[Dict[str, Any]]):
        """Save character assignments to Supabase"""
        try:
            for assignment in assignments:
                assignment_data = {
                    "id": f"assignment_{story_id}_{assignment['characterRoleId']}",
                    "story_id": story_id,
                    "character_role_id": assignment["characterRoleId"],
                    "preset_character_id": assignment["presetCharacterId"],
                    "created_at": datetime.now().isoformat()
                }
                
                self.supabase.table("character_assignments").upsert(assignment_data).execute()
                
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
                    "role": char_role["role"],
                    "characterName": preset_char["name"],
                    "imageUrl": preset_char["image_url"]
                }
                assignments.append(assignment_data)
            
            return assignments
            
        except Exception as e:
            print(f"Error getting character assignments from Supabase: {str(e)}")
            return None
    
    # ========================================================================
    # Background Management
    # ========================================================================
    
    def get_story_backgrounds(self, story_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get backgrounds for a story from Supabase"""
        try:
            result = self.supabase.table("backgrounds").select(
                "*, background_versions(*), background_scene_numbers(scene_number)"
            ).eq("story_id", story_id).execute()
            
            if not result.data:
                return None
            
            backgrounds = []
            for bg_data in result.data:
                # Get scene numbers
                scene_numbers = [sn["scene_number"] for sn in bg_data["background_scene_numbers"]]
                
                # Get versions
                versions = []
                for version in bg_data["background_versions"]:
                    version_data = {
                        "versionId": version["version_id"],
                        "imageUrl": version["image_url"],
                        "createdAt": version["created_at"]
                    }
                    versions.append(version_data)
                
                background = {
                    "id": bg_data["id"],
                    "locationId": bg_data["location_id"],
                    "name": bg_data["name"],
                    "description": bg_data["description"],
                    "sceneNumbers": scene_numbers,
                    "imageUrl": bg_data["image_url"],
                    "status": bg_data["status"],
                    "versions": versions
                }
                backgrounds.append(background)
            
            return backgrounds
            
        except Exception as e:
            print(f"Error getting story backgrounds from Supabase: {str(e)}")
            return None
    
    def save_story_backgrounds(self, story_id: str, backgrounds: List[Dict[str, Any]]):
        """Save backgrounds for a story to Supabase"""
        try:
            for bg in backgrounds:
                bg_data = {
                    "id": bg["id"],
                    "story_id": story_id,
                    "location_id": bg["locationId"],
                    "name": bg["name"],
                    "description": bg["description"],
                    "image_url": bg.get("imageUrl"),
                    "status": bg["status"],
                    "selected_version_id": bg.get("selectedVersionId"),
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                self.supabase.table("backgrounds").upsert(bg_data).execute()
                
                # Save versions
                for version in bg.get("versions", []):
                    version_data = {
                        "id": f"bg_version_{bg['id']}_{version['versionId']}",
                        "background_id": bg["id"],
                        "version_id": version["versionId"],
                        "image_url": version["imageUrl"],
                        "created_at": version["createdAt"]
                    }
                    
                    self.supabase.table("background_versions").upsert(version_data).execute()
                
                # Save scene numbers
                for scene_num in bg.get("sceneNumbers", []):
                    scene_data = {
                        "id": f"bg_scene_{bg['id']}_{scene_num}",
                        "background_id": bg["id"],
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    self.supabase.table("background_scene_numbers").upsert(scene_data).execute()
                    
        except Exception as e:
            print(f"Error saving story backgrounds to Supabase: {str(e)}")
    
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
    
    def create_background_generation_job(self, story_id: str, job_id: str, backgrounds: List[Dict[str, str]]):
        """Create background generation job in Supabase"""
        try:
            job_data = {
                "id": job_id,
                "story_id": story_id,
                "job_type": "background_generation",
                "status": "in_progress",
                "job_data": {"backgrounds": backgrounds},
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.supabase.table("generation_jobs").insert(job_data).execute()
            
        except Exception as e:
            print(f"Error creating background generation job in Supabase: {str(e)}")
    
    def get_background_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get background generation status from Supabase"""
        try:
            query = self.supabase.table("generation_jobs").select("*").eq("story_id", story_id).eq("job_type", "background_generation")
            
            if job_id:
                query = query.eq("id", job_id)
            
            result = query.order("created_at", desc=True).limit(1).execute()
            
            if not result.data:
                return None
            
            job_data = result.data[0]
            return {
                "status": job_data["status"],
                "backgrounds": [],  # This would be populated based on actual generation status
                "progress": {
                    "completed": 0,
                    "total": 0
                }
            }
            
        except Exception as e:
            print(f"Error getting background generation status from Supabase: {str(e)}")
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
            for version in versions.get("versions", []):
                version_data = {
                    "id": f"scene_version_{scene_id}_{version['versionId']}",
                    "story_id": story_id,
                    "scene_id": scene_id,
                    "version_id": version["versionId"],
                    "image_url": version["imageUrl"],
                    "is_current": version["versionId"] == versions.get("currentVersionId"),
                    "created_at": version["createdAt"]
                }
                
                self.supabase.table("scene_image_versions").upsert(version_data).execute()
                
        except Exception as e:
            print(f"Error saving scene image versions to Supabase: {str(e)}")
    
    def get_scene_image_versions(self, story_id: str, scene_id: str) -> Optional[Dict[str, Any]]:
        """Get scene image versions from Supabase"""
        try:
            result = self.supabase.table("scene_image_versions").select("*").eq("story_id", story_id).eq("scene_id", scene_id).order("created_at").execute()
            
            if not result.data:
                return None
            
            versions = []
            current_version_id = None
            
            for version_data in result.data:
                version = {
                    "versionId": version_data["version_id"],
                    "imageUrl": version_data["image_url"],
                    "createdAt": version_data["created_at"]
                }
                versions.append(version)
                
                if version_data["is_current"]:
                    current_version_id = version_data["version_id"]
            
            return {
                "sceneId": scene_id,
                "currentVersionId": current_version_id,
                "versions": versions
            }
            
        except Exception as e:
            print(f"Error getting scene image versions from Supabase: {str(e)}")
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
