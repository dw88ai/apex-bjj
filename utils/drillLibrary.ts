import { Position, DrillRecommendation } from '../types';

export interface DrillTemplate {
  id: string;
  position: Position;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  week: number; // Which week of mission (1-4)
  drill: DrillRecommendation;
}

/**
 * Side Control Escape Drills
 */
export const SIDE_CONTROL_DRILLS: DrillTemplate[] = [
  // Week 1: Fundamentals
  {
    id: 'sc-week1-inside-elbow',
    position: 'side_control',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'inside-elbow-entry',
      name: 'Inside Elbow Entry Drill',
      duration: 180, // 3 minutes
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=by85KB6wf8A&t=45s',
      instructions: [
        'Partner starts in side control with light pressure (30%)',
        'Immediately establish inside elbow to their hip',
        'Add opposite hand frame to their neck',
        'Reset after each rep',
        'Goal: 10 clean entries in 3 minutes',
      ],
      focusPoints: [
        'Elbow to hip bone, not ribs',
        'Speed matters - get it before they settle',
        'Keep elbow tight to your body',
      ],
    },
  },
  {
    id: 'sc-week1-frame-drill',
    position: 'side_control',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'frame-before-settle',
      name: 'Frame Before Settle Drill',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=by85KB6wf8A&t=120s',
      instructions: [
        'Partner transitions to side control slowly',
        'You must establish frames before they settle weight',
        'Hold frames for 5 seconds',
        'Partner increases pressure gradually',
        'Reset if frames collapse',
      ],
      focusPoints: [
        'Inside elbow + neck frame = strongest position',
        'Elbows stay close to body',
        'Use legs to help create space',
      ],
    },
  },
  {
    id: 'sc-week1-hip-escape-solo',
    position: 'side_control',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'hip-escape-movement',
      name: 'Hip Escape Movement (Solo)',
      duration: 120,
      partnerRequired: false,
      instructions: [
        'Lie on back, simulate side control position',
        'Bridge onto shoulder',
        'Shrimp hip away while maintaining frame',
        'Bring knee to elbow',
        'Repeat 20 times each side',
      ],
      focusPoints: [
        'Bridge first, then shrimp',
        'Create angle, not just distance',
        'Keep frames throughout movement',
      ],
    },
  },
  // Week 2: Intermediate
  {
    id: 'sc-week2-escape-chain',
    position: 'side_control',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'full-escape-chain',
      name: 'Full Escape Chain',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=gnAhAdE_A90&t=60s',
      instructions: [
        'Partner in side control with 50% pressure',
        'Execute: Frame → Bridge → Shrimp → Recover guard',
        'Complete full sequence',
        'Partner can defend but not counter',
        'Goal: 5 successful escapes in 5 minutes',
      ],
      focusPoints: [
        'Each step flows into the next',
        'Don\'t pause between movements',
        'If stuck, reset and try again',
      ],
    },
  },
  {
    id: 'sc-week2-timing-drill',
    position: 'side_control',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'escape-timing',
      name: 'Escape Timing Drill',
      duration: 240,
      partnerRequired: true,
      instructions: [
        'Partner in side control, 70% pressure',
        'Wait for them to post hand or shift weight',
        'Execute escape in that moment',
        'Partner actively tries to maintain',
        'Focus on timing, not force',
      ],
      focusPoints: [
        'Feel for weight shifts',
        'Explode when they post',
        'Use their movement against them',
      ],
    },
  },
  // Week 3: Advanced
  {
    id: 'sc-week3-pressure-escape',
    position: 'side_control',
    skillLevel: 'advanced',
    week: 3,
    drill: {
      id: 'escape-under-pressure',
      name: 'Escape Under Pressure',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=by85KB6wf8A&t=441s',
      instructions: [
        'Partner in side control with 100% pressure',
        'They actively try to maintain and advance',
        'You must escape using technique, not strength',
        '5 minute round',
        'Track successful escapes vs attempts',
      ],
      focusPoints: [
        'Stay calm under pressure',
        'Wait for opportunities',
        'Chain multiple attempts if first fails',
      ],
    },
  },
];

