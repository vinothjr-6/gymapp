// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ProfileScreen.js – PLACEHOLDER
// Member profile: loyalty points, membership info, referral code.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ProfileScreen() {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.hero}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.memberBadge}>
          <MaterialCommunityIcons name="star-circle" size={14} color="#FBBF24" />
          <Text style={styles.memberBadgeText}>{user.membershipType}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{user.loyaltyPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Loyalty Points</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Classes Booked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>2025</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.section}>
        {[
          { icon: 'call-outline', label: 'Phone', value: user.phone },
          { icon: 'mail-outline', label: 'Email', value: user.email },
          { icon: 'location-outline', label: 'Branch', value: 'Nandanam' },
          { icon: 'gift-outline', label: 'Referral Code', value: user.referralCode },
        ].map((row, i) => (
          <View key={i} style={styles.infoRow}>
            <Ionicons name={row.icon} size={18} color={COLORS.primary} style={{ width: 24 }} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* TODO: Edit profile, loyalty redemption in full build */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  hero: { alignItems: 'center', padding: SPACING.xl, paddingBottom: SPACING.base },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md, ...SHADOWS.glow,
  },
  avatarText: { color: '#fff', fontSize: FONTS.xxl, fontWeight: FONTS.weightBold },
  name: { color: COLORS.textPrimary, fontSize: FONTS.xl, fontWeight: FONTS.weightBold, marginBottom: 2 },
  email: { color: COLORS.textMuted, fontSize: FONTS.sm, marginBottom: SPACING.sm },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  memberBadgeText: { color: '#FBBF24', fontSize: FONTS.xs, fontWeight: FONTS.weightBold },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.bgCard, marginHorizontal: SPACING.base, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, ...SHADOWS.card },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: COLORS.primary, fontSize: FONTS.xl, fontWeight: FONTS.weightBold },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.xs, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.borderSubtle },
  section: { backgroundColor: COLORS.bgCard, marginHorizontal: SPACING.base, borderRadius: RADIUS.lg, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  infoContent: { flex: 1, marginLeft: SPACING.sm },
  infoLabel: { color: COLORS.textMuted, fontSize: FONTS.xs },
  infoValue: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: FONTS.weightMedium },
});
