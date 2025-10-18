"""
Image Storage Handler
Manages image storage and retrieval from local and external sources
Designed to work with both local storage and future cloud storage (Supabase Storage)
"""

import os
import shutil
import uuid
from typing import Optional, Dict, Any, List
from pathlib import Path
from datetime import datetime
import json


class ImageStorage:
    """Handle image storage and management"""
    
    def __init__(self, base_path: str = "data/images"):
        """
        Initialize image storage
        
        Args:
            base_path: Base directory for image storage
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories for organization
        self.panels_path = self.base_path / "panels"
        self.characters_path = self.base_path / "characters"
        self.temp_path = self.base_path / "temp"
        
        for path in [self.panels_path, self.characters_path, self.temp_path]:
            path.mkdir(parents=True, exist_ok=True)
        
        # Initialize metadata file
        self.metadata_file = self.base_path / "metadata.json"
        self._load_metadata()
    
    # ========================================================================
    # Image Storage Methods
    # ========================================================================
    
    def store_image(
        self,
        image_data: bytes,
        image_type: str = "panel",
        comic_id: Optional[str] = None,
        panel_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Store image and create metadata record
        
        Args:
            image_data: Image file data
            image_type: Type of image ('panel', 'character', etc.)
            comic_id: Associated comic ID
            panel_id: Associated panel ID
            
        Returns:
            Image metadata record
        """
        # Generate unique image ID
        image_id = str(uuid.uuid4())
        
        # Determine storage path
        if image_type == "panel":
            storage_path = self.panels_path
            filename = f"{comic_id}_{panel_id}_{image_id}.png"
        elif image_type == "character":
            storage_path = self.characters_path
            filename = f"{image_id}.png"
        else:
            storage_path = self.base_path
            filename = f"{image_id}.png"
        
        file_path = storage_path / filename
        
        # Write image data
        try:
            with open(file_path, 'wb') as f:
                f.write(image_data)
        except IOError as e:
            print(f"Error storing image: {str(e)}")
            return {}
        
        # Create metadata record
        metadata = {
            "id": image_id,
            "url": f"/{image_type}/{filename}",  # Relative path for serving
            "local_path": str(file_path),
            "image_type": image_type,
            "comic_id": comic_id,
            "panel_id": panel_id,
            "size_bytes": len(image_data),
            "created_at": datetime.now().isoformat()
        }
        
        # Save metadata
        self.metadata[image_id] = metadata
        self._save_metadata()
        
        return metadata
    
    def store_image_from_url(
        self,
        image_url: str,
        image_type: str = "panel",
        comic_id: Optional[str] = None,
        panel_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Store image from URL (for external sources like FAL.ai)
        
        Args:
            image_url: URL to image
            image_type: Type of image
            comic_id: Associated comic ID
            panel_id: Associated panel ID
            
        Returns:
            Image metadata record with URL reference
        """
        image_id = str(uuid.uuid4())
        
        # Create metadata record pointing to external URL
        metadata = {
            "id": image_id,
            "url": image_url,  # External URL
            "local_path": None,  # No local copy
            "image_type": image_type,
            "comic_id": comic_id,
            "panel_id": panel_id,
            "source": "external",
            "created_at": datetime.now().isoformat()
        }
        
        # Save metadata
        self.metadata[image_id] = metadata
        self._save_metadata()
        
        return metadata
    
    def get_image(self, image_id: str) -> Optional[bytes]:
        """
        Retrieve image data by ID
        
        Args:
            image_id: Image identifier
            
        Returns:
            Image bytes or None if not found
        """
        if image_id not in self.metadata:
            return None
        
        metadata = self.metadata[image_id]
        local_path = metadata.get("local_path")
        
        if not local_path or not os.path.exists(local_path):
            return None
        
        try:
            with open(local_path, 'rb') as f:
                return f.read()
        except IOError:
            return None
    
    def get_image_metadata(self, image_id: str) -> Optional[Dict[str, Any]]:
        """
        Get image metadata by ID
        
        Args:
            image_id: Image identifier
            
        Returns:
            Image metadata or None
        """
        return self.metadata.get(image_id)
    
    def get_panel_images(self, comic_id: str) -> List[Dict[str, Any]]:
        """
        Get all images for a comic
        
        Args:
            comic_id: Comic identifier
            
        Returns:
            List of image metadata records
        """
        return [
            img for img in self.metadata.values()
            if img.get("comic_id") == comic_id and img.get("image_type") == "panel"
        ]
    
    # ========================================================================
    # Image Reference Methods (for Supabase compatibility)
    # ========================================================================
    
    def create_image_reference(
        self,
        url: str,
        panel_id: int,
        comic_id: str,
        local_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create image reference record (for Supabase images table)
        
        Args:
            url: Image URL (external or local)
            panel_id: Associated panel ID
            comic_id: Associated comic ID
            local_path: Optional local storage path
            
        Returns:
            Image reference record
        """
        image_id = str(uuid.uuid4())
        
        reference = {
            "id": image_id,
            "url": url,
            "local_path": local_path,
            "panel_id": panel_id,
            "comic_id": comic_id,
            "created_at": datetime.now().isoformat()
        }
        
        self.metadata[image_id] = reference
        self._save_metadata()
        
        return reference
    
    # ========================================================================
    # Metadata Management
    # ========================================================================
    
    def _load_metadata(self) -> None:
        """Load image metadata from file"""
        if self.metadata_file.exists():
            try:
                with open(self.metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            except (json.JSONDecodeError, IOError):
                self.metadata = {}
        else:
            self.metadata = {}
    
    def _save_metadata(self) -> None:
        """Save image metadata to file"""
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        except IOError as e:
            print(f"Error saving image metadata: {str(e)}")
    
    def get_all_metadata(self) -> Dict[str, Any]:
        """Get all image metadata"""
        return self.metadata.copy()
    
    # ========================================================================
    # Cleanup Methods
    # ========================================================================
    
    def delete_image(self, image_id: str) -> bool:
        """
        Delete image and its metadata
        
        Args:
            image_id: Image identifier
            
        Returns:
            True if deleted, False otherwise
        """
        if image_id not in self.metadata:
            return False
        
        metadata = self.metadata[image_id]
        local_path = metadata.get("local_path")
        
        # Delete local file if it exists
        if local_path and os.path.exists(local_path):
            try:
                os.remove(local_path)
            except OSError:
                pass
        
        # Remove metadata
        del self.metadata[image_id]
        self._save_metadata()
        
        return True
    
    def delete_comic_images(self, comic_id: str) -> int:
        """
        Delete all images for a comic
        
        Args:
            comic_id: Comic identifier
            
        Returns:
            Number of images deleted
        """
        images_to_delete = [
            img_id for img_id, img in self.metadata.items()
            if img.get("comic_id") == comic_id
        ]
        
        deleted_count = 0
        for image_id in images_to_delete:
            if self.delete_image(image_id):
                deleted_count += 1
        
        return deleted_count
    
    def cleanup_temp_images(self) -> int:
        """
        Clean up temporary images
        
        Returns:
            Number of temporary images cleaned up
        """
        deleted_count = 0
        
        for file_path in self.temp_path.glob("*"):
            try:
                if file_path.is_file():
                    file_path.unlink()
                    deleted_count += 1
            except OSError:
                pass
        
        return deleted_count
    
    # ========================================================================
    # Storage Stats
    # ========================================================================
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        panels_size = sum(
            f.stat().st_size for f in self.panels_path.glob("*")
            if f.is_file()
        ) / (1024 * 1024)  # MB
        
        chars_size = sum(
            f.stat().st_size for f in self.characters_path.glob("*")
            if f.is_file()
        ) / (1024 * 1024)  # MB
        
        return {
            "total_images": len(self.metadata),
            "external_references": len([img for img in self.metadata.values() if img.get("source") == "external"]),
            "local_images": len([img for img in self.metadata.values() if img.get("local_path")]),
            "panels_size_mb": round(panels_size, 2),
            "characters_size_mb": round(chars_size, 2),
            "total_size_mb": round(panels_size + chars_size, 2),
            "base_path": str(self.base_path)
        }
