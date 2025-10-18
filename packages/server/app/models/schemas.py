"""
Pydantic models for request/response validation
Updated for new story-based API specification
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from enum import Enum
from datetime import datetime


# ============================================================================
# Enums
# ============================================================================

class StoryStatus(str, Enum):
    """Story status states"""
    DRAFT = "draft"
    STRUCTURE_FINALIZED = "structure_finalized"
    COMPLETED = "completed"

class NodeType(str, Enum):
    """Node types in story tree"""
    START = "start"
    NORMAL = "normal"
    CHOICE = "choice"
    GOOD_ENDING = "good_ending"
    BAD_ENDING = "bad_ending"

class GenerationStatus(str, Enum):
    """Generation status states"""
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"
    IN_PROGRESS = "in_progress"

class EndingType(str, Enum):
    """Ending types"""
    GOOD_ENDING = "good_ending"
    BAD_ENDING = "bad_ending"


# ============================================================================
# Core Story Models
# ============================================================================

class Choice(BaseModel):
    """Choice in a story node"""
    id: Optional[str] = None  # None for new choices
    text: str
    nextNodeId: Optional[str] = None
    isCorrect: bool = True

class StoryNode(BaseModel):
    """Node in the story tree"""
    id: str
    sceneNumber: int
    title: str
    text: str
    location: str
    type: NodeType
    choices: List[Choice] = []

class StoryEdge(BaseModel):
    """Edge connecting nodes in story tree"""
    from_: str = Field(alias="from")
    to: str
    choiceId: str

class StoryTree(BaseModel):
    """Complete story tree structure"""
    nodes: List[StoryNode]
    edges: List[StoryEdge]

class CharacterRole(BaseModel):
    """Character role in story"""
    id: str
    role: str  # Protagonist, Friend, Helper, Antagonist
    description: str

class ImageVersion(BaseModel):
    """Image version for location or scene"""
    versionId: str
    imageUrl: str
    createdAt: datetime

class Location(BaseModel):
    """Location in story with background image"""
    id: str
    name: str
    sceneNumbers: List[int]
    description: str
    imageUrl: Optional[str] = None
    status: GenerationStatus = GenerationStatus.PENDING
    versions: List['ImageVersion'] = []
    selectedVersionId: Optional[str] = None

class Story(BaseModel):
    """Complete story data"""
    id: str
    lesson: str
    theme: str
    storyFormat: str
    status: StoryStatus = StoryStatus.DRAFT
    tree: StoryTree
    characters: List[CharacterRole]
    locations: List[Location]
    createdAt: datetime
    updatedAt: datetime

# ============================================================================
# Character Models
# ============================================================================

class PresetCharacter(BaseModel):
    """Preset character available for selection"""
    id: str
    name: str
    imageUrl: str
    category: Optional[str] = None

class CharactersResponse(BaseModel):
    """Response model for characters list"""
    characters: List[PresetCharacter]

class CharacterAssignment(BaseModel):
    """Character assignment for a story"""
    characterRoleId: str
    presetCharacterId: str
    roleName: Optional[str] = None
    characterName: Optional[str] = None

class CharacterAssignmentItem(BaseModel):
    """Individual character assignment item"""
    characterRoleId: str
    presetCharacterId: str

class CharacterAssignmentRequest(BaseModel):
    """Request to save character assignments"""
    assignments: List[CharacterAssignmentItem]

class CharacterAssignmentsResponse(BaseModel):
    """Response model for character assignments"""
    storyId: str
    assignments: List[CharacterAssignment]

# ============================================================================
# Location Image Models (replacing Background Models)
# ============================================================================

class LocationUpdateRequest(BaseModel):
    """Request to update location description"""
    name: Optional[str] = None
    description: Optional[str] = None

class LocationImageItem(BaseModel):
    """Individual location for image generation"""
    locationId: str
    description: str

class LocationImageGenerationRequest(BaseModel):
    """Request to generate location images"""
    locations: List[LocationImageItem]

class LocationImageGenerationResponse(BaseModel):
    """Response for location image generation"""
    success: bool
    url: str

class LocationImageGenerationStatus(BaseModel):
    """Location image generation status response"""
    status: GenerationStatus
    locations: List[Dict[str, Any]]
    progress: Dict[str, int]

class LocationImageRegenerateRequest(BaseModel):
    """Request to regenerate location image"""
    description: Optional[str] = None

class LocationImageVersionSelectRequest(BaseModel):
    """Request to select location image version"""
    versionId: str

# ============================================================================
# Scene Models
# ============================================================================

class SceneImageVersion(BaseModel):
    """Scene image version"""
    versionId: str
    imageUrl: str
    createdAt: datetime

class SceneGenerationStatus(BaseModel):
    """Scene generation status response"""
    status: GenerationStatus
    scenes: List[Dict[str, Any]]
    progress: Dict[str, int]

class SceneRegenerateRequest(BaseModel):
    """Request to regenerate scene image"""
    additionalPrompt: Optional[str] = None

class SceneVersionSelectRequest(BaseModel):
    """Request to select scene version"""
    versionId: str

class SceneRegenerateMultipleRequest(BaseModel):
    """Request to regenerate multiple scenes"""
    sceneIds: List[str]

# ============================================================================
# Reading Progress Models
# ============================================================================

class ChoiceMade(BaseModel):
    """Choice made during reading"""
    nodeId: str
    choiceId: str

class ReadingProgressRequest(BaseModel):
    """Request to save reading progress"""
    currentNodeId: str
    visitedNodeIds: List[str]
    choicesMade: List[ChoiceMade]

class ReadingProgress(BaseModel):
    """Reading progress data"""
    storyId: str
    currentNodeId: str
    visitedNodeIds: List[str]
    choicesMade: List[ChoiceMade]
    lastReadAt: datetime

class ReadingCompletionRequest(BaseModel):
    """Request to record reading completion"""
    endingNodeId: str
    endingType: EndingType
    totalNodesVisited: int
    readingTimeSeconds: int

# ============================================================================
# Story Management Models
# ============================================================================

class StoryListItem(BaseModel):
    """Story list item for browsing"""
    id: str
    title: str
    lesson: str
    coverImage: Optional[str] = None
    status: StoryStatus
    createdAt: datetime
    sceneCount: int
    readCount: Optional[int] = None
    lastReadAt: Optional[datetime] = None

class StoryListResponse(BaseModel):
    """Response for story list endpoints"""
    stories: List[StoryListItem]
    total: int
    hasMore: bool

class StoryGenerateRequest(BaseModel):
    """Request to generate a new story"""
    lesson: str
    theme: str
    storyFormat: str
    characterCount: int = 4

class StoryGenerateResponse(BaseModel):
    """Response from story generation"""
    storyId: str
    tree: StoryTree
    characters: List[CharacterRole]
    locations: List[Location]

class NodeUpdateRequest(BaseModel):
    """Request to update a story node"""
    title: Optional[str] = None
    text: Optional[str] = None
    location: Optional[str] = None
    choices: Optional[List[Choice]] = None

class NodeCreateRequest(BaseModel):
    """Request to create a new node"""
    parentNodeId: str
    choiceId: str
    title: str
    text: str
    location: str
    type: NodeType
    choices: List[Choice]

class StoryFinalizeRequest(BaseModel):
    """Request to finalize story structure"""
    tree: StoryTree

class StoryCompleteRequest(BaseModel):
    """Request to complete a story"""
    title: str

class StoryDuplicateRequest(BaseModel):
    """Request to duplicate a story"""
    newTitle: Optional[str] = None

class ShareLinkRequest(BaseModel):
    """Request to generate share link"""
    expiresIn: Optional[int] = 2592000  # 30 days default

class ShareLinkResponse(BaseModel):
    """Response with share link"""
    shareUrl: str
    shortCode: str
    expiresAt: datetime

# ============================================================================
# Statistics Models
# ============================================================================

class ChoiceDistribution(BaseModel):
    """Choice distribution statistics"""
    nodeId: str
    choices: List[Dict[str, Any]]

class StoryStatistics(BaseModel):
    """Story statistics"""
    storyId: str
    totalReads: int
    uniqueReaders: int
    averageReadingTime: int
    completionRate: int
    choiceDistribution: List[ChoiceDistribution]
    mostVisitedScenes: List[Dict[str, Any]]

# ============================================================================
# Reading Models (for child mode)
# ============================================================================

class ReadingNode(BaseModel):
    """Node for reading mode"""
    id: str
    sceneNumber: int
    title: str
    text: str
    imageUrl: str
    type: NodeType
    choices: List[Choice]
    lessonMessage: Optional[str] = None
    previousNodeId: Optional[str] = None

class StoryForReading(BaseModel):
    """Story data formatted for reading"""
    id: str
    title: str
    lesson: str
    nodes: List[ReadingNode]
    startNodeId: str

# ============================================================================
# Image Upload Models
# ============================================================================

class ImageUploadRequest(BaseModel):
    """Request to upload image"""
    type: str  # 'character' | 'background'

class ImageUploadResponse(BaseModel):
    """Response from image upload"""
    imageId: str
    imageUrl: str
    uploadedAt: datetime

# ============================================================================
# Standard Response Models
# ============================================================================

class APIResponse(BaseModel):
    """Standard API response format"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None

class ErrorResponse(BaseModel):
    """Error response format"""
    code: str
    message: str

# ============================================================================
# Error Codes
# ============================================================================

ERROR_CODES = {
    "STORY_NOT_FOUND": "Story not found",
    "NODE_NOT_FOUND": "Node not found",
    "LOCATION_NOT_FOUND": "Location not found",
    "INVALID_TREE_STRUCTURE": "Invalid tree structure",
    "GENERATION_FAILED": "Generation failed",
    "GENERATION_IN_PROGRESS": "Generation in progress",
    "INVALID_CHARACTER_ASSIGNMENT": "Invalid character assignment",
    "IMAGE_UPLOAD_FAILED": "Image upload failed",
    "UNAUTHORIZED": "Unauthorized",
    "VALIDATION_ERROR": "Validation error",
    "SERVER_ERROR": "Server error occurred"
}