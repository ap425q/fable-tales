"use client"

/**
 * Story Library Page (Parent Mode) - CLASSIC BOOKSHELF DESIGN
 *
 * A beautiful library with books displayed on wooden shelves.
 * Parents can view, manage, and create stories.
 */

import { LeatherCard } from "@/components/LeatherCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpinnerColor, SpinnerSize } from "@/components/types"
import { api } from "@/lib/api"
import { Story, StoryStatus } from "@/types"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { mockAllStories } from "./StoryLibrary.page.mock"

export default function StoryLibraryPage() {
  const router = useRouter()

  // State
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useMockData] = useState(true)

  /**
   * Fetch stories
   */
  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true)
      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStories(mockAllStories)
      } else {
        const response = await api.stories.getAll({ limit: 100, offset: 0 })
        if (response.success && response.data) {
          setStories(response.data.stories)
        }
      }
    } catch (err) {
      console.error("Error fetching stories:", err)
    } finally {
      setIsLoading(false)
    }
  }, [useMockData])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  /**
   * Get book spine color based on theme
   */
  const getBookColor = (theme: string, index: number) => {
    const colors = [
      { bg: "#8B3A3A", text: "#F5F1E8" }, // Burgundy
      { bg: "#4A6741", text: "#F5F1E8" }, // Forest Green
      { bg: "#5B7C99", text: "#F5F1E8" }, // Antique Blue
      { bg: "#8B7355", text: "#F5F1E8" }, // Leather Brown
      { bg: "#CD5C5C", text: "#F5F1E8" }, // Soft Coral
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
            Loading your library...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header - Leather Binding */}
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
                <span>My Story Library</span>
              </h1>
            </div>

            {/* Create New Story Button */}
            <motion.button
              onClick={() => router.push("/story-setup")}
              className="px-6 py-4 rounded-xl font-bold text-lg text-ui flex items-center gap-2 self-start cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
                color: "#FFF",
                boxShadow: "0 4px 12px rgba(74, 103, 65, 0.4)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 16px rgba(74, 103, 65, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">+</span>
              <span>Create New Story</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Story Count */}
        <div className="mb-6 text-text-secondary text-body">
          {stories.length === 0 ? (
            <span>No stories found</span>
          ) : (
            <span>
              Showing {stories.length}{" "}
              {stories.length === 1 ? "story" : "stories"}
            </span>
          )}
        </div>

        {/* Empty State */}
        {stories.length === 0 && (
          <motion.div
            className="paper-texture page-shadow rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-text-primary text-heading mb-4">
              Your Library is Empty
            </h2>
            <p className="text-lg text-text-secondary text-body mb-8 max-w-md mx-auto">
              Start creating magical stories for your children. Each story is a
              unique adventure waiting to be told!
            </p>
            <motion.button
              onClick={() => router.push("/story-setup")}
              className="px-8 py-4 rounded-xl font-bold text-lg text-ui cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
                color: "#FFF",
                boxShadow: "0 4px 12px rgba(74, 103, 65, 0.4)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Story
            </motion.button>
          </motion.div>
        )}

        {/* Bookshelf - Grid of Book Spines */}
        {stories.length > 0 && (
          <div className="space-y-8">
            {/* Wooden Bookshelf */}
            <div
              className="wood-grain-texture rounded-2xl p-6"
              style={{
                boxShadow:
                  "0 8px 24px rgba(44, 36, 22, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stories.map((story, index) => {
                  const bookColor = getBookColor(story.theme, index)
                  const isCompleted = story.status === StoryStatus.COMPLETED

                  return (
                    <motion.button
                      key={story.id}
                      onClick={() => {
                        if (isCompleted) {
                          // Show story options modal or navigate to edit
                          router.push(`/story-tree/${story.id}`)
                        } else {
                          router.push(`/story-tree/${story.id}`)
                        }
                      }}
                      className="relative group hover:z-10 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    >
                      {/* Book Spine */}
                      <div
                        className="relative h-64 rounded-lg overflow-hidden group-hover:[box-shadow:0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        style={{
                          background: `linear-gradient(145deg, ${bookColor.bg} 0%, ${bookColor.bg}DD 100%)`,
                          boxShadow:
                            "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                          border: "2px solid rgba(0, 0, 0, 0.3)",
                          transition: "box-shadow 0.3s ease-in-out",
                        }}
                      >
                        {/* Leather texture */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `
                              repeating-radial-gradient(
                                circle at 20% 30%,
                                transparent 0,
                                rgba(0, 0, 0, 0.1) 1px,
                                transparent 2px
                              )
                            `,
                          }}
                        />

                        {/* Book Title - Horizontal */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <div
                            className="text-center"
                            style={{
                              color: bookColor.text,
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <div className="text-xs font-bold text-ui mb-2 opacity-70">
                              {story.theme.toUpperCase()}
                            </div>
                            <div className="text-base font-bold text-heading leading-tight">
                              {story.title}
                            </div>
                          </div>

                          {/* Gold decoration */}
                          <div
                            className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs opacity-70"
                            style={{ color: "#D4AF37" }}
                          >
                            ✦
                          </div>
                          <div
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs opacity-70"
                            style={{ color: "#D4AF37" }}
                          >
                            ✦
                          </div>
                        </div>

                        {/* Status Badge */}
                        {!isCompleted && (
                          <div
                            className="absolute top-2 right-2 w-3 h-3 rounded-full"
                            style={{
                              background: "#D4A76A",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                            }}
                            title="Draft"
                          />
                        )}

                        {/* Read count badge */}
                        {story.readCount > 0 && (
                          <div
                            className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-bold text-ui"
                            style={{
                              background: "rgba(0, 0, 0, 0.5)",
                              color: "#FFF",
                            }}
                          >
                            {story.readCount} reads
                          </div>
                        )}
                      </div>

                      {/* Hover Card with Details */}
                      <div className="absolute left-0 right-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <div
                          className="paper-texture page-shadow rounded-lg p-4 text-left"
                          style={{
                            background:
                              "linear-gradient(to bottom, #F5F1E8, #EDE4D5)",
                          }}
                        >
                          <h3 className="font-bold text-text-primary text-body mb-2 line-clamp-2">
                            {story.title}
                          </h3>
                          <p className="text-sm text-text-secondary text-body mb-2 line-clamp-2">
                            Lesson: {story.lesson}
                          </p>
                          <div className="flex items-center justify-between text-xs text-text-muted text-ui">
                            <span>{story.sceneCount} scenes</span>
                            <span>
                              {isCompleted ? "✓ Complete" : "✎ Draft"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Detail Cards View (Optional Alternative) */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-cream text-heading mb-4">
                Recent Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.slice(0, 6).map((story, index) => {
                  const isCompleted = story.status === StoryStatus.COMPLETED

                  return (
                    <motion.div
                      key={`card-${story.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LeatherCard
                        title={story.title}
                        subtitle={story.theme}
                        hoverable
                        onClick={() => router.push(`/story-tree/${story.id}`)}
                        className="h-full"
                      >
                        <div className="space-y-3">
                          <div className="text-cream text-body text-sm leading-relaxed">
                            <strong className="text-cream">Lesson:</strong>{" "}
                            {story.lesson}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-parchment text-ui">
                            <span>📝 {story.sceneCount} scenes</span>
                            <span>👁️ {story.readCount} reads</span>
                          </div>

                          <div className="pt-3 border-t border-dark-leather">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-ui ${
                                isCompleted
                                  ? "bg-forest-green text-cream"
                                  : "bg-warning text-text-primary"
                              }`}
                            >
                              {isCompleted ? "✓ Completed" : "✎ Draft"}
                            </span>
                          </div>
                        </div>
                      </LeatherCard>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
