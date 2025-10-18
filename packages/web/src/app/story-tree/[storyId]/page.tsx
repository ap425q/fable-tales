"use client"

import { Button, Card, LoadingSpinner, Modal } from "@/components"
import { ButtonVariant, ModalSize, SpinnerSize } from "@/components/types"
import { api } from "@/lib/api"
import { NodeType } from "@/types"
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CustomTreeNode } from "../components/CustomTreeNode"
import { NodeEditPanel } from "../components/NodeEditPanel"
import { NodeEditFormData, TreeNodeData, TreeValidation } from "../types"
import { calculateTreeLayout } from "../utils/treeLayout"
import { validateTree } from "../utils/treeValidation"

interface StoryDetailsResponse {
  id: string
  title: string
  lesson?: string
  status: string
  tree: {
    nodes: Array<{
      id: string
      sceneNumber: number
      title: string
      text: string
      location: string
      type: NodeType
      choices: Array<{
        id: string
        text: string
        nextNodeId: string
        isCorrect?: boolean
      }>
    }>
    edges: Array<{
      from: string
      to: string
    }>
  }
  locations: Array<{
    id: string
    name: string
  }>
}

// Type aliases for React Flow
type TreeNode = Node<TreeNodeData>
type TreeEdge = Edge

/**
 * Add Node Modal Component
 */
interface AddNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (nodeData: {
    type: NodeType
    title: string
    text: string
    location: string
  }) => void
  isSaving: boolean
  locations: Array<{ id: string; name: string }>
}

function AddNodeModal({
  isOpen,
  onClose,
  onAdd,
  isSaving,
  locations,
}: AddNodeModalProps) {
  const [nodeType, setNodeType] = useState<NodeType>(NodeType.NORMAL)
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [location, setLocation] = useState("")

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setNodeType(NodeType.NORMAL)
      setTitle("")
      setText("")
      setLocation(locations[0]?.id || "")
    }
  }, [isOpen, locations])

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) {
      alert("Please fill in all required fields")
      return
    }

    onAdd({
      type: nodeType,
      title: title.trim(),
      text: text.trim(),
      location: location || locations[0]?.id || "",
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Node"
      size={ModalSize.Large}
      footer={
        <>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={handleSubmit}
            loading={isSaving}
          >
            Add Node
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Node Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Type *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: NodeType.NORMAL, label: "Normal Scene", icon: "📄" },
              { type: NodeType.CHOICE, label: "Choice Point", icon: "🔀" },
              { type: NodeType.GOOD_ENDING, label: "Good Ending", icon: "⭐" },
              { type: NodeType.BAD_ENDING, label: "Bad Ending", icon: "🙅" },
            ].map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => setNodeType(option.type)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  nodeType === option.type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scene Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter scene title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scene Text *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter scene text"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {text.length}/500 characters
          </p>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> The new node will be added as a child of the
            selected parent node. You can edit choices and connections later.
          </p>
        </div>
      </div>
    </Modal>
  )
}

/**
 * Story Tree Editor Page Component
 * Interactive tree visualization for editing story structure
 */
