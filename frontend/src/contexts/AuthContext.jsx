// 📁 frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { clearAllAuthTokens } from '../utils/authCleaner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (jwt) => {
    clearAllAuthTokens(['token']);
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    clearAllAuthTokens();
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
