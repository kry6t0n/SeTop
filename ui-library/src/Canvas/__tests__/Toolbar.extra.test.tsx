import * as React from 'react'

import { render, fireEvent, screen } from '@testing-library/react'

jest.mock('../../utils/exportUtils', () => ({
  exportToJson: jest.fn(),
  importFromJson: jest.fn()
}))

import { CONNECTION_STYLES } from '../../utils/connectionLogic'
import { exportToJson } from '../../utils/exportUtils'
import Toolbar from '../Toolbar'

describe('Toolbar extra branches', () => {
  const baseNodes = [
    { id: '1', data: { ip: '10.0.0.1', type: 'router' } },
    { id: '2', data: { ip: '10.0.0.2', type: 'workstation' } }
  ]

  const baseEdges = [
    { id: 'e1', source: '1', target: '2', data: { connectionType: 'physical', status: 'active' }, style: {} }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('device and network add buttons call onAddNode', () => {
    const onAddNode = jest.fn()

    render(
      <Toolbar
        onAddNode={onAddNode}
        selectedNode={null}
        selectedEdge={null}
        nodes={[]}
        edges={[]}
        onSetNodes={() => {}}
        onSetEdges={() => {}}
      />
    )

    // Click a device button and a network button
    const routerBtn = screen.getByText('Router')
    const networkBtn = screen.getByText('Network/Internet')

    fireEvent.click(routerBtn)
    fireEvent.click(networkBtn)

    expect(onAddNode).toHaveBeenCalledWith('router')
    expect(onAddNode).toHaveBeenCalledWith('network')
  })

  test('save and export buttons trigger events / export util', () => {
    const onAddNode = jest.fn()

    const saved = jest.fn()

    window.addEventListener('saveProject', saved)

    render(
      <Toolbar
        onAddNode={onAddNode}
        selectedNode={null}
        selectedEdge={null}
        nodes={baseNodes}
        edges={baseEdges}
        onSetNodes={() => {}}
        onSetEdges={() => {}}
      />
    )

    const saveBtn = screen.getByText('💾 Save Project')
    const exportBtn = screen.getByText('📥 Export')

    fireEvent.click(saveBtn)
    expect(saved).toHaveBeenCalled()

    fireEvent.click(exportBtn)
    expect(exportToJson).toHaveBeenCalledWith({ nodes: baseNodes, edges: baseEdges })

    window.removeEventListener('saveProject', saved)
  })

  test('node properties: invalid ip/mask and duplicate detection and apply success', () => {
    const onSetNodes = jest.fn()

    const selectedNode = { id: '2', data: { ip: '10.0.0.2', mask: '255.255.255.0', type: 'workstation' } }

    render(
      <Toolbar
        onAddNode={() => {}}
        selectedNode={selectedNode as any}
        selectedEdge={null}
        nodes={baseNodes}
        edges={baseEdges}
        onSetNodes={onSetNodes}
        onSetEdges={() => {}}
      />
    )

    // Invalid IP
    const ipInput = screen.getByPlaceholderText('IP Address') as HTMLInputElement
    const maskInput = screen.getByPlaceholderText('Subnet Mask') as HTMLInputElement
    const applyBtn = screen.getByText('Apply')

    fireEvent.change(ipInput, { target: { value: '999.999.999.999' } })
    fireEvent.click(applyBtn)
    expect(onSetNodes).not.toHaveBeenCalled()
    expect(screen.getByText('Invalid IP address')).toBeDefined()

    // Invalid mask
    fireEvent.change(ipInput, { target: { value: '10.0.0.2' } })
    fireEvent.change(maskInput, { target: { value: '999.999.999.999' } })
    fireEvent.click(applyBtn)
    expect(onSetNodes).not.toHaveBeenCalled()
    expect(screen.getByText('Invalid subnet mask')).toBeDefined()

    // Duplicate IP (node 1 has 10.0.0.1) - set IP to that value and try apply
    fireEvent.change(ipInput, { target: { value: '10.0.0.1' } })
    fireEvent.change(maskInput, { target: { value: '255.255.255.0' } })
    fireEvent.click(applyBtn)
    expect(onSetNodes).not.toHaveBeenCalled()
    expect(screen.getByText('IP address is already used by another device')).toBeDefined()

    // Valid apply
    fireEvent.change(ipInput, { target: { value: '10.0.0.250' } })
    fireEvent.change(maskInput, { target: { value: '255.255.255.0' } })
    fireEvent.click(applyBtn)

    expect(onSetNodes).toHaveBeenCalled()
    const updated = onSetNodes.mock.calls[0][0]

    expect(updated.find((n: any) => n.id === '2').data.ip).toBe('10.0.0.250')

    // Reset should restore values from selectedNode
    const resetBtn = screen.getByText('Reset')

    fireEvent.change(ipInput, { target: { value: '1.2.3.4' } })
    fireEvent.click(resetBtn)
    expect(ipInput.value).toBe('10.0.0.2')
  })

  test('edge properties apply and reset', () => {
    const onSetEdges = jest.fn()

    const selectedEdge = { id: 'e1', source: '1', target: '2', data: { connectionType: 'wireless', status: 'inactive' }, style: {} }

    render(
      <Toolbar
        onAddNode={() => {}}
        selectedNode={null}
        selectedEdge={selectedEdge as any}
        nodes={baseNodes}
        edges={baseEdges}
        onSetNodes={() => {}}
        onSetEdges={onSetEdges}
      />
    )

    const typeSelect = screen.getByLabelText('Connection Type') as HTMLSelectElement
    const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement
    const applyBtn = screen.getByText('Apply')
    const resetBtn = screen.getByText('Reset')

    // change to something else then reset
    fireEvent.change(typeSelect, { target: { value: 'physical' } })
    fireEvent.change(statusSelect, { target: { value: 'error' } })
    fireEvent.click(resetBtn)

    // After reset, apply should use defaults physical/active
    fireEvent.click(applyBtn)

    expect(onSetEdges).toHaveBeenCalled()
    const newEdges = onSetEdges.mock.calls[0][0]
    const applied = newEdges.find((e: any) => e.id === 'e1')

    expect(applied.data.connectionType).toBe('physical')
    expect(applied.data.status).toBe('active')
    // style should reflect connection style
    expect(applied.style).toEqual(CONNECTION_STYLES['physical'].style)
  })
})
