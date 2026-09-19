import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createUser, deleteUser, getAllUsers, updateUser } from '../../api/userApi.js';
import { getAllRoles } from '../../api/roleApi.js';
import UserForm from '../../components/users/UserForm.jsx';
import UserTable from '../../components/users/UserTable.jsx';

const OFFICER_ROLES = new Set(['FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER']);

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string') return data.error;
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  if (error?.response?.status === 403) return 'Only an administrator can manage user accounts.';
  if (error?.response?.status === 404) return 'The requested user or role was not found.';
  if (error?.response?.status === 409) return 'That email is already registered.';
  if (error?.response?.status === 400) return 'Please check the user details and try again.';
  return fallback;
}

function displayRole(roleName) {
  return roleName.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UserManagement() {
  const { role, userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setRolesLoading(true);
    setPageError('');
    try {
      const [usersResponse, rolesResponse] = await Promise.all([getAllUsers(), getAllRoles()]);
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setRoles(Array.isArray(rolesResponse.data) ? rolesResponse.data : []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to load user management data.'));
    } finally {
      setLoading(false);
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'ADMIN') loadData();
  }, [role, loadData]);

  const officerRoles = useMemo(() => (
    roles
      .filter((item) => OFFICER_ROLES.has(String(item.name).trim().toUpperCase()))
      .map((item) => ({ ...item, label: displayRole(String(item.name).trim().toUpperCase()) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ), [roles]);

  const roleById = useMemo(() => new Map(roles.map((item) => [Number(item.id), item.name])), [roles]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const roleName = roleById.get(Number(user.roleId)) || '';
      return [user.id, user.name, user.email, user.roleId, roleName]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [users, search, roleById]);

  const openCreate = () => {
    setEditingUser(null);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setActionMessage('');
    setPageError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!submitting) {
      setFormOpen(false);
      setEditingUser(null);
    }
  };

  const handleSubmit = async (request) => {
    setSubmitting(true);
    setActionMessage('');
    setPageError('');
    try {
      if (editingUser) {
        await updateUser(editingUser.id, request);
        setActionMessage(`User #${editingUser.id} updated successfully.`);
      } else {
        await createUser(request);
        setActionMessage('Officer account created successfully. The officer can now sign in using the assigned email and password.');
      }
      setFormOpen(false);
      setEditingUser(null);
      await loadData();
    } catch (error) {
      setPageError(getApiErrorMessage(error, editingUser ? 'Unable to update user.' : 'Unable to create officer account.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (String(user.id) === String(userId)) return;
    const roleName = roleById.get(Number(user.roleId));
    const confirmed = window.confirm(`Delete ${roleName ? displayRole(roleName) : 'user'} "${user.name}" (#${user.id})? This will permanently remove the login account.`);
    if (!confirmed) return;

    setDeletingId(user.id);
    setActionMessage('');
    setPageError('');
    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setActionMessage(`User #${user.id} deleted successfully.`);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Unable to delete user.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (role !== 'ADMIN') return null;

  return (
    <div className="module-page">
      <div className="module-page-header">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>User Management</h1>
          <p>Create and manage staff login accounts for Field, District, and Finance Officers.</p>
        </div>
        {!formOpen && (
          <button type="button" className="btn-primary header-action-button" onClick={openCreate} disabled={rolesLoading || officerRoles.length === 0}>
            + Create Officer
          </button>
        )}
      </div>

      <div className="info-banner user-management-banner">
        <strong>Administrator controlled access:</strong> Beneficiaries register themselves publicly. Staff accounts are different: only an ADMIN can create their account, assign the officer role, and provide the initial login credentials.
      </div>

      {actionMessage && <div className="success-banner">{actionMessage}</div>}
      {pageError && (
        <div className="form-error module-error" role="alert">
          {pageError}
          <button type="button" className="error-dismiss" onClick={() => setPageError('')} aria-label="Dismiss error">×</button>
        </div>
      )}

      {formOpen && (
        <UserForm
          user={editingUser}
          officerRoles={officerRoles}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      <section className="module-card user-list-card">
        <div className="section-heading user-list-heading">
          <div>
            <span className="eyebrow">STAFF ACCOUNTS</span>
            <h2>System Users</h2>
            <p>{filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'} shown</p>
          </div>
          <div className="search-box">
            <label htmlFor="user-search">Search</label>
            <input id="user-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, role, ID…" />
          </div>
        </div>

        {rolesLoading && <div className="loading-state">Loading roles…</div>}
        {!rolesLoading && officerRoles.length === 0 && <div className="form-error">The required officer roles are not available from the backend. Create the standard roles first, then return here.</div>}
        {loading ? (
          <div className="loading-state">Loading users…</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">{search ? 'No users match your search.' : 'No users found.'}</div>
        ) : (
          <UserTable users={filteredUsers} roleById={roleById} currentUserId={userId} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </section>
    </div>
  );
}
