// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProfileEditModal.js
// Modal allowing member to update their profile and fitness goals
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const GOALS = ['Muscle Hypertrophy', 'Fat Loss & Shred', 'Endurance & Stamina', 'Strength & Power', 'General Health'];

export default function ProfileEditModal({ visible, user, onSave, onClose }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [goal, setGoal] = useState(user?.fitnessGoal || 'Muscle Hypertrophy');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+91 98765 11111');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    onSave({
      name,
      email,
      phone,
      fitnessGoal: goal,
      emergencyContact,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Edit Member Profile</Text>
              <Text style={styles.headerSub}>Update your contact & fitness preferences</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@slamfitness.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 00000"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Emergency Contact Number</Text>
              <TextInput
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Fitness Goal */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Primary Fitness Goal</Text>
              <View style={styles.goalChips}>
                {GOALS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, goal === g && styles.chipActive]}
                    onPress={() => setGoal(g)}
                  >
                    <Text style={[styles.chipText, goal === g && styles.chipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.base,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
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
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
  },
  headerSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scroll: {
    paddingBottom: SPACING.base,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#303030',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONTS.sm,
  },
  goalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
});
