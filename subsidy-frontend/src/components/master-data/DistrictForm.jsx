import { useEffect, useState } from 'react';

export default function DistrictForm({ district, states, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('');
  const [stateId, setStateId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(district?.name ?? '');
    setStateId(district?.stateId ? String(district.stateId) : '');
    setError('');
  }, [district]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return setError('District name is mandatory.');
    if (!stateId) return setError('State ID is mandatory.');
    setError('');
    onSubmit({ name: trimmedName, stateId: Number(stateId) });
  };

  return (
    <section className="module-form-card master-form-card">
      <div className="form-section-heading">
        <div><span className="eyebrow">{district ? 'EDIT DISTRICT' : 'CREATE DISTRICT'}</span><h2>{district ? 'Edit District' : 'Add District'}</h2><p>District names are unique within their selected state.</p></div>
      </div>
      {error && <div className="field-error form-inline-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="master-form-grid">
          <div className="field"><label htmlFor="district-name">District name</label><input id="district-name" value={name} onChange={(event) => setName(event.target.value)} disabled={submitting} placeholder="e.g. Pune" autoFocus /></div>
          <div className="field"><label htmlFor="district-state">State</label><select id="district-state" value={stateId} onChange={(event) => setStateId(event.target.value)} disabled={submitting || states.length === 0}><option value="">Select state</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</select></div>
        </div>
        {states.length === 0 && <div className="criteria-empty">Create at least one state before adding a district.</div>}
        <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="btn-primary master-submit-button" disabled={submitting || states.length === 0}>{submitting ? 'Saving…' : district ? 'Update District' : 'Create District'}</button></div>
      </form>
    </section>
  );
}
