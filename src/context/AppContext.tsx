import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedActivity, Activity } from '../types';
import { initScreenTimeMonitoring, getTodayUsageStats } from '../lib/screentime';
import { requestNotificationPermissions, scheduleDailyReminders } from '../lib/notifications';
import { initPurchases, checkProStatus } from '../lib/purchases';
import { syncActivitiesToCloud, fetchActivitiesFromCloud } from '../lib/database';

type AppState = {
  hasOnboarded: boolean;
  completedActivities: CompletedActivity[];
  streak: number;
  todayMinutes: number;
  todayCount: number;
  isPro: boolean;
};

type AppContextType = AppState & {
  completeOnboarding: () => Promise<void>;
  logActivity: (activity: Activity, duration: number) => Promise<void>;
  getTodayStats: () => { minutes: number; count: number };
  getWeekStats: () => { minutes: number; count: number; days: number };
  canDoActivity: () => boolean;
  refreshProStatus: () => Promise<void>;
  syncToCloud: (userId: string) => Promise<void>;
  restoreFromCloud: (userId: string) => Promise<void>;
};

const STORAGE_KEY = '@impulso_data';
const FREE_DAILY_LIMIT = 3;

const defaultState: AppState = {
  hasOnboarded: false,
  completedActivities: [],
  streak: 0,
  todayMinutes: 0,
  todayCount: 0,
  isPro: false,
};

const AppContext = createContext<AppContextType | null>(null);

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateStreak(activities: CompletedActivity[]): number {
  if (activities.length === 0) return 0;

  const dates = [...new Set(activities.map((a) => a.completedAt.split('T')[0]))].sort().reverse();

  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    // Load local data
    await loadData();

    // Initialize systems (non-blocking)
    try {
      await initPurchases();
      const isPro = await checkProStatus();
      setState((s) => ({ ...s, isPro }));
    } catch {
      // RevenueCat not configured yet
    }

    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminders();
      }
    } catch {
      // Notifications not available
    }

    try {
      await initScreenTimeMonitoring();
    } catch {
      // Background fetch not available (Expo Go)
    }
  };

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as AppState;
        const today = getToday();
        const todayActivities = data.completedActivities.filter(
          (a) => a.completedAt.startsWith(today)
        );
        setState({
          ...data,
          streak: calculateStreak(data.completedActivities),
          todayMinutes: todayActivities.reduce((sum, a) => sum + a.duration, 0),
          todayCount: todayActivities.length,
        });
      }
    } catch {
      // first launch, use defaults
    }
    setLoaded(true);
  };

  const persist = async (newState: AppState) => {
    setState(newState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const completeOnboarding = useCallback(async () => {
    const next = { ...state, hasOnboarded: true };
    await persist(next);
  }, [state]);

  const logActivity = useCallback(
    async (activity: Activity, duration: number) => {
      const entry: CompletedActivity = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        activityId: activity.id,
        activityTitle: activity.title,
        category: activity.category,
        duration,
        completedAt: new Date().toISOString(),
      };
      const updated = [...state.completedActivities, entry];
      const today = getToday();
      const todayActivities = updated.filter((a) => a.completedAt.startsWith(today));
      await persist({
        ...state,
        completedActivities: updated,
        streak: calculateStreak(updated),
        todayMinutes: todayActivities.reduce((sum, a) => sum + a.duration, 0),
        todayCount: todayActivities.length,
      });
    },
    [state]
  );

  const canDoActivity = useCallback(() => {
    if (state.isPro) return true;
    return state.todayCount < FREE_DAILY_LIMIT;
  }, [state.isPro, state.todayCount]);

  const refreshProStatus = useCallback(async () => {
    try {
      const isPro = await checkProStatus();
      setState((s) => ({ ...s, isPro }));
    } catch {
      // Silent
    }
  }, []);

  const syncToCloud = useCallback(async (userId: string) => {
    await syncActivitiesToCloud(userId, state.completedActivities);
  }, [state.completedActivities]);

  const restoreFromCloud = useCallback(async (userId: string) => {
    const cloudActivities = await fetchActivitiesFromCloud(userId);
    if (cloudActivities.length === 0) return;

    // Merge: keep local + add any cloud activities we don't have
    const localIds = new Set(state.completedActivities.map((a) => a.id));
    const newFromCloud = cloudActivities.filter((a) => !localIds.has(a.id));
    if (newFromCloud.length === 0) return;

    const merged = [...state.completedActivities, ...newFromCloud].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    const today = getToday();
    const todayActivities = merged.filter((a) => a.completedAt.startsWith(today));
    await persist({
      ...state,
      completedActivities: merged,
      streak: calculateStreak(merged),
      todayMinutes: todayActivities.reduce((sum, a) => sum + a.duration, 0),
      todayCount: todayActivities.length,
    });
  }, [state]);

  const getTodayStats = useCallback(() => {
    return { minutes: state.todayMinutes, count: state.todayCount };
  }, [state.todayMinutes, state.todayCount]);

  const getWeekStats = useCallback(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const weekActivities = state.completedActivities.filter(
      (a) => a.completedAt >= weekAgo
    );
    const days = new Set(weekActivities.map((a) => a.completedAt.split('T')[0])).size;
    return {
      minutes: weekActivities.reduce((sum, a) => sum + a.duration, 0),
      count: weekActivities.length,
      days,
    };
  }, [state.completedActivities]);

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        completeOnboarding,
        logActivity,
        getTodayStats,
        getWeekStats,
        canDoActivity,
        refreshProStatus,
        syncToCloud,
        restoreFromCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
