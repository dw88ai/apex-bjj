# Apex BJJ - Quick Start Guide

## What Was Built

A complete, production-ready React Native frontend for the Apex BJJ app with all screens, navigation, state management, and UI components implemented. The app uses mock data and local storage (AsyncStorage) for now, ready for backend integration later.

## Project Statistics

- **12 Screens** fully implemented with navigation
- **8+ Reusable Components** (buttons, cards, charts, etc.)
- **Full State Management** with React Context + AsyncStorage
- **Mock AI Features** (voice transcription, weekly reviews)
- **Complete User Flow** from onboarding to mission completion

## Running the App

### Quick Start

```bash
# Navigate to the project
cd /Users/dw/Documents/Projects/BJJLearningLoop

# Start the development server
npm start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app for device testing
```

> **⚡ Quick Testing Tip**: After completing onboarding, go to Settings → Developer Tools → "Seed Test Data" to populate the app with 9 realistic training sessions. Close and reopen the app to see all the data!

### First Time Running

The app will automatically show the onboarding flow:

1. **Welcome Screen** - Introduction to the app
2. **Profile Setup** - Select belt level, training frequency, and problem position
3. **Mission Preview** - Review your generated 4-week mission
4. **Home Dashboard** - Main app interface

## Testing the Complete Flow

### 1. Onboarding (2 min)
- Select "White Belt", "3x per week", "Always stuck in bottom side control"
- Review the generated 4-week mission
- Tap "Start Mission"

### 2. Log a Training Session (1 min)
- On Home screen, tap "Log Training Session"
- Choose either:
  - **Voice Recording**: Tap mic icon, wait 5 seconds, tap "Stop & Process"
  - **Quick Tap Logging**: Tap "Prefer to tap instead of voice?"
- Edit the parsed data if needed
- Tap "Save Session"

### 3. View Progress (30 sec)
- Navigate to "Progress" tab (bottom navigation)
- See escape rate chart
- View training consistency calendar
- Check session history

### 4. Weekly Review (30 sec)
- From any screen, navigate to: `/review/weekly?weekNumber=2`
- Review progress comparison
- See mock AI-identified problem
- View suggested fix with video link

### 5. Settings (30 sec)
- Navigate to "Settings" tab
- Tap "Upgrade" to see premium paywall modal
- Review pricing options
- Close modal

### 6. Mission Complete (30 sec)
- Navigate to: `/mission-complete`
- See celebration screen
- View improvement stats
- Choose next mission type

## Key Features Implemented

### ✅ Complete Navigation
- Expo Router with file-based routing
- Tab navigation (Home, Progress, Settings)
- Modal screens (Training, Reviews, Mission Complete)
- Deep linking support

### ✅ Onboarding Flow
- Welcome screen with feature highlights
- Profile setup with belt level and training frequency
- Mission preview with 4-week breakdown
- Smooth transitions between screens

### ✅ Home Dashboard
- Mission progress card with circular progress indicator
- Current escape rate with trend comparison
- Log training session CTA
- This week's focus with video link
- Recent sessions list
- Quick stats grid

### ✅ Training Flow
- Pre-session screen (optional constraints)
- Post-session voice recording UI with mock transcription
- Quick tap logging alternative
- Editable parsed data
- Local storage persistence

### ✅ Progress Screen
- Escape rate line chart (react-native-chart-kit)
- Time range selector (This Week / This Month / All Time)
- Training consistency calendar heatmap
- Most common problems list
- Full session history with details

### ✅ Weekly Review
- Week-over-week stats comparison
- Recurring problem identification
- Mock AI-suggested fix with video resource
- Feedback buttons (helpful/not helpful)
- Next week's goals

### ✅ Mission Complete
- Celebration screen with confetti concept
- Before/after escape rate comparison
- Milestones achieved list
- Share progress option
- Next mission selection (defense vs A-game)

### ✅ Settings
- Subscription status display
- Premium paywall modal (fully designed)
- Profile information
- Notifications toggles
- Reset data functionality

### ✅ Design & UX
- Dark theme with BJJ-inspired color palette
- Consistent Material Design components (React Native Paper)
- Haptic feedback on interactions
- Smooth animations and transitions
- Responsive layouts

## Data Storage

All data is stored locally in AsyncStorage:

```typescript
// Stored Data
- User profile (belt level, training frequency)
- Active mission with weekly goals
- Training logs (escape attempts, rates, problems)
- Weekly reviews (mock AI feedback)
- Onboarding completion status
```

Reset data anytime from Settings → Reset All Data

## Mock Features

These features currently use mock data but are fully designed for backend integration:

1. **Voice Transcription**: Returns random realistic training log transcripts
2. **AI Parsing**: Extracts escape attempts, success rate, and problems
3. **Weekly Reviews**: Generates mock AI feedback on recurring problems
4. **Video Resources**: Placeholder YouTube links with timestamps
5. **Push Notifications**: UI prepared, not actually sending

## File Structure

```
app/
├── (auth)/          # Onboarding: welcome, profile-setup, mission-preview
├── (tabs)/          # Main app: index (home), progress, settings
├── training/        # pre-session, post-session
├── review/          # weekly review
└── mission-complete.tsx

components/
├── ui/              # Button, Card, StatCard, ProgressRing, Dropdown
└── cards/           # MissionProgressCard

context/
└── AppContext.tsx   # Global state management

utils/
├── storage.ts       # AsyncStorage helpers
└── mockData.ts      # Mock transcription and AI parsing

types/
└── index.ts         # TypeScript interfaces

constants/
├── colors.ts        # Color palette
└── theme.ts         # React Native Paper theme
```

## Next Steps (Backend Integration)

When you're ready to connect a backend:

1. **Replace Mock Functions**
   - `utils/mockData.ts` → Real OpenAI API calls
   - Add Supabase client configuration

2. **Add Authentication**
   - Implement Supabase Auth in `context/AppContext.tsx`
   - Add login/signup screens

3. **Database Integration**
   - Replace AsyncStorage with Supabase queries
   - Set up real-time subscriptions for live updates

4. **Implement Edge Functions**
   - Voice transcription (OpenAI Whisper)
   - AI parsing (GPT-4)
   - Weekly review generation

5. **Add Push Notifications**
   - Expo Push Notifications setup
   - Schedule daily reminders and weekly reviews

6. **Payment Processing**
   - Stripe or RevenueCat integration
   - Handle subscription status

## Troubleshooting

### App won't start
```bash
# Clear cache and restart
npm start --clear
```

### Can't see the app on device
- Make sure phone and computer are on same WiFi
- Try scanning QR code again
- Or use Expo Go app

### Want to reset and test onboarding again
- Go to Settings → Reset All Data
- App will return to welcome screen

## Development Tips

- Use hot reload: Save any file to see changes instantly
- Check console for any warnings or errors
- Use React DevTools for debugging
- Test on both iOS and Android if possible

## Questions?

The entire codebase is well-documented with TypeScript types. Key files to review:

- `context/AppContext.tsx` - State management logic
- `utils/storage.ts` - Data persistence helpers
- `types/index.ts` - All TypeScript interfaces
- `utils/mockData.ts` - Mock AI simulation

Enjoy building with Apex BJJ! 🥋
