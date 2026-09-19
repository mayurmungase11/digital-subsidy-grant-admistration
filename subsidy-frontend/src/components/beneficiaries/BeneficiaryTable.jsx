function maskIdentity(value) {
  if (!value) return '—';
  const text = String(value);
  if (text.length <= 4) return '••••';
  return `${'•'.repeat(Math.max(0, text.length - 4))}${text.slice(-4)}`;
}

function maskBank(value) {
  if (!value) return '—';
  const text = String(value);
  if (text.length <= 4) return '••••';
  return `${'•'.repeat(Math.max(0, text.length - 4))}${text.slice(-4)}`;
}

export default function BeneficiaryTable({ beneficiaries, canManage, deletingId, onEdit, onDelete }) {
  if (beneficiaries.length === 0) {
    return <div className="empty-state">No beneficiaries found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table beneficiary-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Beneficiary</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Annual Income</th>
            <th>Identity</th>
            <th>Bank Account</th>
            <th>IFSC</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.id}>
              <td>#{beneficiary.id}</td>
              <td>
                <div className="table-primary-text">{beneficiary.name}</div>
                <div className="table-secondary-text">{beneficiary.email}</div>
              </td>
              <td>{beneficiary.phone || '—'}</td>
              <td>{beneficiary.age ?? '—'}</td>
              <td>₹{Number(beneficiary.annualIncome ?? 0).toLocaleString('en-IN')}</td>
              <td>{maskIdentity(beneficiary.identityNumber)}</td>
              <td>{maskBank(beneficiary.bankAccountNumber)}</td>
              <td>{beneficiary.ifscCode || '—'}</td>
              {canManage && (
                <td>
                  <div className="table-actions">
                    <button type="button" className="table-action-button" onClick={() => onEdit(beneficiary)}>Edit</button>
                    <button type="button" className="table-action-button danger" onClick={() => onDelete(beneficiary)} disabled={deletingId === beneficiary.id}>
                      {deletingId === beneficiary.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
