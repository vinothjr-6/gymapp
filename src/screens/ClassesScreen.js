// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ClassesScreen.js
// Interactive weekly class schedule with Admin CRUD and Member 1-Tap Booking
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import ClassEditorModal from '../components/ClassEditorModal';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const DAYS = ['ALL', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES = ['ALL', 'CrossFit', 'Yoga', 'HIIT', 'Strength', 'Dance'];

const CATEGORY_COLORS = {
  CrossFit: '#EF4444',
  Yoga: '#8B5CF6',
  HIIT: '#F97316',
  Strength: '#06B6D4',
  Dance: '#EC4899',
  Boxing: '#EAB308',
};

export default function ClassesScreen({ navigation }) {
  const { classes, deleteClass, bookings, cancelBooking, branches } = useGymData();
  const { isAdmin, activeBranchId } = useAuth();

  const [selectedDay, setSelectedDay] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterByBranch, setFilterByBranch] = useState(false);

  // Modals state
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedClassForBooking, setSelectedClassForBooking] = useState(null);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Day filter
      if (selectedDay !== 'ALL' && !c.days.includes(selectedDay)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) {
        return false;
      }
      // Branch filter
      if (filterByBranch && c.branchId !== activeBranchId) {
        return false;
      }
      return true;
    });
  }, [classes, selectedDay, selectedCategory, filterByBranch, activeBranchId]);

  // Check if a class is already booked by the user
  const isClassBookedByUser = (classId) => {
    return bookings.some((b) => b.classId === classId);
  };

  const getUserBookingForClass = (classId) => {
    return bookings.find((b) => b.classId === classId);
  };

  // Admin actions
  const handleOpenAddModal = () => {
    setEditingClass(null);
    setEditorVisible(true);
  };

  const handleOpenEditModal = (classItem) => {
    setEditingClass(classItem);
    setEditorVisible(true);
  };

  const handleDeleteClass = (classItem) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${classItem.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteClass(classItem.id),
        },
      ]
    );
  };

  // User booking action
  const handleOpenBooking = (classItem) => {
    setSelectedClassForBooking(classItem);
    setBookingModalVisible(true);
  };

  const handleCancelUserBooking = (classItem) => {
    const existing = getUserBookingForClass(classItem.id);
    if (!existing) return;

    Alert.alert(
      'Cancel Reservation',
      `Would you like to cancel your reservation for "${classItem.name}"?`,
      [
        { text: 'Keep Slot', style: 'cancel' },
        {
          text: 'Cancel Reservation',
          style: 'destructive',
          onPress: () => cancelBooking(existing.id),
        },
      ]
    );
  };

  const renderClassItem = ({ item }) => {
    const isBooked = isClassBookedByUser(item.id);
    const spotsLeft = Math.max(0, item.slots - item.bookedSlots);
    const isFull = spotsLeft <= 0;
    const branch = branches.find((b) => b.id === item.branchId);
    const categoryColor = CATEGORY_COLORS[item.category] || COLORS.primary;
    const capacityPct = Math.min(100, Math.round((item.bookedSlots / item.slots) * 100));

    return (
      <View style={[styles.card, { borderLeftColor: categoryColor }]}>
        {/* Top Badges & Difficulty */}
        <View style={styles.cardHeader}>
          <View style={styles.badgeGroup}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}25`, borderColor: categoryColor }]}>
              <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyBadgeText}>{item.difficulty}</Text>
            </View>
            {branch && (
              <View style={styles.branchPill}>
                <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                <Text style={styles.branchPillText}>{branch.name}</Text>
              </View>
            )}
          </View>

          {/* Time slot pill */}
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.timePillText}>{item.time}</Text>
          </View>
        </View>

        {/* Title & Trainer */}
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.trainerRow}>
          <Ionicons name="person-circle-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.trainer}>{item.trainer}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>

        {/* Operating days */}
        <View style={styles.daysContainer}>
          <Text style={styles.daysLabel}>Days:</Text>
          <View style={styles.daysPillRow}>
            {item.days.map((day) => (
              <View key={day} style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Capacity / Slots Progress Bar */}
        <View style={styles.capacitySection}>
          <View style={styles.capacityTextRow}>
            <Text style={styles.capacityLabel}>Session Capacity</Text>
            <Text style={[styles.capacityValue, isFull ? { color: '#EF4444' } : { color: '#22C55E' }]}>
              {isFull ? 'SESSION FULL' : `${spotsLeft} spots available (${item.bookedSlots}/${item.slots})`}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${capacityPct}%`,
                  backgroundColor: isFull ? '#EF4444' : capacityPct > 80 ? '#F97316' : COLORS.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Bottom Actions based on Role */}
        <View style={styles.cardFooter}>
          {isAdmin ? (
            /* Admin Controls */
            <View style={styles.adminControlRow}>
              <View style={styles.adminRosterBadge}>
                <Ionicons name="people" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.adminRosterText}>{item.bookedSlots} Registered</Text>
              </View>
              <View style={styles.adminActionButtons}>
                <TouchableOpacity
                  style={styles.adminEditBtn}
                  onPress={() => handleOpenEditModal(item)}
                  accessibilityLabel="Edit class"
                >
                  <Ionicons name="create-outline" size={16} color="#fff" />
                  <Text style={styles.adminEditBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.adminDeleteBtn}
                  onPress={() => handleDeleteClass(item)}
                  accessibilityLabel="Delete class"
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* User Member Controls */
            <View style={styles.userActionRow}>
              {isBooked ? (
                <TouchableOpacity
                  style={styles.bookedBtn}
                  onPress={() => handleCancelUserBooking(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginRight: 6 }} />
                  <Text style={styles.bookedBtnText}>Booked (Tap to Cancel)</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.bookSlotBtn, isFull && styles.bookSlotBtnDisabled]}
                  onPress={() => handleOpenBooking(item)}
                  disabled={isFull}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isFull ? 'alert-circle-outline' : 'ticket-outline'}
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.bookSlotBtnText}>
                    {isFull ? 'Class Full' : 'Book Session Slot'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <RoleBanner />

      {/* Screen Title & Branch Filter Row */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.pageTitle}>CLASSES & SCHEDULE</Text>
          <Text style={styles.pageSubtitle}>
            {filteredClasses.length} sessions available {selectedDay !== 'ALL' ? `on ${selectedDay}` : 'this week'}
          </Text>
        </View>

        {/* Branch Filter Switcher */}
        <TouchableOpacity
          style={[styles.branchFilterBtn, filterByBranch && styles.branchFilterBtnActive]}
          onPress={() => setFilterByBranch(!filterByBranch)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="location"
            size={12}
            color={filterByBranch ? '#fff' : COLORS.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.branchFilterText, filterByBranch && styles.branchFilterTextActive]}>
            {filterByBranch ? activeBranch.name : 'All Gyms'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Day of Week Selector ────────────────────────────────────── */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayPillText, isSelected && styles.dayPillTextSelected]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Category Filter Row ─────────────────────────────────────── */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isSelected && styles.catPillSelected]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.catPillText, isSelected && styles.catPillTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Classes List ───────────────────────────────────────────── */}
      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderClassItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#444" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
            <Text style={styles.emptySubtitle}>
              No workouts match the selected day or category filters.
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersBtn}
              onPress={() => {
                setSelectedDay('ALL');
                setSelectedCategory('ALL');
                setFilterByBranch(false);
              }}
            >
              <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── Floating Action Button (Admin Add Class) ──────────────── */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
          accessibilityLabel="Add new class schedule"
        >
          <Ionicons name="add" size={28} color="#fff" />
          <Text style={styles.fabText}>Add Class</Text>
        </TouchableOpacity>
      )}

      {/* Admin Class Editor Modal */}
      <ClassEditorModal
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        initialData={editingClass}
      />

      {/* User Booking Confirmation Modal */}
      <BookingConfirmationModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        classItem={selectedClassForBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.5,
  },
  pageSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
  },
  branchFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  branchFilterBtnActive: {
    backgroundColor: 'rgba(211,16,39,0.2)',
    borderColor: COLORS.primary,
  },
  branchFilterText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: FONTS.weightSemiBold,
  },
  branchFilterTextActive: {
    color: COLORS.primary,
  },
  filterSection: {
    marginTop: SPACING.sm,
  },
  categorySection: {
    marginTop: 6,
    marginBottom: SPACING.xs,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  dayPill: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#303030',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  dayPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF334B',
  },
  dayPillText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  dayPillTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  catPill: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  catPillSelected: {
    backgroundColor: '#2A2A2A',
    borderColor: COLORS.border,
  },
  catPillText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: FONTS.weightMedium,
  },
  catPillTextSelected: {
    color: COLORS.textPrimary,
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
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.6,
  },
  difficultyBadge: {
    backgroundColor: '#242424',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  difficultyBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
  },
  branchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  branchPillText: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  timePillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: FONTS.weightBold,
  },
  className: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    marginTop: 4,
    marginBottom: 2,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  trainer: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
  },
  bullet: {
    color: COLORS.textMuted,
    marginHorizontal: 6,
  },
  duration: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  daysLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginRight: 6,
    textTransform: 'uppercase',
  },
  daysPillRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayBadge: {
    backgroundColor: '#222',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dayBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
  },
  capacitySection: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  capacityTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  capacityLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  capacityValue: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#2C2C2C',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: SPACING.sm,
  },
  adminControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminRosterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminRosterText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
  },
  adminActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  adminEditBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  adminDeleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  userActionRow: {
    alignItems: 'stretch',
  },
  bookSlotBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    ...SHADOWS.card,
  },
  bookSlotBtnDisabled: {
    backgroundColor: '#333',
  },
  bookSlotBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bookedBtn: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  bookedBtnText: {
    color: '#22C55E',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  clearFiltersBtn: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  clearFiltersBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
});
