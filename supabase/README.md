# InnerCourt Supabase Backend

**Backend for hermetic-cyberpunk Jungian psychology app**

- **Database:** PostgreSQL (Supabase)
- **Security:** Row Level Security (RLS) enabled on all tables
- **Project:** https://pdpscieuujyumgteutni.supabase.co

---

## Tables

### 1. user_profiles
Stores user archetype scores, birth data, and wheel of life balance.

**Schema:**
```sql
id              UUID PRIMARY KEY
user_id         UUID → auth.users(id)  [UNIQUE]
archetype_scores JSONB                  {"SOL": 72, "HERO": 58, ...}
dominant_archetype TEXT                 SOL|HERO|SAGE|MOTHER|SHADOW|ANIMA|TRICKSTER|CHILD
wheel_of_life   JSONB                   {"career": 75, "finance": 62, ...}
birth_date      DATE
birth_location  TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ (auto-updated)
```

**RLS Policies:**
- Users can SELECT/UPDATE/INSERT own profile (`auth.uid() = user_id`)

---

### 2. journal_entries
Soul Chronicle - journal entries with archetypal awareness.

**Schema:**
```sql
id          UUID PRIMARY KEY
user_id     UUID → auth.users(id)
title       TEXT (optional)
content     TEXT (required)
archetype   TEXT                      SOL|HERO|SAGE|MOTHER|SHADOW|ANIMA|TRICKSTER|CHILD
mood        TEXT                      transcendent|peaceful|curious|challenged|struggling|transforming
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ (auto-updated)
```

**Indexes:**
- `(user_id, created_at DESC)` - Fast sorted queries

**RLS Policies:**
- Users can do ALL operations on own entries (`auth.uid() = user_id`)

---

### 3. connections
Social Nexus - connections between users based on archetypal affinities.

**Schema:**
```sql
id          UUID PRIMARY KEY
user_id     UUID → auth.users(id)
friend_id   UUID → auth.users(id)
status      TEXT                      pending|accepted|rejected
created_at  TIMESTAMPTZ
```

**Constraints:**
- `UNIQUE(user_id, friend_id)` - No duplicate connections
- `CHECK(user_id != friend_id)` - No self-connections

**Indexes:**
- `(user_id)`, `(friend_id)`, `(status)` - Fast lookups

**RLS Policies:**
- SELECT: Users can view connections where they are user_id OR friend_id
- INSERT/UPDATE/DELETE: Users can manage connections they initiated (`user_id` only)

---

### 4. insights
Oracle insights - daily readings and pattern recognition.

**Schema:**
```sql
id              UUID PRIMARY KEY
user_id         UUID → auth.users(id)
insight_type    TEXT                      DAILY|PATTERN|ORACLE
title           TEXT (optional)
content         TEXT (required)
generated_at    TIMESTAMPTZ
viewed          BOOLEAN (default: false)
```

**Indexes:**
- `(user_id, generated_at DESC)` - Fast sorted queries

**RLS Policies:**
- Users can SELECT/UPDATE own insights (`auth.uid() = user_id`)

---

## Row Level Security (RLS)

**All tables have RLS enabled.** This ensures users can only access their own data.

### How it works:
- `auth.uid()` returns the UUID of the currently authenticated user
- Policies compare `auth.uid()` with `user_id` in each table
- If match fails, query returns 0 rows (data is invisible)

### Testing RLS:
```sql
-- As user A, try to read user B's profile
SELECT * FROM user_profiles WHERE user_id = '<user_b_uuid>';
-- Returns 0 rows (RLS blocks it)

-- As user A, read your own profile
SELECT * FROM user_profiles WHERE user_id = auth.uid();
-- Returns your profile (RLS allows it)
```

---

## How to Apply Migrations

### Option 1: Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard
2. Select project: **InnerCourt** (ID: pdpscieuujyumgteutni)
3. Navigate to **SQL Editor**
4. Click **New query**
5. Paste contents of `migrations/001_initial_schema.sql`
6. Click **Run**
7. Verify tables created: **Database** → **Tables**

### Option 2: Supabase CLI

**Install CLI:**
```bash
npm install -g supabase
```

**Login:**
```bash
supabase login
```

**Link project:**
```bash
cd /path/to/InnerCourt
supabase link --project-ref pdpscieuujyumgteutni
```

**Apply migration:**
```bash
supabase db push
```

---

## Seed Data

**File:** `supabase/seed.sql`

Contains demo data:
- 1 user profile (8 archetype scores, birth data)
- 3 journal entries (different moods/archetypes)
- 2 insights (DAILY + ORACLE)

### How to use seed data:

**Important:** Replace demo UUID with real user UUID first!

1. Create a demo user via Supabase Auth:
   - Dashboard → **Authentication** → **Add user**
   - Email: `demo@innercourt.app`
   - Password: (your choice)
   - Confirm email: Yes

2. Get the user's UUID:
   ```sql
   SELECT id FROM auth.users WHERE email = 'demo@innercourt.app';
   ```

3. Edit `seed.sql`:
   - Replace `'00000000-0000-0000-0000-000000000001'` with real UUID

4. Run seed:
   - Dashboard → **SQL Editor** → paste `seed.sql` → **Run**

---

## Environment Variables

For React app (`src/lib/supabaseClient.js`):

```env
VITE_SUPABASE_URL=https://pdpscieuujyumgteutni.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcHNjaWV1dWp5dW1ndGV1dG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzg3NzIsImV4cCI6MjA4NTgxNDc3Mn0.3WWjbyngjtf_rA3-D2nP7HOiy1yINq-RCBd-ThOcppI
```

**Note:** Anon key is safe for client-side use. RLS policies protect data.

---

## Archetype Reference

The 8 Jungian archetypes in InnerCourt:

| Archetype | Symbol | Role |
|-----------|--------|------|
| SOL | ☉ | Radiant self, center |
| HERO | ♂ | Courage, action |
| SAGE | ☿ | Wisdom, knowledge |
| MOTHER | ☽ | Nurture, compassion |
| SHADOW | ♄ | Hidden depths |
| ANIMA | ♀ | Inner feminine/masculine |
| TRICKSTER | ☌ | Chaos, transformation |
| CHILD | ☆ | Wonder, innocence |

---

## Wheel of Life Dimensions

The 5 growth dimensions tracked in analytics:

| Dimension | Description |
|-----------|-------------|
| SOCIAL | Relationships, community |
| TECHNICAL | Skills, learning |
| PHYSICAL | Health, fitness |
| ECONOMIC | Finance, career |
| SPIRITUAL | Meaning, purpose |

(Note: Current schema uses 8 dimensions from Base44. May consolidate to 5 in Phase 2.)

---

## Troubleshooting

### "permission denied for table X"
→ RLS policy blocks access. Check:
1. User is authenticated (`SELECT auth.uid()` returns UUID)
2. Policy exists for table (`\d+ table_name` in psql)
3. User is querying their own data (`user_id = auth.uid()`)

### "insert or update on table X violates foreign key constraint"
→ `user_id` doesn't exist in `auth.users`. Create user via Supabase Auth first.

### "duplicate key value violates unique constraint"
→ Trying to insert duplicate data (e.g., two profiles for same user_id).

---

## Next Steps (Phase 2)

- [ ] Migrate React app from Base44 → Supabase client
- [ ] Replace `created_by: email` with `user_id: uuid`
- [ ] Build custom login UI (Base44 → Supabase Auth)
- [ ] Test RLS policies with real users
- [ ] Optimize JSONB queries if needed

---

**Created:** 2026-02-04  
**Migration:** 001_initial_schema.sql  
**Status:** ✓ Ready for Phase 2
