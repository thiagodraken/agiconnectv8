import { createContext, useContext, useState, useEffect } from 'react';

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
        console.log('✅ payload carregado:', payload);

        if (payload.role?.toLowerCase() !== 'admin') {
          logout();
        } else {
          setToken(storedToken);
          setTenantId(payload.tenantId || storedTenant);
        }
      } catch (err) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = (jwtToken, tenantIdFromPayload) => {
    localStorage.setItem('admin_token', jwtToken);
    localStorage.setItem('admin_tenant', tenantIdFromPayload);
    setToken(jwtToken);
    setTenantId(tenantIdFromPayload);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_tenant');
    setToken(null);
    setTenantId(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, tenantId, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
