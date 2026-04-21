import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCampaigns } from '../../api/campaigns'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import PlatformBadge from '../../components/PlatformBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

const FILTERS = ['all', 'open', 'in_review', 'completed']
const FILTER_LABELS = { all: 'All', open: 'Open', in_review: 'In Review', completed: 'Completed' }

export default function CampaignsList() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const userName = user?.name ?? ''

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params = { brandName: userName }
        if (filter !== 'all') params.status = filter
        if (search.trim()) params.campaignTitle = search.trim()
        setCampaigns(await getCampaigns(params))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filter, search, userName])

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Campaigns</h1>
          <p style={{ color: '#6b6b80' }}>Manage brand campaigns</p>
        </div>
        <Link
          to="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </Link>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
        <div className="flex gap-1.5 p-1 rounded-xl" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filter === f
                ? { background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff' }
                : { color: '#6b6b80', backgroundColor: 'transparent' }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by campaign title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl text-sm text-white placeholder:text-gray-600 outline-none transition-all"
          style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
          onBlur={e => e.target.style.borderColor = '#2a2a38'}
        />
      </div>

      {/* List */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {campaigns.length === 0 && (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}>
              <p className="text-4xl mb-3">📣</p>
              <p className="text-white font-medium">No campaigns found</p>
              <p className="text-sm mt-1 mb-4" style={{ color: '#6b6b80' }}>
                {filter !== 'all' ? 'Try a different filter' : 'Create your first campaign'}
              </p>
              <Link to="/campaigns/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                + New Campaign
              </Link>
            </div>
          )}
          {campaigns.map(c => (
            <Link
              key={c._id}
              to={`/campaigns/${c._id}`}
              className="flex items-center justify-between p-5 rounded-2xl transition-all group block"
              style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a38'}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-white font-semibold truncate">{c.campaignTitle}</p>
                  <PlatformBadge platform={c.platform} />
                </div>
                <p className="text-sm" style={{ color: '#6b6b80' }}>{c.brandName}</p>
                {c.description && (
                  <p className="text-xs mt-1 line-clamp-1" style={{ color: '#4a4a60' }}>{c.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {c.budget && (
                    <span className="text-xs" style={{ color: '#6b6b80' }}>
                      💰 ${Number(c.budget).toLocaleString()}
                    </span>
                  )}
                  {c.deadline && (
                    <span className="text-xs" style={{ color: '#6b6b80' }}>
                      📅 {new Date(c.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 shrink-0">
                <StatusBadge status={c.status} type="campaign" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
