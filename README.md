# Apex BJJ - Frontend

A React Native mobile app that helps Brazilian Jiu-Jitsu practitioners improve faster using a 4-step learning system.

## Features

- **4-Week Missions**: Focused training on specific positions
- **Voice Logging**: 60-second post-training voice logs with mock AI transcription
- **Progress Tracking**: Charts, calendar heatmaps, and session history
- **Weekly Reviews**: Mock AI feedback on recurring problems
- **Mission Completion**: Celebrate achievements and start new missions

## Tech Stack

- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Native Paper** for UI components
- **AsyncStorage** for local data persistence
- **expo-av** for audio recording UI
- **react-native-chart-kit** for data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (optional, for testing on device)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
BJJLearningLoop/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Onboarding flow
│   ├── (tabs)/             # Main app tabs (Home, Progress, Settings)
│   ├── training/           # Training session screens
│   ├── review/             # Weekly review
│   └── mission-complete.tsx
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   └── cards/              # Specialized card components
├── context/                # React Context for state management
├── utils/                  # Utility functions and mock data
├── types/                  # TypeScript type definitions
└── constants/              # Theme, colors, and configuration
```

## App Flow

1. **Onboarding**: User selects belt level, training frequency, and biggest problem position
2. **Mission Creation**: App generates a 4-week mission with weekly goals
3. **Training Logging**: After each session, user voice logs their experience (mock transcription)
4. **Progress Tracking**: View charts, session history, and consistency calendar
5. **Weekly Reviews**: Mock AI identifies recurring problems and suggests fixes
6. **Mission Completion**: Celebrate achievements and start a new mission

## Mock Data

Since this is a frontend-only build, the following features use mock data:

- **Voice Transcription**: Returns random mock transcripts
- **AI Parsing**: Generates mock parsed data from transcripts
- **Weekly Reviews**: Shows mock AI-generated feedback and video resources
- **Mission Goals**: Pre-defined weekly goals for each position

## Key Screens

### Onboarding
- Welcome screen with feature highlights
- Profile setup with dropdowns
- Mission preview with 4-week breakdown

### Home Dashboard
- Mission progress card with escape rate
- Quick action button to log sessions
- This week's focus
- Recent sessions list
- Quick stats (sessions logged, streak, avg escape rate)

### Training Flow
- Pre-session: Focus reminder and optional constraints
- Post-session: Voice recording UI with mock transcription or quick tap logging

### Progress
- Escape rate chart with time range selector
- Training consistency calendar
- Most common problems list
- Full session history

### Weekly Review
- Week-over-week comparison
- Recurring problem highlight
- AI-suggested fix with video resource
- Feedback buttons

### Settings
- Subscription status and paywall modal
- Profile information
- Notifications toggles
- Reset data option

## Data Storage

All data is stored locally using AsyncStorage:
- User profile
- Active mission
- Training logs
- Weekly reviews
- Onboarding state

## Future Enhancements (Backend Integration)

When connecting to a backend (Supabase + OpenAI):
1. Replace mock functions in `utils/mockData.ts` with real API calls
2. Implement Supabase authentication in `context/AppContext.tsx`
3. Add Supabase Edge Functions for voice transcription and AI parsing
4. Implement push notifications for weekly reviews
5. Add real payment processing (Stripe/RevenueCat) for premium features

## Development Notes

- The app uses a dark theme with BJJ-inspired colors
- All components use React Native Paper for consistent styling
- Navigation is handled by Expo Router with file-based routing
- State management uses React Context + AsyncStorage
- Haptic feedback is included for better UX

## Testing the App

1. Complete onboarding to create your first mission
2. Log a training session using either:
   - Voice recording (will show mock transcription after 2 seconds)
   - Quick tap logging (faster for testing)
3. View your progress on the Progress tab
4. Navigate to `/review/weekly?weekNumber=2` to see a weekly review
5. Test the settings and paywall modal
6. Reset data from settings to test onboarding again

## Known Limitations

- Voice recording is functional but returns mock transcriptions
- No real authentication or user accounts
- No backend persistence (data only stored locally)
- Video links are placeholders
- Push notifications are not implemented
- Payment processing is UI-only (no real Stripe integration)

## License

Private project - All rights reserved
