import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedActivity, Activity, UserQuizProfile, Mood, MoodEntry } from '../types';
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
  profile: UserQuizProfile | null;
  moodEntries: MoodEntry[];
};

type AppContextType = AppState & {
  completeOnboarding: (profile?: UserQuizProfile) => Promise<void>;
  saveProfile: (profile: UserQuizProfile) => Promise<void>;
  logActivity: (activity: Activity, duration: number) => Promise<void>;
  logMood: (mood: Mood) => Promise<void>;
  getTodayMood: () => MoodEntry | null;
  getWeekMoods: () => (MoodEntry | null)[];
  getTodayStats: () => { minutes: number; count: number };
  getWeekStats: () => { minutes: number; count: number; days: number };
  getFocusScore: () => number;
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
  profile: null,
  moodEntries: [],
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

  const completeOnboarding = useCallback(async (profile?: UserQuizProfile) => {
    const next = {
      ...state,
      hasOnboarded: true,
      profile: profile ?? state.profile,
    };
    await persist(next);
  }, [state]);

  const saveProfile = useCallback(async (profile: UserQuizProfile) => {
    const next = { ...state, profile };
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

  const logMood = useCallback(
    async (mood: Mood) => {
      const today = getToday();
      // Replace today's mood if exists, otherwise add
      const filtered = state.moodEntries.filter((m) => m.date !== today);
      const entry: MoodEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        mood,
        date: today,
        timestamp: new Date().toISOString(),
      };
      await persist({
        ...state,
        moodEntries: [...filtered, entry],
      });
    },
    [state]
  );

  const getTodayMood = useCallback((): MoodEntry | null => {
    const today = getToday();
    return state.moodEntries.find((m) => m.date === today) || null;
  }, [state.moodEntries]);

  const getWeekMoods = useCallback((): (MoodEntry | null)[] => {
    const result: (MoodEntry | null)[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push(state.moodEntries.find((m) => m.date === dateStr) || null);
    }
    return result;
  }, [state.moodEntries]);

  const getTodayStats = useCallback(() => {
    return { minutes: state.todayMinutes, count: state.todayCount };
  }, [state.todayMinutes, state.todayCount]);

  // Focus Score 0-100 based on:
  // - Today's activity count (0-3 = 0-30 pts, 4+ = 40 pts)
  // - Today's minutes (1pt per min, capped at 30)
  // - Streak bonus (up to 30 pts: 1d=5, 3d=10, 7d=20, 14d+=30)
  const getFocusScore = useCallback(() => {
    let score = 0;

    // Activity points (max 40)
    if (state.todayCount >= 4) score += 40;
    else score += state.todayCount * 10;

    // Minute points (max 30)
    score += Math.min(30, state.todayMinutes);

    // Streak bonus (max 30)
    if (state.streak >= 14) score += 30;
    else if (state.streak >= 7) score += 20;
    else if (state.streak >= 3) score += 10;
    else if (state.streak >= 1) score += 5;

    return Math.min(100, Math.round(score));
  }, [state.todayCount, state.todayMinutes, state.streak]);

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
        saveProfile,
        logActivity,
        logMood,
        getTodayMood,
        getWeekMoods,
        getTodayStats,
        getWeekStats,
        getFocusScore,
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
