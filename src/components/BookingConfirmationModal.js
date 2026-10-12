import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function BookingConfirmationModal({
  visible,
  onClose,
  classItem,
  onSuccess,
}) {
  const { bookClass, branches } = useGymData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!classItem) return null;

  const branch = branches.find((b) => b.id === classItem.branchId) || branches[0];
  const spotsLeft = Math.max(0, classItem.slots - classItem.bookedSlots);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      bookClass(classItem, user?.id || 'user1');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    }, 600);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {success ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </View>
              <Text style={styles.successTitle}>BOOKING CONFIRMED!</Text>
              <Text style={styles.successSubtitle}>
                You are registered for {classItem.name} with {classItem.trainer}.
              </Text>
              <Text style={styles.successHint}>
                Check your active passes in the "My Bookings" screen.
              </Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.badgeRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{classItem.category.toUpperCase()}</Text>
                  </View>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyBadgeText}>{classItem.difficulty}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{classItem.name}</Text>
              <Text style={styles.trainer}>Coach: {classItem.trainer}</Text>

              {/* Details Box */}
              <View style={styles.detailsBox}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Time & Duration:</Text>
                  <Text style={styles.detailValue}>
                    {classItem.time} ({classItem.duration})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Schedule Days:</Text>
                  <Text style={styles.detailValue}>{classItem.days.join(', ')}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Branch:</Text>
                  <Text style={styles.detailValue}>SLAM {branch?.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Availability:</Text>
                  <Text style={[styles.detailValue, { color: spotsLeft > 3 ? '#22C55E' : '#EF4444' }]}>
                    {spotsLeft} slots left of {classItem.slots}
                  </Text>
                </View>
              </View>

              {/* Perks Note */}
              <View style={styles.perkNote}>
                <Ionicons name="sparkles" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.perkText}>
                  100% Free with your {user?.membershipType || 'Membership'}.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, spotsLeft <= 0 && styles.confirmBtnDisabled]}
                  onPress={handleConfirm}
                  disabled={loading || spotsLeft <= 0}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="ticket-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.confirmBtnText}>
                        {spotsLeft > 0 ? 'Confirm Booking' : 'Class is Full'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.5)',
    padding: SPACING.base,
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
    gap: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  difficultyBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  difficultyBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
  },
  closeBtn: {
    padding: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
    marginTop: 4,
    marginBottom: 2,
  },
  trainer: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    marginBottom: SPACING.md,
  },
  detailsBox: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginLeft: 6,
    width: 110,
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    flex: 1,
  },
  perkNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  perkText: {
    color: '#FBBF24',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#383838',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  confirmBtnDisabled: {
    backgroundColor: '#555',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.6,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.2,
    marginBottom: SPACING.xs,
  },
  successSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successHint: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
  },
});
