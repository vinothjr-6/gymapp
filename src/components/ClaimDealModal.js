import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ClaimDealModal({ visible, onClose, dealItem }) {
  const { addEnquiry, branches } = useGymData();
  const { user, activeBranchId } = useAuth();

  const [contactMode, setContactMode] = useState('WhatsApp');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 00000');
  const [loading, setLoading] = useState(false);
  const [claimedCode, setClaimedCode] = useState(null);

  if (!dealItem) return null;

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const isFree = dealItem.discountedPrice === 0;
  const savings = dealItem.originalPrice - dealItem.discountedPrice;
  const savingsPct =
    dealItem.originalPrice > 0
      ? Math.round((savings / dealItem.originalPrice) * 100)
      : 0;

  const handleClaim = () => {
    setLoading(true);
    setTimeout(() => {
      const generatedCode = `SLAM-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      addEnquiry({
        name: user?.name || 'Vinoth JR',
        phone: phone.trim(),
        email: user?.email || 'member@slamfitness.com',
        branchId: activeBranch.id,
        branchName: activeBranch.name,
        type: isFree ? 'Trial Pass' : 'Membership Deal',
        message: `Claimed voucher [${generatedCode}] for "${dealItem.title}". Contact preference: ${contactMode}.`,
      });

      setLoading(false);
      setClaimedCode(generatedCode);
    }, 700);
  };

  const handleClose = () => {
    setClaimedCode(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {claimedCode ? (
            /* Voucher Success Card */
            <View style={styles.successBlock}>
              <View style={styles.trophyCircle}>
                <Ionicons name="gift" size={38} color="#fff" />
              </View>
              <Text style={styles.successTitle}>VOUCHER CLAIMED!</Text>
              <Text style={styles.successSub}>
                Your exclusive pass for {dealItem.title} is activated.
              </Text>

              {/* Digital Voucher Code Box */}
              <View style={styles.voucherBox}>
                <Text style={styles.voucherCodeLabel}>DIGITAL VOUCHER CODE</Text>
                <Text style={styles.voucherCodeText}>{claimedCode}</Text>
                <Text style={styles.voucherHint}>
                  Valid at SLAM {activeBranch.name} • Present at reception
                </Text>
              </View>

              <View style={styles.confirmationRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                <Text style={styles.confirmationText}>
                  Our membership team will contact you via {contactMode}.
                </Text>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Back to Deals</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Claim Confirmation Form */
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: dealItem.badgeColor || COLORS.primary }]}>
                  <Text style={styles.badgeText}>{dealItem.badge || 'SPECIAL'}</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{dealItem.title}</Text>
              <Text style={styles.subtitle}>{dealItem.subtitle}</Text>

              {/* Price Banner */}
              <View style={styles.priceBanner}>
                {isFree ? (
                  <Text style={styles.freePrice}>100% FREE PASS</Text>
                ) : (
                  <View style={styles.priceRow}>
                    <Text style={styles.discountedPrice}>
                      ₹{dealItem.discountedPrice.toLocaleString()}
                    </Text>
                    <Text style={styles.originalPrice}>
                      ₹{dealItem.originalPrice.toLocaleString()}
                    </Text>
                    {savingsPct > 0 && (
                      <View style={styles.savingsPill}>
                        <Text style={styles.savingsPillText}>{savingsPct}% OFF</Text>
                      </View>
                    )}
                  </View>
                )}
                {!isFree && savings > 0 && (
                  <Text style={styles.savingsSub}>You save ₹{savings.toLocaleString()} on this plan</Text>
                )}
              </View>

              {/* Inclusions */}
              <Text style={styles.sectionHeader}>WHAT'S INCLUDED:</Text>
              <View style={styles.featuresBox}>
                {dealItem.features.map((feat, idx) => (
                  <View key={idx} style={styles.featRow}>
                    <Ionicons name="checkmark-circle" size={15} color="#22C55E" style={{ marginRight: 6 }} />
                    <Text style={styles.featText}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Contact Confirmation */}
              <Text style={styles.sectionHeader}>YOUR CONTACT NUMBER:</Text>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
              />

              <Text style={styles.sectionHeader}>PREFERRED CONTACT METHOD:</Text>
              <View style={styles.contactRow}>
                {['WhatsApp', 'Phone Call', 'SMS'].map((mode) => {
                  const isSelected = contactMode === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.contactPill, isSelected && styles.contactPillSelected]}
                      onPress={() => setContactMode(mode)}
                    >
                      <Ionicons
                        name={
                          mode === 'WhatsApp'
                            ? 'logo-whatsapp'
                            : mode === 'Phone Call'
                            ? 'call'
                            : 'chatbubble-ellipses'
                        }
                        size={14}
                        color={isSelected ? '#fff' : COLORS.textMuted}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.contactPillText, isSelected && styles.contactPillTextSelected]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} disabled={loading}>
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.claimBtn}
                  onPress={handleClaim}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={16} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.claimBtnText}>
                        {isFree ? 'Claim Free Pass' : 'Claim Voucher'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    padding: SPACING.md,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.5)',
    padding: SPACING.base,
    maxHeight: '88%',
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
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
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginBottom: SPACING.md,
  },
  priceBanner: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  freePrice: {
    color: '#22C55E',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  discountedPrice: {
    color: COLORS.primary,
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
  },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    textDecorationLine: 'line-through',
  },
  savingsPill: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  savingsPillText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  savingsSub: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: FONTS.weightMedium,
    marginTop: 4,
  },
  sectionHeader: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    marginTop: SPACING.sm,
    marginBottom: 6,
  },
  featuresBox: {
    backgroundColor: '#191919',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: 4,
    marginBottom: 4,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
  },
  phoneInput: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.md,
    color: '#fff',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONTS.sm,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  contactPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  contactPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF334B',
  },
  contactPillText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightSemiBold,
  },
  contactPillTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
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
  claimBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  claimBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.6,
  },
  successBlock: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: '#FF334B',
    ...SHADOWS.card,
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  successSub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  voucherBox: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  voucherCodeLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  voucherCodeText: {
    color: '#fff',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
    marginBottom: 4,
  },
  voucherHint: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  confirmationText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
  },
  doneBtn: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: RADIUS.md,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
});
