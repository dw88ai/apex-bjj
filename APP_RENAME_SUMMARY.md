# App Rename: BJJ Learning Loop → Flowroll

## Summary

Successfully renamed the app from "BJJ Learning Loop" to "Flowroll" across the entire codebase.

## Changes Made

### 1. Core App Configuration
- **`app.json`**
  - App name: `"BJJ Learning Loop"` → `"Flowroll"`
  - Slug: `"bjj-learning-loop"` → `"flowroll"`
  - Scheme: `"bjjlearningloop"` → `"flowroll"`
  - iOS bundle identifier: `"com.bjjlearningloop.app"` → `"com.flowroll.app"`
  - Android package: `"com.bjjlearningloop.app"` → `"com.flowroll.app"`
  - iOS microphone permission description updated
  - expo-av plugin permission description updated

### 2. Package Configuration
- **`package.json`**
  - Package name: `"bjjlearningloop"` → `"flowroll"`
  - Author: `"BJJ Learning Loop Team"` → `"Flowroll Team"`

### 3. UI/UX
- **`app/(auth)/welcome.tsx`**
  - Welcome screen title updated to "Flowroll"

### 4. Configuration Constants
- **`constants/config.ts`**
  - `APP_NAME` constant: `'BJJ Learning Loop'` → `'Flowroll'`
  - Storage keys updated: `@bjj_loop:*` → `@flowroll:*`

### 5. Storage Layer
- **`utils/storage.ts`**
  - AsyncStorage keys updated: `@bjj_learning_loop:*` → `@flowroll:*`

### 6. Documentation
- **`README.md`** - All references updated
- **`QUICKSTART.md`** - All references updated
- **`PRODUCTION_READY.md`** - All references updated
- **`APP_STORE_LISTING.md`** - All references updated
- **`DEPLOYMENT.md`** - All references updated (including slug and package names)

## Bundle Identifiers

### iOS
- **Old:** `com.bjjlearningloop.app`
- **New:** `com.flowroll.app`

### Android
- **Old:** `com.bjjlearningloop.app`
- **New:** `com.flowroll.app`

## URL Schemes

### Deep Linking
- **Old:** `bjjlearningloop://`
- **New:** `flowroll://`

## Storage Keys

All AsyncStorage keys have been updated to use the new `@flowroll:` prefix:
- `@flowroll:user`
- `@flowroll:missions`
- `@flowroll:training_logs`
- `@flowroll:weekly_reviews`
- `@flowroll:onboarding_complete`
- `@flowroll:active_mission_id`
- `@flowroll:premium_status`
- `@flowroll:settings`

## Next Steps

### 1. Update package-lock.json
```bash
npm install
```
This will regenerate `package-lock.json` with the new package name.

### 2. Clear Metro bundler cache
```bash
npm run reset-cache
# or
npx expo start --clear
```

### 3. Clear app data on devices (optional but recommended)
Since storage keys have changed, existing users would need to clear app data or the app will create new storage entries. For development:
- **iOS Simulator:** Device → Erase All Content and Settings
- **Android Emulator:** Settings → Apps → Flowroll → Storage → Clear Data
- **Physical devices:** Uninstall and reinstall the app

### 4. Update app icons (if needed)
If you want to update the app icons to reflect the new brand:
- `assets/icon.png` - App icon (1024x1024)
- `assets/adaptive-icon.png` - Android adaptive icon
- `assets/splash-icon.png` - Splash screen icon
- `assets/favicon.png` - Web favicon

### 5. Update EAS Build configuration (if using)
If you're using EAS Build, update `eas.json` if it exists:
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.flowroll.app"
      },
      "android": {
        "package": "com.flowroll.app"
      }
    }
  }
}
```

### 6. Update App Store / Google Play listings
When ready to publish:
- Update app name in App Store Connect
- Update app name in Google Play Console
- Update screenshots if they show the old name
- Update description/metadata if needed

## Migration Notes

### For Existing Users
⚠️ **Important:** The storage key changes mean existing user data won't be automatically migrated. Options:

1. **Fresh start** (simplest): Users start with a clean slate
2. **Migration script** (complex): Create a one-time migration that reads old keys and writes to new keys

### For Development
- Clear app data or reinstall to avoid confusion with old data
- Test onboarding flow with the new name
- Verify all screens display "Flowroll" correctly

## Verification Checklist

- [x] App name updated in `app.json`
- [x] Package name updated in `package.json`
- [x] Bundle identifiers updated (iOS & Android)
- [x] URL scheme updated
- [x] Storage keys updated
- [x] Welcome screen updated
- [x] Config constants updated
- [x] Documentation updated
- [x] No linter errors
- [ ] `npm install` run to update package-lock.json
- [ ] Metro cache cleared
- [ ] App tested with new name
- [ ] Deep linking tested with new scheme
- [ ] App icons updated (if desired)

## Files Modified

1. `app.json` - Core app configuration
2. `package.json` - Package metadata
3. `app/(auth)/welcome.tsx` - Welcome screen UI
4. `constants/config.ts` - App constants
5. `utils/storage.ts` - Storage keys
6. `README.md` - Documentation
7. `QUICKSTART.md` - Documentation
8. `PRODUCTION_READY.md` - Documentation
9. `APP_STORE_LISTING.md` - Documentation
10. `DEPLOYMENT.md` - Documentation

## No Changes Needed

- Code logic remains unchanged
- UI components unchanged (except welcome screen)
- Navigation unchanged
- Features unchanged
- Dependencies unchanged

The rename is complete and the app is ready to run with the new "Flowroll" branding! 🎉
