import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Leer token desde localStorage al cargar
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (stored) {
        setToken(stored);
        setIsAuthenticated(true);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        }
      }
    } catch (e) {
      console.error('Error leyendo auth desde localStorage', e);
    }
  }, []);

  // login: guarda token y user en estado y localStorage
  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setIsAuthenticated(true);
    setUser(newUser || null);
    try {
      localStorage.setItem('auth_token', newToken);
      if (newUser) localStorage.setItem('auth_user', JSON.stringify(newUser));
    } catch (e) {
      console.error('Error guardando auth en localStorage', e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (e) {
      console.error('Error limpiando localStorage', e);
    }
  };

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  return useContext(AuthContext);
}

export default AuthContext;
