export default function SchemeDistrictTable({ mappings, schemeById, districtById, canManage, onEdit, onDelete, deletingId }) {
  if (mappings.length === 0) return <div className="empty-state"><strong>No scheme coverage found</strong><span>No mappings match the current search.</span></div>;
  return (
    <div className="table-wrapper">
      <table className="data-table master-data-table">
        <thead><tr><th>ID</th><th>Scheme</th><th>District</th>{canManage && <th className="actions-column">Actions</th>}</tr></thead>
        <tbody>{mappings.map((mapping) => { const scheme = schemeById.get(Number(mapping.schemeId)); const district = districtById.get(Number(mapping.districtId)); return <tr key={mapping.id}><td data-label="ID">#{mapping.id}</td><td data-label="Scheme"><strong>{scheme?.code || `Scheme #${mapping.schemeId}`}</strong>{scheme?.name && <div className="table-secondary-text">{scheme.name}</div>}</td><td data-label="District"><strong>{district?.name || `District #${mapping.districtId}`}</strong>{district?.stateName && <div className="table-secondary-text">{district.stateName}</div>}</td>{canManage && <td data-label="Actions" className="actions-cell"><button type="button" className="table-action edit" onClick={() => onEdit(mapping)}>Edit</button><button type="button" className="table-action delete" onClick={() => onDelete(mapping)} disabled={deletingId === mapping.id}>{deletingId === mapping.id ? 'Deleting…' : 'Delete'}</button></td>}</tr>; })}</tbody>
      </table>
    </div>
  );
}
