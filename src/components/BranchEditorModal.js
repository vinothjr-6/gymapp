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

const AVAILABLE_FACILITIES = [
  'CrossFit Zone',
  'Cardio Zone',
  'Weight Room',
  'Sauna',
  'Steam Room',
  'Swimming Pool',
  'Boxing Ring',
  'Personal Training',
  'Yoga Studio',
  'Zumba Studio',
  'Juice Bar',
  'Café',
  'Valet Parking',
  'Locker Room',
];

export default function BranchEditorModal({ visible, onClose, initialData = null }) {
  const { addBranch, updateBranch } = useGymData();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [timings, setTimings] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAddress(initialData.address || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setTimings(initialData.timings || '');
      setFacilities(initialData.facilities || []);
      setIsActive(initialData.isActive !== false);
    } else {
      setName('');
      setAddress('');
      setPhone('+91 98765 ');
      setEmail('');
      setTimings('Mon–Sat: 5:30 AM – 10:00 PM  |  Sun: 6:00 AM – 8:00 PM');
      setFacilities(['CrossFit Zone', 'Weight Room', 'Cardio Zone', 'Steam Room']);
      setIsActive(true);
    }
  }, [initialData, visible]);

  const toggleFacility = (facility) => {
    if (facilities.includes(facility)) {
      setFacilities((prev) => prev.filter((f) => f !== facility));
    } else {
      setFacilities((prev) => [...prev, facility]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a branch name.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Please enter the branch address.');
      return;
    }

    const payload = {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim() || '+91 98765 00000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@slamfitness.com`,
      timings: timings.trim() || 'Mon–Sat: 5:30 AM – 10:00 PM',
      facilities: facilities.length > 0 ? facilities : ['Weight Room', 'Cardio Zone'],
      isActive,
    };

    if (isEditing) {
      updateBranch(initialData.id, payload);
    } else {
      addBranch(payload);
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
                name={isEditing ? 'create' : 'add-circle'}
                size={22}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitle}>
                {isEditing ? 'EDIT BRANCH' : 'ADD NEW BRANCH'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Branch Name */}
            <Text style={styles.label}>Branch Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Nandanam, T. Nagar, Adyar"
              placeholderTextColor="#555"
            />

            {/* Address */}
            <Text style={styles.label}>Full Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Street, Landmark, City & Pincode"
              placeholderTextColor="#555"
              multiline
              numberOfLines={2}
            />

            {/* Phone & Email */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="branch@slamfitness.com"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Operational Timings */}
            <Text style={styles.label}>Operational Timings</Text>
            <TextInput
              style={styles.input}
              value={timings}
              onChangeText={setTimings}
              placeholder="Mon–Sat: 5:30 AM – 10:00 PM | Sun: 6:00 AM – 8:00 PM"
              placeholderTextColor="#555"
            />

            {/* Status Switch */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>Branch Operational Status</Text>
                <Text style={styles.switchDesc}>
                  {isActive ? 'Open & accepting members' : 'Under construction / Coming soon'}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#333', true: COLORS.primaryDark }}
                thumbColor={isActive ? COLORS.primary : '#666'}
              />
            </View>

            {/* Available Facilities Multi-selector */}
            <Text style={styles.label}>Facilities & Amenities (Tap to select)</Text>
            <View style={styles.chipRow}>
              {AVAILABLE_FACILITIES.map((facility) => {
                const isSelected = facilities.includes(facility);
                return (
                  <TouchableOpacity
                    key={facility}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleFacility(facility)}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                      size={14}
                      color={isSelected ? COLORS.primary : '#666'}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {facility}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>{isEditing ? 'Update Branch' : 'Add Branch'}</Text>
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
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  col: {
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
    marginBottom: 4,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  chipSelected: {
    backgroundColor: 'rgba(211,16,39,0.18)',
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: FONTS.weightMedium,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weightBold,
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
