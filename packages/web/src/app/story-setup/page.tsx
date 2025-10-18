"use client"

import { Input } from "@/components/Input"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { InputVariant, SpinnerColor, SpinnerSize } from "@/components/types"
import { api } from "@/lib/api"
import { ApiError } from "@/types"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { mockFormExamples } from "./story-setup.page.mock"

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
      // Call API to generate story
      const response = await api.stories.generate({
        lesson: formData.lesson.trim(),
        theme: formData.theme.trim() || "General adventure",
        storyFormat: formData.storyFormat.trim() || "Classic story",
        characterCount: 4, // Fixed as per requirements
      })

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-lg">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 font-heading">
            Create Your Magical Story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tell us what lesson you'd like to teach, and our AI will create a
            personalized interactive story with branching choices and multiple
            endings!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6 mb-8 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 text-white">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-lg text-teal-900 font-bold mb-3">
                ✨ Your story will include:
              </p>
              <ul className="text-teal-800 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Up to 4 unique characters</strong> that your child
                    will love
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>15-20 interactive scenes</strong> with beautiful
                    illustrations
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Multiple choice paths</strong> for interactive
                    learning
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Good and bad endings</strong> with valuable lessons
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
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
                className="bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-md p-5 flex items-start animate-slide-in-right"
                role="alert"
              >
                <svg
                  className="w-6 h-6 text-red-600 mr-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-red-900 font-bold text-lg">Error</p>
                  <p className="text-red-700 mt-1">{apiError}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
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
                    <span>Creating Your Story...</span>
                  </>
                ) : (
                  <>
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
                    <span>Generate Magical Story</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading State Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-4 text-center animate-scale-in">
              <LoadingSpinner
                size={SpinnerSize.XLarge}
                color={SpinnerColor.Primary}
                centered
              />
              <h3 className="mt-8 text-2xl font-bold text-gray-900 font-heading">
                Creating your magical story...
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Our AI is crafting a personalized story just for you. This
                usually takes about 30 seconds.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-3 text-amber-600">
                <svg
                  className="animate-pulse w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">
                  Please wait while magic happens...
                </span>
                <svg
                  className="animate-pulse w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Example Prompts Section */}
        <div className="mt-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500 text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Need inspiration? Try these examples:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockFormExamples.map((example, index) => (
              <button
                key={example.id}
                type="button"
                onClick={() => {
                  setFormData(example.formData)
                }}
                disabled={isLoading}
                className="text-left p-6 rounded-xl border-2 border-purple-200 bg-white hover:border-purple-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">
                      {example.title}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
