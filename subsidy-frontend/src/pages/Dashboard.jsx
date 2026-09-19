import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getRoleConfig } from '../config/navigation.js';
import { getAllSchemes } from '../api/schemeApi.js';
import { getMyApplications, getAllApplications } from '../api/applicationApi.js';
import { getAllBeneficiaries } from '../api/beneficiaryApi.js';
import { getAllVerifications } from '../api/verificationApi.js';
import { getAllApprovals } from '../api/approvalApi.js';
import { getAllDisbursements } from '../api/disbursementApi.js';
import { getAllUsers } from '../api/userApi.js';

const ROLE_HOME = {
  ADMIN: '/admin',
  FIELD_OFFICER: '/field-officer',
  DISTRICT_OFFICER: '/district-officer',
  FINANCE_OFFICER: '/finance-officer',
};

function safeArray(result) {
  return result?.status === 'fulfilled' && Array.isArray(result.value?.data) ? result.value.data : [];
}

function countStatus(items, status) {
  return items.filter((item) => item.status === status).length;
}

function sum(items, field) {
  return items.reduce((total, item) => total + (Number(item?.[field]) || 0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

function statusMeta(status) {
  const map = {
    SUBMITTED: { label: 'Submitted', tone: 'submitted', icon: '01' },
    UNDER_VERIFICATION: { label: 'Under verification', tone: 'pending', icon: '02' },
    VERIFIED: { label: 'Verified', tone: 'verified', icon: '03' },
    APPROVED: { label: 'Approved', tone: 'approved', icon: '04' },
    REJECTED: { label: 'Rejected', tone: 'rejected', icon: '!' },
  };
  return map[status] || { label: status || 'Unknown', tone: 'neutral', icon: '•' };
}

function StatusBadge({ status }) {
  const meta = statusMeta(status);
  return <span className={`dashboard-status ${meta.tone}`}><span aria-hidden="true">{meta.icon}</span>{meta.label}</span>;
}

function StatCard({ label, value, hint, tone = 'blue', icon }) {
  return (
    <article className={`ops-stat-card ${tone}`}>
      <div className="ops-stat-top"><span className="ops-stat-icon" aria-hidden="true">{icon}</span><span className="ops-stat-label">{label}</span></div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

function LoadingPanel({ label = 'Loading live operational data…' }) {
  return <div className="dashboard-loading"><span className="loading-spinner" aria-hidden="true" />{label}</div>;
}

export default function Dashboard() {
  const { email, role } = useAuth();
  const navigate = useNavigate();
  const roleConfig = getRoleConfig(role);
  const [data, setData] = useState({
    schemes: [], applications: [], beneficiaries: [], verifications: [], approvals: [], disbursements: [], users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    let requests;
    if (role === 'BENEFICIARY') {
      requests = { schemes: getAllSchemes(), applications: getMyApplications() };
    } else {
      requests = {
        schemes: getAllSchemes(),
        applications: getAllApplications(),
        ...(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER' ? {
          beneficiaries: getAllBeneficiaries(),
          verifications: getAllVerifications(),
        } : {}),
        ...(role === 'ADMIN' || role === 'DISTRICT_OFFICER' || role === 'FINANCE_OFFICER' ? { approvals: getAllApprovals() } : {}),
        ...(role === 'ADMIN' || role === 'FINANCE_OFFICER' ? { disbursements: getAllDisbursements() } : {}),
        ...(role === 'ADMIN' ? { users: getAllUsers() } : {}),
      };
    }

    const entries = Object.entries(requests);
    const results = await Promise.allSettled(entries.map(([, promise]) => promise));
    const nextData = { schemes: [], applications: [], beneficiaries: [], verifications: [], approvals: [], disbursements: [], users: [] };
    const failed = [];

    entries.forEach(([key], index) => {
      const result = results[index];
      nextData[key] = safeArray(result);
      if (result.status === 'rejected') failed.push(key);
    });

    setData(nextData);
    if (failed.length) {
      setError('Some live dashboard data could not be loaded. The available records are still shown.');
    }
    setLoading(false);
  }, [role]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const activeSchemes = useMemo(() => data.schemes.filter((item) => item.active), [data.schemes]);
  const applications = data.applications;
  const submitted = countStatus(applications, 'SUBMITTED');
  const underVerification = countStatus(applications, 'UNDER_VERIFICATION');
  const verified = countStatus(applications, 'VERIFIED');
  const approved = countStatus(applications, 'APPROVED');
  const rejected = countStatus(applications, 'REJECTED');
  const requestedAmount = sum(applications, 'requestedAmount');
  const hasApprovalData = role === 'ADMIN' || role === 'DISTRICT_OFFICER' || role === 'FINANCE_OFFICER';
  const hasDisbursementData = role === 'ADMIN' || role === 'FINANCE_OFFICER';
  const approvedAmount = hasApprovalData ? sum(data.approvals.filter((item) => item.status === 'APPROVED'), 'approvedAmount') : null;
  const totalDisbursed = hasDisbursementData ? sum(data.disbursements, 'amount') : null;
  const remainingAmount = hasApprovalData && hasDisbursementData ? Math.max(approvedAmount - totalDisbursed, 0) : null;

  const approvalMap = useMemo(() => new Map(data.approvals.map((item) => [item.applicationId, item])), [data.approvals]);
  const disbursedByApplication = useMemo(() => {
    const map = new Map();
    data.disbursements.forEach((item) => map.set(item.applicationId, (map.get(item.applicationId) || 0) + (Number(item.amount) || 0)));
    return map;
  }, [data.disbursements]);

  const pendingApproval = applications.filter((item) => item.status === 'VERIFIED' && !approvalMap.has(item.id)).length;
  const pendingDisbursement = data.approvals.filter((item) => item.status === 'APPROVED' && (disbursedByApplication.get(item.applicationId) || 0) < (Number(item.approvedAmount) || 0)).length;

  if (role === 'BENEFICIARY') {
    return (
      <div className="beneficiary-dashboard">
        <section className="citizen-hero">
          <div className="hero-copy">
            <p className="eyebrow">CITIZEN SERVICES</p>
            <h1>Welcome back, <span>{email?.split('@')[0] || 'Beneficiary'}</span></h1>
            <p>Discover eligible subsidy schemes, submit applications and follow every stage through one transparent digital service.</p>
            <div className="hero-actions">
              <button type="button" className="hero-primary" onClick={() => navigate('/beneficiary/schemes')}>Explore schemes <span>→</span></button>
              <button type="button" className="hero-secondary" onClick={() => navigate('/beneficiary/applications')}>View my applications</button>
            </div>
          </div>
          <div className="hero-emblem" aria-hidden="true"><div className="hero-emblem-ring">DS</div><span>Citizen<br />First</span></div>
        </section>

        {error && <div className="form-error dashboard-notice" role="alert">{error}</div>}

        <section className="dashboard-section-heading">
          <div><p className="eyebrow">LIVE ACCOUNT SUMMARY</p><h2>Your service overview</h2></div>
          <button type="button" className="refresh-link" onClick={loadDashboard} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh data ↻'}</button>
        </section>

        <section className="beneficiary-stat-grid" aria-label="Application summary">
          <StatCard label="Active schemes" value={loading ? '—' : activeSchemes.length} hint="Currently available to explore" tone="blue" icon="S" />
          <StatCard label="My applications" value={loading ? '—' : applications.length} hint="Applications submitted" tone="amber" icon="A" />
          <StatCard label="Under verification" value={loading ? '—' : underVerification} hint="Field-level review in progress" tone="orange" icon="V" />
          <StatCard label="Approved" value={loading ? '—' : approved} hint="Positive decisions" tone="green" icon="✓" />
        </section>

        <section className="dashboard-two-column">
          <div className="dashboard-panel service-panel">
            <div className="panel-heading"><div><p className="eyebrow">APPLICATION JOURNEY</p><h2>Progress across your applications</h2></div><span>{formatNumber(applications.length)} total</span></div>
            <div className="journey-grid">
              {[['01', 'Submitted', submitted, 'Applications received', 'journey-blue'], ['02', 'Under verification', underVerification, 'Field review in progress', 'journey-amber'], ['03', 'Verified', verified, 'Ready for approval', 'journey-green'], ['04', 'Approved', approved, 'Approved applications', 'journey-green'], ['05', 'Rejected', rejected, 'Not approved', 'journey-red']].map(([number, label, count, text, tone]) => (
                <div className="journey-item" key={label}><span className="journey-number">{number}</span><div><strong>{label}</strong><small>{text}</small></div><b className={tone}>{count}</b></div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel assistance-panel">
            <div className="panel-heading"><div><p className="eyebrow">CITIZEN ASSISTANCE</p><h2>Keep your application ready</h2></div><span className="help-icon">?</span></div>
            <p>Keep your profile and bank information current. Application status is controlled by the official workflow.</p>
            <div className="assistance-points"><span>✓</span><div><strong>Keep information current</strong><small>Accurate profile details help avoid processing delays.</small></div></div>
            <div className="assistance-points"><span>✓</span><div><strong>Track every stage</strong><small>Submitted, verification and approval progress stays visible.</small></div></div>
            <button type="button" className="panel-link" onClick={() => navigate('/beneficiary/profile')}>Review my profile →</button>
          </div>
        </section>

        <section className="dashboard-panel schemes-preview">
          <div className="panel-heading"><div><p className="eyebrow">AVAILABLE SERVICES</p><h2>Active subsidy schemes</h2><small>Only active schemes are shown here.</small></div><button type="button" className="panel-link" onClick={() => navigate('/beneficiary/schemes')}>View all schemes →</button></div>
          {loading ? <LoadingPanel label="Loading active schemes…" /> : <div className="scheme-preview-grid">
            {activeSchemes.slice(0, 3).map((scheme) => (
              <button type="button" className="scheme-preview-card" key={scheme.id} onClick={() => navigate(`/beneficiary/applications?schemeId=${scheme.id}`)}>
                <span className="scheme-preview-code">{scheme.code}</span><strong>{scheme.name}</strong><span>Maximum support {formatCurrency(scheme.maximumAmount)}</span><b>Apply now →</b>
              </button>
            ))}
            {activeSchemes.length === 0 && <div className="empty-state compact"><strong>No active schemes available</strong><span>Published schemes will appear here when available.</span></div>}
          </div>}
        </section>

        <section className="dashboard-panel applications-preview">
          <div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>My applications</h2><small>Your latest application records and current status.</small></div><button type="button" className="panel-link" onClick={() => navigate('/beneficiary/applications')}>Open applications →</button></div>
          {loading ? <LoadingPanel label="Loading your applications…" /> : applications.length === 0 ? (
            <div className="empty-state compact"><strong>No applications yet</strong><span>Explore active schemes to submit your first application.</span></div>
          ) : (
            <div className="dashboard-table-wrapper"><table className="dashboard-table"><thead><tr><th>Application</th><th>Scheme</th><th>Requested amount</th><th>Status</th></tr></thead><tbody>
              {[...applications].reverse().slice(0, 5).map((application) => <tr key={application.id}><td><strong>APP-{String(application.id).padStart(4, '0')}</strong></td><td>Scheme #{application.schemeId}</td><td>{formatCurrency(application.requestedAmount)}</td><td><StatusBadge status={application.status} /></td></tr>)}
            </tbody></table></div>
          )}
        </section>

        <section className="citizen-message"><div className="message-mark">✓</div><div><strong>Transparent services. Empowered citizens.</strong><p>Your application data is presented directly from the connected government workflow.</p></div></section>
      </div>
    );
  }

  const labels = {
    ADMIN: ['Administration', 'Monitor schemes, beneficiaries, workflow stages and financial activity across the platform.'],
    FIELD_OFFICER: ['Field operations', 'Review applications that require field verification and maintain beneficiary service information.'],
    DISTRICT_OFFICER: ['District operations', 'Review verified applications and manage district-level approval decisions.'],
    FINANCE_OFFICER: ['Finance operations', 'Work with approved applications and controlled staged disbursement records.'],
  };
  const [title, description] = labels[role] || ['Operations', 'Manage government subsidy and grant services.'];
  const homePath = ROLE_HOME[role] || '/';
  const primaryAction = role === 'FIELD_OFFICER' ? 'verifications' : role === 'DISTRICT_OFFICER' ? 'approvals' : role === 'FINANCE_OFFICER' ? 'disbursements' : 'applications';
  const primaryLabel = role === 'FIELD_OFFICER' ? 'Open verification queue' : role === 'DISTRICT_OFFICER' ? 'Open approval queue' : role === 'FINANCE_OFFICER' ? 'Open disbursement desk' : 'Open application operations';

  return (
    <div className="staff-dashboard">
      <section className="staff-hero">
        <div><p className="eyebrow">DIGITAL SUBSIDY &amp; GRANT ADMINISTRATION</p><h1>{title} dashboard</h1><p>{description}</p><div className="staff-hero-meta"><span><i /> Live backend data</span><span>{roleConfig?.label}</span></div></div>
        <div className="staff-hero-mark" aria-hidden="true">DS</div>
      </section>

      {error && <div className="form-error dashboard-notice" role="alert">{error}</div>}

      <section className="dashboard-section-heading ops-heading"><div><p className="eyebrow">OPERATIONAL SNAPSHOT</p><h2>Current platform activity</h2></div><button type="button" className="refresh-link" onClick={loadDashboard} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh data ↻'}</button></section>

      {loading ? <LoadingPanel /> : <>
        <section className="ops-stat-grid">
          <StatCard label="Active schemes" value={formatNumber(activeSchemes.length)} hint="Published and active" tone="blue" icon="S" />
          <StatCard label="Applications" value={formatNumber(applications.length)} hint={`${formatNumber(submitted)} submitted`} tone="amber" icon="A" />
          <StatCard label="Under verification" value={formatNumber(underVerification)} hint="Field review stage" tone="orange" icon="V" />
          <StatCard label="Approved" value={formatNumber(approved)} hint="Approved applications" tone="green" icon="✓" />
          {(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER') && <StatCard label="Beneficiaries" value={formatNumber(data.beneficiaries.length)} hint="Registered profiles" tone="violet" icon="B" />}
          {(role === 'ADMIN' || role === 'DISTRICT_OFFICER') && <StatCard label="Pending approvals" value={formatNumber(pendingApproval)} hint="Verified applications" tone="rose" icon="P" />}
          {(role === 'ADMIN' || role === 'FINANCE_OFFICER') && <StatCard label="Pending disbursement" value={formatNumber(pendingDisbursement)} hint="Approved applications" tone="teal" icon="₹" />}
          {role === 'ADMIN' && <StatCard label="Staff accounts" value={formatNumber(data.users.length)} hint="Configured user accounts" tone="slate" icon="U" />}
        </section>

        <section className="ops-grid-two">
          <div className="dashboard-panel workflow-panel">
            <div className="panel-heading"><div><p className="eyebrow">WORKFLOW PIPELINE</p><h2>Application lifecycle</h2><small>Live counts from application records.</small></div></div>
            <div className="workflow-pipeline">
              {[['Submitted', submitted, 'submitted'], ['Verification', underVerification, 'pending'], ['Verified', verified, 'verified'], ['Approved', approved, 'approved'], ['Rejected', rejected, 'rejected']].map(([label, count, tone], index) => <div className="workflow-stage" key={label}><span className={`workflow-stage-number ${tone}`}>{String(index + 1).padStart(2, '0')}</span><div><strong>{label}</strong><small>{formatNumber(count)} record{count === 1 ? '' : 's'}</small></div></div>)}
            </div>
          </div>

          <div className="dashboard-panel financial-panel">
            <div className="panel-heading"><div><p className="eyebrow">FINANCIAL VIEW</p><h2>Funding position</h2><small>Calculated from approval and disbursement records available to your role.</small></div></div>
            <div className="financial-list">
              <div><span>Requested amount</span><strong>{formatCurrency(requestedAmount)}</strong></div>
              <div><span>Approved amount</span><strong>{approvedAmount === null ? 'Not available for this role' : formatCurrency(approvedAmount)}</strong></div>
              <div><span>Total disbursed</span><strong>{totalDisbursed === null ? 'Not available for this role' : formatCurrency(totalDisbursed)}</strong></div>
              <div className="financial-remaining"><span>Remaining approved amount</span><strong>{remainingAmount === null ? 'Not available for this role' : formatCurrency(remainingAmount)}</strong></div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel operational-actions">
          <div className="panel-heading"><div><p className="eyebrow">NEXT ACTION</p><h2>Role-focused operations</h2><small>Open the queue relevant to your responsibility.</small></div></div>
          <div className="staff-actions"><button type="button" className="btn-primary" onClick={() => navigate(`${homePath}/${primaryAction}`)}>{primaryLabel} →</button><button type="button" className="btn-secondary" onClick={() => navigate(`${homePath}/applications`)}>View applications</button><button type="button" className="btn-secondary" onClick={() => navigate(`${homePath}/schemes`)}>View schemes</button></div>
        </section>

        <section className="dashboard-panel applications-preview">
          <div className="panel-heading"><div><p className="eyebrow">RECENT OPERATIONS</p><h2>Latest applications</h2><small>Records returned by the application service.</small></div><button type="button" className="panel-link" onClick={() => navigate(`${homePath}/applications`)}>Open application queue →</button></div>
          {applications.length === 0 ? <div className="empty-state compact"><strong>No application records</strong><span>No application data is currently available for this account.</span></div> : <div className="dashboard-table-wrapper"><table className="dashboard-table"><thead><tr><th>Application</th><th>Beneficiary</th><th>Scheme</th><th>Requested</th><th>Status</th></tr></thead><tbody>
            {[...applications].reverse().slice(0, 6).map((application) => <tr key={application.id}><td><strong>APP-{String(application.id).padStart(4, '0')}</strong></td><td>#{application.beneficiaryId}</td><td>#{application.schemeId}</td><td>{formatCurrency(application.requestedAmount)}</td><td><StatusBadge status={application.status} /></td></tr>)}
          </tbody></table></div>}
        </section>
      </>}
    </div>
  );
}
