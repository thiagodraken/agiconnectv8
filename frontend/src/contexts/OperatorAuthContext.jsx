import { createContext, useContext, useState } from 'react';

const OperatorAuthContext = createContext();

export function OperatorAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('operator_token'));
  const [operatorId, setOperatorId] = useState(localStorage.getItem('operator_id'));

  const login = (token, operatorId) => {
    localStorage.setItem('operator_token', token);
    localStorage.setItem('operator_id', operatorId);
    setToken(token);
    setOperatorId(operatorId);
  };

  const logout = () => {
    localStorage.removeItem('operator_token');
    localStorage.removeItem('operator_id');
    setToken(null);
    setOperatorId(null);
  };

  return (
    <OperatorAuthContext.Provider value={{ token, operatorId, login, logout }}>
      {children}
    </OperatorAuthContext.Provider>
  );
}

export function useOperatorAuth() {
  return useContext(OperatorAuthContext);
}
