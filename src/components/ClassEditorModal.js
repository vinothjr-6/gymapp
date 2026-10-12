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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const CATEGORIES = ['CrossFit', 'Yoga', 'HIIT', 'Strength', 'Dance', 'Boxing'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ClassEditorModal({ visible, onClose, initialData = null }) {
  const { addClass, updateClass, branches } = useGymData();

  const [name, setName] = useState('');
  const [trainer, setTrainer] = useState('');
  const [category, setCategory] = useState('CrossFit');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'b1');
  const [time, setTime] = useState('6:00 AM');
  const [duration, setDuration] = useState('60 min');
  const [slots, setSlots] = useState('15');
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Wed', 'Fri']);
  const [description, setDescription] = useState('');

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setTrainer(initialData.trainer || '');
      setCategory(initialData.category || 'CrossFit');
      setDifficulty(initialData.difficulty || 'Intermediate');
      setBranchId(initialData.branchId || branches[0]?.id || 'b1');
      setTime(initialData.time || '6:00 AM');
      setDuration(initialData.duration || '60 min');
      setSlots(String(initialData.slots || 15));
      setSelectedDays(initialData.days || ['Mon', 'Wed', 'Fri']);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setTrainer('');
      setCategory('CrossFit');
      setDifficulty('Intermediate');
      setBranchId(branches[0]?.id || 'b1');
      setTime('6:00 AM');
      setDuration('60 min');
      setSlots('15');
      setSelectedDays(['Mon', 'Wed', 'Fri']);
      setDescription('');
    }
  }, [initialData, visible, branches]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        Alert.alert('Required', 'Class must run on at least one day.');
        return;
      }
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a class name.');
      return;
    }
    if (!trainer.trim()) {
      Alert.alert('Validation Error', 'Please enter a trainer name.');
      return;
    }
    const slotNum = parseInt(slots, 10);
    if (isNaN(slotNum) || slotNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid slot capacity.');
      return;
    }

    const payload = {
      name: name.trim(),
      trainer: trainer.trim(),
      category,
      difficulty,
      branchId,
      time: time.trim(),
      duration: duration.trim(),
      slots: slotNum,
      days: selectedDays,
      description: description.trim() || 'Join our high-energy session designed for overall fitness.',
    };

    if (isEditing) {
      updateClass(initialData.id, payload);
    } else {
      addClass(payload);
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
                {isEditing ? 'EDIT CLASS SESSION' : 'ADD NEW CLASS'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Class Name */}
            <Text style={styles.label}>Class Title *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. CrossFit Blast, Power Yoga Flow"
              placeholderTextColor="#555"
            />

            {/* Trainer Name */}
            <Text style={styles.label}>Trainer / Instructor Name *</Text>
            <TextInput
              style={styles.input}
              value={trainer}
              onChangeText={setTrainer}
              placeholder="e.g. Coach Arjun, Priya Sharma"
              placeholderTextColor="#555"
            />

            {/* Category Selector */}
            <Text style={styles.label}>Workout Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Difficulty Level */}
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.chipRow}>
              {DIFFICULTIES.map((diff) => {
                const isSelected = difficulty === diff;
                return (
                  <TouchableOpacity
                    key={diff}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setDifficulty(diff)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {diff}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Branch Picker */}
            <Text style={styles.label}>Gym Branch Location</Text>
            <View style={styles.chipRow}>
              {branches.map((b) => {
                const isSelected = branchId === b.id;
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setBranchId(b.id)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      SLAM {b.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time & Duration & Slots in a row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Time Slot</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 6:00 AM"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="e.g. 60 min"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Max Slots</Text>
                <TextInput
                  style={styles.input}
                  value={slots}
                  onChangeText={setSlots}
                  keyboardType="numeric"
                  placeholder="15"
                  placeholderTextColor="#555"
                />
              </View>
            </View>

            {/* Days of the Week */}
            <Text style={styles.label}>Operating Days (Tap to toggle)</Text>
            <View style={styles.daysRow}>
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={styles.label}>Class Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Highlight class format, equipment used, focus areas..."
              placeholderTextColor="#555"
              multiline
              numberOfLines={3}
            />

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>{isEditing ? 'Update Class' : 'Create Class'}</Text>
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
    minHeight: 70,
    textAlignVertical: 'top',
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
    gap: SPACING.xs,
  },
  chip: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  chipSelected: {
    backgroundColor: 'rgba(211,16,39,0.2)',
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightMedium,
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weightBold,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF334B',
  },
  dayText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  dayTextSelected: {
    color: '#fff',
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
