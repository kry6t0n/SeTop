import React from 'react'

// Mock useNavigate before importing component
const navigateMock = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock
}))

// Mock AuthContext to simulate already authenticated user
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    register: jest.fn(),
    authError: '',
    clearError: jest.fn(),
    isAuthenticated: true
  })
}))

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Login from './Login'

describe('Login Redirect', () => {
  beforeEach(() => {
    navigateMock.mockClear()
  })

  test('redirects when already authenticated', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
