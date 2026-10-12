// ─────────────────────────────────────────────────────────────────────────────
// src/screens/PlaceholderScreen.js
// Generic placeholder for screens not yet built (Services, Refer, Feedback, Terms)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function PlaceholderScreen({ route }) {
  const screenName = route?.name || 'Screen';

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={64} color={COLORS.primary} style={{ opacity: 0.6 }} />
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.subtitle}>🚧 Coming Soon</Text>
        <Text style={styles.body}>
          This screen is part of the SLAM Fitness app and will be fully built in the next phase.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  title: { color: COLORS.textPrimary, fontSize: FONTS.xxl, fontWeight: FONTS.weightBold, marginTop: SPACING.lg, marginBottom: SPACING.xs },
  subtitle: { color: COLORS.primary, fontSize: FONTS.md, fontWeight: FONTS.weightSemiBold, marginBottom: SPACING.md },
  body: { color: COLORS.textMuted, fontSize: FONTS.md, textAlign: 'center', lineHeight: 22 },
});
