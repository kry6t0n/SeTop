import React, { useCallback, useState, FC } from 'react'

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  NodeTypes,
  BackgroundVariant
} from 'reactflow'
import 'reactflow/dist/style.css'

import CustomNode from './CustomNodes/CustomNode'
import Toolbar from './Toolbar'
import {
  canConnectNodes,
  getSuggestedConnectionType,
  getConnectionStyle
} from '../utils/connectionLogic'

import type { Node as ConnNode } from '../utils/connectionLogic'

interface CustomNodeData {
  label: string
  type: string
  ip?: string
  mask?: string
  status: string
}

interface CustomEdgeData {
  status: string
  description: string
  connectionType?: string
}

type CustomNodeType = Node<CustomNodeData>
type CustomEdgeType = Edge<CustomEdgeData>

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

const initialNodes: CustomNodeType[] = []
const initialEdges: CustomEdgeType[] = []

const Flow: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<CustomEdgeType | null>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source)
      const targetNode = nodes.find(n => n.id === params.target)

      if (!sourceNode || !targetNode) {
        alert('❌ Invalid connection')

        return
      }

      const compatibility = canConnectNodes(sourceNode as unknown as ConnNode, targetNode as unknown as ConnNode)

      if (!compatibility.allowed) {
        alert(`❌ Cannot connect: ${compatibility.message}`)

        return
      }

      const suggestedType = getSuggestedConnectionType(sourceNode as unknown as ConnNode, targetNode as unknown as ConnNode)

      const src = params.source as string
      const tgt = params.target as string

      const newEdge: CustomEdgeType = {
        id: `${src}-${tgt}-${Date.now()}`,
        source: src,
        target: tgt,
        data: {
          status: 'active',
          description: '',
          connectionType: suggestedType
        },
        style: getConnectionStyle(suggestedType, 'active')
      }

      setEdges((eds) => addEdge(newEdge, eds) as CustomEdgeType[])
      setSelectedNode(null)
      setSelectedEdge(newEdge)
    },
    [nodes, setEdges]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as CustomNodeType)
    setSelectedEdge(null)
  }, [])

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as CustomEdgeType)
    setSelectedNode(null)
  }, [])

  const addNode = useCallback((type: string) => {
    const newNode: CustomNodeType = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type,
        ip: type === 'network' ? '' : `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        mask: type === 'network' ? '' : '255.255.255.0',
        status: 'active'
      }
    }

    setNodes((nds) => nds.concat(newNode))
  }, [setNodes])

  // Keep global references so Editor can access current canvas state when saving
  // (Editor listens for a global 'saveProject' event and reads window.__editorNodes / __editorEdges)
  React.useEffect(() => {
    const w = window as unknown as { __editorNodes?: CustomNodeType[] }

    w.__editorNodes = nodes
  }, [nodes])

  React.useEffect(() => {
    const w = window as unknown as { __editorEdges?: CustomEdgeType[] }

    w.__editorEdges = edges
  }, [edges])

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Toolbar
        onAddNode={addNode}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        nodes={nodes}
        edges={edges}
        onSetNodes={setNodes}
        onSetEdges={setEdges}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}

const NetworkCanvas: FC = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

// Helper: create a node object for tests/logic reuse
export const createNodeForType = (type: string, now = Date.now(), rand = Math.random()) => {
  return {
    id: `${type}-${now}`,
    type: 'custom',
    position: { x: Math.floor(rand * 400), y: Math.floor(rand * 400) },
    data: {
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type,
      ip: type === 'network' ? '' : `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      mask: type === 'network' ? '' : '255.255.255.0',
      status: 'active'
    }
  }
}

// Helper: build edge object or throw on invalid conditions. Mirrors onConnect logic.
// Helper: build edge object or throw on invalid conditions. Mirrors onConnect logic.
export const buildEdgeForConnection = (
  params: Connection,
  nodesList: ConnNode[],
  canConnect: (a: ConnNode, b: ConnNode) => { allowed: boolean; message?: string } =
    canConnectNodes as any,
  suggest: (a: ConnNode, b: ConnNode) => string =
    getSuggestedConnectionType as any,
  styleGetter: (type: string, status: string) => React.CSSProperties =
    getConnectionStyle as any
): CustomEdgeType => {
  const sourceNode = nodesList.find(n => n.id === params.source)
  const targetNode = nodesList.find(n => n.id === params.target)

  if (!sourceNode || !targetNode) {
    throw new Error('Invalid connection')
  }

  const compatibility = canConnect(sourceNode as any, targetNode as any)

  if (!compatibility.allowed) {
    throw new Error(`Cannot connect: ${compatibility.message}`)
  }

  const suggestedType = suggest(sourceNode as any, targetNode as any)

  const src = params.source as string
  const tgt = params.target as string

  const newEdge: CustomEdgeType = {
    id: `${src}-${tgt}-${Date.now()}`,
    source: src,
    target: tgt,
    data: {
      status: 'active',
      description: '',
      connectionType: suggestedType
    },
    style: styleGetter(suggestedType, 'active')
  }

  return newEdge
}

export default NetworkCanvas
