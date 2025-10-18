"""
Comic generation API routes
Reorganized with proper folder structure
"""

from fastapi import APIRouter, HTTPException, status
from typing import Optional

from app.services.comic_service import ComicService
from app.models.schemas import (
    SceneGenerationRequest,
    SceneRefinementRequest,
    CharacterSelectionRequest,
    ComicGenerationRequest,
    JobStatusResponse,
    ComicResultResponse
)

router = APIRouter(prefix="/api/v1", tags=["comics"])
comic_service = ComicService()


# ============================================================================
# SCENE GENERATION ENDPOINTS
# ============================================================================

@router.post("/comics/scenes/generate")
async def generate_scenes(request: SceneGenerationRequest):
    """
    Generate educational scenes from topic
    
    Step 1 of the workflow
    """
    try:
        result = comic_service.start_scene_generation(
            topic=request.topic,
            age_group=request.age_group or "5-12"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/comics/{job_id}/scenes")
async def get_scenes(job_id: str):
    """Get generated scenes for review"""
    status_data = comic_service.get_job_status(job_id)
    if status_data.get("error"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return {
        "job_id": job_id,
        "scenes": status_data.get("data", {}).get("scenes", []),
        "progress": status_data.get("progress")
    }


# ============================================================================
# SCENE REFINEMENT ENDPOINTS
# ============================================================================

@router.post("/comics/{job_id}/scenes/refine")
async def refine_scenes(job_id: str, request: SceneRefinementRequest):
    """
    Refine scenes based on parent feedback
    
    Step 2 of the workflow
    """
    try:
        result = comic_service.refine_scenes(
            job_id,
            request.feedback_list
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# CHARACTER SELECTION ENDPOINTS
# ============================================================================

@router.get("/comics/characters")
async def list_characters():
    """Get available characters"""
    from master_prompts import AVAILABLE_CHARACTERS
    
    return {
        "characters": [
            {"id": char_id, **char_data}
            for char_id, char_data in AVAILABLE_CHARACTERS.items()
        ]
    }


@router.post("/comics/{job_id}/characters/select")
async def select_characters(job_id: str, request: CharacterSelectionRequest):
    """
    Select characters for the comic
    
    Step 3 of the workflow
    """
    try:
        result = comic_service.select_characters(
            job_id,
            [{"character_type": c.get("character_type"), "count": c.get("count", 1)}
             for c in request.characters]
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# COMIC GENERATION ENDPOINTS
# ============================================================================

@router.post("/comics/{job_id}/generate")
async def generate_comic(job_id: str):
    """
    Generate comic panels
    
    Step 4 of the workflow
    """
    try:
        result = comic_service.generate_comic_panels(job_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# STATUS & RESULT ENDPOINTS
# ============================================================================

@router.get("/comics/{job_id}/status")
async def get_status(job_id: str):
    """Get job status and progress"""
    try:
        status_data = comic_service.get_job_status(job_id)
        if status_data.get("error"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        return status_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/comics/{job_id}/result")
async def get_result(job_id: str):
    """Get completed comic"""
    try:
        comic = comic_service.get_comic_result(job_id)
        if not comic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comic not found or not completed"
            )
        return comic
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================================================
# STORAGE & ADMIN ENDPOINTS
# ============================================================================

@router.get("/storage/stats")
async def get_storage_stats():
    """Get storage statistics"""
    try:
        stats = comic_service.data_manager.get_storage_stats()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Fable Tales Comic Generation API",
        "version": "2.0.0"
    }
