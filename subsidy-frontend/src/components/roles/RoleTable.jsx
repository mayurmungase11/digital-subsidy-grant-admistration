const BUILT_IN_ROLES = new Set([
  'ADMIN',
  'BENEFICIARY',
  'FIELD_OFFICER',
  'DISTRICT_OFFICER',
  'FINANCE_OFFICER',
]);

export default function RoleTable({ roles, currentUserRole, onEdit, onDelete, deletingId }) {
  if (roles.length === 0) {
    return (
      <div className="empty-state">
        <strong>No roles found</strong>
        <span>Role records will appear here after they are created.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table role-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            <th>System Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            const isBuiltIn = BUILT_IN_ROLES.has(String(role.name || '').trim().toUpperCase());
            const isCurrent = String(role.name || '').trim().toUpperCase() === currentUserRole;

            return (
              <tr key={role.id}>
                <td data-label="ID"><strong>#{role.id}</strong></td>
                <td data-label="Role Name">
                  <div className="table-primary-text">{role.name}</div>
                  {isCurrent && <span className="current-user-badge">Your current role</span>}
                </td>
                <td data-label="System Role">
                  {isBuiltIn ? <span className="role-badge role-badge-system">Built-in</span> : <span className="role-badge">Custom</span>}
                </td>
                <td data-label="Actions" className="actions-cell">
                  <div className="table-actions">
                    <button type="button" className="btn-small btn-secondary" onClick={() => onEdit(role)}>Edit</button>
                    <button
                      type="button"
                      className="btn-small btn-danger"
                      onClick={() => onDelete(role)}
                      disabled={deletingId === role.id || isCurrent}
                      title={isCurrent ? 'Your current role cannot be deleted from this screen.' : ''}
                    >
                      {deletingId === role.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
