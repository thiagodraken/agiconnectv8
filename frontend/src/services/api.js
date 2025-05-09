// 📁 frontend/src/services/api.js
import axios from 'axios';
import { clearAllAuthTokens } from '../utils/authCleaner';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const superAdminToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('admin_token');
  const operatorToken = localStorage.getItem('operator_token');

  const activeToken = superAdminToken || adminToken || operatorToken;

  if (superAdminToken) clearAllAuthTokens(['token']);
  else if (adminToken) clearAllAuthTokens(['admin_token', 'admin_tenant']);
  else if (operatorToken) clearAllAuthTokens(['operator_token', 'operator_tenant']);

  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.status;
    if (code === 401 || code === 403) {
      alert('❌ Sessão expirada ou acesso não autorizado.');
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (path.startsWith('/operador')) {
        window.location.href = '/operador/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
