import { useEffect, useState } from 'react';

export default function RoleForm({ role, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(role?.name || '');
    setError('');
  }, [role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) {
      setError('Role name is required.');
      return;
    }
    setError('');
    await onSubmit({ name: value });
  };

  return (
    <section className="role-form-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ROLE CONFIGURATION</span>
          <h2>{role ? 'Edit Role' : 'Create Role'}</h2>
          <p>{role ? 'Update the role name using the backend role contract.' : 'Create a role record for the system.'}</p>
        </div>
      </div>

      <div className="role-security-warning">
        <strong>Security-sensitive setting.</strong>
        <span>Role names are used by Spring Security. Do not rename or delete the built-in roles unless you have intentionally updated the backend security configuration.</span>
      </div>

      <form className="role-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="roleName">Role name</label>
          <input
            id="roleName"
            name="name"
            type="text"
            value={name}
            onChange={(event) => { setName(event.target.value); setError(''); }}
            placeholder="e.g. FIELD_OFFICER"
            autoComplete="off"
            maxLength={100}
            disabled={submitting}
          />
          {error && <div className="field-error">{error}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : role ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    </section>
  );
}
