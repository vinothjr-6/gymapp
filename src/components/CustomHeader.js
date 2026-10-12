import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, ROLES } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'CrossFit Bootcamp this Saturday! 💥',
    desc: 'Special 90-min endurance & strength session with Coach Arjun at 7:00 AM.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'New Annual Gold Deal Available 🏷️',
    desc: 'Save ₹6,000 on 12-month memberships. Limited slots for this quarter.',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Extended Timings at Nandanam 🕒',
    desc: 'Gym is now open until 10:30 PM on weekdays for late-night lifters.',
    time: '3 days ago',
    unread: false,
  },
];

export default function CustomHeader({ showBranchSelector = true }) {
  const navigation = useNavigation();
  const { user, isAdmin, toggleRole, role, activeBranchId, setActiveBranchId, roleToast } = useAuth();
  const { branches } = useGymData();

  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSelectBranch = (branchId) => {
    setActiveBranchId(branchId);
    setBranchModalVisible(false);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Floating Role Switch Toast */}
      {roleToast && (
        <View style={styles.floatingToast}>
          <Ionicons
            name={isAdmin ? 'shield-checkmark' : 'person-circle-outline'}
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.floatingToastText}>{roleToast}</Text>
        </View>
      )}

      <View style={styles.container}>
        {/* Left – Hamburger Drawer Toggle */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          accessibilityLabel="Open navigation menu"
        >
          <Ionicons name="menu" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Center – Branch Selector */}
        {showBranchSelector && activeBranch ? (
          <TouchableOpacity
            style={styles.branchSelector}
            activeOpacity={0.7}
            onPress={() => setBranchModalVisible(true)}
            accessibilityLabel="Select gym branch"
          >
            <Ionicons name="location-sharp" size={14} color="#fff" style={{ marginRight: 4, opacity: 0.9 }} />
            <Text style={styles.branchName} numberOfLines={1}>
              {activeBranch.name.toUpperCase()}
            </Text>
            <Ionicons name="caret-down" size={12} color={COLORS.textPrimary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.appTitle}>SLAM FITNESS</Text>
        )}

        {/* Right – Role Badge + Notifications Bell */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser]}
            onPress={toggleRole}
            activeOpacity={0.75}
            accessibilityLabel={`Role is ${isAdmin ? 'Admin' : 'User'}. Tap to toggle.`}
          >
            <MaterialCommunityIcons
              name={isAdmin ? 'shield-crown' : 'account'}
              size={13}
              color="#fff"
            />
            <Text style={styles.roleBadgeText}>{isAdmin ? 'ADMIN' : 'USER'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setNotifModalVisible(true)}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Branch Selector Modal ───────────────────────────────────────── */}
      <Modal
        visible={branchModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBranchModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setBranchModalVisible(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="location" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>SELECT SLAM BRANCH</Text>
              </View>
              <TouchableOpacity onPress={() => setBranchModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose your current training location to personalize class schedules and facilities:
            </Text>

            <FlatList
              data={branches}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: SPACING.xs }}
              renderItem={({ item }) => {
                const isSelected = item.id === activeBranchId;
                return (
                  <TouchableOpacity
                    style={[styles.branchItem, isSelected && styles.branchItemSelected]}
                    onPress={() => handleSelectBranch(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.branchItemLeft}>
                      <View style={[styles.branchRadio, isSelected && styles.branchRadioSelected]}>
                        {isSelected && <View style={styles.branchRadioInner} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.branchItemNameRow}>
                          <Text style={[styles.branchItemName, isSelected && styles.branchItemNameSelected]}>
                            SLAM {item.name.toUpperCase()}
                          </Text>
                          {item.isActive && (
                            <View style={styles.openPill}>
                              <Text style={styles.openPillText}>OPEN</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.branchItemAddress} numberOfLines={2}>
                          {item.address}
                        </Text>
                        <Text style={styles.branchItemTimings}>
                          🕒 {item.timings.split('|')[0].trim()}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* ── Notifications Modal ─────────────────────────────────────────── */}
      <Modal
        visible={notifModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setNotifModalVisible(false)}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="notifications" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>NOTIFICATIONS</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadCountBadge}>
                    <Text style={styles.unreadCountText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: SPACING.xs }}
              renderItem={({ item }) => (
                <View style={[styles.notifItem, item.unread && styles.notifItemUnread]}>
                  <View style={styles.notifDotIndicator(item.unread)} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifItemTitle}>{item.title}</Text>
                    <Text style={styles.notifItemDesc}>{item.desc}</Text>
                    <Text style={styles.notifItemTime}>{item.time}</Text>
                  </View>
                </View>
              )}
            />

            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markReadBtn}
                onPress={markAllNotificationsRead}
                activeOpacity={0.8}
              >
                <Text style={styles.markReadBtnText}>Mark All as Read</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgHeader,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44,
    paddingBottom: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.header,
  },
  iconBtn: {
    padding: SPACING.xs,
    position: 'relative',
  },
  branchSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  branchName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.1,
  },
  appTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 2,
    textAlign: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  roleBadgeAdmin: {
    backgroundColor: '#991B1B',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  roleBadgeUser: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  notifDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: COLORS.bgHeader,
  },
  floatingToast: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 52 : 96,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  floatingToastText: {
    color: '#fff',
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    backgroundColor: '#141414',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    maxHeight: '80%',
    ...SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    marginBottom: SPACING.xs,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.2,
  },
  modalSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginVertical: SPACING.xs,
    lineHeight: 18,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B1B1B',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginVertical: 4,
  },
  branchItemSelected: {
    backgroundColor: 'rgba(211,16,39,0.12)',
    borderColor: COLORS.primary,
  },
  branchItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: SPACING.sm,
  },
  branchRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchRadioSelected: {
    borderColor: COLORS.primary,
  },
  branchRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
  },
  branchItemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  branchItemName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  branchItemNameSelected: {
    color: COLORS.primary,
  },
  openPill: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#22C55E',
  },
  openPillText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  branchItemAddress: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    lineHeight: 16,
    marginBottom: 2,
  },
  branchItemTimings: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  unreadCountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    gap: SPACING.sm,
  },
  notifItemUnread: {
    backgroundColor: 'rgba(211,16,39,0.06)',
    borderRadius: RADIUS.sm,
  },
  notifDotIndicator: (unread) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: unread ? COLORS.primary : 'transparent',
    marginTop: 5,
  }),
  notifItemTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: FONTS.weightSemiBold,
    marginBottom: 2,
  },
  notifItemDesc: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    lineHeight: 17,
    marginBottom: 4,
  },
  notifItemTime: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  markReadBtn: {
    marginTop: SPACING.sm,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  markReadBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
  },
});
