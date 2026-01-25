import {
  Mission,
  TrainingLog,
  BeltLevel,
  Position,
  SessionGamePlan,
  GamePlanObjective,
  DrillRecommendation,
  RollingStrategy,
} from '../types';
import { DRILL_LIBRARY, getDrillsForPosition } from './drillLibrary';

/**
 * Generate a personalized game plan for today's training session
 * Based on mission progress, recent performance, and user skill level
 */
export function generateGamePlan(
  mission: Mission,
  recentLogs: TrainingLog[],
  userLevel: BeltLevel
): SessionGamePlan {
  const currentWeek = getCurrentWeek(mission);
  const weeklyGoal = mission.weeklyGoals?.[currentWeek - 1];
  
  if (!weeklyGoal) {
    throw new Error('No weekly goal found for current week');
  }

  // Analyze recent performance
  const recentProblems = analyzeRecurringProblems(recentLogs.slice(0, 3));
  const avgEscapeRate = calculateAvgEscapeRate(recentLogs);
  
  // Generate components
  const objectives = generateObjectives(
    mission.positionFocus,
    weeklyGoal.description,
    currentWeek,
    recentProblems,
    avgEscapeRate,
    userLevel
  );
  
  const drills = selectDrills(
    mission.positionFocus,
    currentWeek,
    objectives,
    userLevel
  );
  
  const mentalCue = generateMentalCue(weeklyGoal.description, objectives);
  
  const strategy = generateRollingStrategy(mission, objectives);
  
  const fallbackPlan = generateFallbackPlan(mission.positionFocus, currentWeek);

  return {
    id: `gameplan-${Date.now()}`,
    userId: mission.userId,
    missionId: mission.id,
    weekNumber: currentWeek,
    generatedDate: new Date(),
    objectives,
    drillRecommendations: drills,
    mentalCue,
    rollingStrategy: strategy,
    fallbackPlan,
  };
}

/**
 * Calculate which week of the mission we're currently in (1-4)
 */
export function getCurrentWeek(mission: Mission): number {
  const now = new Date();
  const start = new Date(mission.startDate);
  const daysSinceStart = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.min(Math.floor(daysSinceStart / 7) + 1, 4);
  return Math.max(1, weekNumber);
}

/**
 * Analyze recent logs to identify recurring problems
 */
function analyzeRecurringProblems(recentLogs: TrainingLog[]): string[] {
  const problemCounts: Record<string, number> = {};
  
  recentLogs.forEach(log => {
    if (log.mainProblem) {
      problemCounts[log.mainProblem] = (problemCounts[log.mainProblem] || 0) + 1;
    }
  });
  
  // Return problems that occurred 2+ times
  return Object.entries(problemCounts)
    .filter(([_, count]) => count >= 2)
    .map(([problem, _]) => problem);
}

/**
 * Calculate average escape rate from recent logs
 */
function calculateAvgEscapeRate(logs: TrainingLog[]): number {
  if (logs.length === 0) return 0;
  const sum = logs.reduce((acc, log) => acc + log.escapeRate, 0);
  return sum / logs.length;
}

/**
 * Generate 3 specific, measurable objectives for today's session
 */
