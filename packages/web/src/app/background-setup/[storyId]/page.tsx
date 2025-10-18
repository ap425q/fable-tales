"use client"

import { Button } from "@/components/Button"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import {
  ButtonSize,
  ButtonVariant,
  SpinnerColor,
  SpinnerSize,
} from "@/components/types"
import { ApiError, GenerationStatus, ImageVersion, Location } from "@/types"
import { useRouter } from "next/navigation"
import { use, useCallback, useEffect, useRef, useState } from "react"
import {
  mockBackgrounds,
  simulateDelay,
  simulateGenerationPolling,
} from "./background-setup.page.mock"

/**
 * Background Setup Page
 *
 * Parents manage story backgrounds:
 * - View locations extracted from story
 * - Edit location names and descriptions
 * - Generate AI background images
 * - View and select image versions
 * - Regenerate individual backgrounds
 */
export default function BackgroundSetupPage({
  params,
}: {
  params: Promise<{ storyId: string }>
}) {
  const router = useRouter()
  const { storyId } = use(params)

  // State management
  const [backgrounds, setBackgrounds] = useState<Location[]>([])
  const [editingDescriptions, setEditingDescriptions] = useState<{
    [key: string]: string
  }>({})
  const [selectedVersionIds, setSelectedVersionIds] = useState<{
    [key: string]: string
  }>({})
  const [sceneTooltips, setSceneTooltips] = useState<{
    [sceneNumber: number]: string
  }>({})

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isBulkGenerating, setIsBulkGenerating] = useState(false)
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>("")

  // Polling state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jobId, setJobId] = useState<string | null>(null)
  const pollCountRef = useRef(0)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save debounce timers
  const saveTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

  /**
   * Load backgrounds on mount
   */
  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        setIsLoading(true)
        setError("")

        // TODO: Replace with actual API call
        // const result = await api.backgrounds.getAll(storyId)
        // if (result.success && result.data) {
        //   setBackgrounds(result.data.backgrounds)
        // }

        // MOCK: Using mock data
        await simulateDelay(800)
        setBackgrounds(mockBackgrounds)

        // Initialize editing state
        const descriptions: { [key: string]: string } = {}
        const selectedVersions: { [key: string]: string } = {}
        mockBackgrounds.forEach((bg) => {
          descriptions[bg.id] = bg.description
          // Set latest version as selected by default
          if (bg.imageVersions.length > 0) {
            selectedVersions[bg.id] =
              bg.imageVersions[bg.imageVersions.length - 1].versionId
          }
        })
        setEditingDescriptions(descriptions)
        setSelectedVersionIds(selectedVersions)

        // TODO: Load scene content for tooltips from story tree
        // const storyResult = await api.stories.getById(storyId)
        // if (storyResult.success && storyResult.data) {
        //   const tooltips: { [sceneNumber: number]: string } = {}
        //   storyResult.data.nodes.forEach(node => {
        //     tooltips[node.sceneNumber] = node.text
        //   })
        //   setSceneTooltips(tooltips)
        // }

        // MOCK: Simulate scene tooltips
        const mockTooltips: { [sceneNumber: number]: string } = {
          1: "The journey begins in the enchanted forest...",
          2: "The royal castle towers before you...",
          3: "Deep in the magical woods, a path appears...",
          4: "The peaceful village welcomes weary travelers...",
          5: "Ancient trees whisper secrets of old...",
          6: "Inside the castle, grand halls echo with history...",
          7: "By the riverside, children play and laugh...",
          8: "The forest grows darker as night approaches...",
          9: "The throne room awaits your arrival...",
          10: "A mysterious cave entrance beckons...",
          11: "Deep within the cavern, treasures glimmer...",
        }
        setSceneTooltips(mockTooltips)
      } catch (err) {
        const apiErr = err as ApiError
        setError(
          apiErr.message || "Failed to load backgrounds. Please try again."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadBackgrounds()
  }, [storyId])

  /**
   * Cleanup polling on unmount
   */
  useEffect(() => {
    const pollInterval = pollIntervalRef
    const saveTimers = saveTimersRef

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
      // Clear all save timers
      Object.values(saveTimers.current).forEach(clearTimeout)
    }
  }, [])

  /**
   * Poll generation status
   */
  const pollGenerationStatus = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const result = await api.backgrounds.getGenerationStatus(storyId, jobId || undefined)
      // if (!result.success || !result.data) return

      // MOCK: Simulate polling
      pollCountRef.current += 1
      const mockStatus = simulateGenerationPolling(pollCountRef.current)

      // Update backgrounds with new status
      setBackgrounds((prev) =>
        prev.map((bg) => {
          const statusItem = mockStatus.backgrounds.find(
            (s) => s.backgroundId === bg.id
          )
          if (!statusItem) return bg

          let newStatus = GenerationStatus.PENDING
          if (statusItem.status === "generating") {
            newStatus = GenerationStatus.GENERATING
          } else if (statusItem.status === "completed") {
            newStatus = GenerationStatus.COMPLETED
          }

          const newVersions = [...bg.imageVersions]
          if (
            statusItem.status === "completed" &&
            statusItem.imageUrl &&
            statusItem.versionId
          ) {
            // Add new version if not already present
            const versionExists = newVersions.some(
              (v) => v.versionId === statusItem.versionId
            )
            if (!versionExists && statusItem.versionId) {
              newVersions.push({
                versionId: statusItem.versionId,
                url: statusItem.imageUrl,
                generatedAt: new Date().toISOString(),
              })
              // Auto-select the newly generated version
              setSelectedVersionIds((prev) => ({
                ...prev,
                [bg.id]: statusItem.versionId!,
              }))
            }
          }

          return {
            ...bg,
            generationStatus: newStatus,
            imageVersions: newVersions,
          }
        })
      )

      // Check if all completed
      if (mockStatus.status === "completed") {
        setIsBulkGenerating(false)
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }
        pollCountRef.current = 0
      }
    } catch (err) {
      console.error("Error polling generation status:", err)
    }
  }, [])

  /**
   * Start polling for generation status
   */
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    pollCountRef.current = 0
    pollIntervalRef.current = setInterval(pollGenerationStatus, 2000)
  }, [pollGenerationStatus])

  /**
   * Handle description change with debounced auto-save
   */
  const handleDescriptionChange = (
    backgroundId: string,
    newDescription: string
  ) => {
    setEditingDescriptions((prev) => ({
      ...prev,
      [backgroundId]: newDescription,
    }))

    // Clear existing timer
    if (saveTimersRef.current[`desc-${backgroundId}`]) {
      clearTimeout(saveTimersRef.current[`desc-${backgroundId}`])
    }

    // Set new timer for auto-save
    saveTimersRef.current[`desc-${backgroundId}`] = setTimeout(() => {
      saveDescriptionChange(backgroundId, newDescription)
    }, 1000)
  }

  /**
   * Save description change to backend
   */
  const saveDescriptionChange = async (
    backgroundId: string,
    newDescription: string
  ) => {
    try {
      // TODO: Replace with actual API call
      // await api.backgrounds.update(storyId, backgroundId, { description: newDescription })

      // MOCK: Update local state
      setBackgrounds((prev) =>
        prev.map((bg) =>
          bg.id === backgroundId ? { ...bg, description: newDescription } : bg
        )
      )
    } catch (err) {
      console.error("Error saving description:", err)
    }
  }

  /**
   * Generate all backgrounds
   */
  const handleGenerateAll = async () => {
    try {
      setIsBulkGenerating(true)
      setError("")

      // Update all backgrounds to generating status
      setBackgrounds((prev) =>
        prev.map((bg) => ({
          ...bg,
          generationStatus:
            bg.generationStatus === GenerationStatus.COMPLETED
              ? bg.generationStatus
              : GenerationStatus.GENERATING,
        }))
      )

      // TODO: Replace with actual API call
      // const result = await api.backgrounds.generateAll(
      //   storyId,
      //   backgrounds.map(bg => ({
      //     backgroundId: bg.id,
      //     description: editingDescriptions[bg.id] || bg.description
      //   }))
      // )
      // if (result.success && result.data) {
      //   setJobId(result.data.jobId)
      // }

      // MOCK: Simulate API call
      await simulateDelay(1000)
      setJobId("mock-job-id")

      // Start polling
      startPolling()
    } catch (err) {
      const apiErr = err as ApiError
      setError(
        apiErr.message || "Failed to start generation. Please try again."
      )
      setIsBulkGenerating(false)

      // Reset backgrounds to pending
      setBackgrounds((prev) =>
        prev.map((bg) => ({
          ...bg,
          generationStatus:
            bg.imageVersions.length > 0
              ? GenerationStatus.COMPLETED
              : GenerationStatus.PENDING,
        }))
      )
    }
  }

  /**
   * Regenerate individual background
   */
  const handleRegenerate = async (backgroundId: string) => {
    try {
      setRegeneratingIds((prev) => new Set(prev).add(backgroundId))
      setError("")

      // Update status to generating
      setBackgrounds((prev) =>
        prev.map((bg) =>
          bg.id === backgroundId
            ? { ...bg, generationStatus: GenerationStatus.GENERATING }
            : bg
        )
      )

      // TODO: Replace with actual API call
      // const result = await api.backgrounds.regenerate(storyId, backgroundId, description)
      // if (result.success && result.data) {
      //   // Add new version
      //   setBackgrounds(prev => prev.map(bg => {
      //     if (bg.id === backgroundId) {
      //       return {
      //         ...bg,
      //         generationStatus: GenerationStatus.COMPLETED,
      //         imageVersions: [...bg.imageVersions, {
      //           versionId: result.data.versionId,
      //           url: result.data.imageUrl,
      //           generatedAt: new Date().toISOString()
      //         }]
      //       }
      //     }
      //     return bg
      //   }))
      // }

      // MOCK: Simulate regeneration
      await simulateDelay(2000)
      const newVersion: ImageVersion = {
        versionId: `v${Date.now()}`,
        url: `https://picsum.photos/seed/${backgroundId}-${Date.now()}/800/600`,
        generatedAt: new Date().toISOString(),
      }

      setBackgrounds((prev) =>
        prev.map((bg) =>
          bg.id === backgroundId
            ? {
                ...bg,
                generationStatus: GenerationStatus.COMPLETED,
                imageVersions: [...bg.imageVersions, newVersion],
              }
            : bg
        )
      )

      // Auto-select the newly generated version
      setSelectedVersionIds((prev) => ({
        ...prev,
        [backgroundId]: newVersion.versionId,
      }))
    } catch (err) {
      const apiErr = err as ApiError
      setError(
        apiErr.message || "Failed to regenerate background. Please try again."
      )

      // Reset status
      setBackgrounds((prev) =>
        prev.map((bg) =>
          bg.id === backgroundId
            ? {
                ...bg,
                generationStatus:
                  bg.imageVersions.length > 0
                    ? GenerationStatus.COMPLETED
                    : GenerationStatus.PENDING,
              }
            : bg
        )
      )
    } finally {
      setRegeneratingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(backgroundId)
        return newSet
      })
    }
  }

  /**
   * Select background version
   */
  const handleSelectVersion = async (
    backgroundId: string,
    versionId: string
  ) => {
    try {
      // Update selected version in state
      setSelectedVersionIds((prev) => ({
        ...prev,
        [backgroundId]: versionId,
      }))

      // TODO: Replace with actual API call
      // await api.backgrounds.selectVersion(storyId, backgroundId, versionId)

      // MOCK: Log selection (in production, this would be saved to backend)
      console.log(
        `Selected version ${versionId} for background ${backgroundId}`
      )
    } catch (err) {
      console.error("Error selecting version:", err)
    }
  }

  /**
   * Get current background image URL (selected version or latest)
   */
  const getCurrentImageUrl = (background: Location): string | null => {
    if (background.imageVersions.length === 0) return null

    // Use selected version if available
    const selectedVersionId = selectedVersionIds[background.id]
    if (selectedVersionId) {
      const selectedVersion = background.imageVersions.find(
        (v) => v.versionId === selectedVersionId
      )
      if (selectedVersion) return selectedVersion.url
    }

    // Fallback to latest version
    return background.imageVersions[background.imageVersions.length - 1].url
  }

  /**
   * Get current version ID (selected version or latest)
   */
  const getCurrentVersionId = (background: Location): string | undefined => {
    if (background.imageVersions.length === 0) return undefined

    // Use selected version if available
    const selectedVersionId = selectedVersionIds[background.id]
    if (selectedVersionId) {
      return selectedVersionId
    }

    // Fallback to latest version
    return background.imageVersions[background.imageVersions.length - 1]
      .versionId
  }

  /**
   * Check if all backgrounds are ready
   */
  const isAllReady = (): boolean => {
    return backgrounds.every(
      (bg) =>
        bg.generationStatus === GenerationStatus.COMPLETED &&
        bg.imageVersions.length > 0
    )
  }

  /**
   * Get count of backgrounds that need generation
   */
  const getGenerationCount = (): number => {
    return backgrounds.filter(
      (bg) =>
        bg.generationStatus === GenerationStatus.PENDING ||
        bg.imageVersions.length === 0
    ).length
  }

  /**
   * Navigate to scene generation page
   */
  const handleNext = () => {
    if (!isAllReady()) {
      setError("Please generate all backgrounds before continuing")
      return
    }
    // TODO: Update route when scene generation page is created
    router.push(`/scene-generation/${storyId}`)
  }

  /**
   * Navigate back to character assignment
   */
  const handleBack = () => {
    router.push(`/character-assignment/${storyId}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner
            size={SpinnerSize.XLarge}
            color={SpinnerColor.Primary}
            centered
          />
          <p className="mt-6 text-xl text-gray-700 font-semibold">
            Loading backgrounds...
          </p>
        </div>
      </div>
    )
  }

  const generationCount = getGenerationCount()
  const isReady = isAllReady()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 font-heading">
              Story Backgrounds
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create stunning backgrounds for your story locations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Progress
                </span>
                <span className="text-2xl font-bold text-amber-600">
                  {
                    backgrounds.filter(
                      (bg) =>
                        bg.generationStatus === GenerationStatus.COMPLETED &&
                        bg.imageVersions.length > 0
                    ).length
                  }{" "}
                  / {backgrounds.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (backgrounds.filter(
                        (bg) =>
                          bg.generationStatus === GenerationStatus.COMPLETED &&
                          bg.imageVersions.length > 0
                      ).length /
                        backgrounds.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              {isReady && (
                <div className="mt-3 flex items-center justify-center text-green-600 font-bold">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All backgrounds ready!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-md p-5"
            role="alert"
          >
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Generate All Button */}
        <div className="mb-10 text-center">
          <button
            onClick={handleGenerateAll}
            disabled={isBulkGenerating || generationCount === 0}
            className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {isBulkGenerating
              ? "Generating Backgrounds..."
              : generationCount === 0
              ? "✓ All Backgrounds Generated"
              : `Generate ${generationCount} Background${
                  generationCount !== 1 ? "s" : ""
                }`}
          </button>
        </div>

        {/* Background Cards */}
        <div className="space-y-8 mb-12">
          {backgrounds.map((background) => {
            const isGenerating =
              background.generationStatus === GenerationStatus.GENERATING
            const isRegenerating = regeneratingIds.has(background.id)
            const hasImage = background.imageVersions.length > 0
            const currentImageUrl = getCurrentImageUrl(background)
            const currentVersionId = getCurrentVersionId(background)

            return (
              <div
                key={background.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl"
              >
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Left Column - Image */}
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
                      {isGenerating || isRegenerating ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                          <div className="text-center">
                            <svg
                              className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-3"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <p className="text-indigo-600 font-semibold">
                              Creating magic...
                            </p>
                          </div>
                        </div>
                      ) : !currentImageUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                          <div className="text-center px-4">
                            <svg
                              className="w-20 h-20 text-gray-300 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-gray-500 font-medium text-lg">
                              No image yet
                            </p>
                          </div>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentImageUrl}
                          alt={background.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Version History */}
                    {hasImage && background.imageVersions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Version History ({background.imageVersions.length})
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1">
                          {background.imageVersions.map((version, index) => (
                            <button
                              key={version.versionId}
                              onClick={() =>
                                handleSelectVersion(
                                  background.id,
                                  version.versionId
                                )
                              }
                              className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                                version.versionId === currentVersionId
                                  ? "border-3 border-indigo-500 ring-4 ring-indigo-200 scale-105"
                                  : "border-2 border-gray-300 hover:border-indigo-300 opacity-70 hover:opacity-100"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={version.url}
                                alt={`Version ${
                                  background.imageVersions.length - index
                                }`}
                                className="w-full h-full object-cover"
                              />
                              <div
                                className={`absolute bottom-0 left-0 right-0 text-white text-xs py-0.5 text-center font-semibold ${
                                  version.versionId === currentVersionId
                                    ? "bg-indigo-600"
                                    : "bg-black bg-opacity-60"
                                }`}
                              >
                                v{background.imageVersions.length - index}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-5">
                    {/* Location Name */}
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {background.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Used in scenes:</span>
                        <span className="ml-2">
                          {background.sceneNumbers.map((sceneNum, index) => (
                            <span key={sceneNum}>
                              <span
                                className="relative group inline-block cursor-help"
                                title={sceneTooltips[sceneNum] || ""}
                              >
                                <span className="text-indigo-600 hover:text-indigo-800 font-semibold">
                                  {sceneNum}
                                </span>
                                {sceneTooltips[sceneNum] && (
                                  <span className="invisible group-hover:visible absolute left-0 top-6 z-50 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                                    <span className="font-bold">
                                      Scene {sceneNum}:
                                    </span>{" "}
                                    {sceneTooltips[sceneNum]}
                                  </span>
                                )}
                              </span>
                              {index < background.sceneNumbers.length - 1 &&
                                ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>

                    {/* Description Editor */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location Description
                      </label>
                      <textarea
                        value={
                          editingDescriptions[background.id] ||
                          background.description
                        }
                        onChange={(e) =>
                          handleDescriptionChange(background.id, e.target.value)
                        }
                        placeholder="Describe this location in vivid detail..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-gray-700"
                        rows={5}
                        maxLength={300}
                      />
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <span>Be descriptive for better results</span>
                        <span className="font-medium">
                          {
                            (
                              editingDescriptions[background.id] ||
                              background.description
                            ).length
                          }{" "}
                          / 300
                        </span>
                      </div>
                    </div>

                    {/* Status and Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      {/* Status Badge */}
                      <div>
                        {background.generationStatus ===
                          GenerationStatus.COMPLETED && hasImage ? (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Ready
                          </div>
                        ) : isGenerating ? (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                            <svg
                              className="animate-spin w-4 h-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Generating...
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Pending
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {hasImage ? (
                        <button
                          onClick={() => handleRegenerate(background.id)}
                          disabled={isRegenerating || isGenerating}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Regenerate
                        </button>
                      ) : (
                        !isGenerating && (
                          <Button
                            variant={ButtonVariant.Primary}
                            size={ButtonSize.Small}
                            onClick={() => handleRegenerate(background.id)}
                            disabled={!editingDescriptions[background.id]}
                          >
                            <svg
                              className="w-4 h-4 mr-2 inline"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Generate
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto pt-8 border-t-2 border-amber-200">
          <button
            onClick={handleBack}
            disabled={isBulkGenerating}
            className="px-6 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-amber-400 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Characters
          </button>

          <button
            onClick={handleNext}
            disabled={!isReady || isBulkGenerating}
            className="px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
          >
            <span>Generate Scene Images</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Help Banner */}
        {!isReady && (
          <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-md">
            <div className="flex items-start">
              <svg
                className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-blue-900 font-bold text-lg mb-3">
                  Quick Tips
                </p>
                <ul className="text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>
                      <strong>Edit descriptions</strong> to customize each
                      location&apos;s visual style
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>
                      <strong>Generate multiple versions</strong> to find the
                      perfect background
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>
                      <strong>Click version thumbnails</strong> to switch
                      between generated options
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>
                      All {backgrounds.length} backgrounds must be generated
                      before continuing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Generation Modal */}
      {isBulkGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
            <LoadingSpinner
              size={SpinnerSize.Large}
              color={SpinnerColor.Primary}
              centered
            />
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Creating Your Backgrounds
            </h3>
            <div className="mt-4 text-4xl font-bold text-indigo-600">
              {
                backgrounds.filter(
                  (bg) => bg.generationStatus === GenerationStatus.COMPLETED
                ).length
              }{" "}
              / {backgrounds.length}
            </div>
            <p className="mt-3 text-gray-600">
              AI is painting your story&apos;s world...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              This may take a few moments
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
