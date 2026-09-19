import { useState } from 'react';

const STATUS_OPTIONS = ['APPROVED', 'REJECTED'];

export default function ApprovalForm({ applications, userId, onSubmit, onCancel, submitting }) {
  const [applicationId, setApplicationId] = useState(applications[0]?.id ? String(applications[0].id) : '');
  const [status, setStatus] = useState('APPROVED');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const selected = applications.find((application) => String(application.id) === applicationId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!applicationId) return setError('Please select an application.');
    if (!userId) return setError('Your user identity is unavailable. Please sign in again.');
    if (approvedAmount === '' || Number(approvedAmount) < 0) return setError('Approved amount must be zero or greater.');
    setError('');
    await onSubmit({
      applicationId: Number(applicationId),
      approvedById: Number(userId),
      status,
      approvedAmount: Number(approvedAmount),
      remarks: remarks.trim() || null,
    });
  };

  return <section className="module-form-card">
    <div className="section-heading"><div><span className="eyebrow">DISTRICT APPROVAL</span><h2>Review Application</h2><p>Record the approval decision for an application that has completed verification.</p></div></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    {applications.length === 0 ? <div className="empty-state compact-empty"><strong>No applications are ready for approval</strong><span>Verified applications will appear here after a successful verification.</span></div> : <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field"><label htmlFor="approval-application">Application</label><select id="approval-application" value={applicationId} onChange={(event) => { setApplicationId(event.target.value); setApprovedAmount(''); }} disabled={submitting}><option value="">Select application</option>{applications.map((application) => <option key={application.id} value={application.id}>Application #{application.id} — Beneficiary #{application.beneficiaryId} — ₹{Number(application.requestedAmount || 0).toLocaleString('en-IN')}</option>)}</select></div>
        <div className="field"><label htmlFor="approval-status">Approval Status</label><select id="approval-status" value={status} onChange={(event) => setStatus(event.target.value)} disabled={submitting}>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
      </div>
      <div className="field-row">
        <div className="field"><label htmlFor="approval-amount">Approved Amount</label><input id="approval-amount" type="number" min="0" step="0.01" value={approvedAmount} onChange={(event) => setApprovedAmount(event.target.value)} placeholder="Enter approved amount" disabled={submitting} />{selected && <small>Requested amount: ₹{Number(selected.requestedAmount || 0).toLocaleString('en-IN')}</small>}</div>
        <div className="field"><label>Approved By</label><input value={`User #${userId}`} readOnly disabled /></div>
      </div>
      <div className="field"><label htmlFor="approval-remarks">Remarks</label><textarea id="approval-remarks" rows="4" placeholder="Add approval remarks (optional)" value={remarks} onChange={(event) => setRemarks(event.target.value)} disabled={submitting} /></div>
      <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="btn-primary form-submit-button" disabled={submitting}>{submitting ? 'Saving…' : 'Save Approval'}</button></div>
    </form>}
  </section>;
}
