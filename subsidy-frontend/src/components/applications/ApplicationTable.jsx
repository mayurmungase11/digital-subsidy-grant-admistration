const STAFF_EVALUATION_ROLES = new Set(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER']);

function statusClass(status) {
  return `status-badge status-${String(status || '').toLowerCase().replaceAll('_', '-')}`;
}

function statusLabel(status) {
  return String(status || 'UNKNOWN').replaceAll('_', ' ');
}

export default function ApplicationTable({ applications, role, schemeMap, evaluatingId, onEvaluate }) {
  const canEvaluate = STAFF_EVALUATION_ROLES.has(role);

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <strong>No applications found</strong>
        <span>Applications will appear here after they are submitted.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table application-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Beneficiary</th>
            <th>Scheme</th>
            <th>Requested Amount</th>
            <th>Status</th>
            {canEvaluate && <th>Eligibility</th>}
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            const scheme = schemeMap.get(application.schemeId);
            const evaluable = application.status === 'SUBMITTED';

            return (
              <tr key={application.id}>
                <td data-label="ID"><strong>#{application.id}</strong></td>
                <td data-label="Beneficiary">#{application.beneficiaryId}</td>
                <td data-label="Scheme">
                  <div className="table-primary-text">{scheme?.name || `Scheme #${application.schemeId}`}</div>
                  {scheme?.code && <div className="table-secondary-text">{scheme.code}</div>}
                </td>
                <td data-label="Requested Amount">₹{Number(application.requestedAmount || 0).toLocaleString('en-IN')}</td>
                <td data-label="Status">
                  <span className={statusClass(application.status)}>{statusLabel(application.status)}</span>
                </td>
                {canEvaluate && (
                  <td data-label="Eligibility" className="actions-cell">
                    {evaluable ? (
                      <button
                        type="button"
                        className="btn-small btn-primary"
                        onClick={() => onEvaluate(application)}
                        disabled={evaluatingId === application.id}
                      >
                        {evaluatingId === application.id ? 'Checking…' : 'Check Eligibility'}
                      </button>
                    ) : (
                      <span className="table-muted">Not available</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
