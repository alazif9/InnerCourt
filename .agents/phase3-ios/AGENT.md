# Phase 3 Agent: iOS Wrapper

**Role:** Add Capacitor to wrap React app in native iOS shell

**Prerequisites:**
- [x] Phase 2 complete (web app working with Supabase)
- [ ] Bundle ID decided: `[TO BE PROVIDED]`
- [ ] App name decided: `[TO BE PROVIDED]`

---

## Tasks

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

### 2. Initialize Capacitor

```bash
npx cap init
```

**Interactive prompts:**
- App name: `[TO BE PROVIDED BY DIEGO]`
- App ID (bundle ID): `[TO BE PROVIDED BY DIEGO]`
- Web dir: `dist` (Vite default)

### 3. Create capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '[BUNDLE_ID]',  // e.g., com.damasceno.innercourt
  appName: '[APP_NAME]',  // e.g., Inner Court
  webDir: 'dist',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic',  // Handles safe area (notch/island)
  }
};

export default config;
```

### 4. Build React App

```bash
npm run build
```

Ensure `dist/` folder is created with production build.

### 5. Add iOS Platform

```bash
npx cap add ios
```

This creates `ios/App/` folder with Xcode project.

### 6. Sync Assets

```bash
npx cap sync
```

Copies `dist/` contents into iOS webview.

### 7. Verify iOS Project Structure

Check that these exist:
- `ios/App/App.xcworkspace`
- `ios/App/App/Assets.xcassets/`
- `ios/App/Podfile`

### 8. Create iOS Documentation

**File:** `README_IOS.md`

Document manual Xcode steps (Diego will do these):

1. **Open Xcode:**
   ```bash
   open ios/App/App.xcworkspace
   ```

2. **Configure Signing:**
   - Select "App" target in Xcode
   - Go to "Signing & Capabilities"
   - Choose team (Apple Developer account required)
   - Enable "Automatically manage signing"

3. **Set Bundle Identifier:**
   - Should match `capacitor.config.ts` appId
   - Format: `com.damasceno.innercourt` (or chosen bundle ID)

4. **Add App Icon:**
   - Drag 1024x1024 icon to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Xcode will generate all required sizes

5. **Test on Simulator:**
   - Select iPhone simulator
   - Click Run (⌘R)
   - App should launch in simulator

6. **Build for Device:**
   - Connect iPhone via USB
   - Select device in Xcode
   - Click Run
   - App will install on physical device

7. **Archive for App Store:**
   - Product → Archive
   - Opens Organizer
   - Click "Distribute App" → App Store Connect

---

## Optional: Native Features (v2)

These can be added later but not required for v1:

### Haptics
```bash
npm install @capacitor/haptics
```

Tactile feedback on archetype selection.

### Local Notifications
```bash
npm install @capacitor/local-notifications
```

Daily Oracle reminders.

### Biometric Auth
```bash
npm install @capacitor-community/biometric-auth
```

Face ID / Touch ID for journal privacy.

### Status Bar
```bash
npm install @capacitor/status-bar
```

Control status bar color (match hermetic-cyberpunk theme).

---

## Acceptance Criteria

- [ ] Capacitor installed
- [ ] `capacitor.config.ts` created with correct bundle ID + app name
- [ ] iOS project generated in `ios/App/`
- [ ] `npm run build && npx cap sync` works without errors
- [ ] `README_IOS.md` documents Xcode setup steps
- [ ] No code changes to React app (pure wrapper, no logic changes)

---

## Files to Create/Modify

- [ ] Install deps in `package.json`
- [ ] Create `capacitor.config.ts`
- [ ] Generate `ios/` folder (via `npx cap add ios`)
- [ ] Create `README_IOS.md`
- [ ] Update `.gitignore` (add `dist/`, keep `ios/`)

---

## kimicode Prompt

```bash
You are the iOS Wrapper specialist for InnerCourt.

Context:
- Phase 2 complete: Web app working with Supabase
- Need to wrap React app in native iOS shell using Capacitor
- No code changes to React app, just add iOS layer

Your task:

1. Install Capacitor:
   npm install @capacitor/core @capacitor/cli @capacitor/ios

2. Initialize Capacitor:
   npx cap init
   
   Use these values (non-interactive):
   App name: [APP_NAME - TO BE PROVIDED BY DIEGO]
   App ID: [BUNDLE_ID - TO BE PROVIDED BY DIEGO]
   Web dir: dist

3. Create capacitor.config.ts:
   - appId: [BUNDLE_ID]
   - appName: [APP_NAME]
   - webDir: 'dist'
   - ios.contentInset: 'automatic' (for safe area)

4. Build production React app:
   npm run build
   Verify dist/ folder created

5. Add iOS platform:
   npx cap add ios
   This creates ios/App/ with Xcode project

6. Sync web assets to iOS:
   npx cap sync

7. Verify structure:
   - ios/App/App.xcworkspace exists
   - ios/App/Podfile exists
   - ios/App/App/Assets.xcassets/ exists

8. Create README_IOS.md with step-by-step Xcode instructions:
   - How to open Xcode workspace
   - How to configure signing (needs Apple Developer account)
   - How to set bundle identifier
   - How to add app icon (1024x1024)
   - How to test on simulator
   - How to build for device
   - How to archive for App Store

9. Update .gitignore:
   Add: dist/
   Keep: ios/ (should be committed)

10. Create build script in package.json:
    "build:ios": "npm run build && npx cap sync"

DO NOT:
- Modify any React code
- Open Xcode (document steps for Diego)
- Attempt to sign/build (requires Apple account)

Working directory: /Users/diegodamasceno/InnerCourt/
Output: README_IOS.md + capacitor.config.ts

Bundle ID: [TO BE PROVIDED]
App Name: [TO BE PROVIDED]

When completely finished, run:
openclaw gateway wake --text "Phase 3 complete: iOS project generated, Xcode ready" --mode now
```

---

## Status

**Current:** WAITING FOR PHASE 2 COMPLETION  
**Blockers:**
- Need bundle ID decision (e.g., `com.damasceno.innercourt`)
- Need app name decision ("Inner Court" vs "InnerCourt")
