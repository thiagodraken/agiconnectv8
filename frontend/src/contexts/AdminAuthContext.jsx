// 📁 frontend/src/contexts/AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { clearAllAuthTokens } from '../utils/authCleaner';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedTenant = localStorage.getItem('admin_tenant');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.role?.toLowerCase() !== 'admin') {
          logout();
        } else {
          setToken(storedToken);
          setTenantId(payload.tenantId || storedTenant);
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (jwt, tenantIdFromPayload) => {
    clearAllAuthTokens(['admin_token', 'admin_tenant']);
    localStorage.setItem('admin_token', jwt);
    localStorage.setItem('admin_tenant', tenantIdFromPayload);
    setToken(jwt);
    setTenantId(tenantIdFromPayload);
  };

  const logout = () => {
    clearAllAuthTokens();
    setToken(null);
    setTenantId(null);
  };

  return <AdminAuthContext.Provider value={{ token, tenantId, login, logout, loading }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
