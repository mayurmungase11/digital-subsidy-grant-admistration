import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAllApplications } from '../../api/applicationApi.js';
import { getAllApprovals } from '../../api/approvalApi.js';
import { createDisbursement, deleteDisbursement, getAllDisbursements } from '../../api/disbursementApi.js';
import DisbursementForm from '../../components/disbursements/DisbursementForm.jsx';
import DisbursementTable from '../../components/disbursements/DisbursementTable.jsx';

const ROLES = new Set(['ADMIN', 'FINANCE_OFFICER']);
function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string' && data.error !== 'INTERNAL_SERVER_ERROR') return data.error;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to perform this action.';
  if (error?.response?.status === 404) return 'The application, approval, or disbursement record was not found.';
  if (error?.response?.status === 409) return 'The transaction reference already exists or violates a database constraint.';
  if (error?.response?.status === 400) return 'Please check the disbursement details and try again.';
  return fallback;
}

export default function DisbursementManagement() {
  const { role } = useAuth();
  const canManage = ROLES.has(role);
  const [disbursements, setDisbursements] = useState([]); const [applications, setApplications] = useState([]); const [approvals, setApprovals] = useState([]); const [loading, setLoading] = useState(true); const [pageError, setPageError] = useState(''); const [actionMessage, setActionMessage] = useState(''); const [search, setSearch] = useState(''); const [formOpen, setFormOpen] = useState(false); const [submitting, setSubmitting] = useState(false); const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => { setLoading(true); setPageError(''); try { const [d, a, ap] = await Promise.all([getAllDisbursements(), getAllApplications(), getAllApprovals()]); setDisbursements(Array.isArray(d.data) ? d.data : []); setApplications(Array.isArray(a.data) ? a.data : []); setApprovals(Array.isArray(ap.data) ? ap.data : []); } catch (error) { setPageError(getApiErrorMessage(error, 'Unable to load disbursement data.')); } finally { setLoading(false); } }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const approvedApplications = useMemo(() => { const map = new Map(approvals.map((a) => [Number(a.applicationId), a])); return applications.filter((a) => map.get(Number(a.id))?.status === 'APPROVED'); }, [applications, approvals]);
  const totals = useMemo(() => approvedApplications.reduce((acc, app) => { const approval = approvals.find((a) => Number(a.applicationId) === Number(app.id)); const approved = Number(approval?.approvedAmount || 0); const paid = disbursements.filter((d) => Number(d.applicationId) === Number(app.id)).reduce((s, d) => s + Number(d.amount || 0), 0); acc.approved += approved; acc.paid += paid; return acc; }, { approved: 0, paid: 0 }), [approvedApplications, approvals, disbursements]);
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return disbursements; return disbursements.filter((d) => [d.id, d.applicationId, d.installmentNumber, d.amount, d.disbursementDate, d.status, d.transactionReference, d.remarks].filter((x) => x !== null && x !== undefined).some((x) => String(x).toLowerCase().includes(q))); }, [disbursements, search]);

  const handleCreate = async (request) => { setSubmitting(true); setPageError(''); setActionMessage(''); try { await createDisbursement(request); setFormOpen(false); setActionMessage(`Installment #${request.installmentNumber} created successfully for application #${request.applicationId}.`); await loadData(); } catch (error) { setPageError(getApiErrorMessage(error, 'Unable to create the disbursement installment.')); } finally { setSubmitting(false); } };
  const handleDelete = async (d) => { if (!window.confirm(`Delete disbursement #${d.id}? This removes the installment record and changes the total disbursed amount for application #${d.applicationId}.`)) return; setDeletingId(d.id); setPageError(''); setActionMessage(''); try { await deleteDisbursement(d.id); setActionMessage(`Disbursement #${d.id} deleted successfully.`); await loadData(); } catch (error) { setPageError(getApiErrorMessage(error, 'Unable to delete the disbursement.')); } finally { setDeletingId(null); } };

  return <div className="module-page"><div className="module-page-header"><div><span className="eyebrow">DISBURSEMENT MANAGEMENT</span><h1>Disbursement</h1><p>Manage approved subsidy payments as controlled installments.</p></div>{canManage && !formOpen && <button type="button" className="btn-primary header-action-button" onClick={() => { setActionMessage(''); setPageError(''); setFormOpen(true); }}>+ New Installment</button>}</div>
    {actionMessage && <div className="success-banner">{actionMessage}</div>}{pageError && <div className="form-error module-error" role="alert">{pageError}<button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">×</button></div>}
    <section className="money-summary-grid"><div className="money-summary-card"><span>Approved Amount</span><strong>₹{totals.approved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div><div className="money-summary-card"><span>Total Disbursed</span><strong>₹{totals.paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div><div className="money-summary-card"><span>Remaining Approved</span><strong>₹{Math.max(totals.approved - totals.paid, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div><div className="money-summary-card"><span>Approved Applications</span><strong>{approvedApplications.length}</strong></div></section>
    {formOpen && <DisbursementForm applications={applications} approvals={approvals} disbursements={disbursements} onSubmit={handleCreate} onCancel={() => !submitting && setFormOpen(false)} submitting={submitting} />}
    <section className="verification-list-card"><div className="section-heading verification-list-heading"><div><h2>Installment Records</h2><p>{disbursements.length} record{disbursements.length === 1 ? '' : 's'} found</p></div><div className="scheme-search"><label htmlFor="disbursement-search">Search disbursements</label><input id="disbursement-search" type="search" placeholder="Search ID, application, transaction…" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>{loading ? <div className="loading-state">Loading disbursement records...</div> : <DisbursementTable disbursements={filtered} onDelete={handleDelete} deletingId={deletingId} />}</section>
    <div className="money-rule-note"><strong>Money consistency:</strong> For a new installment, the frontend calculates all existing disbursement amounts for the selected application, adds the current amount, and blocks submission when the projected total exceeds the backend approval amount. The backend remains the final authority.</div>
  </div>;
}
