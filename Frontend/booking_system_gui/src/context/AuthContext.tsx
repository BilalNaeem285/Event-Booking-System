import React, { createContext, useState, useEffect } from 'react';

type Role = 'USER' | 'CREATOR';

interface AuthContextType {
  token: string | null;
  userRole: Role | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userRole: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUserRole(null);
      setUserId(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      setUserId(payload.sub);
    } catch (error) {
      console.error('Invalid token, logging out');
      logout();
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
