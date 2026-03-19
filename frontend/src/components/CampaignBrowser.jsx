import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { getCampaigns } from '../api/campaigns'
import { createApplication, getApplications } from '../api/applications'
import PlatformBadge from './PlatformBadge'
import LoadingSpinner from './LoadingSpinner'
import './CampaignBrowser.css'

const PLATFORMS = [
  'All',
  'Instagram',
  'TikTok',
  'YouTube',
  'Twitter',
  'LinkedIn',
  'Facebook',
  'Pinterest',
  'Snapchat',
]

export default function CampaignBrowser({ creatorName }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform] = useState('All')
  const [applied, setApplied] = useState({})
  const [applying, setApplying] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getCampaigns({ status: 'open' }),
      getApplications({ creatorName }),
    ])
      .then(([fetchedCampaigns, existingApps]) => {
        setCampaigns(fetchedCampaigns)
        const alreadyApplied = {}
        for (const app of existingApps) {
          alreadyApplied[app.campaignId] = true
        }
        setApplied(alreadyApplied)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [creatorName])

  async function handleApply(campaign) {
    setApplying((prev) => ({ ...prev, [campaign._id]: true }))
    try {
      await createApplication({
        campaignId: campaign._id,
        campaignTitle: campaign.campaignTitle,
        brandName: campaign.brandName,
        creatorName,
      })
      setApplied((prev) => ({ ...prev, [campaign._id]: true }))
    } catch (err) {
      setError(err.message)
    } finally {
      setApplying((prev) => ({ ...prev, [campaign._id]: false }))
    }
  }

  const filtered =
    platform === 'All'
      ? campaigns
      : campaigns.filter((c) => c.platform === platform)

  if (loading) return <LoadingSpinner text="Loading open campaigns..." />

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Browse Campaigns</h1>
        <p style={{ color: '#6b6b80' }}>
          Discover open brand campaigns and apply
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              platform === p
                ? {
                    background:
                      'linear-gradient(135deg, #7c3aed, #ec4899)',
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
            {p}
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

      <div className="campaign-browser__grid">
        {filtered.map((c) => (
          <div
            key={c._id}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ backgroundColor: '#16161f', border: '1px solid #2a2a38' }}
          >
            <div>
              <p className="text-sm font-semibold text-white leading-snug">
                {c.campaignTitle}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b6b80' }}>
                {c.brandName}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <PlatformBadge platform={c.platform} />
              {c.budget && (
                <span
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                >
                  ${c.budget.toLocaleString()}
                </span>
              )}
            </div>

            {c.description && (
              <p
                className="text-xs leading-relaxed campaign-browser__desc"
                style={{ color: '#9ca3af' }}
              >
                {c.description}
              </p>
            )}

            {c.deadline && (
              <p className="text-xs" style={{ color: '#6b6b80' }}>
                Deadline:{' '}
                {new Date(c.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}

            <button
              type="button"
              onClick={() => handleApply(c)}
              disabled={applied[c._id] || applying[c._id]}
              className="mt-auto w-full py-2 rounded-xl text-xs font-semibold text-white transition-all"
              style={
                applied[c._id]
                  ? {
                      backgroundColor: 'rgba(16,185,129,0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.3)',
                      cursor: 'default',
                    }
                  : {
                      background: applying[c._id]
                        ? 'rgba(124,58,237,0.4)'
                        : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      opacity: applying[c._id] ? 0.7 : 1,
                    }
              }
            >
              {applied[c._id]
                ? 'Applied ✓'
                : applying[c._id]
                  ? 'Applying...'
                  : 'Apply'}
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p
            className="text-center py-16 text-sm"
            style={{ color: '#6b6b80', gridColumn: '1 / -1' }}
          >
            No open campaigns for this platform right now.
          </p>
        )}
      </div>
    </div>
  )
}

CampaignBrowser.propTypes = {
  creatorName: PropTypes.string.isRequired,
}
