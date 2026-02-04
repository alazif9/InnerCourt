-- InnerCourt Initial Schema
-- Hermetic-cyberpunk Jungian psychology app
-- Backend: Supabase PostgreSQL
-- Created: 2026-02-04

-- ============================================================
-- TABLE: user_profiles
-- Stores user archetype scores, birth data, wheel of life
-- ============================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  archetype_scores JSONB DEFAULT '{}'::jsonb,
  dominant_archetype TEXT CHECK (dominant_archetype IN ('SOL','HERO','SAGE','MOTHER','SHADOW','ANIMA','TRICKSTER','CHILD')),
  wheel_of_life JSONB DEFAULT '{}'::jsonb,
  birth_date DATE,
  birth_location TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABLE: journal_entries
-- Soul Chronicle - journal entries with archetype tags
-- ============================================================

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  archetype TEXT CHECK (archetype IN ('SOL','HERO','SAGE','MOTHER','SHADOW','ANIMA','TRICKSTER','CHILD')),
  mood TEXT CHECK (mood IN ('transcendent','peaceful','curious','challenged','struggling','transforming')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for fast user queries (sorted by date)
CREATE INDEX idx_journal_user_created ON journal_entries(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own entries" 
  ON journal_entries FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: connections
-- Social Nexus - friend connections
-- ============================================================

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_connections_user ON connections(user_id);
CREATE INDEX idx_connections_friend ON connections(friend_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Row Level Security
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections" 
  ON connections FOR SELECT 
  USING (auth.uid() IN (user_id, friend_id));

CREATE POLICY "Users can create connections" 
  ON connections FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections" 
  ON connections FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections" 
  ON connections FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: insights
-- Oracle insights - daily readings and pattern recognition
-- ============================================================

CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT CHECK (insight_type IN ('DAILY','PATTERN','ORACLE')) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  viewed BOOLEAN DEFAULT false NOT NULL
);

-- Index for fast user queries
CREATE INDEX idx_insights_user ON insights(user_id, generated_at DESC);

-- Row Level Security
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights" 
  ON insights FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" 
  ON insights FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at 
  BEFORE UPDATE ON journal_entries 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- COMMENTS: Documentation for each table
-- ============================================================

COMMENT ON TABLE user_profiles IS 'User archetype scores, birth data, and wheel of life balance';
COMMENT ON TABLE journal_entries IS 'Soul Chronicle - user journal entries with archetypal awareness';
COMMENT ON TABLE connections IS 'Social Nexus - connections between users based on archetypal affinities';
COMMENT ON TABLE insights IS 'Oracle insights generated from user psychological patterns';

COMMENT ON COLUMN user_profiles.archetype_scores IS 'JSONB: {SOL: 45, HERO: 67, ...} - scores 0-100 for each archetype';
COMMENT ON COLUMN user_profiles.wheel_of_life IS 'JSONB: {career: 60, finance: 45, ...} - life balance scores';
COMMENT ON COLUMN journal_entries.mood IS 'Consciousness state during entry';
COMMENT ON COLUMN connections.status IS 'pending = request sent, accepted = mutual connection, rejected = declined';
COMMENT ON COLUMN insights.insight_type IS 'DAILY = daily reading, PATTERN = identified pattern, ORACLE = deep insight';
