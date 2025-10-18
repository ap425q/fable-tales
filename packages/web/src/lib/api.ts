/**
 * API Client Utility
 *
 * Centralized API client for making requests to the backend
 */

import { API_BASE_URL } from "@/constants"
import { ApiError, ApiResponse, ErrorCode, Story } from "@/types"
import axios, { AxiosError, AxiosInstance } from "axios"
import type {
  BackgroundGenerateItem,
  BackgroundGenerationResponse,
  BackgroundGenerationStatus,
  BackgroundRegenerateResponse,
  BackgroundsListResponse,
  BackgroundUpdateRequest,
  BulkSceneRegenerateResponse,
  CharacterAssignmentData,
  CharacterAssignmentsResponse,
  CharactersListResponse,
  NodeAddRequest,
  NodeUpdateRequest,
  ReadingCompletionRequest,
  ReadingCompletionResponse,
  ReadingProgress,
  ReadingProgressRequest,
  SceneGenerationResponse,
  SceneGenerationStatus,
  SceneRegenerateResponse,
  StoriesListResponse,
  StoryCompletionResponse,
  StoryForReading,
  StoryGenerateRequest,
  StoryGenerateResponse,
  VersionSelectionResponse,
} from "./apiTypes"

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Request interceptor to add auth tokens or other headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor to handle errors uniformly
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = handleApiError(error)
    return Promise.reject(apiError)
  }
)

/**
 * Convert axios errors to standardized ApiError format
 */
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as { error?: ApiError }

    return {
      code: data?.error?.code || ErrorCode.SERVER_ERROR,
      message:
        data?.error?.message ||
        "An error occurred while processing your request",
      details: data?.error?.details,
    }
  } else if (error.request) {
    // Request made but no response received
    return {
      code: ErrorCode.NETWORK_ERROR,
      message:
        "Unable to connect to server. Please check your internet connection.",
    }
  } else {
    // Something else happened
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || "An unexpected error occurred",
    }
  }
}

/**
 * API endpoints and methods
 */
