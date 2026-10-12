// ─────────────────────────────────────────────────────────────────────────────
// src/screens/DealsScreen.js
// Membership deals, trial passes, and Admin pricing CRUD
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import DealEditorModal from '../components/DealEditorModal';
import ClaimDealModal from '../components/ClaimDealModal';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const FILTERS = ['ALL', 'BEST SELLER', 'FREE', 'STUDENT'];

export default function DealsScreen() {
  const { deals, deleteDeal } = useGymData();
  const { isAdmin } = useAuth();

  const [filter, setFilter] = useState('ALL');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [selectedDealForClaim, setSelectedDealForClaim] = useState(null);

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      if (!isAdmin && !d.isActive) return false;
      if (filter === 'ALL') return true;
      if (filter === 'FREE') return d.discountedPrice === 0 || d.badge?.includes('FREE');
      return d.badge?.toUpperCase().includes(filter);
    });
  }, [deals, filter, isAdmin]);

  const handleOpenAddModal = () => {
    setEditingDeal(null);
    setEditorVisible(true);
  };

  const handleOpenEditModal = (deal) => {
    setEditingDeal(deal);
    setEditorVisible(true);
  };

  const handleDeleteDeal = (deal) => {
    Alert.alert(
      'Delete Deal',
      `Are you sure you want to delete "${deal.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDeal(deal.id),
        },
      ]
    );
  };

  const handleOpenClaimModal = (deal) => {
    setSelectedDealForClaim(deal);
    setClaimModalVisible(true);
  };

  const renderDealCard = ({ item }) => {
    const isFree = item.discountedPrice === 0;
    const savings = item.originalPrice - item.discountedPrice;
    const savingsPct =
      item.originalPrice > 0 ? Math.round((savings / item.originalPrice) * 100) : 0;

    return (
      <View style={[styles.card, !item.isActive && styles.cardInactive]}>
        {/* Top Badge & Status */}
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: item.badgeColor || COLORS.primary }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>

          {isAdmin ? (
            <View style={styles.adminActions}>
              <View style={[styles.statusTag, item.isActive ? styles.statusActive : styles.statusInactive]}>
                <Text style={styles.statusTagText}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
              </View>
              <TouchableOpacity
                style={styles.adminEditBtn}
                onPress={() => handleOpenEditModal(item)}
                accessibilityLabel="Edit deal"
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminDeleteBtn}
                onPress={() => handleDeleteDeal(item)}
                accessibilityLabel="Delete deal"
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            item.validTill && (
              <View style={styles.validityPill}>
                <Ionicons name="time-outline" size={11} color={COLORS.textMuted} style={{ marginRight: 3 }} />
                <Text style={styles.validityText}>Valid till {item.validTill}</Text>
              </View>
            )
          )}
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealSub}>{item.subtitle}</Text>

        {/* Pricing Block */}
        <View style={styles.pricingBox}>
          {isFree ? (
            <View style={styles.freePriceRow}>
              <Text style={styles.free}>100% FREE PASS</Text>
              <View style={styles.zeroCostPill}>
                <Text style={styles.zeroCostText}>₹0 COST</Text>
              </View>
            </View>
          ) : (
            <View style={styles.priceRow}>
              <Text style={styles.discounted}>₹{item.discountedPrice.toLocaleString()}</Text>
              <Text style={styles.original}>₹{item.originalPrice.toLocaleString()}</Text>
              {savingsPct > 0 && (
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>{savingsPct}% OFF</Text>
                </View>
              )}
            </View>
          )}
          {!isFree && savings > 0 && (
            <Text style={styles.savingsNotice}>🔥 Instant savings of ₹{savings.toLocaleString()}</Text>
          )}
        </View>

        {/* Features Checklist */}
        <View style={styles.featuresList}>
          {item.features.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={15} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        {!isAdmin && (
          <TouchableOpacity
            style={styles.claimBtn}
            onPress={() => handleOpenClaimModal(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.claimBtnText}>
              {isFree ? 'CLAIM FREE PASS' : 'CLAIM VOUCHER & ENQUIRE'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <RoleBanner />

      <View style={styles.headerBar}>
        <View>
          <Text style={styles.pageTitle}>DEALS & MEMBERSHIPS</Text>
          <Text style={styles.pageSubtitle}>
            Special packages, trial vouchers & seasonal discounts
          </Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const isSelected = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                onPress={() => setFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderDealCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Admin Floating Add Deal Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
          accessibilityLabel="Create new deal"
        >
          <Ionicons name="add" size={28} color="#fff" />
          <Text style={styles.fabText}>New Deal</Text>
        </TouchableOpacity>
      )}

      {/* Admin Deal Editor Modal */}
      <DealEditorModal
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        initialData={editingDeal}
      />

      {/* Member Claim Deal Modal */}
      <ClaimDealModal
        visible={claimModalVisible}
        onClose={() => setClaimModalVisible(false)}
        dealItem={selectedDealForClaim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  headerBar: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1.5,
  },
  pageSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginTop: 2,
  },
  filterSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#303030',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  filterPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF334B',
  },
  filterPillText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  filterPillTextSelected: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'rgba(211,16,39,0.4)',
    ...SHADOWS.card,
  },
  cardInactive: {
    opacity: 0.6,
    borderColor: '#444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  adminActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  statusActive: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  statusTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  adminEditBtn: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  adminDeleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  validityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  validityText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  dealTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
    marginBottom: 2,
  },
  dealSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginBottom: SPACING.md,
  },
  pricingBox: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  freePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  free: {
    color: '#22C55E',
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 1,
  },
  zeroCostPill: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  zeroCostText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  discounted: {
    color: COLORS.primary,
    fontSize: FONTS.xl,
    fontWeight: FONTS.weightBlack,
  },
  original: {
    color: COLORS.textMuted,
    fontSize: FONTS.md,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  discountPillText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  savingsNotice: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: FONTS.weightMedium,
    marginTop: 4,
  },
  featuresList: {
    gap: 6,
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    lineHeight: 18,
    flex: 1,
  },
  claimBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF334B',
    ...SHADOWS.card,
  },
  claimBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#FF334B',
    gap: 6,
    ...SHADOWS.card,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
});
