import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActivitySessionScreen from '../screens/ActivitySessionScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import SessionReflectionScreen from '../screens/SessionReflectionScreen';
import ProgramDetailScreen from '../screens/ProgramDetailScreen';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Activities: '🚀',
    Stats: '📊',
    Settings: '⚙️',
  };
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[label] || '•'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ tabBarLabel: 'Atividades' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: 'Progresso' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Config' }} />
    </Tab.Navigator>
  );
}

function AuthFlow() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');
  const { skipAuth } = useAuth();

  if (screen === 'register') {
    return (
      <RegisterScreen
        onSwitchToLogin={() => setScreen('login')}
        onSkip={skipAuth}
      />
    );
  }
  return (
    <LoginScreen
      onSwitchToRegister={() => setScreen('register')}
      onSkip={skipAuth}
    />
  );
}

export default function AppNavigator() {
  const { hasOnboarded } = useApp();
  const { user, loading, isConfigured, skipped } = useAuth();

  if (loading) return null;

  // Step 1: Onboarding (first time)
  if (!hasOnboarded) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg.base } }}>
          <Stack.Screen name="Auth" component={OnboardingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Step 2: Auth (if Supabase is configured and user not logged in / not skipped)
  if (isConfigured && !user && !skipped) {
    return <AuthFlow />;
  }

  // Step 3: Main app
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg.base } }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ActivityDetail"
          component={ActivityDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="ActivitySession"
          component={ActivitySessionScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="SessionReflection"
          component={SessionReflectionScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="ProgramDetail"
          component={ProgramDetailScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg.elevated,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
    height: 88,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl + 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
