import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Account from './Account'
import { AuthProvider } from '../contexts/AuthContext'
import projectService from '../utils/projectService'

const renderAccount = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Account />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Account Page', () => {
  beforeEach(() => {
    localStorage.clear()
    const user = {
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      role: 'User' as const,
      createdAt: '2024-01-01'
    }

    localStorage.setItem('user', JSON.stringify(user))
    // Ensure the test user exists in the app's users list so AuthProvider recognizes it
    const storedUsers = [
      {
        id: '1',
        username: 'testuser',
        password: 'testpass',
        email: 'test@test.com',
        role: 'User',
        createdAt: '2024-01-01'
      }
    ]

    localStorage.setItem('all_users', JSON.stringify(storedUsers))
  })

  test('renders user profile information', () => {
    renderAccount()

    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  test('renders empty state when no projects exist', () => {
    renderAccount()

    expect(screen.getByText(/No topologies yet/i)).toBeInTheDocument()
    expect(screen.getByText('Go to Editor')).toBeInTheDocument()
  })

  test('displays user projects when they exist', async () => {
    projectService.saveProject('1', 'Test Project', {
      nodes: [{ id: '1' }, { id: '2' }],
      edges: [{ id: 'e1' }]
    })

    renderAccount()

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    expect(screen.getByText(/Nodes: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/Connections: 1/i)).toBeInTheDocument()
  })

  test('displays statistics', async () => {
    projectService.saveProject('1', 'Project 1', {
      nodes: [{ id: '1' }, { id: '2' }],
      edges: [{ id: 'e1' }]
    })
    projectService.saveProject('1', 'Project 2', {
      nodes: [{ id: '3' }],
      edges: []
    })

    renderAccount()

    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument()
    })

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('exports project', async () => {
    projectService.saveProject('1', 'Export Test', {
      nodes: [{ id: '1' }],
      edges: []
    })

    const createElementSpy = jest.spyOn(document, 'createElement')
    const appendChildSpy = jest.spyOn(document.body, 'appendChild')
    const removeChildSpy = jest.spyOn(document.body, 'removeChild')

    // jsdom doesn't implement createObjectURL — mock it for export handling
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:mock')

    renderAccount()

    await waitFor(() => {
      expect(screen.getByText('Export Test')).toBeInTheDocument()
    })

    const exportButtons = screen.getAllByText('📤 Export')

    fireEvent.click(exportButtons[0])

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  test('shows delete confirmation', async () => {
    projectService.saveProject('1', 'Delete Test', {
      nodes: [{ id: '1' }],
      edges: []
    })

    renderAccount()

    await waitFor(() => {
      expect(screen.getByText('Delete Test')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('🗑️ Delete')

    fireEvent.click(deleteButtons[0])

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
  })

  test('deletes project on confirmation', async () => {
    projectService.saveProject('1', 'Delete Test', {
      nodes: [{ id: '1' }],
      edges: []
    })

    renderAccount()

    await waitFor(() => {
      expect(screen.getByText('Delete Test')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('🗑️ Delete')

    fireEvent.click(deleteButtons[0])

    const confirmButton = screen.getByText('Yes, Delete')

    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByText('Delete Test')).not.toBeInTheDocument()
    })
  })
})
