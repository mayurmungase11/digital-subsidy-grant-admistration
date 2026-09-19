import { useEffect, useMemo, useState } from 'react';

const EMPTY_CRITERION = {
  id: null,
  field: 'age',
  operator: '>',
  expectedValue: '',
  mandatory: true,
  score: '30',
};

const EMPTY_FORM = {
  code: '',
  name: '',
  maximumAmount: '',
  active: true,
  criteria: [],
};

const FIELD_OPTIONS = [
  { value: 'age', label: 'Age' },
  { value: 'annualIncome', label: 'Annual Income' },
];

const OPERATOR_OPTIONS = ['>', '>=', '<', '<=', '='];

function toFormValues(scheme, criteria = []) {
  if (!scheme) return EMPTY_FORM;

  return {
    code: scheme.code ?? '',
    name: scheme.name ?? '',
    maximumAmount: scheme.maximumAmount ?? '',
    active: scheme.active ?? true,
    criteria: criteria.map((item) => ({
      id: item.id ?? null,
      field: item.field ?? 'age',
      operator: item.operator ?? '>',
      expectedValue: item.expectedValue ?? '',
      mandatory: item.mandatory ?? true,
      score: item.score ?? '',
    })),
  };
}

export default function SchemeForm({ scheme, criteria, onSubmit, onCancel, submitting, criteriaLoading }) {
  const [form, setForm] = useState(() => toFormValues(scheme, criteria));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormValues(scheme, criteria));
    setErrors({});
  }, [scheme, criteria]);

  const isEdit = Boolean(scheme);

  const totalScore = useMemo(
    () => form.criteria.reduce((sum, item) => sum + (Number(item.score) || 0), 0),
    [form.criteria]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const updateCriterion = (index, name, value) => {
    setForm((current) => ({
      ...current,
      criteria: current.criteria.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: name === 'mandatory' ? value : value } : item
      ),
    }));
    setErrors((current) => ({ ...current, [`criteria.${index}`]: '' }));
  };

  const addCriterion = () => {
    setForm((current) => ({ ...current, criteria: [...current.criteria, { ...EMPTY_CRITERION }] }));
  };

  const removeCriterion = (index) => {
    setForm((current) => ({
      ...current,
      criteria: current.criteria.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.code.trim()) nextErrors.code = 'Scheme code is required.';
    if (!form.name.trim()) nextErrors.name = 'Scheme name is required.';

    if (form.maximumAmount === '') {
      nextErrors.maximumAmount = 'Maximum amount is required.';
    } else if (Number(form.maximumAmount) <= 0 || Number.isNaN(Number(form.maximumAmount))) {
      nextErrors.maximumAmount = 'Maximum amount must be greater than zero.';
    }

    if (form.criteria.length === 0) {
      nextErrors.criteria = 'At least one eligibility criterion is required.';
    }

    form.criteria.forEach((criterion, index) => {
      const key = `criteria.${index}`;
      if (!criterion.field || !criterion.operator || String(criterion.expectedValue).trim() === '') {
        nextErrors[key] = 'Field, operator and expected value are required.';
      } else if (Number.isNaN(Number(criterion.expectedValue))) {
        nextErrors[key] = 'Expected value must be numeric for the supported criteria.';
      }

      if (criterion.score === '' || Number.isNaN(Number(criterion.score)) || Number(criterion.score) < 0) {
        nextErrors[key] = 'Score must be zero or greater.';
      }
    });

    if (form.criteria.length > 0 && totalScore < 50) {
      nextErrors.criteria = 'Total criteria score must be at least 50 so an eligible beneficiary can reach the eligibility threshold.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      scheme: {
        code: form.code.trim(),
        name: form.name.trim(),
        maximumAmount: Number(form.maximumAmount),
        active: form.active,
      },
      criteria: form.criteria.map((criterion) => ({
        id: criterion.id,
        field: criterion.field,
        operator: criterion.operator,
        expectedValue: String(criterion.expectedValue).trim(),
        mandatory: Boolean(criterion.mandatory),
        score: Number(criterion.score),
      })),
    });
  };

  return (
    <section className="scheme-form-card">
      <div className="section-heading">
        <div>
          <h2>{isEdit ? 'Update Scheme' : 'Create Scheme'}</h2>
          <p>{isEdit ? 'Update scheme information and its eligibility criteria.' : 'Create a government subsidy scheme together with its eligibility criteria.'}</p>
        </div>
      </div>

      {criteriaLoading && <div className="info-banner">Loading existing eligibility criteria...</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="scheme-form-grid">
          <div className="field">
            <label htmlFor="scheme-code">Scheme Code</label>
            <input id="scheme-code" name="code" value={form.code} onChange={handleChange} disabled={submitting} autoComplete="off" />
            {errors.code && <div className="field-error">{errors.code}</div>}
          </div>

          <div className="field">
            <label htmlFor="scheme-name">Scheme Name</label>
            <input id="scheme-name" name="name" value={form.name} onChange={handleChange} disabled={submitting} autoComplete="off" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="scheme-amount">Maximum Amount</label>
            <input id="scheme-amount" name="maximumAmount" type="number" min="0" step="0.01" value={form.maximumAmount} onChange={handleChange} disabled={submitting} />
            {errors.maximumAmount && <div className="field-error">{errors.maximumAmount}</div>}
          </div>

          <div className="field scheme-active-field">
            <label htmlFor="scheme-active">Active</label>
            <label className="checkbox-control">
              <input id="scheme-active" name="active" type="checkbox" checked={form.active} onChange={handleChange} disabled={submitting} />
              <span>{form.active ? 'Active' : 'Inactive'}</span>
            </label>
          </div>
        </div>

        <div className="criteria-section">
          <div className="criteria-heading">
            <div>
              <h3>Eligibility Criteria</h3>
              <p>Define the rules used by the eligibility engine. The current engine supports age and annual income.</p>
            </div>
            <button type="button" className="btn-secondary" onClick={addCriterion} disabled={submitting || criteriaLoading}>+ Add Criterion</button>
          </div>

          {errors.criteria && <div className="field-error criteria-total-error">{errors.criteria}</div>}

          {form.criteria.length === 0 ? (
            <div className="criteria-empty">No criteria added. Add at least one criterion before creating the scheme.</div>
          ) : (
            <div className="criteria-list">
              {form.criteria.map((criterion, index) => (
                <div className="criterion-card" key={criterion.id ?? `new-${index}`}>
                  <div className="criterion-header">
                    <strong>Criterion {index + 1}</strong>
                    <button type="button" className="danger-text-button" onClick={() => removeCriterion(index)} disabled={submitting}>Remove</button>
                  </div>

                  <div className="criterion-grid">
                    <div className="field">
                      <label>Field</label>
                      <select value={criterion.field} onChange={(event) => updateCriterion(index, 'field', event.target.value)} disabled={submitting}>
                        {FIELD_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>

                    <div className="field">
                      <label>Operator</label>
                      <select value={criterion.operator} onChange={(event) => updateCriterion(index, 'operator', event.target.value)} disabled={submitting}>
                        {OPERATOR_OPTIONS.map((operator) => <option key={operator} value={operator}>{operator}</option>)}
                      </select>
                    </div>

                    <div className="field">
                      <label>Expected Value</label>
                      <input type="number" value={criterion.expectedValue} onChange={(event) => updateCriterion(index, 'expectedValue', event.target.value)} disabled={submitting} placeholder={criterion.field === 'age' ? '18' : '8000000'} />
                    </div>

                    <div className="field">
                      <label>Score</label>
                      <input type="number" min="0" step="1" value={criterion.score} onChange={(event) => updateCriterion(index, 'score', event.target.value)} disabled={submitting} />
                    </div>
                  </div>

                  <label className="checkbox-control criterion-mandatory">
                    <input type="checkbox" checked={Boolean(criterion.mandatory)} onChange={(event) => updateCriterion(index, 'mandatory', event.target.checked)} disabled={submitting} />
                    <span>Mandatory criterion</span>
                  </label>

                  {errors[`criteria.${index}`] && <div className="field-error">{errors[`criteria.${index}`]}</div>}
                </div>
              ))}
            </div>
          )}

          <div className={`criteria-score ${totalScore >= 50 ? 'criteria-score-valid' : ''}`}>
            Total possible score: <strong>{totalScore}</strong> / required threshold: <strong>50</strong>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary scheme-submit-button" disabled={submitting || criteriaLoading}>
            {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Scheme & Criteria' : 'Create Scheme & Criteria')}
          </button>
        </div>
      </form>
    </section>
  );
}
