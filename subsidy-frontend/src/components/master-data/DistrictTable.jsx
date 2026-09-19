export default function DistrictTable({ districts, canManage, onEdit, onDelete, deletingId }) {
  if (districts.length === 0) return <div className="empty-state"><strong>No districts found</strong><span>No district records match the current search.</span></div>;
  return (
    <div className="table-wrapper">
      <table className="data-table master-data-table">
        <thead><tr><th>ID</th><th>District</th><th>State</th>{canManage && <th className="actions-column">Actions</th>}</tr></thead>
        <tbody>{districts.map((district) => <tr key={district.id}><td data-label="ID">#{district.id}</td><td data-label="District"><strong>{district.name}</strong></td><td data-label="State">{district.stateName || `State #${district.stateId}`}</td>{canManage && <td data-label="Actions" className="actions-cell"><button type="button" className="table-action edit" onClick={() => onEdit(district)}>Edit</button><button type="button" className="table-action delete" onClick={() => onDelete(district)} disabled={deletingId === district.id}>{deletingId === district.id ? 'Deleting…' : 'Delete'}</button></td>}</tr>)}</tbody>
      </table>
    </div>
  );
}
