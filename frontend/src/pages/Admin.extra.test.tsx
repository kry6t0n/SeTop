import React from 'react'

import { render } from '@testing-library/react'

// Mock useNavigate before importing component
const navigateMock = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock
}))

import Admin from './Admin'
import { AuthProvider } from '../contexts/AuthContext'

describe('Admin Redirects', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    localStorage.clear()
  })

  test('non-admin user is redirected', () => {
    localStorage.setItem('user', JSON.stringify({
      id: '2', username: 'user', email: 'u@test.com', role: 'User', createdAt: '2024-01-01'
    }))

    render(
      <AuthProvider>
        <Admin />
      </AuthProvider>
    )

    expect(navigateMock).toHaveBeenCalled()
  })
})
