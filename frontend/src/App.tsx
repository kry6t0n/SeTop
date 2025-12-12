import React from 'react'

import { Header as UILibHeader } from '@my-app/ui-library'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboar'
import Editor from './pages/Editor'
import Login from './pages/Login'

import './styles/globals.css'

const HeaderWrapper: React.FC = () => {
  const { user, logout } = useAuth()

  return <UILibHeader user={user ?? undefined} onLogout={logout} />
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? children : <Navigate to="/login" />
}

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  return isAuthenticated && user?.role === 'Administrator' ? (
    children
  ) : (
    <Navigate to="/" />
  )
}

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return !isAuthenticated ? children : <Navigate to="/" />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {/* Header wrapper: get user/logout from auth and pass to library Header */}
          <HeaderWrapper />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
