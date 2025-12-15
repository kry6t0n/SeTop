/**
 * Логика для управления соединениями между устройствами в сети
 */

export const CONNECTION_TYPES = {
  PHYSICAL: 'physical',
  ROUTING: 'routing',
  LOGICAL: 'logical'
}

export const CONNECTION_STYLES = {
  physical: {
    strokeDasharray: 'none',
    strokeWidth: 2,
    label: 'Physical'
  },
  routing: {
    strokeDasharray: '5,5',
    strokeWidth: 2,
    label: 'Routing'
  },
  logical: {
    strokeDasharray: '10,5',
    strokeWidth: 2,
    label: 'Logical'
  }
}

export const CONNECTION_STATUS_STYLES = {
  active: {
    stroke: '#10b981',
    opacity: 1
  },
  inactive: {
    stroke: '#ef9a00',
    opacity: 0.6
  },
  error: {
    stroke: '#ef4444',
    opacity: 1,
    strokeDasharray: '3,3'
  }
}

interface ConnectionStyle {
  strokeDasharray?: string
  strokeWidth?: number
  stroke?: string
  opacity?: number
}

interface NodeData {
  type?: string
  ip?: string
  mask?: string
  label?: string
  [key: string]: unknown
}

export interface Node {
  id: string
  data?: NodeData
}

interface CanConnectResult {
  allowed: boolean
  message: string
}

export const getConnectionStyle = (connectionType: string = 'physical', status: string = 'active'): ConnectionStyle => {
  const typeStyle = (CONNECTION_STYLES as Record<string, ConnectionStyle>)[connectionType] || CONNECTION_STYLES.physical
  const statusStyle = ((CONNECTION_STATUS_STYLES as Record<string, unknown>)[status] || CONNECTION_STATUS_STYLES.active) as ConnectionStyle

  const dash = status === 'error' ? statusStyle.strokeDasharray : typeStyle.strokeDasharray

  return {
    ...typeStyle,
    stroke: statusStyle.stroke,
    opacity: statusStyle.opacity,
    strokeDasharray: dash ?? typeStyle.strokeDasharray
  }
}

export const getNetworkAddress = (ip: string | null, mask: string): string | null => {
  if (!ip || !mask) return null

  try {
    const ipParts = ip.split('.').map(Number)
    const maskParts = mask.split('.').map(Number)

    if (ipParts.length !== 4 || maskParts.length !== 4) {
      return null
    }

    for (let i = 0; i < 4; i++) {
      if (isNaN(ipParts[i]) || isNaN(maskParts[i]) ||
        ipParts[i] < 0 || ipParts[i] > 255 ||
        maskParts[i] < 0 || maskParts[i] > 255) {
        return null
      }
    }

    const network = ipParts.map((part, i) => part & maskParts[i])

    return network.join('.')
  } catch (error) {
    console.error('Error calculating network address:', error)

    return null
  }
}

export const areIPsCompatible = (sourceIP: string, sourceMask: string, targetIP: string, targetMask: string): boolean => {
  const sourceNetwork = getNetworkAddress(sourceIP, sourceMask)
  const targetNetwork = getNetworkAddress(targetIP, targetMask)

  if (!sourceNetwork || !targetNetwork) return false

  return sourceNetwork === targetNetwork
}

export const canConnectNodes = (sourceNode: Node, targetNode: Node): CanConnectResult => {
  if (!sourceNode || !targetNode) {
    return { allowed: false, message: 'Invalid nodes' }
  }

  if (sourceNode.id === targetNode.id) {
    return { allowed: false, message: 'A node cannot connect to itself' }
  }

  const sourceType = sourceNode.data?.type

  if (sourceType === 'network') {
    return { allowed: false, message: 'Network cannot be a source' }
  }

  // Allow connecting devices in the editor even if IPs/masks differ.
  // Previously we prevented connections across different networks which made building topologies difficult.
  // Now connections are allowed interactively; strict validation is deferred to the save operation.
  // We still block obviously invalid cases (self-connect, network as source).

  return { allowed: true, message: 'Connection allowed' }
}

export const getSuggestedConnectionType = (sourceNode: Node, targetNode: Node): string => {
  const sourceType = sourceNode.data?.type
  const targetType = targetNode.data?.type

  if (targetType === 'network') {
    return CONNECTION_TYPES.ROUTING
  }

  if ((sourceType === 'router' || targetType === 'router') && sourceType !== targetType) {
    return CONNECTION_TYPES.ROUTING
  }

  if ((sourceType === 'switch' || targetType === 'switch') && sourceType !== targetType) {
    return CONNECTION_TYPES.PHYSICAL
  }

  return CONNECTION_TYPES.PHYSICAL
}

interface EdgeInfo {
  type: string
  label: string
  description: string
  source?: string
  target?: string
}

export interface Edge {
  connectionType?: string
  source?: string
  target?: string
}

export const getEdgeInfo = (edge: Edge): EdgeInfo => {
  const connectionType = edge.connectionType || 'physical'
  const typeStyles = (CONNECTION_STYLES as Record<string, { label: string }>)[connectionType]

  return {
    type: connectionType,
    label: typeStyles?.label || 'Unknown',
    description: `${typeStyles?.label} connection`,
    source: edge.source,
    target: edge.target
  }
}

export const validateConnections = (nodes: Node[], edges: Edge[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)

    if (!sourceNode || !targetNode) {
      errors.push(`Invalid edge: ${edge.source}-${edge.target}`)

      return
    }

    // Use canConnectNodes for basic structural checks (self-connect, invalid types)
    const check = canConnectNodes(sourceNode, targetNode)

    if (!check.allowed) {
      errors.push(`Connection error between ${sourceNode.data?.label} and ${targetNode.data?.label}: ${check.message}`)

      return
    }

    // Strict validation: ensure IP/mask compatibility when both endpoints have IP and mask
    const sIP = sourceNode.data?.ip
    const sMask = sourceNode.data?.mask
    const tIP = targetNode.data?.ip
    const tMask = targetNode.data?.mask

    if (sIP && sMask && tIP && tMask) {
      if (!areIPsCompatible(sIP, sMask, tIP, tMask)) {
        errors.push(`Incompatible networks: ${sourceNode.data?.label} (${sIP}/${sMask}) ≠ ${targetNode.data?.label} (${tIP}/${tMask})`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
