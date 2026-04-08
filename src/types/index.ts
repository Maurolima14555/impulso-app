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
  ActivitySession: { activity: Activity };
};

// Domain types
export type Activity = {
  id: string;
  title: string;
  duration: number; // minutes
  icon: string;
  category: ActivityCategory;
  description?: string;
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

export const BASE_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Leitura', duration: 10, icon: '📖', category: 'reading' },
  { id: '2', title: 'Meditacao', duration: 5, icon: '🧘', category: 'meditation' },
  { id: '3', title: 'Exercicio', duration: 15, icon: '💪', category: 'exercise' },
  { id: '4', title: 'Journaling', duration: 10, icon: '✍️', category: 'journaling' },
  { id: '5', title: 'Aprender algo novo', duration: 20, icon: '🧠', category: 'learning' },
];
