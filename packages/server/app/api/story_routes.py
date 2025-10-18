"""
Story-based API routes
Complete implementation of the new story API specification
"""

from fastapi import APIRouter, HTTPException, status, Query, Path
from typing import List, Optional
from datetime import datetime

from app.services.story_service import StoryService
from app.models.schemas import (
    StoryGenerateRequest, StoryGenerateResponse,
    StoryListResponse, StoryListItem,
    Story, StoryTree, StoryNode, StoryEdge,
    NodeUpdateRequest, NodeCreateRequest,
    StoryCompleteRequest,
    CharacterAssignmentRequest, CharacterAssignmentsResponse, PresetCharacter, CharactersResponse,
    BackgroundUpdateRequest, BackgroundGenerationRequest, BackgroundGenerationResponse,
    BackgroundGenerationStatus, BackgroundRegenerateRequest,
    BackgroundVersionSelectRequest,
    SceneGenerationStatus, SceneRegenerateRequest,
    SceneVersionSelectRequest, SceneRegenerateMultipleRequest,
    ReadingProgressRequest, ReadingProgress,
    ReadingCompletionRequest, StoryForReading,
    ShareLinkRequest, ShareLinkResponse,
    APIResponse, ERROR_CODES
)

router = APIRouter(prefix="/api/v1", tags=["stories"])
story_service = StoryService()


# ============================================================================
# 1️⃣ Home/Role Selection Page APIs
# ============================================================================

@router.get("/stories", response_model=APIResponse)
async def get_stories(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None, regex="^(all|completed|draft)$"),
    sort_by: Optional[str] = Query(None, regex="^(recent|title|readCount)$")
):
    """API 1-1 & 9-1: Story List Retrieval (Simple and Detailed)"""
    try:
        stories_data = story_service.get_all_stories(limit, offset, status, sort_by)
        return APIResponse(
            success=True,
            data=stories_data.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


# ============================================================================
# 2️⃣ Story Setup Page APIs
# ============================================================================

@router.post("/stories/generate", response_model=APIResponse)
async def generate_story(request: StoryGenerateRequest):
    """API 2-1: Story Creation (AI Generation)"""
    try:
        story_data = story_service.generate_story(
            lesson=request.lesson,
            theme=request.theme,
            story_format=request.storyFormat,
            character_count=request.characterCount
        )
        return APIResponse(
            success=True,
            data=story_data
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "GENERATION_FAILED", "message": str(e)}
        )


# ============================================================================
# 3️⃣ Story Tree Editing Page APIs
# ============================================================================



@router.get("/stories/{story_id}", response_model=APIResponse)
async def get_story_details(story_id: str = Path(..., description="Story ID")):
    """API 3-1: Story Details Retrieval"""
    try:
        story = story_service.get_story(story_id)
        if not story:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=story.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.patch("/stories/{story_id}/nodes/{node_id}", response_model=APIResponse)
