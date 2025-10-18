"""
Pydantic models for request/response validation
Aligned with Supabase schema structure
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime


# ============================================================================
# Enums
# ============================================================================

class JobStatus(str, Enum):
    """Job status states"""
    PENDING = "pending"
    PROCESSING = "processing"
    REQUIRES_ACTION = "requires_action"
    COMPLETED = "completed"
    FAILED = "failed"


class CharacterType(str, Enum):
    """Available character types"""
    BOY_YOUNG = "boy_young"
    GIRL_YOUNG = "girl_young"
    BOY_TEEN = "boy_teen"
    GIRL_TEEN = "girl_teen"
    PARENT_MOM = "parent_mom"
    PARENT_DAD = "parent_dad"
    FRIEND_BOY = "friend_boy"
    FRIEND_GIRL = "friend_girl"


# ============================================================================
# Database-aligned Models (for Supabase migration)
# ============================================================================

class SceneSchema(BaseModel):
    """Scene data - aligns with scenes table"""
    scene_id: int = Field(..., ge=1, le=6)
    title: str
    description: str
    dialogue: str
    learning_point: str
    visual_elements: List[str]
    
    class Config:
        json_schema_extra = {
            "supabase_table": "scenes",
            "columns": {
                "id": "int",
                "comic_id": "uuid (foreign key)",
                "scene_id": "int",
                "title": "text",
                "description": "text",
                "dialogue": "text",
                "learning_point": "text",
                "visual_elements": "text[]",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        }


class CharacterSchema(BaseModel):
    """Character data - aligns with characters table"""
    character_type: CharacterType
    name: str
    description: str
    visual_tags: List[str]
    age_group: str
    
    class Config:
        json_schema_extra = {
            "supabase_table": "characters",
            "columns": {
                "id": "uuid",
                "character_type": "text (primary key)",
                "name": "text",
                "description": "text",
                "visual_tags": "text[]",
                "age_group": "text"
            }
        }


class ComicPanelSchema(BaseModel):
    """Comic panel data - aligns with panels table"""
    panel_id: int = Field(..., ge=1, le=6)
    scene_id: int = Field(..., ge=1, le=6)
    image_url: str
    image_path: Optional[str] = None  # Local storage path
    description: str
    dialogue: str
    title: str
    
    class Config:
        json_schema_extra = {
            "supabase_table": "panels",
            "columns": {
                "id": "uuid",
                "comic_id": "uuid (foreign key)",
                "panel_id": "int",
                "scene_id": "int",
                "image_url": "text",
                "image_path": "text",
                "description": "text",
                "dialogue": "text",
                "title": "text",
                "created_at": "timestamp"
            }
        }


class ComicSchema(BaseModel):
    """Complete comic data - aligns with comics table"""
    topic: str
    title: str
    scenes: List[SceneSchema]
    panels: List[ComicPanelSchema]
    characters: List[CharacterSchema]
    status: JobStatus = JobStatus.COMPLETED
    
    class Config:
        json_schema_extra = {
            "supabase_table": "comics",
            "columns": {
                "id": "uuid",
                "topic": "text",
                "title": "text",
                "status": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        }


class JobSchema(BaseModel):
    """Job tracking data - aligns with jobs table"""
    job_id: str = Field(..., alias="id")
    topic: str
    status: JobStatus
    step: str
    progress: int = Field(default=0, ge=0, le=100)
    data: Dict[str, Any]
    error: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "supabase_table": "jobs",
            "columns": {
                "id": "uuid",
                "topic": "text",
                "status": "text",
                "step": "text",
                "progress": "int",
                "data": "jsonb",
                "error": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        }


class ImageMetadataSchema(BaseModel):
    """Image metadata - aligns with images table"""
    id: str = Field(..., description="UUID for image record")
    url: str
    local_path: str
    panel_id: int
    comic_id: str
    created_at: datetime
    size_bytes: Optional[int] = None
    
    class Config:
        json_schema_extra = {
            "supabase_table": "images",
            "columns": {
                "id": "uuid",
                "url": "text",
                "local_path": "text",
                "panel_id": "int (foreign key)",
                "comic_id": "uuid (foreign key)",
                "created_at": "timestamp",
                "size_bytes": "int"
            }
        }


# ============================================================================
# Request/Response Models
# ============================================================================

class SceneGenerationRequest(BaseModel):
    """Request to generate scenes"""
    topic: str = Field(..., min_length=10, max_length=500)
    age_group: Optional[str] = Field(default="5-12")


class SceneGenerationResponse(BaseModel):
    """Response from scene generation"""
    job_id: str
    status: JobStatus
    message: str


class SceneRefinementRequest(BaseModel):
    """Request to refine scenes"""
    job_id: str
    feedback_list: List[Dict[str, Any]]


class CharacterSelectionRequest(BaseModel):
    """Request to select characters"""
    job_id: str
    characters: List[Dict[str, Any]] = Field(..., min_items=1, max_items=4)


class ComicGenerationRequest(BaseModel):
    """Request to generate comic"""
    job_id: str


class JobStatusResponse(BaseModel):
    """Response with job status"""
    job_id: str
    status: JobStatus
    step: str
    progress: int
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ComicResultResponse(BaseModel):
    """Response with completed comic"""
    job_id: str
    topic: str
    title: str
    panels: List[ComicPanelSchema]
    characters: List[CharacterSchema]
    created_at: datetime
