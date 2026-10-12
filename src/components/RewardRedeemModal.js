// ─────────────────────────────────────────────────────────────────────────────
// src/components/RewardRedeemModal.js
// Modal to confirm loyalty points redemption and display generated voucher
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function RewardRedeemModal({
  visible,
  reward,
  userPoints = 0,
  onConfirm,
  onClose,
}) {
  const [claimedVoucher, setClaimedVoucher] = useState(null);

  if (!reward) return null;

  const canAfford = userPoints >= reward.points;

  const handleClaim = () => {
    if (!canAfford) {
      Alert.alert('Insufficient Points', `You need ${reward.points - userPoints} more points to claim this reward.`);
      return;
    }
    const code = `SLAM-${reward.codePrefix || 'RWD'}-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimedVoucher(code);
    if (onConfirm) {
      onConfirm(reward);
    }
  };

  const handleClose = () => {
    setClaimedVoucher(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {claimedVoucher ? 'Voucher Claimed!' : 'Redeem Reward'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {claimedVoucher ? (
            /* Claimed Success Screen */
            <View style={styles.successBlock}>
              <View style={styles.successIconBox}>
                <Ionicons name="gift" size={48} color="#22C55E" />
              </View>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.successSub}>
                Show this voucher code at any SLAM Fitness reception to claim your reward.
              </Text>

              <View style={styles.voucherBox}>
                <Text style={styles.voucherLabel}>YOUR VOUCHER CODE</Text>
                <Text style={styles.voucherCode}>{claimedVoucher}</Text>
                <Text style={styles.voucherExpiry}>Valid for 7 days from today</Text>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Confirmation Flow */
            <View>
              <View style={styles.rewardPreview}>
                <View style={styles.iconCircle}>
                  <Ionicons name={reward.icon || 'gift'} size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDesc}>{reward.description}</Text>
              </View>

              <View style={styles.pointsBreakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Current Points Balance</Text>
                  <Text style={styles.breakdownVal}>{userPoints.toLocaleString()} PTS</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Cost</Text>
                  <Text style={[styles.breakdownVal, { color: COLORS.primary }]}>-{reward.points.toLocaleString()} PTS</Text>
                </View>
                <View style={[styles.breakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Balance After Claim</Text>
                  <Text style={[styles.totalVal, !canAfford && { color: '#EF4444' }]}>
                    {canAfford ? `${(userPoints - reward.points).toLocaleString()} PTS` : 'Insufficient Points'}
                  </Text>
                </View>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.claimBtn, !canAfford && styles.claimBtnDisabled]}
                  onPress={handleClaim}
                  disabled={!canAfford}
                >
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text style={styles.claimBtnText}>Claim Reward</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.base,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#161616',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#262626',
    ...SHADOWS.glow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  rewardPreview: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(211,16,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211,16,39,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  rewardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
    textAlign: 'center',
  },
  rewardDesc: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: SPACING.md,
  },
  pointsBreakdown: {
    backgroundColor: '#1C1C1C',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
  },
  breakdownVal: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  totalVal: {
    color: '#22C55E',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  claimBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.glow,
  },
  claimBtnDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.6,
  },
  claimBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  successBlock: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  successIconBox: {
    marginBottom: SPACING.sm,
  },
  successSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  voucherBox: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#22C55E',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    padding: SPACING.md,
    marginVertical: SPACING.lg,
  },
  voucherLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: FONTS.weightBold,
  },
  voucherCode: {
    color: '#22C55E',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
    marginVertical: 4,
  },
  voucherExpiry: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#fff',
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
});
