/**
 * App Configuration
 * 
 * Central configuration file for app-wide settings.
 * Uses environment variables when available, with sensible defaults.
 */

// App Metadata
export const APP_NAME = 'Apex BJJ';
export const APP_VERSION = '1.0.0';
export const APP_ENV = process.env.APP_ENV || 'development';

// Feature Flags
export const FEATURES = {
  VOICE_RECORDING: true,
  QUICK_LOG: true,
  WEEKLY_REVIEWS: true,
  PAYWALL: false, // Enable when payment processing is ready
  ANALYTICS: false, // Enable when analytics is integrated
  PUSH_NOTIFICATIONS: false, // Enable when push is configured
  CLOUD_SYNC: false, // Enable when Supabase is integrated
  SOCIAL_FEATURES: false, // Future feature
};

// Mission Configuration
export const MISSION_CONFIG = {
  DEFAULT_DURATION_WEEKS: 4,
  MAX_CONCURRENT_MISSIONS: 1, // Premium feature: increase to 3
  WEEKLY_SESSION_TARGET: 3,
  MIN_SESSIONS_FOR_REVIEW: 2,
};

// Training Log Configuration
export const TRAINING_LOG_CONFIG = {
  MAX_RECORDING_SECONDS: 120, // 2 minutes
  MIN_RECORDING_SECONDS: 5,
  MAX_ESCAPE_ATTEMPTS: 100,
  MIN_INTENSITY_LEVEL: 1,
  MAX_INTENSITY_LEVEL: 10,
};

// Progress Tracking
export const PROGRESS_CONFIG = {
  TIME_RANGES: ['1w', '1m', '3m', 'ALL'] as const,
  DEFAULT_TIME_RANGE: '1m',
  CHART_MAX_POINTS: 50, // Performance optimization
  HEATMAP_MONTHS: 3,
};

// Onboarding
export const ONBOARDING_CONFIG = {
  REQUIRED_STEPS: 3, // Welcome, Profile, Mission Preview
  CAN_SKIP: false,
};

// Storage Keys (AsyncStorage)
export const STORAGE_KEYS = {
  USER: '@apexbjj:user',
  MISSIONS: '@apexbjj:missions',
  ACTIVE_MISSION_ID: '@apexbjj:active_mission_id',
  TRAINING_LOGS: '@apexbjj:training_logs',
  WEEKLY_REVIEWS: '@apexbjj:weekly_reviews',
  ONBOARDING_COMPLETE: '@apexbjj:onboarding_complete',
  PREMIUM_STATUS: '@apexbjj:premium_status',
  SETTINGS: '@apexbjj:settings',
} as const;

// API Configuration (Future)
export const API_CONFIG = {
  TIMEOUT_MS: 10000, // 10 seconds
  MAX_RETRIES: 3,
  BASE_URL: '', // Will be Supabase URL
};

// Mock AI Configuration (Current)
export const MOCK_AI_CONFIG = {
  ENABLED: true, // Set to false when real AI is integrated
  TRANSCRIPTION_DELAY_MS: 2000,
  PARSING_DELAY_MS: 1500,
  REVIEW_GENERATION_DELAY_MS: 2000,
};

// Premium Pricing (Future)
export const PREMIUM_CONFIG = {
  MONTHLY_PRICE_USD: 9.99,
  ANNUAL_PRICE_USD: 69.99,
  LIFETIME_PRICE_USD: 149.99,
  FREE_TRIAL_DAYS: 7,
  FEATURES: {
    MULTIPLE_MISSIONS: true,
    CUSTOM_MISSIONS: true,
    ADVANCED_ANALYTICS: true,
    VIDEO_INTEGRATION: true,
    PRIORITY_SUPPORT: true,
  },
};

// Analytics Events (Future)
export const ANALYTICS_EVENTS = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  BELT_SELECTED: 'belt_selected',
  PROBLEM_SELECTED: 'problem_selected',
  
  // Training
  SESSION_LOGGED: 'session_logged',
  VOICE_RECORDING_USED: 'voice_recording_used',
  QUICK_LOG_USED: 'quick_log_used',
  PRE_SESSION_VIEWED: 'pre_session_viewed',
  
  // Progress
  PROGRESS_VIEWED: 'progress_viewed',
  TIME_RANGE_CHANGED: 'time_range_changed',
  
  // Reviews
  WEEKLY_REVIEW_VIEWED: 'weekly_review_viewed',
  REVIEW_FEEDBACK_GIVEN: 'review_feedback_given',
  
  // Missions
  MISSION_STARTED: 'mission_started',
  MISSION_COMPLETED: 'mission_completed',
  
  // Premium
  PAYWALL_VIEWED: 'paywall_viewed',
  PREMIUM_PURCHASED: 'premium_purchased',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Debug Configuration
export const DEBUG_CONFIG = {
  ENABLED: __DEV__, // Only in development
  LOG_STORAGE_OPS: false,
  LOG_NAVIGATION: false,
  LOG_STATE_CHANGES: false,
  SHOW_PERFORMANCE_MONITOR: false,
};

// Export helper functions
export const isProduction = () => APP_ENV === 'production';
export const isDevelopment = () => APP_ENV === 'development';
export const isFeatureEnabled = (feature: keyof typeof FEATURES) => FEATURES[feature];
