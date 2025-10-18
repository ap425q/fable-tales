"use client"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import {
  ButtonSize,
  ButtonVariant,
  CardPadding,
  SpinnerColor,
  SpinnerSize,
} from "@/components/types"
import { CharacterRole } from "@/lib/apiTypes"
import { ApiError, PresetCharacter } from "@/types"
import { useRouter } from "next/navigation"
import React, { use, useEffect, useState } from "react"
import {
  mockCharactersResponse,
  mockStoryRoles,
  simulateDelay,
} from "./character-assignment.page.mock"

/**
 * Character assignment state
 * Maps roleId to presetCharacterId
 */
interface AssignmentMap {
  [roleId: string]: string
}

/**
 * Character Assignment Page
 *
 * Parents assign preset character images to story roles using drag-and-drop
 * or click-to-assign interactions.
 */
export default function CharacterAssignmentPage({
  params,
}: {
  params: Promise<{ storyId: string }>
}) {
  const router = useRouter()
  const { storyId } = use(params)

  // State management
  const [presetCharacters, setPresetCharacters] = useState<PresetCharacter[]>(
    []
  )
  const [storyRoles, setStoryRoles] = useState<CharacterRole[]>([])
  const [assignments, setAssignments] = useState<AssignmentMap>({})
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  )
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [draggedCharacter, setDraggedCharacter] = useState<string | null>(null)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string>("")

  /**
   * Load preset characters and story roles on mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError("")

        // TODO: Replace with actual API calls
        // const charactersResult = await api.characters.getPresetCharacters()
        // const rolesResult = await api.stories.getCharacterRoles(storyId)
        // const assignmentsResult = await api.stories.getCharacterAssignments(storyId)

        // MOCK: Using mock data
        await simulateDelay(800)
        const charactersResult = mockCharactersResponse
        const rolesResult = {
          success: true,
          data: { characters: mockStoryRoles },
        }

        if (charactersResult.success && charactersResult.data) {
          setPresetCharacters(charactersResult.data.characters)
        }

        if (rolesResult.success && rolesResult.data) {
          setStoryRoles(rolesResult.data.characters)
        }
      } catch (err) {
        const apiErr = err as ApiError
        setError(
          apiErr.message || "Failed to load character data. Please try again."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [storyId])

  /**
   * Get preset character by ID
   */
  const getCharacterById = (characterId: string): PresetCharacter | null => {
    return presetCharacters.find((c) => c.id === characterId) || null
  }

  /**
   * Check if a character is already assigned to any role
   */
  const isCharacterAssigned = (characterId: string): boolean => {
    return Object.values(assignments).includes(characterId)
  }

  /**
   * Get the role ID that a character is assigned to (if any)
   */
  const getAssignedRoleId = (characterId: string): string | null => {
    const entry = Object.entries(assignments).find(
      ([, charId]) => charId === characterId
    )
    return entry ? entry[0] : null
  }

  /**
   * Calculate assignment progress
   */
  const getProgress = (): { completed: number; total: number } => {
    return {
      completed: Object.keys(assignments).length,
      total: storyRoles.length,
    }
  }

  /**
   * Check if all roles are assigned
   */
  const isComplete = (): boolean => {
    return Object.keys(assignments).length === storyRoles.length
  }

  /**
   * Handle character selection (Click Method 1)
   */
  const handleCharacterSelect = (characterId: string) => {
    // If character is already assigned, don't allow selection
    if (isCharacterAssigned(characterId)) {
      return
    }

    setSelectedCharacter(characterId)
    setSelectedRole(null) // Clear role selection
  }

  /**
   * Handle role slot click (Click Method 2)
   */
  const handleRoleClick = (roleId: string) => {
    // If a character is selected, assign it
    if (selectedCharacter) {
      assignCharacterToRole(selectedCharacter, roleId)
      setSelectedCharacter(null)
    } else {
      // Just select the role for highlighting
      setSelectedRole(roleId)
    }
  }

  /**
   * Assign a character to a role
   */
  const assignCharacterToRole = (characterId: string, roleId: string) => {
    // Check if character is already assigned elsewhere
    if (isCharacterAssigned(characterId)) {
      setError("This character is already assigned to another role")
      setTimeout(() => setError(""), 3000)
      return
    }

    // Assign the character
    setAssignments((prev) => ({
      ...prev,
      [roleId]: characterId,
    }))

    // Clear selections
    setSelectedCharacter(null)
    setSelectedRole(null)
  }

  /**
   * Remove character assignment from a role
   */
  const handleRemoveAssignment = (roleId: string) => {
    setAssignments((prev) => {
      const newAssignments = { ...prev }
      delete newAssignments[roleId]
      return newAssignments
    })
  }

  /**
   * Handle drag start
   */
  const handleDragStart = (characterId: string) => {
    setDraggedCharacter(characterId)
  }

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent, roleId: string) => {
    e.preventDefault() // Allow drop
    setHoveredRole(roleId)
  }

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setHoveredRole(null)
  }

  /**
   * Handle drop
   */
  const handleDrop = (e: React.DragEvent, roleId: string) => {
    e.preventDefault()

    if (draggedCharacter) {
      assignCharacterToRole(draggedCharacter, roleId)
    }

    setDraggedCharacter(null)
    setHoveredRole(null)
  }

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedCharacter(null)
    setHoveredRole(null)
  }

  /**
   * Save assignments and proceed to next step
   */
  const handleSaveAndContinue = async () => {
    if (!isComplete()) {
      setError("Please assign all roles before continuing")
      return
    }

    try {
      setIsSaving(true)
      setError("")

      // TODO: Replace with actual API call when backend is ready
      // Format assignments for API
      // const assignmentData = Object.entries(assignments).map(
      //   ([roleId, characterId]) => ({
      //     characterRoleId: roleId,
      //     presetCharacterId: characterId,
      //   })
      // )
      // await api.characters.saveAssignments(storyId, assignmentData)

      // MOCK: Simulate API call
      await simulateDelay(1000)

      // Navigate to background setup page
      // TODO: Update route when background setup page is created
      router.push(`/background-setup/${storyId}`)
    } catch (err) {
      const apiErr = err as ApiError
      setError(
        apiErr.message || "Failed to save assignments. Please try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Navigate back to story tree editor
   */
  const handleBack = () => {
    router.push(`/story-tree/${storyId}`)
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
            Loading character gallery...
          </p>
        </div>
      </div>
    )
  }

  const progress = getProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 font-heading">
            Choose Your Characters
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Select preset characters for each role in your story. Click a
            character and then click a role, or drag and drop characters onto
            role slots.
          </p>

          {/* Progress Indicator */}
          <div className="inline-flex items-center bg-white rounded-2xl px-8 py-4 shadow-xl border-2 border-teal-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-600 font-semibold">
                  Assignment Progress
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {progress.completed} / {progress.total} Assigned
                </div>
              </div>
            </div>
            {isComplete() && (
              <div className="ml-6 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="max-w-4xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-md p-5 flex items-start animate-slide-in-right"
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
            <p className="text-red-800 font-medium text-lg">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Character Gallery (40%) */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">
                  Character Gallery
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Click or drag a character to assign them to a role below
              </p>

              {/* Character Grid */}
              <div className="grid grid-cols-2 gap-6 max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-visible pr-4 px-4 py-3">
                {presetCharacters.map((character) => {
                  const isSelected = selectedCharacter === character.id
                  const isAssigned = isCharacterAssigned(character.id)
                  const assignedRole = getAssignedRoleId(character.id)

                  return (
                    <div
                      key={character.id}
                      className={`relative ${
                        isSelected ? "z-10" : "z-0"
                      } hover:z-10`}
                      draggable={!isAssigned}
                      onDragStart={() =>
                        !isAssigned && handleDragStart(character.id)
                      }
                      onDragEnd={handleDragEnd}
                    >
                      <Card
                        image={character.imageUrl}
                        imageAlt={character.name}
                        padding={CardPadding.Small}
                        hoverable={!isAssigned}
                        selected={isSelected}
                        onClick={() =>
                          !isAssigned && handleCharacterSelect(character.id)
                        }
                        className={`${
                          isAssigned
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        } ${
                          draggedCharacter === character.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <p className="font-semibold text-gray-900">
                              {character.name}
                            </p>
                            {isAssigned && assignedRole && (
                              <svg
                                className="w-4 h-4 text-green-600 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Role Assignment (60%) */}
          <div className="lg:w-3/5">
            <div className="space-y-4">
              {storyRoles.map((role) => {
                const assignedCharacterId = assignments[role.id]
                const assignedCharacter = assignedCharacterId
                  ? getCharacterById(assignedCharacterId)
                  : null
                const isHovered = hoveredRole === role.id
                const isRoleSelected = selectedRole === role.id

                return (
                  <div
                    key={role.id}
                    className={`bg-white rounded-2xl border-2 shadow-lg p-6 transition-all duration-200 ${
                      isHovered
                        ? "ring-4 ring-purple-400 border-purple-400 shadow-xl scale-[1.02]"
                        : "border-gray-100"
                    } ${
                      isRoleSelected
                        ? "ring-2 ring-purple-300 border-purple-300"
                        : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, role.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, role.id)}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Role Information */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {role.role}
                          </h3>
                          {assignedCharacter && (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                              Assigned
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{role.description}</p>

                        {/* Assignment Display */}
                        {assignedCharacter ? (
                          <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={assignedCharacter.imageUrl}
                                alt={assignedCharacter.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-lg">
                                {assignedCharacter.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {assignedCharacter.description}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRoleClick(role.id)}
                            className={`w-full border-3 border-dashed rounded-xl p-8 transition-all duration-200 ${
                              selectedCharacter
                                ? "border-purple-400 bg-purple-50 hover:bg-purple-100 hover:border-purple-500"
                                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <svg
                                className={`w-12 h-12 ${
                                  selectedCharacter
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <p
                                className={`font-medium ${
                                  selectedCharacter
                                    ? "text-blue-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {selectedCharacter
                                  ? "Click to assign selected character"
                                  : "Click to select or drag a character here"}
                              </p>
                            </div>
                          </button>
                        )}

                        {/* Action Buttons */}
                        {assignedCharacter && (
                          <div className="mt-4 flex space-x-2">
                            <Button
                              variant={ButtonVariant.Secondary}
                              size={ButtonSize.Small}
                              onClick={() => {
                                handleRemoveAssignment(role.id)
                              }}
                            >
                              Remove
                            </Button>
                            <Button
                              variant={ButtonVariant.Secondary}
                              size={ButtonSize.Small}
                              onClick={() => {
                                handleRemoveAssignment(role.id)
                                setSelectedRole(role.id)
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Assignment Preview */}
        {isComplete() && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-100 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mb-3">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Story Characters
              </h3>
              <p className="text-gray-600">All roles have been assigned!</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {storyRoles.map((role) => {
                const character = getCharacterById(assignments[role.id])
                return (
                  character && (
                    <div key={role.id} className="text-center">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-blue-200 mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-gray-900">
                        {character.name}
                      </p>
                      <p className="text-sm text-gray-600">{role.role}</p>
                    </div>
                  )
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            disabled={isSaving}
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
            Back to Story Editor
          </button>

          <button
            onClick={handleSaveAndContinue}
            disabled={!isComplete() || isSaving}
            className="px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Next: Background Setup</span>
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
              </>
            )}
          </button>
        </div>

        {/* Instructions Card */}
        {!isComplete() && (
          <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
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
                <p className="text-teal-900 font-bold text-xl mb-4">
                  How to assign characters:
                </p>
                <ul className="text-teal-800 space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-teal-600"
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
                      <strong>Method 1:</strong> Click a character, then click a
                      role slot
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-teal-600"
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
                      <strong>Method 2:</strong> Drag a character and drop it
                      onto a role
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-teal-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Each character can only be assigned to one role</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-teal-600"
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
                      All {storyRoles.length} roles must be assigned to continue
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saving Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-4 text-center animate-scale-in">
            <LoadingSpinner
              size={SpinnerSize.Large}
              color={SpinnerColor.Primary}
              centered
            />
            <h3 className="mt-8 text-2xl font-bold text-gray-900 font-heading">
              Saving Character Assignments...
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Your characters are being saved to the story.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
