// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ReferScreen.js
// SLAM Referral Program Hub – Share code, track friend invites & rewards
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ReferScreen({ navigation }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'SLAM-VIN-001';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 Join me at SLAM Lifestyle & Fitness Studio! Use my VIP Referral Code *${referralCode}* to get 10% OFF on any membership and an exclusive 3-Day Free Gym Pass: https://slamfitness.com/join?ref=${referralCode}`,
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={14} color="#FBBF24" />
          <Text style={styles.heroBadgeText}>VIP REFERRAL REWARDS</Text>
        </View>
        <Text style={styles.heroTitle}>Invite Friends.{'\n'}Level Up Together.</Text>
        <Text style={styles.heroSub}>
          Give your friends a 3-Day Free Trial Pass + 10% discount on membership. Earn 100 Loyalty Points for every workout buddy who joins!
        </Text>
      </View>

      {/* Code Box Card */}
      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>YOUR UNIQUE REFERRAL CODE</Text>
        <View style={styles.codeRow}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="#fff" />
            <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Ionicons name="share-social" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Share Invite Link with Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Counters */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Invites Sent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statNumber, { color: '#22C55E' }]}>3</Text>
          <Text style={styles.statLabel}>Friends Joined</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statNumber, { color: '#FBBF24' }]}>+300</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </View>

      {/* Step by Step Guide */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSub}>3 quick steps to earn rewards</Text>
      </View>

      <View style={styles.stepsCard}>
        {[
          {
            step: '1',
            icon: 'share-social-outline',
            title: 'Share Your VIP Code',
            desc: 'Send your link or referral code to friends, family, or gym colleagues via WhatsApp or social media.',
          },
          {
            step: '2',
            icon: 'walk-outline',
            title: 'Friend Claims 3-Day Pass',
            desc: 'Your buddy presents your code at any SLAM branch reception to receive free access and 10% off membership.',
          },
          {
            step: '3',
            icon: 'trophy-outline',
            title: 'Both of You Win',
            desc: 'You automatically receive +100 Loyalty Points in your wallet, redeemable for personal training and shakes.',
          },
        ].map((item, idx) => (
          <View key={item.step} style={[styles.stepItem, idx === 2 && { borderBottomWidth: 0 }]}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Referral Activity Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Friend Activity</Text>
        <Text style={styles.sectionSub}>Recent signups using your code</Text>
      </View>

      <View style={styles.activityCard}>
        {[
          { name: 'Karthik R.', action: 'Joined SLAM Nandanam', reward: '+100 PTS', date: '2 days ago' },
          { name: 'Sneha M.', action: 'Activated 3-Day Free Pass', reward: 'Pending', date: '5 days ago' },
          { name: 'Praveen K.', action: 'Joined SLAM Anna Nagar', reward: '+100 PTS', date: '12 days ago' },
        ].map((act, i) => (
          <View key={i} style={[styles.activityRow, i === 2 && { borderBottomWidth: 0 }]}>
            <View style={styles.activityAvatar}>
              <Text style={styles.activityAvatarText}>{act.name[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={styles.activityName}>{act.name}</Text>
              <Text style={styles.activityAction}>{act.action} • {act.date}</Text>
            </View>
            <View style={[styles.rewardTag, act.reward === 'Pending' ? styles.pendingTag : styles.earnedTag]}>
              <Text style={[styles.rewardTagText, act.reward === 'Pending' ? styles.pendingText : styles.earnedText]}>
                {act.reward}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Spend points CTA */}
      <TouchableOpacity
        style={styles.pointsCta}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="trophy-award" size={24} color="#FBBF24" />
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.pointsCtaTitle}>Check Rewards Catalog</Text>
          <Text style={styles.pointsCtaSub}>Redeem your {user?.loyaltyPoints || 1250} points in your profile</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>
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
  hero: {
    padding: SPACING.base,
    paddingTop: SPACING.lg,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xxl,
    fontWeight: FONTS.weightBlack,
    lineHeight: 32,
  },
  heroSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  codeCard: {
    backgroundColor: '#161616',
    margin: SPACING.base,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1.5,
    borderColor: 'rgba(139,92,246,0.4)',
    ...SHADOWS.card,
  },
  codeTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: FONTS.weightBold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F1F1F',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    paddingLeft: SPACING.md,
    borderWidth: 1,
    borderColor: '#2F2F2F',
    marginBottom: SPACING.md,
  },
  codeText: {
    color: '#fff',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#2E2E2E',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  copyBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.glow,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: SPACING.lg,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#262626',
  },
  sectionHeader: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  stepsCard: {
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#262626',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  stepNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  stepTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  stepDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: '#161616',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#262626',
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  activityAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityAvatarText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  activityName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  activityAction: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  rewardTag: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  earnedTag: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  earnedText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  pendingTag: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  pendingText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  pointsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  pointsCtaTitle: {
    color: '#FBBF24',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  pointsCtaSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
});
