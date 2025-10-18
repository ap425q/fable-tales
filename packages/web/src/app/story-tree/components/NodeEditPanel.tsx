/**
 * Node Editing Panel Component
 * Side panel for editing node details, text, and choices
 */

import { Button, Card, Input } from "@/components"
import { ButtonSize, ButtonVariant, InputVariant } from "@/components/types"
import { NodeType } from "@/types"
import React, { useEffect, useState } from "react"
import { FormValidationState, NodeEditFormData, TreeChoice } from "../types"

interface NodeEditPanelProps {
  nodeId: string
  sceneNumber: number
  nodeType: NodeType
  initialData: NodeEditFormData
  locations: Array<{ id: string; name: string }>
  availableNodes: Array<{ id: string; title: string; sceneNumber: number }>
  onSave: (data: NodeEditFormData) => void
  onCancel: () => void
  onDelete: () => void
  isSaving?: boolean
  hasUnsavedChanges?: boolean
}

/**
 * Node Edit Panel Component
 */
export const NodeEditPanel: React.FC<NodeEditPanelProps> = ({
  nodeId,
  sceneNumber,
  nodeType,
  initialData,
  locations,
  availableNodes,
  onSave,
  onCancel,
  onDelete,
  isSaving = false,
  hasUnsavedChanges = false,
}) => {
  const [formData, setFormData] = useState<NodeEditFormData>(initialData)
  const [validation, setValidation] = useState<FormValidationState>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form when initial data changes
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  // Validation
  const validateForm = (): boolean => {
    const errors: FormValidationState = {}

    if (!formData.title.trim()) {
      errors.titleError = "Title is required"
    }

    if (!formData.text.trim()) {
      errors.textError = "Story text is required"
    } else if (formData.text.length > 500) {
      errors.textError = "Text must be 500 characters or less"
    }

    if (!formData.location.trim()) {
      errors.locationError = "Location is required"
    }

    if (formData.choices.length === 0 && !isEndingNode()) {
      errors.choicesError =
        "At least one choice is required for non-ending nodes"
    }

    if (formData.choices.length > 3) {
      errors.choicesError = "Maximum 3 choices allowed"
    }

    setValidation(errors)
    return Object.keys(errors).length === 0
  }

  const isEndingNode = () => {
    return nodeType === NodeType.GOOD_ENDING || nodeType === NodeType.BAD_ENDING
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleAddChoice = () => {
    if (formData.choices.length >= 3) {
      return
    }

    const newChoice: TreeChoice = {
      id: `choice-new-${Date.now()}`,
      text: "",
      nextNodeId: null,
      isCorrect: false,
    }

    setFormData({
      ...formData,
      choices: [...formData.choices, newChoice],
    })
  }

  const handleUpdateChoice = (
    index: number,
    field: keyof TreeChoice,
    value: string | boolean | null
  ) => {
    const updatedChoices = [...formData.choices]
    updatedChoices[index] = {
      ...updatedChoices[index],
      [field]: value,
    }

    setFormData({
      ...formData,
      choices: updatedChoices,
    })
  }

  const handleDeleteChoice = (index: number) => {
    const updatedChoices = formData.choices.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      choices: updatedChoices,
    })
  }

  const handleDeleteNode = () => {
    setShowDeleteConfirm(false)
    onDelete()
  }

  const getNodeTypeBadge = () => {
    const colors: Record<NodeType, string> = {
      [NodeType.START]: "bg-green-100 text-green-800",
      [NodeType.NORMAL]: "bg-blue-100 text-blue-800",
      [NodeType.CHOICE]: "bg-yellow-100 text-yellow-800",
      [NodeType.GOOD_ENDING]: "bg-emerald-100 text-emerald-800",
      [NodeType.BAD_ENDING]: "bg-red-100 text-red-800",
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[nodeType]}`}
      >
        {nodeType.replace("_", " ").toUpperCase()}
      </span>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Edit Scene</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close panel"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Scene {sceneNumber}</div>
          {getNodeTypeBadge()}
        </div>

        {hasUnsavedChanges && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            ● Unsaved changes
          </div>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Title */}
        <Input
          label="Scene Title"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          placeholder="Enter scene title..."
          error={validation.titleError}
          required
          maxLength={100}
        />

        {/* Text */}
        <Input
          variant={InputVariant.Textarea}
          label="Story Text"
          value={formData.text}
          onChange={(value) => setFormData({ ...formData, text: value })}
          placeholder="Enter the story text for this scene..."
          error={validation.textError}
          required
          maxLength={500}
          showCharacterCount
          rows={6}
        />

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location/Setting <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {validation.locationError && (
            <p className="mt-1 text-sm text-red-600">
              {validation.locationError}
            </p>
          )}
        </div>

        {/* Choices */}
        {!isEndingNode() && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Choices{" "}
                {!isEndingNode() && <span className="text-red-500">*</span>}
              </label>
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Small}
                onClick={handleAddChoice}
                disabled={formData.choices.length >= 3}
              >
                + Add Choice
              </Button>
            </div>

            {validation.choicesError && (
              <p className="mb-2 text-sm text-red-600">
                {validation.choicesError}
              </p>
            )}

            <div className="space-y-3">
              {formData.choices.map((choice, index) => (
                <Card key={choice.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        Choice {index + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteChoice(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <Input
                      value={choice.text}
                      onChange={(value) =>
                        handleUpdateChoice(index, "text", value)
                      }
                      placeholder="Enter choice text..."
                      maxLength={100}
                    />

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Leads to Scene
                      </label>
                      <select
                        value={choice.nextNodeId || ""}
                        onChange={(e) =>
                          handleUpdateChoice(
                            index,
                            "nextNodeId",
                            e.target.value || null
                          )
                        }
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Not connected</option>
                        {availableNodes
                          .filter((node) => node.id !== nodeId)
                          .map((node) => (
                            <option key={node.id} value={node.id}>
                              Scene {node.sceneNumber}: {node.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={choice.isCorrect}
                        onChange={(e) =>
                          handleUpdateChoice(
                            index,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Mark as "correct" choice (leads to good outcome)
                      </span>
                    </label>
                  </div>
                </Card>
              ))}
            </div>

            {formData.choices.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No choices yet. Click "Add Choice" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        <div className="flex gap-3">
          <Button
            variant={ButtonVariant.Primary}
            fullWidth
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant={ButtonVariant.Danger}
            fullWidth
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSaving}
          >
            Delete Node
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600 font-medium text-center">
              Are you sure? This will break connections.
            </p>
            <div className="flex gap-2">
              <Button
                variant={ButtonVariant.Danger}
                fullWidth
                onClick={handleDeleteNode}
              >
                Yes, Delete
              </Button>
              <Button
                variant={ButtonVariant.Secondary}
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
