# Phase 4 Agent: QA Engineer

**Role:** Test web app + iOS app for functionality and iOS-specific issues

**Prerequisites:**
- [x] Phase 3 complete (iOS project generated)
- [ ] Xcode project opened and signed (manual step by Diego)

---

## Testing Scope

### 4.1 Web App Testing (npm run dev)

**Authentication Flow:**
- [ ] User can sign up (new account)
- [ ] User can log in (existing account)
- [ ] User can log out
- [ ] Auth persists on page refresh
- [ ] Unauthorized users redirected to login

**Profile CRUD:**
- [ ] User can create profile (onboarding)
- [ ] User can view profile (Profile page)
- [ ] User can edit profile (EditProfile page)
- [ ] Archetype scores display correctly
- [ ] Birth date/location save correctly
- [ ] Wheel of Life data persists

**Journal CRUD:**
- [ ] User can create journal entry
- [ ] Entries list displays (sorted by date desc)
- [ ] Archetype tags save correctly
- [ ] Mood states save correctly
- [ ] Empty state shows when no entries
- [ ] Entry count is accurate

**Analytics:**
- [ ] Archetype scores display in chart
- [ ] Wheel of Life 3D sphere renders
- [ ] Pentagon chart shows correct data
- [ ] Stats grid calculates correctly

**Navigation:**
- [ ] Bottom nav works (Tree/Journal/Data/Insight/Network)
- [ ] Page transitions smooth
- [ ] Back navigation works
- [ ] Deep links work (if applicable)

**UI/UX:**
- [ ] Hermetic-cyberpunk aesthetic intact
- [ ] Animations smooth (Framer Motion)
- [ ] Glassmorphic cards render correctly
- [ ] Terminal-style micro-text readable
- [ ] Gold/cyan gradients display properly

### 4.2 iOS-Specific Testing (Simulator + Device)

**App Launch:**
- [ ] App launches without crashes
- [ ] Splash screen displays (if configured)
- [ ] Initial load time < 3 seconds
- [ ] No console errors in Xcode logs

**Webview Rendering:**
- [ ] All pages render correctly (no layout breaks)
- [ ] CSS animations work (no jank)
- [ ] Framer Motion animations smooth
- [ ] Glassmorphic effects render (transparency)
- [ ] Sacred geometry icons display

**Safe Area (Notch/Island):**
- [ ] Content not hidden by notch (iPhone 14+)
- [ ] Bottom nav not hidden by home indicator
- [ ] Header not obscured by status bar
- [ ] Landscape mode handled (if enabled)

**Keyboard Behavior:**
- [ ] Keyboard doesn't cover input fields
- [ ] Input fields scroll into view when focused
- [ ] Keyboard dismisses correctly
- [ ] Form submission works via keyboard

**Touch Interactions:**
- [ ] Tap targets large enough (44x44pt min)
- [ ] Buttons respond to touch
- [ ] Scroll works smoothly
- [ ] Swipe gestures work (if applicable)

**Dark Mode:**
- [ ] App respects iOS system dark mode
- [ ] Or: App forces light/dark theme (verify intent)

**Rotation:**
- [ ] Portrait mode works
- [ ] Landscape mode works (or disabled if intended)

**Performance:**
- [ ] No memory leaks (monitor Xcode Instruments)
- [ ] Smooth 60fps scrolling
- [ ] No excessive battery drain

### 4.3 Data Persistence

**Supabase Integration:**
- [ ] Data saves to Supabase (verify in Supabase dashboard)
- [ ] Data loads on app reopen
- [ ] Offline behavior graceful (show error, don't crash)
- [ ] RLS policies enforced (user can't see others' data)

**Multi-Device Sync:**
- [ ] Same user on web + iOS sees same data
- [ ] Changes on one device reflect on other

### 4.4 Edge Cases

- [ ] What happens if Supabase is down?
- [ ] What happens with no internet connection?
- [ ] What happens with empty profile?
- [ ] What happens with 0 journal entries?
- [ ] What happens with invalid birth date?

---

## Bug Report Template

```markdown
## Bug: [Title]

**Platform:** Web / iOS Simulator / iPhone [model]  
**OS:** iOS [version]  
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** 
**Actual:** 
**Screenshot:** (if applicable)  
**Console Errors:** (if any)
```

---

## Acceptance Criteria

- [ ] All authentication flows tested and working
- [ ] All CRUD operations tested and working
- [ ] iOS app runs without crashes
- [ ] Safe area handled correctly
- [ ] Keyboard doesn't block inputs
- [ ] Performance acceptable (no lag/jank)
- [ ] Test report written in `.agents/phase4-testing/test-report.md`
- [ ] All critical bugs documented
- [ ] All critical bugs fixed (or noted for v2)

---

## kimicode Prompt

```bash
You are the QA Engineer for InnerCourt iOS app.

Context:
- Phase 3 complete: iOS project generated
- Diego has opened Xcode and signed the app (manual step)
- Need to test web app + iOS app comprehensively

Your task:

1. Web App Testing (automated where possible):
   - Test auth flow (signup, login, logout)
   - Test Profile CRUD
   - Test Journal CRUD
   - Test Analytics data display
   - Test navigation
   - Document any bugs in test-report.md

2. iOS Simulator Testing:
   - Run: npx cap open ios (opens Xcode)
   - Note: Diego will actually run simulator
   - Create checklist for Diego to test:
     * Launch app
     * Check safe area (notch)
     * Test keyboard behavior
     * Test all pages
     * Check console for errors

3. Create test-report.md with:
   - Test results table (feature | web | iOS | pass/fail)
   - List of bugs found (critical vs. minor)
   - Screenshots of any visual issues (if applicable)
   - Recommendations for fixes

4. If bugs found, create bug-fixes.md:
   - List of critical bugs that must be fixed
   - Suggested solutions
   - Code changes needed (if known)

5. Performance check:
   - Note: Lighthouse score for web app (performance/accessibility)
   - Note: iOS memory usage (if Diego provides Instruments data)

Working directory: /Users/diegodamasceno/InnerCourt/
Output: .agents/phase4-testing/test-report.md

This phase is partially manual (Diego must run iOS app).
Your job: Document test cases + compile results + identify bugs.

When completely finished, run:
openclaw gateway wake --text "Phase 4 complete: Testing done, bugs documented" --mode now
```

---

## Status

**Current:** WAITING FOR PHASE 3 COMPLETION  
**Note:** This phase requires manual testing by Diego (Xcode simulator/device)
