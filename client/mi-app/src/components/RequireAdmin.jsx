import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    // No autenticado -> forzar login
    return <Navigate to="/login" replace />
  }

  if (!user || user.role !== 'admin') {
    // Autenticado pero no admin -> redirigir a home
    return <Navigate to="/" replace />
  }

  return children
}
