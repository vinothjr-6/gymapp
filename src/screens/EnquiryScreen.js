// ─────────────────────────────────────────────────────────────────────────────
// src/screens/EnquiryScreen.js
// SLAM Fitness Lead & Inquiry Hub – Full interactive submission flow
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const CATEGORIES = [
  { id: 'trial', label: '3-Day Free Trial Pass', icon: 'card-outline' },
  { id: 'membership', label: 'Membership Plans', icon: 'pricetag-outline' },
  { id: 'pt', label: 'Personal Training', icon: 'barbell-outline' },
  { id: 'crossfit', label: 'CrossFit / Classes', icon: 'flame-outline' },
  { id: 'nutrition', label: 'Diet Consultation', icon: 'nutrition-outline' },
  { id: 'corporate', label: 'Corporate Wellness', icon: 'business-outline' },
];

const TIME_SLOTS = ['Morning (8 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening (5 PM – 9 PM)'];

export default function EnquiryScreen({ navigation, route }) {
  const { addEnquiry, branches } = useGymData();
  const { user, activeBranchId, isAdmin } = useAuth();

  const initialCategory = route?.params?.initialCategory || '3-Day Free Trial Pass';

  const [category, setCategory] = useState(initialCategory);
  const [selectedBranchId, setSelectedBranchId] = useState(activeBranchId || 'b1');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [message, setMessage] = useState('');
  const [submittedLead, setSubmittedLead] = useState(null);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please provide both your name and phone number.');
      return;
    }

    const leadTicket = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead = {
      ticketNumber: leadTicket,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      branchId: selectedBranchId,
      branchName: selectedBranch?.name || 'Nandanam',
      type: category,
      preferredTime,
      message: message.trim() || 'General Fitness Inquiry',
    };

    addEnquiry(newLead);
    setSubmittedLead(newLead);
  };

  const handleCallBranch = () => {
    const rawNumber = (selectedBranch?.phone || '+919876543210').replace(/\s+/g, '');
    Linking.openURL(`tel:${rawNumber}`).catch(() => {
      Alert.alert('Phone Call', `Dial ${selectedBranch?.phone} on your mobile.`);
    });
  };

  if (submittedLead) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-done-circle" size={72} color="#22C55E" />
          </View>

          <Text style={styles.successTitle}>Enquiry Registered!</Text>
          <Text style={styles.successTicket}>Ticket #{submittedLead.ticketNumber}</Text>
          <Text style={styles.successSubtitle}>
            Our fitness counselor at SLAM {submittedLead.branchName} will call you back during {submittedLead.preferredTime}.
          </Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Inquiry Topic</Text>
              <Text style={styles.summaryVal}>{submittedLead.type}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Club</Text>
              <Text style={styles.summaryVal}>SLAM {submittedLead.branchName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Contact</Text>
              <Text style={styles.summaryVal}>{submittedLead.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.directCallBtn} onPress={handleCallBranch} activeOpacity={0.8}>
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.directCallBtnText}>Call SLAM {submittedLead.branchName} Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.doneBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* Header Banner */}
      <View style={styles.banner}>
        <Ionicons name="fitness" size={28} color={COLORS.primary} />
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.bannerTitle}>Start Your Transformation</Text>
          <Text style={styles.bannerSubtitle}>
            Get a tailored gym tour, 3-day pass, or speak with an expert fitness consultant.
          </Text>
        </View>
      </View>

      {/* Select Category */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>1. SELECT INQUIRY PURPOSE</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.label;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => setCategory(cat.label)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isSelected ? '#fff' : COLORS.primary}
                />
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Select Branch */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>2. SELECT PREFERRED GYM BRANCH</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branchScroll}>
          {branches.map((b) => {
            const isSelected = selectedBranchId === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.branchChip, isSelected && styles.branchChipSelected]}
                onPress={() => setSelectedBranchId(b.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location"
                  size={14}
                  color={isSelected ? '#fff' : COLORS.textMuted}
                />
                <Text style={[styles.branchChipText, isSelected && styles.branchChipTextSelected]}>
                  SLAM {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Contact Details */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>3. YOUR CONTACT DETAILS</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone Number *</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 00000"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {/* Preferred Callback Time */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Preferred Callback Window</Text>
          <View style={styles.timeRow}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = preferredTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                  onPress={() => setPreferredTime(slot)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Specific Goal / Question (Optional)</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="E.g. Want personal training for weight loss, or schedule a gym tour..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textarea]}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Direct Call Shortcut Card */}
      <View style={styles.callCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.callCardTitle}>Need an instant answer?</Text>
          <Text style={styles.callCardSub}>Direct line to SLAM {selectedBranch?.name} front desk</Text>
        </View>
        <TouchableOpacity style={styles.callCardBtn} onPress={handleCallBranch} activeOpacity={0.7}>
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.callCardBtnText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
        <Ionicons name="paper-plane" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Inquiry to SLAM {selectedBranch?.name}</Text>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    margin: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(211,16,39,0.25)',
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
  },
  bannerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  section: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '48.5%',
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  categoryCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: FONTS.weightSemiBold,
    flex: 1,
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  branchScroll: {
    gap: 8,
  },
  branchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  branchChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  branchChipText: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
  },
  branchChipTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: FONTS.weightSemiBold,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: '#181818',
    color: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#282828',
    paddingHorizontal: SPACING.md,
    paddingVertical: 11,
    fontSize: FONTS.sm,
  },
  textarea: {
    height: 80,
  },
  timeRow: {
    gap: 6,
  },
  timeSlot: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeSlotSelected: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  timeSlotTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: SPACING.lg,
  },
  callCardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
  callCardSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  callCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22C55E',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  callCardBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
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
  successIconCircle: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBold,
  },
  successTicket: {
    color: COLORS.primary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1,
    marginTop: 2,
  },
  successSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: SPACING.md,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  summaryVal: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: FONTS.weightSemiBold,
  },
  directCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    backgroundColor: '#22C55E',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  directCallBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#262626',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
});
