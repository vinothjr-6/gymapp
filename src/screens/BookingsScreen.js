// ─────────────────────────────────────────────────────────────────────────────
// src/screens/BookingsScreen.js – PLACEHOLDER
// User bookings list. Admin: view all bookings & enquiries.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const STATUS_COLORS = {
  Confirmed: COLORS.success,
  Pending: COLORS.warning,
  Cancelled: COLORS.danger,
  New: COLORS.primary,
  Resolved: COLORS.success,
};

export default function BookingsScreen() {
  const { bookings, enquiries, classes } = useGymData();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('bookings');

  const data = tab === 'bookings' ? bookings : enquiries;

  return (
    <View style={styles.root}>
      <RoleBanner />
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'bookings' && styles.tabActive]} onPress={() => setTab('bookings')}>
          <Text style={[styles.tabText, tab === 'bookings' && styles.tabTextActive]}>
            {isAdmin ? 'All Bookings' : 'My Bookings'}
          </Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={[styles.tab, tab === 'enquiries' && styles.tabActive]} onPress={() => setTab('enquiries')}>
            <Text style={[styles.tabText, tab === 'enquiries' && styles.tabTextActive]}>Enquiries</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No {tab} found.</Text>}
        renderItem={({ item }) =>
          tab === 'bookings' ? (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Ionicons name="ticket-outline" size={20} color={COLORS.primary} />
                <Text style={styles.cardTitle}>
                  {classes.find((c) => c.id === item.classId)?.name || item.classId}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '22', borderColor: STATUS_COLORS[item.status] }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.meta}>Date: {item.date || 'TBD'} · Time: {item.time || 'TBD'}</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '22', borderColor: STATUS_COLORS[item.status] }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.meta}>{item.phone} · {item.type}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  tab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.base },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontSize: FONTS.md, fontWeight: FONTS.weightSemiBold },
  tabTextActive: { color: COLORS.primary },
  list: { padding: SPACING.sm, paddingBottom: SPACING.xxxl },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxxl, fontSize: FONTS.md },
  card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 3, borderLeftColor: COLORS.primary, ...SHADOWS.card },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  cardTitle: { flex: 1, color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: FONTS.weightSemiBold },
  statusBadge: { borderWidth: 1, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: FONTS.xs, fontWeight: FONTS.weightBold },
  meta: { color: COLORS.textMuted, fontSize: FONTS.sm },
  message: { color: COLORS.textSecondary, fontSize: FONTS.sm, marginTop: 4, fontStyle: 'italic' },
});
