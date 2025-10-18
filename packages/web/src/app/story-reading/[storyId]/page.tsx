"use client"

/**
 * Story Reading Page (Child Mode)
 *
 * An engaging, interactive reading experience for children with:
 * - Book-like layout with images and text
 * - Choice-driven branching narrative
 * - Bad ending handling with encouragement
 * - Good ending celebration
 * - Reading assistance features
 * - Auto-save progress
 */

import { Button } from "@/components/Button"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import {
  ButtonSize,
  ButtonVariant,
  SpinnerColor,
  SpinnerSize,
} from "@/components/types"
import api from "@/lib/api"
import type { ChoiceMade, ReadingNode, StoryForReading } from "@/lib/apiTypes"
import { NodeType } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { mockReadingProgress, mockStoryReadData } from "./page.mock"

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

  const loadStory = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // In development, use mock data
      const useMockData = process.env.NODE_ENV === "development"

      if (useMockData) {
        // Use mock data
        setStory(mockStoryReadData as StoryForReading)

        // Load saved progress or start from beginning
        const savedProgress = mockReadingProgress
        if (savedProgress && savedProgress.currentNodeId) {
          const node = mockStoryReadData.nodes.find(
            (n) => n.id === savedProgress.currentNodeId
          )
          if (node) {
            setCurrentNode(node as ReadingNode)
            setVisitedNodes(savedProgress.visitedNodeIds)
            setChoicesMade(savedProgress.choicesMade as ChoiceMade[])
          } else {
            // Start from beginning
            const startNode = mockStoryReadData.nodes.find(
              (n) => n.id === mockStoryReadData.startNodeId
            )
            setCurrentNode(startNode as ReadingNode)
          }
        } else {
          // Start from beginning
          const startNode = mockStoryReadData.nodes.find(
            (n) => n.id === mockStoryReadData.startNodeId
          )
          setCurrentNode(startNode as ReadingNode)
        }
      } else {
        // Load from API
        const [storyResponse, progressResponse] = await Promise.all([
          api.reading.getStory(storyId),
          api.reading.getProgress(storyId).catch(() => null),
        ])

        if (!storyResponse.success || !storyResponse.data) {
          throw new Error("Failed to load story")
        }

        const storyData = storyResponse.data
        setStory(storyData)

        // Load progress or start from beginning
        if (progressResponse?.success && progressResponse.data) {
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
        }
      }
    } catch (err) {
      console.error("Error loading story:", err)
      setError("Failed to load story. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
      img.src = url
      img.onload = () => {
        setPreloadedImages((prev) => new Set(prev).add(url))
      }
    })
  }, [currentNode, story])

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

      // In development, just log
      if (process.env.NODE_ENV === "development") {
        console.log("Progress saved (mock):", progressData)
      } else {
        await api.reading.saveProgress(storyId, progressData)
      }

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
    if (visitedNodes.length === 0 || !story) return

    // Find previous node
    const previousNodeId =
      visitedNodes.length > 0
        ? visitedNodes[visitedNodes.length - 1]
        : story.startNodeId

    const previousNode = story.nodes.find((n) => n.id === previousNodeId)
    if (previousNode) {
      setTransitionDirection("backward")
      setCurrentNode(previousNode)
      setVisitedNodes(visitedNodes.slice(0, -1))

      // Remove last choice
      if (choicesMade.length > 0) {
        setChoicesMade(choicesMade.slice(0, -1))
      }

      progressNeedsSaveRef.current = true
    }
  }

  /**
   * Record story completion
   */
  const recordCompletion = async (endingNodeId: string) => {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("Story completed (mock):", endingNodeId)
      } else {
        await api.reading.complete(storyId, { endingNodeId })
      }
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
   * Handle font size change
   */
  const handleFontSizeChange = (delta: number) => {
    setPreferences((prev) => ({
      ...prev,
      fontSize: Math.max(16, Math.min(32, prev.fontSize + delta)),
    }))
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100">
        <div className="text-center">
          <LoadingSpinner
            size={SpinnerSize.XLarge}
            color={SpinnerColor.Primary}
          />
          <p className="mt-4 text-xl text-gray-700">Loading your story...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !story || !currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't load the story. Please try again."}
          </p>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Large}
            onClick={() => router.push("/")}
          >
            Go Back Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Story Title */}
          <div className="flex items-center space-x-4">
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => router.push("/")}
              icon={<span className="text-xl">←</span>}
              ariaLabel="Exit story"
            >
              Exit
            </Button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {story.title}
            </h1>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-md mx-4">
            <div className="text-sm text-gray-600 mb-1 text-center">
              Scene {progress.current} / {progress.total}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={handleBack}
              disabled={visitedNodes.length === 0}
              icon={<span className="text-lg">↶</span>}
              ariaLabel="Go back"
            >
              {""}
            </Button>
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="p-2 hover:bg-gray-100 rounded-lg text-lg font-bold"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange(2)}
              className="p-2 hover:bg-gray-100 rounded-lg text-lg font-bold"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
            transitionDirection === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }`}
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Image */}
            <div className="lg:w-[45%] relative bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-6">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <LoadingSpinner
                    size={SpinnerSize.Large}
                    color={SpinnerColor.Primary}
                  />
                </div>
              )}
              <img
                src={currentNode.imageUrl}
                alt={currentNode.title}
                className="max-w-full max-h-[500px] object-contain rounded-2xl shadow-lg"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>

            {/* Right Side - Text and Choices */}
            <div className="lg:w-[55%] flex flex-col p-8 lg:p-12">
              {/* Scene Number */}
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4 self-start">
                Scene {currentNode.sceneNumber}
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                {currentNode.title}
              </h2>

              {/* Story Text */}
              <div
                className="flex-1 mb-8 overflow-y-auto"
                style={{
                  fontSize: `${preferences.fontSize}px`,
                  lineHeight: 1.8,
                }}
              >
                <p className="text-gray-700 leading-relaxed">
                  {currentNode.text}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-4">
                {currentNode.choices.length === 0 ? (
                  // No choices - ending node
                  <div className="text-center">
                    {currentNode.type === NodeType.GOOD_ENDING ? (
                      <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    ) : currentNode.type === NodeType.BAD_ENDING ? (
                      <div className="text-6xl mb-4">😔</div>
                    ) : null}
                  </div>
                ) : currentNode.choices.length === 1 ? (
                  // Single choice - Next button
                  <Button
                    variant={ButtonVariant.Primary}
                    size={ButtonSize.Large}
                    onClick={() =>
                      handleChoiceSelect(
                        currentNode.choices[0].id!,
                        currentNode.choices[0].nextNodeId!
                      )
                    }
                    fullWidth
                    icon={<span className="text-2xl">→</span>}
                    className="text-xl py-6 animate-pulse"
                  >
                    Continue
                  </Button>
                ) : (
                  // Multiple choices
                  <>
                    <div className="text-center text-lg font-semibold text-gray-700 mb-4">
                      What should happen next?
                    </div>
                    {currentNode.choices.map((choice, index) => {
                      const colors = [
                        "bg-blue-500 hover:bg-blue-600",
                        "bg-green-500 hover:bg-green-600",
                        "bg-yellow-500 hover:bg-yellow-600",
                      ]
                      const emojis = ["💙", "💚", "💛"]

                      return (
                        <button
                          key={choice.id}
                          onClick={() =>
                            handleChoiceSelect(choice.id!, choice.nextNodeId!)
                          }
                          className={`w-full ${
                            colors[index % 3]
                          } text-white px-6 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-between group`}
                        >
                          <span className="text-3xl mr-4">
                            {emojis[index % 3]}
                          </span>
                          <span className="flex-1 text-left">
                            {choice.text}
                          </span>
                          <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </button>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bad Ending Modal */}
      {showBadEndingModal && currentNode.type === NodeType.BAD_ENDING && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Hmm, maybe there's a better way?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {currentNode.lessonMessage ||
                  "Let's think about this choice and try again!"}
              </p>
              <Button
                variant={ButtonVariant.Success}
                size={ButtonSize.Large}
                onClick={handleTryAgain}
                fullWidth
                icon={<span className="text-2xl">🔄</span>}
                className="text-xl py-6"
              >
                Try Again!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Good Ending Celebration Modal */}
      {showCelebration && currentNode.type === NodeType.GOOD_ENDING && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in relative overflow-hidden">
            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-3xl animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                >
                  {
                    ["🎉", "⭐", "💖", "🌟", "✨"][
                      Math.floor(Math.random() * 5)
                    ]
                  }
                </div>
              ))}
            </div>

            <div className="text-center relative z-10">
              <div className="text-8xl mb-6 animate-bounce">🎊</div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">
                Amazing! You did it!
              </h3>
              <p className="text-2xl text-gray-700 mb-6">
                You made wonderful choices and completed the story!
              </p>

              {/* Lesson Highlight */}
              <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
                <div className="text-lg font-semibold text-purple-600 mb-2">
                  What You Learned:
                </div>
                <p className="text-xl text-gray-800 leading-relaxed">
                  {currentNode.lessonMessage || story.lesson}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant={ButtonVariant.Primary}
                  size={ButtonSize.Large}
                  onClick={() => {
                    setShowCelebration(false)
                    loadStory() // Restart story
                  }}
                  icon={<span className="text-2xl">🔄</span>}
                  className="text-lg"
                >
                  Read Again
                </Button>
                <Button
                  variant={ButtonVariant.Success}
                  size={ButtonSize.Large}
                  onClick={() => router.push("/")}
                  icon={<span className="text-2xl">📚</span>}
                  className="text-lg"
                >
                  Choose Another Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }

        .animate-float {
          animation: float 5s linear forwards;
        }
      `}</style>
    </div>
  )
}
