-- APEX BJJ DATABASE SCHEMA
-- This script sets up the necessary tables and Row Level Security (RLS) policies 
-- for the cloud sync functionality.

-- 1. PROFILES TABLE
-- Stores user-specific settings and onboarding status
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  belt_level TEXT,
  training_frequency TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  timezone TEXT,
  push_token TEXT,
  subscription_tier TEXT DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MISSIONS TABLE
-- Stores 4-week training missions
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mission_type TEXT,
  position_focus TEXT,
  goal_description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active',
  weekly_goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SESSION GAME PLANS TABLE
-- Stores AI-generated weekly summaries
CREATE TABLE IF NOT EXISTS public.session_game_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  objectives JSONB DEFAULT '[]'::jsonb,
  drill_recommendations JSONB DEFAULT '[]'::jsonb,
  mental_cue TEXT,
  rolling_strategy JSONB DEFAULT '{}'::jsonb,
  fallback_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRAINING LOGS TABLE
-- Stores individual de-briefs and session data
CREATE TABLE IF NOT EXISTS public.training_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mission_id TEXT REFERENCES public.missions(id) ON DELETE SET NULL,
  game_plan_id TEXT REFERENCES public.session_game_plans(id) ON DELETE SET NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voice_transcript TEXT,
  escape_attempts INTEGER DEFAULT 0,
  successful_escapes INTEGER DEFAULT 0,
  escape_rate FLOAT DEFAULT 0.0,
  main_problem TEXT,
  training_notes TEXT,
  intensity_level INTEGER,
  general_training_type TEXT,
  objectives_achieved JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WEEKLY REVIEWS TABLE
-- Stores AI-generated weekly summaries
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  week_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  average_escape_rate FLOAT DEFAULT 0.0,
  recurring_problem TEXT,
  suggested_fix_title TEXT,
  suggested_fix_description TEXT,
  video_resource_url TEXT,
  video_timestamp TEXT,
  user_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CONTENT LIBRARY TABLE
-- Stores instructional content
CREATE TABLE IF NOT EXISTS public.content_library (
  id TEXT PRIMARY KEY,
  position TEXT NOT NULL,
  problem_type TEXT,
  fix_title TEXT NOT NULL,
  fix_description TEXT,
  video_url TEXT NOT NULL,
  video_timestamp TEXT,
  times_recommended INTEGER DEFAULT 0,
  helpfulness_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- This ensures users can only access their own data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_game_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- 8. CREATE POLICIES

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Missions: Users can manage their own missions
CREATE POLICY "Users can manage own missions" ON public.missions FOR ALL USING (auth.uid() = user_id);

-- Session Game Plans: Users can manage their own game plans
CREATE POLICY "Users can manage own game plans" ON public.session_game_plans FOR ALL USING (auth.uid() = user_id);

-- Training Logs: Users can manage their own logs
CREATE POLICY "Users can manage own logs" ON public.training_logs FOR ALL USING (auth.uid() = user_id);

-- Weekly Reviews: Users can manage their own reviews
CREATE POLICY "Users can manage own reviews" ON public.weekly_reviews FOR ALL USING (auth.uid() = user_id);

-- Content Library (Publicly viewable by authenticated users)
CREATE POLICY "Authenticated users can view content" ON public.content_library FOR SELECT TO authenticated USING (true);

-- 9. TRIGGER FOR AUTO-PROFILE CREATION (Optional but recommended)
-- This creates a profile record automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
