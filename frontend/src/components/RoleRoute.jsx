import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Renders children only if the logged-in user's role matches `allowedRole`.
 * Redirects to `fallback` otherwise (defaults to "/").
 */
export default function RoleRoute({ allowedRole, fallback = '/', children }) {
  const { user } = useAuth()
  if (user?.role !== allowedRole) return <Navigate to={fallback} replace />
  return children
}

RoleRoute.propTypes = {
  allowedRole: PropTypes.oneOf(['brand', 'creator']).isRequired,
  fallback: PropTypes.string,
  children: PropTypes.node.isRequired,
}
