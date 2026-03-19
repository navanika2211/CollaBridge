import PropTypes from 'prop-types'

const platforms = {
  Instagram: { gradient: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', label: 'Instagram', emoji: '📸' },
  TikTok: { gradient: 'linear-gradient(135deg, #010101, #69c9d0)', label: 'TikTok', emoji: '🎵' },
  YouTube: { gradient: 'linear-gradient(135deg, #ff0000, #cc0000)', label: 'YouTube', emoji: '▶️' },
  Twitter: { gradient: 'linear-gradient(135deg, #1da1f2, #0d8bd9)', label: 'Twitter', emoji: '🐦' },
  Facebook: { gradient: 'linear-gradient(135deg, #1877f2, #0c5abf)', label: 'Facebook', emoji: '👤' },
  Snapchat: { gradient: 'linear-gradient(135deg, #fffc00, #f5e800)', label: 'Snapchat', emoji: '👻' },
  Pinterest: { gradient: 'linear-gradient(135deg, #e60023, #b8001b)', label: 'Pinterest', emoji: '📌' },
  LinkedIn: { gradient: 'linear-gradient(135deg, #0077b5, #005983)', label: 'LinkedIn', emoji: '💼' },
}

export default function PlatformBadge({ platform }) {
  const p = platforms[platform] || { gradient: 'linear-gradient(135deg, #4b5563, #374151)', label: platform, emoji: '🌐' }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ background: p.gradient }}
    >
      {p.label}
    </span>
  )
}

PlatformBadge.propTypes = {
  platform: PropTypes.string.isRequired,
}
