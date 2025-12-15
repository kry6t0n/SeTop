import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'

import Editor from './Editor'
import { AuthProvider } from '../contexts/AuthContext'

// Mock NetworkCanvas
jest.mock('@my-app/ui-library', () => ({
  NetworkCanvas: () => <div data-testid="network-canvas">Network Canvas</div>,
  validateConnections: jest.fn(() => ({ valid: true, errors: [] }))
}))

const renderEditor = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Editor />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Editor Page', () => {
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
    // Ensure AuthProvider recognizes the user by providing it in all_users
    localStorage.setItem('all_users', JSON.stringify([
      {
        id: user.id,
        username: user.username,
        password: 'testpass',
        email: user.email,
        role: 'User',
        createdAt: user.createdAt
      }
    ]))
    window.__editorNodes = []
    window.__editorEdges = []
  })

  test('renders network canvas', () => {
    renderEditor()

    expect(screen.getByTestId('network-canvas')).toBeInTheDocument()
  })

  test('shows save dialog when save event is triggered', async () => {
    renderEditor()

    // ensure auth provider and editor finished initial render
    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    await screen.findByText('Сохранить проект')
    await screen.findByPlaceholderText('Введите имя проекта...')
  })

  test('closes save dialog on cancel', async () => {
    renderEditor()

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const cancelButton = await screen.findByText('Отменить')

    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Сохранить проект')).not.toBeInTheDocument()
    })
  })

  test('shows error when project name is empty', async () => {
    renderEditor()

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const saveButton = await screen.findByText('Сохранить')

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Project name is required/i)).toBeInTheDocument()
    })
  })

  test('saves project successfully with valid data', async () => {
    renderEditor()

    window.__editorNodes = [
      {
        id: '1',
        data: { type: 'server', ip: '192.168.1.1', mask: '255.255.255.0', label: 'Server 1' }
      }
    ]
    window.__editorEdges = []

    // ensure editor/auth are ready
    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')
    const saveButton = await screen.findByText('Сохранить')

    fireEvent.change(nameInput, { target: { value: 'Test Project' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Проект успешно сохранён/i)).toBeInTheDocument()
    })
  })

  test('shows error for duplicate IP addresses', async () => {
    renderEditor()

    window.__editorNodes = [
      {
        id: '1',
        data: { type: 'server', ip: '192.168.1.1', mask: '255.255.255.0', label: 'Server 1' }
      },
      {
        id: '2',
        data: { type: 'workstation', ip: '192.168.1.1', mask: '255.255.255.0', label: 'Workstation 1' }
      }
    ]
    window.__editorEdges = []

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')
    const saveButton = await screen.findByText('Сохранить')

    fireEvent.change(nameInput, { target: { value: 'Test Project' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Duplicate IP addresses found/i)).toBeInTheDocument()
    })
  })
})
