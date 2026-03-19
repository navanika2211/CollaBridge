import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCampaigns } from '../api/campaigns'
import { getCollaborations } from '../api/collaborations'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import PlatformBadge from '../components/PlatformBadge'
import LoadingSpinner from '../components/LoadingSpinner'

function StatCard({ label, value, sub, gradient }) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8"
        style={{ background: gradient }} />
      <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>{label}</p>
      <p className="text-4xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#6b6b80' }}>{sub}</p>}
    </div>
  )
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  sub: PropTypes.string,
  gradient: PropTypes.string.isRequired,
}

function BrandDashboard({ campaigns }) {
  const open = campaigns.filter(c => c.status === 'open').length
  const inReview = campaigns.filter(c => c.status === 'in_review').length
  const completed = campaigns.filter(c => c.status === 'completed').length

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Brand Dashboard</h1>
        <p style={{ color: '#6b6b80' }}>Your campaign overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <StatCard label="Total Campaigns" value={campaigns.length} sub="all time" gradient="linear-gradient(135deg, #7c3aed, #6d28d9)" />
        <StatCard label="Open" value={open} sub="accepting creators" gradient="linear-gradient(135deg, #10b981, #059669)" />
        <StatCard label="In Review" value={inReview} sub="being evaluated" gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
        <StatCard label="Completed" value={completed} sub="wrapped up" gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Campaigns</h2>
          <Link to="/campaigns" className="text-xs font-medium transition-colors" style={{ color: '#c084fc' }}>
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {campaigns.slice(0, 8).map(c => (
            <Link
              key={c._id}
              to={`/campaigns/${c._id}`}
              className="flex items-center justify-between p-4 rounded-xl transition-all block"
              style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a38'}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.campaignTitle}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#6b6b80' }}>{c.brandName}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <PlatformBadge platform={c.platform} />
                <StatusBadge status={c.status} type="campaign" />
              </div>
            </Link>
          ))}
          {campaigns.length === 0 && (
            <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
              <p className="text-sm" style={{ color: '#6b6b80' }}>No campaigns yet</p>
              <Link to="/campaigns/new" className="text-xs mt-1 block" style={{ color: '#c084fc' }}>Create one →</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

BrandDashboard.propTypes = {
  campaigns: PropTypes.array.isRequired,
}

function CreatorDashboard({ collabs }) {
  const drafts = collabs.filter(c => c.status === 'draft').length
  const revisions = collabs.filter(c => c.status === 'revision_requested').length
  const finals = collabs.filter(c => c.status === 'final').length

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Creator Dashboard</h1>
        <p style={{ color: '#6b6b80' }}>Your collaboration overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <StatCard label="Total Collabs" value={collabs.length} sub="all time" gradient="linear-gradient(135deg, #ec4899, #db2777)" />
        <StatCard label="Drafts" value={drafts} sub="in progress" gradient="linear-gradient(135deg, #6b7280, #4b5563)" />
        <StatCard label="In Revision" value={revisions} sub="needs changes" gradient="linear-gradient(135deg, #f97316, #ea580c)" />
        <StatCard label="Final" value={finals} sub="approved & live" gradient="linear-gradient(135deg, #10b981, #059669)" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Collaborations</h2>
          <Link to="/collaborations" className="text-xs font-medium" style={{ color: '#f9a8d4' }}>
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {collabs.slice(0, 8).map(c => (
            <Link
              key={c._id}
              to={`/collaborations/${c._id}`}
              className="flex items-center justify-between p-4 rounded-xl transition-all block"
              style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a38'}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.campaignTitle}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#6b6b80' }}>{c.creatorName} × {c.brandName}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <PlatformBadge platform={c.platform} />
                <StatusBadge status={c.status} type="collab" />
              </div>
            </Link>
          ))}
          {collabs.length === 0 && (
            <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
              <p className="text-sm" style={{ color: '#6b6b80' }}>No collaborations yet</p>
              <Link to="/collaborations/new" className="text-xs mt-1 block" style={{ color: '#f9a8d4' }}>Create one →</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

CreatorDashboard.propTypes = {
  collabs: PropTypes.array.isRequired,
}

export default function Dashboard() {
  const { user } = useAuth()
  const isBrand = user?.role === 'brand'

  const [campaigns, setCampaigns] = useState([])
  const [collabs, setCollabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = isBrand
      ? getCampaigns().then(data => setCampaigns(data))
      : getCollaborations().then(data => setCollabs(data))

    fetch.catch(console.error).finally(() => setLoading(false))
  }, [isBrand])

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />

  return (
    <div className="max-w-5xl">
      {isBrand
        ? <BrandDashboard campaigns={campaigns} />
        : <CreatorDashboard collabs={collabs} />
      }
    </div>
  )
}
