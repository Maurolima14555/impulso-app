import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { sendScreenTimeNudge } from './notifications';

const SCREEN_TIME_TASK = 'IMPULSO_SCREEN_TIME_CHECK';
const USAGE_KEY = '@impulso_usage';
const THRESHOLD_MINUTES = 30;

// Track when user leaves/returns to IMPULSO
// This is the cross-platform approach that works without native Screen Time API
// It monitors total phone usage patterns and nudges based on time away from IMPULSO

type UsageData = {
  todayDate: string;
  appOpenCount: number;
  lastLeftAt: string | null; // ISO timestamp when user left IMPULSO
  totalMinutesAway: number; // cumulative minutes spent away from IMPULSO today
  nudgesSentToday: number;
  lastNudgeAt: string | null;
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultUsage(): UsageData {
  return {
    todayDate: getToday(),
    appOpenCount: 0,
    lastLeftAt: null,
    totalMinutesAway: 0,
    nudgesSentToday: 0,
    lastNudgeAt: null,
  };
}

async function getUsage(): Promise<UsageData> {
  const raw = await AsyncStorage.getItem(USAGE_KEY);
  if (!raw) return getDefaultUsage();
  const data: UsageData = JSON.parse(raw);
  // Reset if new day
  if (data.todayDate !== getToday()) return getDefaultUsage();
  return data;
}

async function saveUsage(data: UsageData): Promise<void> {
  await AsyncStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

// Called when user opens IMPULSO
export async function onAppForeground(): Promise<void> {
  const usage = await getUsage();

  // Calculate time spent away
  if (usage.lastLeftAt) {
    const leftAt = new Date(usage.lastLeftAt).getTime();
    const now = Date.now();
    const minutesAway = Math.round((now - leftAt) / 60000);
    usage.totalMinutesAway += minutesAway;
  }

  usage.appOpenCount += 1;
  usage.lastLeftAt = null;
  usage.todayDate = getToday();

  await saveUsage(usage);
}

// Called when user leaves IMPULSO (goes to another app)
export async function onAppBackground(): Promise<void> {
  const usage = await getUsage();
  usage.lastLeftAt = new Date().toISOString();
  await saveUsage(usage);
}

// Check if we should send a nudge
async function checkAndNudge(): Promise<void> {
  const usage = await getUsage();

  if (!usage.lastLeftAt) return; // User is in IMPULSO, no nudge needed

  const leftAt = new Date(usage.lastLeftAt).getTime();
  const now = Date.now();
  const minutesAway = Math.round((now - leftAt) / 60000);

  // Don't spam - max 3 nudges per day, minimum 30 min between nudges
  if (usage.nudgesSentToday >= 3) return;
  if (usage.lastNudgeAt) {
    const lastNudge = new Date(usage.lastNudgeAt).getTime();
    if ((now - lastNudge) < 30 * 60000) return; // Less than 30 min since last nudge
  }

  // Send nudge if away for more than threshold
  if (minutesAway >= THRESHOLD_MINUTES) {
    await sendScreenTimeNudge();
    usage.nudgesSentToday += 1;
    usage.lastNudgeAt = new Date().toISOString();
    usage.totalMinutesAway += minutesAway;
    usage.lastLeftAt = new Date().toISOString(); // Reset timer
    await saveUsage(usage);
  }
}

// Get today's usage stats for display
export async function getTodayUsageStats(): Promise<{
  minutesAway: number;
  appOpens: number;
  nudgesSent: number;
}> {
  const usage = await getUsage();

  let currentMinutesAway = usage.totalMinutesAway;
  if (usage.lastLeftAt) {
    const leftAt = new Date(usage.lastLeftAt).getTime();
    currentMinutesAway += Math.round((Date.now() - leftAt) / 60000);
  }

  return {
    minutesAway: currentMinutesAway,
    appOpens: usage.appOpenCount,
    nudgesSent: usage.nudgesSentToday,
  };
}

// Register background task for periodic screen time checks
TaskManager.defineTask(SCREEN_TIME_TASK, async () => {
  try {
    await checkAndNudge();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Initialize screen time monitoring
export async function initScreenTimeMonitoring(): Promise<void> {
  // Register background fetch (checks every ~15 min on iOS, varies on Android)
  const status = await BackgroundFetch.getStatusAsync();

  if (
    status === BackgroundFetch.BackgroundFetchStatus.Available
  ) {
    await BackgroundFetch.registerTaskAsync(SCREEN_TIME_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }

  // Also monitor app state changes
  AppState.addEventListener('change', handleAppStateChange);
}

let appStateRef: AppStateStatus = AppState.currentState;

function handleAppStateChange(nextAppState: AppStateStatus) {
  if (appStateRef.match(/inactive|background/) && nextAppState === 'active') {
    onAppForeground();
  } else if (appStateRef === 'active' && nextAppState.match(/inactive|background/)) {
    onAppBackground();
  }
  appStateRef = nextAppState;
}

// Stop monitoring
export async function stopScreenTimeMonitoring(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(SCREEN_TIME_TASK);
  if (isRegistered) {
    await BackgroundFetch.unregisterTaskAsync(SCREEN_TIME_TASK);
  }
}
