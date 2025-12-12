import React from 'react'

// Mock the ui-library NetworkCanvas to avoid rendering React Flow internals in jsdom
jest.mock('@my-app/ui-library', () => ({
  Header: () => null,
  NetworkCanvas: () => null,
  validateConnections: () => ({ valid: true, errors: [] })
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import App from './App'

describe('App integration flows', () => {
  beforeEach(() => {
    localStorage.clear()

    const adminUser = {
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      role: 'Administrator' as const,
      createdAt: '2024-01-01'
    }

    const storedUsers = [
      { id: '1', username: 'admin', password: 'admin123', email: 'admin@test.com', role: 'Administrator', createdAt: '2024-01-01' }
    ]

    localStorage.setItem('user', JSON.stringify(adminUser))
    localStorage.setItem('all_users', JSON.stringify(storedUsers))
  })

  test('navigates between dashboard, account, editor and admin', async () => {
    render(<App />)

    // Dashboard welcome
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, admin/i)).toBeInTheDocument()
    })

    // Navigate to Account page (avoid UI navigation click to keep test deterministic)
    act(() => {
      window.history.pushState({}, '', '/account')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    // Account page shows profile (use heading to avoid ambiguous matches)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /admin/i })).toBeInTheDocument()
    })

    // Click New Topology to go to editor
    const newButton = screen.getByText('+ New Topology')

    fireEvent.click(newButton)

    // Editor should render (NetworkCanvas placeholder present)
    await waitFor(() => {
      expect(document.querySelector('.editor-container')).toBeTruthy()
    })

    // Navigate to admin route directly (wrap in act to avoid update warnings)
    act(() => {
      window.history.pushState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    // Admin content should be visible (use role-based query for robustness)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /admin dashboard/i })).toBeInTheDocument()
    })
  })
})
