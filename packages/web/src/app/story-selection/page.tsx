"use client"

/**
 * Story Selection Page (Child Mode)
 *
 * A visual library page for children to browse and select completed stories to read.
 * Features colorful cards, simple filtering, and child-friendly interactions.
 */

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Toast } from "@/components/Toast"
import {
  ButtonSize,
  ButtonVariant,
  CardPadding,
  SpinnerSize,
  ToastVariant,
} from "@/components/types"
import { api } from "@/lib/api"
import { SortOption, Story } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  mockCompletedStories,
  mockEmptyState,
} from "./StorySelection.page.mock"

/**
 * Sort options for story list
 */
const SORT_OPTIONS = [
  { value: SortOption.RECENT, label: "Recently Added" },
  { value: SortOption.POPULAR, label: "Most Popular" },
  { value: SortOption.TITLE, label: "A to Z" },
] as const

/**
 * Number of stories to load per page
 */
const STORIES_PER_PAGE = 12

/**
 * Story Selection Page Component
 */
export default function StorySelectionPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.RECENT)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [useMockData] = useState(true) // Toggle for development

  /**
   * Fetch stories from API or use mock data
   */
  const fetchStories = async (
    reset: boolean = false,
    newSortBy?: SortOption
  ) => {
    try {
      const currentOffset = reset ? 0 : offset
      const currentSortBy = newSortBy ?? sortBy

      if (useMockData) {
        // Use mock data for development
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
        const sortedStories = sortStories(mockCompletedStories, currentSortBy)
        const paginatedStories = sortedStories.slice(
          currentOffset,
          currentOffset + STORIES_PER_PAGE
        )

        if (reset) {
          setStories(paginatedStories)
          setOffset(STORIES_PER_PAGE)
        } else {
          setStories((prev) => [...prev, ...paginatedStories])
          setOffset((prev) => prev + STORIES_PER_PAGE)
        }

        setHasMore(currentOffset + STORIES_PER_PAGE < sortedStories.length)
      } else {
        // Use real API
        const response = await api.stories.getAll({
          limit: STORIES_PER_PAGE,
          offset: currentOffset,
          status: "completed",
        })

        if (response.success && response.data) {
          const newStories = response.data.stories.filter((s) => s.isPublished)

          if (reset) {
            setStories(newStories)
            setOffset(STORIES_PER_PAGE)
          } else {
            setStories((prev) => [...prev, ...newStories])
            setOffset((prev) => prev + STORIES_PER_PAGE)
          }

          setHasMore(response.data.hasMore)
        }
      }
    } catch (err) {
      console.error("Error fetching stories:", err)
      setError("Oops! We couldn't load the stories. Please try again.")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  /**
   * Sort stories based on selected option
   */
  const sortStories = (storiesToSort: Story[], sortOption: SortOption) => {
    const sorted = [...storiesToSort]

    switch (sortOption) {
      case SortOption.RECENT:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case SortOption.POPULAR:
        return sorted.sort((a, b) => b.readCount - a.readCount)
      case SortOption.TITLE:
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return sorted
    }
  }

  /**
   * Handle sort change
   */
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    setIsLoading(true)
    fetchStories(true, newSortBy)
  }

  /**
   * Handle load more
   */
  const handleLoadMore = () => {
    setIsLoadingMore(true)
    fetchStories(false)
  }

  /**
   * Handle story selection
   */
  const handleStoryClick = (storyId: string) => {
    router.push(`/story-reading?storyId=${storyId}`)
  }

  /**
   * Handle back to role selection
   */
  const handleBackClick = () => {
    router.push("/")
  }

  /**
   * Get theme color for badge
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
    fetchStories(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                onClick={handleBackClick}
                aria-label="Back to home"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Choose Your Adventure! 🚀
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Pick a story and let's start reading!
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xl font-semibold text-gray-800">
            {stories.length} {stories.length === 1 ? "story" : "stories"}{" "}
            available
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-select"
              className="text-lg font-medium text-gray-700"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 text-lg border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer transition-all hover:border-purple-400"
              aria-label="Sort stories"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size={SpinnerSize.Large} />
            <p className="mt-4 text-xl text-gray-600">Loading stories...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && stories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-9xl mb-6">{mockEmptyState.icon}</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {mockEmptyState.title}
            </h2>
            <p className="text-2xl text-gray-600 max-w-md">
              {mockEmptyState.message}
            </p>
          </div>
        )}

        {/* Story Grid */}
        {!isLoading && stories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  image={story.coverImageUrl}
                  imageAlt={`Cover image for ${story.title}`}
                  hoverable
                  onClick={() => handleStoryClick(story.id)}
                  padding={CardPadding.None}
                  className="transform transition-all duration-200 hover:scale-105"
                >
                  <div className="p-5">
                    {/* Story Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {story.title}
                    </h3>

                    {/* Lesson Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white ${getThemeColor(
                          story.theme
                        )}`}
                      >
                        About: {story.theme}
                      </span>
                    </div>

                    {/* Story Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>📖 {story.sceneCount} scenes</span>
                      <span>⭐ {story.readCount} reads</span>
                    </div>

                    {/* Read Button */}
                    <Button
                      variant={ButtonVariant.Primary}
                      size={ButtonSize.Large}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStoryClick(story.id)
                      }}
                      className="w-full text-lg font-bold"
                      aria-label={`Read ${story.title}`}
                    >
                      Read Story 📚
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant={ButtonVariant.Secondary}
                  size={ButtonSize.Large}
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-4 text-lg font-semibold"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size={SpinnerSize.Small} />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Load More Stories"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Error Toast */}
      <Toast
        message={error || ""}
        variant={ToastVariant.Error}
        isVisible={!!error}
        onDismiss={() => setError(null)}
        duration={5000}
      />
    </div>
  )
}
