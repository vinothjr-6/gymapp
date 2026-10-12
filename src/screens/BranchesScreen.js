// ─────────────────────────────────────────────────────────────────────────────
// src/screens/BranchesScreen.js
// Multi-branch directory with location switching and Admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoleBanner from '../components/RoleBanner';
import BranchEditorModal from '../components/BranchEditorModal';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function BranchesScreen({ navigation }) {
  const { branches, deleteBranch } = useGymData();
  const { isAdmin, activeBranchId, setActiveBranchId } = useAuth();

  const [editorVisible, setEditorVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const handleOpenAddModal = () => {
    setEditingBranch(null);
    setEditorVisible(true);
  };

  const handleOpenEditModal = (branch) => {
    setEditingBranch(branch);
    setEditorVisible(true);
  };

  const handleDeleteBranch = (branch) => {
    Alert.alert(
      'Delete Branch',
      `Are you sure you want to delete SLAM ${branch.name}? This will remove it from the club directory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBranch(branch.id),
        },
      ]
    );
  };

  const handleSetHomeGym = (branchId) => {
    setActiveBranchId(branchId);
  };

  const handleCallBranch = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {
        Alert.alert('Phone Call', `Dial: ${phone}`);
      });
    }
  };

  const renderBranchItem = ({ item }) => {
    const isCurrentActive = item.id === activeBranchId;

    return (
      <View style={[styles.card, !item.isActive && styles.cardInactive, isCurrentActive && styles.cardSelected]}>
        {/* Top Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <View style={styles.branchNameRow}>
              <Ionicons name="fitness" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.branchName}>SLAM {item.name.toUpperCase()}</Text>
            </View>
            <View style={styles.statusPillsRow}>
              {item.isActive ? (
                <View style={styles.openPill}>
                  <Text style={styles.openPillText}>OPEN</Text>
                </View>
              ) : (
                <View style={styles.comingSoonPill}>
                  <Text style={styles.comingSoonPillText}>COMING SOON</Text>
                </View>
              )}
              {isCurrentActive && (
                <View style={styles.activeGymPill}>
                  <Ionicons name="checkmark-circle" size={12} color="#22C55E" style={{ marginRight: 3 }} />
                  <Text style={styles.activeGymPillText}>MY ACTIVE GYM</Text>
                </View>
              )}
            </View>
          </View>

          {/* Admin Edit/Delete Icons */}
          {isAdmin && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.adminEditBtn}
                onPress={() => handleOpenEditModal(item)}
                accessibilityLabel="Edit branch"
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminDeleteBtn}
                onPress={() => handleDeleteBranch(item)}
                accessibilityLabel="Delete branch"
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Address & Contact Info */}
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.primary} style={{ marginTop: 2 }} />
            <Text style={styles.infoText}>{item.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={15} color={COLORS.primary} />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={15} color={COLORS.primary} />
            <Text style={styles.infoText}>{item.timings}</Text>
          </View>
        </View>

        {/* Facility Badges */}
        <Text style={styles.facilitiesTitle}>CLUB AMENITIES & FACILITIES:</Text>
        <View style={styles.facilitiesRow}>
          {item.facilities.map((fac, idx) => (
            <View key={idx} style={styles.facilityTag}>
              <Ionicons name="shield-checkmark" size={11} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.facilityText}>{fac}</Text>
            </View>
          ))}
        </View>

        {/* Card Footer Actions */}
        <View style={styles.cardFooter}>
          {isCurrentActive ? (
            <View style={styles.activeGymNotice}>
              <Ionicons name="home" size={15} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={styles.activeGymNoticeText}>Your Selected Home Gym</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.setHomeBtn}
              onPress={() => handleSetHomeGym(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-done" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.setHomeBtnText}>Set as My Gym Location</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.callShortcutBtn}
            onPress={() => handleCallBranch(item.phone)}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <RoleBanner />

      <View style={styles.headerBar}>
        <View>
          <Text style={styles.pageTitle}>OUR GYM LOCATIONS</Text>
          <Text style={styles.pageSubtitle}>
            {branches.length} premier SLAM studios across Chennai
          </Text>
        </View>
      </View>

      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderBranchItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Admin Floating Add Branch Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
          accessibilityLabel="Add new branch location"
        >
          <Ionicons name="add" size={28} color="#fff" />
          <Text style={styles.fabText}>Add Branch</Text>
        </TouchableOpacity>
      )}

      {/* Admin Branch Editor Modal */}
      <BranchEditorModal
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        initialData={editingBranch}
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
  list: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  cardSelected: {
    borderColor: 'rgba(211,16,39,0.5)',
    borderLeftColor: '#22C55E',
  },
  cardInactive: {
    opacity: 0.65,
    borderLeftColor: '#555',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleGroup: {
    flex: 1,
  },
  branchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  branchName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.1,
  },
  statusPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openPill: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  openPillText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  comingSoonPill: {
    backgroundColor: 'rgba(234,179,8,0.15)',
    borderWidth: 1,
    borderColor: '#EAB308',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  comingSoonPillText: {
    color: '#EAB308',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  activeGymPill: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  activeGymPillText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  adminEditBtn: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 7,
    borderRadius: RADIUS.sm,
  },
  adminDeleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 7,
    borderRadius: RADIUS.sm,
  },
  infoBlock: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    flex: 1,
    lineHeight: 18,
  },
  facilitiesTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  facilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  facilityText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: FONTS.weightMedium,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: SPACING.sm,
  },
  setHomeBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.md,
  },
  setHomeBtnText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.6,
  },
  activeGymNotice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  activeGymNoticeText: {
    color: '#22C55E',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
  callShortcutBtn: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
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
