# Changelog

All notable changes to Apex BJJ will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.5.0] - 2026-01-24

### Added - In-App Video Player 🎥

**Major Feature**: Videos now play directly within the app instead of opening YouTube externally.

- **Full-screen video player** with YouTube iFrame API integration
- **Watch progress tracking** - Automatically tracks viewing progress every 5 seconds
- **Completion tracking** - Marks videos as "completed" when user watches 90%+
- **Video analytics** - Tracks video ID, watch percentage, total watch time, and last watched date
- **Auto-play functionality** - Videos start playing immediately when opened
- **Native controls** - Full play/pause/seek/fullscreen controls via YouTube player
- **Close button** - Easy X button to dismiss modal and return to app
- **Loading states** - Spinner displayed while video loads
- **Error handling** - Graceful error messages if video fails to load
- **Haptic feedback** - Confirms user interaction when opening videos

**Technical Implementation:**
- New `VideoPlayer` component (`components/VideoPlayer.tsx`)
- New `videoTracking` utility (`utils/videoTracking.ts`)
- Added `react-native-webview` dependency
- Helper functions in `constants/videoLinks.ts` for video ID extraction
- Data stored in AsyncStorage with key `@apexbjj:video_watch_history`

**Files Modified:**
- `app/(tabs)/index.tsx` - Replaced external YouTube links with VideoPlayer modal
- `app/review/weekly.tsx` - Replaced external YouTube links with VideoPlayer modal
- `package.json` - Added react-native-webview dependency

**User Impact:**
- Better engagement - users stay in-app
- Seamless experience - no context switching
- Future analytics - foundation for "watched" badges and video recommendations

**Documentation:**
- `VIDEO_PLAYER_IMPLEMENTATION.md` - Complete implementation guide

---

## [0.4.0] - 2026-01-24

### Added - YouTube Video Links 🎬

- **Centralized video configuration** in `constants/videoLinks.ts`
- **28 specific YouTube videos** curated for all 7 positions (4 weeks each)
- **Real coach content** from Lachlan Giles, John Danaher, Gordon Ryan, Bernardo Faria, Craig Jones, and Keenan Cornelius
- **Functional video buttons** on Home and Weekly Review screens
- **Video link utility functions** for easy URL management

**Files Created:**
- `constants/videoLinks.ts` - Centralized video URL configuration
- `VIDEO_LINKS_CONFIG.md` - Guide for updating video URLs
- `VIDEO_LINKS_IMPLEMENTATION.md` - Implementation documentation

**Files Modified:**
- `utils/mockData.ts` - Now imports from videoLinks.ts
- `app/(tabs)/index.tsx` - Made video buttons functional
- `app/review/weekly.tsx` - Made video buttons functional

---

## [0.3.0] - 2026-01-23

### Added - DM Sans Font Implementation 🎨

- **Custom typography** using DM Sans font family
- **Font loading screen** during initialization
- **Material Design 3 text variants** (displayLarge, headlineMedium, bodySmall, etc.)
- **Consistent typography** across all screens

**Files Modified:**
- `app/_layout.tsx` - Font loading with expo-font
- `constants/theme.ts` - DM Sans font configuration
- `package.json` - Added @expo-google-fonts/dm-sans

**Dependencies Added:**
- `expo-font`
- `@expo-google-fonts/dm-sans`

**Documentation:**
- `DM_SANS_IMPLEMENTATION.md`

---

## [0.2.1] - 2026-01-23

### Fixed - UI Icon Cut-off Issues ✂️

- **Fixed emoji rendering** across 8+ screens
- **Added lineHeight and textAlign** properties to all emoji styles
- **Improved text layout** for better visual consistency

**Files Modified:**
- `app/(auth)/welcome.tsx`
- `app/(auth)/how-it-works.tsx`
- `app/(auth)/mission-preview.tsx`
- `app/training/post-session.tsx`
- `app/training/general-log.tsx`
- `app/mission-complete.tsx`
- `app/(tabs)/settings.tsx`
- `app/training/pre-session.tsx`

**Documentation:**
- `ICON_CUTOFF_FIX.md`

---

## [0.2.0] - 2026-01-23

### Changed - App Rebrand to "Apex BJJ" 🥋

Rebranded from "Flowroll" (previously "BJJ Learning Loop") to "Apex BJJ".

**Changes:**
- App name updated across all configuration files
- Storage keys migrated to `@apexbjj:*`
- Bundle identifiers updated
- Documentation updated
- Welcome screen branding updated

**Files Modified:**
- `app.json`
- `package.json`
- `constants/config.ts`
- `utils/storage.ts`
- `app/(auth)/welcome.tsx`
- All documentation files

**Documentation:**
- `APEX_BJJ_REBRAND_COMPLETE.md`

### Fixed - Keyboard Overlap Issues ⌨️

- **Added KeyboardAvoidingView** to Quick Log modal in post-session screen
- **Added ScrollView** inside modal for better keyboard handling
- **Platform-specific behavior** (iOS vs Android)

---

## [0.1.3] - 2026-01-22

