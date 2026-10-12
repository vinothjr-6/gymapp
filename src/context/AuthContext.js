// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.js
// Role-based Auth Context: Admin (read+write) vs User (read-only)
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER } from '../constants/mockData';

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const STORAGE_KEY = '@slam_role';

export function AuthProvider({ children }) {
  const [role, setRole] = useState(ROLES.USER);
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(true);

  // Restore persisted role on launch
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedRole) => {
        if (savedRole) setRole(savedRole);
      })
      .finally(() => setLoading(false));
  }, []);

  const switchRole = async (newRole) => {
    setRole(newRole);
    await AsyncStorage.setItem(STORAGE_KEY, newRole);
  };

  const toggleRole = () => {
    switchRole(role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN);
  };

  const isAdmin = role === ROLES.ADMIN;
  const isUser = role === ROLES.USER;

  return (
    <AuthContext.Provider value={{ role, user, isAdmin, isUser, toggleRole, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
