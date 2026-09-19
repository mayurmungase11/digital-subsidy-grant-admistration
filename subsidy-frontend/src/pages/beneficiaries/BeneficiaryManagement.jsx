import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  createBeneficiary,
  deleteBeneficiary,
  getAllBeneficiaries,
  updateBeneficiary,
} from '../../api/beneficiaryApi.js';
import BeneficiaryForm from '../../components/beneficiaries/BeneficiaryForm.jsx';
import BeneficiaryTable from '../../components/beneficiaries/BeneficiaryTable.jsx';

const MANAGEMENT_ROLES = new Set(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER']);

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string') return data.error;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to access beneficiary records.';
  if (error?.response?.status === 404) return 'The requested beneficiary was not found.';
  if (error?.response?.status === 409) return 'The beneficiary could not be saved because the data conflicts with an existing record.';
  if (error?.response?.status === 400) return 'Please check the beneficiary details and try again.';
  return fallback;
}

export default function BeneficiaryManagement() {
  const { role } = useAuth();
  const canManage = MANAGEMENT_ROLES.has(role);

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadBeneficiaries = useCallback(async () => {
    setLoading(true);
    setPageError('');
    try {
      const response = await getAllBeneficiaries();
      setBeneficiaries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load beneficiaries.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBeneficiaries();
  }, [loadBeneficiaries]);

  const filteredBeneficiaries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return beneficiaries;

    return beneficiaries.filter((beneficiary) =>
      [
        beneficiary.id,
        beneficiary.name,
        beneficiary.email,
        beneficiary.phone,
        beneficiary.age,
        beneficiary.annualIncome,
        beneficiary.address,
        beneficiary.identityNumber,
        beneficiary.bankAccountNumber,
        beneficiary.ifscCode,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [beneficiaries, search]);

  const openCreate = () => {
    setEditingBeneficiary(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEdit = (beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!submitting) {
      setFormOpen(false);
      setEditingBeneficiary(null);
    }
  };

  const handleSubmit = async (request) => {
    setSubmitting(true);
    setActionMessage('');
    setPageError('');

    try {
      if (editingBeneficiary) {
        await updateBeneficiary(editingBeneficiary.id, request);
        setActionMessage(`Beneficiary #${editingBeneficiary.id} updated successfully.`);
      } else {
        await createBeneficiary(request);
        setActionMessage('Beneficiary created successfully.');
      }
      setFormOpen(false);
      setEditingBeneficiary(null);
      await loadBeneficiaries();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingBeneficiary ? 'Unable to update beneficiary.' : 'Unable to create beneficiary.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (beneficiary) => {
    const confirmed = window.confirm(
      `Delete beneficiary "${beneficiary.name}" (#${beneficiary.id})? This action cannot be undone from the frontend.`
    );
    if (!confirmed) return;

    setDeletingId(beneficiary.id);
    setActionMessage('');
    setPageError('');

    try {
      await deleteBeneficiary(beneficiary.id);
      setBeneficiaries((current) => current.filter((item) => item.id !== beneficiary.id));
      setActionMessage(`Beneficiary #${beneficiary.id} deleted successfully.`);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to delete beneficiary.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">BENEFICIARY MANAGEMENT</span>
          <h1>Beneficiaries</h1>
          <p>{canManage ? 'View and manage beneficiary profiles and beneficiary login accounts used by the subsidy workflow.' : 'View beneficiary records available to your role.'}</p>
        </div>

        {canManage && !formOpen && (
          <button type="button" className="btn-primary header-action-button" onClick={openCreate}>
            + Add Beneficiary
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

      {canManage && formOpen && (
        <BeneficiaryForm
          beneficiary={editingBeneficiary}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      <section className="beneficiary-list-card">
        <div className="section-heading beneficiary-list-heading">
          <div>
            <h2>Beneficiary Records</h2>
            <p>{beneficiaries.length} {beneficiaries.length === 1 ? 'beneficiary' : 'beneficiaries'} found</p>
          </div>

          <div className="scheme-search">
            <label htmlFor="beneficiary-search">Search beneficiaries</label>
            <input
              id="beneficiary-search"
              type="search"
              placeholder="Search name, email, phone, ID…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading beneficiaries...</div>
        ) : (
          <BeneficiaryTable
            beneficiaries={filteredBeneficiaries}
            canManage={canManage}
            deletingId={deletingId}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <p className="workflow-note">
        <strong>Security:</strong> beneficiary management visibility follows the backend authorization model. Sensitive identity and bank-account values are masked in the table for safer day-to-day viewing.
      </p>
    </div>
  );
}
