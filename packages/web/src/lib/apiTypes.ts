/**
 * API-specific type definitions
 */

import { Location, PresetCharacter, Story, StoryTree } from "@/types"

/**
 * Story generation request
 */
export interface StoryGenerateRequest {
  lesson: string
  theme: string
  storyFormat: string
  characterCount: number
}

/**
 * Story generation response
 */
export interface StoryGenerateResponse {
  storyId: string
  tree: StoryTree
  characters: CharacterRole[]
  locations: LocationInfo[]
}

/**
 * Character role in a story
 */
export interface CharacterRole {
  id: string
  role: string
  description: string
}

/**
 * Location information
 */
export interface LocationInfo {
  id: string
  name: string
  sceneNumbers: number[]
  description: string
}

/**
 * Node update request
 */
export interface NodeUpdateRequest {
  title?: string
  text?: string
  location?: string
  choices?: ChoiceData[]
}

/**
 * Choice data
 */
export interface ChoiceData {
  id?: string
  text: string
  nextNodeId: string | null
  isCorrect: boolean
}

/**
 * Node add request
 */
export interface NodeAddRequest {
  parentNodeId: string
  choiceId: string
  title: string
  text: string
  location: string
  type: string
  choices: ChoiceData[]
}

/**
 * Character assignment data
 */
export interface CharacterAssignmentData {
  characterRoleId: string
  presetCharacterId: string
}

/**
 * Character assignment response
 */
export interface CharacterAssignmentResponse {
  characterRoleId: string
  role: string
  presetCharacterId: string
  characterName: string
  imageUrl: string
}

/**
 * Location update request
 */
export interface LocationUpdateRequest {
  name?: string
  description?: string
}

/**
 * Location for image generation
 */
export interface LocationImageGenerateItem {
  locationId: string
  description: string
}

/**
 * Location image generation response
 */
export interface LocationImageGenerationResponse {
  jobId: string
  message: string
  locationIds: string[]
}

/**
 * Location image generation status
 */
export interface LocationImageGenerationStatus {
  status: string
  locations: LocationStatusItem[]
  progress: {
    completed: number
    total: number
  }
}

/**
 * Individual location status
 */
export interface LocationStatusItem {
  locationId: string
  status: string
  imageUrl: string | null
  versionId?: string
}

/**
 * Location image regeneration response
 */
export interface LocationImageRegenerateResponse {
  locationId: string
  versionId: string
  imageUrl: string
  status: string
}

/**
 * Version selection response
 */
export interface VersionSelectionResponse {
  locationId?: string
  sceneId?: string
  selectedVersionId: string
  imageUrl: string
}

/**
 * Scene generation response
 */
export interface SceneGenerationResponse {
  jobId: string
  message: string
  sceneCount: number
}

/**
 * Scene generation status
 */
export interface SceneGenerationStatus {
  status: string
  scenes: SceneStatusItem[]
  progress: {
    completed: number
    total: number
  }
}

/**
 * Individual scene status
 */
export interface SceneStatusItem {
  sceneId: string
  sceneNumber: number
  status: string
  currentImageUrl: string | null
  currentVersionId?: string
}

/**
 * Scene regeneration request
 */
export interface SceneRegenerateRequest {
  additionalPrompt?: string
}

/**
 * Scene regeneration response
 */
export interface SceneRegenerateResponse {
  sceneId: string
  versionId: string
  imageUrl: string
  status: string
}

/**
 * Bulk scene regeneration response
 */
export interface BulkSceneRegenerateResponse {
  jobId: string
  message: string
  sceneIds: string[]
}

/**
 * Story completion response
 */
export interface StoryCompletionResponse {
  storyId: string
  status: string
  title: string
  shareUrl: string
  completedAt: string
}

/**
 * Stories list response
 */
export interface StoriesListResponse {
  stories: Story[]
  total: number
  hasMore: boolean
}

/**
 * Characters list response
 */
export interface CharactersListResponse {
  characters: PresetCharacter[]
}

/**
 * Locations list response
 */
export interface LocationsListResponse {
  locations: Location[]
}

/**
 * Character assignments list response
 */
export interface CharacterAssignmentsResponse {
  storyId: string
  assignments: CharacterAssignmentResponse[]
}

/**
 * Reading node for story reading
 */
export interface ReadingNode {
  id: string
  sceneNumber: number
  title: string
  text: string
  imageUrl: string
  type: string
  choices: ChoiceData[]
  lessonMessage?: string
  previousNodeId?: string
}

/**
 * Story formatted for reading
 */
export interface StoryForReading {
  id: string
  title: string
  lesson: string
  nodes: ReadingNode[]
  startNodeId: string
}

/**
 * Choice made during reading
 */
export interface ChoiceMade {
  nodeId: string
  choiceId: string
}

/**
 * Reading progress request
 */
export interface ReadingProgressRequest {
  currentNodeId: string
  visitedNodeIds: string[]
  choicesMade: ChoiceMade[]
}

/**
 * Reading progress response
 */
export interface ReadingProgress {
  storyId: string
  currentNodeId: string
  visitedNodeIds: string[]
  choicesMade: ChoiceMade[]
  lastReadAt: string
}

/**
 * Reading completion request
 */
export interface ReadingCompletionRequest {
  endingNodeId: string
}

/**
 * Reading completion response
 */
export interface ReadingCompletionResponse {
  storyId: string
  endingNodeId: string
  congratsMessage: string
  readCount: number
  reachedGoodEnding: boolean
  completedAt: string
}
