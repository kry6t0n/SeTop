/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getNetworkAddress,
  areIPsCompatible,
  canConnectNodes,
  validateConnections,
  getConnectionStyle,
  getSuggestedConnectionType,
  getEdgeInfo,
  CONNECTION_TYPES
} from '../connectionLogic'

describe('connectionLogic utils', () => {
  test('getNetworkAddress returns correct network', () => {
    expect(getNetworkAddress('10.0.0.1', '255.255.255.0')).toBe('10.0.0.0')
    expect(getNetworkAddress('192.168.1.5', '255.255.255.0')).toBe('192.168.1.0')
  })

  test('getNetworkAddress returns null for invalid inputs', () => {
    expect(getNetworkAddress(null as any, '255.255.255.0')).toBeNull()
    expect(getNetworkAddress('not.an.ip', '255.255.255.0')).toBeNull()
    expect(getNetworkAddress('10.0.0.1', 'invalid.mask')).toBeNull()
  })

  test('areIPsCompatible detects networks', () => {
    expect(areIPsCompatible('10.0.0.1', '255.255.255.0', '10.0.0.2', '255.255.255.0')).toBe(true)
    expect(areIPsCompatible('10.0.0.1', '255.255.255.0', '192.168.0.1', '255.255.255.0')).toBe(false)
  })

  test('getSuggestedConnectionType covers router/switch/network cases', () => {
    const router = { id: 'r', data: { type: 'router' } }
    const switchN = { id: 's', data: { type: 'switch' } }
    const network = { id: 'n', data: { type: 'network' } }

    expect(getSuggestedConnectionType(router as any, network as any)).toBe('routing')
    expect(getSuggestedConnectionType(router as any, switchN as any)).toBe('routing')
    expect(getSuggestedConnectionType(switchN as any, router as any)).toBe('routing')
    expect(getSuggestedConnectionType(switchN as any, switchN as any)).toBe('physical')
  })

  test('canConnectNodes rejects self-connect and invalid nodes', () => {
    const a = { id: 'a' }

    expect(canConnectNodes(a as any, a as any).allowed).toBe(false)
    // invalid node
    expect(canConnectNodes(null as any, a as any).allowed).toBe(false)
  })

  test('validateConnections validates IP compatibility and structural checks', () => {
    const nodes = [
      { id: 'n1', data: { label: 'N1', ip: '10.0.0.1', mask: '255.255.255.0' } },
      { id: 'n2', data: { label: 'N2', ip: '10.0.0.2', mask: '255.255.255.0' } },
      { id: 'n3', data: { label: 'N3', ip: '192.168.0.1', mask: '255.255.255.0' } }
    ]

    const edgesOk = [{ source: 'n1', target: 'n2' }]
    const resultOk = validateConnections(nodes, edgesOk as any)

    expect(resultOk.valid).toBe(true)

    const edgesBad = [{ source: 'n1', target: 'n3' }]
    const resultBad = validateConnections(nodes, edgesBad as any)

    expect(resultBad.valid).toBe(false)
    expect(resultBad.errors.length).toBeGreaterThan(0)
  })

  test('validateConnections reports invalid edges for missing nodes', () => {
    const nodes = [{ id: 'a', data: { label: 'A' } }]
    const edges = [{ source: 'a', target: 'missing' }]
    const res = validateConnections(nodes as any, edges as any)

    expect(res.valid).toBe(false)
    expect(res.errors[0]).toMatch(/Invalid edge/)
  })

  test('getConnectionStyle and getEdgeInfo return expected shapes', () => {
    const style = getConnectionStyle('physical', 'active')

    expect(style.stroke).toBeDefined()
    const edgeInfo = getEdgeInfo({ connectionType: CONNECTION_TYPES.PHYSICAL, source: 'a', target: 'b' })

    expect(edgeInfo.type).toBe(CONNECTION_TYPES.PHYSICAL)
    expect(edgeInfo.label).toBeTruthy()
  })
})
