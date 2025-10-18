/**
 * Custom Tree Node Component for React Flow - PARCHMENT MAP STYLE
 * Displays different node types styled as medallions and seals on an ancient map
 */

import { NodeType } from "@/types"
import { Handle, NodeProps, Position } from "@xyflow/react"
import React from "react"
import { TreeNodeData } from "../types"

/**
 * Get node styling based on type (parchment/medallion colors)
 */
const getNodeStyles = (
  type: NodeType
): { bg: string; border: string; text: string; icon: string } => {
  switch (type) {
    case NodeType.START:
      return {
        bg: "linear-gradient(145deg, #6B8E6B, #4A6741)",
        border: "#4A6741",
        text: "#FFF",
        icon: "▶️",
      }
    case NodeType.NORMAL:
      return {
        bg: "linear-gradient(145deg, #8B7355, #6B5744)",
        border: "#5C4A3A",
        text: "#F5F1E8",
        icon: "📄",
      }
    case NodeType.CHOICE:
      return {
        bg: "linear-gradient(145deg, #D4A76A, #C09050)",
        border: "#A67840",
        text: "#2C2416",
        icon: "🧭",
      }
    case NodeType.GOOD_ENDING:
      return {
        bg: "linear-gradient(145deg, #D4AF37, #C4A027)",
        border: "#B49020",
        text: "#2C2416",
        icon: "⭐",
      }
    case NodeType.BAD_ENDING:
      return {
        bg: "linear-gradient(145deg, #A65959, #8B3A3A)",
        border: "#7B2A2A",
        text: "#FFF",
        icon: "🙅",
      }
    default:
      return {
        bg: "linear-gradient(145deg, #8B7355, #6B5744)",
        border: "#5C4A3A",
        text: "#F5F1E8",
        icon: "📄",
      }
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
 * Custom Tree Node Component - Medallion/Seal Style
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomTreeNode(props: NodeProps<any>) {
  const data = props.data as TreeNodeData
  const selected = props.selected

  const nodeStyle = getNodeStyles(data.type)
  const typeLabel = getTypeLabel(data.type)
  const [showAddButton, setShowAddButton] = React.useState(false)

  // Show handles for connections
  const hasIncoming = data.type !== NodeType.START
  const hasOutgoing =
    data.type !== NodeType.GOOD_ENDING && data.type !== NodeType.BAD_ENDING

  // Handle add node button click
  const handleAddNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onAddNode) {
      data.onAddNode(data.id)
    }
  }

  // Opacity based on hover state - dim unrelated nodes when hovering
  const getOpacity = (): number => {
    return data.isDimmed ? 0.3 : 1
  }

  const opacity = getOpacity()

  return (
    <div
      className="relative transition-all duration-200 cursor-pointer group"
      style={{ opacity }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      {/* Incoming handle (top) */}
      {hasIncoming && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3"
          style={{
            top: -6,
            background: nodeStyle.border,
            border: "2px solid #F5F1E8",
          }}
        />
      )}

      {/* Node Container - Medallion/Seal Style */}
      <div
        className="relative min-w-[200px] max-w-[250px] rounded-2xl p-4 transition-all duration-200 hover:scale-105"
        style={{
          background: nodeStyle.bg,
          border: `3px solid ${nodeStyle.border}`,
          boxShadow: `
            0 6px 20px rgba(44, 36, 22, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -2px 0 rgba(0, 0, 0, 0.2)
            ${selected ? ", 0 0 0 3px #D4AF37" : ""}
            ${data.isHovered ? ", 0 0 0 3px #5B7C99" : ""}
          `,
        }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
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

        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon and scene number */}
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">{nodeStyle.icon}</div>
            <div className="flex-1">
              <div
                className="text-xs font-bold opacity-80 uppercase tracking-wide"
                style={{
                  color: nodeStyle.text,
                  fontFamily: "var(--font-ui)",
                }}
              >
                {typeLabel}
              </div>
              <div
                className="text-sm font-bold"
                style={{
                  color: nodeStyle.text,
                  fontFamily: "var(--font-heading)",
                }}
              >
                Scene {data.sceneNumber}
              </div>
            </div>

            {/* Decorative corner */}
            <div
              className="text-xs opacity-50"
              style={{ color: nodeStyle.text }}
            >
              ✦
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px my-2"
            style={{
              background: `${nodeStyle.text}40`,
            }}
          />

          {/* Node title */}
          <div
            className="text-sm font-bold mb-2 line-clamp-2 leading-tight"
            style={{
              color: nodeStyle.text,
              fontFamily: "var(--font-body)",
            }}
          >
            {data.title}
          </div>

          {/* Node text preview */}
          <div
            className="text-xs opacity-75 line-clamp-2 leading-relaxed"
            style={{
              color: nodeStyle.text,
              fontFamily: "var(--font-body)",
            }}
          >
            {data.text}
          </div>

          {/* Choices indicator */}
          {data.choices.length > 0 && (
            <div
              className="mt-3 pt-2 border-t"
              style={{ borderColor: `${nodeStyle.text}30` }}
            >
              <div
                className="text-xs font-semibold flex items-center gap-1"
                style={{
                  color: nodeStyle.text,
                  fontFamily: "var(--font-ui)",
                }}
              >
                <span>🔀</span>
                <span>
                  {data.choices.length} choice
                  {data.choices.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Node Button - Shows on hover for non-ending nodes */}
      {hasOutgoing && showAddButton && (
        <button
          onClick={handleAddNodeClick}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
          style={{
            background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
            color: "#FFF",
            boxShadow: "0 8px 20px rgba(74, 103, 65, 0.6)",
            fontFamily: "var(--font-ui)",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
          title="Add child node"
        >
          <span className="text-lg">+</span>
          <span>Add Scene</span>
        </button>
      )}

      {/* Outgoing handle (bottom) */}
      {hasOutgoing && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3"
          style={{
            bottom: -6,
            background: nodeStyle.border,
            border: "2px solid #F5F1E8",
          }}
        />
      )}
    </div>
  )
}
