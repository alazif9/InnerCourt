# Phase 2 Agent: Frontend Migrator

**Role:** Migrate Base44 SDK to Supabase client in React app

**Prerequisites:**
- [x] Phase 1 complete (Supabase schema deployed)
- [ ] Supabase credentials available
- [ ] Decision on auth flow (email/password or magic link)
- [ ] Decision on Friends feature (include or defer to v2)

---

## Tasks

### 1. Remove Base44 Dependencies

```bash
npm uninstall @base44/sdk @base44/vite-plugin
npm install @supabase/supabase-js
```

### 2. Create Supabase Client

**File:** `src/lib/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Rewrite AuthContext

**File:** `src/lib/AuthContext.jsx`

**Changes:**
- Replace `base44.auth.me()` → `supabase.auth.getUser()`
- Replace `base44.auth.logout()` → `supabase.auth.signOut()`
- Remove external login redirect (Base44 pattern)
- Add custom login UI (email/password or magic link)

**Key difference:**
- Base44: `created_by: email` (email string)
- Supabase: `user_id: uuid` (auth.users FK)

### 4. Migrate Pages (8 Files)

#### Home.jsx
- [ ] Replace `base44.auth.me()` → `supabase.auth.getUser()`
- [ ] Replace `base44.entities.UserProfile.filter({ created_by: email })` → `supabase.from('user_profiles').select('*').eq('user_id', user.id).single()`
- [ ] Destructure `{ data }` from Supabase response

#### Journal.jsx
- [ ] List: `base44.entities.JournalEntry.filter({ created_by }, '-created_date', 20)` → `supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)`
- [ ] Create: `base44.entities.JournalEntry.create(entry)` → `supabase.from('journal_entries').insert({ ...entry, user_id: user.id })`
- [ ] Note: No longer pass `created_by`, use `user_id`

#### Profile.jsx
- [ ] Same UserProfile query as Home.jsx
- [ ] Logout: `base44.auth.logout()` → `supabase.auth.signOut()`

#### EditProfile.jsx
- [ ] Read: UserProfile query
- [ ] Create: `base44.entities.UserProfile.create(data)` → `supabase.from('user_profiles').insert({ ...data, user_id: user.id })`
- [ ] Update: `base44.entities.UserProfile.update(id, data)` → `supabase.from('user_profiles').update(data).eq('id', id)`

#### Analytics.jsx
- [ ] Same UserProfile query (archetype_scores, wheel_of_life)

#### Friends.jsx ⚠️ COMPLEX (defer to v2 if needed)
- [ ] List sent: `base44.entities.Friend.filter({ user_email })` → `supabase.from('connections').select('*').eq('user_id', user.id)`
- [ ] List received: `base44.entities.Friend.filter({ friend_email })` → `supabase.from('connections').select('*').eq('friend_id', user.id)`
- [ ] Create: `base44.entities.Friend.create({ user_email, friend_email, status })` → Need to lookup friend by email first
- [ ] Update: `base44.entities.Friend.update(id, { status })` → `supabase.from('connections').update({ status }).eq('id', id)`
- [ ] Delete: `base44.entities.Friend.delete(id)` → `supabase.from('connections').delete().eq('id', id)`
- [ ] **Problem:** Base44 uses email for friend lookup, Supabase uses UUID
- [ ] **Solution:** Add email search via `supabase.rpc('get_user_by_email', { email })` or defer feature

#### AboutYou.jsx
- [ ] Same UserProfile query (birth_date, birth_location for astrology)

#### Onboarding.jsx
- [ ] Create UserProfile on signup

### 5. Create Login Page (NEW)

**File:** `src/pages/Login.jsx`

Base44 redirects to external login. Supabase needs custom UI.

**Options:**
- Email/password form
- Magic link (passwordless)
- OAuth (Google/Apple)

**Recommendation:** Email/password for v1

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

### 6. Update Environment Variables

**File:** `.env.example`

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 7. Update package.json

Remove Base44, add Supabase:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

---

## Acceptance Criteria

- [ ] Base44 SDK completely removed
- [ ] Supabase client configured
- [ ] AuthContext rewritten (auth.getUser, signOut)
- [ ] All 8 pages migrated (or Friends deferred)
- [ ] Login page created
- [ ] Web app runs: `npm run dev` works
- [ ] User can signup, login, logout
- [ ] Profile CRUD works
- [ ] Journal CRUD works
- [ ] Analytics displays data
- [ ] No Base44 references remain in codebase

---

## Files to Modify

- [ ] Delete: `src/api/base44Client.js`
- [ ] Delete: `src/lib/app-params.js` (Base44-specific)
- [ ] Create: `src/lib/supabaseClient.js`
- [ ] Rewrite: `src/lib/AuthContext.jsx`
- [ ] Update: `src/pages/Home.jsx`
- [ ] Update: `src/pages/Journal.jsx`
- [ ] Update: `src/pages/Profile.jsx`
- [ ] Update: `src/pages/EditProfile.jsx`
- [ ] Update: `src/pages/Analytics.jsx`
- [ ] Update: `src/pages/Friends.jsx` (or skip if deferred)
- [ ] Update: `src/pages/AboutYou.jsx`
- [ ] Update: `src/pages/Onboarding.jsx`
- [ ] Create: `src/pages/Login.jsx`
- [ ] Update: `package.json`
- [ ] Create: `.env.example`
- [ ] Update: `vite.config.js` (remove Base44 plugin)

---

## kimicode Prompt

```bash
You are the Frontend Migrator for InnerCourt iOS migration.

