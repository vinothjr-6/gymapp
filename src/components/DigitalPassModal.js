// ─────────────────────────────────────────────────────────────────────────────
// src/components/DigitalPassModal.js
// Interactive Digital Turnstile Pass Modal with live QR scanning simulation
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function DigitalPassModal({ visible, onClose, user, onLogVisit, branchName }) {
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'success'

  const handleSimulateScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('success');
      if (onLogVisit) {
        onLogVisit({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          gate: 'Turnstile Gate #1',
          branch: branchName || 'Nandanam',
        });
      }
      setTimeout(() => {
        setScanState('idle');
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardBrand}>SLAM FITNESS</Text>
              <Text style={styles.cardSubtitle}>DIGITAL TURNSTILE PASS</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Member Card Shell */}
          <View style={styles.passCard}>
            <View style={styles.passTop}>
              <View>
                <Text style={styles.memberName}>{user?.name || 'Vinoth JR'}</Text>
                <Text style={styles.memberId}>ID: SLAM-MBR-2025-0891</Text>
              </View>
              <View style={styles.tierPill}>
                <Ionicons name="shield-checkmark" size={13} color="#FBBF24" />
                <Text style={styles.tierText}>{user?.membershipType || 'Annual Gold'}</Text>
              </View>
            </View>

            {/* QR Simulation Area */}
            <View style={styles.qrArea}>
              {scanState === 'scanning' ? (
                <View style={styles.scanLoading}>
                  <Ionicons name="scan-outline" size={76} color={COLORS.primary} />
                  <Text style={styles.scanningText}>Verifying Turnstile Beacon...</Text>
                </View>
              ) : scanState === 'success' ? (
                <View style={styles.scanSuccess}>
                  <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
                  <Text style={styles.successTitle}>ACCESS GRANTED</Text>
                  <Text style={styles.successSub}>Welcome to SLAM {branchName || 'Nandanam'}</Text>
                </View>
              ) : (
                <View style={styles.qrMatrix}>
                  {/* High contrast visual QR grid placeholder */}
                  <MaterialCommunityIcons name="qrcode-scan" size={140} color="#000" />
                  <Text style={styles.qrCodeLabel}>{user?.referralCode || 'SLAM-VIN-001'}-PASS</Text>
                </View>
              )}
            </View>

            <View style={styles.passFooter}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Active Branch</Text>
                <Text style={styles.metaVal}>SLAM {branchName || 'Nandanam'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Valid Through</Text>
                <Text style={styles.metaVal}>31 Dec 2026</Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          {scanState === 'idle' && (
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={handleSimulateScan}
              activeOpacity={0.8}
            >
              <Ionicons name="barcode-outline" size={20} color="#fff" />
              <Text style={styles.scanBtnText}>Simulate Turnstile Gate Scan</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.hintText}>
            Hold phone 4 inches above the infrared turnstile reader at any SLAM branch entrance.
          </Text>
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
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#141414',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#262626',
    ...SHADOWS.glow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardBrand: {
    color: COLORS.primary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
  },
  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    letterSpacing: 1,
    fontWeight: FONTS.weightSemiBold,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  passCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.4)',
    marginBottom: SPACING.lg,
  },
  passTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  memberName: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
  },
  memberId: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251,191,36,0.15)',
    borderColor: '#FBBF24',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tierText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  qrArea: {
    height: 180,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
    padding: SPACING.sm,
  },
  qrMatrix: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeLabel: {
    color: '#333',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginTop: 4,
  },
  scanLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    color: COLORS.primary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    marginTop: 8,
  },
  scanSuccess: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: '#22C55E',
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.5,
    marginTop: 6,
  },
  successSub: {
    color: '#4B5563',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
    marginTop: 2,
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
    paddingTop: SPACING.sm,
    marginTop: SPACING.md,
  },
  metaRow: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  metaVal: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginTop: 1,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.glow,
  },
  scanBtnText: {
    color: '#fff',
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
