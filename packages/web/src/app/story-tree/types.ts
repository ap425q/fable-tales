/**
 * Types specific to Story Tree Editor
 */

import { NodeType } from "@/types"
import { Edge, Node } from "@xyflow/react"

/**
 * Tree validation result
 */
export interface TreeValidation {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

/**
 * Validation error
 */
export interface ValidationError {
  type: "orphan_node" | "no_good_ending" | "dead_end" | "broken_connection"
  nodeId?: string
  message: string
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type:
    | "single_choice"
    | "too_many_choices"
    | "long_text"
    | "no_bad_ending"
    | "short_path"
  nodeId?: string
  message: string
}

/**
 * Extended node data for React Flow
 */
export interface TreeNodeData {
  id: string
  sceneNumber: number
  title: string
  text: string
  location: string
  type: NodeType
  choices: TreeChoice[]
  isSelected: boolean
}

/**
 * Choice in tree node
 */
export interface TreeChoice {
  id: string
  text: string
  nextNodeId: string | null
  isCorrect: boolean
}

/**
 * React Flow node with custom data
 */
export type TreeNode = Node<TreeNodeData>

/**
 * React Flow edge
 */
export type TreeEdge = Edge

/**
 * Node position in the tree
 */
export interface NodePosition {
  x: number
  y: number
}

/**
 * Form data for node editing
 */
export interface NodeEditFormData {
  title: string
  text: string
  location: string
  choices: TreeChoice[]
}

/**
 * Form validation state
 */
export interface FormValidationState {
  titleError?: string
  textError?: string
  locationError?: string
  choicesError?: string
}