Context:
- Phase 1 complete: Supabase backend is ready
- Current app uses Base44 SDK (@base44/sdk)
- Need to migrate all data operations to Supabase client

Your task:

1. Remove Base44:
   npm uninstall @base44/sdk @base44/vite-plugin
   npm install @supabase/supabase-js

2. Create src/lib/supabaseClient.js:
   - Import createClient from @supabase/supabase-js
   - Use env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   - Export supabase client

3. Delete Base44 files:
   - src/api/base44Client.js
   - src/lib/app-params.js

4. Rewrite src/lib/AuthContext.jsx:
   - Replace base44.auth.me() with supabase.auth.getUser()
   - Replace base44.auth.logout() with supabase.auth.signOut()
   - Change from email-based (created_by) to UUID-based (user_id)
   - Remove external login redirect pattern

5. Create src/pages/Login.jsx:
   - Email/password form (or magic link if Diego prefers)
   - Use supabase.auth.signInWithPassword({ email, password })
   - Redirect to home after login

6. Migrate 8 pages (Base44 → Supabase):

   Home.jsx:
   - base44.entities.UserProfile.filter({ created_by: email }) 
     → supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
   
   Journal.jsx:
   - List: .filter({ created_by }, '-created_date', 20)
     → .from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
   - Create: .entities.JournalEntry.create(entry)
     → .from('journal_entries').insert({ ...entry, user_id: user.id })
   
   Profile.jsx:
   - Same UserProfile query as Home
   - Logout: base44.auth.logout() → supabase.auth.signOut()
   
   EditProfile.jsx:
   - Create: .entities.UserProfile.create(data)
     → .from('user_profiles').insert({ ...data, user_id: user.id })
   - Update: .entities.UserProfile.update(id, data)
     → .from('user_profiles').update(data).eq('id', id)
   
   Analytics.jsx:
   - Same UserProfile query
   
   AboutYou.jsx:
   - Same UserProfile query
   
   Onboarding.jsx:
   - Same UserProfile.create pattern
   
   Friends.jsx:
   [DEFER IF DIEGO CHOOSES - note in output if skipped]
   - Complex: email-based lookups need UUID conversion
   - Option: Skip for v1, include placeholder "Coming soon"

7. Update package.json (remove @base44/* deps)

8. Create .env.example:
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=

9. Update vite.config.js (remove @base44/vite-plugin)

10. Test: npm run dev
    - Should start without errors
    - Login page accessible
    - Auth flow works

Working directory: /Users/diegodamasceno/InnerCourt/
Output: .agents/phase2-frontend/changes.log (list of modified files)

Supabase credentials:
URL: [PROVIDED FROM PHASE 1]
Anon Key: [PROVIDED FROM PHASE 1]

Auth flow preference: [EMAIL_PASSWORD or MAGIC_LINK - ask Diego]
Friends feature: [INCLUDE or DEFER - ask Diego]

When completely finished, run:
openclaw gateway wake --text "Phase 2 complete: Frontend migrated to Supabase, web app working" --mode now
```

---

## Status

**Current:** WAITING FOR PHASE 1 COMPLETION  
**Blockers:** 
- Need Supabase credentials
- Need auth flow decision (email/password or magic link)
- Need Friends feature decision (include or defer)
