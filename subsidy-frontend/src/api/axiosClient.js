import axios from 'axios';
import { getToken, getTokenType, clearAuth } from '../utils/tokenStorage';

// Single source of truth for the backend base URL.
// Change this once here (or via .env) rather than hardcoding it per-call.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every outgoing request, if present.
// This is the ONLY place the Authorization header gets set —
// individual api files must never build this header themselves.
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${getTokenType()} ${token}`;
  }
  return config;
});

// Centralized response handling.
// 401 = not authenticated / invalid or expired token -> force re-login.
// 403 = authenticated but not permitted -> let the caller show a
//        "you don't have access" message; do NOT log the user out.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        clearAuth();
        // Redirecting here (rather than via react-router) keeps this
        // interceptor framework-agnostic. If you'd rather navigate
        // through the router, replace this with an event the
        // AuthContext listens for.
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // 403 is intentionally NOT handled globally — the calling
      // component/page decides how to surface "forbidden" in context.
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