function generateObjectives(
  position: Position,
  weeklyGoalDescription: string,
  weekNumber: number,
  recurringProblems: string[],
  avgEscapeRate: number,
  userLevel: BeltLevel
): GamePlanObjective[] {
  const objectives: GamePlanObjective[] = [];
  const positionName = position.replace('_', ' ');
  
  // Primary objective based on week and position
  const primaryObjective = getPrimaryObjective(position, weekNumber, userLevel);
  objectives.push({
    id: `obj-primary-${Date.now()}`,
    description: primaryObjective.description,
    measurable: true,
    targetReps: primaryObjective.targetReps,
    priority: 'primary',
  });
  
  // Secondary objective based on performance
  if (avgEscapeRate < 0.3) {
    // Low escape rate - focus on fundamentals
    objectives.push({
      id: `obj-secondary-1-${Date.now()}`,
      description: `Maintain frame position for 5+ seconds before attempting escape`,
      measurable: true,
      targetReps: 3,
      priority: 'secondary',
    });
  } else if (avgEscapeRate >= 0.5) {
    // Good escape rate - add complexity
    objectives.push({
      id: `obj-secondary-1-${Date.now()}`,
      description: `Chain to a secondary position if first escape fails`,
      measurable: true,
      targetReps: 2,
      priority: 'secondary',
    });
  } else {
    // Medium escape rate - refine technique
    objectives.push({
      id: `obj-secondary-1-${Date.now()}`,
      description: `Execute escape with proper hip movement and timing`,
      measurable: true,
      targetReps: 3,
      priority: 'secondary',
    });
  }
  
  // Third objective based on recurring problems
  if (recurringProblems.length > 0) {
    const problem = recurringProblems[0].toLowerCase();
    if (problem.includes('frame') || problem.includes('elbow')) {
      objectives.push({
        id: `obj-secondary-2-${Date.now()}`,
        description: `Establish frames immediately when entering ${positionName}`,
        measurable: true,
        targetReps: 4,
        priority: 'secondary',
      });
    } else if (problem.includes('timing') || problem.includes('slow')) {
      objectives.push({
        id: `obj-secondary-2-${Date.now()}`,
        description: `React within 3 seconds of entering bad position`,
        measurable: true,
        targetReps: 3,
        priority: 'secondary',
      });
    } else {
      objectives.push({
        id: `obj-secondary-2-${Date.now()}`,
        description: `Avoid giving up back during escape attempts`,
        measurable: true,
        targetReps: 5,
        priority: 'secondary',
      });
    }
  } else {
    // Default third objective
    objectives.push({
      id: `obj-secondary-2-${Date.now()}`,
      description: `Stay calm and breathe when stuck in ${positionName}`,
      measurable: true,
      targetReps: 5,
      priority: 'secondary',
    });
  }
  
  return objectives;
}

/**
 * Get primary objective based on position and week
 */
function getPrimaryObjective(
  position: Position,
  weekNumber: number,
  userLevel: BeltLevel
): { description: string; targetReps: number } {
  const targetReps = userLevel === 'white' ? 3 : userLevel === 'blue' ? 4 : 5;
  
  const objectiveMap: Record<Position, Record<number, string>> = {
    side_control: {
      1: 'Establish inside elbow position within 3 seconds',
      2: 'Create effective frames before opponent settles weight',
      3: 'Complete full hip escape to guard recovery',
      4: 'Chain multiple escape attempts under pressure',
    },
    mount: {
      1: 'Trap arm and bridge to create space',
      2: 'Execute elbow escape to half guard',
      3: 'Prevent opponent from advancing to high mount',
      4: 'Escape mount and recover guard position',
    },
    back: {
      1: 'Protect neck and prevent choke setup',
      2: 'Clear first hook using proper hand fighting',
      3: 'Escape to turtle or guard position',
      4: 'Counter back take attempts during scrambles',
    },
    guard: {
      1: 'Maintain distance and grip control',
      2: 'Recover guard when opponent starts to pass',
      3: 'Use frames to prevent guard pass completion',
      4: 'Retain guard under sustained pressure',
    },
    closed_guard: {
      1: 'Break opponent posture using grips and hips',
      2: 'Set up arm drag or high guard position',
      3: 'Threaten submission to create sweep opportunity',
      4: 'Execute sweep or submission from closed guard',
    },
    open_guard: {
      1: 'Establish strong grips and foot placement',
      2: 'Off-balance opponent using push-pull dynamics',
      3: 'Execute sweep from open guard position',
      4: 'Transition between open guard variations',
    },
    half_guard: {
      1: 'Prevent opponent from flattening you out',
      2: 'Create underhook or get to knees',
      3: 'Execute sweep from half guard',
      4: 'Recover full guard or take top position',
    },
  };
  
  const description = objectiveMap[position]?.[weekNumber] || 
    `Work on ${position.replace('_', ' ')} technique`;
  
  return { description, targetReps };
}

