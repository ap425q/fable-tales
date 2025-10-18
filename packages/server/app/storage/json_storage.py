"""
JSON Storage Handler
Manages persistent data storage using JSON files
Designed to be easily migrated to Supabase
"""

import json
import os
from typing import Dict, List, Any, Optional
from pathlib import Path
from datetime import datetime
import uuid


class JSONStorage:
    """Handle JSON-based data storage"""
    
    def __init__(self, base_path: str = "data"):
        """
        Initialize JSON storage
        
        Args:
            base_path: Base directory for data storage
        """
        self.base_path = Path(base_path)
        self.jobs_path = self.base_path / "jobs"
        self.comics_path = self.base_path / "comics"
        
        # Create directories if they don't exist
        self.jobs_path.mkdir(parents=True, exist_ok=True)
        self.comics_path.mkdir(parents=True, exist_ok=True)
    
    # ========================================================================
    # Job Storage Methods
    # ========================================================================
    
    def create_job(self, job_id: str, initial_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new job record
        
        Args:
            job_id: Unique job identifier
            initial_data: Initial job data
            
        Returns:
            Created job data
        """
        job_data = {
            "id": job_id,
            "topic": initial_data.get("topic", ""),
            "status": "pending",
            "step": "initialization",
            "progress": 0,
            "data": initial_data,
            "error": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        job_file = self.jobs_path / f"{job_id}.json"
        with open(job_file, 'w') as f:
            json.dump(job_data, f, indent=2)
        
        return job_data
    
    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve job by ID
        
        Args:
            job_id: Job identifier
            
        Returns:
            Job data or None if not found
        """
        job_file = self.jobs_path / f"{job_id}.json"
        
        if not job_file.exists():
            return None
        
        try:
            with open(job_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return None
    
    def update_job(
        self,
        job_id: str,
        status: Optional[str] = None,
        step: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        error: Optional[str] = None,
        progress: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Update job record
        
        Args:
            job_id: Job identifier
            status: New status
            step: Current step
            data: Updated data
            error: Error message if any
            progress: Progress percentage
            
        Returns:
            Updated job data or None
        """
        job = self.get_job(job_id)
        if not job:
            return None
        
        if status:
            job["status"] = status
        if step:
            job["step"] = step
        if data:
            job["data"].update(data)
        if error:
            job["error"] = error
        if progress is not None:
            job["progress"] = progress
        
        job["updated_at"] = datetime.now().isoformat()
        
        job_file = self.jobs_path / f"{job_id}.json"
        with open(job_file, 'w') as f:
            json.dump(job, f, indent=2)
        
        return job
    
    def list_jobs(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List all jobs
        
        Args:
            status: Optional status filter
            
        Returns:
            List of job records
        """
        jobs = []
        
        for job_file in self.jobs_path.glob("*.json"):
            try:
                with open(job_file, 'r') as f:
                    job = json.load(f)
                    if status is None or job.get("status") == status:
                        jobs.append(job)
            except (json.JSONDecodeError, IOError):
                continue
        
        return jobs
    
    # ========================================================================
    # Comic Storage Methods
    # ========================================================================
    
    def save_comic(self, comic_id: str, comic_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save complete comic data
        
        Args:
            comic_id: Comic identifier
            comic_data: Comic data including panels, scenes, characters
            
        Returns:
            Saved comic data
        """
        comic_record = {
            "id": comic_id,
            "topic": comic_data.get("topic", ""),
            "title": comic_data.get("title", ""),
            "status": "completed",
            "scenes": comic_data.get("scenes", []),
            "panels": comic_data.get("panels", []),
            "characters": comic_data.get("characters", []),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        comic_file = self.comics_path / f"{comic_id}.json"
        with open(comic_file, 'w') as f:
            json.dump(comic_record, f, indent=2)
        
        return comic_record
    
    def get_comic(self, comic_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve comic by ID
        
        Args:
            comic_id: Comic identifier
            
        Returns:
            Comic data or None if not found
        """
        comic_file = self.comics_path / f"{comic_id}.json"
        
        if not comic_file.exists():
            return None
        
        try:
            with open(comic_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return None
    
    def list_comics(self) -> List[Dict[str, Any]]:
        """
        List all comics
        
        Returns:
            List of comic records
        """
        comics = []
        
        for comic_file in self.comics_path.glob("*.json"):
            try:
                with open(comic_file, 'r') as f:
                    comic = json.load(f)
                    comics.append(comic)
            except (json.JSONDecodeError, IOError):
                continue
        
        return comics
    
    # ========================================================================
    # Utility Methods
    # ========================================================================
    
    def delete_job(self, job_id: str) -> bool:
        """Delete a job record"""
        job_file = self.jobs_path / f"{job_id}.json"
        if job_file.exists():
            job_file.unlink()
            return True
        return False
    
    def delete_comic(self, comic_id: str) -> bool:
        """Delete a comic record"""
        comic_file = self.comics_path / f"{comic_id}.json"
        if comic_file.exists():
            comic_file.unlink()
            return True
        return False
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        jobs = list(self.jobs_path.glob("*.json"))
        comics = list(self.comics_path.glob("*.json"))
        
        total_size = sum(f.stat().st_size for f in jobs + comics) / (1024 * 1024)  # MB
        
        return {
            "total_jobs": len(jobs),
            "total_comics": len(comics),
            "total_size_mb": round(total_size, 2),
            "jobs_path": str(self.jobs_path),
            "comics_path": str(self.comics_path)
        }
