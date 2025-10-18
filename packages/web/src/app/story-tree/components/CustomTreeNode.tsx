/**
 * Custom Tree Node Component for React Flow
 * Displays different node types with visual indicators
 */

import { NodeType } from "@/types"
import { Handle, Position } from "@xyflow/react"
import React from "react"

/**
 * Get node styling based on type
 */
const getNodeStyles = (type: NodeType): string => {
  switch (type) {
    case NodeType.START:
      return "bg-green-100 border-green-500 text-green-900"
    case NodeType.NORMAL:
      return "bg-blue-100 border-blue-500 text-blue-900"
    case NodeType.CHOICE:
      return "bg-yellow-100 border-yellow-500 text-yellow-900"
    case NodeType.GOOD_ENDING:
      return "bg-emerald-100 border-emerald-500 text-emerald-900"
    case NodeType.BAD_ENDING:
      return "bg-red-100 border-red-500 text-red-900"
    default:
      return "bg-gray-100 border-gray-500 text-gray-900"
  }
}

/**
 * Get node icon based on type
 */
const getNodeIcon = (type: NodeType): React.ReactElement => {
  switch (type) {
    case NodeType.START:
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      )
    case NodeType.CHOICE:
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
        </svg>
      )
    case NodeType.GOOD_ENDING:
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    case NodeType.BAD_ENDING:
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )
    case NodeType.NORMAL:
    default:
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
            clipRule="evenodd"
          />
        </svg>
      )
  }
}

/**
 * Get type label
 */
const getTypeLabel = (type: NodeType): string => {
  switch (type) {
    case NodeType.START:
      return "Start"
    case NodeType.NORMAL:
      return "Scene"
    case NodeType.CHOICE:
      return "Choice"
    case NodeType.GOOD_ENDING:
      return "Good End"
    case NodeType.BAD_ENDING:
      return "Bad End"
    default:
      return "Unknown"
  }
}

/**
 * Get node styling classes based on hover and selection state
 */
const getNodeStateClasses = (data: {
  isHovered?: boolean
  isParent?: boolean
  isChild?: boolean
}): { opacityClass: string; borderClass: string; shadowClass: string } => {
  if (data.isHovered) {
    // Current hovered node - full opacity, highlighted
    return {
      opacityClass: "opacity-100",
      borderClass: "ring-4 ring-blue-500",
      shadowClass: "shadow-xl",
    }
  }

  if (data.isParent) {
    // Parent node - slightly dimmed with parent indicator
    return {
      opacityClass: "opacity-90",
      borderClass: "ring-2 ring-purple-400",
      shadowClass: "shadow-lg",
    }
  }

  if (data.isChild) {
    // Child node - slightly dimmed with child indicator
    return {
      opacityClass: "opacity-90",
      borderClass: "ring-2 ring-green-400",
      shadowClass: "shadow-lg",
    }
  }

  if (
    data.isParent !== undefined &&
    !data.isParent &&
    !data.isChild &&
    !data.isHovered
  ) {
    // Not related to hovered node - significantly dimmed
    return {
      opacityClass: "opacity-30",
      borderClass: "",
      shadowClass: "shadow-md",
    }
  }

  // Default state - no hover interactions
  return {
    opacityClass: "opacity-100",
    borderClass: "",
    shadowClass: "shadow-md",
  }
}

/**
 * Custom Tree Node Component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomTreeNode: React.FC<any> = ({ data, selected }) => {
  const nodeStyles = getNodeStyles(data.type)
  const icon = getNodeIcon(data.type)
  const typeLabel = getTypeLabel(data.type)
  const [showAddButton, setShowAddButton] = React.useState(false)

  // Show handles for connections
  const hasIncoming = data.type !== NodeType.START
  const hasOutgoing =
    data.type !== NodeType.GOOD_ENDING && data.type !== NodeType.BAD_ENDING

  // Get styling classes based on hover state
  const { opacityClass, borderClass, shadowClass } = getNodeStateClasses(data)

  // Selection ring (separate from hover)
  const selectionClass =
    selected && !data.isHovered ? "ring-2 ring-blue-400" : ""

  // Handle add node button click
  const handleAddNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent node selection
    if (data.onAddNode) {
      data.onAddNode(data.id)
    }
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 min-w-[200px] max-w-[250px] transition-all duration-200 ${nodeStyles} ${opacityClass} ${borderClass} ${selectionClass} ${shadowClass} cursor-pointer hover:scale-105 relative group`}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      {/* Incoming handle (top) */}
      {hasIncoming && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-500"
          style={{ top: -6 }}
        />
      )}

      {/* Node header */}
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div className="flex-1">
          <div className="text-xs font-semibold opacity-75">{typeLabel}</div>
          <div className="text-sm font-bold">Scene {data.sceneNumber}</div>
        </div>
      </div>

      {/* Node title */}
      <div className="text-sm font-semibold mb-1 line-clamp-2">
        {data.title}
      </div>

      {/* Node text preview */}
      <div className="text-xs opacity-75 line-clamp-2">{data.text}</div>

      {/* Choices indicator */}
      {data.choices.length > 0 && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <div className="text-xs font-medium">
            {data.choices.length} choice{data.choices.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Add Node Button - Shows on hover for non-ending nodes */}
      {hasOutgoing && showAddButton && (
        <button
          onClick={handleAddNodeClick}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-1 z-50"
          title="Add child node"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Node
        </button>
      )}

      {/* Outgoing handle (bottom) */}
      {hasOutgoing && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-500"
          style={{ bottom: -6 }}
        />
      )}
    </div>
  )
}