/**
 * Select 2-3 relevant drills from the library
 */
function selectDrills(
  position: Position,
  weekNumber: number,
  objectives: GamePlanObjective[],
  userLevel: BeltLevel
): DrillRecommendation[] {
  const skillLevel = getSkillLevel(userLevel);
  const allDrills = getDrillsForPosition(position, weekNumber, skillLevel);
  
  // Return top 2-3 most relevant drills
  return allDrills.slice(0, 3);
}

/**
 * Convert belt level to skill level
 */
function getSkillLevel(beltLevel: BeltLevel): 'beginner' | 'intermediate' | 'advanced' {
  if (beltLevel === 'white') return 'beginner';
  if (beltLevel === 'blue' || beltLevel === 'purple') return 'intermediate';
  return 'advanced';
}

/**
 * Generate a short, memorable mental cue (5-7 words)
 */
function generateMentalCue(
  weeklyGoalDescription: string,
  objectives: GamePlanObjective[]
): string {
  const cues: Record<string, string> = {
    'inside elbow': 'Elbow to hip, frame the neck',
    'frame': 'Frame early, escape often',
    'hip escape': 'Bridge, shrimp, recover guard',
    'posture': 'Break posture, attack immediately',
    'distance': 'Control distance, retain guard',
    'underhook': 'Get underhook, come to knees',
    'timing': 'React fast, escape early',
    'pressure': 'Stay calm, breathe, escape',
  };
  
  const primaryDesc = objectives[0].description.toLowerCase();
  
  for (const [keyword, cue] of Object.entries(cues)) {
    if (primaryDesc.includes(keyword)) {
      return cue;
    }
  }
  
  return 'Stay technical, stay calm';
}

/**
 * Generate rolling strategy for focused practice
 */
export function generateRollingStrategy(
  mission: Mission,
  objectives: GamePlanObjective[]
): RollingStrategy {
  const position = mission.positionFocus.replace('_', ' ');
  const isDefensive = ['side_control', 'mount', 'back'].includes(mission.positionFocus);
  
  const startingPosition = isDefensive 
    ? `Bottom ${position}`
    : position.charAt(0).toUpperCase() + position.slice(1);
  
  const goalReps = objectives[0].targetReps;
  
  const tacticalNotes = [
    `Ask training partners to start from ${startingPosition.toLowerCase()}`,
    `Focus on: ${objectives[0].description.toLowerCase()}`,
    isDefensive 
      ? 'Give position back after successful escape to practice again'
      : 'Reset to position after each attempt',
    'Count your attempts, not just successes',
    'Ask higher belts for specific feedback on technique',
  ];
  
  const betweenRoundsTip = isDefensive
    ? 'If you escaped, what worked? If not, what was the main obstacle?'
    : 'Did you control distance and timing? What adjustment would help?';
  
  return {
    startingPosition,
    goalReps,
    tacticalNotes,
    betweenRoundsTip,
  };
}

/**
 * Generate fallback plan if primary objectives aren't working
 */
function generateFallbackPlan(position: Position, weekNumber: number): string {
  const positionName = position.replace('_', ' ');
  
  if (weekNumber === 1) {
    return `If struggling, focus on just maintaining frames and breathing. Don't worry about completing the escape yet - build the foundation first.`;
  } else if (weekNumber === 2) {
    return `If the technique isn't working, go back to Week 1 fundamentals. Make sure your frames are solid before adding movement.`;
  } else if (weekNumber === 3) {
    return `If you're getting stuck, break it into smaller pieces. Practice each step separately before chaining them together.`;
  } else {
    return `If under heavy pressure, focus on defense and survival. It's better to maintain position than force a bad escape.`;
  }
}

/**
 * Get today's game plan from storage or generate new one
 */
export async function getTodaysGamePlan(
  mission: Mission,
  recentLogs: TrainingLog[],
  userLevel: BeltLevel
): Promise<SessionGamePlan> {
  // For MVP, always generate fresh
  // In future, check if one exists for today and return it
  return generateGamePlan(mission, recentLogs, userLevel);
}
