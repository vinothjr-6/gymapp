import React, { useState } from 'react';
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

export default function WorkoutPlanDetailModal({ visible, onClose, plan }) {
  const [completedExercises, setCompletedExercises] = useState({});
  const [expandedDay, setExpandedDay] = useState(0);

  if (!plan) return null;

  const toggleExercise = (key) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalExercises = (plan.days || []).reduce(
    (acc, d) => acc + (d.exercises ? d.exercises.length : 0),
    0
  );
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPct =
    totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.goalBadge}>
                <Text style={styles.goalBadgeText}>{plan.goal?.toUpperCase() || 'FITNESS'}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{plan.level}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationBadgeText}>{plan.duration}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.desc}>{plan.description}</Text>

          {/* Workout Progress Bar */}
          <View style={styles.progressBox}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Workout Session Progress</Text>
              <Text style={styles.progressValue}>
                {completedCount}/{totalExercises} Completed ({progressPct}%)
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {/* Days Accordion */}
          <ScrollView style={styles.daysScroll} showsVerticalScrollIndicator={false}>
            {(plan.days || []).map((dayObj, dayIdx) => {
              const isExpanded = expandedDay === dayIdx;
              return (
                <View key={dayIdx} style={styles.dayCard}>
                  <TouchableOpacity
                    style={styles.dayHeader}
                    onPress={() => setExpandedDay(isExpanded ? null : dayIdx)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dayHeaderLeft}>
                      <Ionicons
                        name="barbell-outline"
                        size={18}
                        color={COLORS.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.dayTitle}>{dayObj.day}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.exerciseList}>
                      {(dayObj.exercises || []).map((ex, exIdx) => {
                        const key = `${dayIdx}-${exIdx}`;
                        const isDone = Boolean(completedExercises[key]);
                        return (
                          <TouchableOpacity
                            key={exIdx}
                            style={[styles.exerciseItem, isDone && styles.exerciseItemDone]}
                            onPress={() => toggleExercise(key)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={isDone ? 'checkbox' : 'square-outline'}
                              size={20}
                              color={isDone ? '#22C55E' : COLORS.textMuted}
                              style={{ marginRight: 10 }}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[styles.exerciseName, isDone && styles.exerciseNameDone]}
                              >
                                {ex.name}
                              </Text>
                              <Text style={styles.exerciseParams}>
                                🎯 {ex.sets} Sets × {ex.reps} Reps • Rest: {ex.rest || '60s'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.footerNoteText}>
              Tap any exercise on your phone screen to check it off during your workout.
            </Text>
          </View>
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
  levelBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  levelBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
  },
  durationBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  durationBadgeText: {
    color: '#94A3B8',
    fontSize: 9,
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
    marginBottom: SPACING.md,
  },
  progressBox: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightMedium,
  },
  progressValue: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2E2E2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  daysScroll: {
    maxHeight: 380,
  },
  dayCard: {
    backgroundColor: '#1B1B1B',
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: '#222',
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  exerciseList: {
    padding: SPACING.sm,
    gap: 6,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  exerciseItemDone: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  exerciseName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginBottom: 2,
  },
  exerciseNameDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  exerciseParams: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
  },
  footerNoteText: {
    color: COLORS.textMuted,
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },
});
