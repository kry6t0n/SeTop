/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, fireEvent } from '@testing-library/react'

import Toolbar from '../Toolbar'

jest.mock('../../utils/exportUtils', () => ({
  exportToJson: jest.fn(),
  importFromJson: jest.fn()
}))

describe('Toolbar component', () => {
  const baseProps = {
    onAddNode: jest.fn(),
    selectedNode: null,
    selectedEdge: null,
    nodes: [],
    edges: [],
    onSetNodes: jest.fn(),
    onSetEdges: jest.fn()
  }

  test('renders Save Project and Export buttons and dispatches saveProject', () => {
    render(<Toolbar {...baseProps} />)

    const saveBtn = screen.getByText(/Save Project/i)
    const handler = jest.fn()

    window.addEventListener('saveProject', handler)

    fireEvent.click(saveBtn)

    expect(handler).toHaveBeenCalled()
  })

  test('apply node changes calls onSetNodes', () => {
    const node = { id: 'n1', data: { type: 'server', ip: '', mask: '' }, position: { x: 0, y: 0 } }
    const props = { ...baseProps, selectedNode: node as any, nodes: [node as any] }

    render(<Toolbar {...props} />)

    const ipInput = screen.getByPlaceholderText('IP Address') as HTMLInputElement
    const maskInput = screen.getByPlaceholderText('Subnet Mask') as HTMLInputElement

    fireEvent.change(ipInput, { target: { value: '10.0.0.5' } })
    fireEvent.change(maskInput, { target: { value: '255.255.255.0' } })

    const applyBtn = screen.getByText('Apply')

    fireEvent.click(applyBtn)

    expect(props.onSetNodes).toHaveBeenCalled()
  })

  test('Apply node changes shows error for invalid IP', () => {
    const onSetNodes = jest.fn()
    const nodes = [
      { id: '1', data: { ip: '10.0.0.1', mask: '24' } },
    ]

    render(
      <Toolbar
        onAddNode={() => {}}
        selectedNode={{ id: '1', data: { ip: '10.0.0.1', mask: '24' } } as any}
        nodes={nodes as any}
        onSetNodes={onSetNodes}
        selectedEdge={null}
        edges={[]}
        onSetEdges={() => {}}
      />
    )

    const ipInput = screen.getByPlaceholderText('IP Address') as HTMLInputElement
    const maskInput = screen.getByPlaceholderText('Subnet Mask') as HTMLInputElement

    fireEvent.change(ipInput, { target: { value: '999.999.999.999' } })
    fireEvent.change(maskInput, { target: { value: '255.255.255.0' } })

    fireEvent.click(screen.getByText('Apply'))

    expect(onSetNodes).not.toHaveBeenCalled()
    expect(screen.getByText(/Invalid IP address/i)).toBeInTheDocument()
  })

  test('Apply node changes shows error for duplicate IP', () => {
    const onSetNodes = jest.fn()
    const nodes = [
      { id: '1', data: { ip: '10.0.0.1', mask: '24' } },
      { id: '2', data: { ip: '10.0.0.2', mask: '24' } },
    ]

    render(
      <Toolbar
        onAddNode={() => {}}
        selectedNode={{ id: '2', data: { ip: '10.0.0.1', mask: '24' } } as any}
        nodes={nodes as any}
        onSetNodes={onSetNodes}
        selectedEdge={null}
        edges={[]}
        onSetEdges={() => {}}
      />
    )

    // ensure mask is valid so duplicate check runs
    const maskInput2 = screen.getByPlaceholderText('Subnet Mask') as HTMLInputElement

    fireEvent.change(maskInput2, { target: { value: '255.255.255.0' } })
    fireEvent.click(screen.getByText('Apply'))

    expect(onSetNodes).not.toHaveBeenCalled()
    expect(screen.getByText(/IP address is already used by another device/i)).toBeInTheDocument()
  })

  test('Edge reset restores original values', () => {
    const onSetEdges = jest.fn()
    const edges = [
      { id: 'e1', data: { type: 'ethernet', status: 'up' }, source: '1', target: '2' },
    ]

    render(
      <Toolbar
        onAddNode={() => {}}
        selectedNode={null}
        nodes={[]}
        onSetNodes={() => {}}
        selectedEdge={edges[0] as any}
        edges={edges as any}
        onSetEdges={onSetEdges}
      />
    )

    const typeLabel = screen.getByText('Connection Type')
    const typeContainer = typeLabel.closest('div') as HTMLElement
    const typeSelect = typeContainer.querySelector('select') as HTMLSelectElement

    fireEvent.change(typeSelect, { target: { value: 'wireless' } })

    fireEvent.click(screen.getByText('Reset'))

    // After reset, the select should reflect the default edge type used by the toolbar
    expect(typeSelect.value).toBe('physical')
  })

  test('edge apply calls onSetEdges', () => {
    const edge = { id: 'e1', source: 'a', target: 'b', data: { connectionType: 'physical', status: 'active' } }
    const props = { ...baseProps, selectedEdge: edge as any, edges: [edge] }

    render(<Toolbar {...props} />)

    const applyBtn = screen.getByText('Apply')

    fireEvent.click(applyBtn)

    expect(props.onSetEdges).toHaveBeenCalled()
  })
})
