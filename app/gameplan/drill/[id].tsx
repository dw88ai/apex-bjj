import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors } from '../../../constants/colors';
import { spacing } from '../../../constants/theme';
import { getDrillById } from '../../../utils/drillLibrary';
import { openVideoInBrowser } from '../../../components/VideoPlayerBrowser';
import * as Haptics from 'expo-haptics';

export default function DrillDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const drillTemplate = getDrillById(id as string);
  const drill = drillTemplate?.drill;

  useEffect(() => {
    if (drill) {
      setTimeRemaining(drill.duration);
    }
  }, [drill]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const startTimer = () => {
    if (isTimerRunning) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTimerRunning(true);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Drill Complete!', 'Great work! Time to move on.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
    setTimeRemaining(drill?.duration || 0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!drill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium" style={styles.emptyText}>
            Drill not found
          </Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button
          mode="text"
          onPress={() => router.back()}
          icon="arrow-left"
          style={styles.backButton}
        >
          Back
        </Button>

        <Text variant="headlineLarge" style={styles.title}>
          {drill.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text variant="bodyMedium" style={styles.metaText}>
              {Math.floor(drill.duration / 60)} minutes
            </Text>
          </View>
          <View style={styles.metaBadge}>
            <Text variant="bodyMedium" style={styles.metaText}>
              {drill.partnerRequired ? '👥 Partner Required' : '🧘 Solo Drill'}
            </Text>
          </View>
        </View>

        {/* Timer */}
        <Card style={styles.timerCard}>
          <Text variant="displayLarge" style={styles.timerDisplay}>
            {formatTime(timeRemaining)}
          </Text>
          <View style={styles.timerButtons}>
            {!isTimerRunning ? (
              <Button
                mode="contained"
                onPress={startTimer}
                icon="play"
                style={styles.timerButton}
              >
                Start
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={pauseTimer}
                icon="pause"
                style={styles.timerButton}
              >
                Pause
              </Button>
            )}
            <Button
              mode="outlined"
              onPress={resetTimer}
              icon="refresh"
              style={styles.timerButton}
            >
              Reset
            </Button>
          </View>
        </Card>

        {/* Video */}
        {drill.videoClipUrl && (
          <Card>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Video Tutorial
            </Text>
            <Button
              mode="contained"
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                try {
                  await openVideoInBrowser({
                    videoUrl: drill.videoClipUrl!,
                    videoTitle: drill.name,
                  });
                } catch (error) {
                  Alert.alert('Error', 'Unable to open video');
                }
              }}
              icon="play-circle"
            >
              Watch Drill Video
            </Button>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Instructions
          </Text>
          {drill.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text variant="bodyMedium" style={styles.instructionNumberText}>
                  {index + 1}
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.instructionText}>
                {instruction}
              </Text>
            </View>
          ))}
        </Card>

        {/* Focus Points */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Key Focus Points
          </Text>
          {drill.focusPoints.map((point, index) => (
            <View key={index} style={styles.focusPointItem}>
              <Text variant="bodyLarge" style={styles.focusPointBullet}>
                •
              </Text>
              <Text variant="bodyMedium" style={styles.focusPointText}>
                {point}
              </Text>
            </View>
          ))}
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: Colors.text,
    marginBottom: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  metaText: {
    color: Colors.text,
  },
  timerCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: Colors.primaryContainer,
  },
  timerDisplay: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timerButton: {
    flex: 1,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  instructionNumberText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    color: Colors.text,
    lineHeight: 20,
  },
  focusPointItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  focusPointBullet: {
    color: Colors.primary,
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  focusPointText: {
    flex: 1,
    color: Colors.text,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
