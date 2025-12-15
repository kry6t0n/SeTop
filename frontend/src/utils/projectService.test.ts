import projectService from './projectService'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('projectService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getUserProjects', () => {
    test('returns empty array when no projects exist', () => {
      const projects = projectService.getUserProjects('user1')

      expect(projects).toEqual([])
    })

    test('returns user projects when they exist', () => {
      const projects = [
        {
          id: '1',
          name: 'Project 1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          nodes: [],
          edges: [],
          description: ''
        }
      ]

      localStorage.setItem('network_projects', JSON.stringify({ user1: projects }))

      const result = projectService.getUserProjects('user1')

      expect(result).toEqual(projects)
    })

    test('handles invalid JSON gracefully', () => {
      localStorage.setItem('network_projects', 'invalid json')

      const result = projectService.getUserProjects('user1')

      expect(result).toEqual([])
    })
  })

  describe('saveProject', () => {
    test('creates new project when none exist', () => {
      const topology = { nodes: [{ id: '1' }], edges: [] }

      const project = projectService.saveProject('user1', 'New Project', topology)

      expect(project.name).toBe('New Project')
      expect(project.nodes).toEqual(topology.nodes)
      expect(project.edges).toEqual(topology.edges)
      expect(project.id).toBeDefined()
      expect(project.createdAt).toBeDefined()
      expect(project.updatedAt).toBeDefined()

      const saved = projectService.getUserProjects('user1')

      expect(saved).toHaveLength(1)
      expect(saved[0].name).toBe('New Project')
    })

    test('updates existing project with same name', () => {
      const topology1 = { nodes: [{ id: '1' }], edges: [] }
      const topology2 = { nodes: [{ id: '2' }], edges: [{ id: 'e1' }] }

      const project1 = projectService.saveProject('user1', 'Project', topology1)
      const project2 = projectService.saveProject('user1', 'Project', topology2)

      expect(project1.id).toBe(project2.id)
      expect(project1.createdAt).toBe(project2.createdAt)
      expect(project2.nodes).toEqual(topology2.nodes)
      expect(project2.edges).toEqual(topology2.edges)

      const saved = projectService.getUserProjects('user1')

      expect(saved).toHaveLength(1)
    })

    test('creates multiple projects with different names', () => {
      const topology1 = { nodes: [{ id: '1' }], edges: [] }
      const topology2 = { nodes: [{ id: '2' }], edges: [] }

      projectService.saveProject('user1', 'Project 1', topology1)
      projectService.saveProject('user1', 'Project 2', topology2)

      const saved = projectService.getUserProjects('user1')

      expect(saved).toHaveLength(2)
    })

    test('throws error on save failure', () => {
      const originalSetItem = localStorage.setItem

      localStorage.setItem = () => {
        throw new Error('Storage quota exceeded')
      }

      expect(() => {
        projectService.saveProject('user1', 'Project', { nodes: [], edges: [] })
      }).toThrow('Failed to save project')

      localStorage.setItem = originalSetItem
    })
  })

  describe('getProject', () => {
    test('returns null when project does not exist', () => {
      const project = projectService.getProject('user1', 'nonexistent')

      expect(project).toBeNull()
    })

    test('returns project when it exists', () => {
      const topology = { nodes: [{ id: '1' }], edges: [] }

      const saved = projectService.saveProject('user1', 'Project', topology)
      const retrieved = projectService.getProject('user1', saved.id)

      expect(retrieved).toEqual(saved)
    })
  })

  describe('deleteProject', () => {
    test('returns false when project does not exist', () => {
      const result = projectService.deleteProject('user1', 'nonexistent')

      expect(result).toBe(false)
    })

    test('deletes project when it exists', () => {
      const topology = { nodes: [{ id: '1' }], edges: [] }

      const saved = projectService.saveProject('user1', 'Project', topology)
      const deleted = projectService.deleteProject('user1', saved.id)

      expect(deleted).toBe(true)

      const projects = projectService.getUserProjects('user1')

      expect(projects).toHaveLength(0)
    })

    test('throws error on delete failure', () => {
      const originalSetItem = localStorage.setItem

      localStorage.setItem = () => {
        throw new Error('Storage error')
      }

      expect(() => {
        projectService.deleteProject('user1', 'some-id')
      }).toThrow('Failed to delete project')

      localStorage.setItem = originalSetItem
    })
  })

  describe('updateProject', () => {
    test('returns null when project does not exist', () => {
      const result = projectService.updateProject('user1', 'nonexistent', { name: 'Updated' })

      expect(result).toBeNull()
    })

    test('updates project when it exists', () => {
      const topology = { nodes: [{ id: '1' }], edges: [] }

      const saved = projectService.saveProject('user1', 'Project', topology)
      const updated = projectService.updateProject('user1', saved.id, {
        name: 'Updated Project',
        description: 'New description'
      })

      expect(updated).not.toBeNull()
      expect(updated?.name).toBe('Updated Project')
      expect(updated?.description).toBe('New description')
      expect(updated?.updatedAt).not.toBe(saved.updatedAt)
      expect(updated?.createdAt).toBe(saved.createdAt)
    })

    test('throws error on update failure', () => {
      const originalSetItem = localStorage.setItem

      localStorage.setItem = () => {
        throw new Error('Storage error')
      }

      expect(() => {
        projectService.updateProject('user1', 'some-id', { name: 'Updated' })
      }).toThrow('Failed to update project')

      localStorage.setItem = originalSetItem
    })
  })

  describe('getUserStats', () => {
    test('returns zero stats when no projects exist', () => {
      const stats = projectService.getUserStats('user1')

      expect(stats).toEqual({
        totalProjects: 0,
        totalNodes: 0,
        totalEdges: 0
      })
    })

    test('calculates stats correctly', () => {
      projectService.saveProject('user1', 'Project 1', {
        nodes: [{ id: '1' }, { id: '2' }],
        edges: [{ id: 'e1' }]
      })
      projectService.saveProject('user1', 'Project 2', {
        nodes: [{ id: '3' }],
        edges: [{ id: 'e2' }, { id: 'e3' }]
      })

      const stats = projectService.getUserStats('user1')

      expect(stats.totalProjects).toBe(2)
      expect(stats.totalNodes).toBe(3)
      expect(stats.totalEdges).toBe(3)
    })

    test('handles errors gracefully', () => {
      localStorage.setItem('network_projects', 'invalid json')

      const stats = projectService.getUserStats('user1')

      expect(stats).toEqual({
        totalProjects: 0,
        totalNodes: 0,
        totalEdges: 0
      })
    })
  })
})
