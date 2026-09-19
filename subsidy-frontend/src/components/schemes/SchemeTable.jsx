function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return '—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default function SchemeTable({ schemes, canManage, isBeneficiary, onEdit, onDelete, deletingId, onApply }) {
  if (schemes.length === 0) {
    return (
      <div className="empty-state">
        <strong>No schemes found</strong>
        <span>No scheme records match the current search.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Maximum Amount</th>
            <th>Status</th>
            {(canManage || isBeneficiary) && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme) => (
            <tr key={scheme.id}>
              <td data-label="Code"><span className="scheme-code">{scheme.code}</span></td>
              <td data-label="Name">{scheme.name}</td>
              <td data-label="Maximum Amount">{formatAmount(scheme.maximumAmount)}</td>
              <td data-label="Status">
                <span className={`status-badge ${scheme.active ? 'active' : 'inactive'}`}>
                  {scheme.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {(canManage || isBeneficiary) && (
                <td data-label="Actions" className="actions-cell">
                  {isBeneficiary && (
                    <button
                      type="button"
                      className="table-action apply"
                      onClick={() => onApply(scheme)}
                      disabled={!scheme.active}
                    >
                      Apply
                    </button>
                  )}
                  {canManage && (
                  <button type="button" className="table-action edit" onClick={() => onEdit(scheme)}>
                    Edit
                  </button>
                  )}
                  {canManage && <button
                    type="button"
                    className="table-action delete"
                    onClick={() => onDelete(scheme)}
                    disabled={deletingId === scheme.id}
                  >
                    {deletingId === scheme.id ? 'Deleting...' : 'Delete'}
                  </button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
