"use client"

/**
 * Story Selection Page (Child Mode) - LIBRARY READING TABLE
 *
 * A beautiful library where children can browse book covers spread on a reading table.
 * Features large, inviting book covers with hover effects.
 */

import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpinnerColor, SpinnerSize } from "@/components/types"
import { api } from "@/lib/api"
import { SortOption, Story } from "@/types"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { mockCompletedStories } from "./StorySelection.page.mock"

export default function StorySelectionPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.RECENT)
  const [useMockData] = useState(true)

  /**
   * Fetch stories
   */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true)
        if (useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setStories(mockCompletedStories.filter((s) => s.isPublished))
        } else {
          const response = await api.stories.getAll({
            limit: 100,
            offset: 0,
            status: "completed",
          })
          if (response.success && response.data) {
            setStories(response.data.stories.filter((s) => s.isPublished))
          }
        }
      } catch (err) {
        console.error("Error fetching stories:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [useMockData])

  // Sort stories
  const sortedStories = [...stories].sort((a, b) => {
    switch (sortBy) {
      case SortOption.RECENT:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case SortOption.POPULAR:
        return b.readCount - a.readCount
      case SortOption.TITLE:
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  /**
   * Get book cover colors based on theme
   */
  const getBookCoverColor = (theme: string, index: number) => {
    const colors = [
      { from: "#8B3A3A", to: "#CD5C5C", accent: "#D4AF37" },
      { from: "#4A6741", to: "#6B8E6B", accent: "#D4AF37" },
      { from: "#5B7C99", to: "#7B92A8", accent: "#FFD700" },
      { from: "#8B7355", to: "#A89885", accent: "#D4AF37" },
      { from: "#7B2A5A", to: "#9B4A7A", accent: "#FFD700" },
    ]
    return colors[index % colors.length]
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner
            size={SpinnerSize.XLarge}
            color={SpinnerColor.Primary}
          />
          <p className="mt-4 text-xl text-text-primary text-body">
            Finding your stories...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div
        className="leather-texture border-b-4 border-book-spine sticky top-0 z-50"
        style={{
          background: "linear-gradient(to bottom, #8B7355, #6B5744)",
          boxShadow: "0 4px 12px rgba(44, 36, 22, 0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <div>
              <button
                onClick={() => router.push("/")}
                className="text-cream hover:text-parchment transition-colors mb-2 flex items-center gap-2 text-ui font-semibold cursor-pointer"
              >
                <span className="text-xl">←</span>
                <span>Home</span>
              </button>
              <h1 className="text-4xl font-bold text-cream embossed text-heading flex items-center gap-3">
                <span>📚</span>
                <span>Choose Your Adventure</span>
              </h1>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-lg paper-texture text-text-primary text-ui border-2 border-leather focus:border-gold focus:outline-none transition-colors font-semibold"
              style={{
                background: "linear-gradient(to bottom, #F5F1E8, #EDE4D5)",
              }}
            >
              <option value={SortOption.RECENT}>Recently Added</option>
              <option value={SortOption.POPULAR}>Most Popular</option>
              <option value={SortOption.TITLE}>A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content - Reading Table */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Empty State */}
        {sortedStories.length === 0 && (
          <motion.div
            className="paper-texture page-shadow rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-text-primary text-heading mb-4">
              No Stories Yet
            </h2>
            <p className="text-lg text-text-secondary text-body mb-8 max-w-md mx-auto">
              Ask a parent to create some wonderful stories for you!
            </p>
          </motion.div>
        )}

        {/* Book Covers Grid */}
        {sortedStories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedStories.map((story, index) => {
              const coverColor = getBookCoverColor(story.theme, index)

              return (
                <motion.button
                  key={story.id}
                  onClick={() => router.push(`/story-reading/${story.id}`)}
                  className="group relative z-0 hover:z-10 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  {/* Book Cover */}
                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(145deg, ${coverColor.from} 0%, ${coverColor.to} 100%)`,
                      boxShadow:
                        "0 8px 24px rgba(44, 36, 22, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)",
                      border: "3px solid rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {/* Leather texture */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          repeating-radial-gradient(
                            circle at 30% 40%,
                            transparent 0,
                            rgba(0, 0, 0, 0.1) 1px,
                            transparent 2px
                          )
                        `,
                      }}
                    />

                    {/* Cover Content */}
                    <div className="absolute inset-0 p-6 flex flex-col">
                      {/* Decorative top border */}
                      <div
                        className="text-center text-2xl mb-4"
                        style={{ color: coverColor.accent }}
                      >
                        ✦ ✦ ✦
                      </div>

                      {/* Title */}
                      <div className="flex-1 flex items-center justify-center">
                        <h3
                          className="text-2xl font-bold text-center leading-tight text-heading"
                          style={{
                            color: "#F5F1E8",
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          {story.title}
                        </h3>
                      </div>

                      {/* Theme badge */}
                      <div
                        className="text-center text-sm font-semibold uppercase tracking-wider py-2 px-4 rounded-lg"
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          color: "#F5F1E8",
                        }}
                      >
                        {story.theme}
                      </div>

                      {/* Decorative bottom border */}
                      <div
                        className="text-center text-2xl mt-4"
                        style={{ color: coverColor.accent }}
                      >
                        ✦ ✦ ✦
                      </div>
                    </div>

                    {/* "New" badge */}
                    {story.readCount === 0 && (
                      <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-ui"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFD700, #FFA500)",
                          color: "#2C2416",
                          boxShadow: "0 2px 8px rgba(255, 215, 0, 0.5)",
                        }}
                      >
                        NEW!
                      </div>
                    )}

                    {/* Read count badge */}
                    {story.readCount > 0 && (
                      <div
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-ui"
                        style={{
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "#FFF",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {story.readCount}
                      </div>
                    )}
                  </div>

                  {/* Book spine/shadow effect */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-3 -z-10 rounded-b-xl"
                    style={{
                      background: `linear-gradient(to bottom, ${coverColor.to}, #5C4A3A)`,
                      transform: "translateY(8px)",
                    }}
                  />

                  {/* Hover details card */}
                  <div className="absolute left-0 right-0 top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div
                      className="paper-texture page-shadow rounded-lg p-4"
                      style={{
                        background:
                          "linear-gradient(to bottom, #F5F1E8, #EDE4D5)",
                      }}
                    >
                      <p className="text-sm text-text-secondary text-body mb-2 line-clamp-2">
                        <strong>Lesson:</strong> {story.lesson}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-muted text-ui">
                        <span>📝 {story.sceneCount} scenes</span>
                        <span className="px-2 py-1 rounded-full bg-forest-green text-cream">
                          Start Reading →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Info Banner */}
        {sortedStories.length > 0 && (
          <motion.div
            className="mt-12 paper-texture page-shadow rounded-xl p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg text-text-secondary text-body">
              <span className="text-2xl mr-2">✨</span>
              Click on any book to start your adventure!
              <span className="text-2xl ml-2">✨</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
