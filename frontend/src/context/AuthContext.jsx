import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// ─── AUTH BYPASS MODE ──────────────────────────────────────────────────────────
// A mock user is injected so all dashboard pages render with realistic data.
// TODO: Remove MOCK_USER and un-comment the real useEffect below when backend is live.
const MOCK_USER = {
  _id:             'mock-user-001',
  name:            'Dr. Aditya Jain',
  email:           'aditya@pyclima.dev',
  role:            'researcher',   // 'researcher' | 'public'
  tier:            'pro',          // 'pro' | 'free'
  datasetsAnalyzed: 2,
  token:           'mock-jwt-token',
};
// ──────────────────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(MOCK_USER);
  const [token, setToken] = useState(MOCK_USER.token);
  const [loading]         = useState(false); // never "loading" in bypass mode

  // Retain these so the real implementation wires in without changing call sites
  const saveAuth = (userData) => {
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isResearcher = user?.role === 'researcher';
  const isPro        = user?.tier === 'pro';

  return (
    <AuthContext.Provider value={{ user, token, loading, saveAuth, logout, isResearcher, isPro }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
