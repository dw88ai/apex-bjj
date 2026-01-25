export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type TrainingFrequency = '2x' | '3x' | '4-5x';
export type MissionType = 'defense' | 'a-game';
export type MissionStatus = 'active' | 'completed' | 'abandoned';

export type Position = 
  | 'side_control'
  | 'mount'
  | 'back'
  | 'guard'
  | 'closed_guard'
  | 'open_guard'
  | 'half_guard';

export type GeneralTrainingType = 'rolling' | 'drilling' | 'technique' | 'open_mat';

export interface User {
  id: string;
  email?: string;
  createdAt: Date;
  beltLevel: BeltLevel;
  trainingFrequency: TrainingFrequency;
  timezone?: string;
  pushToken?: string;
  subscriptionTier?: 'free' | 'premium';
}

export interface Mission {
  id: string;
  userId: string;
  missionType: MissionType;
  positionFocus: Position;
  goalDescription: string;
  startDate: Date;
  endDate: Date;
  status: MissionStatus;
  createdAt: Date;
  weeklyGoals?: WeeklyGoal[];
}

export interface WeeklyGoal {
  weekNumber: number;
  description: string;
  videoUrl?: string;
  videoTimestamp?: string;
}

export interface TrainingLog {
  id: string;
  userId: string;
  missionId?: string; // Optional for general training logs
  sessionDate: Date;
  voiceTranscript?: string;
  escapeAttempts: number;
  successfulEscapes: number;
  escapeRate: number;
  mainProblem?: string;
  trainingNotes?: string;
  intensityLevel?: number;
  generalTrainingType?: GeneralTrainingType; // For non-mission logs
  objectivesAchieved?: ObjectiveAchievement[]; // Tracked objectives
  gamePlanId?: string; // Link to game plan
  createdAt: Date;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  missionId: string;
  weekNumber: number;
  weekStartDate: Date;
  totalSessions: number;
  averageEscapeRate: number;
  recurringProblem?: string;
  suggestedFixTitle?: string;
  suggestedFixDescription?: string;
  videoResourceUrl?: string;
  videoTimestamp?: string;
  userFeedback?: 'helpful' | 'not_helpful';
  createdAt: Date;
}

export interface ContentLibraryItem {
  id: string;
  position: Position;
  problemType: string;
  fixTitle: string;
  fixDescription: string;
  videoUrl: string;
  videoTimestamp?: string;
  timesRecommended: number;
  helpfulnessScore: number;
  createdAt: Date;
}

export interface SessionGamePlan {
  id: string;
  userId: string;
  missionId: string;
  weekNumber: number;
  generatedDate: Date;
  objectives: GamePlanObjective[];
  drillRecommendations: DrillRecommendation[];
  mentalCue: string;
  rollingStrategy: RollingStrategy;
  fallbackPlan: string;
}

export interface GamePlanObjective {
  id: string;
  description: string; // e.g., "Establish inside elbow within 3 seconds"
  measurable: boolean;
  targetReps: number; // e.g., 3 out of 5 attempts
  priority: 'primary' | 'secondary';
  achieved?: boolean; // Set during post-session
}

export interface DrillRecommendation {
  id: string;
  name: string;
  duration: number; // seconds
  partnerRequired: boolean;
  videoClipUrl?: string;
  instructions: string[];
  focusPoints: string[];
}

export interface RollingStrategy {
  startingPosition: string; // e.g., "Bottom side control"
  goalReps: number; // e.g., "5 escape attempts"
  tacticalNotes: string[]; // e.g., ["Ask higher belts", "Give position back after escape"]
  betweenRoundsTip?: string;
}

export interface ObjectiveAchievement {
  objectiveId: string;
  objectiveText: string;
  targetReps: number;
  achieved: 'yes' | 'partial' | 'no';
  actualReps?: number;
  notes?: string;
}

export interface ProblemOption {
  id: string;
  label: string;
  position: Position;
  emoji: string;
}

export const PROBLEM_OPTIONS: ProblemOption[] = [
  { id: 'side_control_stuck', label: 'Stuck in bottom side control', position: 'side_control', emoji: '🔒' },
  { id: 'mount_escape', label: "Can't escape mount", position: 'mount', emoji: '⛰️' },
  { id: 'back_control', label: 'Keep giving up my back', position: 'back', emoji: '🎒' },
  { id: 'guard_retention', label: 'No guard retention', position: 'guard', emoji: '🛡️' },
  { id: 'guard_passed', label: 'Get passed every roll', position: 'guard', emoji: '🚶' },
  { id: 'submissions', label: "Can't finish submissions", position: 'closed_guard', emoji: '🎯' },
];

export const BELT_LEVELS: { value: BeltLevel; label: string }[] = [
  { value: 'white', label: 'White Belt' },
  { value: 'blue', label: 'Blue Belt' },
  { value: 'purple', label: 'Purple Belt' },
  { value: 'brown', label: 'Brown Belt' },
  { value: 'black', label: 'Black Belt' },
];

export const TRAINING_FREQUENCIES: { value: TrainingFrequency; label: string }[] = [
  { value: '2x', label: '2x per week' },
  { value: '3x', label: '3x per week' },
  { value: '4-5x', label: '4-5x per week' },
];