### Added - Training Log Management System 📝

Complete CRUD operations for training logs with general training support.

**Features:**
- **View log details** - Dedicated screen for each training log
- **Edit logs** - Modify past training entries
- **Delete logs** - Remove training logs with confirmation
- **Log without mission** - General training log for non-mission sessions
- **Tappable log items** - Navigate from Home and Progress screens
- **Filter toggle** - Switch between "Mission" and "All" logs on Progress screen

**Files Created:**
- `app/training/log-detail/[id].tsx` - Log detail screen
- `app/training/general-log.tsx` - General training logger
- `components/forms/TrainingLogForm.tsx` - Reusable form component

**Files Modified:**
- `types/index.ts` - Made missionId optional, added generalTrainingType
- `utils/storage.ts` - Added getTrainingLogById, updateTrainingLog, deleteTrainingLog
- `context/AppContext.tsx` - Added CRUD methods for logs
- `app/(tabs)/index.tsx` - Made logs tappable, added "Log General Training" button
- `app/(tabs)/progress.tsx` - Made logs tappable, added filter toggle

**Documentation:**
- `TRAINING_LOG_MANAGEMENT.md`

---

## [0.1.2] - 2026-01-21

### Added - User Discovery Resources 📋

Created comprehensive guides for validating the app idea with potential users.

**Files Created:**
- `BJJ_DISCOVERY_FORM_TEMPLATE.md` - Complete discovery form questions
- `FORM_QUICK_CHECKLIST.md` - Quick reference for form creation
- `RESPONSE_ANALYSIS_GUIDE.md` - Guide for analyzing user responses
- `USER_TESTING_PACKAGE.md` - Overview of entire testing process
- `FORM_INSTANT_BUILD_GUIDE.md` - Click-by-click Google Form guide

---

## [0.1.1] - 2026-01-20

### Fixed - Startup Errors 🐛

- **Removed react-native-reanimated** dependency causing plugin errors
- **Removed react-native-confetti-cannon** dependency
- **Replaced animations** with React Native's built-in Animated API
- **Fixed import errors** across multiple onboarding screens
- **Cleared Metro cache** for fresh build

**Files Modified:**
- `app.json` - Removed reanimated plugin
- `package.json` - Removed problematic dependencies
- Multiple onboarding components - Replaced animation libraries

---

## [0.1.0] - 2026-01-19

### Added - Initial App Launch 🚀

**Core Features:**
- ✅ **4-Week Mission System** - Master defensive BJJ positions
- ✅ **7 Position Types** - Side control, mount, back, guard variations
- ✅ **Onboarding Flow** - Welcome, how it works, coaches, profile setup, mission preview
- ✅ **Training Logging** - Voice recording, quick log, manual input
- ✅ **Weekly Reviews** - Progress tracking and analysis
- ✅ **Mission Completion** - Celebration screen with stats
- ✅ **Progress Dashboard** - Charts, stats, session history
- ✅ **Dark Theme** - BJJ-inspired color palette

**Screens Implemented:**
- Welcome & Onboarding (4 screens)
- Home Dashboard
- Pre-Session Focus
- Post-Session Logging
- Weekly Review
- Progress Tracking
- Settings
- Mission Complete
- Log Detail & Management

**Components:**
- Card, Button, Dropdown UI components
- StatCard, ProgressRing, BeltSelector
- MissionProgressCard
- TrainingLogForm
- ErrorBoundary

**Data Management:**
- React Context for state management
- AsyncStorage for local persistence
- Mock data system for testing
- Seed data functionality

**Technologies:**
- React Native with Expo
- TypeScript
- React Native Paper (UI)
- Expo Router (Navigation)
- expo-av (Audio recording)
- react-native-chart-kit (Charts)

**Documentation:**
- `README.md` - Project overview
- `QUICKSTART.md` - Getting started guide
- `PRODUCTION_READY.md` - Production readiness checklist
- `PRODUCTION_TESTS.md` - Testing guide
- `BJJ_COACHES_RESOURCES.md` - Coach recommendations
- `BUGFIXES.md` - Bug tracking
- `DEPLOYMENT.md` - Deployment instructions

---

## Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Expo Go app on physical device

### Installation
```bash
npm install
npm start
```

### Running
```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear cache and restart
npm run reset-cache
```

---

## Contributing

When making changes:
1. Update this CHANGELOG.md with your changes
2. Follow semantic versioning
3. Document new features in separate .md files
4. Update README.md if user-facing changes

---

## Version History

- **0.5.0** - In-App Video Player (2026-01-24)
- **0.4.0** - YouTube Video Links (2026-01-24)
- **0.3.0** - DM Sans Font (2026-01-23)
- **0.2.1** - UI Icon Fixes (2026-01-23)
- **0.2.0** - Apex BJJ Rebrand (2026-01-23)
- **0.1.3** - Training Log Management (2026-01-22)
- **0.1.2** - User Discovery Resources (2026-01-21)
- **0.1.1** - Startup Error Fixes (2026-01-20)
- **0.1.0** - Initial Release (2026-01-19)
