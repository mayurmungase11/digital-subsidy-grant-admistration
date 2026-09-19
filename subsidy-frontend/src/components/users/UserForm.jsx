import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  roleId: '',
};

function normalizeUser(user) {
  if (!user) return EMPTY_FORM;
  return {
    name: user.name ?? '',
    email: user.email ?? '',
    password: '',
    roleId: user.roleId ?? '',
  };
}

export default function UserForm({ user, officerRoles, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(normalizeUser(user));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(normalizeUser(user));
    setErrors({});
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!isEdit && !form.password) next.password = 'Password is required when creating a user.';
    if (form.password && form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!form.roleId) next.roleId = 'Select an officer role.';
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const request = {
      name: form.name.trim(),
      email: form.email.trim(),
      roleId: Number(form.roleId),
    };

    // Password is intentionally omitted during an edit when the admin leaves it blank.
    if (!isEdit || form.password) request.password = form.password;
    onSubmit(request);
  };

  return (
    <section className="module-card user-form-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{isEdit ? 'EDIT USER' : 'CREATE OFFICER ACCOUNT'}</span>
          <h2>{isEdit ? `Edit User #${user.id}` : 'Create Officer'}</h2>
          <p>{isEdit ? 'Update the officer account details and assigned role.' : 'Create login credentials for a Field, District, or Finance Officer.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="user-form-grid">
          <div className="field">
            <label htmlFor="user-name">Name</label>
            <input id="user-name" name="name" value={form.name} onChange={handleChange} disabled={submitting} autoComplete="name" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="user-email">Email / Username</label>
            <input id="user-email" name="email" type="email" value={form.email} onChange={handleChange} disabled={submitting} autoComplete="username" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="user-password">Password</label>
            <input id="user-password" name="password" type="password" value={form.password} onChange={handleChange} disabled={submitting} autoComplete={isEdit ? 'new-password' : 'new-password'} placeholder={isEdit ? 'Leave blank to keep current password' : 'Set initial password'} />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="field">
            <label htmlFor="user-role">Officer Role</label>
            <select id="user-role" name="roleId" value={form.roleId} onChange={handleChange} disabled={submitting}>
              <option value="">Select role</option>
              {officerRoles.map((role) => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
            {errors.roleId && <div className="field-error">{errors.roleId}</div>}
          </div>
        </div>

        <div className="user-security-note">
          <strong>Account security:</strong> The password is sent only to the backend over the authenticated request. The backend stores it using BCrypt hashing. Passwords are never displayed in the user list.
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || officerRoles.length === 0}>
            {submitting ? 'Saving…' : isEdit ? 'Update User' : 'Create Officer'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
