import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Account from './Account'
import { AuthProvider } from '../contexts/AuthContext'
import projectService from '../utils/projectService'

jest.mock('../utils/projectService', () => ({
  __esModule: true,
  default: {
    getUserProjects: jest.fn(),
    getUserStats: jest.fn(),
    deleteProject: jest.fn()
  }
}))

const mockedProjectService = projectService as unknown as jest.Mocked<typeof projectService>

describe('Account extra flows', () => {
  beforeEach(() => {
    localStorage.clear()
    const user = { id: '1', username: 'tester', email: 'a@b', role: 'User', createdAt: '2024-01-01' }

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('all_users', JSON.stringify([{ ...user, password: 'x' }]))

    const sampleProject = {
      id: 'p1',
      name: 'Sample',
      description: 'desc',
      nodes: [{ id: 'n1' }],
      edges: [{ id: 'e1' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockedProjectService.getUserProjects.mockReturnValue([sampleProject])
    mockedProjectService.getUserStats.mockReturnValue({ totalProjects: 1, totalNodes: 1, totalEdges: 1 })
    mockedProjectService.deleteProject.mockImplementation(() => true)

    // mock URL.createObjectURL
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'blob:dummy'),
        revokeObjectURL: jest.fn()
      }
    })
  })

  test('exports project and deletes on confirm', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Account />
        </AuthProvider>
      </BrowserRouter>
    )

    // Project title should appear
    await screen.findByText('Sample')

    // click export
    const exportBtn = screen.getByText('📤 Export')

    fireEvent.click(exportBtn)

    expect(window.URL.createObjectURL).toHaveBeenCalled()

    // click delete to open confirm
    const deleteBtn = screen.getByText('🗑️ Delete')

    fireEvent.click(deleteBtn)

    // confirm dialog should show
    await screen.findByText('Are you sure?')

    const yesBtn = screen.getByText('Yes, Delete')

    fireEvent.click(yesBtn)

    await waitFor(() => {
      expect(mockedProjectService.deleteProject).toHaveBeenCalledWith('1', 'p1')
    })
  })
})
