import { supabase, isSupabaseConfigured } from './supabase';
import { CompletedActivity } from '../types';

// Sync completed activities to Supabase
export async function syncActivitiesToCloud(
  userId: string,
  activities: CompletedActivity[]
): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;

  try {
    // Upsert activities (idempotent - safe to call multiple times)
    const rows = activities.map((a) => ({
      id: a.id,
      user_id: userId,
      activity_id: a.activityId,
      activity_title: a.activityTitle,
      category: a.category,
      duration: a.duration,
      completed_at: a.completedAt,
    }));

    // Batch in chunks of 100
    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100);
      await supabase
        .from('completed_activities')
        .upsert(chunk, { onConflict: 'id' });
    }
  } catch {
    // Silently fail - data is still in AsyncStorage
  }
}

// Fetch activities from cloud (for device restore)
export async function fetchActivitiesFromCloud(
  userId: string
): Promise<CompletedActivity[]> {
  if (!isSupabaseConfigured || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('completed_activities')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      activityId: row.activity_id,
      activityTitle: row.activity_title,
      category: row.category,
      duration: row.duration,
      completedAt: row.completed_at,
    }));
  } catch {
    return [];
  }
}

// Save user profile to Supabase
export async function saveUserProfile(
  userId: string,
  data: { name?: string; plan?: string; streak?: number; totalMinutes?: number }
): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;

  try {
    await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
  } catch {
    // Silent fail
  }
}

// Delete all user data (GDPR)
export async function deleteAllUserData(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return true;

  try {
    await supabase.from('completed_activities').delete().eq('user_id', userId);
    await supabase.from('user_profiles').delete().eq('id', userId);
    return true;
  } catch {
    return false;
  }
}

// SQL schema for reference - run this in Supabase SQL editor:
/*
-- Users profile (extends Supabase auth.users)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text default 'free' check (plan in ('free', 'pro')),
  streak integer default 0,
  total_minutes integer default 0,
  updated_at timestamptz default now()
);

-- Completed activities
create table public.completed_activities (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  activity_id text not null,
  activity_title text not null,
  category text not null,
  duration integer not null,
  completed_at timestamptz not null
);

-- RLS policies
alter table public.user_profiles enable row level security;
alter table public.completed_activities enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users can read own activities"
  on public.completed_activities for select using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.completed_activities for insert with check (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.completed_activities for delete using (auth.uid() = user_id);

-- Indexes
create index idx_activities_user on public.completed_activities(user_id);
create index idx_activities_date on public.completed_activities(completed_at desc);
*/
