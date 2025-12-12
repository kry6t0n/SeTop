import React from 'react'

import * as uiLib from '@my-app/ui-library'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'

import Editor from './Editor'
import { AuthProvider } from '../contexts/AuthContext'

// Mock NetworkCanvas and allow overriding validateConnections in some tests
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

describe('Editor extra branches', () => {
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
    localStorage.setItem('all_users', JSON.stringify([{
      id: user.id,
      username: user.username,
      password: 'testpass',
      email: user.email,
      role: 'User',
      createdAt: user.createdAt
    }]))
    window.__editorNodes = []
    window.__editorEdges = []
    
    // reset validateConnections mock to default valid
    if (uiLib && uiLib.validateConnections && (uiLib.validateConnections as jest.Mock).mockImplementation) {
      ;(uiLib.validateConnections as jest.Mock).mockImplementation(() => ({ valid: true, errors: [] }))
    }
  })

  test('shows error for invalid IP addresses', async () => {
    renderEditor()

    // invalid IP that fails regex
    window.__editorNodes = [
      { id: '1', data: { type: 'server', ip: 'invalid-ip' } }
    ]

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')
    const saveButton = await screen.findByText('Сохранить')

    fireEvent.change(nameInput, { target: { value: 'Invalid IP Project' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid IP addresses found/i)).toBeInTheDocument()
    })
  })

  test('shows connection validation errors when validateConnections fails', async () => {
    // override validateConnections to simulate errors
    ;(uiLib.validateConnections as jest.Mock).mockImplementation(() => ({ valid: false, errors: ['Broken link'] }))

    renderEditor()

    window.__editorNodes = [
      { id: '1', data: { type: 'server', ip: '10.0.0.1' } }
    ]
    window.__editorEdges = [
      { id: 'e1', source: '1', target: '2' }
    ]

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')
    const saveButton = await screen.findByText('Сохранить')

    fireEvent.change(nameInput, { target: { value: 'Conn Error Project' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Connection errors:/i)).toBeInTheDocument()
    })
  })

  test('closes save dialog when clicking overlay', async () => {
    renderEditor()

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const overlay = await screen.findByText('Сохранить проект')

    // overlay is parent element; find the overlay div by role: using container query
    const overlayDiv = overlay.closest('.save-dialog-overlay') as HTMLElement

    // clicking overlay should close dialog
    fireEvent.click(overlayDiv)

    await waitFor(() => {
      expect(screen.queryByText('Сохранить проект')).not.toBeInTheDocument()
    })
  })

  test('pressing Enter in input triggers save validation', async () => {
    renderEditor()

    window.__editorNodes = [
      { id: '1', data: { type: 'server', ip: '192.168.0.2' } }
    ]
    window.__editorEdges = []

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')

    fireEvent.change(nameInput, { target: { value: 'Enter Save' } })
    fireEvent.keyPress(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 })

    await waitFor(() => {
      expect(screen.getByText(/Проект успешно сохранён/i)).toBeInTheDocument()
    })
  })

  test('shows error for duplicate IP addresses', async () => {
    renderEditor()

    // two nodes with same IP
    window.__editorNodes = [
      { id: '1', data: { type: 'server', ip: '10.0.0.1' } },
      { id: '2', data: { type: 'server', ip: '10.0.0.1' } }
    ]
    window.__editorEdges = []

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const nameInput = await screen.findByPlaceholderText('Введите имя проекта...')
    const saveButton = await screen.findByText('Сохранить')

    fireEvent.change(nameInput, { target: { value: 'Dup IP Project' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Duplicate IP addresses found/i)).toBeInTheDocument()
    })
  })

  test('requires project name before saving', async () => {
    renderEditor()

    window.__editorNodes = [
      { id: '1', data: { type: 'server', ip: '192.168.1.1' } }
    ]
    window.__editorEdges = []

    await screen.findByTestId('network-canvas')

    const saveEvent = new Event('saveProject')

    act(() => {
      window.dispatchEvent(saveEvent)
    })

    const saveButton = await screen.findByText('Сохранить')

    // Do not enter a project name
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Project name is required/i)).toBeInTheDocument()
    })
  })
})
