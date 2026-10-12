// ─────────────────────────────────────────────────────────────────────────────
// src/screens/WorkoutDietScreen.js – PLACEHOLDER
// Workout & diet plans. Admin: add/edit/delete. User: read & follow.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function WorkoutDietScreen() {
  const { workoutPlans, dietPlans } = useGymData();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('workout'); // 'workout' | 'diet'

  return (
    <View style={styles.root}>
      <RoleBanner />

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'workout' && styles.tabActive]}
          onPress={() => setTab('workout')}
        >
          <Text style={[styles.tabText, tab === 'workout' && styles.tabTextActive]}>Workout Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'diet' && styles.tabActive]}
          onPress={() => setTab('diet')}
        >
          <Text style={[styles.tabText, tab === 'diet' && styles.tabTextActive]}>Diet Plans</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle" size={26} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {(tab === 'workout' ? workoutPlans : dietPlans).map((plan) => (
          <View key={plan.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              {isAdmin && (
                <View style={styles.adminRow}>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={{ marginLeft: 8 }} />
                </View>
              )}
            </View>

            {/* Workout plan meta */}
            {tab === 'workout' && (
              <View style={styles.metaRow}>
                {[plan.level, plan.goal, plan.duration, `${plan.daysPerWeek} days/wk`].map((m, i) => (
                  <View key={i} style={styles.metaTag}>
                    <Text style={styles.metaTagText}>{m}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Diet plan macros */}
            {tab === 'diet' && (
              <View style={styles.macroRow}>
                {[
                  { label: 'Calories', value: plan.calories, unit: 'kcal' },
                  { label: 'Protein', value: plan.protein, unit: 'g' },
                  { label: 'Carbs', value: plan.carbs, unit: 'g' },
                  { label: 'Fat', value: plan.fat, unit: 'g' },
                ].map((m, i) => (
                  <View key={i} style={styles.macroBox}>
                    <Text style={styles.macroValue}>{m.value}<Text style={styles.macroUnit}>{m.unit}</Text></Text>
                    <Text style={styles.macroLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.description}>{plan.description}</Text>

            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Full Plan</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {/* TODO: Full plan detail modal + admin add/edit forms in full build */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  tabRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle, paddingHorizontal: SPACING.sm },
  tab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.base },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontSize: FONTS.md, fontWeight: FONTS.weightSemiBold },
  tabTextActive: { color: COLORS.primary },
  addBtn: { marginLeft: 'auto', padding: SPACING.sm },
  list: { padding: SPACING.sm, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  planTitle: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: FONTS.weightBold, flex: 1, marginRight: SPACING.sm },
  adminRow: { flexDirection: 'row' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm },
  metaTag: { backgroundColor: 'rgba(211,16,39,0.12)', borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(211,16,39,0.25)' },
  metaTagText: { color: COLORS.primary, fontSize: FONTS.xs, fontWeight: FONTS.weightSemiBold },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  macroBox: { alignItems: 'center' },
  macroValue: { color: COLORS.textPrimary, fontSize: FONTS.lg, fontWeight: FONTS.weightBold },
  macroUnit: { color: COLORS.textMuted, fontSize: FONTS.xs },
  macroLabel: { color: COLORS.textMuted, fontSize: FONTS.xs },
  description: { color: COLORS.textSecondary, fontSize: FONTS.sm, lineHeight: 20, marginBottom: SPACING.md },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewBtnText: { color: COLORS.primary, fontSize: FONTS.sm, fontWeight: FONTS.weightSemiBold },
});
