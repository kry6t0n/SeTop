import {
  getConnectionStyle,
  getNetworkAddress,
  areIPsCompatible,
  canConnectNodes,
  getSuggestedConnectionType,
  getEdgeInfo,
  validateConnections,
  CONNECTION_TYPES
} from '../connectionLogic'

describe('connectionLogic extras', () => {
  test('getConnectionStyle uses error strokeDasharray when status=error', () => {
    const style = getConnectionStyle('physical', 'error')

    expect(style.strokeDasharray).toBeDefined()
    expect(style.stroke).toBeDefined()
  })

  test('getNetworkAddress calculates and validates', () => {
    expect(getNetworkAddress('192.168.1.10', '255.255.255.0')).toBe('192.168.1.0')
    expect(getNetworkAddress('192.168', '255.255.255.0')).toBeNull()
    expect(getNetworkAddress(null as any, '255.255.255.0')).toBeNull()
    expect(getNetworkAddress('999.999.999.999', '255.255.255.0')).toBeNull()
  })

  test('areIPsCompatible compares networks', () => {
    expect(areIPsCompatible('192.168.1.2', '255.255.255.0', '192.168.1.3', '255.255.255.0')).toBe(true)
    expect(areIPsCompatible('192.168.1.2', '255.255.255.0', '10.0.0.1', '255.0.0.0')).toBe(false)
  })

  test('canConnectNodes covers invalid cases', () => {
    expect(canConnectNodes(undefined as any, { id: '1' } as any).allowed).toBe(false)
    expect(canConnectNodes({ id: '1' } as any, { id: '1' } as any).allowed).toBe(false)
    expect(canConnectNodes({ id: '1', data: { type: 'network' } } as any, { id: '2' } as any).allowed).toBe(false)
    expect(canConnectNodes({ id: 'a', data: { type: 'host' } } as any, { id: 'b', data: { type: 'host' } } as any).allowed).toBe(true)
  })

  test('getSuggestedConnectionType heuristic', () => {
    const n = { id: 'n', data: { type: 'network' } } as any
    const r = { id: 'r', data: { type: 'router' } } as any
    const s = { id: 's', data: { type: 'switch' } } as any

    expect(getSuggestedConnectionType(r, n)).toBe(CONNECTION_TYPES.ROUTING)
    expect(getSuggestedConnectionType(r, s)).toBe(CONNECTION_TYPES.ROUTING)
    expect(getSuggestedConnectionType(s, s)).toBe(CONNECTION_TYPES.PHYSICAL)
  })

  test('getEdgeInfo handles unknown types', () => {
    const info = getEdgeInfo({} as any)

    expect(info.type).toBeDefined()
    expect(info.label).toBeDefined()
  })

  test('validateConnections reports errors for missing nodes and incompatible ips', () => {
    const nodes = [
      { id: 'a', data: { label: 'A', ip: '192.168.1.2', mask: '255.255.255.0' } } as any,
      { id: 'b', data: { label: 'B', ip: '10.0.0.2', mask: '255.0.0.0' } } as any
    ]

    const edges1 = [{ source: 'a', target: 'c' } as any]
    const res1 = validateConnections(nodes, edges1)

    expect(res1.valid).toBe(false)
    expect(res1.errors.length).toBeGreaterThan(0)

    const edges2 = [{ source: 'a', target: 'b', connectionType: 'physical' } as any]
    const res2 = validateConnections(nodes, edges2)

    expect(res2.valid).toBe(false)
    expect(res2.errors.some(e => /Incompatible networks/.test(e))).toBe(true)
  })
})
