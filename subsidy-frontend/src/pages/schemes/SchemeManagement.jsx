import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { createScheme, deleteScheme, getAllSchemes, updateScheme } from '../../api/schemeApi.js';
import { createEligibilityCriteria, deleteEligibilityCriteria, getAllEligibilityCriteria, updateEligibilityCriteria } from '../../api/eligibilityCriteriaApi.js';
import SchemeForm from '../../components/schemes/SchemeForm.jsx';
import SchemeTable from '../../components/schemes/SchemeTable.jsx';

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (data?.message) return data.message;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to perform this action.';
  if (error?.response?.status === 404) return 'Scheme not found.';
  if (error?.response?.status === 409) return 'The scheme could not be saved because it conflicts with existing data.';

  return fallback;
}

export default function SchemeManagement() {
  const { role } = useAuth();
  const canManage = role === 'ADMIN';
  const isBeneficiary = role === 'BENEFICIARY';
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editingCriteria, setEditingCriteria] = useState([]);
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadSchemes = useCallback(async () => {
    setLoading(true);
    setPageError('');

    try {
      const response = await getAllSchemes();
      setSchemes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load schemes.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return schemes;

    return schemes.filter((scheme) =>
      [scheme.code, scheme.name]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [schemes, search]);

  const handleApply = (scheme) => {
    if (!scheme?.id || !scheme.active) return;
    navigate(`../applications?schemeId=${scheme.id}`);
  };

  const openCreate = () => {
    setEditingScheme(null);
    setEditingCriteria([]);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEdit = async (scheme) => {
    setEditingScheme(scheme);
    setEditingCriteria([]);
    setCriteriaLoading(true);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
    try {
      const response = await getAllEligibilityCriteria();
      setEditingCriteria((Array.isArray(response.data) ? response.data : []).filter((item) => item.schemeId === scheme.id));
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load eligibility criteria for this scheme.'));
    } finally {
      setCriteriaLoading(false);
    }
  };

  const closeForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditingScheme(null);
  };

  const handleSubmit = async ({ scheme: schemeRequest, criteria }) => {
    setSubmitting(true);
    setActionMessage('');
    setPageError('');

    try {
      if (editingScheme) {
        await updateScheme(editingScheme.id, schemeRequest);

        const existingIds = new Set(editingCriteria.map((item) => item.id));
        const submittedIds = new Set(criteria.filter((item) => item.id).map((item) => item.id));

        await Promise.all(
          criteria.map((item) => {
            const payload = {
              schemeId: editingScheme.id,
              field: item.field,
              operator: item.operator,
              expectedValue: item.expectedValue,
              mandatory: item.mandatory,
              score: item.score,
            };
            return item.id ? updateEligibilityCriteria(item.id, payload) : createEligibilityCriteria(payload);
          })
        );

        await Promise.all(
          [...existingIds].filter((id) => !submittedIds.has(id)).map((id) => deleteEligibilityCriteria(id))
        );

        setActionMessage('Scheme and eligibility criteria updated successfully.');
      } else {
        const response = await createScheme(schemeRequest);
        const schemeId = response?.data?.id;

        if (!schemeId) {
          throw new Error('Scheme was created but the API did not return its id, so eligibility criteria could not be linked safely.');
        }

        try {
          await Promise.all(criteria.map((item) => createEligibilityCriteria({
            schemeId,
            field: item.field,
            operator: item.operator,
            expectedValue: item.expectedValue,
            mandatory: item.mandatory,
            score: item.score,
          })));
        } catch (criteriaError) {
          let rollbackMessage = ' Eligibility criteria could not be created.';
          try {
            await deleteScheme(schemeId);
            rollbackMessage += ' The newly created scheme was rolled back.';
          } catch {
            rollbackMessage += ' Automatic rollback of the newly created scheme failed; please remove that scheme from Scheme Management.';
          }
          const error = new Error(getApiErrorMessage(criteriaError, 'Unable to create eligibility criteria.') + rollbackMessage);
          error.cause = criteriaError;
          throw error;
        }

        setActionMessage('Scheme and eligibility criteria created successfully.');
      }

      setFormOpen(false);
      setEditingScheme(null);
      setEditingCriteria([]);
      await loadSchemes();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingScheme ? 'Unable to update scheme and eligibility criteria.' : 'Unable to create scheme and eligibility criteria.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scheme) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the scheme "${scheme.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(scheme.id);
    setActionMessage('');
    setPageError('');

    try {
      await deleteScheme(scheme.id);
      setSchemes((current) => current.filter((item) => item.id !== scheme.id));
      setActionMessage('Scheme deleted successfully.');
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to delete scheme.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">SCHEME MANAGEMENT</span>
          <h1>Schemes</h1>
          <p>{canManage ? 'Create and manage government subsidy schemes.' : 'View government subsidy schemes available in the system.'}</p>
        </div>

        {canManage && !formOpen && (
          <button type="button" className="btn-primary header-action-button" onClick={openCreate}>
            + Add Scheme
          </button>
        )}
      </div>

      {actionMessage && <div className="success-banner">{actionMessage}</div>}
      {pageError && (
        <div className="form-error module-error" role="alert">
          {pageError}
          <button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {canManage && formOpen && (
        <SchemeForm
          scheme={editingScheme}
          criteria={editingCriteria}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
          criteriaLoading={criteriaLoading}
        />
      )}

      <section className="scheme-list-card">
        <div className="section-heading scheme-list-heading">
          <div>
            <h2>Scheme List</h2>
            <p>{schemes.length} scheme{schemes.length === 1 ? '' : 's'} available</p>
          </div>

          <div className="scheme-search">
            <label htmlFor="scheme-search">Search schemes</label>
            <input
              id="scheme-search"
              type="search"
              placeholder="Search by code or name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading schemes...</div>
        ) : (
          <SchemeTable
            schemes={filteredSchemes}
            canManage={canManage}
            isBeneficiary={isBeneficiary}
            onEdit={openEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            onApply={handleApply}
          />
        )}
      </section>
    </div>
  );
}
