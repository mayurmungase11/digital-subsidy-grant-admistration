import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerBeneficiary } from '../../api/authApi';

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

const INITIAL_FORM = {
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Mirrors the backend BeneficiaryRegistrationRequestDTO validation
  // rules exactly, so the user sees the same errors client-side that
  // the backend would return — but the backend remains authoritative.
  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.password) next.password = 'Password is required.';
    if (!MOBILE_REGEX.test(form.phone)) next.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!form.age || Number(form.age) < 18) next.age = 'Age must be 18 or above.';
    if (form.annualIncome === '' || Number(form.annualIncome) < 0) {
      next.annualIncome = 'Annual income must be zero or positive.';
    }
    if (!form.address.trim()) next.address = 'Address is required.';
    if (!form.identityNumber.trim()) next.identityNumber = 'Identity number is required.';
    if (!form.bankAccountNumber.trim()) next.bankAccountNumber = 'Bank account number is required.';
    if (!IFSC_REGEX.test(form.ifscCode)) next.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234).';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerBeneficiary({
        ...form,
        age: Number(form.age),
        annualIncome: Number(form.annualIncome),
      });
      // Registration does not return a token — the backend only
      // returns a success message. Route to login instead of
      // treating registration as an implicit sign-in.
      navigate('/login', {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setFormError('An account with this email already exists.');
      } else if (status === 400) {
        setFormError('Please check the highlighted fields and try again.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h1>Create beneficiary account</h1>
        <p className="subtitle">Register to access the Digital Subsidy & Grant Administration Platform</p>

        {formError && <div className="form-error">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
            <div className="field">
              <label htmlFor="age">Age</label>
              <input id="age" name="age" type="number" value={form.age} onChange={handleChange} />
              {errors.age && <div className="field-error">{errors.age}</div>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="annualIncome">Annual income (₹)</label>
            <input
              id="annualIncome"
              name="annualIncome"
              type="number"
              value={form.annualIncome}
              onChange={handleChange}
            />
            {errors.annualIncome && <div className="field-error">{errors.annualIncome}</div>}
          </div>

          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="field">
            <label htmlFor="identityNumber">Identity number</label>
            <input
              id="identityNumber"
              name="identityNumber"
              value={form.identityNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
            />
            {errors.identityNumber && <div className="field-error">{errors.identityNumber}</div>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="bankAccountNumber">Bank account number</label>
              <input
                id="bankAccountNumber"
                name="bankAccountNumber"
                value={form.bankAccountNumber}
                onChange={handleChange}
              />
              {errors.bankAccountNumber && <div className="field-error">{errors.bankAccountNumber}</div>}
            </div>
            <div className="field">
              <label htmlFor="ifscCode">IFSC code</label>
              <input
                id="ifscCode"
                name="ifscCode"
                value={form.ifscCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))
                }
                placeholder="SBIN0001234"
              />
              {errors.ifscCode && <div className="field-error">{errors.ifscCode}</div>}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
