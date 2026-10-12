// ─────────────────────────────────────────────────────────────────────────────
// src/screens/EnquiryScreen.js – PLACEHOLDER
// Enquiry / trial pass form. Both roles can submit.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function EnquiryScreen({ navigation }) {
  const { addEnquiry } = useGymData();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !phone) {
      Alert.alert('Missing Fields', 'Please enter your name and phone number.');
      return;
    }
    addEnquiry({ name, phone, email, message, type: 'General' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={70} color={COLORS.success} />
        </View>
        <Text style={styles.successTitle}>Enquiry Submitted!</Text>
        <Text style={styles.successText}>
          Our team at SLAM Fitness will get back to you within 24 hours.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <RoleBanner />
      <View style={styles.header}>
        <Ionicons name="call-outline" size={32} color={COLORS.primary} />
        <Text style={styles.title}>Enquire Now</Text>
        <Text style={styles.subtitle}>Fill in your details and we'll call you back shortly.</Text>
      </View>

      {[
        { label: 'Full Name *', value: name, setter: setName, placeholder: 'Your full name', keyboard: 'default' },
        { label: 'Phone Number *', value: phone, setter: setPhone, placeholder: '+91 XXXXX XXXXX', keyboard: 'phone-pad' },
        { label: 'Email Address', value: email, setter: setEmail, placeholder: 'you@example.com', keyboard: 'email-address' },
      ].map((field) => (
        <View key={field.label} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.textMuted}
            keyboardType={field.keyboard}
            style={styles.input}
          />
        </View>
      ))}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Message (Optional)</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Any specific query or interest..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textarea]}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Ionicons name="send" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Enquiry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { paddingBottom: SPACING.xxxl },
  header: { alignItems: 'center', padding: SPACING.xl },
  title: { color: COLORS.textPrimary, fontSize: FONTS.xxl, fontWeight: FONTS.weightBold, marginTop: SPACING.sm },
  subtitle: { color: COLORS.textMuted, fontSize: FONTS.sm, textAlign: 'center', marginTop: 4 },
  fieldGroup: { marginHorizontal: SPACING.base, marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sm, fontWeight: FONTS.weightSemiBold, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.bgCard, color: COLORS.textPrimary, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderSubtle, padding: SPACING.md, fontSize: FONTS.md },
  textarea: { height: 100 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, marginHorizontal: SPACING.base, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, marginTop: SPACING.md },
  submitBtnText: { color: '#fff', fontSize: FONTS.lg, fontWeight: FONTS.weightBold },
  successContainer: { flex: 1, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  successIcon: { marginBottom: SPACING.lg },
  successTitle: { color: COLORS.textPrimary, fontSize: FONTS.xxl, fontWeight: FONTS.weightBold, marginBottom: SPACING.sm },
  successText: { color: COLORS.textMuted, fontSize: FONTS.md, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  backBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  backBtnText: { color: '#fff', fontSize: FONTS.md, fontWeight: FONTS.weightBold },
});
