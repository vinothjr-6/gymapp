import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const STATUS_COLORS = {
  Confirmed: '#22C55E',
  Pending: '#F59E0B',
  Cancelled: '#EF4444',
  New: '#EF4444',
  Contacted: '#3B82F6',
  Resolved: '#22C55E',
};

export default function BookingsScreen({ navigation }) {
  const { bookings, enquiries, classes, cancelBooking, updateEnquiryStatus } = useGymData();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('bookings');

  const data = tab === 'bookings' ? bookings : enquiries;

  const handleCancelBooking = (booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your session reservation for "${booking.className || 'Class'}"?`,
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Cancel Reservation',
          style: 'destructive',
          onPress: () => cancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <RoleBanner />

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'bookings' && styles.tabActive]}
          onPress={() => setTab('bookings')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'bookings' && styles.tabTextActive]}>
            {isAdmin ? `All Bookings (${bookings.length})` : `My Bookings (${bookings.length})`}
          </Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.tab, tab === 'enquiries' && styles.tabActive]}
            onPress={() => setTab('enquiries')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'enquiries' && styles.tabTextActive]}>
              Lead Enquiries ({enquiries.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={tab === 'bookings' ? 'ticket-outline' : 'mail-unread-outline'}
              size={48}
              color="#444"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>No {tab === 'bookings' ? 'Bookings' : 'Enquiries'} Found</Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'bookings'
                ? 'Browse upcoming sessions and book a spot from the Classes schedule.'
                : 'No customer enquiries in the queue.'}
            </Text>
            {tab === 'bookings' && (
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('Classes')}
              >
                <Text style={styles.browseBtnText}>Explore Classes Schedule</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) =>
          tab === 'bookings' ? (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Ionicons name="ticket-outline" size={22} color={COLORS.primary} style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {item.className || classes.find((c) => c.id === item.classId)?.name || 'Class Session'}
                  </Text>
                  {item.trainer && <Text style={styles.trainerText}>Coach: {item.trainer}</Text>}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${STATUS_COLORS[item.status] || '#22C55E'}20`,
                      borderColor: STATUS_COLORS[item.status] || '#22C55E',
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#22C55E' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{item.date || 'Today'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{item.time || 'Scheduled'}</Text>
                </View>
                {item.branchName && (
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.metaText}>SLAM {item.branchName}</Text>
                  </View>
                )}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelBookingBtn}
                onPress={() => handleCancelBooking(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.cancelBookingText}>Cancel Reservation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  {item.ticketNumber && (
                    <Text style={styles.ticketBadge}>#{item.ticketNumber}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${STATUS_COLORS[item.status] || '#3B82F6'}20`,
                      borderColor: STATUS_COLORS[item.status] || '#3B82F6',
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#3B82F6' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.metaText}>📞 {item.phone} • {item.type || 'Enquiry'}</Text>
              {item.preferredTime && (
                <Text style={styles.metaText}>⏰ Preferred Time: {item.preferredTime}</Text>
              )}
              <Text style={styles.message}>"{item.message}"</Text>
              {item.branchName && (
                <Text style={[styles.metaText, { marginTop: 4 }]}>Branch: SLAM {item.branchName}</Text>
              )}

              {/* Lead Actions for Admin */}
              <View style={styles.leadActions}>
                <TouchableOpacity
                  style={styles.callLeadBtn}
                  onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s+/g, '')}`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call" size={12} color="#fff" />
                  <Text style={styles.callLeadBtnText}>Call Customer</Text>
                </TouchableOpacity>

                {/* Status toggles for Admin */}
                <View style={styles.enquiryActionRow}>
                  {['New', 'Contacted', 'Resolved'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.stBtn, item.status === st && styles.stBtnActive]}
                      onPress={() => updateEnquiryStatus(item.id, st)}
                    >
                      <Text style={[styles.stBtnText, item.status === st && styles.stBtnTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDark },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: '#111',
  },
  tab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.base },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontSize: FONTS.sm, fontWeight: FONTS.weightSemiBold },
  tabTextActive: { color: COLORS.primary, fontWeight: FONTS.weightBold },
  list: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderLeftWidth: 3.5,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitle: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: FONTS.weightBold },
  trainerText: { color: COLORS.textSecondary, fontSize: FONTS.xs, marginTop: 1 },
  statusBadge: { borderWidth: 1, borderRadius: RADIUS.full, paddingHorizontal: 9, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: FONTS.weightBold, letterSpacing: 0.5 },
  bookingMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: 6,
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: { color: COLORS.textMuted, fontSize: FONTS.xs },
  message: { color: COLORS.textSecondary, fontSize: FONTS.sm, marginTop: 4, fontStyle: 'italic', lineHeight: 18 },
  cancelBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 6,
  },
  ticketBadge: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  leadActions: {
    marginTop: SPACING.sm,
    gap: 8,
  },
  callLeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#22C55E',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  callLeadBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: FONTS.weightBold,
  },
  enquiryActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  stBtn: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#383838',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  stBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF334B',
  },
  stBtnText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightSemiBold,
  },
  stBtnTextActive: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
  },
});