export const api = {
  /**
   * Story endpoints
   */
  stories: {
    /**
     * Generate a new story
     */
    async generate(
      params: StoryGenerateRequest
    ): Promise<ApiResponse<StoryGenerateResponse>> {
      const response = await apiClient.post("/v1/stories/generate", params)
      return response.data
    },

    /**
     * Get story details
     */
    async getById(storyId: string): Promise<ApiResponse<Story>> {
      const response = await apiClient.get(`/v1/stories/${storyId}`)
      return response.data
    },

    /**
     * Get all stories
     */
    async getAll(params?: {
      limit?: number
      offset?: number
      status?: string
    }): Promise<ApiResponse<StoriesListResponse>> {
      const response = await apiClient.get("/v1/stories", { params })
      return response.data
    },

    /**
     * Update a story node
     */
    async updateNode(
      storyId: string,
      nodeId: string,
      data: NodeUpdateRequest
    ): Promise<ApiResponse<{ node: unknown }>> {
      const response = await apiClient.patch(
        `/v1/stories/${storyId}/nodes/${nodeId}`,
        data
      )
      return response.data
    },

    /**
     * Add a new node
     */
    async addNode(
      storyId: string,
      data: NodeAddRequest
    ): Promise<ApiResponse<{ node: unknown }>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/nodes`,
        data
      )
      return response.data
    },

    /**
     * Delete a node
     */
    async deleteNode(
      storyId: string,
      nodeId: string
    ): Promise<
      ApiResponse<{ deletedNodeId: string; affectedNodes: string[] }>
    > {
      const response = await apiClient.delete(
        `/v1/stories/${storyId}/nodes/${nodeId}`
      )
      return response.data
    },

    /**
     * Finalize story structure
     */
    async finalizeStructure(
      storyId: string,
      tree: unknown
    ): Promise<
      ApiResponse<{ storyId: string; status: string; message: string }>
    > {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/finalize-structure`,
        { tree }
      )
      return response.data
    },
  },

  /**
   * Character endpoints
   */
  characters: {
    /**
     * Get preset characters list
     */
    async getAll(): Promise<ApiResponse<CharactersListResponse>> {
      const response = await apiClient.get("/v1/characters")
      return response.data
    },

    /**
     * Save character assignments
     */
    async saveAssignments(
      storyId: string,
      assignments: CharacterAssignmentData[]
    ): Promise<ApiResponse<CharacterAssignmentsResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/character-assignments`,
        { assignments }
      )
      return response.data
    },

    /**
     * Get character assignments
     */
    async getAssignments(
      storyId: string
    ): Promise<ApiResponse<CharacterAssignmentsResponse>> {
      const response = await apiClient.get(
        `/v1/stories/${storyId}/character-assignments`
      )
      return response.data
    },
  },

  /**
   * Background endpoints
   */
  backgrounds: {
    /**
     * Get backgrounds for a story
     */
    async getAll(
      storyId: string
    ): Promise<ApiResponse<BackgroundsListResponse>> {
      const response = await apiClient.get(`/v1/stories/${storyId}/backgrounds`)
      return response.data
    },

    /**
     * Update background description
     */
    async update(
      storyId: string,
      backgroundId: string,
      data: BackgroundUpdateRequest
    ): Promise<ApiResponse<{ background: unknown }>> {
      const response = await apiClient.patch(
        `/v1/stories/${storyId}/backgrounds/${backgroundId}`,
        data
      )
      return response.data
    },

    /**
     * Generate all backgrounds
     */
    async generateAll(
      storyId: string,
      backgrounds: BackgroundGenerateItem[]
    ): Promise<ApiResponse<BackgroundGenerationResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/backgrounds/generate-all`,
        { backgrounds }
      )
      return response.data
    },

    /**
     * Check generation status
     */
    async getGenerationStatus(
      storyId: string,
      jobId?: string
    ): Promise<ApiResponse<BackgroundGenerationStatus>> {
      const response = await apiClient.get(
        `/v1/stories/${storyId}/backgrounds/generation-status`,
        { params: { jobId } }
      )
      return response.data
    },

    /**
     * Regenerate individual background
     */
    async regenerate(
      storyId: string,
      backgroundId: string,
      description?: string
    ): Promise<ApiResponse<BackgroundRegenerateResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/backgrounds/${backgroundId}/regenerate`,
        { description }
      )
      return response.data
    },

    /**
     * Select background version
     */
    async selectVersion(
      storyId: string,
      backgroundId: string,
      versionId: string
    ): Promise<ApiResponse<VersionSelectionResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/backgrounds/${backgroundId}/select-version`,
        { versionId }
      )
      return response.data
    },
  },

  /**
   * Scene image endpoints
   */
  scenes: {
    /**
     * Generate all scene images
     */
    async generateAll(
      storyId: string,
      sceneIds?: string[]
    ): Promise<ApiResponse<SceneGenerationResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/scenes/generate-all-images`,
        { sceneIds }
      )
      return response.data
    },

    /**
     * Check generation status
     */
    async getGenerationStatus(
      storyId: string,
      jobId?: string
    ): Promise<ApiResponse<SceneGenerationStatus>> {
      const response = await apiClient.get(
        `/v1/stories/${storyId}/scenes/generation-status`,
        { params: { jobId } }
      )
      return response.data
    },

    /**
     * Get scene image versions
     */
    async getVersions(
      storyId: string,
      sceneId: string
    ): Promise<
      ApiResponse<{
        sceneId: string
        currentVersionId: string
        versions: unknown[]
      }>
    > {
      const response = await apiClient.get(
        `/v1/stories/${storyId}/scenes/${sceneId}/image-versions`
      )
      return response.data
    },

    /**
     * Regenerate scene image
     */
    async regenerate(
      storyId: string,
      sceneId: string,
      additionalPrompt?: string
    ): Promise<ApiResponse<SceneRegenerateResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/scenes/${sceneId}/regenerate-image`,
        { additionalPrompt }
      )
      return response.data
    },

    /**
     * Select scene image version
     */
    async selectVersion(
      storyId: string,
      sceneId: string,
      versionId: string
    ): Promise<ApiResponse<VersionSelectionResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/scenes/${sceneId}/select-version`,
        { versionId }
      )
      return response.data
    },

    /**
     * Bulk regenerate scenes
     */
    async regenerateMultiple(
      storyId: string,
      sceneIds: string[]
    ): Promise<ApiResponse<BulkSceneRegenerateResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/scenes/regenerate-multiple`,
        { sceneIds }
      )
      return response.data
    },
  },

  /**
   * Complete story
   */
  async completeStory(
    storyId: string,
    title: string
  ): Promise<ApiResponse<StoryCompletionResponse>> {
    const response = await apiClient.post(`/v1/stories/${storyId}/complete`, {
      title,
    })
    return response.data
  },

  /**
   * Reading endpoints
   */
  reading: {
    /**
     * Get story for reading
     */
    async getStory(storyId: string): Promise<ApiResponse<StoryForReading>> {
      const response = await apiClient.get(`/v1/stories/${storyId}/read`)
      return response.data
    },

    /**
     * Get reading progress
     */
    async getProgress(storyId: string): Promise<ApiResponse<ReadingProgress>> {
      const response = await apiClient.get(
        `/v1/stories/${storyId}/reading-progress`
      )
      return response.data
    },

    /**
     * Save reading progress
     */
    async saveProgress(
      storyId: string,
      data: ReadingProgressRequest
    ): Promise<ApiResponse<ReadingProgress>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/reading-progress`,
        data
      )
      return response.data
    },

    /**
     * Record reading completion
     */
    async complete(
      storyId: string,
      data: ReadingCompletionRequest
    ): Promise<ApiResponse<ReadingCompletionResponse>> {
      const response = await apiClient.post(
        `/v1/stories/${storyId}/reading-complete`,
        data
      )
      return response.data
    },
  },
}

export default api