async def update_node(
    story_id: str = Path(..., description="Story ID"),
    node_id: str = Path(..., description="Node ID"),
    request: NodeUpdateRequest = None
):
    """API 3-2: Node Update"""
    try:
        updated_node = story_service.update_node(story_id, node_id, request)
        if not updated_node:
            return APIResponse(
                success=False,
                error={"code": "NODE_NOT_FOUND", "message": "Node not found"}
            )
        return APIResponse(
            success=True,
            data={"node": updated_node.model_dump()}
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/nodes", response_model=APIResponse)
async def add_node(
    story_id: str = Path(..., description="Story ID"),
    request: NodeCreateRequest = None
):
    """API 3-3: Add Node"""
    try:
        new_node = story_service.add_node(story_id, request)
        if not new_node:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data={"node": new_node.model_dump()}
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.delete("/stories/{story_id}/nodes/{node_id}", response_model=APIResponse)
async def delete_node(
    story_id: str = Path(..., description="Story ID"),
    node_id: str = Path(..., description="Node ID")
):
    """API 3-4: Delete Node"""
    try:
        result = story_service.delete_node(story_id, node_id)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "NODE_NOT_FOUND", "message": "Node not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )




# ============================================================================
# 4️⃣ Character Role Assignment Page APIs
# ============================================================================

@router.get("/characters", response_model=CharactersResponse)
async def get_preset_characters():
    """
    API 4-1: Retrieve Preset Characters List
    
    Returns a list of available preset characters that can be assigned to story roles.
    Characters are categorized by gender (Female/Male) based on their ID prefix.
    
    **Response Format:**
    - `id`: Character identifier (f_<name> for female, m_<name> for male)
    - `name`: Character display name
    - `imageUrl`: Path to character image in /characters/ directory
    - `category`: Gender category ("Female" or "Male")
    
    **Available Characters:**
    - Female: Amelia, Ava, Emma, Olivia, Sophia
    - Male: James, John, Joseph, Noah, William
    """
    try:
        characters = story_service.get_preset_characters()
        return CharactersResponse(characters=characters)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/character-assignments", response_model=CharacterAssignmentsResponse)
async def save_character_assignments(
    story_id: str = Path(..., description="Story ID"),
    request: CharacterAssignmentRequest = None
):
    """
    API 4-2: Save Character Assignments
    
    Assigns preset characters to story roles. This updates the original generated story
    by mapping character roles to specific preset characters.
    
    **Input:**
    - `story_id`: The ID of the story to update
    - `assignments`: List of character role to preset character mappings
    
    **Output:**
    - `storyId`: The story ID that was updated
    - `assignments`: List of assignments with role names and character names populated
    """
    try:
        assignments = story_service.save_character_assignments(story_id, request.assignments)
        if not assignments:
            raise HTTPException(
                status_code=404,
                detail={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return CharacterAssignmentsResponse(
            storyId=story_id,
            assignments=assignments
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.get("/stories/{story_id}/character-assignments", response_model=CharacterAssignmentsResponse)
async def get_character_assignments(story_id: str = Path(..., description="Story ID")):
    """
    API 4-3: Retrieve Character Assignments
    
    Gets the current character assignments for a story, showing which preset characters
    are assigned to which story roles.
    
    **Output:**
    - `storyId`: The story ID
    - `assignments`: List of current character assignments with role names and character names
    """
    try:
        assignments = story_service.get_character_assignments(story_id)
        if assignments is None:
            # Return empty list if no assignments found
            return CharacterAssignmentsResponse(
                storyId=story_id,
                assignments=[]
            )
        return CharacterAssignmentsResponse(
            storyId=story_id,
            assignments=assignments
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "SERVER_ERROR", "message": str(e)}
        )


# ============================================================================
# 5️⃣ Background Setup and Generation Page APIs
# ============================================================================

@router.get("/stories/{story_id}/backgrounds", response_model=APIResponse)
async def get_story_backgrounds(story_id: str = Path(..., description="Story ID")):
    """API 5-1: Retrieve Backgrounds List"""
    try:
        backgrounds = story_service.get_story_backgrounds(story_id)
        if backgrounds is None:
            # Return empty list if no backgrounds found
            return APIResponse(
                success=True,
                data={"backgrounds": []}
            )
        return APIResponse(
            success=True,
            data={"backgrounds": [bg.model_dump() for bg in backgrounds]}
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.patch("/stories/{story_id}/backgrounds/{background_id}", response_model=APIResponse)
async def update_background_description(
    story_id: str = Path(..., description="Story ID"),
    background_id: str = Path(..., description="Background ID"),
    request: BackgroundUpdateRequest = None
):
    """API 5-2: Update Background Description"""
    try:
        background = story_service.update_background_description(story_id, background_id, request)
        if not background:
            return APIResponse(
                success=False,
                error={"code": "BACKGROUND_NOT_FOUND", "message": "Background not found"}
            )
        return APIResponse(
            success=True,
            data={"background": background.model_dump()}
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/backgrounds/generate-all", response_model=BackgroundGenerationResponse)
async def generate_all_backgrounds(
    story_id: str = Path(..., description="Story ID"),
    request: BackgroundGenerationRequest = None
):
    """
    API 5-3: Generate All Background Images
    
    Generates background images using FAL.ai based on the provided descriptions.
    Returns the URL of the generated image.
    
    **Input:**
    - `story_id`: The ID of the story
    - `backgrounds`: List of background items with ID and description
    
    **Output:**
    - `success`: Boolean indicating if generation was successful
    - `url`: URL of the generated image
    """
    try:
        image_url = story_service.generate_all_backgrounds(story_id, request.backgrounds)
        if not image_url:
            raise HTTPException(
                status_code=404,
                detail={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return BackgroundGenerationResponse(
            success=True,
            url=image_url
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "GENERATION_FAILED", "message": str(e)}
        )


@router.get("/stories/{story_id}/backgrounds/generation-status", response_model=APIResponse)
async def check_background_generation_status(
    story_id: str = Path(..., description="Story ID"),
    job_id: Optional[str] = Query(None, description="Job ID")
):
    """API 5-4: Check Background Generation Status"""
    try:
        status_data = story_service.check_background_generation_status(story_id, job_id)
        if not status_data:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=status_data.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/backgrounds/{background_id}/regenerate", response_model=APIResponse)
async def regenerate_individual_background(
    story_id: str = Path(..., description="Story ID"),
    background_id: str = Path(..., description="Background ID"),
    request: BackgroundRegenerateRequest = None
):
    """API 5-5: Regenerate Individual Background"""
    try:
        result = story_service.regenerate_individual_background(story_id, background_id, request.description)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "BACKGROUND_NOT_FOUND", "message": "Background not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "GENERATION_FAILED", "message": str(e)}
        )


@router.post("/stories/{story_id}/backgrounds/{background_id}/select-version", response_model=APIResponse)
async def select_background_version(
    story_id: str = Path(..., description="Story ID"),
    background_id: str = Path(..., description="Background ID"),
    request: BackgroundVersionSelectRequest = None
):
    """API 5-6: Select Background Version"""
    try:
        result = story_service.select_background_version(story_id, background_id, request.versionId)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "BACKGROUND_NOT_FOUND", "message": "Background not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


# ============================================================================
# 6️⃣ Final Scene Image Generation and Management Page APIs
# ============================================================================

@router.post("/stories/{story_id}/scenes/generate-all-images", response_model=APIResponse)
async def generate_all_scene_images(
    story_id: str = Path(..., description="Story ID"),
    scene_ids: Optional[List[str]] = None
):
    """API 6-1: Generate All Scene Images (Character + Background Composite)"""
    try:
        result = story_service.generate_all_scene_images(story_id, scene_ids)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "GENERATION_FAILED", "message": str(e)}
        )


@router.get("/stories/{story_id}/scenes/generation-status", response_model=APIResponse)
async def check_scene_image_generation_status(
    story_id: str = Path(..., description="Story ID"),
    job_id: Optional[str] = Query(None, description="Job ID")
):
    """API 6-2: Check Scene Image Generation Status"""
    try:
        status_data = story_service.check_scene_image_generation_status(story_id, job_id)
        if not status_data:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=status_data.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )




@router.post("/stories/{story_id}/scenes/{scene_id}/regenerate-image", response_model=APIResponse)
async def regenerate_individual_scene_image(
    story_id: str = Path(..., description="Story ID"),
    scene_id: str = Path(..., description="Scene ID"),
    request: SceneRegenerateRequest = None
):
    """API 6-4: Regenerate Individual Scene Image"""
    try:
        result = story_service.regenerate_individual_scene_image(story_id, scene_id, request.additionalPrompt)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "NODE_NOT_FOUND", "message": "Scene not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "GENERATION_FAILED", "message": str(e)}
        )


@router.post("/stories/{story_id}/scenes/{scene_id}/select-version", response_model=APIResponse)
async def select_scene_image_version(
    story_id: str = Path(..., description="Story ID"),
    scene_id: str = Path(..., description="Scene ID"),
    request: SceneVersionSelectRequest = None
):
    """API 6-5: Select Scene Image Version"""
    try:
        result = story_service.select_scene_image_version(story_id, scene_id, request.versionId)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "NODE_NOT_FOUND", "message": "Scene not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/scenes/regenerate-multiple", response_model=APIResponse)
