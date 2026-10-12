// ─────────────────────────────────────────────────────────────────────────────
// src/screens/DealsScreen.js – PLACEHOLDER
// Membership deals & passes. Admin: add/edit/delete. User: view & claim.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function DealsScreen() {
  const { deals } = useGymData();
  const { isAdmin } = useAuth();

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Deals & Passes</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={deals}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Badge */}
            <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
            <Text style={styles.dealTitle}>{item.title}</Text>
            <Text style={styles.dealSub}>{item.subtitle}</Text>

            {/* Pricing */}
            {item.discountedPrice === 0 ? (
              <Text style={styles.free}>FREE</Text>
            ) : (
              <View style={styles.priceRow}>
                <Text style={styles.original}>₹{item.originalPrice.toLocaleString()}</Text>
                <Text style={styles.discounted}>₹{item.discountedPrice.toLocaleString()}</Text>
              </View>
            )}

            {/* Features */}
            {item.features.map((f, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}

            {/* Actions */}
            <View style={styles.actionsRow}>
              {isAdmin ? (
                <>
                  <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.claimBtn}>
                  <Text style={styles.claimBtnText}>Claim This Deal</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {/* TODO: Add/Edit deal modal for admin in full build */}
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
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  badge: { alignSelf: 'flex-start', borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2, marginBottom: SPACING.sm },
  badgeText: { color: '#fff', fontSize: FONTS.xs, fontWeight: FONTS.weightBold, letterSpacing: 0.8 },
  dealTitle: { color: COLORS.textPrimary, fontSize: FONTS.lg, fontWeight: FONTS.weightBold, marginBottom: 2 },
  dealSub: { color: COLORS.textMuted, fontSize: FONTS.sm, marginBottom: SPACING.sm },
  free: { color: COLORS.success, fontSize: FONTS.xxl, fontWeight: FONTS.weightBlack, marginBottom: SPACING.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  original: { color: COLORS.textMuted, fontSize: FONTS.md, textDecorationLine: 'line-through' },
  discounted: { color: COLORS.primary, fontSize: FONTS.xxl, fontWeight: FONTS.weightBold },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  featureText: { color: COLORS.textSecondary, fontSize: FONTS.sm },
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(211,16,39,0.12)', borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  editBtnText: { color: COLORS.primary, fontSize: FONTS.sm, fontWeight: FONTS.weightSemiBold },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.danger, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  deleteBtnText: { color: COLORS.danger, fontSize: FONTS.sm, fontWeight: FONTS.weightSemiBold },
  claimBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.sm, alignItems: 'center' },
  claimBtnText: { color: '#fff', fontSize: FONTS.md, fontWeight: FONTS.weightBold, letterSpacing: 0.5 },
});
