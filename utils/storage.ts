import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mission, TrainingLog, WeeklyReview, SessionGamePlan } from '../types';

const KEYS = {
  USER: '@apexbjj:user',
  MISSIONS: '@apexbjj:missions',
  TRAINING_LOGS: '@apexbjj:training_logs',
  WEEKLY_REVIEWS: '@apexbjj:weekly_reviews',
  ONBOARDING_COMPLETE: '@apexbjj:onboarding_complete',
  ACTIVE_MISSION_ID: '@apexbjj:active_mission_id',
  GAME_PLANS: '@apexbjj:game_plans',
};

// User
export const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  if (!data) return null;
  const user = JSON.parse(data);
  // Convert date strings back to Date objects
  if (user.createdAt) user.createdAt = new Date(user.createdAt);
  return user;
};

// Missions
export const saveMission = async (mission: Mission): Promise<void> => {
  const missions = await getMissions();
  const existingIndex = missions.findIndex(m => m.id === mission.id);
  
  if (existingIndex >= 0) {
    missions[existingIndex] = mission;
  } else {
    missions.push(mission);
  }
  
  await AsyncStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
};

export const getMissions = async (): Promise<Mission[]> => {
  const data = await AsyncStorage.getItem(KEYS.MISSIONS);
  if (!data) return [];
  const missions = JSON.parse(data);
  // Convert date strings back to Date objects
  return missions.map((m: any) => ({
    ...m,
    startDate: new Date(m.startDate),
    endDate: new Date(m.endDate),
    createdAt: new Date(m.createdAt),
  }));
};

export const getActiveMission = async (): Promise<Mission | null> => {
  const missions = await getMissions();
  return missions.find(m => m.status === 'active') || null;
};

export const setActiveMissionId = async (missionId: string): Promise<void> => {
  await AsyncStorage.setItem(KEYS.ACTIVE_MISSION_ID, missionId);
};

export const getActiveMissionId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(KEYS.ACTIVE_MISSION_ID);
};

// Training Logs
export const saveTrainingLog = async (log: TrainingLog): Promise<void> => {
  const logs = await getTrainingLogs();
  const existingIndex = logs.findIndex(l => l.id === log.id);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  
  await AsyncStorage.setItem(KEYS.TRAINING_LOGS, JSON.stringify(logs));
};

export const getTrainingLogs = async (missionId?: string): Promise<TrainingLog[]> => {
  const data = await AsyncStorage.getItem(KEYS.TRAINING_LOGS);
  if (!data) return [];
  const logs = JSON.parse(data);
  
  // Convert date strings back to Date objects
  const parsedLogs = logs.map((log: any) => ({
    ...log,
    sessionDate: new Date(log.sessionDate),
    createdAt: new Date(log.createdAt),
  }));
  
  if (missionId) {
    return parsedLogs.filter((log: TrainingLog) => log.missionId === missionId);
  }
  
  return parsedLogs;
};

export const getRecentTrainingLogs = async (limit: number = 5): Promise<TrainingLog[]> => {
  const logs = await getTrainingLogs();
  return logs
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
    .slice(0, limit);
};

export const getTrainingLogById = async (logId: string): Promise<TrainingLog | null> => {
  try {
    const logs = await getTrainingLogs();
    return logs.find(log => log.id === logId) || null;
  } catch (error) {
    console.error('Error getting training log by ID:', error);
    throw error;
  }
};

export const updateTrainingLog = async (logId: string, updates: Partial<TrainingLog>): Promise<void> => {
  try {
    const logs = await getTrainingLogs();
    const index = logs.findIndex(l => l.id === logId);
    
    if (index === -1) {
      throw new Error(`Training log with ID ${logId} not found`);
    }
    
    // Merge updates with existing log
    logs[index] = {
      ...logs[index],
      ...updates,
      id: logId, // Ensure ID cannot be changed
    };
    
    await AsyncStorage.setItem(KEYS.TRAINING_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error updating training log:', error);
    throw error;
  }
};

export const deleteTrainingLog = async (logId: string): Promise<void> => {
  try {
    const logs = await getTrainingLogs();
    const filteredLogs = logs.filter(l => l.id !== logId);
    
    if (filteredLogs.length === logs.length) {
      throw new Error(`Training log with ID ${logId} not found`);
    }
    
    await AsyncStorage.setItem(KEYS.TRAINING_LOGS, JSON.stringify(filteredLogs));
  } catch (error) {
    console.error('Error deleting training log:', error);
    throw error;
  }
};

// Weekly Reviews
export const saveWeeklyReview = async (review: WeeklyReview): Promise<void> => {
  const reviews = await getWeeklyReviews();
  const existingIndex = reviews.findIndex(r => r.id === review.id);
  
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }
  
  await AsyncStorage.setItem(KEYS.WEEKLY_REVIEWS, JSON.stringify(reviews));
};

export const getWeeklyReviews = async (missionId?: string): Promise<WeeklyReview[]> => {
  const data = await AsyncStorage.getItem(KEYS.WEEKLY_REVIEWS);
  if (!data) return [];
  const reviews = JSON.parse(data);
  
  // Convert date strings back to Date objects
  const parsedReviews = reviews.map((review: any) => ({
    ...review,
    weekStartDate: new Date(review.weekStartDate),
    createdAt: new Date(review.createdAt),
  }));
  
  if (missionId) {
    return parsedReviews.filter((review: WeeklyReview) => review.missionId === missionId);
  }
  
  return parsedReviews;
};

// Onboarding
export const setOnboardingComplete = async (complete: boolean): Promise<void> => {
  await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, JSON.stringify(complete));
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  const data = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
  return data ? JSON.parse(data) : false;
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(Object.values(KEYS));
};
