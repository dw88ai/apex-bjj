import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { trackVideoStart } from '../utils/videoTracking';

interface VideoPlayerBrowserProps {
  videoUrl: string;
  videoTitle: string;
  onComplete?: () => void;
}

/**
 * Opens YouTube videos in an in-app browser overlay
 * More reliable than WebView for video playback
 */
export const openVideoInBrowser = async ({
  videoUrl,
  videoTitle,
  onComplete,
}: VideoPlayerBrowserProps): Promise<void> => {
  try {
    // Extract video ID for tracking
    const videoId = extractVideoId(videoUrl);
    
    if (videoId) {
      // Track video start
      await trackVideoStart(videoId, videoUrl, videoTitle);
    }
    
    // Open video in in-app browser
    const result = await WebBrowser.openBrowserAsync(videoUrl, {
      controlsColor: '#58A6FF', // Apex BJJ primary color
      toolbarColor: '#0D1117', // Dark background
      dismissButtonStyle: 'close',
      readerMode: false,
    });
    
    // Handle browser close
    if (result.type === 'dismiss' || result.type === 'cancel') {
      console.log('Video browser closed');
      onComplete?.();
    }
  } catch (error) {
    console.error('Error opening video:', error);
    throw error;
  }
};

/**
 * Extract YouTube video ID from various URL formats
 */
function extractVideoId(url: string): string | null {
  try {
    // Handle youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];

    // Handle youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];

    // Handle youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    return null;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
}

// Warm up the browser for faster opening
WebBrowser.warmUpAsync();

// Clean up when app closes
export const cleanupBrowser = () => {
  WebBrowser.coolDownAsync();
};
