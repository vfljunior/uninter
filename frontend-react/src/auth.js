import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo');
    return token ? { token, tipo } : null;
  });

  const login = (token, tipo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    setUser({ token, tipo });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);