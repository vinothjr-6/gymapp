// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ProfileScreen.js
// Member Profile, Digital Turnstile Pass, Loyalty Points Store, & Referral Hub
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import DigitalPassModal from '../components/DigitalPassModal';
import RewardRedeemModal from '../components/RewardRedeemModal';
import ProfileEditModal from '../components/ProfileEditModal';
import { useAuth } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const REWARDS = [
  {
    id: 'r1',
    title: 'Free Whey Protein Shake',
    points: 200,
    icon: 'nutrition-outline',
    codePrefix: 'SHAKE',
    description: 'Freshly blended whey isolate shake with fruits at the SLAM Café bar.',
  },
  {
    id: 'r2',
    title: '1-on-1 Personal Training Session',
    points: 500,
    icon: 'barbell-outline',
    codePrefix: 'PT',
    description: '60-minute targeted strength or technique session with a senior master coach.',
  },
  {
    id: 'r3',
    title: 'SLAM Athletic Gym Tee',
    points: 750,
    icon: 'shirt-outline',
    codePrefix: 'TEE',
    description: 'Official moisture-wicking SLAM Lifestyle & Fitness performance apparel.',
  },
  {
    id: 'r4',
    title: '1-Month Free Gym Extension',
    points: 1200,
    icon: 'sparkles-outline',
    codePrefix: 'MONTH',
    description: 'Add 30 extra days of all-inclusive membership access across all SLAM clubs.',
  },
];

