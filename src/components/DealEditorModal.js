import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const BADGE_PRESETS = [
  { label: 'BEST SELLER', color: '#D31027' },
  { label: 'POPULAR', color: '#D97706' },
  { label: 'FREE TRIAL', color: '#22C55E' },
  { label: 'STUDENT', color: '#3B82F6' },
  { label: 'LIMITED OFFER', color: '#8B5CF6' },
];

export default function DealEditorModal({ visible, onClose, initialData = null }) {
  const { addDeal, updateDeal } = useGymData();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState('24000');
  const [discountedPrice, setDiscountedPrice] = useState('18000');
  const [badge, setBadge] = useState('BEST SELLER');
  const [badgeColor, setBadgeColor] = useState('#D31027');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [validTill, setValidTill] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSubtitle(initialData.subtitle || '');
      setOriginalPrice(String(initialData.originalPrice || 0));
      setDiscountedPrice(String(initialData.discountedPrice || 0));
      setBadge(initialData.badge || 'BEST SELLER');
      setBadgeColor(initialData.badgeColor || '#D31027');
      setFeatures(initialData.features || []);
      setValidTill(initialData.validTill || '2026-12-31');
      setIsActive(initialData.isActive !== false);
    } else {
      setTitle('');
      setSubtitle('');
      setOriginalPrice('18000');
      setDiscountedPrice('12000');
      setBadge('BEST SELLER');
      setBadgeColor('#D31027');
      setFeatures([
        'Unlimited Access All Branches',
        'Free Personal Training (2 sessions)',
        'Nutrition Consultation Included',
        'Locker & Shower Access',
      ]);
      setValidTill('2026-12-31');
      setIsActive(true);
    }
    setFeatureInput('');
  }, [initialData, visible]);

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput('');
  };

  const removeFeature = (idx) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a deal title.');
      return;
    }
    const orig = parseInt(originalPrice, 10);
    const disc = parseInt(discountedPrice, 10);
    if (isNaN(orig) || isNaN(disc)) {
      Alert.alert('Validation Error', 'Please enter valid numerical prices.');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || 'Exclusive membership savings',
      originalPrice: orig,
      discountedPrice: disc,
      badge: badge.trim(),
      badgeColor,
      features: features.length > 0 ? features : ['Access to Gym Floor & Cardio Equipment'],
      validTill: validTill.trim() || null,
      isActive,
    };

    if (isEditing) {
      updateDeal(initialData.id, payload);
    } else {
      addDeal(payload);
    }

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons
                name={isEditing ? 'create' : 'pricetag'}
                size={22}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitle}>
                {isEditing ? 'EDIT MEMBERSHIP DEAL' : 'CREATE NEW DEAL'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>Deal / Package Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Annual Gold Membership, 6-Month Pro"
              placeholderTextColor="#555"
            />

            {/* Subtitle */}
            <Text style={styles.label}>Subtitle / Tagline</Text>
            <TextInput
              style={styles.input}
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="e.g. Best Value – Save ₹6,000!"
              placeholderTextColor="#555"
            />

            {/* Prices */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Original Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="numeric"
                  placeholder="24000"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Discounted Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={discountedPrice}
                  onChangeText={setDiscountedPrice}
                  keyboardType="numeric"
                  placeholder="18000"
                  placeholderTextColor="#555"
                />
              </View>
            </View>

            {/* Badge Presets */}
            <Text style={styles.label}>Badge Tag & Color</Text>
            <View style={styles.chipRow}>
              {BADGE_PRESETS.map((preset) => {
                const isSelected = badge === preset.label;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    style={[
                      styles.chip,
                      isSelected && { backgroundColor: preset.color, borderColor: '#fff' },
                    ]}
                    onPress={() => {
                      setBadge(preset.label);
                      setBadgeColor(preset.color);
                    }}
                  >
                    <Text style={[styles.chipText, isSelected && { color: '#fff', fontWeight: 'bold' }]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Validity date */}
            <Text style={styles.label}>Valid Until (Date)</Text>
            <TextInput
              style={styles.input}
              value={validTill}
              onChangeText={setValidTill}
              placeholder="e.g. 2026-12-31"
              placeholderTextColor="#555"
            />

            {/* Inclusions / Features */}
            <Text style={styles.label}>Features & Inclusions</Text>
            <View style={styles.featureInputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={featureInput}
                onChangeText={setFeatureInput}
                placeholder="e.g. 3 Free Guest Passes"
                placeholderTextColor="#555"
              />
              <TouchableOpacity style={styles.addFeatureBtn} onPress={addFeature}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.featureList}>
              {features.map((item, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                  <Text style={styles.featureItemText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeFeature(idx)}>
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Active Status Switch */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>Deal Active Status</Text>
                <Text style={styles.switchDesc}>Show in user deals feed</Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#333', true: COLORS.primaryDark }}
                thumbColor={isActive ? COLORS.primary : '#666'}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>{isEditing ? 'Update Deal' : 'Publish Deal'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#161616',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderTopWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.base,
    maxHeight: '90%',
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    marginBottom: SPACING.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.2,
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    paddingBottom: SPACING.xl,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginTop: SPACING.sm,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.md,
    color: '#fff',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONTS.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  col: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: FONTS.weightSemiBold,
  },
  featureInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addFeatureBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    marginTop: 8,
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featureItemText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  switchTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  switchDesc: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
});
