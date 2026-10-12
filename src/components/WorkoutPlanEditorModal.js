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

const GOALS = ['Muscle Building', 'Strength', 'Fat Loss', 'Endurance', 'Flexibility'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function WorkoutPlanEditorModal({ visible, onClose, initialData = null }) {
  const { addPlan, updatePlan } = useGymData();

  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('Muscle Building');
  const [level, setLevel] = useState('Intermediate');
  const [duration, setDuration] = useState('8 Weeks');
  const [daysPerWeek, setDaysPerWeek] = useState('4');
  const [description, setDescription] = useState('');

  // Simple day builder
  const [day1Name, setDay1Name] = useState('Day 1 – Upper Body');
  const [day1Exercises, setDay1Exercises] = useState('Bench Press (4x8), Barbell Row (4x8), Dumbbell Press (3x10)');
  const [day2Name, setDay2Name] = useState('Day 2 – Lower Body');
  const [day2Exercises, setDay2Exercises] = useState('Squat (4x8), Deadlift (3x6), Leg Press (3x12)');

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setGoal(initialData.goal || 'Muscle Building');
      setLevel(initialData.level || 'Intermediate');
      setDuration(initialData.duration || '8 Weeks');
      setDaysPerWeek(String(initialData.daysPerWeek || 4));
      setDescription(initialData.description || '');

      if (initialData.days && initialData.days[0]) {
        setDay1Name(initialData.days[0].day || 'Day 1');
        setDay1Exercises(
          (initialData.days[0].exercises || [])
            .map((e) => `${e.name} (${e.sets}x${e.reps})`)
            .join(', ')
        );
      }
      if (initialData.days && initialData.days[1]) {
        setDay2Name(initialData.days[1].day || 'Day 2');
        setDay2Exercises(
          (initialData.days[1].exercises || [])
            .map((e) => `${e.name} (${e.sets}x${e.reps})`)
            .join(', ')
        );
      }
    } else {
      setTitle('');
      setGoal('Muscle Building');
      setLevel('Intermediate');
      setDuration('8 Weeks');
      setDaysPerWeek('4');
      setDescription('');
      setDay1Name('Day 1 – Push Split');
      setDay1Exercises('Bench Press (4x8), Incline Dumbbell Press (3x10), Tricep Pushdown (3x12)');
      setDay2Name('Day 2 – Pull Split');
      setDay2Exercises('Deadlift (4x6), Pull-ups (3xMax), Barbell Curl (3x12)');
    }
  }, [initialData, visible]);

  const parseExercisesString = (str) => {
    return str
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const match = item.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) {
          const setsReps = match[2].split('x');
          return {
            name: match[1].trim(),
            sets: setsReps[0] ? setsReps[0].trim() : '3',
            reps: setsReps[1] ? setsReps[1].trim() : '10',
            rest: '60s',
          };
        }
        return { name: item, sets: '3', reps: '10', rest: '60s' };
      });
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a workout plan title.');
      return;
    }
    const daysNum = parseInt(daysPerWeek, 10);
    if (isNaN(daysNum) || daysNum <= 0) {
      Alert.alert('Validation Error', 'Please enter valid days per week.');
      return;
    }

    const payload = {
      title: title.trim(),
      goal,
      level,
      duration: duration.trim() || '8 Weeks',
      daysPerWeek: daysNum,
      description: description.trim() || 'Custom SLAM coaching program designed for progressive overload.',
      days: [
        {
          day: day1Name.trim(),
          exercises: parseExercisesString(day1Exercises),
        },
        {
          day: day2Name.trim(),
          exercises: parseExercisesString(day2Exercises),
        },
      ],
    };

    if (isEditing) {
      updatePlan(initialData.id, payload);
    } else {
      addPlan(payload);
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
                name={isEditing ? 'create' : 'barbell'}
                size={22}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitle}>
                {isEditing ? 'EDIT WORKOUT PROGRAM' : 'CREATE WORKOUT PROGRAM'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>Program Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. 5-Day Powerbuilding Protocol"
              placeholderTextColor="#555"
            />

            {/* Goal Chips */}
            <Text style={styles.label}>Training Goal</Text>
            <View style={styles.chipRow}>
              {GOALS.map((g) => {
                const isSelected = goal === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setGoal(g)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Level Chips */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.chipRow}>
              {LEVELS.map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setLevel(lvl)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Duration & Days */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="8 Weeks"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Days / Week</Text>
                <TextInput
                  style={styles.input}
                  value={daysPerWeek}
                  onChangeText={setDaysPerWeek}
                  keyboardType="numeric"
                  placeholder="4"
                  placeholderTextColor="#555"
                />
              </View>
            </View>

            {/* Day 1 Builder */}
            <Text style={styles.label}>Workout Split Day 1</Text>
            <TextInput
              style={styles.input}
              value={day1Name}
              onChangeText={setDay1Name}
              placeholder="e.g. Day 1 – Chest & Triceps"
              placeholderTextColor="#555"
            />
            <Text style={styles.sublabel}>Exercises (format: Name (Sets x Reps))</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={day1Exercises}
              onChangeText={setDay1Exercises}
              placeholder="e.g. Bench Press (4x8), Incline Dumbbell (3x10)"
              placeholderTextColor="#555"
              multiline
            />

            {/* Day 2 Builder */}
            <Text style={styles.label}>Workout Split Day 2</Text>
            <TextInput
              style={styles.input}
              value={day2Name}
              onChangeText={setDay2Name}
              placeholder="e.g. Day 2 – Back & Biceps"
              placeholderTextColor="#555"
            />
            <Text style={styles.sublabel}>Exercises (format: Name (Sets x Reps))</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={day2Exercises}
              onChangeText={setDay2Exercises}
              placeholder="e.g. Deadlift (4x6), Barbell Row (4x8)"
              placeholderTextColor="#555"
              multiline
            />

            {/* Description */}
            <Text style={styles.label}>Program Overview & Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Coaching tips, warm-up instructions, target RPE..."
              placeholderTextColor="#555"
              multiline
            />

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>{isEditing ? 'Update Plan' : 'Save Plan'}</Text>
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
  sublabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 4,
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
    minHeight: 50,
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
    gap: 6,
    marginTop: 2,
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