/**
 * Mount Escape Drills
 */
export const MOUNT_ESCAPE_DRILLS: DrillTemplate[] = [
  {
    id: 'mount-week1-trap-bridge',
    position: 'mount',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'trap-and-bridge',
      name: 'Trap and Bridge Drill',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=EMEueexp9zU&t=120s',
      instructions: [
        'Partner in low mount, hands on your chest',
        'Trap their arm and foot on same side',
        'Bridge explosively to that side',
        'Roll them over',
        'Reset and repeat 10 times each side',
      ],
      focusPoints: [
        'Trap must be secure before bridge',
        'Bridge direction: toward trapped side',
        'Use hips, not just upper body',
      ],
    },
  },
  {
    id: 'mount-week1-elbow-escape',
    position: 'mount',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'elbow-escape-basics',
      name: 'Elbow Escape to Half Guard',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=EMEueexp9zU&t=300s',
      instructions: [
        'Partner in mount, light pressure',
        'Frame on hip and neck',
        'Shrimp and insert knee',
        'Recover to half guard',
        'Goal: 8 successful escapes in 4 minutes',
      ],
      focusPoints: [
        'Create space with frames first',
        'Shrimp creates angle for knee',
        'Don\'t give up back during escape',
      ],
    },
  },
  {
    id: 'mount-week2-prevent-high-mount',
    position: 'mount',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'prevent-high-mount',
      name: 'Prevent High Mount',
      duration: 180,
      partnerRequired: true,
      instructions: [
        'Partner in low mount',
        'They try to advance to high mount',
        'You must prevent using frames and hip movement',
        '3 minute rounds',
        'Partner can use 60% effort',
      ],
      focusPoints: [
        'Elbows stay tight to body',
        'Don\'t let them control your arms',
        'Use legs to create distance',
      ],
    },
  },
  {
    id: 'mount-week3-escape-chain',
    position: 'mount',
    skillLevel: 'advanced',
    week: 3,
    drill: {
      id: 'mount-escape-options',
      name: 'Mount Escape Options',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=Olqs4avtdhU',
      instructions: [
        'Partner in mount, 80% pressure',
        'Attempt trap-and-roll first',
        'If fails, switch to elbow escape',
        'If that fails, try to get to turtle',
        'Practice decision-making under pressure',
      ],
      focusPoints: [
        'Read partner\'s weight distribution',
        'Don\'t commit to one escape',
        'Chain attempts smoothly',
      ],
    },
  },
];

/**
 * Back Escape Drills
 */
export const BACK_ESCAPE_DRILLS: DrillTemplate[] = [
  {
    id: 'back-week1-hand-fighting',
    position: 'back',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'hand-fighting-basics',
      name: 'Hand Fighting to Protect Neck',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=9n6rcl-eLY8&t=180s',
      instructions: [
        'Partner has back control with both hooks',
        'They slowly attempt to get choke grip',
        'You fight hands and protect neck',
        'Focus on hand position, not escaping yet',
        '3 minute rounds',
      ],
      focusPoints: [
        'Chin down, hands protecting neck',
        'Strip grips before they settle',
        'Stay calm, don\'t panic',
      ],
    },
  },
  {
    id: 'back-week2-clear-hooks',
    position: 'back',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'hook-removal',
      name: 'Clear Hooks Drill',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=Nhca-P5Uj20&t=120s',
      instructions: [
        'Partner has back with both hooks in',
        'Clear bottom hook first using proper technique',
        'Then address top hook',
        'Partner resists at 50%',
        'Goal: Clear both hooks 5 times in 4 minutes',
      ],
      focusPoints: [
        'Bottom hook first, always',
        'Use your legs to trap and clear',
        'Protect neck while clearing hooks',
      ],
    },
  },
  {
    id: 'back-week3-escape-to-guard',
    position: 'back',
    skillLevel: 'advanced',
    week: 3,
    drill: {
      id: 'back-to-guard',
      name: 'Back Escape to Guard',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=uT-7lJxykCg',
      instructions: [
        'Partner has back control',
        'Execute full escape sequence',
        'Clear hooks → Turn to guard',
        'Partner actively tries to maintain',
        '5 minute round, track successes',
      ],
      focusPoints: [
        'Don\'t give up neck during turn',
        'Explosive movement when hooks clear',
        'Recover guard, don\'t stop at turtle',
      ],
    },
  },
];

