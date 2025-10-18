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
import React, { useEffect, useState } from "react"
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
  params: { storyId: string }
}) {
  const router = useRouter()
  const { storyId } = params

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner
            size={SpinnerSize.XLarge}
            color={SpinnerColor.Primary}
            centered
          />
          <p className="mt-4 text-gray-600 text-lg">
            Loading character gallery...
          </p>
        </div>
      </div>
    )
  }

  const progress = getProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Characters
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Select preset characters for each role in your story. You can click
            on a character and then click on a role, or drag and drop characters
            onto role slots.
          </p>

          {/* Progress Indicator */}
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="font-semibold text-gray-900">
                {progress.completed} / {progress.total} Characters Assigned
              </span>
            </div>
            {isComplete() && (
              <svg
                className="ml-3 w-6 h-6 text-green-500"
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

        {/* Error Display */}
        {error && (
          <div
            className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
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
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Character Gallery (40%) */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Character Gallery
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Click or drag a character to assign them to a role
              </p>

              {/* Character Grid */}
              <div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {presetCharacters.map((character) => {
                  const isSelected = selectedCharacter === character.id
                  const isAssigned = isCharacterAssigned(character.id)
                  const assignedRole = getAssignedRoleId(character.id)

                  return (
                    <div
                      key={character.id}
                      className="relative"
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
                          <p className="font-semibold text-gray-900">
                            {character.name}
                          </p>
                          {isAssigned && assignedRole && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              ✓ Assigned
                            </p>
                          )}
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
                    className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 ${
                      isHovered
                        ? "ring-4 ring-blue-400 shadow-xl scale-105"
                        : ""
                    } ${isRoleSelected ? "ring-2 ring-purple-400" : ""}`}
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
                            className={`w-full border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                              selectedCharacter
                                ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                                : "border-gray-300 bg-gray-50 hover:border-gray-400"
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
                              variant={ButtonVariant.Outline}
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
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Your Story Characters
            </h3>
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
        <div className="mt-8 flex justify-between items-center max-w-3xl mx-auto">
          <Button
            variant={ButtonVariant.Outline}
            size={ButtonSize.Large}
            onClick={handleBack}
            disabled={isSaving}
          >
            ← Back to Story Editor
          </Button>

          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Large}
            onClick={handleSaveAndContinue}
            disabled={!isComplete() || isSaving}
            loading={isSaving}
          >
            {isSaving ? "Saving..." : "Next: Background Setup →"}
          </Button>
        </div>

        {/* Instructions Card */}
        {!isComplete() && (
          <div className="mt-6 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
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
                <p className="text-blue-800 font-medium mb-2">
                  How to assign characters:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>
                    • <strong>Method 1:</strong> Click a character, then click a
                    role slot
                  </li>
                  <li>
                    • <strong>Method 2:</strong> Drag a character and drop it
                    onto a role
                  </li>
                  <li>• Each character can only be assigned to one role</li>
                  <li>
                    • All {storyRoles.length} roles must be assigned to continue
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saving Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <LoadingSpinner
              size={SpinnerSize.Large}
              color={SpinnerColor.Primary}
              centered
            />
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Saving Character Assignments...
            </h3>
            <p className="mt-3 text-gray-600">
              Your characters are being saved to the story.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
