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

const DIET_GOALS = ['Fat Loss', 'Muscle Gain', 'Lean Bulking', 'Keto', 'Maintenance'];

export default function DietPlanEditorModal({ visible, onClose, initialData = null }) {
  const { addDietPlan, updateDietPlan } = useGymData();

  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('Fat Loss');
  const [calories, setCalories] = useState('1800');
  const [protein, setProtein] = useState('160');
  const [carbs, setCarbs] = useState('120');
  const [fat, setFat] = useState('55');
  const [description, setDescription] = useState('');

  // Sample meal inputs
  const [breakfast, setBreakfast] = useState('4 Egg Whites + 2 Whole Wheat Toast + Green Tea');
  const [lunch, setLunch] = useState('200g Grilled Chicken Breast + 1 Cup Brown Rice + Steamed Broccoli');
  const [dinner, setDinner] = useState('200g Fish or Paneer + 2 Chapatis + Mixed Green Salad');

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setGoal(initialData.goal || 'Fat Loss');
      setCalories(String(initialData.calories || 1800));
      setProtein(String(initialData.protein || 160));
      setCarbs(String(initialData.carbs || 120));
      setFat(String(initialData.fat || 55));
      setDescription(initialData.description || '');

      if (initialData.meals && initialData.meals[0]) {
        setBreakfast((initialData.meals[0].items || []).join(' + '));
      }
      if (initialData.meals && initialData.meals[1]) {
        setLunch((initialData.meals[1].items || []).join(' + '));
      }
      if (initialData.meals && initialData.meals[2]) {
        setDinner((initialData.meals[2].items || []).join(' + '));
      }
    } else {
      setTitle('');
      setGoal('Fat Loss');
      setCalories('2000');
      setProtein('160');
      setCarbs('150');
      setFat('60');
      setDescription('');
      setBreakfast('5 Egg Whites + Oatmeal + Black Coffee');
      setLunch('200g Grilled Chicken + Sweet Potato + Vegetables');
      setDinner('Salmon or Tofu + Quinoa Bowl + Olive Oil Dressing');
    }
  }, [initialData, visible]);

  const parseMealItems = (str) => {
    return str
      .split('+')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a diet plan title.');
      return;
    }
    const cal = parseInt(calories, 10);
    const p = parseInt(protein, 10);
    const c = parseInt(carbs, 10);
    const f = parseInt(fat, 10);

    if (isNaN(cal) || isNaN(p) || isNaN(c) || isNaN(f)) {
      Alert.alert('Validation Error', 'Please enter valid numerical calorie and macro targets.');
      return;
    }

    const payload = {
      title: title.trim(),
      goal,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      description: description.trim() || 'Structured nutrition protocol to fuel athletic performance.',
      meals: [
        {
          time: '8:00 AM – Breakfast',
          items: parseMealItems(breakfast),
        },
        {
          time: '1:00 PM – Lunch',
          items: parseMealItems(lunch),
        },
        {
          time: '8:00 PM – Dinner',
          items: parseMealItems(dinner),
        },
      ],
    };

    if (isEditing) {
      updateDietPlan(initialData.id, payload);
    } else {
      addDietPlan(payload);
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
                name={isEditing ? 'create' : 'restaurant'}
                size={22}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitle}>
                {isEditing ? 'EDIT NUTRITION CHART' : 'CREATE NUTRITION CHART'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>Diet Chart Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lean Muscle Hypertrophy Meal Plan"
              placeholderTextColor="#555"
            />

            {/* Goal Chips */}
            <Text style={styles.label}>Nutrition Goal</Text>
            <View style={styles.chipRow}>
              {DIET_GOALS.map((g) => {
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

            {/* Calories & Macros Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Calories (kcal)</Text>
                <TextInput
                  style={styles.input}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                  placeholder="2000"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholder="160"
                  placeholderTextColor="#555"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                  placeholder="150"
                  placeholderTextColor="#555"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Fats (g)</Text>
                <TextInput
                  style={styles.input}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor="#555"
                />
              </View>
            </View>

            {/* Meal Builder */}
            <Text style={styles.label}>Breakfast (split items with +)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={breakfast}
              onChangeText={setBreakfast}
              placeholder="5 Egg Whites + Whole Grain Toast + Green Tea"
              placeholderTextColor="#555"
              multiline
            />

            <Text style={styles.label}>Lunch (split items with +)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={lunch}
              onChangeText={setLunch}
              placeholder="200g Chicken Breast + Brown Rice + Salad"
              placeholderTextColor="#555"
              multiline
            />

            <Text style={styles.label}>Dinner (split items with +)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={dinner}
              onChangeText={setDinner}
              placeholder="Fish Fillet + 2 Chapatis + Mixed Vegetables"
              placeholderTextColor="#555"
              multiline
            />

            {/* Description */}
            <Text style={styles.label}>Overview & Guidelines</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Diet notes, hydration tips, supplement advice..."
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
                <Text style={styles.saveBtnText}>{isEditing ? 'Update Chart' : 'Save Chart'}</Text>
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
    minHeight: 48,
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
