// ─────────────────────────────────────────────────────────────────────────────
// src/components/RoleBanner.js
// Inline banner shown on all screens indicating current role with RBAC note
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function RoleBanner() {
  const { isAdmin } = useAuth();

  return (
    <View style={[styles.banner, isAdmin ? styles.adminBanner : styles.userBanner]}>
      <Ionicons
        name={isAdmin ? 'shield-checkmark' : 'eye-outline'}
        size={14}
        color={isAdmin ? '#fff' : '#aaa'}
        style={{ marginRight: 6 }}
      />
      <Text style={[styles.text, !isAdmin && styles.textUser]}>
        {isAdmin
          ? 'Admin Mode – Full Read & Write Access'
          : 'Member Mode – Read Only View'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.base,
    justifyContent: 'center',
  },
  adminBanner: {
    backgroundColor: COLORS.primary,
  },
  userBanner: {
    backgroundColor: '#1C1C1C',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  text: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    letterSpacing: 0.6,
  },
  textUser: {
    color: COLORS.textMuted,
  },
});
