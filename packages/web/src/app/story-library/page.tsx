"use client"

/**
 * Story Library Page (Parent Mode)
 *
 * A comprehensive library management page for parents to view, organize,
 * and manage all their created stories (both completed and drafts).
 */

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Modal } from "@/components/Modal"
import { Toast } from "@/components/Toast"
import {
  ButtonSize,
  ButtonVariant,
  CardPadding,
  ModalSize,
  SpinnerSize,
  ToastVariant,
} from "@/components/types"
import { api } from "@/lib/api"
import { SortOption, Story, StoryStatus } from "@/types"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  mockAllStories,
  mockEmptyStates,
  mockStatistics,
  StoryStatistics,
} from "./StoryLibrary.page.mock"

/**
 * Status filter options
 */
const STATUS_FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  DRAFTS: "drafts",
} as const

type StatusFilter = (typeof STATUS_FILTERS)[keyof typeof STATUS_FILTERS]

/**
 * Sort options for story library
 */
const SORT_OPTIONS = [
  { value: SortOption.RECENT, label: "Recently Updated" },
  { value: "created", label: "Recently Created" },
  { value: SortOption.TITLE, label: "Title (A-Z)" },
  { value: SortOption.READ_COUNT, label: "Most Read" },
] as const

/**
 * Stories per page
 */
const STORIES_PER_PAGE = 20

/**
 * View mode options
 */
enum ViewMode {
  GRID = "grid",
  LIST = "list",
}

/**
 * Story Library Page Component
 */
