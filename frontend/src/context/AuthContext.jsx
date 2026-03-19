import { createContext, useContext, useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'

const AuthContext = createContext(null)

const BASE_URL = import.meta.env.VITE_API_URL

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('cb_token')
    if (!storedToken) {
      setLoading(false)
      return
    }
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setToken(storedToken)
          setUser(json.user)
        } else {
          localStorage.removeItem('cb_token')
        }
      })
      .catch(() => localStorage.removeItem('cb_token'))
      .finally(() => setLoading(false))
  }, [])

  function login(newToken, newUser) {
    localStorage.setItem('cb_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('cb_token')
    setToken(null)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f18' }}>
        <LoadingSpinner text="Restoring session..." />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
