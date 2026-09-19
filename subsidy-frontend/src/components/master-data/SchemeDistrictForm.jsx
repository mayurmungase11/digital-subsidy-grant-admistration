import { useEffect, useState } from 'react';

export default function SchemeDistrictForm({ mapping, schemes, districts, onSubmit, onCancel, submitting }) {
  const [schemeId, setSchemeId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSchemeId(mapping?.schemeId ? String(mapping.schemeId) : '');
    setDistrictId(mapping?.districtId ? String(mapping.districtId) : '');
    setError('');
  }, [mapping]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!schemeId) return setError('Scheme id is mandatory.');
    if (!districtId) return setError('District id is mandatory.');
    setError('');
    onSubmit({ schemeId: Number(schemeId), districtId: Number(districtId) });
  };

  return (
    <section className="module-form-card master-form-card">
      <div className="form-section-heading"><div><span className="eyebrow">{mapping ? 'EDIT COVERAGE' : 'CREATE COVERAGE'}</span><h2>{mapping ? 'Edit Scheme-District Mapping' : 'Map Scheme to District'}</h2><p>Define which district is covered by a government scheme.</p></div></div>
      {error && <div className="field-error form-inline-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="master-form-grid">
          <div className="field"><label htmlFor="coverage-scheme">Scheme</label><select id="coverage-scheme" value={schemeId} onChange={(event) => setSchemeId(event.target.value)} disabled={submitting || schemes.length === 0}><option value="">Select scheme</option>{schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.code} — {scheme.name}</option>)}</select></div>
          <div className="field"><label htmlFor="coverage-district">District</label><select id="coverage-district" value={districtId} onChange={(event) => setDistrictId(event.target.value)} disabled={submitting || districts.length === 0}><option value="">Select district</option>{districts.map((district) => <option key={district.id} value={district.id}>{district.name}{district.stateName ? ` — ${district.stateName}` : ''}</option>)}</select></div>
        </div>
        {(schemes.length === 0 || districts.length === 0) && <div className="criteria-empty">Create at least one scheme and one district before configuring coverage.</div>}
        <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="btn-primary master-submit-button" disabled={submitting || schemes.length === 0 || districts.length === 0}>{submitting ? 'Saving…' : mapping ? 'Update Mapping' : 'Create Mapping'}</button></div>
      </form>
    </section>
  );
}