export default function ProfileScreen({ navigation }) {
  const { user, isAdmin, updateUser, deductPoints, addPoints, activeBranchId } = useAuth();
  const { branches } = useGymData();

  const [passModalVisible, setPassModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const [visitHistory, setVisitHistory] = useState([
    { id: 'v1', time: '06:30 AM', date: 'Yesterday', gate: 'Gate #1', branch: 'Nandanam' },
    { id: 'v2', time: '07:15 PM', date: '10 Oct', gate: 'Gate #2', branch: 'Nandanam' },
    { id: 'v3', time: '06:00 AM', date: '08 Oct', gate: 'Gate #1', branch: 'Anna Nagar' },
  ]);

  if (!user) return null;

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const userPoints = user.loyaltyPoints ?? 1250;

  const handleLogVisit = (newVisit) => {
    setVisitHistory((prev) => [{ id: `v_${Date.now()}`, ...newVisit }, ...prev]);
  };

  const handleRedeemReward = (reward) => {
    deductPoints(reward.points);
  };

  const handleCopyCode = () => {
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Join me at SLAM Lifestyle & Fitness Studio! Use my VIP referral code ${user.referralCode || 'SLAM-VIN-001'} to get 10% OFF any membership plan and a 3-Day Free Trial Pass!`,
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* ── Top Member Card & Digital Pass Trigger ─────────────────────── */}
      <View style={styles.vipPassCard}>
        <View style={styles.passHeader}>
          <View>
            <Text style={styles.passBrand}>SLAM LIFESTYLE & FITNESS</Text>
            <Text style={styles.passType}>VIP MEMBERSHIP PASS</Text>
          </View>
          <View style={styles.activeTag}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeTagText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.memberRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.memberName}>{user.name}</Text>
            <Text style={styles.memberTier}>{user.membershipType} Tier</Text>
            <Text style={styles.memberClub}>Home Club: SLAM {activeBranch?.name}</Text>
          </View>
        </View>

        {/* Turnstile Access Barcode Banner */}
        <TouchableOpacity
          style={styles.qrTriggerBtn}
          onPress={() => setPassModalVisible(true)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={styles.qrTriggerTitle}>Open Digital Turnstile QR Pass</Text>
            <Text style={styles.qrTriggerSub}>Tap to scan & unlock gym gates at {activeBranch?.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Loyalty Points Hero ─────────────────────────────────────────── */}
      <View style={styles.pointsHeroCard}>
        <View style={styles.pointsTopRow}>
          <View>
            <Text style={styles.pointsSubTitle}>SLAM LOYALTY REWARDS</Text>
            <View style={styles.pointsNumberRow}>
              <MaterialCommunityIcons name="trophy-award" size={28} color="#FBBF24" />
              <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
              <Text style={styles.pointsUnit}>POINTS</Text>
            </View>
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={styles.adminPtsBtn}
              onPress={() => addPoints(100)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={16} color={COLORS.primary} />
              <Text style={styles.adminPtsText}>+100 (Admin)</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.pointsExplainer}>
          Earn 10 points for every gym workout logged and 100 points for every friend who joins!
        </Text>
      </View>

      {/* ── Rewards Catalog ────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rewards Catalog</Text>
        <Text style={styles.sectionSub}>Redeem your loyalty points</Text>
      </View>

      <View style={styles.rewardsList}>
        {REWARDS.map((item) => {
          const canAfford = userPoints >= item.points;
          return (
            <View key={item.id} style={styles.rewardCard}>
              <View style={styles.rewardIconBox}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{item.title}</Text>
                <Text style={styles.rewardDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.rewardCostPill}>
                  <Ionicons name="sparkles" size={11} color="#FBBF24" />
                  <Text style={styles.rewardCostText}>{item.points} Points</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.redeemBtn, !canAfford && styles.redeemBtnDisabled]}
                onPress={() => setSelectedReward(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.redeemBtnText}>{canAfford ? 'Redeem' : 'Need Pts'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* ── Referral Hub ──────────────────────────────────────────────── */}
      <View style={styles.referralCard}>
        <View style={styles.referralHeader}>
          <Ionicons name="gift-outline" size={24} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={styles.referralTitle}>Refer Friends & Earn</Text>
            <Text style={styles.referralSub}>Give 10% discount, earn +100 Loyalty Points each</Text>
          </View>
        </View>

        <View style={styles.codeBox}>
          <View>
            <Text style={styles.codeLabel}>YOUR VIP REFERRAL CODE</Text>
            <Text style={styles.codeValue}>{user.referralCode || 'SLAM-VIN-001'}</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode} activeOpacity={0.7}>
            <Ionicons name="copy-outline" size={16} color="#fff" />
            <Text style={styles.copyBtnText}>{copiedToast ? 'Copied!' : 'Copy'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShareReferral} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share Invite Link with Friends</Text>
        </TouchableOpacity>
      </View>

      {/* ── Member Details & Emergency Contact ─────────────────────────── */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Member Details</Text>
          <Text style={styles.sectionSub}>Contact info & fitness preferences</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        {[
          { icon: 'call-outline', label: 'Phone', value: user.phone || '+91 98765 00000' },
          { icon: 'mail-outline', label: 'Email', value: user.email },
          { icon: 'barbell-outline', label: 'Goal', value: user.fitnessGoal || 'Muscle Hypertrophy' },
          { icon: 'shield-outline', label: 'Emergency Contact', value: user.emergencyContact || '+91 98765 11111' },
          { icon: 'calendar-outline', label: 'Member Since', value: user.memberSince || 'January 2025' },
        ].map((item, idx) => (
          <View key={idx} style={[styles.infoRow, idx === 4 && { borderBottomWidth: 0 }]}>
            <Ionicons name={item.icon} size={18} color={COLORS.primary} style={{ width: 24 }} />
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoVal}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Recent Turnstile Check-Ins ──────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Gym Visits</Text>
        <Text style={styles.sectionSub}>Turnstile gate entry logs</Text>
      </View>

      <View style={styles.visitsCard}>
        {visitHistory.slice(0, 4).map((v, i) => (
          <View key={v.id || i} style={[styles.visitRow, i === visitHistory.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.visitIcon}>
              <Ionicons name="walk" size={16} color="#22C55E" />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={styles.visitTitle}>SLAM {v.branch} • {v.gate}</Text>
              <Text style={styles.visitTime}>{v.date} at {v.time}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <DigitalPassModal
        visible={passModalVisible}
        onClose={() => setPassModalVisible(false)}
        user={user}
        branchName={activeBranch?.name}
        onLogVisit={handleLogVisit}
      />

      <RewardRedeemModal
        visible={!!selectedReward}
        reward={selectedReward}
        userPoints={userPoints}
        onConfirm={handleRedeemReward}
        onClose={() => setSelectedReward(null)}
      />

      <ProfileEditModal
        visible={editModalVisible}
        user={user}
        onSave={updateUser}
        onClose={() => setEditModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  vipPassCard: {
    backgroundColor: '#161616',
    margin: SPACING.base,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.3)',
    ...SHADOWS.card,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  passBrand: {
    color: COLORS.primary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
  },
  passType: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: FONTS.weightSemiBold,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderColor: '#22C55E',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  activeTagText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  avatarText: {
    color: '#fff',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBold,
  },
  memberName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
  },
  memberTier: {
    color: '#FBBF24',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginTop: 1,
  },
  memberClub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
  },
  qrTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.glow,
  },
  qrTriggerTitle: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  qrTriggerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 1,
  },
  pointsHeroCard: {
    backgroundColor: '#191919',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    marginBottom: SPACING.lg,
  },
  pointsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pointsSubTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: FONTS.weightBold,
  },
  pointsNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pointsValue: {
    color: '#FBBF24',
    fontSize: FONTS.xxl,
    fontWeight: FONTS.weightBlack,
  },
  pointsUnit: {
    color: '#FBBF24',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    marginTop: 4,
  },
  adminPtsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(211,16,39,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(211,16,39,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  adminPtsText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: FONTS.weightSemiBold,
  },
  pointsExplainer: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: SPACING.sm,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 1,
  },
  rewardsList: {
    marginHorizontal: SPACING.base,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#262626',
  },
  rewardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(211,16,39,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  rewardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  rewardDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  rewardCostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  rewardCostText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  redeemBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  redeemBtnDisabled: {
    backgroundColor: '#333',
  },
  redeemBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  referralCard: {
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    marginBottom: SPACING.md,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  referralTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  referralSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 1,
  },
  codeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: SPACING.md,
  },
  codeLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
  },
  codeValue: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  infoCard: {
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#262626',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  infoVal: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightMedium,
    marginTop: 1,
  },
  visitsCard: {
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#262626',
    overflow: 'hidden',
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  visitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  visitTime: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
});
