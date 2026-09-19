function formatRole(roleName) {
  if (!roleName) return 'Unknown';
  return roleName.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UserTable({ users, roleById, currentUserId, onEdit, onDelete, deletingId }) {
  return (
    <div className="table-wrapper">
      <table className="data-table user-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email / Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = String(user.id) === String(currentUserId);
            const roleName = roleById.get(Number(user.roleId));
            return (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td><strong>{user.name}</strong>{isCurrentUser && <span className="current-user-badge">You</span>}</td>
                <td>{user.email}</td>
                <td><span className="role-badge">{formatRole(roleName)}</span></td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="btn-secondary btn-small" onClick={() => onEdit(user)}>Edit</button>
                    <button type="button" className="btn-danger btn-small" onClick={() => onDelete(user)} disabled={isCurrentUser || deletingId === user.id} title={isCurrentUser ? 'You cannot delete your own account.' : 'Delete user'}>
                      {deletingId === user.id ? 'Deleting…' : 'Delete'}
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
