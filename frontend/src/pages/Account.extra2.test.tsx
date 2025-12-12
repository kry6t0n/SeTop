import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock useNavigate before importing component
const navigateMock = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock
}))

import Account from './Account'
import { AuthProvider } from '../contexts/AuthContext'

const renderAccount = () => {
  return render(
    <AuthProvider>
      <Account />
    </AuthProvider>
  )
}

describe('Account Navigation', () => {
  beforeEach(() => {
    navigateMock.mockClear()
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
      id: '1', username: 'testuser', password: 'p', email: 'test@test.com', role: 'User', createdAt: '2024-01-01'
    }]))
  })

  test('clicking New Topology navigates to editor', async () => {
    renderAccount()

    const newButton = await screen.findByText('+ New Topology')

    fireEvent.click(newButton)

    expect(navigateMock).toHaveBeenCalledWith('/editor')
  })

  test('empty state Go to Editor navigates to editor', async () => {
    renderAccount()

    await waitFor(() => {
      expect(screen.getByText(/No topologies yet/i)).toBeInTheDocument()
    })

    const goButton = screen.getByText('Go to Editor')

    fireEvent.click(goButton)

    expect(navigateMock).toHaveBeenCalledWith('/editor')
  })
})
