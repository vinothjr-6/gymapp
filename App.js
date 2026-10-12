// ─────────────────────────────────────────────────────────────────────────────
// App.js – SLAM Fitness Studio App Entry Point
// Wraps all providers and root navigation
// ─────────────────────────────────────────────────────────────────────────────

import 'react-native-gesture-handler'; // Must be first import
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { AuthProvider } from './src/context/AuthContext';
import { GymDataProvider } from './src/context/GymDataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <GymDataProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GymDataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
