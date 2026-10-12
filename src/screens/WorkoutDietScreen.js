// ─────────────────────────────────────────────────────────────────────────────
// src/screens/WorkoutDietScreen.js
// Workout splits & nutrition charts with interactive checklists and Admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import WorkoutPlanDetailModal from '../components/WorkoutPlanDetailModal';
import DietPlanDetailModal from '../components/DietPlanDetailModal';
import WorkoutPlanEditorModal from '../components/WorkoutPlanEditorModal';
import DietPlanEditorModal from '../components/DietPlanEditorModal';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const GOAL_FILTERS = ['ALL', 'Strength', 'Muscle Building', 'Fat Loss'];

export default function WorkoutDietScreen() {
  const {
    workoutPlans,
    dietPlans,
    deletePlan,
    deleteDietPlan,
  } = useGymData();
  const { isAdmin } = useAuth();

  const [tab, setTab] = useState('workout'); // 'workout' | 'diet'
  const [selectedGoal, setSelectedGoal] = useState('ALL');

  // Viewer Modals
  const [viewingWorkout, setViewingWorkout] = useState(null);
  const [viewingDiet, setViewingDiet] = useState(null);

  // Editor Modals
  const [workoutEditorVisible, setWorkoutEditorVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [dietEditorVisible, setDietEditorVisible] = useState(false);
  const [editingDiet, setEditingDiet] = useState(null);

  // Filtered lists
  const filteredWorkoutPlans = useMemo(() => {
    return workoutPlans.filter((p) => {
      if (selectedGoal === 'ALL') return true;
      return p.goal?.toLowerCase().includes(selectedGoal.toLowerCase());
    });
  }, [workoutPlans, selectedGoal]);

  const filteredDietPlans = useMemo(() => {
    return dietPlans.filter((d) => {
      if (selectedGoal === 'ALL') return true;
      return d.goal?.toLowerCase().includes(selectedGoal.toLowerCase());
    });
  }, [dietPlans, selectedGoal]);

  // Admin Actions
  const handleOpenAddModal = () => {
    if (tab === 'workout') {
      setEditingWorkout(null);
      setWorkoutEditorVisible(true);
    } else {
      setEditingDiet(null);
      setDietEditorVisible(true);
    }
  };

  const handleEditWorkout = (plan) => {
    setEditingWorkout(plan);
    setWorkoutEditorVisible(true);
  };

  const handleDeleteWorkout = (plan) => {
    Alert.alert(
      'Delete Workout Plan',
      `Are you sure you want to delete "${plan.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlan(plan.id),
        },
      ]
    );
  };

  const handleEditDiet = (plan) => {
    setEditingDiet(plan);
    setDietEditorVisible(true);
  };

  const handleDeleteDiet = (plan) => {
    Alert.alert(
      'Delete Diet Plan',
      `Are you sure you want to delete "${plan.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDietPlan(plan.id),
        },
      ]
    );
  };

  // Render Workout Card
  const renderWorkoutCard = ({ item }) => {
    const exerciseCount = (item.days || []).reduce(
      (acc, d) => acc + (d.exercises ? d.exercises.length : 0),
      0
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <View style={styles.goalPill}>
              <Text style={styles.goalPillText}>{item.goal?.toUpperCase() || 'PROGRAM'}</Text>
            </View>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>{item.level}</Text>
            </View>
            <View style={styles.durationPill}>
              <Text style={styles.durationPillText}>{item.duration}</Text>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.adminEditBtn}
                onPress={() => handleEditWorkout(item)}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminDeleteBtn}
                onPress={() => handleDeleteWorkout(item)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDesc} numberOfLines={2}>{item.description}</Text>

        <View style={styles.programMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaItemText}>{item.daysPerWeek || 4} days / week</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="barbell-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaItemText}>{(item.days || []).length} Day Splits ({exerciseCount} Moves)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewPlanBtn}
          onPress={() => setViewingWorkout(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="eye-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.viewPlanBtnText}>OPEN WORKOUT PROTOCOL</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render Diet Card
  const renderDietCard = ({ item }) => {
    const totalGrams = (item.protein || 0) + (item.carbs || 0) + (item.fat || 0) || 1;
    const proteinPct = Math.round(((item.protein || 0) / totalGrams) * 100);
    const carbsPct = Math.round(((item.carbs || 0) / totalGrams) * 100);
    const fatPct = Math.round(((item.fat || 0) / totalGrams) * 100);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <View style={[styles.goalPill, { backgroundColor: 'rgba(34,197,94,0.18)', borderColor: '#22C55E' }]}>
              <Text style={[styles.goalPillText, { color: '#22C55E' }]}>{item.goal?.toUpperCase() || 'DIET'}</Text>
            </View>
            <View style={styles.calorieBadge}>
              <Text style={styles.calorieBadgeText}>🔥 {item.calories} KCAL</Text>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.adminEditBtn}
                onPress={() => handleEditDiet(item)}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminDeleteBtn}
                onPress={() => handleDeleteDiet(item)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDesc} numberOfLines={2}>{item.description}</Text>

        {/* Macro Pill Indicators */}
        <View style={styles.macrosPreviewRow}>
          <View style={styles.macroPillBox}>
            <Text style={styles.macroPillLabel}>PROTEIN</Text>
            <Text style={[styles.macroPillValue, { color: '#60A5FA' }]}>{item.protein}g</Text>
          </View>
          <View style={styles.macroPillBox}>
            <Text style={styles.macroPillLabel}>CARBS</Text>
            <Text style={[styles.macroPillValue, { color: '#FBBF24' }]}>{item.carbs}g</Text>
          </View>
          <View style={styles.macroPillBox}>
            <Text style={styles.macroPillLabel}>FATS</Text>
            <Text style={[styles.macroPillValue, { color: '#4ADE80' }]}>{item.fat}g</Text>
          </View>
          <View style={styles.macroPillBox}>
            <Text style={styles.macroPillLabel}>MEALS</Text>
            <Text style={[styles.macroPillValue, { color: '#fff' }]}>{(item.meals || []).length} / day</Text>
          </View>
        </View>

        {/* Macro Multi-Bar */}
        <View style={styles.miniBar}>
          <View style={[styles.miniBarSegment, { width: `${proteinPct}%`, backgroundColor: '#3B82F6' }]} />
          <View style={[styles.miniBarSegment, { width: `${carbsPct}%`, backgroundColor: '#F59E0B' }]} />
          <View style={[styles.miniBarSegment, { width: `${fatPct}%`, backgroundColor: '#22C55E' }]} />
        </View>

        <TouchableOpacity
          style={[styles.viewPlanBtn, { backgroundColor: '#1E293B', borderColor: '#334155' }]}
          onPress={() => setViewingDiet(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="restaurant-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.viewPlanBtnText}>VIEW NUTRITION CHART</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <RoleBanner />

      {/* Segmented Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'workout' && styles.tabBtnActive]}
          onPress={() => setTab('workout')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="barbell"
            size={16}
            color={tab === 'workout' ? '#fff' : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, tab === 'workout' && styles.tabBtnTextActive]}>
            Workout Splits ({workoutPlans.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'diet' && styles.tabBtnActive]}
          onPress={() => setTab('diet')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="nutrition"
            size={16}
            color={tab === 'diet' ? '#fff' : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, tab === 'diet' && styles.tabBtnTextActive]}>
            Diet Charts ({dietPlans.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goal Filter Scroll */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {GOAL_FILTERS.map((g) => {
            const isSelected = selectedGoal === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                onPress={() => setSelectedGoal(g)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <FlatList
        data={tab === 'workout' ? filteredWorkoutPlans : filteredDietPlans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={tab === 'workout' ? renderWorkoutCard : renderDietCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Admin Floating Add Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
          accessibilityLabel="Add new routine"
        >
          <Ionicons name="add" size={28} color="#fff" />
          <Text style={styles.fabText}>
            {tab === 'workout' ? 'Add Split' : 'Add Diet'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Detail Viewer Modals */}
      <WorkoutPlanDetailModal
        visible={Boolean(viewingWorkout)}
        onClose={() => setViewingWorkout(null)}
        plan={viewingWorkout}
      />

      <DietPlanDetailModal
        visible={Boolean(viewingDiet)}
        onClose={() => setViewingDiet(null)}
        plan={viewingDiet}
      />

      {/* Admin Editor Modals */}
      <WorkoutPlanEditorModal
        visible={workoutEditorVisible}
        onClose={() => setWorkoutEditorVisible(false)}
        initialData={editingWorkout}
      />

      <DietPlanEditorModal
        visible={dietEditorVisible}
        onClose={() => setDietEditorVisible(false)}
        initialData={editingDiet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    padding: 6,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  tabBtnTextActive: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  filterSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#303030',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  filterPillSelected: {
    backgroundColor: '#2A2A2A',
    borderColor: COLORS.primary,
  },
  filterPillText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  filterPillTextSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weightBold,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.35)',
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  goalPill: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  goalPillText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  levelPill: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  levelPillText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
  },
  durationPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  durationPillText: {
    color: '#94A3B8',
    fontSize: 9,
  },
  calorieBadge: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#383838',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  calorieBadgeText: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 6,
  },
  adminEditBtn: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  adminDeleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  planTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    marginTop: 4,
    marginBottom: 2,
  },
  planDesc: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  programMetaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: '#1E1E1E',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItemText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
  },
  macrosPreviewRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  macroPillBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroPillLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  macroPillValue: {
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBlack,
    marginTop: 2,
  },
  miniBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginBottom: SPACING.md,
  },
  miniBarSegment: {
    height: '100%',
  },
  viewPlanBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF334B',
    ...SHADOWS.card,
  },
  viewPlanBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#FF334B',
    gap: 6,
    ...SHADOWS.card,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
});
