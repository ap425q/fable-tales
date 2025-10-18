"""
Story Data Manager
Handles data storage and retrieval for story-based system
"""

import json
import os
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime

from app.models.schemas import Story, StoryStatus


class StoryDataManager:
    """
    Manages data storage for stories, characters, backgrounds, and reading progress
    Uses JSON files for storage (can be migrated to database later)
    """
    
    def __init__(self, data_path: str = "data"):
        """Initialize data manager"""
        self.data_path = data_path
        self.stories_path = os.path.join(data_path, "stories")
        self.characters_path = os.path.join(data_path, "characters")
        self.backgrounds_path = os.path.join(data_path, "backgrounds")
        self.scenes_path = os.path.join(data_path, "scenes")
        self.reading_path = os.path.join(data_path, "reading")
        self.jobs_path = os.path.join(data_path, "jobs")
        self.share_path = os.path.join(data_path, "share")
        
        # Create directories if they don't exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Ensure all required directories exist"""
        directories = [
            self.data_path,
            self.stories_path,
            self.characters_path,
            self.backgrounds_path,
            self.scenes_path,
            self.reading_path,
            self.jobs_path,
            self.share_path
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    # ========================================================================
    # Story Management
    # ========================================================================
    
    def save_story(self, story: Story):
        """Save a story to storage"""
        story_file = os.path.join(self.stories_path, f"{story.id}.json")
        with open(story_file, 'w') as f:
            json.dump(story.model_dump(), f, indent=2, default=str)
    
    def get_story(self, story_id: str) -> Optional[Story]:
        """Get a story by ID"""
        story_file = os.path.join(self.stories_path, f"{story_id}.json")
        if not os.path.exists(story_file):
            return None
        
        try:
            with open(story_file, 'r') as f:
                story_data = json.load(f)
            
            # Convert datetime strings to datetime objects
            if 'createdAt' in story_data:
                story_data['createdAt'] = datetime.fromisoformat(story_data['createdAt'].replace(' ', 'T'))
            if 'updatedAt' in story_data:
                story_data['updatedAt'] = datetime.fromisoformat(story_data['updatedAt'].replace(' ', 'T'))
            
            # Fix edge field mapping from 'from_' to 'from'
            if 'tree' in story_data and 'edges' in story_data['tree']:
                for edge in story_data['tree']['edges']:
                    if 'from_' in edge:
                        edge['from'] = edge.pop('from_')
            
            return Story(**story_data)
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error parsing story {story_id}: {e}")
            return None
    
    def get_stories_list(self, limit: int, offset: int, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get list of stories with pagination"""
        stories = []
        
        # Get all story files
        story_files = [f for f in os.listdir(self.stories_path) if f.endswith('.json')]
        story_files.sort(key=lambda x: os.path.getmtime(os.path.join(self.stories_path, x)), reverse=True)
        
        for story_file in story_files[offset:offset + limit]:
            story_id = story_file[:-5]  # Remove .json extension
            story = self.get_story(story_id)
            if story and (status is None or story.status.value == status):
                stories.append({
                    "id": story.id,
                    "title": f"{story.lesson} Story",
                    "lesson": story.lesson,
                    "coverImage": None,
                    "status": story.status.value,
                    "createdAt": story.createdAt.isoformat(),
                    "sceneCount": len(story.tree.nodes),
                    "readCount": self.get_story_read_count(story_id) or 0,
                    "lastReadAt": self.get_last_read_time(story_id)
                })
        
        return stories
    
    def get_completed_stories(self, limit: int, offset: int, sort_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get completed stories for child mode"""
        return self.get_stories_list(limit, offset, "completed")
    
    def get_all_stories(self, limit: int, offset: int, status: Optional[str] = None, sort_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all stories with detailed information"""
        return self.get_stories_list(limit, offset, status)
    
    def get_stories_count(self, status: Optional[str] = None) -> int:
        """Get total count of stories"""
        story_files = [f for f in os.listdir(self.stories_path) if f.endswith('.json')]
        
        if status is None:
            return len(story_files)
        
        count = 0
        for story_file in story_files:
            story_id = story_file[:-5]
            story = self.get_story(story_id)
            if story and story.status.value == status:
                count += 1
        
        return count
    
    def delete_story(self, story_id: str) -> bool:
        """Delete a story"""
        story_file = os.path.join(self.stories_path, f"{story_id}.json")
        if os.path.exists(story_file):
            os.remove(story_file)
            return True
        return False
    
    def get_story_read_count(self, story_id: str) -> int:
        """Get read count for a story"""
        reading_file = os.path.join(self.reading_path, f"{story_id}_completions.json")
        if os.path.exists(reading_file):
            try:
                with open(reading_file, 'r') as f:
                    completions = json.load(f)
                return len(completions)
            except (json.JSONDecodeError, KeyError):
                pass
        return 0
    
    def get_last_read_time(self, story_id: str) -> Optional[datetime]:
        """Get last read time for a story"""
        reading_file = os.path.join(self.reading_path, f"{story_id}_completions.json")
        if os.path.exists(reading_file):
            try:
                with open(reading_file, 'r') as f:
                    completions = json.load(f)
                if completions:
                    # Get the most recent completion
                    latest = max(completions, key=lambda x: x.get('completedAt', ''))
                    return datetime.fromisoformat(latest['completedAt'])
            except (json.JSONDecodeError, KeyError, ValueError):
                pass
        return None
    
    # ========================================================================
    # Character Management
    # ========================================================================
    
    def preset_characters_exist(self) -> bool:
        """Check if preset characters file exists"""
        preset_file = os.path.join(self.characters_path, "preset_characters.json")
        return os.path.exists(preset_file)
    
    def save_preset_characters(self, characters: List[Dict[str, Any]]):
        """Save preset characters"""
        preset_file = os.path.join(self.characters_path, "preset_characters.json")
        with open(preset_file, 'w') as f:
            json.dump(characters, f, indent=2)
    
    def get_preset_characters(self) -> List[Dict[str, Any]]:
        """Get preset characters"""
        preset_file = os.path.join(self.characters_path, "preset_characters.json")
        if not os.path.exists(preset_file):
            return []
        
        try:
            with open(preset_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return []
    
    def save_character_assignments(self, story_id: str, assignments: List[Dict[str, Any]]):
        """Save character assignments for a story"""
        assignments_file = os.path.join(self.characters_path, f"{story_id}_assignments.json")
        with open(assignments_file, 'w') as f:
            json.dump(assignments, f, indent=2, default=str)
    
    def get_character_assignments(self, story_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get character assignments for a story"""
        assignments_file = os.path.join(self.characters_path, f"{story_id}_assignments.json")
        if not os.path.exists(assignments_file):
            return None
        
        try:
            with open(assignments_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return None
    
    # ========================================================================
    # Background Management
    # ========================================================================
    
    def save_story_backgrounds(self, story_id: str, backgrounds: List[Dict[str, Any]]):
        """Save backgrounds for a story"""
        backgrounds_file = os.path.join(self.backgrounds_path, f"{story_id}_backgrounds.json")
        with open(backgrounds_file, 'w') as f:
            json.dump(backgrounds, f, indent=2, default=str)
    
    def get_story_backgrounds(self, story_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get backgrounds for a story"""
        backgrounds_file = os.path.join(self.backgrounds_path, f"{story_id}_backgrounds.json")
        if not os.path.exists(backgrounds_file):
            return None
        
        try:
            with open(backgrounds_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return None
    
    def create_background_generation_job(self, story_id: str, job_id: str, backgrounds: List[Dict[str, str]]):
        """Create background generation job"""
        job_data = {
            "jobId": job_id,
            "storyId": story_id,
            "type": "background_generation",
            "backgrounds": backgrounds,
            "status": "in_progress",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        job_file = os.path.join(self.jobs_path, f"{job_id}.json")
        with open(job_file, 'w') as f:
            json.dump(job_data, f, indent=2)
    
    def get_background_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get background generation status"""
        if job_id:
            job_file = os.path.join(self.jobs_path, f"{job_id}.json")
            if os.path.exists(job_file):
                try:
                    with open(job_file, 'r') as f:
                        job_data = json.load(f)
                    return job_data
                except (json.JSONDecodeError, KeyError):
                    pass
        
        # Return mock status for now
        return {
            "status": "completed",
            "backgrounds": [
                {
                    "backgroundId": "bg_1",
                    "status": "completed",
                    "imageUrl": "https://cdn.example.com/bg_forest_v1.png",
                    "versionId": "bg_1_v1"
                }
            ],
            "progress": {
                "completed": 1,
                "total": 1
            }
        }
    
    # ========================================================================
    # Scene Management
    # ========================================================================
    
    def create_scene_generation_job(self, story_id: str, job_id: str, scene_ids: Optional[List[str]] = None):
        """Create scene generation job"""
        job_data = {
            "jobId": job_id,
            "storyId": story_id,
            "type": "scene_generation",
            "sceneIds": scene_ids or [],
            "status": "in_progress",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        job_file = os.path.join(self.jobs_path, f"{job_id}.json")
        with open(job_file, 'w') as f:
            json.dump(job_data, f, indent=2)
    
    def get_scene_generation_status(self, story_id: str, job_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get scene generation status"""
        if job_id:
            job_file = os.path.join(self.jobs_path, f"{job_id}.json")
            if os.path.exists(job_file):
                try:
                    with open(job_file, 'r') as f:
                        job_data = json.load(f)
                    return job_data
                except (json.JSONDecodeError, KeyError):
                    pass
        
        # Return mock status for now
        return {
            "status": "completed",
            "scenes": [
                {
                    "sceneId": "node_1",
                    "sceneNumber": 1,
                    "status": "completed",
                    "currentImageUrl": "https://cdn.example.com/scene_1_v1.png",
                    "currentVersionId": "scene_1_v1"
                }
            ],
            "progress": {
                "completed": 1,
                "total": 1
            }
        }
    
    def create_scene_regeneration_job(self, story_id: str, job_id: str, scene_ids: List[str]):
        """Create scene regeneration job"""
        job_data = {
            "jobId": job_id,
            "storyId": story_id,
            "type": "scene_regeneration",
            "sceneIds": scene_ids,
            "status": "in_progress",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        job_file = os.path.join(self.jobs_path, f"{job_id}.json")
        with open(job_file, 'w') as f:
            json.dump(job_data, f, indent=2)
    
    def save_scene_image_versions(self, story_id: str, scene_id: str, versions: Dict[str, Any]):
        """Save scene image versions"""
        versions_file = os.path.join(self.scenes_path, f"{story_id}_{scene_id}_versions.json")
        with open(versions_file, 'w') as f:
            json.dump(versions, f, indent=2)
    
    def get_scene_image_versions(self, story_id: str, scene_id: str) -> Optional[Dict[str, Any]]:
        """Get scene image versions"""
        versions_file = os.path.join(self.scenes_path, f"{story_id}_{scene_id}_versions.json")
        if not os.path.exists(versions_file):
            return None
        
        try:
            with open(versions_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return None
    
    # ========================================================================
    # Reading Progress Management
    # ========================================================================
    
    def save_reading_progress(self, story_id: str, progress: Dict[str, Any]):
        """Save reading progress"""
        progress_file = os.path.join(self.reading_path, f"{story_id}_progress.json")
        with open(progress_file, 'w') as f:
            json.dump(progress.model_dump(), f, indent=2, default=str)
    
    def get_reading_progress(self, story_id: str) -> Optional[Dict[str, Any]]:
        """Get reading progress"""
        progress_file = os.path.join(self.reading_path, f"{story_id}_progress.json")
        if not os.path.exists(progress_file):
            return None
        
        try:
            with open(progress_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return None
    
    def record_reading_completion(self, story_id: str, completion_data: Dict[str, Any]):
        """Record reading completion"""
        completions_file = os.path.join(self.reading_path, f"{story_id}_completions.json")
        
        completions = []
        if os.path.exists(completions_file):
            try:
                with open(completions_file, 'r') as f:
                    completions = json.load(f)
            except (json.JSONDecodeError, KeyError):
                completions = []
        
        completion_record = {
            "completionId": str(uuid.uuid4()),
            "storyId": story_id,
            "endingNodeId": completion_data.endingNodeId,
            "endingType": completion_data.endingType.value,
            "totalNodesVisited": completion_data.totalNodesVisited,
            "readingTimeSeconds": completion_data.readingTimeSeconds,
            "completedAt": datetime.now().isoformat()
        }
        
        completions.append(completion_record)
        
        with open(completions_file, 'w') as f:
            json.dump(completions, f, indent=2)
    
    # ========================================================================
    # Share Link Management
    # ========================================================================
    
    def save_share_link(self, story_id: str, short_code: str, expires_at: datetime):
        """Save share link"""
        share_data = {
            "storyId": story_id,
            "shortCode": short_code,
            "expiresAt": expires_at.isoformat(),
            "createdAt": datetime.now().isoformat()
        }
        
        share_file = os.path.join(self.share_path, f"{short_code}.json")
        with open(share_file, 'w') as f:
            json.dump(share_data, f, indent=2)
    
    def get_share_link(self, short_code: str) -> Optional[Dict[str, Any]]:
        """Get share link by short code"""
        share_file = os.path.join(self.share_path, f"{short_code}.json")
        if not os.path.exists(share_file):
            return None
        
        try:
            with open(share_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, KeyError):
            return None
    
    # ========================================================================
    # Statistics
    # ========================================================================
    
    def get_story_statistics(self, story_id: str) -> Optional[Dict[str, Any]]:
        """Get story statistics"""
        # Get reading completions
        completions_file = os.path.join(self.reading_path, f"{story_id}_completions.json")
        completions = []
        if os.path.exists(completions_file):
            try:
                with open(completions_file, 'r') as f:
                    completions = json.load(f)
            except (json.JSONDecodeError, KeyError):
                pass
        
        total_reads = len(completions)
        unique_readers = len(set(completion.get('readerId', 'anonymous') for completion in completions))
        
        # Calculate average reading time
        reading_times = [completion.get('readingTimeSeconds', 0) for completion in completions]
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
