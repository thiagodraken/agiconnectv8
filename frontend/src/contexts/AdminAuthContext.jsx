import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [tenantId, setTenantId] = useState(localStorage.getItem('tenant_id'));

  const login = (token, tenantId) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('tenant_id', tenantId);
    setToken(token);
    setTenantId(tenantId);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('tenant_id');
    setToken(null);
    setTenantId(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, tenantId, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