async def bulk_regenerate_scene_images(
    story_id: str = Path(..., description="Story ID"),
    request: SceneRegenerateMultipleRequest = None
):
    """API 6-6: Bulk Regenerate Scene Images"""
    try:
        result = story_service.bulk_regenerate_scene_images(story_id, request.sceneIds)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "GENERATION_FAILED", "message": str(e)}
        )


@router.post("/stories/{story_id}/complete", response_model=APIResponse)
async def complete_story(
    story_id: str = Path(..., description="Story ID"),
    request: StoryCompleteRequest = None
):
    """API 6-7: Complete Story"""
    try:
        result = story_service.complete_story(story_id, request.title)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


# ============================================================================
# 7️⃣ Child Mode - Story Selection Page APIs
# ============================================================================

# ============================================================================
# 8️⃣ Child Mode - Story Reading Page APIs
# ============================================================================

@router.get("/stories/{story_id}/read", response_model=APIResponse)
async def get_story_for_reading(story_id: str = Path(..., description="Story ID")):
    """API 8-1: Retrieve Story for Reading"""
    try:
        story_data = story_service.get_story_for_reading(story_id)
        if not story_data:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=story_data.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/reading-progress", response_model=APIResponse)
async def save_reading_progress(
    story_id: str = Path(..., description="Story ID"),
    request: ReadingProgressRequest = None
):
    """API 8-2: Save Reading Progress"""
    try:
        result = story_service.save_reading_progress(story_id, request)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.get("/stories/{story_id}/reading-progress", response_model=APIResponse)
