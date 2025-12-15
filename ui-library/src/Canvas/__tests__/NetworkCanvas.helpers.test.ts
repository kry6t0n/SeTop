import { canConnectNodes } from '../../utils/connectionLogic'
import { buildEdgeForConnection, createNodeForType } from '../NetworkCanvas'

describe('NetworkCanvas helpers', () => {
  test('createNodeForType returns correct shape', () => {
    const node = createNodeForType('router', 12345, 0.5)

    expect(node.id).toContain('router-12345')
    expect(node.type).toBe('custom')
    expect(node.data).toBeDefined()
    expect((node.data as any).type).toBe('router')
  })

  test('buildEdgeForConnection throws on missing nodes', () => {
    expect(() => buildEdgeForConnection({ source: 'x' as any, target: 'y' as any }, [])).toThrow(/Invalid connection/)
  })

  test('buildEdgeForConnection throws when canConnect denies', () => {
    const n1 = createNodeForType('network', 1, 0.1) as any
    const n2 = createNodeForType('router', 2, 0.2) as any

    const fakeCan = jest.fn().mockReturnValue({ allowed: false, message: 'reason' })

    expect(() => buildEdgeForConnection({ source: n1.id, target: n2.id } as any, [n1, n2], fakeCan as any)).toThrow(/Cannot connect: reason/)
  })

  test('buildEdgeForConnection returns edge for allowed connection', () => {
    const n1 = createNodeForType('router', 11, 0.1) as any
    const n2 = createNodeForType('switch', 22, 0.2) as any

    const edge = buildEdgeForConnection({ source: n1.id, target: n2.id } as any, [n1, n2])

    expect(edge).toHaveProperty('id')
    expect(edge.source).toBe(n1.id)
    expect(edge.target).toBe(n2.id)
    expect(edge.data.connectionType).toBeDefined()
    expect(edge.style).toBeDefined()
  })
})
