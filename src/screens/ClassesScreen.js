// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ClassesScreen.js – PLACEHOLDER
// Displays class schedule. Admin: add/edit/delete. User: view & book.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ClassesScreen() {
  const { classes } = useGymData();
  const { isAdmin } = useAuth();

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Class Schedule</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={classes}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.trainer}>🏋️ {item.trainer}</Text>
              <Text style={styles.meta}>{item.time} · {item.duration} · {item.days.join(', ')}</Text>
              <Text style={styles.difficulty}>{item.difficulty} · {item.category}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.slots}>{item.bookedSlots}/{item.slots}</Text>
              <Text style={styles.slotsLabel}>Slots</Text>
              {isAdmin ? (
                <View style={styles.adminActions}>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={{ marginTop: 6 }} />
                </View>
              ) : (
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {/* TODO: Implement add/edit modal and book class logic in full build */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.base },
  title: { color: COLORS.textPrimary, fontSize: FONTS.xl, fontWeight: FONTS.weightBold },
  addBtn: { padding: SPACING.xs },
  list: { padding: SPACING.sm },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  cardLeft: { flex: 1 },
  className: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: FONTS.weightBold, marginBottom: 2 },
  trainer: { color: COLORS.textSecondary, fontSize: FONTS.sm, marginBottom: 2 },
  meta: { color: COLORS.textMuted, fontSize: FONTS.xs, marginBottom: 2 },
  difficulty: { color: COLORS.primary, fontSize: FONTS.xs, fontWeight: FONTS.weightSemiBold },
  cardRight: { alignItems: 'center', justifyContent: 'center', width: 60 },
  slots: { color: COLORS.textPrimary, fontSize: FONTS.lg, fontWeight: FONTS.weightBold },
  slotsLabel: { color: COLORS.textMuted, fontSize: FONTS.xs, marginBottom: SPACING.xs },
  adminActions: { alignItems: 'center', marginTop: SPACING.xs },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4, marginTop: SPACING.xs },
  bookBtnText: { color: '#fff', fontSize: FONTS.xs, fontWeight: FONTS.weightBold },
});
