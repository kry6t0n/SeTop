/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'

import { render, screen } from '@testing-library/react'

import App from './App'

// Mock AuthContext
const mockUseAuth = jest.fn()

jest.mock('./contexts/AuthContext', () => ({
  __esModule: true,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => mockUseAuth(),
}))

// Mock pages
jest.mock('./pages/Login', () => ({ __esModule: true, default: () => <div>Login Page</div> }))
jest.mock('./pages/Dashboar', () => ({ __esModule: true, default: () => <div>Dashboard Page</div> }))
jest.mock('./pages/Account', () => ({ __esModule: true, default: () => <div>Account Page</div> }))
jest.mock('./pages/Editor', () => ({ __esModule: true, default: () => <div>Editor Page</div> }))
jest.mock('./pages/Admin', () => ({ __esModule: true, default: () => <div>Admin Page</div> }))

// Helper to render App and set the current location via history
const renderApp = (route: string = '/') => {
  window.history.pushState({}, 'Test page', route)

  return render(<App />)
}

describe('App Component', () => {
  beforeEach(() => {
    mockUseAuth.mockClear()
    ;(global as any).__TEST_ROUTE = '/'
  })

  describe('ProtectedRoute', () => {
    test('renders protected route when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp()
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })

    test('redirects to login when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      })

      renderApp()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    test('renders editor page when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/editor')
      expect(screen.getByText('Editor Page')).toBeInTheDocument()
    })

    test('renders account page when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/account')
      expect(screen.getByText('Account Page')).toBeInTheDocument()
    })
  })

  describe('AdminRoute', () => {
    test('renders admin page when user is administrator', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'Administrator' },
      })

      renderApp('/admin')
      expect(screen.getByText('Admin Page')).toBeInTheDocument()
    })

    test('redirects to home when user is not administrator', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/admin')
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })

    test('redirects to login when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      })

      renderApp('/admin')
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  describe('PublicRoute', () => {
    test('renders login page when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      })

      renderApp('/login')
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    test('redirects to home when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/login')
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })
  })

  describe('Route handling', () => {
    test('renders dashboard on root path when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/')
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })

    test('redirects unknown routes to home', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { role: 'User' },
      })

      renderApp('/unknown-route')
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })
  })
})
