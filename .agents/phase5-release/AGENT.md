# Phase 5 Agent: Release Manager

**Role:** Prepare all assets and documentation for Apple App Store submission

**Prerequisites:**
- [x] Phase 4 complete (testing passed, bugs fixed)
- [ ] Apple Developer account confirmed
- [ ] App icon designed (1024x1024 PNG)
- [ ] Privacy policy URL available

---

## Tasks

### 5.1 App Icon

**Required:** 1024x1024 PNG, no transparency, no alpha channel

**Design notes:**
- Hermetic-cyberpunk aesthetic
- Sacred geometry (Tree of Life?)
- Gold/cyan color scheme
- Symbol: ☉ (SOL) or combined archetype symbols

**Where to place:**
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Xcode will generate all required sizes (20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt)

**Asset variations needed:**
- iPhone: 60pt@2x, 60pt@3x, 40pt@2x, 40pt@3x, 29pt@2x, 29pt@3x, 20pt@2x, 20pt@3x
- iPad: 76pt@2x, 40pt@2x, 29pt@2x, 20pt@2x
- App Store: 1024pt@1x

**Tools for generation:**
- https://www.appicon.co/ (upload 1024x1024, get all sizes)
- Xcode can also auto-generate from 1024x1024

### 5.2 Screenshots

**Required for App Store:**

**iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max):**
- Resolution: 1290 × 2796 px
- Quantity: 3-10 (recommend 5)

**iPhone 6.5" (iPhone 11 Pro Max, XS Max):**
- Resolution: 1242 × 2688 px
- Quantity: 3-10 (recommend 5)

**iPad 12.9" (iPad Pro):**
- Resolution: 2048 × 2732 px
- Quantity: 3-10 (optional if iPad not supported)

**Screenshots to capture:**
1. Tree of Life (home screen) - hero shot
2. Soul Chronicle (journal entries)
3. Intelligence Report (analytics pentagon)
4. Oracle Insights (if implemented)
5. Operator Profile

**How to capture:**
- Run app in iOS Simulator
- Cmd+S to save screenshot
- Or: Use real device, capture via Xcode (Window → Devices and Simulators)

**Tools for framing:**
- https://www.screely.com/ (add device frame)
- https://www.mockuphone.com/

### 5.3 App Store Metadata

#### App Name
**Decision needed:** "Inner Court" or "InnerCourt"  
**Max:** 30 characters

#### Subtitle
**Max:** 30 characters  
**Suggestions:**
- "Jungian Self-Discovery"
- "Hermetic Psychology"
- "Archetypal Intelligence"
- "Your Inner Compass"

#### Keywords
**Max:** 100 characters (comma-separated, no spaces)

**Suggestions:**
```
psychology,journal,archetypes,jung,self-improvement,mindfulness,personality,growth,hermetic,kabbalah
```

#### Description
**Max:** 4000 characters

**Draft:**
```
Explore your psyche through the lens of Jungian archetypes mapped to the Kabbalistic Tree of Life.

Inner Court is a hermetic-cyberpunk psychological app that guides you through the eight archetypal energies that shape your consciousness:

☉ SOL — Your radiant self, the center
♂ HERO — Courage and action
☿ SAGE — Wisdom and knowledge
☽ MOTHER — Nurture and compassion
♄ SHADOW — Hidden depths
♀ ANIMA — Inner feminine/masculine
☆ CHILD — Wonder and innocence
☌ TRICKSTER — Chaos and transformation

FEATURES:

🌳 THE GREAT WORK
Navigate the Tree of Life. Track your archetypal balance across eight nodes. Visualize your psychological landscape in real-time.

📖 SOUL CHRONICLE
Journal with archetypal awareness. Tag entries by archetype and mood. Build a living record of your inner journey.

📊 INTELLIGENCE REPORT
Analyze your growth across five dimensions: Social, Technical, Physical, Economic, Spiritual. Visualize balance with interactive charts.

🔮 ORACLE INSIGHTS
Receive personalized readings based on your archetypal patterns. Daily wisdom drawn from your psychological data.

🌐 SOCIAL NEXUS
Connect with others on similar paths. Discover archetypal affinities. Build meaningful relationships.

WHY INNER COURT?

Traditional psychology meets sacred technology. We combine Jungian depth psychology with Kabbalistic wisdom, wrapped in a terminal-inspired interface that respects your intelligence.

Privacy-first. Your psychological data belongs to you. End-to-end encryption. No ads. No tracking.

Perfect for:
- Students of Jungian psychology
- Spiritual seekers exploring Kabbalah
- Anyone committed to self-knowledge
- Those who journal with intention

Begin the Great Work. Download Inner Court.
```

#### Promotional Text (Optional)
**Max:** 170 characters  
**Appears above description, can be updated without new version**

```
Navigate your psyche. Track 8 Jungian archetypes. Journal with depth. Grow with intention. Begin the Great Work.
```

#### What's New (Version 1.0)
**Max:** 4000 characters

```
Welcome to Inner Court.

This is the first public release of your hermetic-cyberpunk companion for self-discovery.

• Navigate the Tree of Life across 8 archetypal nodes
• Journal with archetypal awareness
• Visualize growth across 5 dimensions
• Track your psychological balance
• Begin the Great Work

More features coming soon:
• Oracle insights
• Social connections
• Voice journaling
• Advanced analytics

We'd love to hear your feedback. Contact us at [SUPPORT EMAIL].
```

#### Category
**Primary:** Health & Fitness  
**Secondary:** Lifestyle

#### Age Rating
**Likely:** 4+ (no objectionable content)  
**Confirm:** No violence, profanity, mature themes in app

### 5.4 Privacy Policy

