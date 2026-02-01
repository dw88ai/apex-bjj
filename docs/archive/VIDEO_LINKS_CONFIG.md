# 🎥 Video Links Configuration Guide

## 📍 Where to Update Video URLs

All YouTube video links are now centralized in one file:

**`constants/videoLinks.ts`**

## ✏️ How to Update a Video

### Quick Steps:

1. Open `constants/videoLinks.ts`
2. Find the position and week you want to update
3. Replace the URL
4. Save the file - changes are immediate!

### Example:

**Before:**
```typescript
export const SIDE_CONTROL_VIDEOS = {
  week1: {
    url: COACH_CHANNELS.LACHLAN_GILES,  // Points to channel
    title: 'Lachlan Giles - Side Control Escapes',
  },
```

**After:**
```typescript
export const SIDE_CONTROL_VIDEOS = {
  week1: {
    url: 'https://youtube.com/watch?v=BWitv9AKoNU',  // Specific video
    title: 'Lachlan Giles - Side Control Escape Fundamentals',
  },
```

## 🎯 Adding Timestamps

To start a video at a specific time, add `&t=XXs` to the URL:

```typescript
week2: {
  url: 'https://youtube.com/watch?v=BWitv9AKoNU&t=125s',  // Starts at 2:05
  title: 'Lachlan Giles - Hip Escape Details',
},
```

**Timestamp format:**
- `&t=30s` → starts at 30 seconds
- `&t=125s` → starts at 2 minutes 5 seconds
- `&t=600s` → starts at 10 minutes

## 📋 Current Positions Configured

All these positions have 4 weeks of video content:

- ✅ Side Control Escapes (`SIDE_CONTROL_VIDEOS`)
- ✅ Mount Escapes (`MOUNT_ESCAPE_VIDEOS`)
- ✅ Back Escapes (`BACK_ESCAPE_VIDEOS`)
- ✅ Guard Retention (`GUARD_RETENTION_VIDEOS`)
- ✅ Closed Guard (`CLOSED_GUARD_VIDEOS`)
- ✅ Open Guard (`OPEN_GUARD_VIDEOS`)
- ✅ Half Guard (`HALF_GUARD_VIDEOS`)

## 🏆 Coach Channel References

Pre-configured coach channels (use these or replace with specific videos):

```typescript
COACH_CHANNELS.LACHLAN_GILES      // Lachlan Giles
COACH_CHANNELS.GORDON_RYAN        // Gordon Ryan
COACH_CHANNELS.JOHN_DANAHER       // John Danaher
COACH_CHANNELS.BERNARDO_FARIA     // Bernardo Faria
COACH_CHANNELS.CRAIG_JONES        // Craig Jones
COACH_CHANNELS.KEENAN_CORNELIUS   // Keenan Cornelius
```

## 🔍 Finding Video IDs

1. Go to YouTube and find your video
2. Look at the URL:
   - `https://youtube.com/watch?v=BWitv9AKoNU`
   - The ID is: `BWitv9AKoNU`
3. Copy the full URL or just the ID

## ⚡ Pro Tips

1. **Use Specific Videos**: Replace channel URLs with specific video URLs for better UX
2. **Add Timestamps**: Direct users to the exact technique in long videos
3. **Test Links**: Click the video buttons in the app to ensure they work
4. **Update Titles**: Keep the `title` field descriptive so users know what they're watching

## 🧪 Testing Your Changes

After updating URLs:

1. Save `constants/videoLinks.ts`
2. Reload your app (shake device → Reload)
3. Navigate to a mission screen or weekly review
4. Tap the "Watch Video" button
5. Confirm it opens the correct video!

## 📱 Where Video Links Appear

Video buttons show up in:
- 🏠 **Home Screen** - Current week's video
- 📊 **Weekly Review Screen** - Review videos
- 🎯 **Pre-Session Screen** (if implemented)
- 📝 **Mission Screens** (if applicable)

---

## 🚀 That's It!

All video links in your app are now in one place. Update `constants/videoLinks.ts` anytime to change what videos users see! 🎬
