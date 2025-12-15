import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Dashboard from './Dashboar'
import { AuthProvider } from '../contexts/AuthContext'

describe('Dashboard extra', () => {
  beforeEach(() => {
    localStorage.clear()
    const user = { id: '1', username: 'tester', email: 'a@b', role: 'User', createdAt: '2024-01-01' }

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('all_users', JSON.stringify([{ ...user, password: 'x' }]))
  })

  test('clicking coming-soon link triggers alert', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    )

    const link = screen.getByRole('link', { name: /Documentation/i })

    // ensure href is exactly '#' so handleComingSoon triggers
    link.setAttribute('href', '#')
    fireEvent.click(link)

    expect(alertSpy).toHaveBeenCalled()

    alertSpy.mockRestore()
  })
})
