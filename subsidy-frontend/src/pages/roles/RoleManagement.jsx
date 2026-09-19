import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createRole, deleteRole, getAllRoles, updateRole } from '../../api/roleApi.js';
import RoleForm from '../../components/roles/RoleForm.jsx';
import RoleTable from '../../components/roles/RoleTable.jsx';

const CURRENT_ROLE_NAMES = new Set([
  'ADMIN',
  'BENEFICIARY',
  'FIELD_OFFICER',
  'DISTRICT_OFFICER',
  'FINANCE_OFFICER',
]);

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string') return data.error;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'You do not have permission to manage roles.';
  if (error?.response?.status === 404) return 'The requested role was not found.';
  if (error?.response?.status === 409) return 'The role could not be saved because the role name already exists.';
  if (error?.response?.status === 400) return 'Please check the role name and try again.';
  if (error?.response?.status >= 500) return 'The server could not complete the role operation. The role may still be referenced by users.';
  return fallback;
}

export default function RoleManagement() {
  const { role: currentUserRole } = useAuth();
  const isAdmin = currentUserRole === 'ADMIN';

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadRoles = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setPageError('');
    try {
      const response = await getAllRoles();
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load roles.'));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { loadRoles(); }, [loadRoles]);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((item) => [item.id, item.name]
      .some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [roles, search]);

  const openCreate = () => {
    setEditingRole(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingRole(item);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!submitting) {
      setFormOpen(false);
      setEditingRole(null);
    }
  };

  const handleSubmit = async (request) => {
    const normalizedName = request.name.trim().toUpperCase();
    const currentName = String(editingRole?.name || '').trim().toUpperCase();

    if (editingRole && normalizedName === currentName) {
      setActionMessage('No role-name change was made.');
      setFormOpen(false);
      return;
    }

    setSubmitting(true);
    setPageError('');
    setActionMessage('');
    try {
      if (editingRole) {
        await updateRole(editingRole.id, { name: normalizedName });
        setActionMessage(`Role #${editingRole.id} updated successfully.`);
      } else {
        await createRole({ name: normalizedName });
        setActionMessage(`Role ${normalizedName} created successfully.`);
      }
      setFormOpen(false);
      setEditingRole(null);
      await loadRoles();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingRole ? 'Unable to update role.' : 'Unable to create role.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const name = String(item.name || '').trim().toUpperCase();
    if (CURRENT_ROLE_NAMES.has(name)) {
      const confirmed = window.confirm(
        `Delete built-in role "${item.name}" (#${item.id})? This is security-sensitive and may affect application authorization. Continue only if you intentionally want to remove this role.`
      );
      if (!confirmed) return;
    } else if (!window.confirm(`Delete role "${item.name}" (#${item.id})?`)) {
      return;
    }

    setDeletingId(item.id);
    setPageError('');
    setActionMessage('');
    try {
      await deleteRole(item.id);
      setRoles((current) => current.filter((roleItem) => roleItem.id !== item.id));
      setActionMessage(`Role #${item.id} deleted successfully.`);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to delete role. It may still be referenced by users or required by the security configuration.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Role Management</h1>
          <p>Manage role records exposed by the backend role API.</p>
        </div>
        {!formOpen && (
          <button type="button" className="btn-primary header-action-button" onClick={openCreate}>+ Create Role</button>
        )}
      </div>

      {actionMessage && <div className="success-banner">{actionMessage}</div>}
      {pageError && (
        <div className="form-error module-error" role="alert">
          {pageError}
          <button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">×</button>
        </div>
      )}

      <section className="role-management-banner">
        <div>
          <span className="eyebrow">SECURITY NOTICE</span>
          <h2>Roles are part of authorization</h2>
          <p>Built-in roles such as ADMIN, BENEFICIARY, FIELD_OFFICER, DISTRICT_OFFICER and FINANCE_OFFICER are referenced by the backend security configuration. Creating or modifying role records does not automatically change Spring Security rules.</p>
        </div>
      </section>

      {formOpen && (
        <RoleForm role={editingRole} onSubmit={handleSubmit} onCancel={closeForm} submitting={submitting} />
      )}

      <section className="role-list-card">
        <div className="section-heading role-list-heading">
          <div>
            <h2>Role Records</h2>
            <p>{roles.length} role{roles.length === 1 ? '' : 's'} found</p>
          </div>
          <div className="scheme-search">
            <label htmlFor="role-search">Search roles</label>
            <input
              id="role-search"
              type="search"
              placeholder="Search ID or role name…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading roles...</div>
        ) : (
          <RoleTable
            roles={filteredRoles}
            currentUserRole={currentUserRole}
            onEdit={openEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </section>

      <p className="workflow-note">
        <strong>Important:</strong> the role API supports full CRUD, but authorization rules remain controlled by the backend. A role name created here is not automatically granted permissions.
      </p>
    </div>
  );
}
