// ─────────────────────────────────────────────────────────────────────────────
// src/screens/BranchesScreen.js – PLACEHOLDER
// Branch listings. Admin: add/edit. User: browse & set active branch.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function BranchesScreen() {
  const { branches } = useGymData();
  const { isAdmin } = useAuth();

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Our Branches</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={branches}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.isActive && styles.cardInactive]}>
            <View style={styles.cardHeader}>
              <View style={styles.nameRow}>
                <Text style={styles.branchName}>{item.name}</Text>
                {!item.isActive && <Text style={styles.comingSoon}> · Coming Soon</Text>}
              </View>
              {isAdmin && (
                <View style={styles.adminRow}>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={{ marginLeft: 8 }} />
                </View>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.infoText}>{item.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.infoText}>{item.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.infoText}>{item.timings}</Text>
            </View>
            <View style={styles.facilitiesRow}>
              {item.facilities.map((f, idx) => (
                <View key={idx} style={styles.facilityTag}>
                  <Text style={styles.facilityText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
      {/* TODO: Add branch modal for admin in full build */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.base },
  title: { color: COLORS.textPrimary, fontSize: FONTS.xl, fontWeight: FONTS.weightBold },
  addBtn: { padding: SPACING.xs },
  list: { padding: SPACING.sm, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  cardInactive: { borderLeftColor: COLORS.borderSubtle, opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  branchName: { color: COLORS.textPrimary, fontSize: FONTS.lg, fontWeight: FONTS.weightBold },
  comingSoon: { color: COLORS.textMuted, fontSize: FONTS.sm },
  adminRow: { flexDirection: 'row' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, gap: 6 },
  infoText: { color: COLORS.textSecondary, fontSize: FONTS.sm, flex: 1 },
  facilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING.sm },
  facilityTag: { backgroundColor: 'rgba(211,16,39,0.12)', borderWidth: 1, borderColor: 'rgba(211,16,39,0.3)', borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2 },
  facilityText: { color: COLORS.primary, fontSize: FONTS.xs, fontWeight: FONTS.weightMedium },
});
