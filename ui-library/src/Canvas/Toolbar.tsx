import { useRef, useState, useEffect, FC, ChangeEvent } from 'react'

import { Node, Edge } from 'reactflow'

import { CONNECTION_STYLES, getConnectionStyle } from '../utils/connectionLogic'
import { exportToJson, importFromJson } from '../utils/exportUtils'

interface ToolbarProps {
  onAddNode: (type: string) => void
  selectedNode: Node | null
  selectedEdge: Edge | null
  nodes: Node[]
  edges: Edge[]
  onSetNodes: (nodes: Node[]) => void
  onSetEdges: (edges: Edge[]) => void
}

interface DeviceType {
  type: string
  label: string
  icon: string
}

const Toolbar: FC<ToolbarProps> = ({
  onAddNode,
  selectedNode,
  selectedEdge,
  nodes,
  edges,
  onSetNodes,
  onSetEdges
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editError, setEditError] = useState('')
  const [localIP, setLocalIP] = useState('')
  const [localMask, setLocalMask] = useState('')
  const [edgeType, setEdgeType] = useState<string>('physical')
  const [edgeStatus, setEdgeStatus] = useState<string>('active')

  useEffect(() => {
    if (selectedNode) {
      const nd = selectedNode.data as { ip?: string; mask?: string; type?: string }

      setLocalIP(nd?.ip || '')
      setLocalMask(nd?.mask || '')
      setEditError('')
    }

    if (selectedEdge) {
      const data = (selectedEdge.data as { connectionType?: string; status?: string }) || {}

      setEdgeType(data.connectionType || 'physical')
      setEdgeStatus(data.status || 'active')
    }
  }, [selectedNode, selectedEdge])

  const handleExport = (): void => {
    exportToJson({ nodes, edges })
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]

    if (file) {
      importFromJson(file, onSetNodes, onSetEdges)
    }
  }

  const validateIP = (ip: string): boolean => {
    if (!ip || ip.trim() === '') return true
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/

    if (!ipRegex.test(ip)) return false
    const parts = ip.split('.')

    return parts.every(part => {
      const num = parseInt(part, 10)

      return num >= 0 && num <= 255
    })
  }

  const validateMask = (mask: string): boolean => {
    if (!mask || mask.trim() === '') return true
    const maskRegex = /^(\d{1,3}\.){3}\d{1,3}$/

    if (!maskRegex.test(mask)) return false
    const parts = mask.split('.')

    return parts.every(part => {
      const num = parseInt(part, 10)

      return num >= 0 && num <= 255
    })
  }

  const isIPDuplicate = (ip: string, nodeId: string): boolean => {
    if (!ip || ip.trim() === '') return false

    return nodes.some(node =>
      node.id !== nodeId &&
      (node.data as { ip?: string; type?: string })?.ip === ip &&
      (node.data as { type?: string })?.type !== 'network'
    )
  }

  const deviceTypes: DeviceType[] = [
    { type: 'router', label: 'Router', icon: '🔄' },
    { type: 'switch', label: 'Switch', icon: '🔀' },
    { type: 'server', label: 'Server', icon: '🖥️' },
    { type: 'workstation', label: 'Workstation', icon: '💻' }
  ]

  const networkTypes: DeviceType[] = [
    { type: 'network', label: 'Network/Internet', icon: '🌐' }
  ]

  return (
    <div style={{
      width: '280px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Network Devices</h3>
        {deviceTypes.map(device => (
          <button
            key={device.type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onClick={() => onAddNode(device.type)}
          >
            <span>{device.icon}</span>
            {device.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Network</h3>
        {networkTypes.map(network => (
          <button
            key={network.type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onClick={() => onAddNode(network.type)}
          >
            <span>{network.icon}</span>
            {network.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Export/Import</h3>
        <button
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => window.dispatchEvent(new Event('saveProject'))}
        >
          💾 Save Project
        </button>
        <button
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={handleExport}
        >
          📥 Export
        </button>
        <button
          style={{
            width: '100%',
            padding: '10px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          📤 Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      {selectedNode && (
        <div style={{
          background: '#f1f5f9',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>Node Properties</h4>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Type: {(selectedNode.data as { type?: string })?.type}</label>
          </div>
          {(selectedNode.data as { type?: string })?.type !== 'network' && (
            <>
              <input
                type="text"
                placeholder="IP Address"
                value={localIP}
                onChange={(e) => setLocalIP(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px'
                }}
              />
              <input
                type="text"
                placeholder="Subnet Mask"
                value={localMask}
                onChange={(e) => setLocalMask(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px'
                }}
              />
              {editError && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>
                  {editError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    // Validate inputs
                    if (!validateIP(localIP)) {
                      setEditError('Invalid IP address')

                      return
                    }

                    if (!validateMask(localMask)) {
                      setEditError('Invalid subnet mask')

                      return
                    }

                    if (isIPDuplicate(localIP, (selectedNode.id as string))) {
                      setEditError('IP address is already used by another device')

                      return
                    }

                    // Apply changes to nodes
                    const updated = nodes.map(n => {
                      if (n.id === selectedNode.id) {
                        const newData = { ...(n.data as { ip?: string; mask?: string }), ip: localIP, mask: localMask }

                        return { ...n, data: newData }
                      }

                      return n
                    })

                    onSetNodes(updated)
                    setEditError('')
                  }}
                  style={{ flex: 1, padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    // Reset inputs to node values
                    setLocalIP((selectedNode.data as { ip?: string })?.ip || '')
                    setLocalMask((selectedNode.data as { mask?: string })?.mask || '')
                    setEditError('')
                  }}
                  style={{ padding: '8px', background: '#e2e8f0', color: '#0f1724', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {selectedEdge && (
        <div style={{
          background: '#f1f5f9',
          padding: '12px',
          borderRadius: '6px'
        }}>
          <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>Edge Properties</h4>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <p>From: {selectedEdge.source}</p>
            <p>To: {selectedEdge.target}</p>
          </div>
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Connection Type</label>
            <select
              value={edgeType}
              onChange={(e) => setEdgeType(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            >
              { (Object.keys(CONNECTION_STYLES) as Array<keyof typeof CONNECTION_STYLES>).map(key => (
                <option key={String(key)} value={String(key)}>{CONNECTION_STYLES[key].label || String(key)}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Status</label>
            <select
              value={edgeStatus}
              onChange={(e) => setEdgeStatus(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => {
                // apply changes to the selected edge
                const updated = edges.map(e => {
                  if (e.id === selectedEdge.id) {
                    const newData = { ...(e.data as { connectionType?: string; status?: string }), connectionType: edgeType, status: edgeStatus }

                    return {
                      ...e,
                      data: newData,
                      style: getConnectionStyle(edgeType, edgeStatus)
                    }
                  }

                  return e
                })

                onSetEdges(updated)
              }}
              style={{ flex: 1, padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Apply
            </button>
            <button
              onClick={() => {
                // reset to defaults
                setEdgeType('physical')
                setEdgeStatus('active')
              }}
              style={{ padding: '8px', background: '#e2e8f0', color: '#0f1724', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
