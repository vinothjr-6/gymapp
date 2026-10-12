// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ServicesScreen.js
// SLAM Studio Services & Elite Amenities Showcase
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Combat', 'Recovery', 'Wellness'];

const SERVICES = [
  {
    id: 's1',
    category: 'Strength',
    title: 'Heavy Iron & Bodybuilding Zone',
    icon: 'dumbbell',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Coach Arjun & Team',
    timings: '5:30 AM – 10:00 PM',
    summary: 'Olympic barbells, Eleiko bumper plates, dumbbell rack up to 60kg, and Hammer Strength plate-loaded machines.',
    features: ['Calibrated Power Racks', 'Deadlift Platforms', 'Dumbbells up to 60kg', 'Cable Crossover Towers'],
    tag: 'CORE FACILITY',
    tagColor: COLORS.primary,
  },
  {
    id: 's2',
    category: 'Cardio',
    title: 'CrossFit & Functional Turf',
    icon: 'run-fast',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Coach Ranjith',
    timings: 'Daily Group Batches',
    summary: '40-meter indoor turf runway with rogue dog sleds, climbing ropes, plyo boxes, gymnastics rings, and kettlebells.',
    features: ['40m Sled Push Turf', 'Battle Ropes & Slam Balls', 'Concept2 Rowers & SkiErgs', 'Rogue Rig System'],
    tag: 'HIGH INTENSITY',
    tagColor: '#F59E0B',
  },
  {
    id: 's3',
    category: 'Combat',
    title: 'Boxing & MMA Cage Ring',
    icon: 'boxing-glove',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Coach Vignesh',
    timings: 'Tue / Thu / Sat',
    summary: 'Full-sized boxing ring with Fairtex tear-drop heavy bags, Thai pads, and speed bags for striking and conditioning.',
    features: ['Pro Sparring Ring', '6 Heavy Bag Stations', 'Speedbags & Double-End Bags', 'Muay Thai & Boxing Drills'],
    tag: 'COMBAT SPORTS',
    tagColor: '#EF4444',
  },
  {
    id: 's4',
    category: 'Wellness',
    title: 'Power Yoga & Mind-Body Studio',
    icon: 'yoga',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Priya Sharma',
    timings: 'Mon / Wed / Fri Batches',
    summary: 'Soundproof hardwood studio equipped with eco-cork mats, yoga straps, and ambient lighting for Vinyasa flow.',
    features: ['Soundproof Acoustic Studio', 'Eco Cork Mats & Blocks', 'Vinyasa & Yin Yoga', 'Breathwork & Meditation'],
    tag: 'MIND & BODY',
    tagColor: '#10B981',
  },
  {
    id: 's5',
    category: 'Cardio',
    title: 'High-Octane Spin Studio',
    icon: 'bike',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Divya Nair',
    timings: 'Morning & Evening Rides',
    summary: 'Stadium-tier spin studio with 24 Keiser M3i magnetic resistance bikes, nightclub acoustics, and live metric tracking.',
    features: ['24 Keiser M3i Bikes', 'Live Heart-Rate Leaderboard', 'Beat-Synced DJ Sound', 'Interval RPM Drills'],
    tag: 'SPINNING',
    tagColor: '#06B6D4',
  },
  {
    id: 's6',
    category: 'Recovery',
    title: 'Steam, Sauna & Cold Plunge',
    icon: 'hot-tub',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Recovery Specialists',
    timings: 'All Day Access',
    summary: 'Finnish dry sauna, eucalyptus steam chambers, and ice cold plunge baths designed to accelerate muscle recovery.',
    features: ['Finnish Cedar Wood Sauna', 'Eucalyptus Steam Chamber', 'Contrast Hydrotherapy', 'Locker Room Lounges'],
    tag: 'HYDRO-RECOVERY',
    tagColor: '#3B82F6',
  },
  {
    id: 's7',
    category: 'Wellness',
    title: 'Sports Nutrition & DEXA Body Scan',
    icon: 'food-apple-outline',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Dr. Kavitha (Sports Dietitian)',
    timings: 'By Appointment',
    summary: 'Clinical body composition analysis measuring visceral fat and lean muscle mass paired with personalized macros.',
    features: ['Full Body Composition Scan', 'Custom Calorie & Macro Target', 'Pre/Post Workout Meal Protocols', 'Supplement Guidance'],
    tag: 'NUTRITION',
    tagColor: '#8B5CF6',
  },
  {
    id: 's8',
    category: 'Strength',
    title: '1-on-1 Celebrity Personal Training',
    icon: 'account-star-outline',
    iconFamily: 'MaterialCommunityIcons',
    leadCoach: 'Senior Master Coaches',
    timings: 'Flexible Scheduling',
    summary: 'Dedicated 1-on-1 coaching focusing on form biomechanics, periodized hypertrophy, and fast-track results.',
    features: ['Dedicated 1-on-1 Coach', 'Periodized Training Cycles', 'Posture & Mobility Correction', 'Direct WhatsApp Support'],
    tag: 'PREMIUM VIP',
    tagColor: '#FBBF24',
  },
];

export default function ServicesScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const handleInquire = (service) => {
    navigation.navigate('Enquiry', { initialCategory: service.title });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <RoleBanner />

      {/* Hero Header */}
      <View style={styles.hero}>
        <Text style={styles.heroBrand}>SLAM FITNESS STUDIOS</Text>
        <Text style={styles.heroTitle}>World-Class Facilities</Text>
        <Text style={styles.heroSubtitle}>
          From Olympic heavy lifting platforms to rejuvenating cedar saunas, discover everything included in your SLAM membership.
        </Text>
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, isSelected && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Services List */}
      <View style={styles.list}>
        {filteredServices.map((svc) => (
          <View key={svc.id} style={styles.serviceCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name={svc.icon} size={28} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <View style={styles.tagRow}>
                  <View style={[styles.tagBadge, { backgroundColor: `${svc.tagColor}1A`, borderColor: svc.tagColor }]}>
                    <Text style={[styles.tagText, { color: svc.tagColor }]}>{svc.tag}</Text>
                  </View>
                </View>
                <Text style={styles.serviceTitle}>{svc.title}</Text>
                <Text style={styles.coachText}>Coach: {svc.leadCoach}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.serviceSummary}>{svc.summary}</Text>

            {/* Feature Bullets */}
            <View style={styles.featuresList}>
              {svc.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            {/* Footer with Inquire Action */}
            <View style={styles.cardFooter}>
              <View style={styles.timingsRow}>
                <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.timingsText}>{svc.timings}</Text>
              </View>
              <TouchableOpacity
                style={styles.inquireBtn}
                onPress={() => handleInquire(svc)}
                activeOpacity={0.7}
              >
                <Text style={styles.inquireBtnText}>Book Trial / Inquire</Text>
                <Ionicons name="arrow-forward" size={13} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.base,
    gap: 8,
    marginBottom: SPACING.md,
  },
  catPill: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPillText: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  catPillTextActive: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  list: {
    marginHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  serviceCard: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: '#262626',
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(211,16,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211,16,39,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  tagText: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
  },
  serviceTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    marginTop: 2,
  },
  coachText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  serviceSummary: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginVertical: SPACING.sm,
  },
  featuresList: {
    backgroundColor: '#1C1C1C',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 6,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#242424',
    paddingTop: SPACING.sm,
  },
  timingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timingsText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  inquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inquireBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: FONTS.weightBold,
  },
});
