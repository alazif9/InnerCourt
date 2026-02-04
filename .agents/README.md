# InnerCourt Migration Agents

This folder contains 5 specialized AI agents for the Base44 → Supabase + iOS migration.

**Strategy:** Sequential execution with checkpoints  
**Agent:** kimicode (Kimi K2.5)  
**Orchestrator:** Esdras (OpenClaw assistant)

---

## Folder Structure

```
.agents/
├── README.md (this file)
├── phase1-backend/
│   ├── AGENT.md          # Role, tasks, kimicode prompt
│   ├── STATUS.md         # Progress tracking
│   └── output/           # Generated SQL, configs
├── phase2-frontend/
│   ├── AGENT.md
│   ├── STATUS.md
│   └── changes.log       # Files modified
├── phase3-ios/
│   ├── AGENT.md
│   ├── STATUS.md
│   └── xcode-notes.md    # Manual Xcode steps
├── phase4-testing/
│   ├── AGENT.md
│   ├── STATUS.md
│   └── test-report.md    # Test results
└── phase5-release/
    ├── AGENT.md
    ├── STATUS.md
    └── assets/           # Icons, screenshots
```

---

## Execution Flow

### Phase 1: Backend Architect
**Goal:** Build Supabase PostgreSQL schema with RLS policies  
**Blockers:** Need Supabase credentials (URL + anon key)  
**Output:** `supabase/migrations/001_initial_schema.sql`

### Phase 2: Frontend Migrator
**Goal:** Replace Base44 SDK with Supabase client  
**Blockers:** Phase 1 complete, auth flow decision, Friends feature decision  
**Output:** Migrated pages, new `supabaseClient.js`, `Login.jsx`

### Phase 3: iOS Wrapper
**Goal:** Add Capacitor to wrap React app in native iOS  
**Blockers:** Phase 2 complete, bundle ID, app name  
**Output:** `ios/` folder, `capacitor.config.ts`, `README_IOS.md`

### Phase 4: QA Engineer
**Goal:** Test web + iOS app, document bugs  
**Blockers:** Phase 3 complete, Xcode signed (manual)  
**Output:** `test-report.md`, bug fixes

### Phase 5: Release Manager
**Goal:** Prepare App Store assets and documentation  
**Blockers:** Phase 4 complete, app icon, privacy policy URL  
**Output:** App Store copy, privacy policy, submission checklist

---

## How to Run

### 1. Read AGENT.md for current phase
```bash
cat .agents/phase1-backend/AGENT.md
```

### 2. Launch kimicode (Esdras does this)
```bash
exec pty:true workdir:/Users/diegodamasceno/InnerCourt background:true \
  command:"kimicode '[prompt from AGENT.md]'"
```

### 3. Monitor progress
```bash
process action:log sessionId:XXX
```

### 4. Update STATUS.md
Mark tasks complete, note blockers.

### 5. Git commit
```bash
git add .
git commit -m "Phase X complete: [description]"
git push origin main
```

### 6. Move to next phase
Repeat for Phase 2, 3, 4, 5.

---

## Checkpoints

After each phase:
- ✅ Verify acceptance criteria met
- ✅ Git commit with clear message
- ✅ Update STATUS.md
- ✅ Get Diego's approval
- ✅ Launch next phase

---

## Critical Decisions Needed

Before starting:

1. **Supabase credentials** (Phase 1)
   - Project URL
   - Anon key

2. **Bundle ID** (Phase 3)
   - Format: `com.DOMAIN.innercourt`
   - Example: `com.damasceno.innercourt`

3. **App name** (Phase 3)
   - "Inner Court" (with space) or "InnerCourt" (one word)?

4. **Auth flow** (Phase 2)
   - Email/password (recommended) or magic link?

5. **Friends feature** (Phase 2)
   - Include (complex) or defer to v2?

6. **Privacy policy URL** (Phase 5)
   - Where to host?

7. **Apple Developer account** (Phase 3+)
   - Do you have one? ($99/year)

---

## Timeline Estimate

**Optimistic:** 8-14 hours total  
**Realistic:** 12-21 hours total (with debugging)

- Phase 1: 2-3 hours
- Phase 2: 4-6 hours
- Phase 3: 1-2 hours
- Phase 4: 2-3 hours
- Phase 5: 2-4 hours

---

## Status Overview

**Phase 1:** WAITING FOR SUPABASE CREDENTIALS  
**Phase 2:** WAITING FOR PHASE 1  
**Phase 3:** WAITING FOR PHASE 2  
**Phase 4:** WAITING FOR PHASE 3  
**Phase 5:** WAITING FOR PHASE 4

**Overall:** PLANNING COMPLETE, READY TO START PHASE 1

---

## Resources

- **Audit report:** `/Users/diegodamasceno/.openclaw/workspace/INNERCOURT_AUDIT_REPORT.md`
- **Migration plan:** `/Users/diegodamasceno/.openclaw/workspace/INNERCOURT_MIGRATION_PLAN.md`
- **GitHub repo:** https://github.com/alazif9/InnerCourt
- **Supabase:** https://supabase.com
- **Capacitor:** https://capacitorjs.com

---

**Last updated:** 2026-02-04  
**Orchestrator:** Esdras ☉