/**
 * Guard Retention Drills
 */
export const GUARD_RETENTION_DRILLS: DrillTemplate[] = [
  {
    id: 'guard-week1-distance-management',
    position: 'guard',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'distance-control',
      name: 'Distance Management Drill',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=by85KB6wf8A',
      instructions: [
        'Start in open guard',
        'Partner tries to close distance slowly',
        'You maintain distance with frames and feet',
        'Don\'t let them get chest-to-chest',
        '3 minute rounds',
      ],
      focusPoints: [
        'Feet on hips or biceps',
        'Hands control sleeves or wrists',
        'Move hips to maintain distance',
      ],
    },
  },
  {
    id: 'guard-week2-recovery',
    position: 'guard',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'guard-recovery',
      name: 'Late Guard Recovery',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=1cKr7xJ-0i8',
      instructions: [
        'Partner starts halfway through guard pass',
        'You must recover guard before they pass',
        'Partner uses 60% resistance',
        'Reset if they complete pass',
        'Goal: 8 recoveries in 4 minutes',
      ],
      focusPoints: [
        'Use frames to create space',
        'Shrimp to create angle',
        'Get feet back in quickly',
      ],
    },
  },
  {
    id: 'guard-week3-retention-layers',
    position: 'guard',
    skillLevel: 'advanced',
    week: 3,
    drill: {
      id: 'layered-retention',
      name: '8 Layers of Guard Retention',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=UTaZzbHMr-s',
      instructions: [
        'Partner tries to pass guard at 80%',
        'You use all retention layers',
        'Distance → Frames → Recovery → Scramble',
        '5 minute round',
        'Track how many passes you prevent',
      ],
      focusPoints: [
        'Don\'t give up after first layer fails',
        'Each layer buys time for next',
        'Stay active, don\'t be passive',
      ],
    },
  },
];

/**
 * Closed Guard Drills
 */
export const CLOSED_GUARD_DRILLS: DrillTemplate[] = [
  {
    id: 'closed-week1-break-posture',
    position: 'closed_guard',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'posture-breaking',
      name: 'Break Posture Drill',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=ZKsfnBbBdjk&t=60s',
      instructions: [
        'Partner in your closed guard with good posture',
        'Use grips and hips to break them down',
        'Get their head below your chest',
        'Partner resists at 40%',
        'Goal: 10 successful breaks in 3 minutes',
      ],
      focusPoints: [
        'Pull with arms, push with legs',
        'Time the break with their movement',
        'Control head once posture is broken',
      ],
    },
  },
  {
    id: 'closed-week2-attack-setup',
    position: 'closed_guard',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'submission-setups',
      name: 'Submission Setup Drill',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=jFRuW1WUfyU',
      instructions: [
        'From closed guard with broken posture',
        'Set up armbar, triangle, or kimura',
        'Don\'t finish, just get to position',
        'Partner can defend at 50%',
        'Alternate between attacks',
      ],
      focusPoints: [
        'Control head and arm',
        'Hip movement is key',
        'Chain attacks if first is defended',
      ],
    },
  },
];

/**
 * Open Guard Drills
 */
