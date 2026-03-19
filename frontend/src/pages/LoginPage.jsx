import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all'
const inputStyle = { backgroundColor: '#1a1a28', border: '1px solid #2a2a38', color: 'white' }

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await loginUser(form)
      login(res.token, res.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f0f18' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            CB
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">CollaBridge</p>
            <p className="text-xs" style={{ color: '#6b6b80' }}>Brand × Creator OS</p>
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: '#6b6b80' }}>Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
                Email <span style={{ color: '#ec4899' }}>*</span>
              </label>
              <input
                type="email" value={form.email} onChange={set('email')} required
                className={inputClass} style={inputStyle} placeholder="you@example.com"
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.target.style.borderColor = '#2a2a38'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
                Password <span style={{ color: '#ec4899' }}>*</span>
              </label>
              <input
                type="password" value={form.password} onChange={set('password')} required
                className={inputClass} style={inputStyle} placeholder="••••••••"
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.target.style.borderColor = '#2a2a38'}
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: '#6b6b80' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#a78bfa' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
