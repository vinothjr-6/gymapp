// ─────────────────────────────────────────────────────────────────────────────
// src/screens/HomeScreen.js
// Main dashboard grid – 2-col tiles on dark/athletic background
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import DashboardTile from '../components/DashboardTile';
import RoleBanner from '../components/RoleBanner';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const { bookings, classes, deals, branches, enquiries } = useGymData();
  const { user, isAdmin } = useAuth();

  const TILES = [
    {
      id: 't1',
      icon: 'call-outline',
      label: 'ENQUIRE NOW',
      screen: 'Enquiry',
      badge: isAdmin && enquiries.length > 0 ? `${enquiries.length} LEADS` : null,
      badgeColor: '#EF4444',
    },
    {
      id: 't2',
      icon: 'card-outline',
      label: 'TRIAL PASS',
      screen: 'Deals',
      badge: 'FREE',
      badgeColor: '#22C55E',
    },
    {
      id: 't3',
      icon: 'pricetag-outline',
      label: 'DEALS',
      screen: 'Deals',
      badge: 'HOT',
      badgeColor: '#F59E0B',
    },
    {
      id: 't4',
      icon: 'flash-outline',
      label: 'SERVICES',
      screen: 'Services',
      badge: null,
    },
    {
      id: 't5',
      icon: 'ticket-outline',
      label: 'MY BOOKINGS',
      screen: 'Bookings',
      badge: bookings.length > 0 ? `${bookings.length}` : null,
      badgeColor: '#3B82F6',
    },
    {
      id: 't6',
      icon: 'megaphone-outline',
      label: 'REFER FRIENDS',
      screen: 'Refer',
      badge: '+100 PTS',
      badgeColor: '#8B5CF6',
    },
    {
      id: 't7',
      icon: 'calendar-outline',
      label: 'CLASSES',
      screen: 'Classes',
      badge: `${classes.length} TODAY`,
      badgeColor: COLORS.primary,
    },
    {
      id: 't8',
      icon: 'trophy-outline',
      label: 'LOYALTY POINTS',
      screen: 'Profile',
      badge: `${user?.loyaltyPoints || 1250}`,
      badgeColor: '#EAB308',
    },
    {
      id: 't9',
      icon: 'location-outline',
      label: 'BRANCHES',
      screen: 'Branches',
      badge: `${branches.length} CLUBS`,
      badgeColor: '#06B6D4',
    },
    {
      id: 't10',
      icon: 'barbell-outline',
      label: 'WORKOUT & DIET',
      screen: 'WorkoutDiet',
      badge: 'ACTIVE',
      badgeColor: '#10B981',
    },
  ];

  const renderTile = ({ item }) => (
    <DashboardTile
      icon={item.icon}
      label={item.label}
      badge={item.badge}
      badgeColor={item.badgeColor}
      onPress={() => navigation.navigate(item.screen)}
    />
  );

  return (
    <View style={styles.root}>
      <RoleBanner />
      <ImageBackground
        source={require('../../assets/gym_bg.jpg')}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        {/* Dark vignette overlay */}
        <View style={styles.overlay} />

        <FlatList
          data={TILES}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={renderTile}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  bg: {
    flex: 1,
    width: '100%',
  },
  bgImage: {
    opacity: 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  grid: {
    padding: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
});
