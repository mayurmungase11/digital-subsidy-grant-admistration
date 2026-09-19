import { useState } from 'react';
const STATUS_OPTIONS = ['VERIFIED', 'REJECTED'];
export default function VerificationForm({ applications, userId, onSubmit, onCancel, submitting }) {
  const [applicationId, setApplicationId] = useState(applications[0]?.id ? String(applications[0].id) : '');
  const [status, setStatus] = useState('VERIFIED');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!applicationId) return setError('Please select an application.');
    if (!userId) return setError('Your user identity is unavailable. Please sign in again.');
    setError('');
    await onSubmit({ applicationId: Number(applicationId), verifiedById: Number(userId), status, remarks: remarks.trim() || null });
  };
  return <section className="module-form-card">
    <div className="section-heading"><div><span className="eyebrow">FIELD VERIFICATION</span><h2>Verify Application</h2><p>Record the verification outcome for an application currently under verification.</p></div></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    {applications.length === 0 ? <div className="empty-state compact-empty"><strong>No applications are ready for verification</strong><span>Eligible applications will appear here after backend eligibility evaluation.</span></div> : <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field"><label htmlFor="verification-application">Application</label><select id="verification-application" value={applicationId} onChange={(event) => setApplicationId(event.target.value)} disabled={submitting}><option value="">Select application</option>{applications.map((application) => <option key={application.id} value={application.id}>Application #{application.id} — Beneficiary #{application.beneficiaryId} — ₹{Number(application.requestedAmount || 0).toLocaleString('en-IN')}</option>)}</select></div>
        <div className="field"><label htmlFor="verification-status">Verification Status</label><select id="verification-status" value={status} onChange={(event) => setStatus(event.target.value)} disabled={submitting}>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}</select></div>
      </div>
      <div className="field"><label htmlFor="verification-remarks">Remarks</label><textarea id="verification-remarks" rows="4" placeholder="Add verification remarks (optional)" value={remarks} onChange={(event) => setRemarks(event.target.value)} disabled={submitting} /></div>
      <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="btn-primary form-submit-button" disabled={submitting}>{submitting ? 'Saving…' : 'Save Verification'}</button></div>
    </form>}
  </section>;
}
