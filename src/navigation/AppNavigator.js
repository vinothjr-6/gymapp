// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/AppNavigator.js
// Root navigator: Drawer (main app) + Stack (modal screens)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ClassesScreen from '../screens/ClassesScreen';
import BranchesScreen from '../screens/BranchesScreen';
import DealsScreen from '../screens/DealsScreen';
import WorkoutDietScreen from '../screens/WorkoutDietScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingsScreen from '../screens/BookingsScreen';
import EnquiryScreen from '../screens/EnquiryScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

import { COLORS } from '../constants/theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// ── Drawer Navigator (main tab-like navigation) ─────────────────────────────
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        header: () => <CustomHeader />,
        drawerStyle: { width: 280 },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.7)',
        sceneStyle: { backgroundColor: COLORS.bgDark },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Bookings" component={BookingsScreen} />
      <Drawer.Screen name="Classes" component={ClassesScreen} />
      <Drawer.Screen name="WorkoutDiet" component={WorkoutDietScreen} />
      <Drawer.Screen name="Branches" component={BranchesScreen} />
      <Drawer.Screen name="Deals" component={DealsScreen} />
      <Drawer.Screen name="Feedback" component={PlaceholderScreen} />
      <Drawer.Screen name="Terms" component={PlaceholderScreen} />
      <Drawer.Screen name="Services" component={PlaceholderScreen} />
      <Drawer.Screen name="Refer" component={PlaceholderScreen} />
    </Drawer.Navigator>
  );
}

// ── Root Stack Navigator (drawer + modals) ──────────────────────────────────
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      {/* Modal screens pushed over drawer */}
      <Stack.Screen
        name="Enquiry"
        component={EnquiryScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitle: 'Enquire Now',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}
