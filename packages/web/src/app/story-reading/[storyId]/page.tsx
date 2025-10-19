"use client"

/**
 * Story Reading Page (Child Mode) - CLASSIC BOOK DESIGN
 *
 * An immersive, book-like reading experience with:
 * - Realistic book layout with left and right pages
 * - Paper textures and book spine
 * - Beautiful choice buttons styled as embossed paper
 * - Bookmark-style progress indicator
 * - Page turn animations
 * - Bad ending encouragement modals
 * - Good ending celebration with confetti
 */

import { BookPage } from "@/components/BookPage"
import { ChoiceButton, ContinueButton } from "@/components/ChoiceButton"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ProgressRibbon } from "@/components/ProgressRibbon"
import { SpinnerColor, SpinnerSize } from "@/components/types"
import api from "@/lib/api"
import type { ChoiceMade, ReadingNode, StoryForReading } from "@/lib/apiTypes"
import { getSceneImageUrl } from "@/lib/imageUtils"
import { NodeType } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import NextImage from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Reading assistance preferences
interface ReadingPreferences {
  fontSize: number
  autoAdvance: boolean
  backgroundMusic: boolean
  soundEffects: boolean
}

export default function StoryReadingPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.storyId as string

  // State management
  const [story, setStory] = useState<StoryForReading | null>(null)
  const [currentNode, setCurrentNode] = useState<ReadingNode | null>(null)
  const [visitedNodes, setVisitedNodes] = useState<string[]>([])
  const [choicesMade, setChoicesMade] = useState<ChoiceMade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showBadEndingModal, setShowBadEndingModal] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward")

  // Reading preferences
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    fontSize: 20,
    autoAdvance: false,
    backgroundMusic: false,
    soundEffects: true,
  })

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressNeedsSaveRef = useRef(false)

  // Preload next images
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())

  /**
   * Load story data
   */
  useEffect(() => {
    loadStory()
  }, [storyId])

  const loadStory = async (skipProgress: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      // Load from API
      const [storyResponse, progressResponse] = await Promise.all([
        api.reading.getStory(storyId),
        skipProgress
          ? null
          : api.reading.getProgress(storyId).catch(() => null),
      ])

      if (!storyResponse.success || !storyResponse.data) {
        throw new Error("Failed to load story")
      }

      const storyData = storyResponse.data
      setStory(storyData)

      // Load progress or start from beginning
      if (!skipProgress && progressResponse?.success && progressResponse.data) {
        const progress = progressResponse.data
        const node = storyData.nodes.find(
          (n) => n.id === progress.currentNodeId
        )
        if (node) {
          setCurrentNode(node)
          setVisitedNodes(progress.visitedNodeIds)
          setChoicesMade(progress.choicesMade)
        } else {
          // Start from beginning
          const startNode = storyData.nodes.find(
            (n) => n.id === storyData.startNodeId
          )
          setCurrentNode(startNode || null)
        }
      } else {
        // Start from beginning
        const startNode = storyData.nodes.find(
          (n) => n.id === storyData.startNodeId
        )
        setCurrentNode(startNode || null)
        setVisitedNodes([])
        setChoicesMade([])
      }
    } catch (err) {
      console.error("Error loading story:", err)
      setError("Failed to load story. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset image loading state when current node changes
   */
  useEffect(() => {
    if (currentNode) {
      setImageLoading(true)
    }
  }, [currentNode?.id])

  /**
   * Stop audio when changing nodes
   */
  useEffect(() => {
    // Stop and reset audio when node changes
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [currentNode?.id])

  /**
   * Preload images for smoother transitions
   */
  useEffect(() => {
    if (!currentNode || !story) return

    const imagesToPreload: string[] = []

    // Preload images for all choice destinations
    currentNode.choices.forEach((choice) => {
      const nextNode = story.nodes.find((n) => n.id === choice.nextNodeId)
      if (
        nextNode &&
        nextNode.imageUrl &&
        !preloadedImages.has(nextNode.imageUrl)
      ) {
        imagesToPreload.push(nextNode.imageUrl)
      }
    })

    // Preload images
    imagesToPreload.forEach((url) => {
      const img = new Image()
      img.src = getSceneImageUrl(url)
      img.onload = () => {
        setPreloadedImages((prev) => new Set(prev).add(url))
      }
    })
  }, [currentNode, story, preloadedImages])

  /**
   * Auto-save progress with debouncing
   */
  useEffect(() => {
    if (!progressNeedsSaveRef.current || !currentNode || !story) return

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer for auto-save after 2 seconds of inactivity
    autoSaveTimerRef.current = setTimeout(() => {
      saveProgress()
    }, 2000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [currentNode, visitedNodes, choicesMade])

  /**
   * Save progress on page exit
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (progressNeedsSaveRef.current) {
        saveProgress()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  /**
   * Save reading progress
   */
  const saveProgress = async () => {
    if (!currentNode || !story) return

    try {
      const progressData = {
        currentNodeId: currentNode.id,
        visitedNodeIds: visitedNodes,
        choicesMade: choicesMade,
      }

      await api.reading.saveProgress(storyId, progressData)

      progressNeedsSaveRef.current = false
    } catch (err) {
      console.error("Error saving progress:", err)
    }
  }

  /**
   * Handle choice selection
   */
  const handleChoiceSelect = (choiceId: string, nextNodeId: string) => {
    if (!story) return

    // Play sound effect
    if (preferences.soundEffects) {
      playSound("click")
    }

    // Find next node
    const nextNode = story.nodes.find((n) => n.id === nextNodeId)
    if (!nextNode) {
      console.error("Next node not found:", nextNodeId)
      return
    }

    // Update state
    const newChoicesMade = [
      ...choicesMade,
      { nodeId: currentNode!.id, choiceId },
    ]
    const newVisitedNodes = [...visitedNodes, nextNodeId]

    setChoicesMade(newChoicesMade)
    setVisitedNodes(newVisitedNodes)
    setTransitionDirection("forward")
    progressNeedsSaveRef.current = true

    // Check if bad ending
    if (nextNode.type === NodeType.BAD_ENDING) {
      // Small delay for transition
      setTimeout(() => {
        setCurrentNode(nextNode)
        setShowBadEndingModal(true)
        if (preferences.soundEffects) {
          playSound("sad")
        }
      }, 300)
    } else if (nextNode.type === NodeType.GOOD_ENDING) {
      // Navigate to next node
      setCurrentNode(nextNode)

      // Show celebration after a brief moment
      setTimeout(() => {
        setShowCelebration(true)
        recordCompletion(nextNode.id)
        if (preferences.soundEffects) {
          playSound("celebration")
        }
      }, 1000)
    } else {
      // Normal transition
      setCurrentNode(nextNode)
    }
  }

  /**
   * Handle try again from bad ending
   */
  const handleTryAgain = () => {
    if (!currentNode || !story) return

    setShowBadEndingModal(false)

    // Go back to the previous choice node
    const previousNodeId = currentNode.previousNodeId
    if (previousNodeId) {
      const previousNode = story.nodes.find((n) => n.id === previousNodeId)
      if (previousNode) {
        setTransitionDirection("backward")
        setCurrentNode(previousNode)

        // Remove the bad choice from history
        const lastChoiceIndex = choicesMade.findLastIndex(
          (c) => c.nodeId === previousNodeId
        )
        if (lastChoiceIndex !== -1) {
          setChoicesMade(choicesMade.slice(0, lastChoiceIndex))
        }

        // Remove bad ending from visited nodes
        setVisitedNodes(visitedNodes.filter((id) => id !== currentNode.id))

        progressNeedsSaveRef.current = true
      }
    }
  }

  /**
   * Handle back button
   */
  const handleBack = () => {
    if (!story || !currentNode) return

    // If we're at the start node, don't go back
    if (currentNode.id === story.startNodeId) return

    // Find previous node from choice history
    let previousNodeId: string | undefined

    // Look at the last choice made to find which node we were at before
    if (choicesMade.length > 0) {
      // The nodeId in the last choice is where we were before making that choice
      previousNodeId = choicesMade[choicesMade.length - 1].nodeId
    } else if (currentNode.previousNodeId) {
      // Fallback to the parent node if no choices made yet
      previousNodeId = currentNode.previousNodeId
    }

    if (!previousNodeId) return

    const previousNode = story.nodes.find((n) => n.id === previousNodeId)
    if (previousNode) {
      setTransitionDirection("backward")
      setCurrentNode(previousNode)

      // Remove the current node from visited nodes
      const currentNodeIndex = visitedNodes.indexOf(currentNode.id)
      if (currentNodeIndex !== -1) {
        setVisitedNodes(visitedNodes.slice(0, currentNodeIndex))
      }

      // Remove last choice
      setChoicesMade(choicesMade.slice(0, -1))

      progressNeedsSaveRef.current = true
    }
  }

  /**
   * Record story completion
   */
  const recordCompletion = async (endingNodeId: string) => {
    try {
      await api.reading.complete(storyId, { endingNodeId })
    } catch (err) {
      console.error("Error recording completion:", err)
    }
  }

  /**
   * Play sound effect
   */
  const playSound = (type: "click" | "celebration" | "sad") => {
    // Placeholder for sound effect implementation
    // In a real app, you'd play actual audio files here
    console.log(`Playing sound: ${type}`)
  }

  /**
   * Toggle audio playback
   */
  const toggleAudioPlayback = () => {
    if (!currentNode?.audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(currentNode.audioUrl)
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false)
      })
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  /**
   * Calculate progress
   */
  const calculateProgress = () => {
    if (!story) return { current: 0, total: 0, percentage: 0 }

    const total = story.nodes.length
    const current = visitedNodes.length + 1 // +1 for current node
    const percentage = Math.round((current / total) * 100)

    return { current, total, percentage }
  }

  const progress = calculateProgress()

  // Calculate current scene number based on actual position in reading path
  const currentSceneNumber = visitedNodes.length + 1

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <LoadingSpinner
            size={SpinnerSize.XLarge}
            color={SpinnerColor.Primary}
          />
          <p className="mt-6 text-xl text-text-primary text-body">
            Opening your storybook...
          </p>
          <div className="mt-4 text-sm text-text-muted text-ui">
            Preparing pages and illustrations
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !story || !currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center max-w-md paper-texture page-shadow rounded-2xl p-12">
          <div className="text-6xl mb-6">📖</div>
          <h2 className="text-3xl font-bold text-text-primary text-heading mb-4">
            Oops! Book not found
          </h2>
          <p className="text-lg text-text-secondary text-body mb-8">
            {error ||
              "We couldn't find this story. Let's go back and choose another one."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-leather text-cream rounded-xl font-semibold text-lg hover:bg-dark-leather transition-all duration-200 shadow-lg hover:shadow-xl text-ui cursor-pointer"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Navigation Bar - Leather Bookshelf Style */}
      <div
        className="leather-texture sticky top-0 z-50 border-b-4 border-book-spine"
        style={{
          background: "linear-gradient(to bottom, #8B7355, #6B5744)",
          boxShadow: "0 4px 12px rgba(44, 36, 22, 0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Exit Button & Title */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2 bg-parchment text-text-primary rounded-lg hover:bg-aged-paper transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 text-ui font-semibold cursor-pointer"
                aria-label="Exit story"
              >
                <span className="text-xl">←</span>
                <span className="hidden sm:inline">Exit</span>
              </button>

              <h1 className="text-xl font-bold text-cream embossed text-heading truncate hidden md:block">
                {story.title}
              </h1>
            </div>

            {/* Center: Progress Ribbon */}
            <div className="flex-1 max-w-md hidden lg:block">
              <ProgressRibbon
                progress={progress.percentage}
                current={progress.current}
                total={progress.total}
                label="Scene"
              />
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleBack}
                disabled={
                  !currentNode ||
                  (currentNode.id === story?.startNodeId &&
                    visitedNodes.length === 0)
                }
                className="flex items-center gap-2 px-4 py-2 bg-parchment text-text-primary rounded-lg hover:bg-aged-paper disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-ui font-bold cursor-pointer"
                aria-label="Go back one page"
                title="Previous page"
              >
                <span className="hidden sm:inline">Previous Page</span>
              </button>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-3 lg:hidden">
            <ProgressRibbon
              progress={progress.percentage}
              current={progress.current}
              total={progress.total}
              label="Scene"
            />
          </div>
        </div>
      </div>

      {/* Main Reading Area - Book Layout */}
      <div className="py-8 px-4 lg:py-12">
        <AnimatePresence mode="wait">
          <BookPage
            key={currentNode.id}
            pageKey={currentNode.id}
            transitionDirection={transitionDirection}
            showSpine={true}
            leftContent={
              // Left Page: Illustration
              <div
                className="h-full flex flex-col items-center justify-center relative"
                key={currentNode.id}
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <LoadingSpinner
                      size={SpinnerSize.Large}
                      color={SpinnerColor.Primary}
                    />
                  </div>
                )}
                <div className="relative w-full h-full max-h-[550px]">
                  <NextImage
                    key={currentNode.id}
                    src={getSceneImageUrl(currentNode.imageUrl)}
                    alt={currentNode.title}
                    fill
                    className="object-contain rounded-lg"
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(44, 36, 22, 0.2))",
                    }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            }
            rightContent={
              // Right Page: Text and Choices
              <div className="h-full flex flex-col" key={currentNode.id}>
                {/* Scene Badge and Audio Control */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    key={`badge-${currentNode.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #8B3A3A, #CD5C5C)",
                      color: "#FFF",
                      boxShadow: "0 2px 6px rgba(139, 58, 58, 0.4)",
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-ui">Scene {currentSceneNumber}</span>
                  </motion.div>

                  {/* Audio Play/Pause Button */}
                  {currentNode.audioUrl && (
                    <motion.button
                      key={`audio-${currentNode.id}`}
                      onClick={toggleAudioPlayback}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 cursor-pointer"
                      style={{
                        background: isPlaying
                          ? "linear-gradient(135deg, #6B8E6B, #4A6741)"
                          : "linear-gradient(135deg, #8B7355, #6B5744)",
                        color: "#FFF",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={
                        isPlaying ? "Pause narration" : "Play narration"
                      }
                      title={isPlaying ? "Pause narration" : "Play narration"}
                    >
                      <span className="text-xl">{isPlaying ? "⏸️" : "▶️"}</span>
                      <span className="hidden sm:inline text-ui">
                        {isPlaying ? "Pause" : "Listen"}
                      </span>
                    </motion.button>
                  )}
                </div>

                {/* Title */}
                <motion.h2
                  key={`title-${currentNode.id}`}
                  className="text-3xl lg:text-4xl font-bold text-text-primary mb-6 text-heading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentNode.title}
                </motion.h2>

                {/* Story Text */}
                <motion.div
                  key={`text-${currentNode.id}`}
                  className="flex-1 mb-6 overflow-y-auto custom-scrollbar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p
                    className="text-text-primary leading-relaxed text-body"
                    style={{
                      fontSize: `${preferences.fontSize}px`,
                      lineHeight: 1.8,
                    }}
                  >
                    {currentNode.text}
                  </p>
                </motion.div>

                {/* Choices Section */}
                <motion.div
                  key={`choices-${currentNode.id}`}
                  className="space-y-8 mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentNode.choices.length === 0 ? (
                    // Ending node
                    <div
                      className="text-center py-6"
                      key={`ending-section-${currentNode.id}`}
                    >
                      {currentNode.type === NodeType.GOOD_ENDING ? (
                        <motion.div
                          key={`ending-${currentNode.id}`}
                          className="text-6xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        >
                          🎉
                        </motion.div>
                      ) : currentNode.type === NodeType.BAD_ENDING ? (
                        <div className="text-6xl">💭</div>
                      ) : null}
                    </div>
                  ) : currentNode.choices.length === 1 ? (
                    // Single choice - Continue button
                    <div key={`single-choice-${currentNode.id}`}>
                      <ContinueButton
                        onClick={() =>
                          handleChoiceSelect(
                            currentNode.choices[0].id!,
                            currentNode.choices[0].nextNodeId!
                          )
                        }
                      />
                    </div>
                  ) : (
                    // Multiple choices
                    <div key={`multi-choices-${currentNode.id}`}>
                      <div className="text-center text-lg font-semibold text-text-primary mb-6 text-heading">
                        What should happen next?
                      </div>
                      <div className="space-y-6">
                        {currentNode.choices.map((choice, index) => (
                          <ChoiceButton
                            key={choice.id}
                            text={choice.text}
                            index={index}
                            onClick={() =>
                              handleChoiceSelect(choice.id!, choice.nextNodeId!)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            }
          />
        </AnimatePresence>
      </div>

      {/* Bad Ending Modal */}
      <AnimatePresence>
        {showBadEndingModal && currentNode.type === NodeType.BAD_ENDING && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="paper-texture page-shadow rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 text-burgundy text-2xl opacity-50">
                ✦
              </div>
              <div className="absolute top-4 right-4 text-burgundy text-2xl opacity-50">
                ✦
              </div>
              <div className="absolute bottom-4 left-4 text-burgundy text-2xl opacity-50">
                ✦
              </div>
              <div className="absolute bottom-4 right-4 text-burgundy text-2xl opacity-50">
                ✦
              </div>

              <div className="text-center relative z-10">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  💭
                </motion.div>

                <h3 className="text-2xl font-bold text-text-primary mb-4 text-heading">
                  Hmm, let's think about this...
                </h3>

                <p className="text-lg text-text-secondary mb-8 text-body leading-relaxed">
                  {currentNode.lessonMessage ||
                    "Every choice teaches us something new! Sometimes we learn the most from trying different paths. Shall we explore another way?"}
                </p>

                <button
                  onClick={handleTryAgain}
                  className="w-full px-8 py-5 rounded-xl font-bold text-xl transition-all duration-200 text-ui flex items-center justify-center gap-3 cursor-pointer"
                  style={{
                    background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
                    color: "#FFF",
                    boxShadow: "0 4px 12px rgba(74, 103, 65, 0.4)",
                  }}
                >
                  <span className="text-2xl">🔄</span>
                  <span>Try a Different Path!</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Good Ending Celebration Modal */}
      <AnimatePresence>
        {showCelebration && currentNode.type === NodeType.GOOD_ENDING && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-3xl p-8 max-w-2xl w-full relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #FFF8E1 0%, #FFE8A0 50%, #FFD700 100%)",
                boxShadow: "0 20px 60px rgba(212, 175, 55, 0.4)",
              }}
              initial={{ scale: 0.5, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.7 }}
            >
              {/* Confetti Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-20px`,
                    }}
                    animate={{
                      y: [0, window.innerHeight],
                      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: "easeIn",
                    }}
                  >
                    {
                      ["🎉", "⭐", "💖", "🌟", "✨", "🎊"][
                        Math.floor(Math.random() * 6)
                      ]
                    }
                  </motion.div>
                ))}
              </div>

              <div className="text-center relative z-10">
                <motion.div
                  className="text-8xl mb-6"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: 3,
                  }}
                >
                  🎊
                </motion.div>

                <h3 className="text-4xl font-bold text-text-primary mb-4 text-heading">
                  Amazing! You did it!
                </h3>

                <p className="text-2xl text-text-secondary mb-8 text-body">
                  You made wonderful choices and completed the story!
                </p>

                {/* Lesson Highlight */}
                <div
                  className="paper-texture page-shadow rounded-2xl p-6 mb-8"
                  style={{
                    background: "linear-gradient(to bottom, #F5F1E8, #EDE4D5)",
                  }}
                >
                  <div className="text-lg font-semibold text-burgundy mb-2 text-ui">
                    💡 What You Learned:
                  </div>
                  <p className="text-xl text-text-primary leading-relaxed text-body">
                    {currentNode.lessonMessage || story.lesson}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowCelebration(false)
                      loadStory(true) // Restart story from beginning
                    }}
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 text-ui flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "linear-gradient(145deg, #8B7355, #6B5744)",
                      color: "#FFF",
                      boxShadow: "0 4px 12px rgba(139, 115, 85, 0.4)",
                    }}
                  >
                    <span className="text-2xl">🔄</span>
                    <span>Read Again</span>
                  </button>

                  <button
                    onClick={() => router.push("/")}
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 text-ui flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
                      color: "#FFF",
                      boxShadow: "0 4px 12px rgba(74, 103, 65, 0.4)",
                    }}
                  >
                    <span className="text-2xl">📚</span>
                    <span>More Stories</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
