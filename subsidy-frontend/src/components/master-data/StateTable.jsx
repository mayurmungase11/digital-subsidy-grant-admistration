export default function StateTable({ states, canManage, onDelete, deletingId }) {
  if (states.length === 0) {
    return <div className="empty-state"><strong>No states found</strong><span>No state records match the current search.</span></div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table master-data-table">
        <thead><tr><th>ID</th><th>State Name</th>{canManage && <th className="actions-column">Actions</th>}</tr></thead>
        <tbody>
          {states.map((state) => (
            <tr key={state.id}>
              <td data-label="ID">#{state.id}</td>
              <td data-label="State Name"><strong>{state.name}</strong></td>
              {canManage && <td data-label="Actions" className="actions-cell"><button type="button" className="table-action delete" onClick={() => onDelete(state)} disabled={deletingId === state.id}>{deletingId === state.id ? 'Deleting…' : 'Delete'}</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
