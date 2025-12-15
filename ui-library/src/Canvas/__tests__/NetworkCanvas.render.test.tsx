import * as React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// We'll mock reactflow before importing the component under test.
beforeEach(() => {
  jest.resetModules()

  jest.doMock('reactflow', () => {
    // Use the same React instance to avoid multiple-React copies
    const { useState, useEffect } = React

    const ReactFlowProvider = ({ children }: any) => children

    const ReactFlow = (props: any) => {
      // expose a test control to trigger onConnect from the test
      return (
        React.createElement('div', { 'data-testid': 'reactflow' },
          React.createElement('button', {
            'data-testid': 'rf-connect',
            onClick: () => props.onConnect && props.onConnect({ source: 'n1', target: 'n2' })
          }, 'connect'),
          props.children
        )
      )
    }

    const Controls = () => React.createElement('div', null)
    const MiniMap = () => React.createElement('div', null)
    const Background = () => React.createElement('div', null)

    const useNodesState = (init: any) => {
      const [nodes, setNodes] = useState(init || [])

      return [nodes, setNodes, () => {}]
    }

    const useEdgesState = (init: any) => {
      const [edges, setEdges] = useState(init || [])

      return [edges, setEdges, () => {}]
    }

    const addEdge = (edge: any, edges: any[]) => edges.concat(edge)

    return {
      __esModule: true,
      ReactFlowProvider,
      ReactFlow,
      Controls,
      MiniMap,
      Background,
      useNodesState,
      useEdgesState,
      addEdge,
      BackgroundVariant: { Dots: 'dots' }
    }
  })
})

test('NetworkCanvas renders, adds nodes and creates edges via onConnect', async () => {
  const NetworkCanvas = require('../NetworkCanvas').default

  render(React.createElement(NetworkCanvas))

  // Initially, effects should set globals (empty arrays)
  expect((window as any).__editorNodes).toBeDefined()
  expect((window as any).__editorEdges).toBeDefined()

  // Click the toolbar router button to add a node. The toolbar labels include 'Router'.
  const routerButton = await screen.findByText(/Router/i)

  fireEvent.click(routerButton)

  // After adding a node, the global nodes should include at least one element
  await waitFor(() => {
    const nodes = (window as any).__editorNodes

    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes.length).toBeGreaterThanOrEqual(1)
  })

  // Add a second node by clicking 'Switch' to have at least two nodes
  const switchButton = await screen.findByText(/Switch/i)

  fireEvent.click(switchButton)

  await waitFor(() => {
    const nodes = (window as any).__editorNodes

    expect(nodes.length).toBeGreaterThanOrEqual(2)
  })

  // Ensure nodes have ids n1 and n2 for our simulated onConnect to work; if not, map them
  const nodes: any[] = (window as any).__editorNodes || []

  if (!nodes.find(n => n.id === 'n1')) {
    // mutate globals to include predictable ids
    (window as any).__editorNodes = [
      { id: 'n1', data: { type: 'router' } },
      { id: 'n2', data: { type: 'switch' } }
    ]
  }

  // Trigger the mock ReactFlow connect button which calls props.onConnect
  const connectBtn = await screen.findByTestId('rf-connect')

  fireEvent.click(connectBtn)

  // After onConnect, edges should be present
  await waitFor(() => {
    const edges = (window as any).__editorEdges

    expect(Array.isArray(edges)).toBe(true)
    expect(edges.length).toBeGreaterThanOrEqual(1)
  })
})
