import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export default function MissionComplete() {
  const router = useRouter();
  const { activeMission, trainingLogs } = useApp();
  const [stats, setStats] = useState({
    startingRate: 0,
    finalRate: 0,
    improvement: 0,
    totalSessions: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (activeMission) {
      calculateMissionStats();
    }
  }, [activeMission, trainingLogs]);

  const calculateMissionStats = () => {
    const missionLogs = trainingLogs
      .filter(log => log.missionId === activeMission?.id)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

    if (missionLogs.length === 0) return;

    const startingRate = Math.round(missionLogs[0].escapeRate * 100);
    const finalRate = Math.round(missionLogs[missionLogs.length - 1].escapeRate * 100);
    const improvement = finalRate - startingRate;

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < missionLogs.length; i++) {
      const prevDate = new Date(missionLogs[i - 1].sessionDate);
      const currDate = new Date(missionLogs[i].sessionDate);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 2) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    setStats({
      startingRate,
      finalRate,
      improvement,
      totalSessions: missionLogs.length,
      longestStreak,
    });
  };

  const startNewMission = (type: 'defense' | 'a-game') => {
    // In real app, would navigate to mission setup
    router.replace('/(tabs)');
  };

  if (!activeMission) {
    router.back();
    return null;
  }

  const positionName = activeMission.positionFocus.replace('_', ' ');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button 
          mode="text" 
          onPress={() => router.replace('/(tabs)')} 
          icon="arrow-left"
          style={styles.backButton}
        >
          Back to Home
        </Button>
        {/* Celebration Header */}
        <View style={styles.header}>
          <Text variant="displayLarge" style={styles.trophy}>
            🏆
          </Text>
          <Text variant="displaySmall" style={styles.title}>
            Mission Complete! 🎉
          </Text>
          <Text variant="headlineSmall" style={styles.subtitle}>
            {positionName.charAt(0).toUpperCase() + positionName.slice(1)} Escapes
          </Text>
        </View>

        {/* Results */}
        <Card style={styles.resultsCard}>
          <View style={styles.resultItem}>
            <Text variant="bodyMedium" style={styles.resultLabel}>
              Starting Escape Rate:
            </Text>
            <Text variant="headlineLarge" style={styles.resultValue}>
              {stats.startingRate}%
            </Text>
          </View>
          <Text variant="displayMedium" style={styles.arrow}>
            ↓
          </Text>
          <View style={[styles.resultItem, styles.resultItemHighlighted]}>
            <Text variant="bodyMedium" style={styles.resultLabel}>
              Final Escape Rate:
            </Text>
            <Text variant="displayLarge" style={[styles.resultValue, styles.highlighted]}>
              {stats.finalRate}%
            </Text>
          </View>
          {stats.improvement > 0 && (
            <View style={styles.improvementBadge}>
              <Text variant="headlineMedium" style={styles.improvementText}>
                +{stats.improvement}% improvement!
              </Text>
            </View>
          )}
        </Card>

        {/* Milestones */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Milestones Achieved
          </Text>
          <View style={styles.milestone}>
            <Text variant="headlineMedium" style={styles.milestoneIcon}>
              ✓
            </Text>
            <Text variant="bodyLarge" style={styles.milestoneText}>
              Logged {stats.totalSessions} sessions
            </Text>
          </View>
          {stats.longestStreak >= 3 && (
            <View style={styles.milestone}>
              <Text variant="headlineMedium" style={styles.milestoneIcon}>
                ✓
              </Text>
              <Text variant="bodyLarge" style={styles.milestoneText}>
                {stats.longestStreak}-session consistency streak
              </Text>
            </View>
          )}
          {stats.finalRate >= 50 && (
            <View style={styles.milestone}>
              <Text variant="headlineMedium" style={styles.milestoneIcon}>
                ✓
              </Text>
              <Text variant="bodyLarge" style={styles.milestoneText}>
                Hit 50% escape goal
              </Text>
            </View>
          )}
          <View style={styles.milestone}>
            <Text variant="headlineMedium" style={styles.milestoneIcon}>
              ✓
            </Text>
            <Text variant="bodyLarge" style={styles.milestoneText}>
              Completed 4-week mission
            </Text>
          </View>
        </Card>

        {/* Share Button */}
        <Button mode="outlined" onPress={() => {}} icon="share-variant">
          Share Your Progress
        </Button>

        {/* Next Mission */}
        <Card style={styles.nextMissionCard}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Ready for Your Next Mission?
          </Text>

          <View style={styles.missionOptions}>
            <Card style={styles.missionOption}>
              <Text variant="displayMedium" style={styles.missionIcon}>
                🛡️
              </Text>
              <Text variant="titleMedium" style={styles.missionTitle}>
                Continue Defense
              </Text>
              <Text variant="bodyMedium" style={styles.missionDescription}>
                Master mount or back escapes next
              </Text>
              <Button
                mode="outlined"
                onPress={() => startNewMission('defense')}
                style={styles.missionButton}
              >
                Choose Defense
              </Button>
            </Card>

            <Card style={styles.missionOption}>
              <Text variant="displayMedium" style={styles.missionIcon}>
                ⚔️
              </Text>
              <Text variant="titleMedium" style={styles.missionTitle}>
                Build A-Game
              </Text>
              <Text variant="bodyMedium" style={styles.missionDescription}>
                Develop a deadly submission game
              </Text>
              <Button
                mode="outlined"
                onPress={() => startNewMission('a-game')}
                style={styles.missionButton}
              >
                Choose A-Game
              </Button>
            </Card>
          </View>
        </Card>

        <Button mode="text" onPress={() => router.replace('/(tabs)')}>
          I'll decide later
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
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  trophy: {
    fontSize: 120,
    marginBottom: spacing.md,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  resultsCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  resultItem: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  resultItemHighlighted: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.lg,
    borderRadius: 12,
  },
  resultLabel: {
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultValue: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  highlighted: {
    color: Colors.primary,
  },
  arrow: {
    color: Colors.textSecondary,
    marginVertical: spacing.sm,
  },
  improvementBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 20,
    marginTop: spacing.lg,
  },
  improvementText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  milestoneIcon: {
    color: Colors.success,
    marginRight: spacing.md,
  },
  milestoneText: {
    color: Colors.text,
  },
  nextMissionCard: {
    marginTop: spacing.xl,
  },
  missionOptions: {
    gap: spacing.md,
  },
  missionOption: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  missionIcon: {
    fontSize: 60,
    lineHeight: 66,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  missionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  missionDescription: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  missionButton: {
    width: '100%',
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
