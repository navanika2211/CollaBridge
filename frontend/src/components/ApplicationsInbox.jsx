import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { getApplications, updateApplication } from '../api/applications'
import PlatformBadge from './PlatformBadge'
import LoadingSpinner from './LoadingSpinner'
import './ApplicationsInbox.css'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  pending: { color: '#9ca3af', bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)' },
  'under review': { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  'revision requested': { color: '#fb923c', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  approved: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  'deal closed': { color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
  rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'New' },
  { key: 'under review', label: 'Under Review' },
  { key: 'revision requested', label: 'Revision' },
  { key: 'approved', label: 'Approved' },
  { key: 'deal closed', label: 'Closed' },
  { key: 'rejected', label: 'Rejected' },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function StatusBadgeInline({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-lg font-semibold capitalize"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  )
}

StatusBadgeInline.propTypes = { status: PropTypes.string.isRequired }

function CreatorAvatar({ name }) {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ background: 'linear-gradient(135deg, #ec4899, #7c3aed)' }}
    >
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

CreatorAvatar.propTypes = { name: PropTypes.string.isRequired }

// ─── ApplicationCard ──────────────────────────────────────────────────────────

function ApplicationCard({ app, onAction, acting }) {
  const isClosed = app.status === 'deal closed'
  const isRejected = app.status === 'rejected'
  const isTerminal = isClosed || isRejected

  return (
    <div
      className={`inbox-card rounded-2xl p-5 ${isClosed ? 'inbox-card--closed' : ''}`}
      style={{
        backgroundColor: '#16161f',
        border: `1px solid ${isClosed ? 'rgba(124,58,237,0.3)' : '#2a2a38'}`,
      }}
    >
      {/* ── Row 1: avatar + creator info + status badge ── */}
      <div className="flex items-start gap-3">
        <CreatorAvatar name={app.creatorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{app.creatorName}</p>
            <StatusBadgeInline status={app.status} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-xs" style={{ color: '#6b6b80' }}>
              {app.campaignTitle}
            </p>
            <PlatformBadge platform={app.platform} />
          </div>
        </div>
        <p className="text-xs shrink-0" style={{ color: '#4a4a60' }}>
          {new Date(app.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* ── Pitch message ── */}
      {app.message && (
        <p
          className="text-xs mt-3 leading-relaxed px-1"
          style={{ color: '#9ca3af', borderLeft: '2px solid #2a2a38', paddingLeft: '10px' }}
        >
          {app.message}
        </p>
      )}

      {/* ── Draft link ── */}
      {app.draftLink ? (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <a
            href={app.draftLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline truncate"
            style={{ color: '#a78bfa' }}
          >
            {app.draftLink}
          </a>
        </div>
      ) : (
        !isTerminal && (
          <p className="text-xs mt-3" style={{ color: '#4a4a60' }}>
            No draft submitted yet
          </p>
        )
      )}

      {/* ── Action buttons ── */}
      {!isTerminal && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {app.status === 'pending' && (
            <>
              <ActionButton
                label="Mark Under Review"
                onClick={() => onAction(app._id, 'under review')}
                loading={acting}
                variant="primary"
              />
              <ActionButton
                label="Reject"
                onClick={() => onAction(app._id, 'rejected')}
                loading={acting}
                variant="danger"
              />
            </>
          )}

          {app.status === 'under review' && (
            <>
              <ActionButton
                label={app.draftLink ? 'Approve Draft' : 'Approve'}
                onClick={() => onAction(app._id, 'approved')}
                loading={acting}
                variant="success"
              />
              <ActionButton
                label="Request Revision"
                onClick={() => onAction(app._id, 'revision requested')}
                loading={acting}
                variant="warning"
              />
              <ActionButton
                label="Reject"
                onClick={() => onAction(app._id, 'rejected')}
                loading={acting}
                variant="danger"
              />
            </>
          )}

          {app.status === 'revision requested' && (
            <>
              <ActionButton
                label="Approve Draft"
                onClick={() => onAction(app._id, 'approved')}
                loading={acting}
                variant="success"
                disabled={!app.draftLink}
                disabledHint="Waiting for creator to submit a revised draft"
              />
              <ActionButton
                label="Reject"
                onClick={() => onAction(app._id, 'rejected')}
                loading={acting}
                variant="danger"
              />
            </>
          )}

          {app.status === 'approved' && (
            <ActionButton
              label="Close Deal ✓"
              onClick={() => onAction(app._id, 'deal closed')}
              loading={acting}
              variant="close"
              disabled={!app.draftLink}
              disabledHint="Creator must submit a draft before the deal can be closed"
            />
          )}
        </div>
      )}

      {/* ── Deal closed banner ── */}
      {isClosed && (
        <div
          className="mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))',
            color: '#a78bfa',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          Deal closed — content live
        </div>
      )}
    </div>
  )
}

ApplicationCard.propTypes = {
  app: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    creatorName: PropTypes.string.isRequired,
    campaignTitle: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    message: PropTypes.string,
    draftLink: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  acting: PropTypes.bool.isRequired,
}

// ─── ActionButton ─────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
  primary: { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white' },
  success: { background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white' },
  warning: { backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' },
  danger: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  close: { background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' },
}

function ActionButton({ label, onClick, loading, variant, disabled, disabledHint }) {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary
  const isDisabled = loading || disabled

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
        style={{ ...style, opacity: isDisabled ? 0.45 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      >
        {loading ? '…' : label}
      </button>
      {disabled && disabledHint && (
        <div className="inbox-tooltip">
          {disabledHint}
        </div>
      )}
    </div>
  )
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disabledHint: PropTypes.string,
}

ActionButton.defaultProps = {
  disabled: false,
  disabledHint: '',
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value, color }) {
  return (
    <div
      className="flex flex-col items-center px-5 py-3 rounded-2xl"
      style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
    >
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: '#6b6b80' }}>
        {label}
      </p>
    </div>
  )
}

StatChip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}

// ─── ApplicationsInbox ────────────────────────────────────────────────────────

export default function ApplicationsInbox() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acting, setActing] = useState({})
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    getApplications()
      .then(setApps)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAction(appId, newStatus) {
    setActing((prev) => ({ ...prev, [appId]: true }))
    try {
      const updated = await updateApplication(appId, { status: newStatus })
      setApps((prev) => prev.map((a) => (a._id === appId ? updated : a)))
    } catch (err) {
      setError(err.message)
    } finally {
      setActing((prev) => ({ ...prev, [appId]: false }))
    }
  }

  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    'under review': apps.filter((a) => a.status === 'under review').length,
    'revision requested': apps.filter((a) => a.status === 'revision requested').length,
    approved: apps.filter((a) => a.status === 'approved').length,
    'deal closed': apps.filter((a) => a.status === 'deal closed').length,
    rejected: apps.filter((a) => a.status === 'rejected').length,
  }

  const visible =
    activeTab === 'all' ? apps : apps.filter((a) => a.status === activeTab)

  if (loading) return <LoadingSpinner text="Loading applications..." />

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Applications Inbox</h1>
        <p style={{ color: '#6b6b80' }}>
          Review creator applications and manage your deals
        </p>
      </div>

      {/* Stats strip */}
      {apps.length > 0 && (
        <div className="flex gap-3 mb-7 flex-wrap">
          <StatChip label="Total" value={counts.all} color="#9ca3af" />
          <StatChip label="New" value={counts.pending} color="#fbbf24" />
          <StatChip label="Approved" value={counts.approved} color="#34d399" />
          <StatChip label="Deals Closed" value={counts['deal closed']} color="#a78bfa" />
          <StatChip label="Rejected" value={counts.rejected} color="#f87171" />
        </div>
      )}

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

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 flex-wrap">
        {TABS.map((tab) => {
          const count = counts[tab.key]
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      color: 'white',
                      border: '1px solid transparent',
                    }
                  : {
                      backgroundColor: '#16161f',
                      color: count === 0 ? '#4a4a60' : '#6b6b80',
                      border: '1px solid #2a2a38',
                    }
              }
            >
              {tab.label}
              {count > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={
                    isActive
                      ? { backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' }
                      : { backgroundColor: '#2a2a38', color: '#9ca3af' }
                  }
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      {apps.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
        >
          <p className="text-sm" style={{ color: '#6b6b80' }}>
            No applications yet.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
        >
          <p className="text-sm" style={{ color: '#6b6b80' }}>
            No applications with this status.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onAction={handleAction}
              acting={!!acting[app._id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

ApplicationsInbox.propTypes = {}
