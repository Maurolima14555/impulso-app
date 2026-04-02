export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Activities: undefined;
  Settings: undefined;
};

export type Activity = {
  id: string;
  title: string;
  duration: number; // minutes
  icon: string;
  category: ActivityCategory;
};

export type ActivityCategory =
  | 'reading'
  | 'exercise'
  | 'meditation'
  | 'journaling'
  | 'learning'
  | 'other';

export type UserProfile = {
  id: string;
  email?: string;
  plan: 'free' | 'pro';
  createdAt: string;
};

export type SocialUsageAlert = {
  app: string;
  minutesUsed: number;
  threshold: number;
  suggestedActivity: Activity;
};
