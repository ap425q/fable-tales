"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import {
  ButtonSize,
  ButtonVariant,
  InputVariant,
  SpinnerColor,
  SpinnerSize,
} from "@/components/types"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
// import { api } from "@/lib/api"
import { ApiError } from "@/types"
import {
  mockFormExamples,
  mockStoryGenerateResponse,
  simulateDelay,
} from "./story-setup.page.mock"

/**
 * Form data interface
 */
interface FormData {
  lesson: string
  theme: string
  storyFormat: string
}

/**
 * Form errors interface
 */
interface FormErrors {
  lesson?: string
  theme?: string
  storyFormat?: string
}

/**
 * Character limits for inputs
 */
const CHARACTER_LIMITS = {
  LESSON: 200,
  THEME: 150,
  FORMAT: 150,
}

/**
 * Story Setup Page
 *
 * This is the entry point for the parent mode story creation flow.
 * Parents input educational goals and preferences for AI story generation.
 */
export default function StorySetupPage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<FormData>({
    lesson: "",
    theme: "",
    storyFormat: "",
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string>("")

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Update form field value
   */
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError("")
    }
  }

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate lesson (required, min 5 characters)
    if (!formData.lesson.trim()) {
      newErrors.lesson = "Please enter a lesson or moral for your story"
    } else if (formData.lesson.trim().length < 5) {
      newErrors.lesson = "Lesson must be at least 5 characters long"
    } else if (formData.lesson.length > CHARACTER_LIMITS.LESSON) {
      newErrors.lesson = `Lesson cannot exceed ${CHARACTER_LIMITS.LESSON} characters`
    }

    // Validate theme (optional but has max length)
    if (formData.theme.length > CHARACTER_LIMITS.THEME) {
      newErrors.theme = `Theme cannot exceed ${CHARACTER_LIMITS.THEME} characters`
    }

    // Validate story format (optional but has max length)
    if (formData.storyFormat.length > CHARACTER_LIMITS.FORMAT) {
      newErrors.storyFormat = `Story format cannot exceed ${CHARACTER_LIMITS.FORMAT} characters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous API errors
    setApiError("")

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Uncomment the API call below when backend is ready
      // Call API to generate story
      // const response = await api.stories.generate({
      //   lesson: formData.lesson.trim(),
      //   theme: formData.theme.trim() || "General adventure",
      //   storyFormat: formData.storyFormat.trim() || "Classic story",
      //   characterCount: 4, // Fixed as per requirements
      // })

      // MOCK: Using mock data for development
      await simulateDelay(2000) // Simulate API delay
      const response = mockStoryGenerateResponse

      if (response.success && response.data) {
        // Navigate to story tree editing page with story ID
        const storyId = response.data.storyId
        router.push(`/story-tree/${storyId}`)
      } else {
        // Handle unexpected response format
        setApiError("Failed to generate story. Please try again.")
      }
    } catch (error) {
      // Handle API errors
      const apiErr = error as ApiError
      setApiError(
        apiErr.message ||
          "An error occurred while generating your story. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create Your Magical Story
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us what lesson you'd like to teach your child, and our AI will
            create a personalized interactive story with branching choices and
            multiple endings!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
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
            <p className="text-blue-800 font-medium">
              Your story will include:
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Up to 4 unique characters</li>
              <li>• 15-20 interactive scenes</li>
              <li>• Multiple choice paths</li>
              <li>• Good and bad endings with lessons</li>
            </ul>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lesson Input */}
            <div>
              <Input
                label="Lesson or Moral"
                variant={InputVariant.Textarea}
                value={formData.lesson}
                onChange={(value) => handleFieldChange("lesson", value)}
                placeholder='e.g., "Honesty is important", "Be kind to others", "Lying is bad"'
                error={errors.lesson}
                required
                rows={3}
                maxLength={CHARACTER_LIMITS.LESSON}
                showCharacterCount
                disabled={isLoading}
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                What important lesson or value do you want to teach your child?
              </p>
            </div>

            {/* Theme Input */}
            <div>
              <Input
                label="Preferred Theme"
                variant={InputVariant.Textarea}
                value={formData.theme}
                onChange={(value) => handleFieldChange("theme", value)}
                placeholder='e.g., "Space adventure", "Forest animals", "Ocean exploration", "Magic school"'
                error={errors.theme}
                rows={2}
                maxLength={CHARACTER_LIMITS.THEME}
                showCharacterCount
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional: What setting or world would you like the story to take
                place in?
              </p>
            </div>

            {/* Story Format Input */}
            <div>
              <Input
                label="Desired Story Format"
                variant={InputVariant.Textarea}
                value={formData.storyFormat}
                onChange={(value) => handleFieldChange("storyFormat", value)}
                placeholder='e.g., "Good triumphs over evil", "Aesop&apos;s fable style", "Coming-of-age story", "Friendship story"'
                error={errors.storyFormat}
                rows={2}
                maxLength={CHARACTER_LIMITS.FORMAT}
                showCharacterCount
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional: What narrative style or structure would you prefer?
              </p>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
                role="alert"
              >
                <svg
                  className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{apiError}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Large}
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Creating Your Story..." : "Generate Story"}
              </Button>
            </div>
          </form>
        </div>

        {/* Loading State Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
              <LoadingSpinner
                size={SpinnerSize.XLarge}
                color={SpinnerColor.Primary}
                centered
              />
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Creating your magical story...
              </h3>
              <p className="mt-3 text-gray-600">
                Our AI is crafting a personalized story just for you. This
                usually takes about 30 seconds.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg
                  className="animate-pulse w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Please wait while magic happens...</span>
              </div>
            </div>
          </div>
        )}

        {/* Example Prompts Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need inspiration? Try these examples:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockFormExamples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => {
                  setFormData(example.formData)
                }}
                disabled={isLoading}
                className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-medium text-gray-900">{example.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {example.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
