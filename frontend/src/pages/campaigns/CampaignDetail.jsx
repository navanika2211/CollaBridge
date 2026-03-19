import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCampaign, deleteCampaign } from '../../api/campaigns'
import StatusBadge from '../../components/StatusBadge'
import PlatformBadge from '../../components/PlatformBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ConfirmModal from '../../components/ConfirmModal'

function Field({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  )
}

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getCampaign(id)
      .then(setCampaign)
      .catch(() => navigate('/campaigns'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCampaign(id)
      navigate('/campaigns')
    } catch (e) {
      console.error(e)
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!campaign) return null

  return (
    <div className="max-w-3xl">
      {showConfirm && (
        <ConfirmModal
          title="Delete Campaign"
          message={`Are you sure you want to delete "${campaign.campaignTitle}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}

      {/* Back */}
      <Link to="/campaigns" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors" style={{ color: '#6b6b80' }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Campaigns
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.08))', border: '1px solid rgba(124,58,237,0.25)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-16 translate-x-16"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PlatformBadge platform={campaign.platform} />
              <StatusBadge status={campaign.status} type="campaign" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{campaign.campaignTitle}</h1>
            <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>{campaign.brandName}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/campaigns/${id}/edit`}
              className="px-3 py-2 rounded-xl text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#1f1f2e', border: '1px solid #2a2a38' }}
            >
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="rounded-2xl p-6 grid grid-cols-2 gap-5" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
        <Field label="Brand Name" value={campaign.brandName} />
        <Field label="Platform" value={campaign.platform} />
        <Field label="Budget" value={campaign.budget ? `$${Number(campaign.budget).toLocaleString()}` : null} />
        <Field label="Deadline" value={campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
        {campaign.description && (
          <div className="col-span-2">
            <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Description</p>
            <p className="text-sm text-white leading-relaxed">{campaign.description}</p>
          </div>
        )}
        {campaign.requirements && (
          <div className="col-span-2">
            <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Requirements</p>
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{campaign.requirements}</p>
          </div>
        )}
        {campaign.internalNotes && (
          <div className="col-span-2">
            <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Internal Notes</p>
            <div className="p-3 rounded-xl text-sm text-white leading-relaxed whitespace-pre-wrap"
              style={{ backgroundColor: '#0f0f18' }}>
              {campaign.internalNotes}
            </div>
          </div>
        )}
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Created</p>
          <p className="text-sm" style={{ color: '#6b6b80' }}>{new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Last Updated</p>
          <p className="text-sm" style={{ color: '#6b6b80' }}>{new Date(campaign.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}
