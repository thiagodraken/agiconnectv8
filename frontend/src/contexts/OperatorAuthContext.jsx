import { createContext, useContext, useState, useEffect } from 'react';

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
      } catch (err) {
        logout(); // Token inválido ou expirado
      }
    }
  }, [token]);

  const login = (jwtToken, tenantIdFromPayload) => {
    localStorage.setItem('operator_token', jwtToken);
    localStorage.setItem('operator_tenant', tenantIdFromPayload);
    setToken(jwtToken);
    setTenantId(tenantIdFromPayload);
  };

  const logout = () => {
    localStorage.removeItem('operator_token');
    localStorage.removeItem('operator_tenant');
    setToken(null);
    setTenantId(null);
  };

  return (
    <OperatorAuthContext.Provider value={{ token, tenantId, login, logout }}>
      {children}
    </OperatorAuthContext.Provider>
  );
}

export function useOperatorAuth() {
  return useContext(OperatorAuthContext);
}