**Required by Apple.** Must be hosted at a public URL.

**Options:**
1. Generate with template: https://www.privacypolicies.com/
2. Use GitHub Pages (free hosting)
3. Host on personal domain

**Minimum required sections:**
- What data is collected (email, journal entries, archetype scores, birth date)
- How data is used (app functionality only)
- Data storage (Supabase, encrypted)
- Data sharing (none, unless user opts in to social features)
- User rights (view, export, delete data)
- Contact info (support email)

**Example URL:**
- `https://alazif9.github.io/InnerCourt/privacy`
- Or: `https://innercourt.app/privacy`

### 5.5 Support URL

**Required by Apple.**

**Options:**
- GitHub Issues: `https://github.com/alazif9/InnerCourt/issues`
- Email: `support@innercourt.app` (need domain)
- Help center (future)

### 5.6 Marketing URL (Optional)

Landing page for the app.

**Could be:**
- GitHub repo: `https://github.com/alazif9/InnerCourt`
- Future: `https://innercourt.app`

### 5.7 Build & Archive

**Steps (manual, in Xcode):**

1. **Set version number:**
   - Xcode → Target → General → Version: `1.0.0`
   - Build: `1`

2. **Set to Release mode:**
   - Product → Scheme → Edit Scheme → Run → Build Configuration → Release

3. **Archive:**
   - Product → Archive
   - Wait for build to complete

4. **Organizer opens:**
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Upload to App Store

5. **App Store Connect:**
   - Go to https://appstoreconnect.apple.com
   - Create new app listing
   - Upload screenshots
   - Fill in metadata
   - Submit for review

**Review time:** 1-7 days (usually 24-48h)

---

## Acceptance Criteria

- [ ] App icon created (1024x1024 PNG)
- [ ] All icon sizes generated
- [ ] 5 screenshots captured for iPhone 6.7"
- [ ] 5 screenshots captured for iPhone 6.5" (or same as 6.7")
- [ ] App Store description written
- [ ] Keywords optimized
- [ ] Privacy policy written and hosted
- [ ] Support URL configured
- [ ] App archived in Xcode (build ready)
- [ ] App Store Connect listing created
- [ ] Submitted for review

---

## Files to Create

- [ ] `.agents/phase5-release/assets/app-icon-1024.png`
- [ ] `.agents/phase5-release/assets/screenshots/` (5+ images)
- [ ] `.agents/phase5-release/APP_STORE_COPY.md` (description, keywords, metadata)
- [ ] `.agents/phase5-release/PRIVACY_POLICY.md` (to be hosted)
- [ ] `.agents/phase5-release/SUBMISSION_CHECKLIST.md` (final steps)

---

## kimicode Prompt

```bash
You are the Release Manager for InnerCourt iOS app.

Context:
- Phase 4 complete: App tested and working
- Need to prepare all assets for Apple App Store submission

Your task:

1. Create .agents/phase5-release/assets/ folder structure:
   - app-icon/ (placeholder for 1024x1024 PNG)
   - screenshots/ (placeholder for 5 images)

2. Create APP_STORE_COPY.md with:
   - App name: [TO BE DECIDED]
   - Subtitle: [SUGGESTIONS PROVIDED]
   - Description: [DRAFT PROVIDED - can be refined]
   - Keywords: psychology,journal,archetypes,jung,self-improvement,mindfulness,personality,growth,hermetic,kabbalah
   - Category: Health & Fitness
   - Age rating: 4+

3. Create PRIVACY_POLICY.md with:
   - Data collected (email, journal entries, archetype scores, birth date)
   - Data usage (app functionality only)
   - Data storage (Supabase, encrypted)
   - Data sharing (none by default)
   - User rights (view, export, delete)
   - Contact: [SUPPORT EMAIL]

4. Create SUBMISSION_CHECKLIST.md:
   - [ ] App icon added to Xcode
   - [ ] Screenshots captured
   - [ ] Privacy policy hosted at: [URL]
   - [ ] Support URL set: [URL]
   - [ ] App Store description ready
   - [ ] Keywords set
   - [ ] Version 1.0.0 set in Xcode
   - [ ] Build archived
   - [ ] Uploaded to App Store Connect
   - [ ] Listing created
   - [ ] Submitted for review

5. Create DESIGN_BRIEF_ICON.md:
   - Requirements: 1024x1024 PNG, no transparency
   - Design aesthetic: Hermetic-cyberpunk, sacred geometry
   - Colors: Gold (#d4af37), Cyan (#00cccc)
   - Symbols: Tree of Life or ☉ (SOL)
   - Tools: https://www.appicon.co/ for size generation

6. Create SCREENSHOT_GUIDE.md:
   - Which screens to capture (Tree, Journal, Analytics, Profile)
   - Required resolutions (6.7", 6.5")
   - How to capture (Xcode simulator)
   - Framing tools (optional)

Working directory: /Users/diegodamasceno/InnerCourt/
Output: .agents/phase5-release/

App name: [TO BE PROVIDED]
Bundle ID: [FROM PHASE 3]
Privacy policy URL: [TO BE PROVIDED]
Support URL: [TO BE PROVIDED]

DO NOT:
- Design actual icon (needs designer)
- Capture actual screenshots (needs running app)
- Submit to App Store (needs Apple account + manual steps)

Your role: Create documentation and checklists for Diego.

When completely finished, run:
openclaw gateway wake --text "Phase 5 complete: Release assets ready, submission checklist created" --mode now
```

---

## Status

**Current:** WAITING FOR PHASE 4 COMPLETION  
**Blockers:**
- Need app name decision
- Need app icon design (manual/designer)
- Need privacy policy URL
- Need Apple Developer account confirmation
