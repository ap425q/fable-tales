/**
 * Shared Type Definitions for Interactive Storybook Creator
 *
 * This file contains all type definitions used across the application.
 * All types use interfaces for object shapes and enums for fixed value sets.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Types of nodes in a story tree structure
 */
export enum NodeType {
  START = "start",
  NORMAL = "normal",
  CHOICE = "choice",
  GOOD_ENDING = "good_ending",
  BAD_ENDING = "bad_ending",
}

/**
 * Current status of a story in the creation workflow
 */
export enum StoryStatus {
  DRAFT = "draft",
  STRUCTURE_FINALIZED = "structure_finalized",
  COMPLETED = "completed",
}

/**
 * Status of asynchronous generation tasks (backgrounds, scene images)
 */
export enum GenerationStatus {
  PENDING = "pending",
  GENERATING = "generating",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Options for sorting story lists
 */
export enum SortOption {
  RECENT = "recent",
  POPULAR = "popular",
  TITLE = "title",
  READ_COUNT = "readCount",
}

/**
 * Categories for preset characters
 */
export enum CharacterCategory {
  ANIMAL = "animal",
  FANTASY = "fantasy",
  HUMAN = "human",
  ROBOT = "robot",
}

/**
 * API error codes
 */
export enum ErrorCode {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  SERVER_ERROR = "SERVER_ERROR",
  GENERATION_FAILED = "GENERATION_FAILED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

// ============================================================================
// CORE STORY INTERFACES
// ============================================================================

/**
 * Story metadata and overview information
 */
export interface Story {
  /** Unique identifier for the story */
  id: string
  /** Story title */
  title: string
  /** Educational lesson or moral of the story */
  lesson: string
  /** Story theme (e.g., "friendship", "honesty", "courage") */
  theme: string
  /** Story format (e.g., "adventure", "mystery", "fantasy") */
  format: string
  /** Current status in the creation workflow */
  status: StoryStatus
  /** Timestamp of story creation */
  createdAt: string
  /** Timestamp of last update */
  updatedAt: string
  /** Total number of scenes/nodes in the story */
  sceneCount: number
  /** Number of times the story has been read */
  readCount: number
  /** Whether the story is published for children to read */
  isPublished: boolean
  /** ID of the user who created the story */
  authorId: string
  /** Optional cover image URL */
  coverImageUrl?: string
}

/**
 * Complete story tree structure with nodes and edges
 */
export interface StoryTree {
  /** Unique identifier for the story */
  storyId: string
  /** All nodes (scenes) in the story */
  nodes: StoryNode[]
  /** All edges (connections) between nodes */
  edges: StoryEdge[]
}

/**
 * Individual scene/node in a story
 */
export interface StoryNode {
  /** Unique identifier for the node */
  id: string
  /** Sequential number of the scene (for display) */
  sceneNumber: number
  /** Scene title */
  title: string
  /** Scene narrative text */
  text: string
  /** Location/setting of the scene */
  location: string
  /** Type of node in the story flow */
  type: NodeType
  /** Available choices at this node (empty for ending nodes) */
  choices: Choice[]
  /** Generated images for this scene */
  images: SceneImage[]
  /** Optional notes or guidance for the scene */
  notes?: string
}

/**
 * Choice option that can be selected at a choice node
 */
export interface Choice {
  /** Unique identifier for the choice */
  id: string
  /** Display text for the choice */
  text: string
  /** ID of the node this choice leads to */
  nextNodeId: string
  /** Whether this is the "correct" choice leading to good outcome */
  isCorrect: boolean
}

/**
 * Connection between two nodes in the story tree
 */
export interface StoryEdge {
  /** Source node ID */
  from: string
  /** Target node ID */
  to: string
  /** Choice ID that triggers this connection */
  choiceId: string
}

// ============================================================================
// CHARACTER INTERFACES
// ============================================================================

/**
 * Character role defined for a specific story
 */
export interface CharacterRole {
  /** Unique identifier for the role */
  id: string
  /** Name of the role (e.g., "Hero", "Mentor", "Villain") */
  roleName: string
  /** Description of the role's purpose in the story */
  description: string
  /** Story ID this role belongs to */
  storyId: string
}

/**
 * Preset character available in the character library
 */
export interface PresetCharacter {
  /** Unique identifier for the character */
  id: string
  /** Character name */
  name: string
  /** Character image URL */
  imageUrl: string
  /** Character category */
  category: CharacterCategory
  /** Optional description or traits */
  description?: string
}

/**
 * Assignment linking a story role to a preset character
 */
export interface CharacterAssignment {
  /** Unique identifier for the assignment */
  id: string
  /** Story ID */
  storyId: string
  /** Character role ID */
  roleId: string
  /** Preset character ID */
  characterId: string
  /** Timestamp of assignment */
  assignedAt: string
}

// ============================================================================
// LOCATION AND BACKGROUND INTERFACES
// ============================================================================

/**
 * Location/background setting in a story
 */
export interface Location {
  /** Unique identifier for the location */
  id: string
  /** Story ID this location belongs to */
  storyId: string
  /** Location name (e.g., "Enchanted Forest", "Castle") */
  name: string
  /** Detailed description for image generation */
  description: string
  /** Scene numbers that use this location */
  sceneNumbers: number[]
  /** Generated background image versions */
  imageVersions: ImageVersion[]
  /** Current generation status */
  generationStatus: GenerationStatus
  /** Error message if generation failed */
  errorMessage?: string
}

/**
 * Version of a generated image with metadata
 */
export interface ImageVersion {
  /** Unique identifier for this version */
  versionId: string
  /** Image URL */
  url: string
  /** Timestamp of generation */
  generatedAt: string
  /** Optional prompt used for generation */
  prompt?: string
}

// ============================================================================
// SCENE IMAGE INTERFACES
// ============================================================================

/**
 * Generated scene image with version history
 */
export interface SceneImage {
  /** Unique identifier for the scene image */
  id: string
  /** Story ID */
  storyId: string
  /** Scene/node ID */
  sceneId: string
  /** Scene number */
  sceneNumber: number
  /** All generated versions of this scene */
  versions: ImageVersion[]
  /** ID of the currently selected version */
  currentVersionId: string
  /** Current generation status */
  generationStatus: GenerationStatus
  /** Optional generation job ID for polling */
  jobId?: string
  /** Error message if generation failed */
  errorMessage?: string
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

/**
 * Standard API error structure
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: ErrorCode
  /** Human-readable error message */
  message: string
  /** Optional additional error details */
  details?: Record<string, unknown>
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean
  /** Response data (present if success is true) */
  data?: T
  /** Error information (present if success is false) */
  error?: ApiError
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  items: T[]
  /** Total number of items across all pages */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Whether there are more pages available */
  hasMore: boolean
}

/**
 * Job status response for async generation tasks
 */
export interface JobStatusResponse {
  /** Unique job identifier */
  jobId: string
  /** Current job status */
  status: GenerationStatus
  /** Progress percentage (0-100) */
  progress: number
  /** Result data (present when status is COMPLETED) */
  result?: {
    /** Generated image URL */
    imageUrl: string
    /** Version ID */
    versionId: string
  }
  /** Error message (present when status is FAILED) */
  errorMessage?: string
}

// ============================================================================
// UI STATE INTERFACES
// ============================================================================

/**
 * Loading state for async operations
 */
export interface LoadingState {
  /** Whether the operation is in progress */
  isLoading: boolean
  /** Optional loading message */
  message?: string
  /** Optional progress percentage (0-100) */
  progress?: number
}

/**
 * Form data for creating a new story
 */
export interface StoryFormData {
  /** Story title */
  title: string
  /** Educational lesson */
  lesson: string
  /** Story theme */
  theme: string
  /** Story format */
  format: string
  /** Number of scenes to generate */
  sceneCount: number
}

/**
 * Form data for editing a story node
 */
export interface NodeFormData {
  /** Scene title */
  title: string
  /** Scene narrative text */
  text: string
  /** Location/setting */
  location: string
  /** Node type */
  type: NodeType
  /** Optional notes */
  notes?: string
}

/**
 * Form data for creating a character role
 */
export interface RoleFormData {
  /** Role name */
  roleName: string
  /** Role description */
  description: string
}

/**
 * Reading progress tracking for a child user
 */
export interface ReadingProgress {
  /** Unique identifier */
  id: string
  /** Story ID */
  storyId: string
  /** User ID */
  userId: string
  /** Current node ID */
  currentNodeId: string
  /** History of visited node IDs */
  visitedNodeIds: string[]
  /** History of choice IDs made */
  choicesMade: string[]
  /** Whether the story reading is completed */
  isCompleted: boolean
  /** Whether a good ending was reached */
  reachedGoodEnding: boolean
  /** Timestamp of last read */
  lastReadAt: string
  /** Timestamp when reading started */
  startedAt: string
  /** Timestamp when reading completed (if applicable) */
  completedAt?: string
}

/**
 * Statistics data for story analytics
 */
export interface StoryStatistics {
  /** Story ID */
  storyId: string
  /** Total number of reads */
  totalReads: number
  /** Number of completions */
  completions: number
  /** Number of times good ending was reached */
  goodEndings: number
  /** Number of times bad ending was reached */
  badEndings: number
  /** Average reading time in minutes */
  averageReadingTime: number
  /** Most common choice paths (array of node IDs) */
  popularPaths: string[][]
  /** Last updated timestamp */
  updatedAt: string
}

/**
 * User preferences for the application
 */
export interface UserPreferences {
  /** User ID */
  userId: string
  /** Preferred sort option for story lists */
  defaultSortOption: SortOption
  /** Whether to show tutorial/help messages */
  showTutorials: boolean
  /** Whether to enable sound effects */
  soundEnabled: boolean
  /** Reading speed preference (words per minute) */
  readingSpeed: number
}

// ============================================================================
// FILTER AND QUERY INTERFACES
// ============================================================================

/**
 * Filters for querying stories
 */
export interface StoryFilters {
  /** Filter by status */
  status?: StoryStatus
  /** Filter by theme */
  theme?: string
  /** Filter by format */
  format?: string
  /** Filter by whether published */
  isPublished?: boolean
  /** Search query for title/lesson */
  searchQuery?: string
  /** Sort option */
  sortBy?: SortOption
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number
  /** Number of items per page */
  pageSize: number
}

/**
 * Complete query parameters for fetching stories
 */
export interface StoryQueryParams extends PaginationParams {
  /** Optional filters */
  filters?: StoryFilters
}
