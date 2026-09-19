import { useEffect, useState } from 'react';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  age: '',
  annualIncome: '',
  address: '',
  identityNumber: '',
  bankAccountNumber: '',
  ifscCode: '',
};

function toFormValues(beneficiary) {
  if (!beneficiary) return EMPTY_FORM;
  return {
    name: beneficiary.name ?? '',
    email: beneficiary.email ?? '',
    password: '',
    phone: beneficiary.phone ?? '',
    age: beneficiary.age ?? '',
    annualIncome: beneficiary.annualIncome ?? '',
    address: beneficiary.address ?? '',
    identityNumber: beneficiary.identityNumber ?? '',
    bankAccountNumber: beneficiary.bankAccountNumber ?? '',
    ifscCode: beneficiary.ifscCode ?? '',
  };
}

export default function BeneficiaryForm({ beneficiary, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() => toFormValues(beneficiary));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormValues(beneficiary));
    setErrors({});
  }, [beneficiary]);

  const isEdit = Boolean(beneficiary);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'ifscCode' ? value.toUpperCase() : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';

    if (!isEdit && !form.password.trim()) next.password = 'Password is required when creating a beneficiary.';

    if (!MOBILE_REGEX.test(form.phone)) next.phone = 'Enter a valid 10-digit Indian mobile number.';

    if (form.age === '' || Number(form.age) < 18) next.age = 'Age must be 18 or above.';
    if (form.annualIncome === '' || Number(form.annualIncome) < 0) {
      next.annualIncome = 'Annual income must be zero or positive.';
    }

    if (!form.address.trim()) next.address = 'Address is required.';
    if (!form.identityNumber.trim()) next.identityNumber = 'Identity number is required.';
    if (!form.bankAccountNumber.trim()) next.bankAccountNumber = 'Bank account number is required.';
    if (!IFSC_REGEX.test(form.ifscCode)) next.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234).';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      ...(isEdit ? {} : { password: form.password }),
      phone: form.phone.trim(),
      age: Number(form.age),
      annualIncome: Number(form.annualIncome),
      address: form.address.trim(),
      identityNumber: form.identityNumber.trim(),
      bankAccountNumber: form.bankAccountNumber.trim(),
      ifscCode: form.ifscCode.trim().toUpperCase(),
    });
  };

  return (
    <section className="beneficiary-form-card">
      <div className="section-heading">
        <div>
          <h2>{isEdit ? 'Update Beneficiary' : 'Add Beneficiary'}</h2>
          <p>{isEdit ? 'Update the beneficiary profile. Fields omitted by the backend remain unchanged.' : 'Create a beneficiary profile using the backend beneficiary DTO.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="beneficiary-form-grid">
          <div className="field">
            <label htmlFor="beneficiary-name">Full Name</label>
            <input id="beneficiary-name" name="name" value={form.name} onChange={handleChange} disabled={submitting} autoComplete="name" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-email">Email</label>
            <input id="beneficiary-email" name="email" type="email" value={form.email} onChange={handleChange} disabled={submitting} autoComplete="email" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          {!isEdit && (
            <div className="field">
              <label htmlFor="beneficiary-password">Login Password</label>
              <input
                id="beneficiary-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="new-password"
                placeholder="Set initial password"
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
              <div className="field-hint">Used for the beneficiary's initial login. Password cannot be changed from this profile form.</div>
            </div>
          )}

          <div className="field">
            <label htmlFor="beneficiary-phone">Phone</label>
            <input id="beneficiary-phone" name="phone" value={form.phone} onChange={handleChange} disabled={submitting} inputMode="numeric" placeholder="9876543210" />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-age">Age</label>
            <input id="beneficiary-age" name="age" type="number" min="18" value={form.age} onChange={handleChange} disabled={submitting} />
            {errors.age && <div className="field-error">{errors.age}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-income">Annual Income (₹)</label>
            <input id="beneficiary-income" name="annualIncome" type="number" min="0" step="0.01" value={form.annualIncome} onChange={handleChange} disabled={submitting} />
            {errors.annualIncome && <div className="field-error">{errors.annualIncome}</div>}
          </div>

          <div className="field field-span-2">
            <label htmlFor="beneficiary-address">Address</label>
            <textarea id="beneficiary-address" name="address" value={form.address} onChange={handleChange} disabled={submitting} rows="2" />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-identity">Identity Number</label>
            <input id="beneficiary-identity" name="identityNumber" value={form.identityNumber} onChange={handleChange} disabled={submitting} autoComplete="off" />
            {errors.identityNumber && <div className="field-error">{errors.identityNumber}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-bank">Bank Account Number</label>
            <input id="beneficiary-bank" name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleChange} disabled={submitting} inputMode="numeric" autoComplete="off" />
            {errors.bankAccountNumber && <div className="field-error">{errors.bankAccountNumber}</div>}
          </div>

          <div className="field">
            <label htmlFor="beneficiary-ifsc">IFSC Code</label>
            <input id="beneficiary-ifsc" name="ifscCode" value={form.ifscCode} onChange={handleChange} disabled={submitting} autoComplete="off" placeholder="SBIN0001234" />
            {errors.ifscCode && <div className="field-error">{errors.ifscCode}</div>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving…' : isEdit ? 'Update Beneficiary' : 'Add Beneficiary'}</button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
