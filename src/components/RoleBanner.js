import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function RoleBanner() {
  const { isAdmin, toggleRole } = useAuth();

  return (
    <TouchableOpacity
      style={[styles.banner, isAdmin ? styles.adminBanner : styles.userBanner]}
      onPress={toggleRole}
      activeOpacity={0.8}
      accessibilityLabel={`Current role is ${isAdmin ? 'Admin' : 'Member'}. Tap to switch role.`}
    >
      <View style={styles.leftRow}>
        <MaterialCommunityIcons
          name={isAdmin ? 'shield-crown' : 'account-check'}
          size={16}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.text}>
          {isAdmin
            ? 'ADMIN MODE: Full Read & Write Access'
            : 'MEMBER MODE: Read-Only Access'}
        </Text>
      </View>

      <View style={styles.switchPill}>
        <Text style={styles.switchPillText}>TAP TO TOGGLE</Text>
        <Ionicons name="swap-horizontal" size={12} color="#fff" style={{ marginLeft: 3 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },
  adminBanner: {
    backgroundColor: '#B91C1C',
  },
  userBanner: {
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontWeight: FONTS.weightSemiBold,
    letterSpacing: 0.5,
  },
  switchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  switchPillText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.6,
  },
});
