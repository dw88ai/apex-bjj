/**
 * Battle Card System Types
 * 
 * Zero-dependency decision tree interface for BJJ techniques
 */

export interface BattleCardSystem {
  id: string;
  title: string;
  goal: string;
  wedges: [string, string, string]; // Exactly 3 mechanical wedges
  dilemma: Dilemma;
  tags: string[]; // e.g., ["chokes", "control", "back"]
}

export interface Dilemma {
  question: string;
  options: [DilemmaOption, DilemmaOption]; // Exactly 2 options
}

export interface DilemmaOption {
  label: string;
  result: string; // The instruction to execute
  next: string; // System ID or 'finish_rnc', 'finish_choke', etc.
}

export interface SystemUsageStats {
  systemId: string;
  timesVisited: number;
  lastVisited: Date;
  decisionsTracked: DecisionRecord[];
}

export interface DecisionRecord {
  option: string;
  timestamp: Date;
}

// Finish types for completion screens
export type FinishType = 'rnc' | 'choke' | 'armbar' | 'sweep' | 'escape' | 'control';

export interface FinishScreen {
  type: FinishType;
  title: string;
  message: string;
  emoji: string;
}

export const FINISH_SCREENS: Record<FinishType, FinishScreen> = {
  rnc: {
    type: 'rnc',
    title: 'Rear Naked Choke',
    message: 'Lock in the choke. Squeeze and wait.',
    emoji: '🔒',
  },
  choke: {
    type: 'choke',
    title: 'Choke Secured',
    message: 'Apply steady pressure. Control the finish.',
    emoji: '💪',
  },
  armbar: {
    type: 'armbar',
    title: 'Armbar Locked',
    message: 'Pinch knees, hips up, extend slowly.',
    emoji: '🎯',
  },
  sweep: {
    type: 'sweep',
    title: 'Sweep Complete',
    message: 'Establish top position. Control first.',
    emoji: '🔄',
  },
  escape: {
    type: 'escape',
    title: 'Escape Successful',
    message: 'Recover guard or take top position.',
    emoji: '🏃',
  },
  control: {
    type: 'control',
    title: 'Position Secured',
    message: 'Maintain pressure. Look for the next step.',
    emoji: '🎖️',
  },
};
