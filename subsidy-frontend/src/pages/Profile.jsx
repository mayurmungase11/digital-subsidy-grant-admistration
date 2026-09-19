import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyBeneficiary, updateMyBeneficiary } from '../api/beneficiaryApi.js';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  age: '',
  annualIncome: '',
  address: '',
  identityNumber: '',
  bankAccountNumber: '',
  ifscCode: '',
};

function toFormValues(data) {
  return {
    name: data?.name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    age: data?.age ?? '',
    annualIncome: data?.annualIncome ?? '',
    address: data?.address || '',
    identityNumber: data?.identityNumber || '',
    bankAccountNumber: data?.bankAccountNumber || '',
    ifscCode: data?.ifscCode || '',
  };
}

function errorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  return data?.message || data?.error || 'Unable to update your profile. Please try again.';
}

export default function Profile() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await getMyBeneficiary();
        if (mounted) setForm(toFormValues(response.data));
      } catch (err) {
        if (mounted) setError(errorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.age || !form.address.trim() || !form.identityNumber.trim() || !form.bankAccountNumber.trim() || !form.ifscCode.trim()) {
      setError('Please complete all required profile information.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: Number(form.age),
      annualIncome: Number(form.annualIncome || 0),
      address: form.address.trim(),
      identityNumber: form.identityNumber.trim(),
      bankAccountNumber: form.bankAccountNumber.trim(),
      ifscCode: form.ifscCode.trim().toUpperCase(),
    };

    setSaving(true);
    try {
      await updateMyBeneficiary(payload);
      if (payload.email !== email) {
        // JWT subject is the previous email. Re-authentication keeps the
        // session consistent with the updated login email.
        logout();
        navigate('/login', { replace: true });
        return;
      }
      setForm((current) => ({ ...current, ifscCode: payload.ifscCode }));
      setSuccess('Your profile has been updated successfully.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="module-page-header profile-page-header">
        <div>
          <p className="eyebrow">CITIZEN PROFILE</p>
          <h1>My Profile</h1>
          <p>Keep your beneficiary information accurate so applications can be processed smoothly.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate('/beneficiary')}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {success && <div className="success-banner" role="status">{success}</div>}

      <section className="profile-card">
        <div className="profile-card-intro">
          <div className="profile-avatar-large">{(form.name?.[0] || email?.[0] || 'B').toUpperCase()}</div>
          <div>
            <h2>{form.name || 'Beneficiary'}</h2>
            <p>{form.email || email}</p>
            <span className="profile-security-note">Beneficiary account • Password changes are managed separately.</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading your profile…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="name" value={form.name} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-email">Email address</label><input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-phone">Mobile number</label><input id="profile-phone" name="phone" inputMode="numeric" maxLength="10" value={form.phone} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-age">Age</label><input id="profile-age" name="age" type="number" min="18" value={form.age} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-income">Annual income (₹)</label><input id="profile-income" name="annualIncome" type="number" min="0" value={form.annualIncome} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-ifsc">IFSC code</label><input id="profile-ifsc" name="ifscCode" value={form.ifscCode} onChange={handleChange} maxLength="11" /></div>
              <div className="field field-full"><label htmlFor="profile-address">Residential address</label><textarea id="profile-address" name="address" rows="3" value={form.address} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-identity">Government identity number</label><input id="profile-identity" name="identityNumber" value={form.identityNumber} onChange={handleChange} /></div>
              <div className="field"><label htmlFor="profile-bank">Bank account number</label><input id="profile-bank" name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleChange} /></div>
            </div>

            <div className="profile-form-footer">
              <p>Changes to your email address require you to sign in again for account security.</p>
              <button type="submit" className="btn-primary profile-save-button" disabled={saving}>
                {saving ? 'Saving…' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
