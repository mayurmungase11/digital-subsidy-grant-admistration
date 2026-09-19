import { useEffect, useState } from 'react';

export default function StateForm({ onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName('');
    setError('');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) {
      setError('State name is mandatory.');
      return;
    }
    setError('');
    onSubmit({ name: value });
  };

  return (
    <section className="module-form-card master-form-card">
      <div className="form-section-heading">
        <div>
          <span className="eyebrow">CREATE STATE</span>
          <h2>Add State</h2>
          <p>Register a unique state before creating its districts.</p>
        </div>
      </div>

      {error && <div className="field-error form-inline-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="master-single-field">
          <div className="field">
            <label htmlFor="state-name">State name</label>
            <input id="state-name" value={name} onChange={(event) => setName(event.target.value)} disabled={submitting} placeholder="e.g. Maharashtra" autoFocus />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary master-submit-button" disabled={submitting}>{submitting ? 'Saving…' : 'Create State'}</button>
        </div>
      </form>
    </section>
  );
}
