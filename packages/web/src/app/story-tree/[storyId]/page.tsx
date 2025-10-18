"use client"

import { Button, Card, LoadingSpinner, Modal } from "@/components"
import {
  ButtonSize,
  ButtonVariant,
  ModalSize,
  SpinnerSize,
} from "@/components/types"
import { NodeType } from "@/types"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useParams, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { CustomTreeNode } from "../components/CustomTreeNode"
import { NodeEditPanel } from "../components/NodeEditPanel"
import { NodeEditFormData, TreeNode, TreeValidation } from "../types"
import { calculateTreeLayout } from "../utils/treeLayout"
import { validateTree } from "../utils/treeValidation"
import {
  mockStoryTreeData,
  simulateDelay,
  StoryDetailsResponse,
} from "./story-tree.page.mock"

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
              { type: NodeType.BAD_ENDING, label: "Bad Ending", icon: "❌" },
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
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
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
  const nodeTypes = useMemo(() => ({ custom: CustomTreeNode }), []) as any

  // Load story data
  useEffect(() => {
    loadStoryData()
  }, [storyId])

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
  }, [selectedNode, nodes, hasUnsavedChanges])

  // Load story data from API
  const loadStoryData = async () => {
    try {
      setIsLoading(true)

      // Simulate API call with mock data
      await simulateDelay(1000)

      // In production: const response = await api.get(`/stories/${storyId}`)
      const response = mockStoryTreeData

      if (response.success && response.data) {
        setStoryData(response.data)
        convertToReactFlowData(response.data)
      }
    } catch (error) {
      console.error("Failed to load story:", error)
      // Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  // Get parent and child nodes for hover highlighting
  const getRelatedNodes = (nodeId: string) => {
    const parents = edges
      .filter((e: any) => e.target === nodeId)
      .map((e: any) => e.source)
    const children = edges
      .filter((e: any) => e.source === nodeId)
      .map((e: any) => e.target)
    return { parents, children }
  }

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
          choices: node.choices,
          isSelected: false,
          isHovered: false,
          isParent: false,
          isChild: false,
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
  const validateTreeStructure = (currentNodes: any[], currentEdges: any[]) => {
    const nodeData = currentNodes.map((n: any) => n.data)
    const edgeData = currentEdges.map((e: any) => ({
      from: e.source,
      to: e.target,
    }))

    const result = validateTree(nodeData, edgeData)
    setValidation(result)
  }

  // Handle node hover
  const onNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setHoveredNode(node.id)

      // Get related nodes
      const { parents, children } = getRelatedNodes(node.id)

      // Update node hover state
      setNodes((nds: any) =>
        nds.map((n: any) => ({
          ...n,
          data: {
            ...n.data,
            isHovered: n.id === node.id,
            isParent: parents.includes(n.id),
            isChild: children.includes(n.id),
          },
        }))
      )

      // Update edge styles
      setEdges((eds: any) =>
        eds.map((e: any) => {
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
    [edges, setNodes, setEdges]
  )

  // Handle node hover leave
  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)

    // Reset node hover state
    setNodes((nds: any) =>
      nds.map((n: any) => ({
        ...n,
        data: {
          ...n.data,
          isHovered: false,
          isParent: false,
          isChild: false,
        },
      }))
    )

    // Reset edge styles
    setEdges((eds: any) =>
      eds.map((e: any) => ({
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
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node.id)
      setHasUnsavedChanges(false)

      // Update node selection state
      setNodes((nds: any) =>
        nds.map((n: any) => ({
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
    setNodes((nds: any) =>
      nds.map((n: any) => ({
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

      // Simulate API call
      await simulateDelay(800)

      // In production:
      // await api.patch(`/stories/${storyId}/nodes/${selectedNode}`, formData)

      // Update local state
      setNodes((nds: any) =>
        nds.map((node: any) => {
          if (node.id === selectedNode) {
            return {
              ...node,
              data: {
                ...node.data,
                title: formData.title,
                text: formData.text,
                location: formData.location,
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
    setEdges((eds: any) => {
      // Remove old edges from this node
      const filtered = eds.filter((e: any) => e.source !== nodeId)

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

      // Simulate API call
      await simulateDelay(800)

      // In production:
      // const response = await api.post(`/stories/${storyId}/nodes`, {
      //   parentNodeId: parentNodeIdForAdd,
      //   choiceId: null, // Optional: can be used to link to specific choice
      //   type: nodeData.type,
      //   title: nodeData.title,
      //   text: nodeData.text,
      //   location: nodeData.location,
      //   choices: [], // Empty choices initially
      // })

      // Generate a new node ID (in production, this comes from API)
      const newNodeId = `node-${Date.now()}`
      const newSceneNumber = nodes.length + 1

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
          onAddNode: handleAddNodeRequest,
        },
      }

      // Add new node to nodes array
      setNodes((nds: any) => [...nds, newNode])

      // Add edge from parent to new node
      const newEdge = {
        id: `${parentNodeIdForAdd}-${newNodeId}`,
        source: parentNodeIdForAdd,
        target: newNodeId,
        animated: false,
        style: { stroke: "#9CA3AF", strokeWidth: 2 },
      }
      setEdges((eds: any) => [...eds, newEdge])

      // Recalculate layout
      setTimeout(() => {
        if (storyData) {
          const updatedData = {
            ...storyData,
            tree: {
              nodes: [...nodes.map((n: any) => n.data), newNode.data],
              edges: [
                ...edges.map((e: any) => ({ from: e.source, to: e.target })),
                { from: parentNodeIdForAdd, to: newNodeId },
              ],
            },
          }
          convertToReactFlowData(updatedData as any)
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

  // Handle node delete
  const handleDeleteNode = async () => {
    if (!selectedNode) return

    const node = nodes.find((n: any) => n.id === selectedNode)
    if (!node || node.data.type === NodeType.START) {
      alert("Cannot delete the start node")
      return
    }

    try {
      setIsSaving(true)

      // Simulate API call
      await simulateDelay(500)

      // In production:
      // await api.delete(`/stories/${storyId}/nodes/${selectedNode}`)

      // Remove node
      setNodes((nds: any) => nds.filter((n: any) => n.id !== selectedNode))

      // Remove associated edges
      setEdges((eds: any) =>
        eds.filter(
          (e: any) => e.source !== selectedNode && e.target !== selectedNode
        )
      )

      setSelectedNode(null)
      setHasUnsavedChanges(false)

      // Revalidate
      setTimeout(() => {
        validateTreeStructure(
          nodes.filter((n: any) => n.id !== selectedNode),
          edges
        )
      }, 100)

      console.log("Node deleted successfully")
    } catch (error) {
      console.error("Failed to delete node:", error)
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

      // Simulate API call
      await simulateDelay(1000)

      // In production:
      // await api.post(`/stories/${storyId}/finalize-structure`)

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

    const node = nodes.find((n: any) => n.id === selectedNode)
    if (!node) return null

    return {
      title: node.data.title,
      text: node.data.text,
      location: node.data.location,
      choices: node.data.choices,
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size={SpinnerSize.Large} />
      </div>
    )
  }

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-red-600">Failed to load story data</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Home
          </Button>
        </Card>
      </div>
    )
  }

  const currentNodeData = getCurrentNodeData()
  const selectedNodeObj = nodes.find((n: any) => n.id === selectedNode) as any

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => router.push("/")}
            >
              ← Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {storyData.title}
              </h1>
              <p className="text-sm text-gray-600">
                {nodes.length} scenes • Lesson: {storyData.lesson}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Validation Status */}
            {validation && (
              <button
                onClick={() => setShowValidation(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  validation.isValid
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
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

            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Medium}
              onClick={() => setShowPreview(true)}
            >
              Preview Story
            </Button>

            <Button
              variant={ButtonVariant.Success}
              size={ButtonSize.Medium}
              onClick={() => setShowFinalizeConfirm(true)}
              disabled={!validation?.isValid}
            >
              Finalize Structure →
            </Button>
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
            <div className="absolute top-4 left-4 pointer-events-none z-10">
              <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg">
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  💡 Interaction Guide
                </h3>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    • <strong>Hover</strong> over nodes to see connections
                  </p>
                  <p>
                    • <strong>Click</strong> to edit node details
                  </p>
                  <p>
                    • <strong>Hover</strong> and click{" "}
                    <strong>"Add Node"</strong> to create child nodes
                  </p>
                  <p className="mt-2 pt-2 border-t border-gray-200">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-400 mr-1"></span>
                    Purple ring = Parent node
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
                    Green ring = Child node
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    Blue highlight = Current node
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Helper Text */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Card className="p-8 shadow-lg">
                <p className="text-gray-600">Click on any node to edit it</p>
              </Card>
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
              availableNodes={nodes.map((n: any) => ({
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
            .sort((a: any, b: any) => a.data.sceneNumber - b.data.sceneNumber)
            .map((node: any) => (
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
                        {node.data.choices.map((choice: any, idx: number) => (
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
