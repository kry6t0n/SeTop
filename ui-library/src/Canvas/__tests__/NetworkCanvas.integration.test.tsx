// Integration-style test for NetworkCanvas using isolated module mocking
import { render } from '@testing-library/react'
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */

test('NetworkCanvas renders and sets window globals', () => {
  jest.isolateModules(() => {
    // require React inside the isolated module scope so we can use it in our mock
     
    const React = require('react')

    // mock reactflow without relying on hooks or React internals to avoid
    // multiple-React-copy issues in the test environment
    jest.doMock('reactflow', () => {
      let nodesState: any[] = []
      let edgesState: any[] = []

      return {
        __esModule: true,
        ReactFlowProvider: ({ children }: any) => children,
        ReactFlow: ({ children }: any) => children,
        Controls: () => null,
        MiniMap: () => null,
        Background: () => null,
        useNodesState: (init: any) => {
          nodesState = init || []

          const setNodes = (up: any) => {
            if (typeof up === 'function') nodesState = up(nodesState)
            else nodesState = up
          }

          return [nodesState, setNodes, () => {}]
        },
        useEdgesState: (init: any) => {
          edgesState = init || []

          const setEdges = (up: any) => {
            if (typeof up === 'function') edgesState = up(edgesState)
            else edgesState = up
          }

          return [edgesState, setEdges, () => {}]
        },
        addEdge: (edge: any, edges: any[]) => edges.concat(edge),
        BackgroundVariant: { Dots: 'dots' }
      }
    })

    // require the module after mocks are in place
     
    const NetworkCanvas = require('../NetworkCanvas').default

    // Globals should be set by Flow's effects
    render(React.createElement(NetworkCanvas))

    expect((window as any).__editorNodes).toBeDefined()
    expect((window as any).__editorEdges).toBeDefined()
  })
})
