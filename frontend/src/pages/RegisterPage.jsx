import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all'
const inputStyle = { backgroundColor: '#1a1a28', border: '1px solid #2a2a38', color: 'white' }

export default function RegisterPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'creator' })
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
      const res = await registerUser(form)
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
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm mb-6" style={{ color: '#6b6b80' }}>Join CollaBridge today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
                Full Name <span style={{ color: '#ec4899' }}>*</span>
              </label>
              <input
                type="text" value={form.name} onChange={set('name')} required
                className={inputClass} style={inputStyle} placeholder="Your name"
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.target.style.borderColor = '#2a2a38'}
              />
            </div>
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
                className={inputClass} style={inputStyle} placeholder="Min. 8 characters"
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.target.style.borderColor = '#2a2a38'}
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#9ca3af' }}>
                I am a <span style={{ color: '#ec4899' }}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'creator', label: '✦ Creator', desc: 'I make content' },
                  { value: 'brand', label: '◈ Brand', desc: 'I run campaigns' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: value }))}
                    className="p-3 rounded-xl text-left transition-all"
                    style={form.role === value
                      ? { background: value === 'creator' ? 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(124,58,237,0.15))' : 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.15))', border: `1px solid ${value === 'creator' ? 'rgba(236,72,153,0.5)' : 'rgba(124,58,237,0.5)'}` }
                      : { backgroundColor: '#1a1a28', border: '1px solid #2a2a38' }}
                  >
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>{desc}</p>
                  </button>
                ))}
              </div>
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
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: '#6b6b80' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#a78bfa' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
