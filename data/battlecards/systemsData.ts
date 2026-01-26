/**
 * Battle Card Systems Data
 * 
 * The "Brain" - Contains all BJJ decision trees
 * Each system follows the Dilemma structure:
 * IF (Opponent Reaction A) -> THEN (Instruction A)
 * IF (Opponent Reaction B) -> THEN (Instruction B)
 */

import { BattleCardSystem } from '../../types/battlecards';

export const BATTLE_CARD_SYSTEMS: Record<string, BattleCardSystem> = {
  back_control: {
    id: 'back_control',
    title: 'Straight Jacket System',
    goal: 'Isolate one arm to kill the 2-on-2 defense.',
    wedges: [
      'Chest-to-back connection',
      'Elbow-box',
      'Bottom-hook-tension',
    ],
    dilemma: {
      question: 'Which hand is the opponent prioritizing?',
      options: [
        {
          label: 'Fighting my Top Hand',
          result: 'Trap their bottom hand with your leg.',
          next: 'finish_rnc',
        },
        {
          label: 'Fighting my Bottom Hand',
          result: 'Direct neck entry. Use thumb-slide.',
          next: 'finish_rnc',
        },
      ],
    },
    tags: ['back', 'chokes', 'control'],
  },

  front_headlock: {
    id: 'front_headlock',
    title: 'The Front Headlock Dilemma',
    goal: 'Maintain weight on neck; look for the angle.',
    wedges: [
      'Chin-cup grip',
      'Pectoral pressure on crown',
      'Elbow-flare',
    ],
    dilemma: {
      question: 'Where is their weight shifting?',
      options: [
        {
          label: 'Pulling hips back',
          result: 'Light neck. Attack High-Elbow Guillotine.',
          next: 'finish_choke',
        },
        {
          label: 'Driving forward',
          result: 'Heavy head. Execute Go-Behind to Back.',
          next: 'back_control',
        },
      ],
    },
    tags: ['front_headlock', 'guillotine', 'control'],
  },
};

/**
 * Get a system by its ID
 */
export function getSystemById(id: string): BattleCardSystem | undefined {
  return BATTLE_CARD_SYSTEMS[id];
}

/**
 * Get all available systems
 */
export function getAllSystems(): BattleCardSystem[] {
  return Object.values(BATTLE_CARD_SYSTEMS);
}

/**
 * Get systems filtered by tag
 */
export function getSystemsByTag(tag: string): BattleCardSystem[] {
  return Object.values(BATTLE_CARD_SYSTEMS).filter((system) =>
    system.tags.includes(tag)
  );
}

/**
 * Get all unique tags across all systems
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(BATTLE_CARD_SYSTEMS).forEach((system) => {
    system.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