async def get_reading_progress(story_id: str = Path(..., description="Story ID")):
    """API 8-3: Retrieve Reading Progress"""
    try:
        progress = story_service.get_reading_progress(story_id)
        if progress is None:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=progress.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


@router.post("/stories/{story_id}/reading-complete", response_model=APIResponse)
async def record_reading_completion(
    story_id: str = Path(..., description="Story ID"),
    request: ReadingCompletionRequest = None
):
    """API 8-4: Record Reading Completion"""
    try:
        result = story_service.record_reading_completion(story_id, request)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )


# ============================================================================
# 9️⃣ Story Library Page APIs
# ============================================================================

@router.delete("/stories/{story_id}", response_model=APIResponse)
async def delete_story(story_id: str = Path(..., description="Story ID")):
    """API 9-2: Delete Story"""
    try:
        result = story_service.delete_story(story_id)
        if not result:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=result
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )






# ============================================================================
# 🔟 Other Utility APIs
# ============================================================================

@router.post("/stories/{story_id}/share", response_model=APIResponse)
async def generate_share_link(
    story_id: str = Path(..., description="Story ID"),
    request: ShareLinkRequest = None
):
    """API 10-1: Generate Share Link"""
    try:
        share_data = story_service.generate_share_link(story_id, request.expiresIn if request else 2592000)
        if not share_data:
            return APIResponse(
                success=False,
                error={"code": "STORY_NOT_FOUND", "message": "Story not found"}
            )
        return APIResponse(
            success=True,
            data=share_data.model_dump()
        )
    except Exception as e:
        return APIResponse(
            success=False,
            error={"code": "SERVER_ERROR", "message": str(e)}
        )




# ============================================================================
# Health Check
# ============================================================================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Fable Tales Story API",
        "version": "1.0.0"
    }
