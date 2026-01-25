import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { openVideoInBrowser } from '../../components/VideoPlayerBrowser';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function WeeklyReview() {
  const router = useRouter();
  const { weekNumber } = useLocalSearchParams();
  const { activeMission, trainingLogs } = useApp();
  const [stats, setStats] = useState({
    thisWeekRate: 0,
    lastWeekRate: 0,
    improvement: 0,
    recurringProblem: '',
    problemCount: 0,
  });

  useEffect(() => {
    if (activeMission) {
      calculateWeeklyStats();
    }
  }, [activeMission, trainingLogs]);

  const calculateWeeklyStats = () => {
    const missionLogs = trainingLogs.filter(log => log.missionId === activeMission?.id);

    // This week
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const thisWeekLogs = missionLogs.filter(
      log => new Date(log.sessionDate) >= thisWeekStart
    );

    const thisWeekRate = thisWeekLogs.length > 0
      ? Math.round(
          (thisWeekLogs.reduce((sum, log) => sum + log.escapeRate, 0) / thisWeekLogs.length) * 100
        )
      : 0;

    // Last week
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
    const lastWeekLogs = missionLogs.filter(
      log => new Date(log.sessionDate) >= lastWeekStart && new Date(log.sessionDate) < lastWeekEnd
    );

    const lastWeekRate = lastWeekLogs.length > 0
      ? Math.round(
          (lastWeekLogs.reduce((sum, log) => sum + log.escapeRate, 0) / lastWeekLogs.length) * 100
        )
      : 0;

    // Find recurring problem
    const problemCounts: Record<string, number> = {};
    thisWeekLogs.forEach(log => {
      if (log.mainProblem) {
        problemCounts[log.mainProblem] = (problemCounts[log.mainProblem] || 0) + 1;
      }
    });

    const topProblem = Object.entries(problemCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    setStats({
      thisWeekRate,
      lastWeekRate,
      improvement: thisWeekRate - lastWeekRate,
      recurringProblem: topProblem?.[0] || 'No specific problem identified',
      problemCount: topProblem?.[1] || 0,
    });
  };

  const handleFeedback = (helpful: boolean) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In real app, save feedback
  };

  const week = parseInt(weekNumber as string) || 1;

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
        <Text variant="displaySmall" style={styles.title}>
          Week {week} Review
        </Text>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Your Progress This Week
          </Text>
          <View style={styles.statsComparison}>
            <View style={styles.statColumn}>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Last Week
              </Text>
              <Text variant="displaySmall" style={styles.statValue}>
                {stats.lastWeekRate}%
              </Text>
            </View>
            <Text variant="headlineLarge" style={styles.arrow}>
              →
            </Text>
            <View style={[styles.statColumn, styles.statColumnHighlighted]}>
              <Text variant="bodyMedium" style={styles.statLabel}>
                This Week
              </Text>
              <Text variant="displaySmall" style={[styles.statValue, styles.highlighted]}>
                {stats.thisWeekRate}%
              </Text>
            </View>
          </View>
          {stats.improvement > 0 && (
            <View style={styles.improvementBadge}>
              <Text variant="titleMedium" style={styles.improvementText}>
                +{stats.improvement}% improvement 🔥
              </Text>
            </View>
          )}
          {stats.improvement === 0 && (
            <View style={styles.improvementBadge}>
              <Text variant="titleMedium" style={styles.improvementTextNeutral}>
                Maintaining consistency 💪
              </Text>
            </View>
          )}
          {stats.improvement < 0 && (
            <View style={styles.improvementBadge}>
              <Text variant="titleMedium" style={styles.improvementTextDown}>
                Down {Math.abs(stats.improvement)}% - that's okay, keep training!
              </Text>
            </View>
          )}
        </Card>

        {/* Recurring Problem */}
        {stats.recurringProblem !== 'No specific problem identified' && (
          <Card>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Your #1 Recurring Mistake
            </Text>
            <View style={styles.problemBox}>
              <Text variant="headlineSmall" style={styles.problemText}>
                "{stats.recurringProblem}"
              </Text>
              <Text variant="bodyMedium" style={styles.problemCount}>
                Happened {stats.problemCount} time{stats.problemCount !== 1 ? 's' : ''} this week
              </Text>
            </View>
          </Card>
        )}

        {/* AI Fix Card */}
        <Card style={styles.fixCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Fix to Try Next Week
          </Text>
          <Text variant="headlineSmall" style={styles.fixTitle}>
            Pin hip before bridging
          </Text>
          <Text variant="bodyLarge" style={styles.fixDescription}>
            Your inside elbow must connect to their hip bone BEFORE you bridge. Bridge without
            connection = wasted energy.
            {'\n\n'}
            Practice: Pin hip, hold 3 seconds, then bridge.
          </Text>

          <Button
            mode="outlined"
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              try {
                await openVideoInBrowser({
                  videoUrl: 'https://youtube.com/@LachlanGiles',
                  videoTitle: 'Lachlan Giles - Inside Position (2:15)',
                });
              } catch (error) {
                Alert.alert('Error', 'Unable to open video');
              }
            }}
            icon="play-circle"
            style={styles.videoButton}
          >
            Watch: Lachlan Giles - Inside Position (2:15)
          </Button>
        </Card>

        {/* Next Week Goal */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Next Week's Test
          </Text>
          <View style={styles.goalItem}>
            <Text variant="headlineMedium" style={styles.checkbox}>
              ☐
            </Text>
            <Text variant="bodyLarge" style={styles.goalText}>
              Get inside elbow connection in 5/5 sparring starts
            </Text>
          </View>
          <View style={styles.goalItem}>
            <Text variant="headlineMedium" style={styles.checkbox}>
              ☐
            </Text>
            <Text variant="bodyLarge" style={styles.goalText}>
              Report back: Did this fix help?
            </Text>
          </View>
        </Card>

        {/* Feedback */}
        <Card>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Was this fix helpful?
          </Text>
          <View style={styles.feedbackButtons}>
            <Button
              mode="outlined"
              onPress={() => handleFeedback(true)}
              icon="thumb-up"
              style={styles.feedbackButton}
            >
              Yes
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleFeedback(false)}
              icon="thumb-down"
              style={styles.feedbackButton}
            >
              Not really
            </Button>
          </View>
        </Card>

        <Button onPress={() => router.back()} style={styles.closeButton}>
          Got it! See you next week
        </Button>

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
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  progressCard: {
    alignItems: 'center',
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  statsComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  statColumn: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statColumnHighlighted: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
  },
  statLabel: {
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  highlighted: {
    color: Colors.primary,
  },
  arrow: {
    color: Colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  improvementBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  improvementText: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  improvementTextNeutral: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  improvementTextDown: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  problemBox: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.lg,
    borderRadius: 12,
  },
  problemText: {
    color: Colors.accent,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  problemCount: {
    color: Colors.textSecondary,
  },
  fixCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  fixTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  fixDescription: {
    color: Colors.text,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  videoButton: {
    marginTop: spacing.md,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.sm,
  },
  checkbox: {
    color: Colors.primary,
    marginRight: spacing.md,
  },
  goalText: {
    flex: 1,
    color: Colors.text,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  feedbackButton: {
    flex: 1,
  },
  closeButton: {
    marginTop: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