function StoryTreeEditor() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.storyId as string
  const { fitView } = useReactFlow()

  // State
  const [storyData, setStoryData] = useState<StoryDetailsResponse | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<TreeNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<TreeEdge>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [validation, setValidation] = useState<TreeValidation | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)
  const [showAddNodeModal, setShowAddNodeModal] = useState(false)
  const [parentNodeIdForAdd, setParentNodeIdForAdd] = useState<string | null>(
    null
  )

  // Define node types for React Flow
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeTypes = useMemo(() => ({ custom: CustomTreeNode as any }), [])

  // Load story data
  useEffect(() => {
    loadStoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId])

  // Handle delete node
  const handleDeleteNode = useCallback(async () => {
    if (!selectedNode) return

    const node = nodes.find((n) => n.id === selectedNode)
    if (!node || node.data.type === NodeType.START) {
      alert("Cannot delete the start node")
      return
    }

    try {
      setIsSaving(true)

      // Delete node via API
      await api.stories.deleteNode(storyId, selectedNode)

      // Remove node
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode))

      // Remove associated edges
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode && e.target !== selectedNode
        )
      )

      setSelectedNode(null)
      setHasUnsavedChanges(false)

      // Revalidate
      setTimeout(() => {
        validateTreeStructure(
          nodes.filter((n) => n.id !== selectedNode),
          edges
        )
      }, 100)

      console.log("Node deleted successfully")
    } catch (error) {
      console.error("Failed to delete node:", error)
    } finally {
      setIsSaving(false)
    }
  }, [
    selectedNode,
    nodes,
    setNodes,
    setEdges,
    edges,
    setIsSaving,
    setHasUnsavedChanges,
    setSelectedNode,
    storyId,
  ])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC - Close panel
      if (e.key === "Escape" && selectedNode) {
        setSelectedNode(null)
      }

      // Delete key - Delete selected node
      if (e.key === "Delete" && selectedNode) {
        const node = nodes.find((n) => n.id === selectedNode)
        if (node && node.data.type !== NodeType.START) {
          handleDeleteNode()
        }
      }

      // Ctrl/Cmd + S - Save (prevent default browser save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (selectedNode && hasUnsavedChanges) {
          // Trigger save if panel is open
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedNode, nodes, hasUnsavedChanges, handleDeleteNode])

  // Load story data from API
  const loadStoryData = async () => {
    try {
      setIsLoading(true)

      // Fetch story data from API
      const response = await api.stories.getById(storyId)

      if (response.success && response.data) {
        // Transform the response to match expected structure
        const rawData = response.data as unknown as {
          id: string
          title: string
          lesson?: string
          status: string
          tree?: {
            nodes: Array<{
              id: string
              sceneNumber: number
              title: string
              text: string
              location: string
              type: NodeType
              choices: Array<{
                id: string
                text: string
                nextNodeId: string
                isCorrect?: boolean
              }>
            }>
            edges: Array<{
              from: string
              to: string
            }>
          }
          locations: Array<{
            id: string
            name: string
          }>
        }
        const transformedData: StoryDetailsResponse = {
          id: rawData.id,
          title: rawData.title,
          lesson: rawData.lesson,
          status: rawData.status,
          tree: {
            nodes: rawData.tree?.nodes || [],
            edges: rawData.tree?.edges || [],
          },
          locations: rawData.locations || [],
        }
        setStoryData(transformedData)
        convertToReactFlowData(transformedData)
      }
    } catch (error) {
      console.error("Failed to load story:", error)
      // Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  // Get parent and child nodes for hover highlighting
  const getRelatedNodes = useCallback(
    (nodeId: string) => {
      const parents = edges
        .filter((e) => e.target === nodeId)
        .map((e) => e.source as string)
      const children = edges
        .filter((e) => e.source === nodeId)
        .map((e) => e.target as string)
      return { parents, children }
    },
    [edges]
  )

  // Handle add node request
  const handleAddNodeRequest = (parentNodeId: string) => {
    setParentNodeIdForAdd(parentNodeId)
    setShowAddNodeModal(true)
  }

  // Convert API data to React Flow format
  const convertToReactFlowData = (data: StoryDetailsResponse) => {
    // Calculate layout
    const positions = calculateTreeLayout(
      data.tree.nodes.map((n) => ({ id: n.id, type: n.type })),
      data.tree.edges
    )

    // Convert nodes
    const reactFlowNodes: TreeNode[] = data.tree.nodes.map((node) => {
      const position = positions.get(node.id) || { x: 0, y: 0 }
      return {
        id: node.id,
        type: "custom",
        position,
        draggable: false, // Disable dragging
        data: {
          id: node.id,
          sceneNumber: node.sceneNumber,
          title: node.title,
          text: node.text,
          location: node.location,
          type: node.type,
          choices: node.choices.map((choice) => ({
            id: choice.id,
            text: choice.text,
            nextNodeId: choice.nextNodeId,
            isCorrect: choice.isCorrect ?? false,
          })),
          isSelected: false,
          isHovered: false,
          isParent: false,
          isChild: false,
          isDimmed: false,
          onAddNode: handleAddNodeRequest,
        },
      }
    })

    // Convert edges
    const reactFlowEdges = data.tree.edges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      animated: false,
      style: { stroke: "#9CA3AF", strokeWidth: 2 },
    }))

    setNodes(reactFlowNodes)
    setEdges(reactFlowEdges)

    // Fit view after a short delay
    setTimeout(() => {
      fitView({ padding: 0.2 })
    }, 100)

    // Validate tree
    validateTreeStructure(reactFlowNodes, reactFlowEdges)
  }

  // Validate tree structure
  const validateTreeStructure = (
    currentNodes: TreeNode[],
    currentEdges: TreeEdge[]
  ) => {
    const nodeData = currentNodes.map((n) => n.data)
    const edgeData = currentEdges.map((e) => ({
      from: e.source,
      to: e.target,
    }))

    const result = validateTree(nodeData, edgeData)
    setValidation(result)
  }

  // Handle node hover
  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_event, node) => {
      setHoveredNode(node.id)

      // Get related nodes
      const { parents, children } = getRelatedNodes(node.id)

      // Create set of related node IDs for quick lookup
      const relatedNodeIds = new Set([node.id, ...parents, ...children])

      // Update node hover state
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isHovered: n.id === node.id,
            isParent: parents.includes(n.id),
            isChild: children.includes(n.id),
            isDimmed: !relatedNodeIds.has(n.id), // Dim nodes that are not related
          },
        }))
      )

      // Update edge styles
      setEdges((eds) =>
        eds.map((e) => {
          const isRelated = e.source === node.id || e.target === node.id
          return {
            ...e,
            animated: isRelated,
            style: {
              stroke: isRelated ? "#3B82F6" : "#D1D5DB",
              strokeWidth: isRelated ? 3 : 2,
              opacity: isRelated ? 1 : 0.3,
            },
          }
        })
      )
    },
    [setNodes, setEdges, getRelatedNodes]
  )

  // Handle node hover leave
  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)

    // Reset node hover state
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHovered: false,
          isParent: false,
          isChild: false,
          isDimmed: false, // Make all nodes clear again
        },
      }))
    )

    // Reset edge styles
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        style: {
          stroke: "#9CA3AF",
          strokeWidth: 2,
          opacity: 1,
        },
      }))
    )
  }, [setNodes, setEdges])

  // Handle node click
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNode(node.id)
      setHasUnsavedChanges(false)

      // Update node selection state
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, isSelected: n.id === node.id },
        }))
      )
    },
    [setNodes]
  )

  // Handle panel close
  const handlePanelClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      )
      if (!confirmed) return
    }

    setSelectedNode(null)
    setHasUnsavedChanges(false)

    // Clear selection
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, isSelected: false },
      }))
    )
  }

  // Handle node save
  const handleNodeSave = async (formData: NodeEditFormData) => {
    if (!selectedNode) return

    try {
      setIsSaving(true)

      // Convert location ID to location name for backend
      let locationValue = formData.location
      if (storyData) {
        const location = storyData.locations.find(
          (loc) => loc.id === formData.location
        )
        if (location) {
          locationValue = location.name
        }
      }

      // Update node via API
      await api.stories.updateNode(storyId, selectedNode, {
        ...formData,
        location: locationValue,
      })

      // Update local state
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode) {
            return {
              ...node,
              data: {
                ...node.data,
                title: formData.title,
                text: formData.text,
                location: locationValue, // Use the location name, not ID
                choices: formData.choices,
              },
            }
          }
          return node
        })
      )

      // Update edges based on new choices
      updateEdgesForNode(selectedNode, formData.choices)

      setHasUnsavedChanges(false)

      // Revalidate
      validateTreeStructure(nodes, edges)

      // Show success message
      console.log("Node saved successfully")
    } catch (error) {
      console.error("Failed to save node:", error)
      // Show error toast
    } finally {
      setIsSaving(false)
    }
  }

  // Update edges when choices change
  const updateEdgesForNode = (
    nodeId: string,
    choices: Array<{ id: string; nextNodeId: string | null }>
  ) => {
    setEdges((eds) => {
      // Remove old edges from this node
      const filtered = eds.filter((e) => e.source !== nodeId)

      // Add new edges
      const newEdges = choices
        .filter((c) => c.nextNodeId)
        .map((c) => ({
          id: `${nodeId}-${c.nextNodeId}`,
          source: nodeId,
          target: c.nextNodeId!,
          animated: true,
          style: { stroke: "#9CA3AF", strokeWidth: 2 },
        }))

      return [...filtered, ...newEdges]
    })
  }

  // Handle add node
  const handleAddNode = async (nodeData: {
    type: NodeType
    title: string
    text: string
    location: string
  }) => {
    if (!parentNodeIdForAdd) return

    try {
      setIsSaving(true)

      // Add node via API
      const response = await api.stories.addNode(storyId, {
        parentNodeId: parentNodeIdForAdd,
        choiceId: "", // Empty choiceId for now
        type: nodeData.type,
        title: nodeData.title,
        text: nodeData.text,
        location: nodeData.location,
        choices: [], // Empty choices initially
      })

      if (!response.success || !response.data) {
        throw new Error("Failed to add node")
      }

      // Get the new node from API response
      const apiNode = response.data.node as {
        id: string
        sceneNumber?: number
      }
      const newNodeId = apiNode.id
      const newSceneNumber = apiNode.sceneNumber || nodes.length + 1

      // Create new node
      const newNode: TreeNode = {
        id: newNodeId,
        type: "custom",
        position: { x: 0, y: 0 }, // Will be recalculated
        draggable: false,
        data: {
          id: newNodeId,
          sceneNumber: newSceneNumber,
          title: nodeData.title,
          text: nodeData.text,
          location: nodeData.location,
          type: nodeData.type,
          choices: [],
          isSelected: false,
          isHovered: false,
          isParent: false,
          isChild: false,
          isDimmed: false,
          onAddNode: handleAddNodeRequest,
        },
      }

      // Add new node to nodes array
      setNodes((nds) => [...nds, newNode])

      // Add edge from parent to new node
      const newEdge = {
        id: `${parentNodeIdForAdd}-${newNodeId}`,
        source: parentNodeIdForAdd,
        target: newNodeId,
        animated: false,
        style: { stroke: "#9CA3AF", strokeWidth: 2 },
      }
      setEdges((eds) => [...eds, newEdge])

      // Recalculate layout
      setTimeout(() => {
        if (storyData) {
          const updatedNodes = [...nodes.map((n) => n.data), newNode.data]
          const updatedEdges = [
            ...edges.map((e) => ({
              from: e.source as string,
              to: e.target as string,
              choiceId: "",
            })),
            { from: parentNodeIdForAdd, to: newNodeId, choiceId: "" },
          ]

          const updatedData: StoryDetailsResponse = {
            ...storyData,
            tree: {
              nodes: updatedNodes.map((node) => ({
                id: node.id,
                sceneNumber: node.sceneNumber,
                title: node.title,
                text: node.text,
                location: node.location,
                type: node.type,
                choices: node.choices.map((choice) => ({
                  id: choice.id,
                  text: choice.text,
                  nextNodeId: choice.nextNodeId || "",
                  isCorrect: choice.isCorrect,
                })),
              })),
              edges: updatedEdges,
            },
          }
          convertToReactFlowData(updatedData)
        }
      }, 100)

      // Close modal
      setShowAddNodeModal(false)
      setParentNodeIdForAdd(null)

      console.log("Node added successfully")
    } catch (error) {
      console.error("Failed to add node:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle finalize
  const handleFinalize = async () => {
    if (!validation?.isValid) {
      setShowValidation(true)
      return
    }

    try {
      setIsSaving(true)

      // Finalize story structure via API
      await api.stories.finalizeStructure(storyId, {
        nodes: nodes.map((n) => ({
          id: n.id,
          sceneNumber: n.data.sceneNumber,
          title: n.data.title,
          text: n.data.text,
          location: n.data.location,
          type: n.data.type,
          choices: n.data.choices,
        })),
        edges: edges.map((e) => ({
          from: e.source,
          to: e.target,
        })),
      })

      // Navigate to character assignment
      router.push(`/character-assignment/${storyId}`)
    } catch (error) {
      console.error("Failed to finalize:", error)
    } finally {
      setIsSaving(false)
      setShowFinalizeConfirm(false)
    }
  }

  // Get current node data for editing
  const getCurrentNodeData = (): NodeEditFormData | null => {
    if (!selectedNode) return null

    const node = nodes.find((n) => n.id === selectedNode)
    if (!node) return null

    // Map location name to location ID if needed
    let locationId = node.data.location
    if (storyData) {
      const matchingLocation = storyData.locations.find(
        (loc) =>
          loc.name === node.data.location || loc.id === node.data.location
      )
      if (matchingLocation) {
        locationId = matchingLocation.id
      }
    }

    return {
      title: node.data.title,
      text: node.data.text,
      location: locationId,
      choices: node.data.choices,
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={SpinnerSize.Large} />
          <p className="mt-6 text-xl text-gray-700 font-semibold">
            Loading your story structure...
          </p>
        </div>
      </div>
    )
  }

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-600 font-bold text-lg mb-4">
            Failed to load story data
          </p>
          <Button
            onClick={() => router.push("/")}
            variant={ButtonVariant.Primary}
            className="mt-4"
          >
            Go Home
          </Button>
        </Card>
      </div>
    )
  }

  const currentNodeData = getCurrentNodeData()
  const selectedNodeObj = nodes.find((n) => n.id === selectedNode)

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Top Bar */}
      <div className="bg-white border-b-2 border-amber-200 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-amber-400 hover:text-amber-700 transition-all flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Back
            </button>

            <div className="border-l-2 border-gray-300 pl-4">
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                {storyData.title}
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {nodes.length} scenes
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Lesson: {storyData.lesson}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Validation Status */}
            {validation && (
              <button
                onClick={() => setShowValidation(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg ${
                  validation.isValid
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                }`}
              >
                {validation.isValid ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Valid
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validation.errors.length} Issues
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2.5 text-sm font-semibold text-teal-700 bg-teal-50 border-2 border-teal-300 rounded-xl hover:bg-teal-100 hover:border-teal-400 transition-all flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview Story
            </button>

            <button
              onClick={() => setShowFinalizeConfirm(true)}
              disabled={!validation?.isValid}
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Finalize Structure
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tree Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
          </ReactFlow>

          {/* Hover Instructions */}
          {!hoveredNode && nodes.length > 0 && (
            <div className="absolute top-4 left-4 pointer-events-none z-10 animate-fade-in">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Interaction Guide
                </h3>
                <div className="space-y-2 text-sm text-gray-800">
                  <p className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-600"
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
                      <strong>Hover</strong> over nodes to see connections
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-600"
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
                      <strong>Click</strong> to edit node details
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-600"
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
                      <strong>Hover</strong> and click{" "}
                      <strong>"Add Node"</strong> to create child
                    </span>
                  </p>
                  <div className="pt-3 mt-3 border-t-2 border-teal-200 space-y-1.5">
                    <p className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-300"></span>
                      <span className="text-xs">Purple = Parent node</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-300"></span>
                      <span className="text-xs">Green = Child node</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-300"></span>
                      <span className="text-xs">Blue = Hovered node</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Helper Text */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-2xl p-10 shadow-2xl border-2 border-gray-200 text-center max-w-md">
                <svg
                  className="w-16 h-16 text-amber-500 mx-auto mb-4"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Build Your Story
                </h3>
                <p className="text-gray-600">
                  Click on any node to edit its details and create your story
                  structure
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {selectedNode && currentNodeData && selectedNodeObj && (
          <div className="w-[400px] flex-shrink-0">
            <NodeEditPanel
              nodeId={selectedNode}
              sceneNumber={selectedNodeObj.data.sceneNumber}
              nodeType={selectedNodeObj.data.type}
              initialData={currentNodeData}
              locations={storyData.locations.map((loc) => ({
                id: loc.id,
                name: loc.name,
              }))}
              availableNodes={nodes.map((n) => ({
                id: n.id,
                title: n.data.title,
                sceneNumber: n.data.sceneNumber,
              }))}
              onSave={handleNodeSave}
              onCancel={handlePanelClose}
              onDelete={handleDeleteNode}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>
        )}
      </div>

      {/* Validation Modal */}
      <Modal
        isOpen={showValidation}
        onClose={() => setShowValidation(false)}
        title="Story Validation"
        size={ModalSize.Large}
      >
        {validation && (
          <div className="space-y-4">
            {validation.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Errors ({validation.errors.length})
                </h3>
                <div className="space-y-2">
                  {validation.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-800">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Warnings ({validation.warnings.length})
                </h3>
                <div className="space-y-2">
                  {validation.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800">
                        {warning.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validation.isValid && validation.warnings.length === 0 && (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-semibold text-green-900">
                  Your story structure is valid!
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Ready to proceed to character assignment
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Finalize Confirmation Modal */}
      <Modal
        isOpen={showFinalizeConfirm}
        onClose={() => setShowFinalizeConfirm(false)}
        title="Finalize Story Structure"
        footer={
          <>
            <Button
              variant={ButtonVariant.Secondary}
              onClick={() => setShowFinalizeConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Success}
              onClick={handleFinalize}
              loading={isSaving}
            >
              Yes, Finalize
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you ready to finalize the story structure? After this step, you
            will proceed to assign characters to roles.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can still come back and edit the story
              structure later if needed.
            </p>
          </div>
        </div>
      </Modal>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={showAddNodeModal}
        onClose={() => {
          setShowAddNodeModal(false)
          setParentNodeIdForAdd(null)
        }}
        onAdd={handleAddNode}
        isSaving={isSaving}
        locations={storyData?.locations || []}
      />

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Story Preview"
        size={ModalSize.XLarge}
      >
        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {nodes
            .sort((a, b) => a.data.sceneNumber - b.data.sceneNumber)
            .map((node) => (
              <Card key={node.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-900">
                    {node.data.sceneNumber}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {node.data.title}
                    </h3>
                    <p className="text-gray-700 mb-3">{node.data.text}</p>
                    {node.data.choices.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-600">
                          Choices:
                        </p>
                        {node.data.choices.map((choice, idx) => (
                          <div
                            key={choice.id}
                            className="text-sm text-gray-600 pl-4"
                          >
                            {idx + 1}. {choice.text}
                            {choice.isCorrect && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </Modal>
    </div>
  )
}

/**
 * Wrapper component with ReactFlowProvider
 */
export default function StoryTreePage() {
  return (
    <ReactFlowProvider>
      <StoryTreeEditor />
    </ReactFlowProvider>
  )
}
