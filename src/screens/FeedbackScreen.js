// ─────────────────────────────────────────────────────────────────────────────
// src/screens/FeedbackScreen.js
// Member Feedback & Review Screen with interactive rating and loyalty bonus
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useAuth } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const TOPICS = [
  'Equipment & Maintenance',
  'Trainer Coaching & Form',
  'Cleanliness & Hygiene',
  'Music & Atmosphere',
  'Group Class Energy',
  'Steam & Shower Area',
];

const RATING_LABELS = {
  1: 'Needs Improvement ⚠️',
  2: 'Fair 😐',
  3: 'Good 👍',
  4: 'Great Experience! 🔥',
  5: 'Phenomenal & Elite! ⚡',
};

export default function FeedbackScreen({ navigation }) {
  const { addPoints, activeBranchId } = useAuth();
  const { branches } = useGymData();

  const [rating, setRating] = useState(5);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [selectedBranchId, setSelectedBranchId] = useState(activeBranchId || 'b1');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const handleSubmit = () => {
    addPoints(25); // reward member with 25 points for feedback!
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCard}>
          <View style={styles.successIconBox}>
            <Ionicons name="sparkles" size={54} color="#FBBF24" />
          </View>
          <Text style={styles.successTitle}>Thank You for Your Feedback!</Text>
          <Text style={styles.successSub}>
            Your insights have been routed to the SLAM management team at {selectedBranch.name}.
          </Text>

          <View style={styles.bonusBox}>
            <Ionicons name="gift" size={24} color="#22C55E" />
            <View style={{ marginLeft: SPACING.sm }}>
              <Text style={styles.bonusTitle}>+25 Loyalty Points Earned!</Text>
              <Text style={styles.bonusSub}>Credited directly to your member wallet</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSubmitted(false);
              setComments('');
              navigation.goBack();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>Return to App</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.heroBrand}>SLAM MEMBER VOICE</Text>
        <Text style={styles.heroTitle}>How Was Your Workout?</Text>
        <Text style={styles.heroSub}>
          Rate your gym experience and help us keep SLAM at the highest standard. Earn 25 loyalty points for every review!
        </Text>
      </View>

      {/* Star Rating Card */}
      <View style={styles.ratingCard}>
        <Text style={styles.ratingLabel}>TAP TO RATE YOUR SESSION</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starBtn}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={36}
                color={star <= rating ? '#FBBF24' : '#444'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sentimentText}>{RATING_LABELS[rating]}</Text>
      </View>

      {/* Branch Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>WHICH CLUB DID YOU VISIT?</Text>
        <View style={styles.branchRow}>
          {branches.map((b) => {
            const isSelected = selectedBranchId === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.branchChip, isSelected && styles.branchChipSelected]}
                onPress={() => setSelectedBranchId(b.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.branchChipText, isSelected && styles.branchChipTextSelected]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Topic Chips */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FEEDBACK CATEGORY</Text>
        <View style={styles.topicsGrid}>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                style={[styles.topicChip, isSelected && styles.topicChipSelected]}
                onPress={() => setSelectedTopic(topic)}
                activeOpacity={0.7}
              >
                <Text style={[styles.topicChipText, isSelected && styles.topicChipTextSelected]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Detailed Comments */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>YOUR THOUGHTS & SUGGESTIONS</Text>
        <TextInput
          value={comments}
          onChangeText={setComments}
          placeholder="Tell us what you loved or what we can upgrade (e.g. barbell knurling, music playlist, sauna temperature)..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          style={styles.textarea}
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
        <Ionicons name="sparkles" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Feedback (+25 Points)</Text>
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
  ratingCard: {
    backgroundColor: '#161616',
    margin: SPACING.base,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  ratingLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  starRow: {
    flexDirection: 'row',
    gap: 10,
  },
  starBtn: {
    padding: 4,
  },
  sentimentText: {
    color: '#FBBF24',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    marginTop: SPACING.md,
  },
  section: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  branchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  branchChip: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  branchChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  branchChipText: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
  },
  branchChipTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topicChipSelected: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderColor: COLORS.primary,
  },
  topicChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  topicChipTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  textarea: {
    backgroundColor: '#181818',
    color: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#282828',
    padding: SPACING.md,
    fontSize: FONTS.sm,
    height: 100,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    ...SHADOWS.glow,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  successRoot: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.base,
  },
  successCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#161616',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  successIconBox: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBold,
    textAlign: 'center',
  },
  successSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: SPACING.sm,
  },
  bonusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.lg,
    width: '100%',
  },
  bonusTitle: {
    color: '#22C55E',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  bonusSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  backBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
});
