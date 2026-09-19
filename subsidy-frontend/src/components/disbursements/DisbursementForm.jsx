import { useMemo, useState } from 'react';

const STATUSES = ['PENDING', 'PROCESSED', 'FAILED'];

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DisbursementForm({ applications, approvals, disbursements, onSubmit, onCancel, submitting }) {
  const [applicationId, setApplicationId] = useState('');
  const [installmentNumber, setInstallmentNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('PROCESSED');
  const [transactionReference, setTransactionReference] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const approvedApplications = useMemo(() => {
    const approvalMap = new Map(approvals.map((a) => [Number(a.applicationId), a]));
    return applications
      .filter((app) => approvalMap.get(Number(app.id))?.status === 'APPROVED')
      .map((app) => ({ application: app, approval: approvalMap.get(Number(app.id)) }))
      .sort((a, b) => Number(a.application.id) - Number(b.application.id));
  }, [applications, approvals]);

  const selected = approvedApplications.find((item) => Number(item.application.id) === Number(applicationId));
  const existing = selected ? disbursements.filter((d) => Number(d.applicationId) === Number(selected.application.id)) : [];
  const alreadyDisbursed = existing.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const approvedAmount = Number(selected?.approval?.approvedAmount || 0);
  const remaining = Math.max(approvedAmount - alreadyDisbursed, 0);
  const nextInstallment = existing.reduce((max, d) => Math.max(max, Number(d.installmentNumber || 0)), 0) + 1;
  const enteredAmount = Number(amount || 0);
  const projectedTotal = alreadyDisbursed + enteredAmount;
  const exceeds = enteredAmount > 0 && projectedTotal > approvedAmount;

  const handleApplicationChange = (event) => {
    const id = event.target.value;
    setApplicationId(id);
    const row = approvedApplications.find((item) => Number(item.application.id) === Number(id));
    const rows = row ? disbursements.filter((d) => Number(d.applicationId) === Number(id)) : [];
    const next = rows.reduce((max, d) => Math.max(max, Number(d.installmentNumber || 0)), 0) + 1;
    setInstallmentNumber(next ? String(next) : '1');
    setAmount('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    const numericInstallment = Number(installmentNumber);

    if (!selected) return setError('Select an approved application before creating a disbursement.');
    if (!Number.isInteger(numericInstallment) || numericInstallment <= 0) return setError('Installment number must be greater than zero.');
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError('Disbursement amount must be greater than zero.');
    if (numericAmount > remaining) return setError(`Disbursement amount exceeds the remaining approved amount of ${money(remaining)}.`);
    if (!transactionReference.trim()) return setError('Transaction reference is mandatory.');

    await onSubmit({
      applicationId: Number(applicationId),
      installmentNumber: numericInstallment,
      amount: numericAmount,
      status,
      transactionReference: transactionReference.trim(),
      remarks: remarks.trim() || null,
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-card-header"><div><span className="eyebrow">FINANCE ACTION</span><h2>New Disbursement Installment</h2><p>Create an installment only against an APPROVED application.</p></div></div>
      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="form-grid">
        <label className="field"><span>Approved Application *</span>
          <select value={applicationId} onChange={handleApplicationChange} required>
            <option value="">Select application</option>
            {approvedApplications.map(({ application, approval }) => <option key={application.id} value={application.id}>Application #{application.id} — Approved {money(approval.approvedAmount)}</option>)}
          </select>
        </label>
        <label className="field"><span>Installment Number *</span><input type="number" min="1" step="1" value={installmentNumber} onChange={(e) => setInstallmentNumber(e.target.value)} required /></label>
        <label className="field"><span>Disbursement Amount *</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /><small>Maximum allowed now: {money(remaining)}</small></label>
        <label className="field"><span>Status *</span><select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field"><span>Transaction Reference *</span><input value={transactionReference} onChange={(e) => setTransactionReference(e.target.value)} maxLength={255} required /></label>
        <label className="field field-full"><span>Remarks</span><textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} /></label>
      </div>

      {selected && <div className={`money-consistency-card ${exceeds ? 'money-consistency-error' : ''}`}>
        <div><span>Approved amount</span><strong>{money(approvedAmount)}</strong></div>
        <div><span>Previously disbursed</span><strong>{money(alreadyDisbursed)}</strong></div>
        <div><span>Current installment</span><strong>{money(enteredAmount)}</strong></div>
        <div><span>Total after installment</span><strong>{money(projectedTotal)}</strong></div>
        <div><span>Remaining after installment</span><strong>{money(Math.max(approvedAmount - projectedTotal, 0))}</strong></div>
        <p>{exceeds ? `This installment would exceed the approved amount by ${money(projectedTotal - approvedAmount)}.` : `Money check passed: total disbursement will remain within the approved amount. Next installment suggested: #${nextInstallment}.`}</p>
      </div>}

      <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="btn-primary" disabled={submitting || exceeds}>{submitting ? 'Saving…' : 'Create Disbursement'}</button></div>
    </form>
  );
}
