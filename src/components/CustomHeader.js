// ─────────────────────────────────────────────────────────────────────────────
// src/components/CustomHeader.js
// Crimson red header bar: drawer toggle, branch selector, role badge, bell
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, ROLES } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

export default function CustomHeader({ showBranchSelector = true }) {
  const navigation = useNavigation();
  const { user, isAdmin, toggleRole, role } = useAuth();
  const { branches } = useGymData();

  const activeBranch = branches.find((b) => b.id === user?.activeBranchId) || branches[0];

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.container}>
        {/* Left – hamburger */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          accessibilityLabel="Open navigation menu"
        >
          <Ionicons name="menu" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Center – branch selector */}
        {showBranchSelector && activeBranch ? (
          <TouchableOpacity style={styles.branchSelector} activeOpacity={0.7}>
            <Text style={styles.branchName}>{activeBranch.name.toUpperCase()}</Text>
            <Ionicons name="caret-down" size={14} color={COLORS.textPrimary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.appTitle}>SLAM FITNESS</Text>
        )}

        {/* Right – role badge + bell */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser]}
            onPress={toggleRole}
            accessibilityLabel="Toggle admin / user role"
          >
            <MaterialCommunityIcons
              name={isAdmin ? 'shield-crown' : 'account'}
              size={12}
              color="#fff"
            />
            <Text style={styles.roleBadgeText}>{isAdmin ? 'ADMIN' : 'USER'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            {/* Notification dot */}
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgHeader,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44,
    paddingBottom: SPACING.sm,
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
    marginHorizontal: SPACING.sm,
  },
  branchName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.2,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 3,
  },
  roleBadgeAdmin: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  roleBadgeUser: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: FONTS.xs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    borderWidth: 1,
    borderColor: COLORS.bgHeader,
  },
});