export const OPEN_GUARD_DRILLS: DrillTemplate[] = [
  {
    id: 'open-week1-grips',
    position: 'open_guard',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'grip-fighting',
      name: 'Open Guard Grip Control',
      duration: 180,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=UTaZzbHMr-s&t=120s',
      instructions: [
        'Start in open guard',
        'Establish strong grips (sleeve, collar, or ankle)',
        'Partner tries to break grips',
        'You maintain and re-establish',
        '3 minute rounds',
      ],
      focusPoints: [
        'Grips + foot placement = control',
        'Don\'t let them stand freely',
        'Reset grips quickly if broken',
      ],
    },
  },
  {
    id: 'open-week2-sweep',
    position: 'open_guard',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'basic-sweep',
      name: 'Open Guard Sweep Drill',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=cdMxuXC_x9s',
      instructions: [
        'From open guard with grips',
        'Off-balance partner',
        'Execute sweep to top position',
        'Partner resists at 50%',
        'Goal: 6 successful sweeps in 4 minutes',
      ],
      focusPoints: [
        'Break their base first',
        'Use push-pull dynamics',
        'Follow through to top',
      ],
    },
  },
];

/**
 * Half Guard Drills
 */
export const HALF_GUARD_DRILLS: DrillTemplate[] = [
  {
    id: 'half-week1-prevent-flatten',
    position: 'half_guard',
    skillLevel: 'beginner',
    week: 1,
    drill: {
      id: 'stay-on-side',
      name: 'Prevent Flattening Drill',
      duration: 180,
      partnerRequired: true,
      instructions: [
        'You have half guard',
        'Partner tries to flatten you to back',
        'You stay on your side',
        'Use frames and hip movement',
        '3 minute rounds',
      ],
      focusPoints: [
        'Stay on your side, never flat',
        'Inside arm frames their hip',
        'Use legs to maintain position',
      ],
    },
  },
  {
    id: 'half-week2-underhook',
    position: 'half_guard',
    skillLevel: 'intermediate',
    week: 2,
    drill: {
      id: 'get-underhook',
      name: 'Underhook and Come to Knees',
      duration: 240,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=pW2YL_n8Q_U',
      instructions: [
        'From half guard bottom',
        'Fight for underhook',
        'Come up to knees',
        'Partner resists at 60%',
        'Goal: 5 successful underhooks in 4 minutes',
      ],
      focusPoints: [
        'Underhook is the key to half guard',
        'Use it to come to knees',
        'Don\'t let them get crossface',
      ],
    },
  },
  {
    id: 'half-week3-sweep',
    position: 'half_guard',
    skillLevel: 'advanced',
    week: 3,
    drill: {
      id: 'half-guard-sweep',
      name: 'Half Guard Sweep Drill',
      duration: 300,
      partnerRequired: true,
      videoClipUrl: 'https://youtube.com/watch?v=zDD2ORNn_yw',
      instructions: [
        'From half guard with underhook',
        'Execute sweep to top position',
        'Partner actively defends at 70%',
        '5 minute round',
        'Track successful sweeps',
      ],
      focusPoints: [
        'Off-balance before sweep',
        'Use underhook to lift',
        'Come on top in strong position',
      ],
    },
  },
];

/**
 * Complete drill library
 */
export const DRILL_LIBRARY: DrillTemplate[] = [
  ...SIDE_CONTROL_DRILLS,
  ...MOUNT_ESCAPE_DRILLS,
  ...BACK_ESCAPE_DRILLS,
  ...GUARD_RETENTION_DRILLS,
  ...CLOSED_GUARD_DRILLS,
  ...OPEN_GUARD_DRILLS,
  ...HALF_GUARD_DRILLS,
];

/**
 * Get drills for specific position, week, and skill level
 */
export function getDrillsForPosition(
  position: Position,
  weekNumber: number,
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
): DrillRecommendation[] {
  const filtered = DRILL_LIBRARY.filter(
    (template) =>
      template.position === position &&
      template.week === weekNumber &&
      (template.skillLevel === skillLevel || template.skillLevel === 'beginner')
  );

  return filtered.map((template) => template.drill);
}

/**
 * Get all drills for a position
 */
export function getAllDrillsForPosition(position: Position): DrillTemplate[] {
  return DRILL_LIBRARY.filter((template) => template.position === position);
}

/**
 * Get drill by ID
 */
export function getDrillById(drillId: string): DrillTemplate | undefined {
  return DRILL_LIBRARY.find((template) => template.drill.id === drillId);
}
