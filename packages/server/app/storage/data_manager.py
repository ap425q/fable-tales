"""
Data Manager
Coordinates between JSON storage and image storage
Provides unified interface for data persistence
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from .json_storage import JSONStorage
from .image_storage import ImageStorage


class DataManager:
    """
    Central data management layer
    Handles all data persistence and retrieval
    Designed for easy migration to Supabase
    """
    
    def __init__(self, data_path: str = "data"):
        """
        Initialize data manager
        
        Args:
            data_path: Base path for all data
        """
        self.json_storage = JSONStorage(data_path)
        self.image_storage = ImageStorage(f"{data_path}/images")
    
    # ========================================================================
    # Job Management
    # ========================================================================
    
    def create_job(self, job_id: str, topic: str, age_group: str = "5-12") -> Dict[str, Any]:
        """Create a new job"""
        initial_data = {
            "topic": topic,
            "age_group": age_group,
            "scenes": [],
            "characters": [],
            "current_step": 1
        }
        return self.json_storage.create_job(job_id, initial_data)
    
    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job by ID"""
        return self.json_storage.get_job(job_id)
    
    def update_job_status(
        self,
        job_id: str,
        status: str,
        step: str,
        progress: int = 0,
        data_update: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Update job status and progress"""
        return self.json_storage.update_job(
            job_id,
            status=status,
            step=step,
            progress=progress,
            data=data_update
        )
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get all jobs"""
        return self.json_storage.list_jobs()
    
    def get_jobs_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get jobs filtered by status"""
        return self.json_storage.list_jobs(status=status)
    
    # ========================================================================
    # Comic Management
    # ========================================================================
    
    def save_comic(
        self,
        comic_id: str,
        topic: str,
        title: str,
        scenes: List[Dict[str, Any]],
        panels: List[Dict[str, Any]],
        characters: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Save complete comic"""
        comic_data = {
            "topic": topic,
            "title": title,
            "scenes": scenes,
            "panels": panels,
            "characters": characters
        }
        return self.json_storage.save_comic(comic_id, comic_data)
    
    def get_comic(self, comic_id: str) -> Optional[Dict[str, Any]]:
        """Get comic by ID"""
        return self.json_storage.get_comic(comic_id)
    
    def get_all_comics(self) -> List[Dict[str, Any]]:
        """Get all comics"""
        return self.json_storage.list_comics()
    
    # ========================================================================
    # Image Management
    # ========================================================================
    
    def store_panel_image(
        self,
        image_data: bytes,
        comic_id: str,
        panel_id: int
    ) -> Dict[str, Any]:
        """Store a comic panel image"""
        return self.image_storage.store_image(
            image_data=image_data,
            image_type="panel",
            comic_id=comic_id,
            panel_id=panel_id
        )
    
    def store_panel_image_url(
        self,
        image_url: str,
        comic_id: str,
        panel_id: int
    ) -> Dict[str, Any]:
        """Store reference to external panel image (e.g., from FAL.ai)"""
        return self.image_storage.store_image_from_url(
            image_url=image_url,
            image_type="panel",
            comic_id=comic_id,
            panel_id=panel_id
        )
    
    def get_panel_images(self, comic_id: str) -> List[Dict[str, Any]]:
        """Get all panel images for a comic"""
        return self.image_storage.get_panel_images(comic_id)
    
    def create_image_reference(
        self,
        url: str,
        panel_id: int,
        comic_id: str,
        local_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create image reference for Supabase compatibility"""
        return self.image_storage.create_image_reference(
            url=url,
            panel_id=panel_id,
            comic_id=comic_id,
            local_path=local_path
        )
    
    def get_image_metadata(self, image_id: str) -> Optional[Dict[str, Any]]:
        """Get image metadata"""
        return self.image_storage.get_image_metadata(image_id)
    
    # ========================================================================
    # Storage Statistics & Cleanup
    # ========================================================================
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get comprehensive storage statistics"""
        json_stats = self.json_storage.get_storage_stats()
        image_stats = self.image_storage.get_storage_stats()
        
        return {
            "json_storage": json_stats,
            "image_storage": image_stats,
            "total_storage_mb": round(
                json_stats.get("total_size_mb", 0) + 
                image_stats.get("total_size_mb", 0),
                2
            )
        }
    
    def cleanup_comic(self, comic_id: str) -> Dict[str, int]:
        """Clean up all data associated with a comic"""
        return {
            "images_deleted": self.image_storage.delete_comic_images(comic_id),
            "comic_deleted": 1 if self.json_storage.delete_comic(comic_id) else 0
        }
    
    def cleanup_temp_images(self) -> int:
        """Clean up temporary images"""
        return self.image_storage.cleanup_temp_images()
    
    # ========================================================================
    # Data Export (for Supabase migration)
    # ========================================================================
    
    def export_job_data(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Export job data in Supabase-compatible format
        
        Useful for data migration
        """
        job = self.json_storage.get_job(job_id)
        if not job:
            return None
        
        return {
            "jobs_table": {
                "id": job["id"],
                "topic": job["topic"],
                "status": job["status"],
                "step": job["step"],
                "progress": job["progress"],
                "data": job["data"],
                "error": job["error"],
                "created_at": job["created_at"],
                "updated_at": job["updated_at"]
            }
        }
    
    def export_comic_data(self, comic_id: str) -> Optional[Dict[str, Any]]:
        """
        Export comic data in Supabase-compatible format
        
        Returns data structure matching Supabase schema:
        - comics table
        - scenes table (with foreign keys)
        - panels table (with foreign keys)
        - images table (with foreign keys)
        """
        comic = self.json_storage.get_comic(comic_id)
        if not comic:
            return None
        
        # Get image data
        images = self.image_storage.get_panel_images(comic_id)
        
        # Create Supabase-compatible export
        return {
            "comics_table": {
                "id": comic["id"],
                "topic": comic["topic"],
                "title": comic["title"],
                "status": comic["status"],
                "created_at": comic["created_at"],
                "updated_at": comic["updated_at"]
            },
            "scenes_table": [
                {
                    "id": f"{comic_id}_scene_{idx}",
                    "comic_id": comic_id,
                    **scene
                }
                for idx, scene in enumerate(comic.get("scenes", []), 1)
            ],
            "panels_table": [
                {
                    "id": f"{comic_id}_panel_{idx}",
                    "comic_id": comic_id,
                    **panel
                }
                for idx, panel in enumerate(comic.get("panels", []), 1)
            ],
            "images_table": [
                {
                    "id": img.get("id"),
                    "url": img.get("url"),
                    "local_path": img.get("local_path"),
                    "panel_id": img.get("panel_id"),
                    "comic_id": comic_id,
                    "created_at": img.get("created_at")
                }
                for img in images
            ],
            "characters_table": comic.get("characters", [])
        }
    
    def export_all_data(self) -> Dict[str, Any]:
        """Export all data in Supabase-compatible format"""
        jobs = self.json_storage.list_jobs()
        comics = self.json_storage.list_comics()
        all_images = self.image_storage.get_all_metadata()
        
        return {
            "jobs": jobs,
            "comics": comics,
            "images": all_images,
            "export_timestamp": datetime.now().isoformat(),
            "migration_notes": {
                "jobs_table": "Direct mapping from jobs",
                "comics_table": "Extracted from comics",
                "scenes_table": "Exploded from comics.scenes",
                "panels_table": "Exploded from comics.panels",
                "characters_table": "Extracted from comics.characters",
                "images_table": "From image metadata with foreign key references"
            }
        }
