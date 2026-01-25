import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Colors } from '../constants/colors';
import { spacing } from '../constants/theme';
import { trackVideoStart, trackVideoProgress } from '../utils/videoTracking';

interface VideoPlayerProps {
  visible: boolean;
  videoUrl: string;
  videoTitle: string;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  visible,
  videoUrl,
  videoTitle,
  onClose,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract video ID from URL
  useEffect(() => {
    if (videoUrl) {
      console.log('VideoPlayer received URL:', videoUrl);
      const id = extractVideoId(videoUrl);
      console.log('Extracted video ID:', id);
      setVideoId(id);
      
      if (id) {
        // Track video start
        trackVideoStart(id, videoUrl, videoTitle);
      } else {
        console.error('Failed to extract video ID from URL');
      }
    }
  }, [videoUrl, videoTitle]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const extractVideoId = (url: string): string | null => {
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
  };

  const handleClose = () => {
    setLoading(true);
    setError(false);
    onClose();
  };

  // Get the direct embed URL
  const getDirectEmbedUrl = (): string => {
    const id = extractVideoId(videoUrl);
    if (!id) {
      console.error('Could not extract video ID from URL:', videoUrl);
      return '';
    }
    
    const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=1`;
    console.log('Embed URL:', embedUrl);
    return embedUrl;
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <StatusBar hidden />
        
        {/* Close Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconButton
              icon="close"
              iconColor={Colors.text}
              size={28}
              onPress={handleClose}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Video Title */}
        {videoTitle && (
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
              {videoTitle}
            </Text>
          </View>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Loading video...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text variant="headlineSmall" style={styles.errorText}>
              ⚠️
            </Text>
            <Text variant="bodyLarge" style={styles.errorText}>
              Unable to load video
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.errorButton}>
              <Text variant="labelLarge" style={styles.errorButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WebView with YouTube Player */}
        {!error && getDirectEmbedUrl() && (
          <WebView
            ref={webViewRef}
            source={{ uri: getDirectEmbedUrl() }}
            style={styles.webView}
            onLoadStart={() => {
              console.log('WebView loading started');
              setLoading(true);
            }}
            onLoadEnd={() => {
              console.log('WebView loading ended');
              setLoading(false);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              setError(true);
              setLoading(false);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView HTTP error:', nativeEvent);
            }}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            originWhitelist={['*']}
            mixedContentMode="always"
            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeButton: {
    padding: 0,
  },
  closeIcon: {
    margin: 0,
  },
  titleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    left: 10,
    right: 70,
    zIndex: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.sm,
    borderRadius: 8,
  },
  title: {
    color: Colors.text,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    zIndex: 5,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  errorButtonText: {
    color: Colors.text,
  },
});
