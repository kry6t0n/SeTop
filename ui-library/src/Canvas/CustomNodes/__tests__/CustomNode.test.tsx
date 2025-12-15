/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react'

// Mock reactflow Handle and Position to avoid DOM context requirements
jest.mock('reactflow', () => ({
  // simple stub components — do not reference React here because jest.mock is hoisted
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom' },
}))

import CustomNode from '../CustomNode'

test('CustomNode renders label, ip/mask and status for non-network', () => {
  const data = { label: 'Srv1', type: 'server', ip: '10.0.0.5', mask: '255.255.255.0', status: 'active' }

  // use JSX and cast to any to bypass strict NodeProps
  render(<CustomNode {...({ id: 'n1', data } as any)} /> as any)

  expect(screen.getByText('Srv1')).toBeInTheDocument()
  expect(screen.getByText(/IP:/)).toBeInTheDocument()
  expect(screen.getByText(/Mask:/)).toBeInTheDocument()
  expect(screen.getByText(/Status:/)).toBeInTheDocument()
})

test('CustomNode renders Global Network for network type', () => {
  const data = { label: 'Net', type: 'network', status: 'active' }

  render(<CustomNode {...({ id: 'n2', data } as any)} /> as any)

  expect(screen.getByText(/Global Network/)).toBeInTheDocument()
})
