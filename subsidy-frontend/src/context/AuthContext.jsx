import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi } from '../api/authApi';
import {
  saveAuth,
  clearAuth,
  getRole,
  getEmail,
  getUserId,
  isAuthenticated,
} from '../utils/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Hydrate initial state from localStorage so a page refresh doesn't
  // log the user out. The axios interceptor reads the token directly
  // from storage, so this state is for the UI (role-based rendering,
  // route guards) — it is not itself the source of truth for requests.
  const [auth, setAuth] = useState({
    isAuthenticated: isAuthenticated(),
    role: getRole(),
    email: getEmail(),
    userId: getUserId(),
  });

  const login = useCallback(async ({ email, password }) => {
    const response = await loginApi({ email, password });
    const { token, tokenType, email: respEmail, role, userId: respUserId } = response.data;

    const normalizedRole = role?.startsWith('ROLE_')
      ? role.substring(5)
      : role;

    saveAuth({ token, tokenType, email: respEmail, role: normalizedRole, userId: respUserId });
    setAuth({ isAuthenticated: true, role: normalizedRole, email: respEmail, userId: respUserId ?? null });

    return { role: normalizedRole };
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth({ isAuthenticated: false, role: null, email: null, userId: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
