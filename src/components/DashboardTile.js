import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function DashboardTile({
  icon,
  label,
  onPress,
  badge,
  badgeColor = COLORS.primary,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.tile, disabled && styles.tileDisabled]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
      accessibilityLabel={label}
    >
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={38}
          color={disabled ? COLORS.textMuted : COLORS.primary}
          style={styles.icon}
        />
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    margin: SPACING.xs,
    aspectRatio: 1.05,
    backgroundColor: 'rgba(15, 15, 15, 0.78)',
    borderWidth: 1.5,
    borderColor: 'rgba(211, 16, 39, 0.65)',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    position: 'relative',
    ...SHADOWS.card,
  },
  tileDisabled: {
    borderColor: COLORS.borderSubtle,
    opacity: 0.45,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(211, 16, 39, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211, 16, 39, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    textShadowColor: 'rgba(211, 16, 39, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
});
