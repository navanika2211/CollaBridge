import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getApplications, updateApplication } from '../../api/applications'
import LoadingSpinner from '../../components/LoadingSpinner'
import PlatformBadge from '../../components/PlatformBadge'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_META = {
  pending: {
    label: 'Pending Review',
    style: {
      backgroundColor: 'rgba(107,114,128,0.15)',
      color: '#9ca3af',
      border: '1px solid rgba(107,114,128,0.3)',
    },
    hint: 'Your application is with the brand. Hang tight.',
    canSubmitDraft: false,
    dealClosed: false,
  },
  'under review': {
    label: 'Under Review',
    style: {
      backgroundColor: 'rgba(245,158,11,0.1)',
      color: '#fbbf24',
      border: '1px solid rgba(245,158,11,0.3)',
    },
    hint: 'The brand is reviewing your profile. You can submit a draft now.',
    canSubmitDraft: true,
    dealClosed: false,
  },
  'revision requested': {
    label: 'Revision Requested',
    style: {
      backgroundColor: 'rgba(249,115,22,0.1)',
      color: '#fb923c',
      border: '1px solid rgba(249,115,22,0.3)',
    },
    hint: 'The brand wants changes. Update your draft link below.',
    canSubmitDraft: true,
    dealClosed: false,
  },
  approved: {
    label: 'Draft Approved ✓',
    style: {
      backgroundColor: 'rgba(16,185,129,0.1)',
      color: '#34d399',
      border: '1px solid rgba(16,185,129,0.3)',
    },
    hint: 'Your draft has been approved by the brand. Awaiting deal confirmation.',
    canSubmitDraft: true,
    dealClosed: false,
  },
  'deal closed': {
    label: 'Deal Closed 🎉',
    style: {
      backgroundColor: 'rgba(124,58,237,0.15)',
      color: '#a78bfa',
      border: '1px solid rgba(124,58,237,0.3)',
    },
    hint: 'The brand has officially closed this deal. Your content is live!',
    canSubmitDraft: false,
    dealClosed: true,
  },
  rejected: {
    label: 'Not Selected',
    style: {
      backgroundColor: 'rgba(239,68,68,0.1)',
      color: '#f87171',
      border: '1px solid rgba(239,68,68,0.2)',
    },
    hint: 'The brand went with a different creator this time.',
    canSubmitDraft: false,
    dealClosed: false,
  },
}

const DEFAULT_META = STATUS_META.pending

// ─── ApplicationCard ──────────────────────────────────────────────────────────

