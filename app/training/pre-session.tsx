import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { SessionGamePlan } from '../../types';
import { getTodaysGamePlan } from '../../utils/gamePlanGenerator';
import * as Haptics from 'expo-haptics';

export default function PreSession() {
  const router = useRouter();
  const { activeMission, trainingLogs, user } = useApp();
  const [constraint, setConstraint] = useState<string | null>(null);
  const [gamePlan, setGamePlan] = useState<SessionGamePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGamePlan();
  }, [activeMission]);

  const loadGamePlan = async () => {
    if (!activeMission || !user) {
      setLoading(false);
      return;
    }

    try {
      const recentLogs = trainingLogs
        .filter(log => log.missionId === activeMission.id)
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
        .slice(0, 5);

      const plan = await getTodaysGamePlan(activeMission, recentLogs, user.beltLevel);
      setGamePlan(plan);
    } catch (error) {
      console.error('Error loading game plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!activeMission) {
    router.back();
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Preparing your game plan...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const positionName = activeMission.positionFocus.replace('_', ' ');

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
          Ready to Train?
        </Text>

        {/* Mental Cue */}
        {gamePlan && (
          <Card style={styles.mentalCueCard}>
            <Text variant="labelSmall" style={styles.mentalCueLabel}>
              REMEMBER
            </Text>
            <Text variant="headlineMedium" style={styles.mentalCue}>
              "{gamePlan.mentalCue}"
            </Text>
          </Card>
        )}

        {/* Today's Primary Objective */}
        {gamePlan && (
          <Card>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Primary Objective
            </Text>
            <Text variant="bodyLarge" style={styles.objectiveText}>
              {gamePlan.objectives[0]?.description}
            </Text>
            <Text variant="bodySmall" style={styles.objectiveTarget}>
              Target: {gamePlan.objectives[0]?.targetReps} successful reps
            </Text>
            <Button
              mode="outlined"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/gameplan/today');
              }}
              icon="target"
              style={styles.viewFullButton}
            >
              View Full Game Plan
            </Button>
          </Card>
        )}

        {/* Rolling Strategy */}
        {gamePlan && (
          <Card>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Rolling Strategy
            </Text>
            
            <View style={styles.strategySection}>
              <Text variant="labelSmall" style={styles.strategyLabel}>
                STARTING POSITION
              </Text>
              <Text variant="bodyLarge" style={styles.strategyValue}>
                {gamePlan.rollingStrategy.startingPosition}
              </Text>
            </View>

            <View style={styles.strategySection}>
              <Text variant="labelSmall" style={styles.strategyLabel}>
                GOAL FOR TODAY
              </Text>
              <Text variant="bodyLarge" style={styles.strategyValue}>
                {gamePlan.rollingStrategy.goalReps} escape attempts
              </Text>
            </View>

            <View style={styles.askBox}>
              <Text variant="labelSmall" style={styles.askLabel}>
                HOW TO ASK
              </Text>
              <Text variant="bodyMedium" style={styles.askText}>
                "Can we start with you in {gamePlan.rollingStrategy.startingPosition.toLowerCase()}? I'm working on escapes."
              </Text>
            </View>

            <View style={styles.tacticalNotes}>
              <Text variant="labelSmall" style={styles.strategyLabel}>
                TACTICAL NOTES
              </Text>
              {gamePlan.rollingStrategy.tacticalNotes.slice(0, 3).map((note, index) => (
                <Text key={index} variant="bodyMedium" style={styles.tacticalNote}>
                  • {note}
                </Text>
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.footer}>
          <Button
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            }}
            icon="check"
          >
            Got it! I'm ready to train
          </Button>
          <Button mode="text" onPress={() => router.back()}>
            Skip for now
          </Button>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  mentalCueCard: {
    backgroundColor: Colors.primaryContainer,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mentalCueLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  mentalCue: {
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  objectiveText: {
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  objectiveTarget: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  viewFullButton: {
    marginTop: spacing.sm,
  },
  strategySection: {
    marginBottom: spacing.lg,
  },
  strategyLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  strategyValue: {
    color: Colors.text,
    fontWeight: '500',
  },
  askBox: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: spacing.lg,
  },
  askLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  askText: {
    color: Colors.text,
    fontStyle: 'italic',
  },
  tacticalNotes: {
    marginTop: spacing.md,
  },
  tacticalNote: {
    color: Colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.xl,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
