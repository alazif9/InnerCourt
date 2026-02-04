# Phase 1 Agent: Backend Architect

**Role:** Build Supabase PostgreSQL schema with Row Level Security policies

**Prerequisites:**
- [x] Supabase project created
- [x] Project URL available: `https://pdpscieuujyumgteutni.supabase.co`
- [x] Anon key available: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ✓

---

## Tasks

### 1. Create Migration File
- [ ] Create `supabase/migrations/001_initial_schema.sql`
- [ ] Define 4 core tables:
  - `user_profiles` (archetype scores, birth data, wheel of life)
  - `journal_entries` (soul chronicle with archetype tags + mood)
  - `connections` (social network - friend requests)
  - `insights` (oracle insights - for future use)

### 2. Table Schemas

#### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype_scores JSONB DEFAULT '{}'::jsonb,
  dominant_archetype TEXT CHECK (dominant_archetype IN ('SOL','HERO','SAGE','MOTHER','SHADOW','ANIMA','TRICKSTER','CHILD')),
  wheel_of_life JSONB DEFAULT '{}'::jsonb,
  birth_date DATE,
  birth_location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

#### journal_entries
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  archetype TEXT CHECK (archetype IN ('SOL','HERO','SAGE','MOTHER','SHADOW','ANIMA','TRICKSTER','CHILD')),
  mood TEXT CHECK (mood IN ('transcendent','peaceful','curious','challenged','struggling','transforming')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_journal_user_created ON journal_entries(user_id, created_at DESC);
```

#### connections
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_connections_user ON connections(user_id);
CREATE INDEX idx_connections_friend ON connections(friend_id);
```

#### insights
```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('DAILY','PATTERN','ORACLE')),
  title TEXT,
  content TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  viewed BOOLEAN DEFAULT false
);
```

### 3. Row Level Security (RLS)

**Critical:** All tables must have RLS enabled + policies.

```sql
-- user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);

-- connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON connections FOR SELECT USING (auth.uid() IN (user_id, friend_id));
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON connections FOR DELETE USING (auth.uid() = user_id);

-- insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insights" ON insights FOR SELECT USING (auth.uid() = user_id);
```

### 4. Seed Data (Optional)

Create `supabase/seed.sql` with demo user:
- 1 user profile with 8 archetype scores
- 3 journal entries with different moods
- 2 insights (oracle readings)

### 5. Documentation

Create `supabase/README.md` with:
- Schema overview
- How to apply migration (Supabase dashboard or CLI)
- RLS policy explanations
- Seed data instructions

---

## Acceptance Criteria

- [ ] `supabase/migrations/001_initial_schema.sql` exists and is valid SQL
- [ ] All 4 tables created with proper foreign keys
- [ ] RLS enabled on all tables
- [ ] RLS policies tested (users cannot access others' data)
- [ ] Indexes added for performance (journal_entries, connections)
- [ ] Documentation complete in `supabase/README.md`
- [ ] Seed data script (optional) in `supabase/seed.sql`

---

## kimicode Prompt

```bash
You are the Backend Architect for InnerCourt iOS migration.

Context:
- Hermetic-cyberpunk Jungian psychology app
- 8 archetypes: SOL, HERO, SAGE, MOTHER, SHADOW, ANIMA, TRICKSTER, CHILD
- Privacy-critical: journal entries, psychological scores
- Backend: Supabase PostgreSQL

Your task:
1. Create supabase/migrations/001_initial_schema.sql with:
   - user_profiles (id, user_id FK auth.users, archetype_scores JSONB, dominant_archetype, wheel_of_life JSONB, birth_date, birth_location, timestamps)
   - journal_entries (id, user_id FK, title, content, archetype, mood, timestamps)
   - connections (id, user_id FK, friend_id FK, status, created_at)
   - insights (id, user_id FK, insight_type, title, content, generated_at, viewed)

2. Add indexes:
   - journal_entries: (user_id, created_at DESC)
   - connections: (user_id), (friend_id)

3. Enable ROW LEVEL SECURITY on all tables with policies:
   - user_profiles: users can view/update/insert own profile (auth.uid() = user_id)
   - journal_entries: users can do ALL on own entries (auth.uid() = user_id)
   - connections: users can view if user_id OR friend_id matches, create/update/delete if user_id matches
   - insights: users can view own insights

4. Create supabase/seed.sql with demo data:
   - 1 user profile with all 8 archetype scores (random 40-80)
   - 3 journal entries with different archetypes and moods
   - 2 insights (DAILY and ORACLE types)

5. Create supabase/README.md documenting:
   - Schema overview
   - How to apply migration (dashboard + CLI instructions)
   - RLS policy explanations
   - Seed data usage

Working directory: /Users/diegodamasceno/InnerCourt/
Output folder: .agents/phase1-backend/output/

Supabase credentials:
URL: https://pdpscieuujyumgteutni.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcHNjaWV1dWp5dW1ndGV1dG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzg3NzIsImV4cCI6MjA4NTgxNDc3Mn0.3WWjbyngjtf_rA3-D2nP7HOiy1yINq-RCBd-ThOcppI

When completely finished, run:
openclaw gateway wake --text "Phase 1 complete: Supabase schema ready for review" --mode now
```

---

## Status

**Current:** WAITING FOR SUPABASE CREDENTIALS  
**Next:** Launch kimicode once credentials provided
