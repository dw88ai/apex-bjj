/**
 * Supabase client and helper functions
 * Single file containing client initialization, auth helpers, and cloud sync
 */

import { createClient, Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, TrainingLog, WeeklyReview } from '../types';

// Environment variables (set in .env.local)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Create Supabase client
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  return supabase.auth.signInWithPassword({ email, password });
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  return supabase.auth.signUp({ email, password });
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  return supabase.auth.signOut();
};

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Get current user ID (convenience helper)
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.id || null;
};

// ============================================================================
// CLOUD SYNC HELPERS (Fire-and-forget)
// ============================================================================

/**
 * Sync a mission to Supabase (non-blocking)
 */
export const syncMission = async (mission: Mission): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('missions').upsert({
      id: mission.id,
      user_id: userId,
      mission_type: mission.missionType,
      position_focus: mission.positionFocus,
      goal_description: mission.goalDescription,
      start_date: mission.startDate.toISOString(),
      end_date: mission.endDate.toISOString(),
      status: mission.status,
      weekly_goals: mission.weeklyGoals || [],
      created_at: mission.createdAt.toISOString(),
    });
  } catch (error) {
    // Silent fail - offline or network error
    console.debug('[Supabase] Mission sync failed (offline?):', error);
  }
};

/**
 * Sync a training log to Supabase (non-blocking)
 */
export const syncTrainingLog = async (log: TrainingLog): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('training_logs').upsert({
      id: log.id,
      user_id: userId,
      mission_id: log.missionId || null,
      game_plan_id: log.gamePlanId || null,
      session_date: log.sessionDate.toISOString(),
      voice_transcript: log.voiceTranscript || null,
      escape_attempts: log.escapeAttempts,
      successful_escapes: log.successfulEscapes,
      escape_rate: log.escapeRate,
      main_problem: log.mainProblem || null,
      training_notes: log.trainingNotes || null,
      intensity_level: log.intensityLevel || null,
      general_training_type: log.generalTrainingType || null,
      objectives_achieved: log.objectivesAchieved || [],
      created_at: log.createdAt.toISOString(),
    });
  } catch (error) {
    // Silent fail - offline or network error
    console.debug('[Supabase] Training log sync failed (offline?):', error);
  }
};

/**
 * Sync a weekly review to Supabase (non-blocking)
 */
export const syncWeeklyReview = async (review: WeeklyReview): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('weekly_reviews').upsert({
      id: review.id,
      user_id: userId,
      mission_id: review.missionId,
      week_number: review.weekNumber,
      week_start_date: review.weekStartDate.toISOString(),
      total_sessions: review.totalSessions,
      average_escape_rate: review.averageEscapeRate,
      recurring_problem: review.recurringProblem || null,
      suggested_fix_title: review.suggestedFixTitle || null,
      suggested_fix_description: review.suggestedFixDescription || null,
      video_resource_url: review.videoResourceUrl || null,
      video_timestamp: review.videoTimestamp || null,
      user_feedback: review.userFeedback || null,
      created_at: review.createdAt.toISOString(),
    });
  } catch (error) {
    // Silent fail - offline or network error
    console.debug('[Supabase] Weekly review sync failed (offline?):', error);
  }
};

/**
 * Sync a session game plan to Supabase (non-blocking)
 */
export const syncSessionGamePlan = async (gamePlan: any): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('session_game_plans').upsert({
      id: gamePlan.id,
      user_id: userId,
      mission_id: gamePlan.missionId,
      week_number: gamePlan.weekNumber,
      generated_date: gamePlan.generatedDate.toISOString(),
      objectives: gamePlan.objectives || [],
      drill_recommendations: gamePlan.drillRecommendations || [],
      mental_cue: gamePlan.mentalCue || null,
      rolling_strategy: gamePlan.rollingStrategy || {},
      fallback_plan: gamePlan.fallbackPlan || null,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.debug('[Supabase] Game plan sync failed (offline?):', error);
  }
};

/**
 * Sync user profile to Supabase (non-blocking)
 */
export const syncUserProfile = async (profile: {
  beltLevel: string;
  trainingFrequency: string;
  onboardingComplete: boolean;
  timezone?: string;
  pushToken?: string;
  subscriptionTier?: 'free' | 'premium';
}): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('profiles').update({
      belt_level: profile.beltLevel,
      training_frequency: profile.trainingFrequency,
      onboarding_complete: profile.onboardingComplete,
      timezone: profile.timezone || null,
      push_token: profile.pushToken || null,
      subscription_tier: profile.subscriptionTier || 'free',
    }).eq('id', userId);
  } catch (error) {
    // Silent fail - offline or network error
    console.debug('[Supabase] Profile sync failed (offline?):', error);
  }
};

// ============================================================================
// DATA FETCHING (For initial sync on login)
// ============================================================================

/**
 * Fetch all user data from Supabase
 * Call this on login to hydrate local storage
 */
export const fetchUserData = async (): Promise<{
  missions: any[];
  trainingLogs: any[];
  weeklyReviews: any[];
  gamePlans: any[];
  profile: any | null;
} | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const [missions, logs, reviews, gamePlans, profile] = await Promise.all([
      supabase.from('missions').select('*').eq('user_id', userId),
      supabase.from('training_logs').select('*').eq('user_id', userId),
      supabase.from('weekly_reviews').select('*').eq('user_id', userId),
      supabase.from('session_game_plans').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('id', userId).single(),
    ]);

    return {
      missions: missions.data || [],
      trainingLogs: logs.data || [],
      weeklyReviews: reviews.data || [],
      gamePlans: gamePlans.data || [],
      profile: profile.data,
    };
  } catch (error) {
    console.error('[Supabase] Failed to fetch user data:', error);
    return null;
  }
};

/**
 * Fetch content library from Supabase
 */
export const fetchContentLibrary = async (position?: string): Promise<any[]> => {
  try {
    let query = supabase.from('content_library').select('*');
    if (position) {
      query = query.eq('position', position);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[Supabase] Failed to fetch content library:', error);
    return [];
  }
};

/**
 * Delete a training log from Supabase
 */
export const deleteTrainingLogFromCloud = async (logId: string): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase.from('training_logs').delete().eq('id', logId).eq('user_id', userId);
  } catch (error) {
    console.debug('[Supabase] Training log delete failed (offline?):', error);
  }
};
