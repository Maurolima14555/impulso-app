// Navigation types
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Activities: undefined;
  Stats: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ActivityDetail: { activity: Activity };
  ActivitySession: { activity: Activity };
  SessionReflection: { activity: Activity; duration: number };
  ProgramDetail: { program: Program };
};

// Domain types
export type Intention = 'sos' | 'focus' | 'energy' | 'sleep' | 'clarity' | 'recharge' | 'morning' | 'night';

export type Activity = {
  id: string;
  title: string;
  duration: number; // minutes
  icon: string;
  category: ActivityCategory;
  description?: string;
  // Rich content (optional, for premium feel)
  longDescription?: string;
  benefit?: string;        // "Porque fazer isto"
  steps?: string[];        // Numbered steps to follow
  tip?: string;            // Pro tip
  intentions?: Intention[]; // What this activity helps with
  quote?: string;          // Optional quote shown during session
};

// Post-session reflection
export type SessionFeeling = 'great' | 'ok' | 'hard';

export type SessionReflection = {
  id: string;
  activityId: string;
  feeling: SessionFeeling;
  note?: string;
  completedAt: string;
};

// Programs (guided journeys)
export type Program = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: readonly [string, string];
  totalDays: number;
  intention: Intention;
  category: ActivityCategory;
  activityIds: string[]; // One per day
  isPro: boolean;
};

export type ProgramProgress = {
  programId: string;
  startedAt: string;
  currentDay: number; // 1-based
  completedDays: number[]; // Array of day numbers completed
};

export type ActivityCategory =
  | 'reading'
  | 'exercise'
  | 'meditation'
  | 'journaling'
  | 'learning'
  | 'other';

export type CompletedActivity = {
  id: string;
  activityId: string;
  activityTitle: string;
  category: ActivityCategory;
  duration: number; // actual minutes spent
  completedAt: string; // ISO date
};

export type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  plan: 'free' | 'pro';
  createdAt: string;
  streak: number;
  totalMinutes: number;
};

export type DailyStats = {
  date: string;
  minutesSaved: number;
  activitiesCompleted: number;
};

export type SocialUsageAlert = {
  app: string;
  minutesUsed: number;
  threshold: number;
  suggestedActivity: Activity;
};

// User profile from onboarding quiz
export type ScreenTimeRange = 'low' | 'medium' | 'high' | 'extreme';
export type DistractionApp = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'other';
export type Goal = 'focus' | 'calm' | 'health' | 'knowledge';
export type DistractionTime = 'morning' | 'afternoon' | 'evening' | 'night';

export type UserQuizProfile = {
  name?: string;
  screenTime: ScreenTimeRange;
  distraction: DistractionApp;
  goal: Goal;
  distractionTime: DistractionTime;
  completedAt: string;
};

// Mood tracking
export type Mood = 'energetic' | 'good' | 'neutral' | 'tired' | 'anxious' | 'stressed';

export type MoodEntry = {
  id: string;
  mood: Mood;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
};

export type MoodInfo = {
  id: Mood;
  emoji: string;
  label: string;
  color: string;
  recommendedCategories: ActivityCategory[];
};

export type IntentionInfo = {
  id: Intention;
  emoji: string;
  label: string;
  tagline: string;
  color: string;
};

export const INTENTIONS: IntentionInfo[] = [
  { id: 'sos', emoji: '🆘', label: 'SOS Ansiedade', tagline: 'Acalma agora', color: '#ef4444' },
  { id: 'focus', emoji: '🎯', label: 'Foco Profundo', tagline: 'Entra na zona', color: '#3b82f6' },
  { id: 'energy', emoji: '⚡', label: 'Energia', tagline: 'Acorda o corpo', color: '#f97316' },
  { id: 'sleep', emoji: '🌙', label: 'Preparar Dormir', tagline: 'Desliga com calma', color: '#6366f1' },
  { id: 'clarity', emoji: '💭', label: 'Clareza Mental', tagline: 'Organiza as ideias', color: '#a855f7' },
  { id: 'recharge', emoji: '🔋', label: 'Recarregar', tagline: 'Em 5 minutos', color: '#10b981' },
  { id: 'morning', emoji: '🌅', label: 'Rotina Manha', tagline: 'Comeca bem o dia', color: '#f59e0b' },
  { id: 'night', emoji: '🌃', label: 'Rotina Noite', tagline: 'Fecha o dia', color: '#8b5cf6' },
];

export const MOODS: MoodInfo[] = [
  {
    id: 'energetic',
    emoji: '🤩',
    label: 'Energetico',
    color: '#f97316',
    recommendedCategories: ['exercise', 'learning'],
  },
  {
    id: 'good',
    emoji: '😊',
    label: 'Bem',
    color: '#22c55e',
    recommendedCategories: ['reading', 'exercise'],
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Neutro',
    color: '#a1a1aa',
    recommendedCategories: ['reading', 'learning'],
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Cansado',
    color: '#3b82f6',
    recommendedCategories: ['meditation', 'reading'],
  },
  {
    id: 'anxious',
    emoji: '😟',
    label: 'Ansioso',
    color: '#a855f7',
    recommendedCategories: ['meditation', 'journaling'],
  },
  {
    id: 'stressed',
    emoji: '😤',
    label: 'Stressado',
    color: '#ef4444',
    recommendedCategories: ['exercise', 'meditation'],
  },
];

export const BASE_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Leitura', duration: 10, icon: '📖', category: 'reading' },
  { id: '2', title: 'Meditacao', duration: 5, icon: '🧘', category: 'meditation' },
  { id: '3', title: 'Exercicio', duration: 15, icon: '💪', category: 'exercise' },
  { id: '4', title: 'Journaling', duration: 10, icon: '✍️', category: 'journaling' },
  { id: '5', title: 'Aprender algo novo', duration: 20, icon: '🧠', category: 'learning' },
];
