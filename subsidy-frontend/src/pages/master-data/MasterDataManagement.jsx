import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createState, deleteState, getAllStates } from '../../api/stateApi.js';
import { createDistrict, deleteDistrict, getAllDistricts, updateDistrict } from '../../api/districtApi.js';
import { createSchemeDistrict, deleteSchemeDistrict, getAllSchemeDistricts, updateSchemeDistrict } from '../../api/schemeDistrictApi.js';
import { getAllSchemes } from '../../api/schemeApi.js';
import StateForm from '../../components/master-data/StateForm.jsx';
import StateTable from '../../components/master-data/StateTable.jsx';
import DistrictForm from '../../components/master-data/DistrictForm.jsx';
import DistrictTable from '../../components/master-data/DistrictTable.jsx';
import SchemeDistrictForm from '../../components/master-data/SchemeDistrictForm.jsx';
import SchemeDistrictTable from '../../components/master-data/SchemeDistrictTable.jsx';

const TABS = { STATES: 'states', DISTRICTS: 'districts', COVERAGE: 'coverage' };
const READ_ROLES = new Set(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER']);

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to perform this action.';
  if (error?.response?.status === 404) return 'The requested master-data record was not found.';
  if (error?.response?.status === 409) return 'The record could not be saved because it conflicts with existing data. Check for duplicate names or mappings.';
  if (error?.response?.status === 400) return 'Please check the submitted details and try again.';
  if (error?.response?.status >= 500) return 'The server could not complete the request. Check related records and try again.';
  return fallback;
}

function tabLabel(tab) {
  if (tab === TABS.STATES) return 'States';
  if (tab === TABS.DISTRICTS) return 'Districts';
  return 'Scheme Coverage';
}

