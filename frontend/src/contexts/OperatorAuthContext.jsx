// 📁 frontend/src/contexts/OperatorAuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { clearAllAuthTokens } from '../utils/authCleaner';

const OperatorAuthContext = createContext();

export function OperatorAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('operator_token'));
  const [tenantId, setTenantId] = useState(localStorage.getItem('operator_tenant'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role?.toLowerCase() !== 'operador') {
          logout();
        } else {
          setTenantId(payload.tenantId);
          localStorage.setItem('operator_tenant', payload.tenantId);
        }
      } catch {
        logout();
      }
    }
  }, [token]);

  const login = (jwt, tenantIdFromPayload) => {
    clearAllAuthTokens(['operator_token', 'operator_tenant']);
    localStorage.setItem('operator_token', jwt);
    localStorage.setItem('operator_tenant', tenantIdFromPayload);
    setToken(jwt);
    setTenantId(tenantIdFromPayload);
  };

  const logout = () => {
    clearAllAuthTokens();
    setToken(null);
    setTenantId(null);
  };

  return <OperatorAuthContext.Provider value={{ token, tenantId, login, logout }}>{children}</OperatorAuthContext.Provider>;
}

export function useOperatorAuth() {
  return useContext(OperatorAuthContext);
}
