# 🚀 Deployment Guide - Apex BJJ

## Prerequisites

### **Required Accounts**
1. ✅ Apple Developer Account ($99/year) - for iOS
2. ✅ Google Play Console ($25 one-time) - for Android
3. ✅ Expo Account (free) - for EAS Build
4. ⚠️ GitHub/GitLab account - for version control

### **Required Tools**
```bash
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login
```

---

## 🏗️ Build Setup

### **1. Configure EAS Build**

Create `eas.json` in project root:

```json
{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### **2. Initialize EAS**

```bash
cd BJJLearningLoop
eas init
```

This will:
- Create an Expo project if needed
- Link your Expo account
- Generate project ID

---

## 📱 iOS Deployment

### **Step 1: Build for iOS**

```bash
# Preview build (TestFlight)
eas build --profile preview --platform ios

# Production build
eas build --profile production --platform ios
```

**What happens:**
- ✅ Code is uploaded to Expo servers
- ✅ Build happens in cloud (no Mac required!)
- ✅ .ipa file generated
- ✅ Download link provided

**Build time:** ~10-15 minutes

### **Step 2: Submit to App Store Connect**

#### **Option A: Automatic Submission**
```bash
eas submit --platform ios --latest
```

You'll need:
- Apple ID credentials
- App-specific password
- App Store Connect app ID

#### **Option B: Manual Submission**

1. Download the `.ipa` file from EAS
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Create new app:
   - Name: Apex BJJ
   - Bundle ID: com.apexbjj.app
   - SKU: apexbjj-001
   - Primary Language: English
4. Use **Transporter** app to upload .ipa
5. Fill out app information (see APP_STORE_LISTING.md)
6. Submit for review

### **Step 3: TestFlight Beta**

Before public release, test with TestFlight:

1. In App Store Connect → TestFlight
2. Add internal testers (up to 100)
3. Add external testers (up to 10,000)
4. Share TestFlight link
5. Gather feedback
6. Fix bugs
7. Re-submit build if needed

**TestFlight review:** 1-2 days

### **Step 4: App Store Review**

Once TestFlight testing is complete:

1. Go to App Store Connect
2. Select your build
3. Fill out all required fields:
   - App description
   - Keywords
   - Screenshots (all required sizes)
   - Support URL
   - Privacy policy URL
   - Age rating
4. Submit for review

**Review time:** 1-3 days (sometimes up to 7 days)

**Common rejection reasons:**
- Missing privacy policy
- Incomplete app description
- Broken links
- Crashes on review device
- Misleading features

---

## 🤖 Android Deployment

### **Step 1: Build for Android**

```bash
# Preview build (APK for testing)
eas build --profile preview --platform android

# Production build (AAB for Play Store)
eas build --profile production --platform android
```

**What happens:**
- ✅ Code uploaded to Expo servers
- ✅ Build happens in cloud
- ✅ .aab or .apk generated
- ✅ Download link provided

**Build time:** ~10-15 minutes

### **Step 2: Create Google Play Console Listing**

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app:
   - App name: Apex BJJ
   - Default language: English
   - App or game: App
   - Free or paid: Free
3. Fill out Store Listing:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (at least 2)
   - Feature graphic (1024x500)
   - App icon (512x512)
   - App category: Health & Fitness
   - Content rating questionnaire
   - Target audience: Everyone
   - Privacy policy URL

### **Step 3: Submit to Play Store**

#### **Option A: Automatic Submission**

First, create service account:
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create service account
3. Grant "Service Account User" role
4. Create JSON key
5. Save as `google-play-service-account.json`

Then submit:
```bash
eas submit --platform android --latest
```

#### **Option B: Manual Submission**

1. Download `.aab` file from EAS
2. Go to Play Console → Production
3. Create new release
4. Upload `.aab`
5. Review release details
6. Roll out to production (or internal testing)

### **Step 4: Internal Testing**

Before public release:

1. Play Console → Internal Testing
2. Create release
3. Upload AAB
4. Add test users (up to 100)
5. Share opt-in link
6. Gather feedback

**No review needed for internal testing!**

### **Step 5: Production Release**

Once testing complete:

1. Play Console → Production
2. Create release
3. Upload AAB (same one from testing)
4. Review all settings
5. Roll out to production

**Review time:** Usually instant to a few hours

**Rollout options:**
- 100% immediate (risky)
- Staged rollout: 1% → 5% → 10% → 50% → 100%
- Recommended: Start with 10%, monitor for crashes

---

## 🔄 Over-The-Air (OTA) Updates

For JavaScript-only changes (no native code):

```bash
# Publish update
eas update --branch production --message "Fix training log bug"

# Users will get update on next app restart
```

**Benefits:**
- ✅ No app store review
- ✅ Instant deployment
- ✅ All users updated within 24 hours

**Limitations:**
- ❌ Can't change native code
- ❌ Can't update dependencies
- ❌ Can't change app permissions

**Use for:**
- Bug fixes in JS/TS code
- UI tweaks
- Content updates
- Feature flags

---

## 📊 Post-Launch Monitoring

### **Crash Reporting**

Install Sentry (recommended):
```bash
npx @sentry/wizard@latest -i reactNative
```

Configure in `app/_layout.tsx`:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: __DEV__ ? 'development' : 'production',
});
```