export default function MasterDataManagement() {
  const { role } = useAuth();
  const canManage = role === 'ADMIN';
  const canRead = READ_ROLES.has(role);

  const [activeTab, setActiveTab] = useState(TABS.STATES);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editingMapping, setEditingMapping] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    if (!canRead) return;
    setLoading(true);
    setPageError('');
    try {
      const [statesResponse, districtsResponse, schemesResponse, mappingsResponse] = await Promise.all([
        getAllStates(),
        getAllDistricts(),
        getAllSchemes(),
        getAllSchemeDistricts(),
      ]);
      setStates(Array.isArray(statesResponse.data) ? statesResponse.data : []);
      setDistricts(Array.isArray(districtsResponse.data) ? districtsResponse.data : []);
      setSchemes(Array.isArray(schemesResponse.data) ? schemesResponse.data : []);
      setMappings(Array.isArray(mappingsResponse.data) ? mappingsResponse.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load master data.'));
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredStates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return states;
    return states.filter((item) => [item.id, item.name].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [states, search]);

  const filteredDistricts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return districts;
    return districts.filter((item) => [item.id, item.name, item.stateId, item.stateName].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [districts, search]);

  const schemeById = useMemo(() => new Map(schemes.map((item) => [Number(item.id), item])), [schemes]);
  const districtById = useMemo(() => new Map(districts.map((item) => [Number(item.id), item])), [districts]);

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mappings;
    return mappings.filter((item) => {
      const scheme = schemeById.get(Number(item.schemeId));
      const district = districtById.get(Number(item.districtId));
      return [item.id, item.schemeId, item.districtId, scheme?.code, scheme?.name, district?.name, district?.stateName]
        .some((value) => String(value ?? '').toLowerCase().includes(query));
    });
  }, [mappings, search, schemeById, districtById]);

  const closeForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditingDistrict(null);
    setEditingMapping(null);
  };

  const openCreate = () => {
    setEditingDistrict(null);
    setEditingMapping(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEditDistrict = (district) => {
    setEditingDistrict(district);
    setEditingMapping(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEditMapping = (mapping) => {
    setEditingMapping(mapping);
    setEditingDistrict(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const handleStateSubmit = async (request) => {
    setSubmitting(true); setPageError(''); setActionMessage('');
    try {
      await createState(request);
      setActionMessage('State created successfully.');
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to create state.'));
    } finally { setSubmitting(false); }
  };

  const handleDistrictSubmit = async (request) => {
    setSubmitting(true); setPageError(''); setActionMessage('');
    try {
      if (editingDistrict) {
        await updateDistrict(editingDistrict.id, request);
        setActionMessage('District updated successfully.');
      } else {
        await createDistrict(request);
        setActionMessage('District created successfully.');
      }
      setFormOpen(false); setEditingDistrict(null); await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingDistrict ? 'Unable to update district.' : 'Unable to create district.'));
    } finally { setSubmitting(false); }
  };

  const handleMappingSubmit = async (request) => {
    setSubmitting(true); setPageError(''); setActionMessage('');
    try {
      if (editingMapping) {
        await updateSchemeDistrict(editingMapping.id, request);
        setActionMessage('Scheme-district mapping updated successfully.');
      } else {
        await createSchemeDistrict(request);
        setActionMessage('Scheme-district mapping created successfully.');
      }
      setFormOpen(false); setEditingMapping(null); await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingMapping ? 'Unable to update scheme-district mapping.' : 'Unable to create scheme-district mapping.'));
    } finally { setSubmitting(false); }
  };

  const handleDeleteState = async (state) => {
    if (!window.confirm(`Delete state "${state.name}" (#${state.id})? Related district records may prevent deletion.`)) return;
    setDeletingId(state.id); setPageError(''); setActionMessage('');
    try { await deleteState(state.id); setStates((current) => current.filter((item) => item.id !== state.id)); setActionMessage(`State #${state.id} deleted successfully.`); }
    catch (error) { setPageError(getApiErrorMessage(error, 'Unable to delete state. Related district records may need to be removed first.')); }
    finally { setDeletingId(null); }
  };

  const handleDeleteDistrict = async (district) => {
    if (!window.confirm(`Delete district "${district.name}" (#${district.id})? Existing scheme coverage may prevent deletion.`)) return;
    setDeletingId(district.id); setPageError(''); setActionMessage('');
    try { await deleteDistrict(district.id); setDistricts((current) => current.filter((item) => item.id !== district.id)); setActionMessage(`District #${district.id} deleted successfully.`); }
    catch (error) { setPageError(getApiErrorMessage(error, 'Unable to delete district. It may still be referenced by scheme coverage.')); }
    finally { setDeletingId(null); }
  };

  const handleDeleteMapping = async (mapping) => {
    if (!window.confirm(`Delete scheme-district mapping #${mapping.id}?`)) return;
    setDeletingId(mapping.id); setPageError(''); setActionMessage('');
    try { await deleteSchemeDistrict(mapping.id); setMappings((current) => current.filter((item) => item.id !== mapping.id)); setActionMessage(`Mapping #${mapping.id} deleted successfully.`); }
    catch (error) { setPageError(getApiErrorMessage(error, 'Unable to delete scheme-district mapping.')); }
    finally { setDeletingId(null); }
  };

  if (!canRead) return null;

  const form = activeTab === TABS.STATES
    ? (formOpen && canManage ? <StateForm onSubmit={handleStateSubmit} onCancel={closeForm} submitting={submitting} /> : null)
    : activeTab === TABS.DISTRICTS
      ? (formOpen && canManage ? <DistrictForm district={editingDistrict} states={states} onSubmit={handleDistrictSubmit} onCancel={closeForm} submitting={submitting} /> : null)
      : (formOpen && canManage ? <SchemeDistrictForm mapping={editingMapping} schemes={schemes} districts={districts} onSubmit={handleMappingSubmit} onCancel={closeForm} submitting={submitting} /> : null);

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">MASTER DATA</span>
          <h1>Geography &amp; Scheme Coverage</h1>
          <p>{canManage ? 'Manage states, districts, and scheme-to-district coverage.' : 'View states, districts, and scheme coverage used by the subsidy workflow.'}</p>
        </div>
        {canManage && !formOpen && <button type="button" className="btn-primary header-action-button" onClick={openCreate}>+ Add {tabLabel(activeTab)}</button>}
      </div>

      <div className="info-banner master-data-banner"><strong>Access control:</strong> Administrators can create, update, and delete master records. Authorized officers have read-only access to these endpoints.</div>
      {actionMessage && <div className="success-banner">{actionMessage}</div>}
      {pageError && <div className="form-error module-error" role="alert">{pageError}<button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">×</button></div>}

      <div className="master-tabs" role="tablist" aria-label="Master data sections">
        {Object.values(TABS).map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={`master-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => { setActiveTab(tab); setFormOpen(false); setEditingDistrict(null); setEditingMapping(null); setSearch(''); setPageError(''); setActionMessage(''); }}>{tabLabel(tab)}</button>)}
      </div>

      {form}

      <section className="module-card master-list-card">
        <div className="section-heading master-list-heading">
          <div><span className="eyebrow">{tabLabel(activeTab).toUpperCase()}</span><h2>{tabLabel(activeTab)}</h2><p>{activeTab === TABS.STATES ? `${filteredStates.length} state${filteredStates.length === 1 ? '' : 's'} shown` : activeTab === TABS.DISTRICTS ? `${filteredDistricts.length} district${filteredDistricts.length === 1 ? '' : 's'} shown` : `${filteredMappings.length} mapping${filteredMappings.length === 1 ? '' : 's'} shown`}</p></div>
          <div className="search-box"><label htmlFor="master-data-search">Search</label><input id="master-data-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activeTab === TABS.STATES ? 'Name or ID…' : activeTab === TABS.DISTRICTS ? 'District, state or ID…' : 'Scheme, district or ID…'} /></div>
        </div>

        {loading ? <div className="loading-state">Loading master data…</div> : activeTab === TABS.STATES ? <StateTable states={filteredStates} canManage={canManage} onDelete={handleDeleteState} deletingId={deletingId} /> : activeTab === TABS.DISTRICTS ? <DistrictTable districts={filteredDistricts} canManage={canManage} onEdit={openEditDistrict} onDelete={handleDeleteDistrict} deletingId={deletingId} /> : <SchemeDistrictTable mappings={filteredMappings} schemeById={schemeById} districtById={districtById} canManage={canManage} onEdit={openEditMapping} onDelete={handleDeleteMapping} deletingId={deletingId} />}
      </section>
    </div>
  );
}
