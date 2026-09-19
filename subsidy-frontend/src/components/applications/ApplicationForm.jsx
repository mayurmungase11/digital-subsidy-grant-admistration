import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  beneficiaryId: '',
  schemeId: '',
  requestedAmount: '',
};

export default function ApplicationForm({ mode, schemes, initialSchemeId = '', onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...EMPTY_FORM, schemeId: initialSchemeId ? String(initialSchemeId) : '' });
    setErrors({});
  }, [mode, initialSchemeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const next = {};

    if (mode === 'staff' && (!form.beneficiaryId || Number(form.beneficiaryId) <= 0)) {
      next.beneficiaryId = 'Beneficiary ID is required.';
    }
    if (!form.schemeId || Number(form.schemeId) <= 0) {
      next.schemeId = 'Scheme is required.';
    }
    if (form.requestedAmount === '') {
      next.requestedAmount = 'Requested amount is required.';
    } else if (Number(form.requestedAmount) <= 0 || Number.isNaN(Number(form.requestedAmount))) {
      next.requestedAmount = 'Requested amount must be greater than zero.';
    }

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const request = {
      schemeId: Number(form.schemeId),
      requestedAmount: Number(form.requestedAmount),
    };

    if (mode === 'staff') {
      request.beneficiaryId = Number(form.beneficiaryId);
    }

    await onSubmit(request);
  };

  return (
    <section className="application-form-card">
      <div className="section-heading">
        <div>
          <h2>{mode === 'beneficiary' ? 'Submit Application' : 'Create Application'}</h2>
          <p>
            {mode === 'beneficiary'
              ? 'Submit a subsidy application using your beneficiary profile.'
              : 'Create an application using the backend application request fields.'}
          </p>
        </div>
      </div>

      <form className="application-form" onSubmit={handleSubmit} noValidate>
        {mode === 'staff' && (
          <div className="field">
            <label htmlFor="beneficiaryId">Beneficiary ID</label>
            <input
              id="beneficiaryId"
              name="beneficiaryId"
              type="number"
              min="1"
              value={form.beneficiaryId}
              onChange={handleChange}
              placeholder="Enter beneficiary ID"
            />
            {errors.beneficiaryId && <div className="field-error">{errors.beneficiaryId}</div>}
          </div>
        )}

        <div className="field">
          <label htmlFor="applicationSchemeId">Scheme</label>
          <select
            id="applicationSchemeId"
            name="schemeId"
            value={form.schemeId}
            onChange={handleChange}
            disabled={Boolean(initialSchemeId) || submitting}
          >
            <option value="">Select a scheme</option>
            {schemes.map((scheme) => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.name} ({scheme.code})
              </option>
            ))}
          </select>
          {errors.schemeId && <div className="field-error">{errors.schemeId}</div>}
        </div>

        <div className="field">
          <label htmlFor="requestedAmount">Requested amount</label>
          <input
            id="requestedAmount"
            name="requestedAmount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.requestedAmount}
            onChange={handleChange}
            placeholder="Enter requested amount"
          />
          {errors.requestedAmount && <div className="field-error">{errors.requestedAmount}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting || schemes.length === 0}>
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      </form>
    </section>
  );
}
