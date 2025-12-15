import React from 'react'

import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Dashboard from './Dashboar'
import { AuthProvider } from '../contexts/AuthContext'

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Page', () => {
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
    // Ensure the test user exists in the users list so AuthProvider accepts stored user
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

  test('renders welcome message with username', () => {
    renderDashboard()

    expect(screen.getByText(/Welcome back, testuser/i)).toBeInTheDocument()
  })

  test('renders quick action cards', () => {
    renderDashboard()

    expect(screen.getByText('Create New Topology')).toBeInTheDocument()
    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    expect(screen.getByText('Network Templates')).toBeInTheDocument()
  })

  test('shows coming soon alert for disabled features', () => {
    renderDashboard()

    // badge indicates disabled coming-soon feature
    const badges = screen.getAllByText('Coming Soon')

    expect(badges.length).toBeGreaterThan(0)
  })

  test('renders empty state for recent projects', () => {
    renderDashboard()

    expect(screen.getByText('Recent Projects')).toBeInTheDocument()
    expect(screen.getByText('No recent projects found')).toBeInTheDocument()
    expect(screen.getByText('Create your first network topology')).toBeInTheDocument()
  })
})