function ApplicationCard({ app, onDraftSubmit }) {
  const meta = STATUS_META[app.status] ?? DEFAULT_META
  const [draftInput, setDraftInput] = useState(app.draftLink || '')
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [inputError, setInputError] = useState('')

  async function handleDraftSubmit(e) {
    e.preventDefault()
    if (!draftInput.trim()) {
      setInputError('Please enter a valid link.')
      return
    }
    setInputError('')
    setSubmitting(true)
    try {
      await onDraftSubmit(app._id, draftInput.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setInputError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: '#16161f',
        border: `1px solid ${meta.dealClosed ? 'rgba(16,185,129,0.25)' : '#2a2a38'}`,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">
            {app.campaignTitle}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>
            {app.brandName}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <PlatformBadge platform={app.platform} />
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-semibold"
            style={meta.style}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {/* Status hint */}
      <p className="text-xs mb-4" style={{ color: '#6b6b80' }}>
        {meta.hint}
      </p>

      {/* Current draft link (read-only) */}
      {app.draftLink && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-1" style={{ color: '#4a4a60' }}>
            CURRENT DRAFT
          </p>
          <a
            href={app.draftLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline break-all"
            style={{ color: '#a78bfa' }}
          >
            {app.draftLink}
          </a>
        </div>
      )}

      {/* Draft submission form */}
      {meta.canSubmitDraft && (
        <form onSubmit={handleDraftSubmit} className="flex items-start gap-2">
          <div className="flex-1">
            <input
              type="url"
              value={draftInput}
              onChange={(e) => setDraftInput(e.target.value)}
              placeholder="Paste your draft link (Drive, Dropbox, Frame.io…)"
              className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
              style={{
                backgroundColor: '#0f0f18',
                border: `1px solid ${inputError ? 'rgba(239,68,68,0.5)' : '#2a2a38'}`,
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = 'rgba(124,58,237,0.5)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = inputError
                  ? 'rgba(239,68,68,0.5)'
                  : '#2a2a38')
              }
            />
            {inputError && (
              <p className="text-xs mt-1" style={{ color: '#f87171' }}>
                {inputError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0 transition-all"
            style={{
              background: saved
                ? 'rgba(16,185,129,0.3)'
                : 'linear-gradient(135deg, #7c3aed, #ec4899)',
              opacity: submitting ? 0.7 : 1,
              color: saved ? '#34d399' : 'white',
            }}
          >
            {saved ? 'Submitted ✓' : submitting ? 'Saving…' : 'Submit Draft'}
          </button>
        </form>
      )}

      {/* Deal closed banner */}
      {meta.dealClosed && (
        <div
          className="mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))',
            color: '#a78bfa',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          🎉 Deal officially closed — your content is live!
        </div>
      )}
    </div>
  )
}

ApplicationCard.propTypes = {
  app: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    campaignTitle: PropTypes.string.isRequired,
    brandName: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    draftLink: PropTypes.string,
  }).isRequired,
  onDraftSubmit: PropTypes.func.isRequired,
}

// ─── STATUS filter pills config ───────────────────────────────────────────────

const FILTERS = ['all', 'pending', 'under review', 'revision requested', 'approved', 'deal closed', 'rejected']

// ─── MyApplications page ───────────────────────────────────��──────────────────

export default function MyApplications({ creatorName }) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getApplications({ creatorName })
      .then(setApps)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [creatorName])

  async function handleDraftSubmit(appId, draftLink) {
    const updated = await updateApplication(appId, { draftLink })
    setApps((prev) => prev.map((a) => (a._id === appId ? updated : a)))
    toast.success('Draft link submitted')
  }

  const filtered =
    filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  const counts = {
    approved: apps.filter((a) => a.status === 'approved').length,
    pending: apps.filter((a) => a.status === 'pending').length,
    'revision requested': apps.filter((a) => a.status === 'revision requested')
      .length,
  }

  if (loading) return <LoadingSpinner text="Loading your applications…" />

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">My Applications</h1>
        <p style={{ color: '#6b6b80' }}>
          Track your deals and submit drafts for review
        </p>
      </div>

      {/* Quick-stat strip */}
      {apps.length > 0 && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {counts.approved > 0 && (
            <span
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{
                backgroundColor: 'rgba(16,185,129,0.1)',
                color: '#34d399',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              {counts.approved} approved
            </span>
          )}
          {counts['revision requested'] > 0 && (
            <span
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{
                backgroundColor: 'rgba(249,115,22,0.1)',
                color: '#fb923c',
                border: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              {counts['revision requested']} need revision
            </span>
          )}
          {counts.pending > 0 && (
            <span
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{
                backgroundColor: 'rgba(107,114,128,0.1)',
                color: '#9ca3af',
                border: '1px solid rgba(107,114,128,0.2)',
              }}
            >
              {counts.pending} awaiting review
            </span>
          )}
        </div>
      )}

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
            style={
              filter === f
                ? {
                    background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                    color: 'white',
                    border: '1px solid transparent',
                  }
                : {
                    backgroundColor: '#16161f',
                    color: '#6b6b80',
                    border: '1px solid #2a2a38',
                  }
            }
          >
            {f === 'all' ? `All (${apps.length})` : f}
          </button>
        ))}
      </div>

      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          {error}
        </div>
      )}

      {apps.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
        >
          <p className="text-sm" style={{ color: '#6b6b80' }}>
            No applications yet.
          </p>
          <p className="text-xs mt-1" style={{ color: '#4a4a60' }}>
            Browse open campaigns and hit Apply to get started.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
        >
          <p className="text-sm" style={{ color: '#6b6b80' }}>
            No applications with status "{filter}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onDraftSubmit={handleDraftSubmit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

MyApplications.propTypes = {
  creatorName: PropTypes.string.isRequired,
}
