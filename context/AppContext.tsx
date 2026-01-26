import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mission, TrainingLog, WeeklyReview } from '../types';
import { SystemUsageStats } from '../types/battlecards';
import * as Storage from '../utils/storage';

interface AppContextType {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Mission
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;
  saveMission: (mission: Mission) => Promise<void>;
  abandonCurrentMission: () => Promise<void>;
  
  // Training Logs
  trainingLogs: TrainingLog[];
  addTrainingLog: (log: TrainingLog) => Promise<void>;
  updateTrainingLog: (logId: string, updates: Partial<TrainingLog>) => Promise<void>;
  deleteTrainingLog: (logId: string) => Promise<void>;
  getLogById: (logId: string) => TrainingLog | undefined;
  refreshTrainingLogs: () => Promise<void>;
  
  // Weekly Reviews
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: WeeklyReview) => Promise<void>;
  
  // Onboarding
  onboardingComplete: boolean;
  completeOnboarding: () => Promise<void>;
  
  // Loading states
  loading: boolean;
  
  // Battle Card Systems
  systemUsageStats: SystemUsageStats[];
  trackSystemUsage: (systemId: string, decision?: string) => Promise<void>;
  
  // Actions
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [activeMission, setActiveMissionState] = useState<Mission | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [systemUsageStats, setSystemUsageStats] = useState<SystemUsageStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      setLoading(true);
      
      const [
        storedUser,
        storedMission,
        storedLogs,
        storedReviews,
        onboardingDone,
        storedSystemStats,
      ] = await Promise.all([
        Storage.getUser(),
        Storage.getActiveMission(),
        Storage.getTrainingLogs(),
        Storage.getWeeklyReviews(),
        Storage.isOnboardingComplete(),
        AsyncStorage.getItem('systemUsageStats'),
      ]);

      setUserState(storedUser);
      setActiveMissionState(storedMission);
      setTrainingLogs(storedLogs);
      setWeeklyReviews(storedReviews);
      setOnboardingComplete(onboardingDone);
      
      if (storedSystemStats) {
        try {
          const parsed = JSON.parse(storedSystemStats);
          // Convert date strings back to Date objects
          const statsWithDates = parsed.map((stat: SystemUsageStats) => ({
            ...stat,
            lastVisited: new Date(stat.lastVisited),
            decisionsTracked: stat.decisionsTracked.map((d: { option: string; timestamp: string | Date }) => ({
              ...d,
              timestamp: new Date(d.timestamp),
            })),
          }));
          setSystemUsageStats(statsWithDates);
        } catch (e) {
          console.error('Error parsing system usage stats:', e);
        }
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUser = async (newUser: User | null) => {
    try {
      setUserState(newUser);
      if (newUser) {
        await Storage.saveUser(newUser);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const setActiveMission = async (mission: Mission | null) => {
    try {
      setActiveMissionState(mission);
      if (mission) {
        await Storage.saveMission(mission);
        await Storage.setActiveMissionId(mission.id);
      }
    } catch (error) {
      console.error('Error saving mission:', error);
      throw error;
    }
  };

  const saveMission = async (mission: Mission) => {
    try {
      await Storage.saveMission(mission);
      if (mission.status === 'active') {
        setActiveMissionState(mission);
      }
    } catch (error) {
      console.error('Error saving mission:', error);
      throw error;
    }
  };

  const abandonCurrentMission = async () => {
    try {
      if (activeMission) {
        const updatedMission = {
          ...activeMission,
          status: 'abandoned' as const,
        };
        await Storage.saveMission(updatedMission);
      }
      setActiveMissionState(null);
      await Storage.setActiveMissionId('');
    } catch (error) {
      console.error('Error abandoning mission:', error);
      throw error;
    }
  };

  const addTrainingLog = async (log: TrainingLog) => {
    try {
      await Storage.saveTrainingLog(log);
      setTrainingLogs(prev => [...prev, log].sort((a, b) => 
        new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
      ));
    } catch (error) {
      console.error('Error saving training log:', error);
      throw error;
    }
  };

  const updateTrainingLog = async (logId: string, updates: Partial<TrainingLog>) => {
    try {
      await Storage.updateTrainingLog(logId, updates);
      // Update local state
      setTrainingLogs(prev =>
        prev.map(log => (log.id === logId ? { ...log, ...updates } : log))
          .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
      );
    } catch (error) {
      console.error('Error updating training log:', error);
      throw error;
    }
  };

  const deleteTrainingLog = async (logId: string) => {
    try {
      await Storage.deleteTrainingLog(logId);
      // Update local state
      setTrainingLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      console.error('Error deleting training log:', error);
      throw error;
    }
  };

  const getLogById = (logId: string): TrainingLog | undefined => {
    return trainingLogs.find(log => log.id === logId);
  };

  const refreshTrainingLogs = async () => {
    try {
      const logs = await Storage.getTrainingLogs(activeMission?.id);
      setTrainingLogs(logs);
    } catch (error) {
      console.error('Error refreshing training logs:', error);
    }
  };

  const addWeeklyReview = async (review: WeeklyReview) => {
    try {
      await Storage.saveWeeklyReview(review);
      setWeeklyReviews(prev => [...prev, review]);
    } catch (error) {
      console.error('Error saving weekly review:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await Storage.setOnboardingComplete(true);
      setOnboardingComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const trackSystemUsage = async (systemId: string, decision?: string) => {
    try {
      const existingIndex = systemUsageStats.findIndex(s => s.systemId === systemId);
      let updated: SystemUsageStats[];
      
      if (existingIndex >= 0) {
        // Update existing stat
        updated = [...systemUsageStats];
        updated[existingIndex] = {
          ...updated[existingIndex],
          timesVisited: updated[existingIndex].timesVisited + (decision ? 0 : 1), // Only increment on initial visit
          lastVisited: new Date(),
          decisionsTracked: decision
            ? [...updated[existingIndex].decisionsTracked, { option: decision, timestamp: new Date() }]
            : updated[existingIndex].decisionsTracked,
        };
      } else {
        // Create new stat
        const newStat: SystemUsageStats = {
          systemId,
          timesVisited: 1,
          lastVisited: new Date(),
          decisionsTracked: decision ? [{ option: decision, timestamp: new Date() }] : [],
        };
        updated = [...systemUsageStats, newStat];
      }
      
      setSystemUsageStats(updated);
      await AsyncStorage.setItem('systemUsageStats', JSON.stringify(updated));
    } catch (error) {
      console.error('Error tracking system usage:', error);
    }
  };

  const resetApp = async () => {
    try {
      await Storage.clearAllData();
      await AsyncStorage.removeItem('systemUsageStats');
      setUserState(null);
      setActiveMissionState(null);
      setTrainingLogs([]);
      setWeeklyReviews([]);
      setOnboardingComplete(false);
      setSystemUsageStats([]);
    } catch (error) {
      console.error('Error resetting app:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    user,
    setUser,
    activeMission,
    setActiveMission,
    saveMission,
    abandonCurrentMission,
    trainingLogs,
    addTrainingLog,
    updateTrainingLog,
    deleteTrainingLog,
    getLogById,
    refreshTrainingLogs,
    weeklyReviews,
    addWeeklyReview,
    onboardingComplete,
    completeOnboarding,
    loading,
    systemUsageStats,
    trackSystemUsage,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
