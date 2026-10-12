// ─────────────────────────────────────────────────────────────────────────────
// src/screens/TermsScreen.js
// SLAM Fitness Terms of Service, Gym Etiquette & Studio Policies
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const SECTIONS = [
  {
    id: 'etiquette',
    title: '1. Gym Etiquette & Weight Room Conduct',
    icon: 'barbell-outline',
    content: [
      'Always re-rack weights, dumbbells, and barbells immediately after completing your sets.',
      'Gym towels are mandatory. Please wipe down benches and cardio equipment with provided disinfectant spray after use.',
      'Wear clean, dedicated athletic training shoes. Barefoot lifting is permitted only on designated deadlift platforms.',
      'Dropping iron dumbbells or slamming selectorized weight stacks is strictly prohibited.',
    ],
  },
  {
    id: 'access',
    title: '2. Turnstile Access & Digital Pass',
    icon: 'card-outline',
    content: [
      'Your digital membership pass is strictly non-transferable and tied to your registered biometric profile.',
      'Scan your digital QR pass at turnstile entry gates for every club visit.',
      'Allowing an unregistered guest to use your pass will result in automatic membership suspension.',
    ],
  },
  {
    id: 'lockers',
    title: '3. Locker Rooms & Valuables',
    icon: 'lock-closed-outline',
    content: [
      'Lockers are for daily use only during your active workout session.',
      'Any locks left overnight will be opened by facility security at closing time.',
      'SLAM Fitness is not liable for loss or theft of personal items left in lockers or common areas.',
    ],
  },
  {
    id: 'freeze',
    title: '4. Membership Freeze & Transfers',
    icon: 'pause-circle-outline',
    content: [
      'Annual Gold members may request up to 60 days of complimentary membership freeze per year for medical reasons.',
      'A valid medical doctor certificate is required for freezes exceeding 14 calendar days.',
      'One-time membership transfers to an immediate family member are permitted with a nominal ₹1,000 transfer fee.',
    ],
  },
  {
    id: 'safety',
    title: '5. Safety, Health & Liability Waiver',
    icon: 'shield-checkmark-outline',
    content: [
      'Members must disclose any pre-existing cardiovascular conditions, spinal injuries, or chronic medical issues.',
      'Please warm up adequately and utilize spotters when attempting heavy 1-rep maximum lifts.',
      'Emergency first-aid kits and AED defibrillators are stationed at every club reception and trainer desk.',
    ],
  },
  {
    id: 'privacy',
    title: '6. Filming & Photography Etiquette',
    icon: 'camera-outline',
    content: [
      'Tripods must not block walkways, fire exits, or impede fellow members’ movement.',
      'Filming inside steam rooms, saunas, and locker rooms is strictly forbidden under all circumstances.',
      'Always seek verbal consent if other gym members are visible in your workout videos.',
    ],
  },
];

export default function TermsScreen() {
  const [expandedId, setExpandedId] = useState('etiquette');

  const toggleSection = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.heroBrand}>SLAM STUDIO POLICIES</Text>
        <Text style={styles.heroTitle}>Rules & Etiquette</Text>
        <Text style={styles.heroSub}>
          Our code of conduct guarantees a safe, respectful, and high-energy training environment for all members across all clubs.
        </Text>
      </View>

      {/* Accordion Sections */}
      <View style={styles.sectionsList}>
        {SECTIONS.map((sec) => {
          const isExpanded = expandedId === sec.id;
          return (
            <View key={sec.id} style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(sec.id)}
                activeOpacity={0.7}
              >
                <Ionicons name={sec.icon} size={20} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.sectionBody}>
                  {sec.content.map((point, idx) => (
                    <View key={idx} style={styles.pointRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Support Contact Box */}
      <View style={styles.supportBox}>
        <Ionicons name="help-buoy-outline" size={24} color={COLORS.primary} />
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.supportTitle}>Questions Regarding Your Agreement?</Text>
          <Text style={styles.supportSub}>
            Reach our member operations team at support@slamfitness.com or speak with your branch manager.
          </Text>
        </View>
      </View>
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
  heroBrand: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xxl,
    fontWeight: FONTS.weightBlack,
    marginTop: 2,
  },
  heroSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  sectionsList: {
    marginHorizontal: SPACING.base,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sectionCard: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#262626',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
  },
  sectionTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  sectionBody: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: SPACING.sm,
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 8,
  },
  pointText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  supportTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  supportSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});
