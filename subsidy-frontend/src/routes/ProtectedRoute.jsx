import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// IMPORTANT: this guard only controls what the UI shows/hides.
// It is NOT the security mechanism — Spring Security on the backend
// is authoritative. A user could bypass this in devtools and every
// request would still be rejected server-side.
//
// allowedRoles: optional array, e.g. ['ADMIN', 'DISTRICT_OFFICER'].
// Omit it to just require "logged in", regardless of role.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
