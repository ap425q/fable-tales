/**
 * Tree Layout Utilities
 * Calculates positions for nodes in the tree visualization
 */

import { NodePosition } from "../types"

/**
 * Layout configuration
 */
const LAYOUT_CONFIG = {
  nodeWidth: 250,
  nodeHeight: 150,
  horizontalSpacing: 100,
  verticalSpacing: 150,
  startX: 400,
  startY: 50,
}

/**
 * Calculate automatic layout for tree nodes
 * Uses a hierarchical layout algorithm
 */
export function calculateTreeLayout(
  nodes: Array<{ id: string; type: string }>,
  edges: Array<{ from: string; to: string }>
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>()

  // Find start node
  const startNode = nodes.find((n) => n.type === "start")
  if (!startNode) {
    // Fallback: position nodes in a grid
    return calculateGridLayout(nodes)
  }

  // Build adjacency list
  const adjacency = new Map<string, string[]>()
  nodes.forEach((node) => adjacency.set(node.id, []))
  edges.forEach((edge) => {
    const children = adjacency.get(edge.from) || []
    children.push(edge.to)
    adjacency.set(edge.from, children)
  })

  // Calculate levels (BFS)
  const levels = calculateNodeLevels(startNode.id, adjacency)

  // Group nodes by level
  const nodesByLevel = new Map<number, string[]>()
  levels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, [])
    }
    nodesByLevel.get(level)!.push(nodeId)
  })

  // Position nodes level by level
  const maxLevel = Math.max(...Array.from(levels.values()))
  for (let level = 0; level <= maxLevel; level++) {
    const nodesAtLevel = nodesByLevel.get(level) || []
    const y = LAYOUT_CONFIG.startY + level * LAYOUT_CONFIG.verticalSpacing

    // Center nodes horizontally
    const totalWidth =
      nodesAtLevel.length * LAYOUT_CONFIG.nodeWidth +
      (nodesAtLevel.length - 1) * LAYOUT_CONFIG.horizontalSpacing
    const startX = LAYOUT_CONFIG.startX - totalWidth / 2

    nodesAtLevel.forEach((nodeId, index) => {
      const x =
        startX +
        index * (LAYOUT_CONFIG.nodeWidth + LAYOUT_CONFIG.horizontalSpacing)
      positions.set(nodeId, { x, y })
    })
  }

  return positions
}

/**
 * Calculate node levels using BFS
 */
function calculateNodeLevels(
  startNodeId: string,
  adjacency: Map<string, string[]>
): Map<string, number> {
  const levels = new Map<string, number>()
  const queue: Array<{ id: string; level: number }> = [
    { id: startNodeId, level: 0 },
  ]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const current = queue.shift()!

    if (visited.has(current.id)) continue
    visited.add(current.id)

    levels.set(current.id, current.level)

    const children = adjacency.get(current.id) || []
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: current.level + 1 })
      }
    })
  }

  return levels
}

/**
 * Fallback grid layout for disconnected nodes
 */
function calculateGridLayout(
  nodes: Array<{ id: string }>
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>()
  const columns = Math.ceil(Math.sqrt(nodes.length))

  nodes.forEach((node, index) => {
    const row = Math.floor(index / columns)
    const col = index % columns
    const x =
      100 + col * (LAYOUT_CONFIG.nodeWidth + LAYOUT_CONFIG.horizontalSpacing)
    const y =
      100 + row * (LAYOUT_CONFIG.nodeHeight + LAYOUT_CONFIG.verticalSpacing)
    positions.set(node.id, { x, y })
  })

  return positions
}

/**
 * Adjust layout to fit within viewport
 */
export function fitLayoutToViewport(
  positions: Map<string, NodePosition>,
  viewportWidth: number,
  viewportHeight: number
): Map<string, NodePosition> {
  if (positions.size === 0) return positions

  // Find bounds
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  positions.forEach((pos) => {
    minX = Math.min(minX, pos.x)
    maxX = Math.max(maxX, pos.x + LAYOUT_CONFIG.nodeWidth)
    minY = Math.min(minY, pos.y)
    maxY = Math.max(maxY, pos.y + LAYOUT_CONFIG.nodeHeight)
  })

  const contentWidth = maxX - minX
  const contentHeight = maxY - minY

  // Calculate scale to fit
  const scaleX = viewportWidth / (contentWidth + 200) // padding
  const scaleY = viewportHeight / (contentHeight + 200)
  const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down

  // Center content
  const offsetX = (viewportWidth - contentWidth * scale) / 2 - minX * scale
  const offsetY = 50 // Top padding

  const adjustedPositions = new Map<string, NodePosition>()
  positions.forEach((pos, nodeId) => {
    adjustedPositions.set(nodeId, {
      x: pos.x * scale + offsetX,
      y: pos.y * scale + offsetY,
    })
  })

  return adjustedPositions
}
