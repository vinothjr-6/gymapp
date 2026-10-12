import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function DietPlanDetailModal({ visible, onClose, plan }) {
  if (!plan) return null;

  const totalGrams = (plan.protein || 0) + (plan.carbs || 0) + (plan.fat || 0) || 1;
  const proteinPct = Math.round(((plan.protein || 0) / totalGrams) * 100);
  const carbsPct = Math.round(((plan.carbs || 0) / totalGrams) * 100);
  const fatPct = Math.round(((plan.fat || 0) / totalGrams) * 100);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.goalBadge}>
                <Text style={styles.goalBadgeText}>{plan.goal?.toUpperCase() || 'NUTRITION'}</Text>
              </View>
              <View style={styles.calorieBadge}>
                <Text style={styles.calorieBadgeText}>🔥 {plan.calories} KCAL / DAY</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.desc}>{plan.description}</Text>

          {/* Macro Breakdown Bars */}
          <View style={styles.macroCard}>
            <Text style={styles.macroCardTitle}>DAILY MACRONUTRIENT TARGETS</Text>
            <View style={styles.macroRow}>
              {/* Protein */}
              <View style={styles.macroCol}>
                <View style={[styles.macroPill, { backgroundColor: 'rgba(59,130,246,0.18)', borderColor: '#3B82F6' }]}>
                  <Text style={[styles.macroPillText, { color: '#60A5FA' }]}>PROTEIN</Text>
                </View>
                <Text style={styles.macroGrams}>{plan.protein}g</Text>
                <Text style={styles.macroPct}>{proteinPct}%</Text>
              </View>

              {/* Carbs */}
              <View style={styles.macroCol}>
                <View style={[styles.macroPill, { backgroundColor: 'rgba(245,158,11,0.18)', borderColor: '#F59E0B' }]}>
                  <Text style={[styles.macroPillText, { color: '#FBBF24' }]}>CARBS</Text>
                </View>
                <Text style={styles.macroGrams}>{plan.carbs}g</Text>
                <Text style={styles.macroPct}>{carbsPct}%</Text>
              </View>

              {/* Fat */}
              <View style={styles.macroCol}>
                <View style={[styles.macroPill, { backgroundColor: 'rgba(34,197,94,0.18)', borderColor: '#22C55E' }]}>
                  <Text style={[styles.macroPillText, { color: '#4ADE80' }]}>HEALTHY FATS</Text>
                </View>
                <Text style={styles.macroGrams}>{plan.fat}g</Text>
                <Text style={styles.macroPct}>{fatPct}%</Text>
              </View>
            </View>

            {/* Split Bar */}
            <View style={styles.combinedBar}>
              <View style={[styles.barSegment, { width: `${proteinPct}%`, backgroundColor: '#3B82F6' }]} />
              <View style={[styles.barSegment, { width: `${carbsPct}%`, backgroundColor: '#F59E0B' }]} />
              <View style={[styles.barSegment, { width: `${fatPct}%`, backgroundColor: '#22C55E' }]} />
            </View>
          </View>

          {/* Meal Schedule */}
          <Text style={styles.scheduleTitle}>STRUCTURED MEAL SCHEDULE:</Text>
          <ScrollView style={styles.mealsScroll} showsVerticalScrollIndicator={false}>
            {(plan.meals || []).map((meal, idx) => (
              <View key={idx} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Ionicons name="restaurant-outline" size={15} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                <View style={styles.mealItemsList}>
                  {(meal.items || []).map((food, fIdx) => (
                    <View key={fIdx} style={styles.foodRow}>
                      <Ionicons name="ellipse" size={5} color={COLORS.primary} style={{ marginRight: 8, marginTop: 6 }} />
                      <Text style={styles.foodText}>{food}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Water Recommendation */}
            <View style={styles.waterBox}>
              <Ionicons name="water" size={20} color="#38BDF8" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.waterTitle}>Daily Hydration Goal: 3.5 Liters</Text>
                <Text style={styles.waterSub}>Keep hydrated before, during, and after workouts.</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#161616',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderTopWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.base,
    maxHeight: '90%',
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  goalBadge: {
    backgroundColor: 'rgba(211,16,39,0.2)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  goalBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
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
  closeBtn: {
    padding: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
    marginTop: 6,
    marginBottom: 2,
  },
  desc: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  macroCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#333',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  macroCardTitle: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  macroCol: {
    alignItems: 'center',
    flex: 1,
  },
  macroPill: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  macroPillText: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  macroGrams: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
  },
  macroPct: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  combinedBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginTop: 4,
  },
  barSegment: {
    height: '100%',
  },
  scheduleTitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  mealsScroll: {
    maxHeight: 330,
  },
  mealCard: {
    backgroundColor: '#1B1B1B',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  mealTime: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  mealItemsList: {
    gap: 3,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  foodText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    lineHeight: 18,
    flex: 1,
  },
  waterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56,189,248,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  waterTitle: {
    color: '#38BDF8',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  waterSub: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
