// ─────────────────────────────────────────────────────────────────────────────
// src/components/DashboardTile.js
// Reusable 2-column grid tile for the home dashboard – red icon, dark glass card
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function DashboardTile({ icon, label, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.tile, disabled && styles.tileDisabled]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.75}
      accessibilityLabel={label}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={40} color={disabled ? COLORS.textMuted : COLORS.primary} style={styles.icon} />
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    margin: SPACING.xs,
    aspectRatio: 1,
    backgroundColor: COLORS.bgCardGlass,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    ...SHADOWS.card,
  },
  tileDisabled: {
    borderColor: COLORS.borderSubtle,
    opacity: 0.45,
  },
  iconContainer: {
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // Glow achieved via shadow on parent View in real impl – placeholder here
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
});
