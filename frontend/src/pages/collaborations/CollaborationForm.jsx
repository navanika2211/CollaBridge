import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCollaboration, createCollaboration, updateCollaboration } from '../../api/collaborations'
import LoadingSpinner from '../../components/LoadingSpinner'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook', 'Snapchat', 'Pinterest', 'LinkedIn']
const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'revision_requested', label: 'Revision Requested' },
  { value: 'final', label: 'Final' },
]

const inputClass = 'w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all'
const inputStyle = { backgroundColor: '#1a1a28', border: '1px solid #2a2a38', color: 'white' }

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
        {label} {required && <span style={{ color: '#f97316' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function CollaborationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    creatorName: '', brandName: '', campaignTitle: '',
    platform: '', dueDate: '', submissionLink: '',
    status: 'draft', personalNotes: '',
  })

  useEffect(() => {
    if (!isEdit) return
    getCollaboration(id)
      .then(c => setForm({
        creatorName: c.creatorName || '',
        brandName: c.brandName || '',
        campaignTitle: c.campaignTitle || '',
        platform: c.platform || '',
        dueDate: c.dueDate ? new Date(c.dueDate).toISOString().split('T')[0] : '',
        submissionLink: c.submissionLink || '',
        status: c.status || 'draft',
        personalNotes: c.personalNotes || '',
      }))
      .catch(() => navigate('/collaborations'))
      .finally(() => setLoading(false))
  }, [id])

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const payload = { ...form }
    if (!payload.dueDate) delete payload.dueDate
    if (!payload.submissionLink) delete payload.submissionLink
    try {
      if (isEdit) {
        await updateCollaboration(id, payload)
        navigate(`/collaborations/${id}`)
      } else {
        const created = await createCollaboration(payload)
        navigate(`/collaborations/${created._id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl">
      <Link to={isEdit ? `/collaborations/${id}` : '/collaborations'}
        className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: '#6b6b80' }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {isEdit ? 'Back to Collaboration' : 'Back to Collaborations'}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">{isEdit ? 'Edit Collaboration' : 'New Collaboration'}</h1>
        <p style={{ color: '#6b6b80' }}>{isEdit ? 'Update collaboration details' : 'Log a new creator deal'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38', borderRadius: '1rem', padding: '1.5rem' }}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Creator Name" required>
            <input type="text" value={form.creatorName} onChange={set('creatorName')} required
              className={inputClass} style={inputStyle} placeholder="e.g. @janedoe"
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'} />
          </Field>
          <Field label="Brand Name" required>
            <input type="text" value={form.brandName} onChange={set('brandName')} required
              className={inputClass} style={inputStyle} placeholder="e.g. Nike"
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'} />
          </Field>
        </div>

        <Field label="Campaign Title" required>
          <input type="text" value={form.campaignTitle} onChange={set('campaignTitle')} required
            className={inputClass} style={inputStyle} placeholder="e.g. Summer Drop 2025"
            onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
            onBlur={e => e.target.style.borderColor = '#2a2a38'} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Platform" required>
            <select value={form.platform} onChange={set('platform')} required
              className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'}>
              <option value="">Select platform</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')}
              className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Due Date">
            <input type="date" value={form.dueDate} onChange={set('dueDate')}
              className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'} />
          </Field>
          <Field label="Submission Link">
            <input type="url" value={form.submissionLink} onChange={set('submissionLink')}
              className={inputClass} style={inputStyle} placeholder="https://..."
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
              onBlur={e => e.target.style.borderColor = '#2a2a38'} />
          </Field>
        </div>

        <Field label="Personal Notes">
          <textarea value={form.personalNotes} onChange={set('personalNotes')} rows={3}
            className={inputClass} style={{ ...inputStyle, resize: 'none' }} placeholder="Your thoughts, rate card, next steps..."
            onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.6)'}
            onBlur={e => e.target.style.borderColor = '#2a2a38'} />
        </Field>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Collaboration')}
          </button>
          <Link to={isEdit ? `/collaborations/${id}` : '/collaborations'}
            className="px-5 py-3 rounded-xl text-sm font-medium text-center"
            style={{ backgroundColor: '#1f1f2e', color: '#9ca3af', border: '1px solid #2a2a38' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
