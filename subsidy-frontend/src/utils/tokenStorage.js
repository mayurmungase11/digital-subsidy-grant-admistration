// Centralized localStorage access for auth data.
// Kept separate from AuthContext so the axios interceptor (which lives
// outside React) can read the token synchronously without a hook.

const TOKEN_KEY = 'subsidy_token';
const TOKEN_TYPE_KEY = 'subsidy_token_type';
const ROLE_KEY = 'subsidy_role';
const EMAIL_KEY = 'subsidy_email';
const USER_ID_KEY = 'subsidy_user_id';

export function saveAuth({ token, tokenType, email, role, userId }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType || 'Bearer');
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.setItem(ROLE_KEY, role);
  if (userId !== null && userId !== undefined) localStorage.setItem(USER_ID_KEY, String(userId));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getTokenType() {
  return localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY);
}

export function getUserId() {
  const value = localStorage.getItem(USER_ID_KEY);
  return value ? Number(value) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