export default function StoryLibraryPage() {
  const router = useRouter()

  // State
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    STATUS_FILTERS.ALL
  )
  const [sortBy, setSortBy] = useState<string>(SortOption.RECENT)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set())

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false)
  const [statisticsData, setStatisticsData] = useState<StoryStatistics | null>(
    null
  )
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)

  // Operation state
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Toast state
  const [toast, setToast] = useState<{
    message: string
    variant: ToastVariant
  } | null>(null)

  // Mock data toggle
  const [useMockData] = useState(true)

  /**
   * Show toast notification
   */
  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ message, variant })
  }

  /**
   * Debounce search input
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  /**
   * Fetch stories from API or use mock data
   */
  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true)

      if (useMockData) {
        // Use mock data
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStories(mockAllStories)
      } else {
        // Use real API
        const response = await api.stories.getAll({
          limit: 100,
          offset: 0,
        })

        if (response.success && response.data) {
          setStories(response.data.stories)
        }
      }
    } catch (err) {
      console.error("Error fetching stories:", err)
      showToast("Failed to load stories. Please try again.", ToastVariant.Error)
    } finally {
      setIsLoading(false)
    }
  }, [useMockData])

  /**
   * Filter and sort stories
   */
  const filteredAndSortedStories = useMemo(() => {
    let result = [...stories]

    // Apply status filter
    if (statusFilter === STATUS_FILTERS.COMPLETED) {
      result = result.filter((s) => s.status === StoryStatus.COMPLETED)
    } else if (statusFilter === STATUS_FILTERS.DRAFTS) {
      result = result.filter((s) => s.status !== StoryStatus.COMPLETED)
    }

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.lesson.toLowerCase().includes(query) ||
          s.theme.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case SortOption.RECENT:
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        break
      case "created":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case SortOption.TITLE:
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case SortOption.READ_COUNT:
        result.sort((a, b) => b.readCount - a.readCount)
        break
    }

    return result
  }, [stories, statusFilter, debouncedSearch, sortBy])

  /**
   * Paginated stories
   */
  const paginatedStories = useMemo(() => {
    const startIndex = (currentPage - 1) * STORIES_PER_PAGE
    const endIndex = startIndex + STORIES_PER_PAGE
    return filteredAndSortedStories.slice(startIndex, endIndex)
  }, [filteredAndSortedStories, currentPage])

  /**
   * Total pages
   */
  const totalPages = Math.ceil(
    filteredAndSortedStories.length / STORIES_PER_PAGE
  )

  /**
   * Handle story selection
   */
  const handleStorySelect = (storyId: string) => {
    setSelectedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  /**
   * Handle select all
   */
  const handleSelectAll = () => {
    if (selectedStories.size === paginatedStories.length) {
      setSelectedStories(new Set())
    } else {
      setSelectedStories(new Set(paginatedStories.map((s) => s.id)))
    }
  }

  /**
   * Handle read story
   */
  const handleReadStory = (storyId: string) => {
    router.push(`/story-reading/${storyId}`)
  }

  /**
   * Handle edit story
   */
  const handleEditStory = (story: Story) => {
    // Route to appropriate page based on status
    if (story.status === StoryStatus.DRAFT) {
      // If very early draft (few scenes), go to story tree
      if (story.sceneCount < 10) {
        router.push(`/story-tree/${story.id}`)
      } else {
        // Otherwise, might be in character assignment or background setup
        router.push(`/character-assignment/${story.id}`)
      }
    } else if (story.status === StoryStatus.STRUCTURE_FINALIZED) {
      // In scene generation phase
      router.push(`/scene-generation/${story.id}`)
    } else {
      // Completed - allow editing structure
      router.push(`/story-tree/${story.id}`)
    }
  }

  /**
   * Handle duplicate story
   */
  const handleDuplicateStory = async (story: Story) => {
    try {
      setIsDuplicating(true)

      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        const duplicatedStory: Story = {
          ...story,
          id: `story-${Date.now()}`,
          title: `${story.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readCount: 0,
          isPublished: false,
          status: StoryStatus.DRAFT,
        }
        setStories((prev) => [duplicatedStory, ...prev])
        showToast(
          `"${story.title}" duplicated successfully!`,
          ToastVariant.Success
        )
      } else {
        // Real API call
        const response = await fetch(`/api/v1/stories/${story.id}/duplicate`, {
          method: "POST",
        })
        if (response.ok) {
          await fetchStories()
          showToast("Story duplicated successfully!", ToastVariant.Success)
        }
      }
    } catch (err) {
      console.error("Error duplicating story:", err)
      showToast(
        "Failed to duplicate story. Please try again.",
        ToastVariant.Error
      )
    } finally {
      setIsDuplicating(false)
    }
  }

  /**
   * Handle delete story
   */
  const handleDeleteStory = async () => {
    if (!storyToDelete) return

    try {
      setIsDeleting(true)

      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id))
        showToast(
          `"${storyToDelete.title}" deleted successfully.`,
          ToastVariant.Success
        )
      } else {
        // Real API call
        const response = await fetch(`/api/v1/stories/${storyToDelete.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          await fetchStories()
          showToast("Story deleted successfully.", ToastVariant.Success)
        }
      }
    } catch (err) {
      console.error("Error deleting story:", err)
      showToast("Failed to delete story. Please try again.", ToastVariant.Error)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setStoryToDelete(null)
    }
  }

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true)

      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setStories((prev) => prev.filter((s) => !selectedStories.has(s.id)))
        showToast(
          `${selectedStories.size} stories deleted successfully.`,
          ToastVariant.Success
        )
        setSelectedStories(new Set())
      } else {
        // Real API - delete each story
        await Promise.all(
          Array.from(selectedStories).map((id) =>
            fetch(`/api/v1/stories/${id}`, { method: "DELETE" })
          )
        )
        await fetchStories()
        showToast("Stories deleted successfully.", ToastVariant.Success)
        setSelectedStories(new Set())
      }
    } catch (err) {
      console.error("Error deleting stories:", err)
      showToast(
        "Failed to delete stories. Please try again.",
        ToastVariant.Error
      )
    } finally {
      setIsDeleting(false)
      setBulkDeleteModalOpen(false)
    }
  }

  /**
   * Handle view statistics
   */
  const handleViewStatistics = async (story: Story) => {
    try {
      setIsLoadingStats(true)
      setStatisticsModalOpen(true)

      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStatisticsData({ ...mockStatistics, storyId: story.id })
      } else {
        // Real API call
        const response = await fetch(`/api/v1/stories/${story.id}/statistics`)
        if (response.ok) {
          const data = await response.json()
          setStatisticsData(data)
        }
      }
    } catch (err) {
      console.error("Error fetching statistics:", err)
      showToast("Failed to load statistics.", ToastVariant.Error)
      setStatisticsModalOpen(false)
    } finally {
      setIsLoadingStats(false)
    }
  }

  /**
   * Handle share story
   */
  const handleShareStory = async (story: Story) => {
    if (story.status !== StoryStatus.COMPLETED) {
      showToast("Only completed stories can be shared.", ToastVariant.Warning)
      return
    }

    try {
      if (useMockData) {
        const url = `${window.location.origin}/story-reading/${story.id}`
        setShareUrl(url)
        setShareModalOpen(true)
      } else {
        // Real API call
        const response = await fetch(`/api/v1/stories/${story.id}/share`, {
          method: "POST",
        })
        if (response.ok) {
          const data = await response.json()
          setShareUrl(data.shareUrl)
          setShareModalOpen(true)
        }
      }
    } catch (err) {
      console.error("Error generating share link:", err)
      showToast("Failed to generate share link.", ToastVariant.Error)
    }
  }

  /**
   * Handle copy share link
   */
  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast("Link copied to clipboard!", ToastVariant.Success)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      showToast("Failed to copy link.", ToastVariant.Error)
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  /**
   * Get status badge
   */
  const getStatusBadge = (status: StoryStatus) => {
    if (status === StoryStatus.COMPLETED) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          ✓ Completed
        </span>
      )
    } else if (status === StoryStatus.STRUCTURE_FINALIZED) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          ⏳ In Progress
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
          📝 Draft
        </span>
      )
    }
  }

  /**
   * Get theme color
   */
  const getThemeColor = (theme: string): string => {
    const colors: Record<string, string> = {
      Honesty: "bg-blue-500",
      Courage: "bg-red-500",
      Friendship: "bg-pink-500",
      Kindness: "bg-green-500",
      Sharing: "bg-purple-500",
      Teamwork: "bg-yellow-500",
      Gratitude: "bg-orange-500",
      Perseverance: "bg-indigo-500",
      Respect: "bg-teal-500",
      Responsibility: "bg-cyan-500",
    }
    return colors[theme] || "bg-gray-500"
  }

  /**
   * Initial load
   */
  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    let emptyState = mockEmptyStates.noStories

    if (debouncedSearch) {
      emptyState = mockEmptyStates.noSearchResults
    } else if (statusFilter === STATUS_FILTERS.COMPLETED) {
      emptyState = mockEmptyStates.noCompleted
    } else if (statusFilter === STATUS_FILTERS.DRAFTS) {
      emptyState = mockEmptyStates.noDrafts
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-8xl mb-6">{emptyState.icon}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {emptyState.title}
        </h2>
        <p className="text-xl text-gray-600 max-w-lg mb-8">
          {emptyState.message}
        </p>
        {statusFilter === STATUS_FILTERS.ALL && !debouncedSearch && (
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Large}
            onClick={() => router.push("/story-setup")}
          >
            Create New Story
          </Button>
        )}
      </div>
    )
  }

  /**
   * Render story card
   */
  const renderStoryCard = (story: Story) => {
    const isSelected = selectedStories.has(story.id)

    return (
      <div key={story.id} className="relative">
        {/* Selection checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleStorySelect(story.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Select ${story.title}`}
          />
        </div>

        <Card
          image={story.coverImageUrl}
          imageAlt={`Cover for ${story.title}`}
          padding={CardPadding.None}
          hoverable
          selected={isSelected}
          className="h-full"
        >
          <div className="p-5">
            {/* Header with status */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2 mr-2">
                {story.title}
              </h3>
              {getStatusBadge(story.status)}
            </div>

            {/* Theme badge */}
            <div className="mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white ${getThemeColor(
                  story.theme
                )}`}
              >
                {story.theme}
              </span>
            </div>

            {/* Lesson */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {story.lesson}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <span>📄</span>
                {story.sceneCount} scenes
              </span>
              {story.status === StoryStatus.COMPLETED && (
                <span className="flex items-center gap-1">
                  <span>👁️</span>
                  {story.readCount} reads
                </span>
              )}
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-400 mb-4 space-y-1">
              <div>Created: {formatDate(story.createdAt)}</div>
              <div>Updated: {formatDate(story.updatedAt)}</div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {story.status === StoryStatus.COMPLETED && (
                <Button
                  variant={ButtonVariant.Primary}
                  size={ButtonSize.Small}
                  onClick={() => handleReadStory(story.id)}
                  className="flex-1"
                >
                  Read
                </Button>
              )}
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Small}
                onClick={() => handleEditStory(story)}
                className="flex-1"
              >
                Edit
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Small}
                onClick={() => handleDuplicateStory(story)}
                disabled={isDuplicating}
                className="flex-1"
              >
                Duplicate
              </Button>
              {story.status === StoryStatus.COMPLETED && (
                <>
                  <Button
                    variant={ButtonVariant.Secondary}
                    size={ButtonSize.Small}
                    onClick={() => handleViewStatistics(story)}
                    className="flex-1"
                  >
                    Stats
                  </Button>
                  <Button
                    variant={ButtonVariant.Secondary}
                    size={ButtonSize.Small}
                    onClick={() => handleShareStory(story)}
                    className="flex-1"
                  >
                    Share
                  </Button>
                </>
              )}
            </div>

            <div className="mt-2">
              <Button
                variant={ButtonVariant.Danger}
                size={ButtonSize.Small}
                onClick={() => {
                  setStoryToDelete(story)
                  setDeleteModalOpen(true)
                }}
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                My Story Library 📚
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Manage and organize all your stories
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {filteredAndSortedStories.length}{" "}
                {filteredAndSortedStories.length === 1 ? "story" : "stories"}{" "}
                total
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                onClick={() => router.push("/")}
              >
                ← Back to Home
              </Button>
              <Button
                variant={ButtonVariant.Primary}
                size={ButtonSize.Large}
                onClick={() => router.push("/story-setup")}
                className="font-semibold"
              >
                + Create New Story
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => {
                setStatusFilter(STATUS_FILTERS.ALL)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === STATUS_FILTERS.ALL
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => {
                setStatusFilter(STATUS_FILTERS.COMPLETED)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === STATUS_FILTERS.COMPLETED
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => {
                setStatusFilter(STATUS_FILTERS.DRAFTS)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === STATUS_FILTERS.DRAFTS
                  ? "bg-yellow-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title, lesson, or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search stories"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                aria-label="Sort stories"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode(ViewMode.GRID)}
                className={`p-2 rounded ${
                  viewMode === ViewMode.GRID
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Grid view"
                title="Grid view"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode(ViewMode.LIST)}
                className={`p-2 rounded ${
                  viewMode === ViewMode.LIST
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="List view"
                title="List view"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedStories.size > 0 && (
            <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">
                  {selectedStories.size} selected
                </span>
                <Button
                  variant={ButtonVariant.Secondary}
                  size={ButtonSize.Small}
                  onClick={handleSelectAll}
                >
                  {selectedStories.size === paginatedStories.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <Button
                variant={ButtonVariant.Danger}
                size={ButtonSize.Small}
                onClick={() => setBulkDeleteModalOpen(true)}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size={SpinnerSize.Large} />
            <p className="mt-4 text-xl text-gray-600">
              Loading your stories...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          filteredAndSortedStories.length === 0 &&
          renderEmptyState()}

        {/* Story Grid/List */}
        {!isLoading && filteredAndSortedStories.length > 0 && (
          <>
            <div
              className={
                viewMode === ViewMode.GRID
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedStories.map((story) => renderStoryCard(story))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant={ButtonVariant.Secondary}
                  size={ButtonSize.Medium}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant={ButtonVariant.Secondary}
                  size={ButtonSize.Medium}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setStoryToDelete(null)
        }}
        title="Delete Story"
        size={ModalSize.Medium}
        footer={
          <>
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Medium}
              onClick={() => {
                setDeleteModalOpen(false)
                setStoryToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Danger}
              size={ButtonSize.Medium}
              onClick={handleDeleteStory}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Story"}
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>{storyToDelete?.title}</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        title="Delete Multiple Stories"
        size={ModalSize.Medium}
        footer={
          <>
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Medium}
              onClick={() => setBulkDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Danger}
              size={ButtonSize.Medium}
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : `Delete ${selectedStories.size} Stories`}
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>{selectedStories.size}</strong>{" "}
          {selectedStories.size === 1 ? "story" : "stories"}? This action cannot
          be undone.
        </p>
      </Modal>

      {/* Statistics Modal */}
      <Modal
        isOpen={statisticsModalOpen}
        onClose={() => {
          setStatisticsModalOpen(false)
          setStatisticsData(null)
        }}
        title="Story Statistics"
        size={ModalSize.XLarge}
        footer={
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Medium}
            onClick={() => {
              setStatisticsModalOpen(false)
              setStatisticsData(null)
            }}
          >
            Close
          </Button>
        }
      >
        {isLoadingStats ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={SpinnerSize.Large} />
          </div>
        ) : statisticsData ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {statisticsData.totalReads}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Reads</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {statisticsData.averageReadingTime.toFixed(1)} min
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Avg. Reading Time
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {statisticsData.completionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Completion Rate
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {statisticsData.lastRead
                    ? formatDate(statisticsData.lastRead)
                    : "Never"}
                </div>
                <div className="text-sm text-gray-600 mt-1">Last Read</div>
              </div>
            </div>

            {/* Choice Distribution */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Choice Distribution
              </h3>
              <div className="space-y-3">
                {statisticsData.choiceDistribution.map((choice, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">
                        Scene {choice.sceneNumber}: {choice.choiceText}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {choice.percentage.toFixed(1)}% ({choice.selectionCount}
                        )
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Visited Scenes */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Most Visited Scenes
              </h3>
              <div className="space-y-2">
                {statisticsData.sceneVisits
                  .sort((a, b) => b.visitCount - a.visitCount)
                  .slice(0, 10)
                  .map((scene, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        Scene {scene.sceneNumber}: {scene.sceneTitle}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {scene.visitCount} visits
                        </div>
                        <div className="text-xs text-gray-500">
                          {scene.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No statistics available.</p>
        )}
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false)
          setShareUrl("")
        }}
        title="Share Story"
        size={ModalSize.Medium}
        footer={
          <>
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Medium}
              onClick={() => {
                setShareModalOpen(false)
                setShareUrl("")
              }}
            >
              Close
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Medium}
              onClick={handleCopyShareLink}
            >
              Copy Link
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Share this link with others to let them read your story:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <code className="text-sm text-blue-600 break-all">{shareUrl}</code>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          isVisible={!!toast}
          onDismiss={() => setToast(null)}
          duration={4000}
        />
      )}
    </div>
  )
}
