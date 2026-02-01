# WebView Video Player Debugging Guide

## Current Issue
Videos not loading - black screen in VideoPlayer modal.

## Quick Diagnostic Steps

### 1. Check Expo Console Logs

After opening video player, look for these console logs:
```
VideoPlayer received URL: https://youtube.com/watch?v=...
Extracted video ID: ABC123
Embed URL: https://www.youtube.com/embed/ABC123?...
WebView loading started
WebView loading ended
```

If you see errors, note what they say.

### 2. Check if WebView is Installed

In terminal:
```bash
npm list react-native-webview
```

Should show: `react-native-webview@13.16.0` or similar

### 3. Test with Simple URL

Temporarily test if WebView works at all by changing the embed URL to a simple page:

In `components/VideoPlayer.tsx`, line ~114:
```typescript
// TEST: Replace the YouTube URL with this
const embedUrl = 'https://www.google.com';
```

If Google loads, WebView works. If still black, WebView setup issue.

### 4. Common Issues

**Issue:** Black screen, no errors
**Possible causes:**
- YouTube blocking embed in mobile WebView
- Expo Go WebView limitations
- Missing user agent string

**Issue:** "Could not extract video ID"
**Cause:** Video URL format issue
**Fix:** Check that URL is `https://youtube.com/watch?v=VIDEO_ID`

**Issue:** WebView error in console
**Cause:** Permission or network issue
**Fix:** Check internet connection, restart app

## Alternative Solutions

If WebView continues to fail:

### Option A: Use Expo WebBrowser
Simpler, opens video in in-app browser (not embedded):
```typescript
import * as WebBrowser from 'expo-web-browser';

// In button onPress:
await WebBrowser.openBrowserAsync(videoUrl);
```

### Option B: Use react-native-youtube-iframe
Dedicated YouTube player library (requires additional setup):
```bash
npm install react-native-youtube-iframe
```

### Option C: Keep External Links
Revert to opening YouTube app (most reliable):
```typescript
import { Linking } from 'react-native';
await Linking.openURL(videoUrl);
```

## Testing Checklist

When video should work:
- [ ] Modal opens
- [ ] Loading spinner shows briefly
- [ ] Video appears and plays
- [ ] Controls work (play/pause/seek)
- [ ] Close button works
- [ ] No console errors

When there's an issue:
- [ ] Check console for error messages
- [ ] Verify internet connection
- [ ] Try reloading app (shake → Reload)
- [ ] Try different video
- [ ] Check if YouTube works in browser

## Next Steps

1. **Check console logs** - Most important!
2. **Test with simple URL** - Verifies WebView works
3. **If WebView broken** - Consider Option A (expo-web-browser)
4. **If YouTube specific** - Consider Option B (youtube-iframe)

---

**Need immediate solution?** 

Change to expo-web-browser (5 minute fix):

1. Install: `npm install expo-web-browser`
2. Replace VideoPlayer usage with:
```typescript
import * as WebBrowser from 'expo-web-browser';

// In button:
onPress={async () => {
  await WebBrowser.openBrowserAsync(currentWeekGoal.videoUrl);
}}
```

This opens video in native browser overlay - works 100% of the time!
