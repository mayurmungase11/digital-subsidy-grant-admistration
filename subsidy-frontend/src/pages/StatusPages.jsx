import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="page-shell">
      <h1>Access denied</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/login">Back to login</Link>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page-shell">
      <h1>Page not found</h1>
      <Link to="/login">Back to login</Link>
    </div>
  );
}
