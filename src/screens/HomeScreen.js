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
  Text,
} from 'react-native';
import DashboardTile from '../components/DashboardTile';
import RoleBanner from '../components/RoleBanner';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

const TILES = [
  { id: 't1', icon: 'call-outline',         label: 'ENQUIRE NOW',     screen: 'Enquiry' },
  { id: 't2', icon: 'card-outline',          label: 'TRIAL PASS',      screen: 'Deals' },
  { id: 't3', icon: 'pricetag-outline',      label: 'DEALS',           screen: 'Deals' },
  { id: 't4', icon: 'flash-outline',         label: 'SERVICES',        screen: 'Services' },
  { id: 't5', icon: 'ticket-outline',        label: 'MY BOOKINGS',     screen: 'Bookings' },
  { id: 't6', icon: 'megaphone-outline',     label: 'REFER FRIENDS',   screen: 'Refer' },
  { id: 't7', icon: 'calendar-outline',      label: 'CLASSES',         screen: 'Classes' },
  { id: 't8', icon: 'trophy-outline',        label: 'LOYALTY POINTS',  screen: 'Profile' },
  { id: 't9', icon: 'location-outline',      label: 'BRANCHES',        screen: 'Branches' },
  { id: 't10', icon: 'barbell-outline',      label: 'WORKOUT & DIET',  screen: 'WorkoutDiet' },
];

export default function HomeScreen({ navigation }) {
  const renderTile = ({ item }) => (
    <DashboardTile
      icon={item.icon}
      label={item.label}
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
        {/* Dark overlay */}
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
