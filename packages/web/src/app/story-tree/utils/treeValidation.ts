/**
 * Tree Validation Utilities
 * Validates story tree structure and provides warnings
 */

import { NodeType } from "@/types"
import {
  TreeNodeData,
  TreeValidation,
  ValidationError,
  ValidationWarning,
} from "../types"

/**
 * Validate entire tree structure
 */
export function validateTree(
  nodes: TreeNodeData[],
  edges: Array<{ from: string; to: string }>
): TreeValidation {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check for start node
  const startNodes = nodes.filter((n) => n.type === NodeType.START)
  if (startNodes.length === 0) {
    errors.push({
      type: "orphan_node",
      message: "Story must have a start node",
    })
  }

  // Check for good ending
  const goodEndings = nodes.filter((n) => n.type === NodeType.GOOD_ENDING)
  if (goodEndings.length === 0) {
    errors.push({
      type: "no_good_ending",
      message: "Story must have at least one good ending",
    })
  }

  // Check for bad ending (warning only)
  const badEndings = nodes.filter((n) => n.type === NodeType.BAD_ENDING)
  if (badEndings.length === 0) {
    warnings.push({
      type: "no_bad_ending",
      message: "Consider adding at least one bad ending for branching choices",
    })
  }

  // Check for orphan nodes (not connected to start)
  const orphanNodes = findOrphanNodes(nodes, edges)
  orphanNodes.forEach((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    errors.push({
      type: "orphan_node",
      nodeId,
      message: `Scene ${node?.sceneNumber} "${node?.title}" is not connected to the story`,
    })
  })

  // Check for dead ends (non-ending nodes with no outgoing edges)
  const deadEnds = findDeadEnds(nodes, edges)
  deadEnds.forEach((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    errors.push({
      type: "dead_end",
      nodeId,
      message: `Scene ${node?.sceneNumber} "${node?.title}" has no choices and is not an ending`,
    })
  })

  // Check for broken connections
  const brokenConnections = findBrokenConnections(nodes, edges)
  brokenConnections.forEach(({ nodeId, choiceText }) => {
    const node = nodes.find((n) => n.id === nodeId)
    errors.push({
      type: "broken_connection",
      nodeId,
      message: `Scene ${node?.sceneNumber}: Choice "${choiceText}" points to a non-existent scene`,
    })
  })

  // Check for single choice nodes (warning)
  nodes.forEach((node) => {
    if (
      node.type === NodeType.CHOICE &&
      node.choices.length === 1 &&
      node.choices[0].nextNodeId
    ) {
      warnings.push({
        type: "single_choice",
        nodeId: node.id,
        message: `Scene ${node.sceneNumber} "${node.title}" has only one choice - consider making it a normal scene or adding more choices`,
      })
    }
  })

  // Check for too many choices
  nodes.forEach((node) => {
    if (node.choices.length > 3) {
      warnings.push({
        type: "too_many_choices",
        nodeId: node.id,
        message: `Scene ${node.sceneNumber} "${node.title}" has ${node.choices.length} choices - maximum 3 recommended`,
      })
    }
  })

  // Check for long text (warning)
  nodes.forEach((node) => {
    if (node.text.length > 400) {
      warnings.push({
        type: "long_text",
        nodeId: node.id,
        message: `Scene ${node.sceneNumber} "${node.title}" has long text (${node.text.length} chars) - consider keeping it under 400 characters`,
      })
    }
  })

  // Check for short paths to ending
  const shortPaths = findShortPaths(nodes, edges)
  if (shortPaths.length > 0) {
    warnings.push({
      type: "short_path",
      message: `Some paths to endings are very short (less than 3 scenes) - consider adding more story content`,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Find nodes not reachable from start
 */
function findOrphanNodes(
  nodes: TreeNodeData[],
  edges: Array<{ from: string; to: string }>
): string[] {
  const startNode = nodes.find((n) => n.type === NodeType.START)
  if (!startNode) return nodes.map((n) => n.id)

  const reachable = new Set<string>()
  const queue = [startNode.id]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (reachable.has(currentId)) continue

    reachable.add(currentId)
    const outgoingEdges = edges.filter((e) => e.from === currentId)
    outgoingEdges.forEach((edge) => {
      if (!reachable.has(edge.to)) {
        queue.push(edge.to)
      }
    })
  }

  return nodes.filter((n) => !reachable.has(n.id)).map((n) => n.id)
}

/**
 * Find non-ending nodes with no outgoing edges
 */
function findDeadEnds(
  nodes: TreeNodeData[],
  edges: Array<{ from: string; to: string }>
): string[] {
  return nodes
    .filter((node) => {
      const isEnding =
        node.type === NodeType.GOOD_ENDING || node.type === NodeType.BAD_ENDING
      if (isEnding) return false

      const hasOutgoing = edges.some((e) => e.from === node.id)
      return !hasOutgoing
    })
    .map((n) => n.id)
}

/**
 * Find choices that point to non-existent nodes
 */
function findBrokenConnections(
  nodes: TreeNodeData[],
  edges: Array<{ from: string; to: string }>
): Array<{ nodeId: string; choiceText: string }> {
  const nodeIds = new Set(nodes.map((n) => n.id))
  const broken: Array<{ nodeId: string; choiceText: string }> = []

  nodes.forEach((node) => {
    node.choices.forEach((choice) => {
      if (choice.nextNodeId && !nodeIds.has(choice.nextNodeId)) {
        broken.push({
          nodeId: node.id,
          choiceText: choice.text,
        })
      }
    })
  })

  return broken
}

/**
 * Find paths that are too short (less than 3 nodes)
 */
function findShortPaths(
  nodes: TreeNodeData[],
  edges: Array<{ from: string; to: string }>
): string[][] {
  const startNode = nodes.find((n) => n.type === NodeType.START)
  if (!startNode) return []

  const endingNodes = nodes.filter(
    (n) => n.type === NodeType.GOOD_ENDING || n.type === NodeType.BAD_ENDING
  )

  const shortPaths: string[][] = []

  endingNodes.forEach((ending) => {
    const pathLength = calculatePathLength(startNode.id, ending.id, edges)
    if (pathLength > 0 && pathLength < 3) {
      shortPaths.push([startNode.id, ending.id])
    }
  })

  return shortPaths
}

/**
 * Calculate shortest path length between two nodes
 */
function calculatePathLength(
  startId: string,
  endId: string,
  edges: Array<{ from: string; to: string }>
): number {
  if (startId === endId) return 0

  const queue: Array<{ id: string; depth: number }> = [
    { id: startId, depth: 0 },
  ]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current.id === endId) return current.depth

    if (visited.has(current.id)) continue
    visited.add(current.id)

    const outgoing = edges.filter((e) => e.from === current.id)
    outgoing.forEach((edge) => {
      if (!visited.has(edge.to)) {
        queue.push({ id: edge.to, depth: current.depth + 1 })
      }
    })
  }

  return -1 // Not reachable
}

/**
 * Check if a single node is valid
 */
export function validateNode(node: TreeNodeData): string[] {
  const errors: string[] = []

  if (!node.title.trim()) {
    errors.push("Title is required")
  }

  if (!node.text.trim()) {
    errors.push("Story text is required")
  }

  if (node.text.length > 500) {
    errors.push("Text must be 500 characters or less")
  }

  if (!node.location.trim()) {
    errors.push("Location is required")
  }

  const isEnding =
    node.type === NodeType.GOOD_ENDING || node.type === NodeType.BAD_ENDING

  if (!isEnding && node.choices.length === 0) {
    errors.push("Non-ending nodes must have at least one choice")
  }

  if (node.choices.length > 3) {
    errors.push("Maximum 3 choices allowed")
  }

  return errors
}
