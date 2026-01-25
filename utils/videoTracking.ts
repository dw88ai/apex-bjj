import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@apexbjj:video_watch_history';

export interface VideoWatchData {
  videoId: string;
  url: string;
  title: string;
  watchPercentage: number;
  completed: boolean;
  lastWatched: Date;
  totalWatchTime: number; // seconds
}

// Date reviver for parsing stored dates
const dateReviver = (key: string, value: any) => {
  if (key === 'lastWatched' && typeof value === 'string') {
    return new Date(value);
  }
  return value;
};

/**
 * Get all video watch history
 */
export const getVideoWatchHistory = async (): Promise<VideoWatchData[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data, dateReviver);
  } catch (error) {
    console.error('Error loading video watch history:', error);
    return [];
  }
};

/**
 * Get watch data for a specific video
 */
export const getVideoWatchData = async (videoId: string): Promise<VideoWatchData | null> => {
  try {
    const history = await getVideoWatchHistory();
    return history.find(item => item.videoId === videoId) || null;
  } catch (error) {
    console.error('Error getting video watch data:', error);
    return null;
  }
};

/**
 * Check if a video has been completed (watched 90%+)
 */
export const isVideoCompleted = async (videoId: string): Promise<boolean> => {
  try {
    const data = await getVideoWatchData(videoId);
    return data?.completed || false;
  } catch (error) {
    console.error('Error checking video completion:', error);
    return false;
  }
};

/**
 * Save or update video watch data
 */
export const saveVideoWatchData = async (watchData: VideoWatchData): Promise<void> => {
  try {
    const history = await getVideoWatchHistory();
    const existingIndex = history.findIndex(item => item.videoId === watchData.videoId);
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = {
        ...history[existingIndex],
        ...watchData,
        lastWatched: new Date(),
      };
    } else {
      // Add new entry
      history.push({
        ...watchData,
        lastWatched: new Date(),
      });
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving video watch data:', error);
  }
};

/**
 * Track video start
 */
export const trackVideoStart = async (
  videoId: string,
  url: string,
  title: string
): Promise<void> => {
  try {
    const existingData = await getVideoWatchData(videoId);
    
    await saveVideoWatchData({
      videoId,
      url,
      title,
      watchPercentage: existingData?.watchPercentage || 0,
      completed: existingData?.completed || false,
      lastWatched: new Date(),
      totalWatchTime: existingData?.totalWatchTime || 0,
    });
  } catch (error) {
    console.error('Error tracking video start:', error);
  }
};

/**
 * Track video progress
 */
export const trackVideoProgress = async (
  videoId: string,
  currentTime: number,
  duration: number
): Promise<void> => {
  try {
    const existingData = await getVideoWatchData(videoId);
    if (!existingData) return;
    
    const watchPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const completed = watchPercentage >= 90;
    
    await saveVideoWatchData({
      ...existingData,
      watchPercentage,
      completed,
      totalWatchTime: currentTime,
    });
  } catch (error) {
    console.error('Error tracking video progress:', error);
  }
};

/**
 * Get total videos watched
 */
export const getTotalVideosWatched = async (): Promise<number> => {
  try {
    const history = await getVideoWatchHistory();
    return history.filter(item => item.completed).length;
  } catch (error) {
    console.error('Error getting total videos watched:', error);
    return 0;
  }
};

/**
 * Get watch time stats
 */
export const getWatchTimeStats = async (): Promise<{
  totalWatchTime: number;
  videosStarted: number;
  videosCompleted: number;
}> => {
  try {
    const history = await getVideoWatchHistory();
    
    return {
      totalWatchTime: history.reduce((sum, item) => sum + item.totalWatchTime, 0),
      videosStarted: history.length,
      videosCompleted: history.filter(item => item.completed).length,
    };
  } catch (error) {
    console.error('Error getting watch time stats:', error);
    return {
      totalWatchTime: 0,
      videosStarted: 0,
      videosCompleted: 0,
    };
  }
};

/**
 * Clear all video watch history (for testing/reset)
 */
export const clearVideoWatchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing video watch history:', error);
  }
};
