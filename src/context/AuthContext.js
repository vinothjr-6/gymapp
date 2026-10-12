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
const BRANCH_STORAGE_KEY = '@slam_branch';

export function AuthProvider({ children }) {
  const [role, setRole] = useState(ROLES.USER);
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(true);
  const [roleToast, setRoleToast] = useState(null);

  // Restore persisted role and active branch on launch
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(BRANCH_STORAGE_KEY),
    ])
      .then(([savedRole, savedBranch]) => {
        if (savedRole) setRole(savedRole);
        if (savedBranch) {
          setUser((prev) => ({ ...prev, activeBranchId: savedBranch }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const switchRole = async (newRole) => {
    setRole(newRole);
    await AsyncStorage.setItem(STORAGE_KEY, newRole);
    setRoleToast(
      newRole === ROLES.ADMIN
        ? 'Switched to ADMIN mode (Full Read & Write)'
        : 'Switched to MEMBER mode (Read-Only)'
    );
    setTimeout(() => setRoleToast(null), 3000);
  };

  const toggleRole = () => {
    switchRole(role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN);
  };

  const setActiveBranchId = async (branchId) => {
    setUser((prev) => ({ ...prev, activeBranchId: branchId }));
    await AsyncStorage.setItem(BRANCH_STORAGE_KEY, branchId);
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const deductPoints = (amount) => {
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: Math.max(0, (prev?.loyaltyPoints || 0) - amount),
    }));
  };

  const addPoints = (amount) => {
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: (prev?.loyaltyPoints || 0) + amount,
    }));
  };

  const isAdmin = role === ROLES.ADMIN;
  const isUser = role === ROLES.USER;

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        activeBranchId: user?.activeBranchId || 'b1',
        setActiveBranchId,
        updateUser,
        deductPoints,
        addPoints,
        isAdmin,
        isUser,
        toggleRole,
        switchRole,
        roleToast,
        setRoleToast,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
