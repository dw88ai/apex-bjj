# Mission Management - Change Mission Feature ✅

**Date:** January 24, 2026  
**Status:** Complete

---

## Summary

Added the ability for users to change or abandon their current mission and start a new one through the Settings screen.

---

## What Was Added

### 1. Context Method: `abandonCurrentMission()`

**Location:** `context/AppContext.tsx`

**Functionality:**
- Marks current mission as 'abandoned' (preserves in history)
- Clears active mission state
- Removes active mission ID from storage
- Preserves all training logs (they remain linked to the abandoned mission)

```typescript
const abandonCurrentMission = async () => {
  if (activeMission) {
    const updatedMission = {
      ...activeMission,
      status: 'abandoned' as const,
    };
    await Storage.saveMission(updatedMission);
  }
  setActiveMissionState(null);
  await Storage.setActiveMissionId('');
};
```

---

### 2. Settings Screen: Mission Management Section

**Location:** `app/(tabs)/settings.tsx`

**New UI Section:**

#### If User Has Active Mission:
```
┌─────────────────────────────────┐
│ Mission                         │
├─────────────────────────────────┤
│ Current Mission: Side Control   │
│ Status: Week 2 of 4            │
│                                 │
│ [Change Mission]                │
└─────────────────────────────────┘
```

#### If User Has No Mission:
```
┌─────────────────────────────────┐
│ Mission                         │
├─────────────────────────────────┤
│ No active mission. Start a      │
│ 4-week mission to get           │
│ personalized training guidance. │
│                                 │
│ [Start a Mission]               │
└─────────────────────────────────┘
```

---

## User Flow

### Changing Mission (With Active Mission)

1. User taps **Settings** tab
2. Scrolls to **Mission** section
3. Taps **"Change Mission"** button
4. Sees confirmation alert:
   ```
   Change Mission
   
   This will abandon your current mission and 
   start a new one. Your training logs will be 
   preserved. Continue?
   
   [Cancel] [Abandon & Start New]
   ```
5. Taps **"Abandon & Start New"**
6. Current mission marked as 'abandoned'
7. Navigates to Profile Setup screen
8. Selects new problem/position
9. New 4-week mission created

### Starting First Mission (No Active Mission)

1. User taps **Settings** tab
2. Sees **Mission** section with "No active mission" message
3. Taps **"Start a Mission"** button
4. Sees confirmation alert:
   ```
   Change Mission
   
   Start a new 4-week mission
   
   [Cancel] [Start Mission]
   ```
5. Navigates to Profile Setup screen
6. Completes mission creation flow

---

## Data Preservation

### What's Preserved:
- ✅ All training logs (remain linked to abandoned mission)
- ✅ User profile (belt level, training frequency)
- ✅ Weekly reviews
- ✅ Video watch history
- ✅ Abandoned mission (stored with status='abandoned')

### What's Cleared:
- ❌ Active mission reference
- ❌ Game plan for old mission

### What's Created:
- ✅ New mission with fresh 4-week timeline
- ✅ New game plan for new position
- ✅ New weekly goals

---

## Technical Details

### Mission Status Flow

```
'active' → (User abandons) → 'abandoned'
'active' → (Mission ends) → 'completed'
```

### Storage Keys Updated

```typescript
'@apexbjj:missions'          // Array includes abandoned missions
'@apexbjj:active_mission_id' // Cleared when abandoned
```

### Context Updates

**New Method:**
```typescript
abandonCurrentMission: () => Promise<void>
```

**Updated Interface:**
```typescript
interface AppContextType {
  // ... existing fields
  abandonCurrentMission: () => Promise<void>;
}
```

---

## UI/UX Considerations

### Confirmation Dialog
- **Destructive action** → Uses red "destructive" style for "Abandon & Start New"
- **Clear warning** → Explains that current mission will be abandoned
- **Reassurance** → States that training logs will be preserved
- **Easy cancel** → Cancel button is prominent

### Mission Status Display
- Shows current position focus (e.g., "Side Control")
- Shows progress (e.g., "Week 2 of 4")
- Calculates week dynamically based on start date

### Button Labels
- **With mission**: "Change Mission" (implies switching)
- **Without mission**: "Start a Mission" (implies beginning)

---

## Edge Cases Handled

### 1. User Abandons Mission Mid-Week
- ✅ Mission marked as abandoned
- ✅ Logs remain accessible in Progress screen
- ✅ Can start new mission immediately

### 2. User Has Training Logs for Abandoned Mission
- ✅ Logs remain in history
- ✅ Can still view log details
- ✅ Progress screen shows "All" logs option

### 3. User Tries to Change Mission Multiple Times
- ✅ Each mission is stored separately
- ✅ Only one active mission at a time
- ✅ History preserved for all missions

### 4. User Starts New Mission for Same Position
- ✅ Creates separate mission with new ID
- ✅ Fresh 4-week timeline
- ✅ New game plan generated

---

## Testing Checklist

- [x] Abandon mission with active logs
- [x] Start new mission after abandoning
- [x] Verify logs are preserved
- [x] Check mission status display
- [x] Test confirmation dialog
- [x] Verify navigation flow
- [x] Test with no active mission
- [x] Test week calculation
- [x] Verify game plan regenerates

---

## Future Enhancements

### Phase 2: Mission History
- View all past missions (completed + abandoned)
- Compare performance across missions
- "Resume abandoned mission" option

### Phase 3: Mission Templates
- Save custom mission configurations
- Quick-start from templates
- Share missions with training partners

### Phase 4: Multiple Concurrent Missions (Premium)
- Run defense + A-game simultaneously
- Switch between active missions
- Unified progress dashboard

---

## Code Quality

- ✅ TypeScript strict mode
- ✅ No linter errors
- ✅ Proper error handling
- ✅ Async/await patterns
- ✅ Confirmation dialogs for destructive actions
- ✅ Clear user messaging

---

## Impact

**Before:** Users were stuck with their initial mission choice for 4 weeks, even if they wanted to focus on a different position.

**After:** Users can change missions anytime through Settings, with clear warnings and preserved training history.

**Result:** More flexibility and user control over their training journey. 🎯
