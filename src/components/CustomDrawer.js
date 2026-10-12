// ─────────────────────────────────────────────────────────────────────────────
// src/components/CustomDrawer.js
// SLAM-branded side navigation drawer
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, ROLES } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const NAV_ITEMS = [
  { label: 'Home', icon: 'home-outline', screen: 'Home' },
  { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
  { label: 'My Bookings', icon: 'ticket-outline', screen: 'Bookings' },
  { label: 'My Schedule', icon: 'calendar-outline', screen: 'Classes' },
  { label: 'Workout & Diet Plan', icon: 'barbell-outline', screen: 'WorkoutDiet' },
  { label: 'Branches', icon: 'location-outline', screen: 'Branches' },
  { label: 'Deals', icon: 'pricetag-outline', screen: 'Deals' },
  { label: 'Feedback', icon: 'chatbubble-outline', screen: 'Feedback' },
  { label: 'Terms & Conditions', icon: 'document-text-outline', screen: 'Terms' },
];

export default function CustomDrawer(props) {
  const { navigation } = props;
  const { user, isAdmin, toggleRole, role } = useAuth();
  const { branches } = useGymData();

  const activeBranch = branches.find((b) => b.id === user?.activeBranchId) || branches[0];

  const navigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>SLAM</Text>
          <Text style={styles.logoSub}>LIFESTYLE AND FITNESS STUDIO</Text>
        </View>
        <View style={styles.branchTag}>
          <Ionicons name="location" size={13} color={COLORS.primary} />
          <Text style={styles.branchTagText}>{activeBranch?.name || 'Select Branch'}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userMembership}>{user?.membershipType}</Text>
          </View>
        </View>
      </View>

      {/* ── Nav Items ──────────────────────────────────────────────────── */}
      <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.navItem}
            onPress={() => navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={20} color={COLORS.textSecondary} style={styles.navIcon} />
            <Text style={styles.navLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Role Toggle ─────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <View style={styles.roleToggleRow}>
          <View style={styles.roleInfo}>
            <MaterialCommunityIcons
              name={isAdmin ? 'shield-crown' : 'account'}
              size={20}
              color={isAdmin ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={styles.roleLabel}>{isAdmin ? 'Admin Mode' : 'Member Mode'}</Text>
          </View>
          <Switch
            value={isAdmin}
            onValueChange={toggleRole}
            trackColor={{ false: '#333', true: COLORS.primaryDark }}
            thumbColor={isAdmin ? COLORS.primary : '#555'}
          />
        </View>
        <Text style={styles.footerNote}>
          {isAdmin ? 'Full Read & Write Access' : 'Read-Only Access'}
        </Text>
        <Text style={styles.version}>SLAM Fitness v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDrawer,
  },
  header: {
    backgroundColor: '#0F0F0F',
    padding: SPACING.base,
    paddingTop: SPACING.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  logoBlock: {
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.display,
    fontWeight: FONTS.weightBlack,
    letterSpacing: 4,
    lineHeight: 38,
  },
  logoSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    letterSpacing: 1.5,
    fontWeight: FONTS.weightMedium,
  },
  branchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211,16,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211,16,39,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  branchTagText: {
    color: COLORS.primary,
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightSemiBold,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontWeight: FONTS.weightBold,
    fontSize: FONTS.md,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightSemiBold,
  },
  userMembership: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
  },
  navList: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  navIcon: {
    width: 28,
  },
  navLabel: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightMedium,
    marginLeft: SPACING.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    padding: SPACING.base,
    backgroundColor: '#0A0A0A',
  },
  roleToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  roleLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
    fontWeight: FONTS.weightSemiBold,
  },
  footerNote: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    marginBottom: SPACING.sm,
  },
  version: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    opacity: 0.5,
    textAlign: 'center',
  },
});
