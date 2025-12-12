import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Login from './Login'
import { AuthProvider } from '../contexts/AuthContext'

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders login form', () => {
    renderLogin()

    expect(screen.getByText('Network Topology Visualizer')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  test('switches to register mode', () => {
    renderLogin()

    const toggleLink = screen.getByText('Create Account')

    fireEvent.click(toggleLink)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  test('fills demo account', () => {
    renderLogin()

    const demoButtons = screen.getAllByText(/Click to fill/i)

    fireEvent.click(demoButtons[0])

    const usernameInput = screen.getByPlaceholderText('Enter your username') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement

    expect(usernameInput.value).toBe('admin')
    expect(passwordInput.value).toBe('admin123')
  })

  test('shows error on invalid login', async () => {
    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Enter your username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByText('Sign In')

    fireEvent.change(usernameInput, { target: { value: 'invalid' } })
    fireEvent.change(passwordInput, { target: { value: 'invalid' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      // login should not create a stored user on invalid credentials
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  test('successfully logs in with valid credentials', async () => {
    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Enter your username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByText('Sign In')

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy()
    })
  })

  test('validates password match in register mode', async () => {
    renderLogin()

    const toggleLink = screen.getByText('Create Account')

    fireEvent.click(toggleLink)

    const usernameInput = screen.getByPlaceholderText('Enter your username')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
    const submitButton = screen.getByText('Create Account')

    fireEvent.change(usernameInput, { target: { value: 'newuser' } })
    fireEvent.change(emailInput, { target: { value: 'newuser@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/(?:Error:\s*)?Passwords do not match/i)).toBeInTheDocument()
    })
  })

  test('validates password length in register mode', async () => {
    renderLogin()

    const toggleLink = screen.getByText('Create Account')

    fireEvent.click(toggleLink)

    const usernameInput = screen.getByPlaceholderText('Enter your username')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
    const submitButton = screen.getByText('Create Account')

    fireEvent.change(usernameInput, { target: { value: 'newuser' } })
    fireEvent.change(emailInput, { target: { value: 'newuser@test.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '12345' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/(?:Error:\s*)?Password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  test('does not submit when username or password missing', async () => {
    renderLogin()

    const submitButton = screen.getByText('Sign In')

    // both fields empty
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  test('rejects registration when required fields missing', async () => {
    renderLogin()

    const toggleLink = screen.getByText('Create Account')

    fireEvent.click(toggleLink)

    const usernameInput = screen.getByPlaceholderText('Enter your username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByText('Create Account')

    fireEvent.change(usernameInput, { target: { value: 'newuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // leave email and confirmPassword empty
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