### **Analytics**

Options:
1. **Expo Application Services** (built-in, basic)
2. **Firebase Analytics** (free, detailed)
3. **Mixpanel** (paid, advanced)

### **Performance Monitoring**

```bash
# Expo built-in performance monitoring
expo-performance-monitor
```

Or use Firebase Performance Monitoring.

---

## 🔐 Security Checklist

Before production deploy:

- [ ] Remove all console.log with sensitive data
- [ ] Remove debug flags
- [ ] Verify API keys are in environment variables (not hardcoded)
- [ ] Test with production API endpoints
- [ ] Verify SSL/TLS certificate pinning (if using custom backend)
- [ ] Review permissions (only request what's needed)
- [ ] Test on real devices (not just simulator)
- [ ] Run security audit: `npm audit`
- [ ] Update all dependencies to latest stable versions
- [ ] Add privacy policy URL
- [ ] Add terms of service URL
- [ ] Test GDPR compliance (if serving EU users)

---

## 🧪 Pre-Deployment Testing Checklist

### **Functional Testing**
- [ ] Onboarding flow works
- [ ] Training log saves correctly
- [ ] Progress charts display
- [ ] Navigation works on all screens
- [ ] Back buttons work
- [ ] Forms validate correctly
- [ ] Error states show proper messages

### **Device Testing**
- [ ] iPhone SE (small screen)
- [ ] iPhone 15 Pro (standard)
- [ ] iPhone 15 Pro Max (large)
- [ ] iPad
- [ ] Android phone (various manufacturers)
- [ ] Android tablet

### **OS Version Testing**
- [ ] iOS 15+ (check minimum supported)
- [ ] Android 10+ (check minimum supported)

### **Network Testing**
- [ ] Airplane mode (offline functionality)
- [ ] Slow 3G
- [ ] Wi-Fi
- [ ] Cellular data

### **Performance Testing**
- [ ] App starts in < 3 seconds
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Charts render quickly
- [ ] Voice recording starts quickly

---

## 📦 Version Management

### **Semantic Versioning**

Follow semver: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### **Update Version Numbers**

Before each release, update:

1. **package.json**
```json
{
  "version": "1.0.1"
}
```

2. **app.json**
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "1.0.1"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

**Important:** 
- iOS `buildNumber` can be string: "1.0.1"
- Android `versionCode` must increment as integer: 1, 2, 3...

---

## 🚨 Emergency Rollback

If critical bug in production:

### **Option 1: OTA Rollback**
```bash
# Roll back to previous version
eas update --branch production --message "Rollback to v1.0.0"
```

### **Option 2: App Store Rollback**
- iOS: Can't rollback, must submit new version
- Android: Can revert to previous APK in Play Console

### **Option 3: Kill Switch**
Implement feature flag to disable broken feature remotely.

---

## 📈 Release Cadence

### **Recommended Schedule**

**MVP Launch (v1.0.0):**
- Week 1: Internal testing
- Week 2: TestFlight/Internal beta
- Week 3: Public launch

**Post-Launch:**
- **Hot Fixes:** As needed (< 24 hours)
  - Critical bugs, crashes, data loss
  - Deploy via OTA if possible
  
- **Minor Updates:** Every 2 weeks
  - Bug fixes, small improvements
  - User feedback iterations
  
- **Major Updates:** Every 1-2 months
  - New features
  - UI improvements
  - Performance enhancements

---

## 🎯 Launch Checklist

### **Pre-Launch (T-2 weeks)**
- [ ] All features tested and working
- [ ] No critical bugs
- [ ] App Store listings prepared
- [ ] Screenshots taken (all sizes)
- [ ] Privacy policy published
- [ ] Support email set up
- [ ] Landing page live
- [ ] Social media accounts created

### **Launch Week (T-1 week)**
- [ ] Submit to TestFlight
- [ ] Internal team testing
- [ ] Beta testers added (10-20 people)
- [ ] Feedback collected
- [ ] Critical bugs fixed
- [ ] Final build ready

### **Launch Day (T-0)**
- [ ] Submit to App Store
- [ ] Submit to Play Store
- [ ] Monitor for crashes
- [ ] Respond to reviews
- [ ] Post on social media
- [ ] Email announcement (if list exists)

### **Post-Launch (T+1 week)**
- [ ] Monitor crash reports daily
- [ ] Respond to user reviews
- [ ] Track key metrics (DAU, retention)
- [ ] Collect user feedback
- [ ] Plan first update

---

## 📞 Support Resources

### **Expo Documentation**
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/

### **App Store Resources**
- App Store Connect: https://appstoreconnect.apple.com
- Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- TestFlight: https://developer.apple.com/testflight/

### **Play Store Resources**
- Play Console: https://play.google.com/console
- Policy Center: https://play.google.com/about/developer-content-policy/
- Release with Confidence: https://play.google.com/console/about/guides/releasewithconfidence/

---

## 🎉 You're Ready to Deploy!

Follow this guide step-by-step and you'll have Apex BJJ in the app stores!

**Estimated Timeline:**
- iOS TestFlight: 1 week
- iOS App Store approval: 1-3 days
- Android Internal Testing: 1 week
- Android Play Store approval: < 1 day

**Total time to launch:** ~2-3 weeks

**Good luck! 🚀🥋**
