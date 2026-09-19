import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { createApplication, createMyApplication, getAllApplications, getMyApplications } from '../../api/applicationApi.js';
import { evaluateApplication } from '../../api/eligibilityApi.js';
import { getAllSchemes } from '../../api/schemeApi.js';
import ApplicationForm from '../../components/applications/ApplicationForm.jsx';
import ApplicationTable from '../../components/applications/ApplicationTable.jsx';

const STAFF_CREATE_ROLES = new Set(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER']);
const EVALUATION_ROLES = new Set(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER']);

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string') return data.error;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to perform this action.';
  if (error?.response?.status === 404) return 'The requested application or related resource was not found.';
  if (error?.response?.status === 409) return 'The application could not be saved because it conflicts with existing data.';
  if (error?.response?.status === 400) return 'Please check the application details and try again.';
  return fallback;
}

function resultMessage(result) {
  if (!result) return '';
  return `${result.message}. Score: ${result.score}/${result.threshold}.`;
}

export default function ApplicationManagement() {
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBeneficiary = role === 'BENEFICIARY';
  const canCreateStaff = STAFF_CREATE_ROLES.has(role);
  const canEvaluate = EVALUATION_ROLES.has(role);

  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const initialSchemeId = isBeneficiary ? searchParams.get('schemeId') || '' : '';

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError('');

    try {
      const [applicationResponse, schemeResponse] = await Promise.all([
        isBeneficiary ? getMyApplications() : getAllApplications(),
        getAllSchemes(),
      ]);

      setApplications(Array.isArray(applicationResponse.data) ? applicationResponse.data : []);
      setSchemes(Array.isArray(schemeResponse.data) ? schemeResponse.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load applications.'));
    } finally {
      setLoading(false);
    }
  }, [isBeneficiary]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isBeneficiary && initialSchemeId) {
      setFormOpen(true);
    }
  }, [isBeneficiary, initialSchemeId]);

  const schemeMap = useMemo(
    () => new Map(schemes.map((scheme) => [scheme.id, scheme])),
    [schemes]
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;

    return applications.filter((application) => {
      const scheme = schemeMap.get(application.schemeId);
      return [
        application.id,
        application.beneficiaryId,
        application.schemeId,
        application.status,
        scheme?.code,
        scheme?.name,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [applications, schemeMap, search]);

  const openCreate = () => {
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (submitting) return;
    setFormOpen(false);
    if (isBeneficiary && searchParams.has('schemeId')) setSearchParams({}, { replace: true });
  };

  const handleCreate = async (request) => {
    setSubmitting(true);
    setActionMessage('');
    setPageError('');

    try {
      if (isBeneficiary) {
        await createMyApplication(request);
      } else {
        await createApplication(request);
      }
      setFormOpen(false);
      if (isBeneficiary && searchParams.has('schemeId')) setSearchParams({}, { replace: true });
      setActionMessage('Application submitted successfully. It is now in SUBMITTED status and must pass the backend eligibility evaluation before verification.');
      await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEvaluate = async (application) => {
    setEvaluatingId(application.id);
    setActionMessage('');
    setPageError('');
    setEligibilityResult(null);

    try {
      const response = await evaluateApplication(application.id);
      const result = response.data;
      setEligibilityResult({ ...result, applicationId: application.id });
      setActionMessage(`Eligibility evaluation completed for application #${application.id}. ${resultMessage(result)}`);
      await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to evaluate application eligibility.'));
    } finally {
      setEvaluatingId(null);
    }
  };

  const visibleCreate = canCreateStaff || isBeneficiary;
  const headingText = isBeneficiary
    ? 'Submit and track your subsidy applications.'
    : 'Review submitted applications and move eligible applications into the verification workflow.';

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">APPLICATION MANAGEMENT</span>
          <h1>{isBeneficiary ? 'My Applications' : 'Applications'}</h1>
          <p>{headingText}</p>
        </div>

        {visibleCreate && !formOpen && (
          <button type="button" className="btn-primary header-action-button" onClick={openCreate}>
            + {isBeneficiary ? 'New Application' : 'Create Application'}
          </button>
        )}
      </div>

      {actionMessage && <div className="success-banner">{actionMessage}</div>}
      {pageError && (
        <div className="form-error module-error" role="alert">
          {pageError}
          <button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">×</button>
        </div>
      )}

      {eligibilityResult && canEvaluate && (
        <section className={`eligibility-result-card ${eligibilityResult.eligible ? 'eligible' : 'not-eligible'}`}>
          <div>
            <span className="eyebrow">ELIGIBILITY RESULT</span>
            <h2>Application #{eligibilityResult.applicationId}</h2>
            <p>{eligibilityResult.message}</p>
          </div>
          <div className="eligibility-score">
            <strong>{eligibilityResult.score}</strong>
            <span>Threshold {eligibilityResult.threshold}</span>
          </div>
        </section>
      )}

      {visibleCreate && formOpen && (
        <ApplicationForm
          mode={isBeneficiary ? 'beneficiary' : 'staff'}
          schemes={schemes.filter((scheme) => scheme.active)}
          initialSchemeId={initialSchemeId}
          onSubmit={handleCreate}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      <section className="application-list-card">
        <div className="section-heading application-list-heading">
          <div>
            <h2>{isBeneficiary ? 'Application History' : 'Application Queue'}</h2>
            <p>{applications.length} application{applications.length === 1 ? '' : 's'} found</p>
          </div>

          <div className="scheme-search">
            <label htmlFor="application-search">Search applications</label>
            <input
              id="application-search"
              type="search"
              placeholder="Search ID, status, scheme…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading applications...</div>
        ) : (
          <ApplicationTable
            applications={filteredApplications}
            role={role}
            schemeMap={schemeMap}
            evaluatingId={evaluatingId}
            onEvaluate={handleEvaluate}
          />
        )}
      </section>

      {canEvaluate && (
        <p className="workflow-note">
          <strong>Workflow:</strong> SUBMITTED → eligibility evaluation → UNDER VERIFICATION or REJECTED. Verification actions are intentionally handled in the Verification phase and are not exposed here.
        </p>
      )}
    </div>
  );
}
