import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCollaboration, deleteCollaboration } from '../../api/collaborations'
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

export default function CollaborationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collab, setCollab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getCollaboration(id)
      .then(setCollab)
      .catch(() => navigate('/collaborations'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCollaboration(id)
      toast.success('Collaboration deleted')
      navigate('/collaborations')
    } catch (e) {
      toast.error(e.message)
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!collab) return null

  return (
    <div className="max-w-3xl">
      {showConfirm && (
        <ConfirmModal
          title="Delete Collaboration"
          message={`Are you sure you want to delete "${collab.campaignTitle}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}

      <Link to="/collaborations" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors" style={{ color: '#6b6b80' }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Collaborations
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(236,72,153,0.08))', border: '1px solid rgba(249,115,22,0.25)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-16 translate-x-16 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PlatformBadge platform={collab.platform} />
              <StatusBadge status={collab.status} type="collab" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{collab.campaignTitle}</h1>
            <p className="text-sm font-medium" style={{ color: '#fb923c' }}>
              {collab.creatorName}
              <span className="mx-2" style={{ color: '#4a4a60' }}>×</span>
              <span className="text-white">{collab.brandName}</span>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/collaborations/${id}/edit`}
              className="px-3 py-2 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: '#1f1f2e', border: '1px solid #2a2a38' }}
            >
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="rounded-2xl p-6 grid grid-cols-2 gap-5" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
        <Field label="Creator Name" value={collab.creatorName} />
        <Field label="Brand Name" value={collab.brandName} />
        <Field label="Platform" value={collab.platform} />
        <Field label="Due Date" value={collab.dueDate ? new Date(collab.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
        {collab.submissionLink && (
          <div className="col-span-2">
            <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Submission Link</p>
            <a
              href={collab.submissionLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm break-all transition-colors"
              style={{ color: '#fb923c' }}
            >
              {collab.submissionLink}
            </a>
          </div>
        )}
        {collab.personalNotes && (
          <div className="col-span-2">
            <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Personal Notes</p>
            <div className="p-3 rounded-xl text-sm text-white leading-relaxed whitespace-pre-wrap"
              style={{ backgroundColor: '#0f0f18' }}>
              {collab.personalNotes}
            </div>
          </div>
        )}
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Created</p>
          <p className="text-sm" style={{ color: '#6b6b80' }}>{new Date(collab.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#6b6b80' }}>Last Updated</p>
          <p className="text-sm" style={{ color: '#6b6b80' }}>{new Date(collab.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}
