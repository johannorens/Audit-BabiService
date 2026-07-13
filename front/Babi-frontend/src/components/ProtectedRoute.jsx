import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiGetMe } from '../services/api'

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token')
  const [checkingRole, setCheckingRole] = useState(adminOnly)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!adminOnly || !token) return
    apiGetMe().then((res) => {
      setIsAdmin(res.ok && res.data.role === 'admin')
      setCheckingRole(false)
    })
  }, [adminOnly, token])

  if (!token) {
    return <Navigate to="/connexion" replace />
  }

  if (adminOnly && checkingRole) {
    return null
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
