import PropTypes from 'prop-types'

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#7c3aed', borderRightColor: '#ec4899' }}
      />
      <p className="text-sm" style={{ color: '#6b6b80' }}>{text}</p>
    </div>
  )
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
}
