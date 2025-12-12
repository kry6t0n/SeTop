import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Header from '../Header'

describe('Header', () => {
  test('renders user info and admin link when role is Administrator', () => {
    const onLogout = jest.fn()

    render(
      <MemoryRouter>
        <Header user={{ username: 'ivan', role: 'Administrator' }} onLogout={onLogout} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Network Visualizer/i)).toBeInTheDocument()
    // Admin link should be present as a navigation link
    expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument()

    const logout = screen.getByText(/Logout/)

    fireEvent.click(logout)

    expect(onLogout).toHaveBeenCalled()
  })
})
