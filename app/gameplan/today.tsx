import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
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

export default function TodayGamePlan() {
  const router = useRouter();
  const { activeMission, trainingLogs, user } = useApp();
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Generating your game plan...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!gamePlan || !activeMission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium" style={styles.emptyText}>
            No active mission
          </Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  const positionName = activeMission.positionFocus.replace('_', ' ');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={() => router.back()}
            icon="arrow-left"
            style={styles.backButton}
          >
            Back
          </Button>
          <Text variant="headlineLarge" style={styles.title}>
            Today's Game Plan
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {positionName.charAt(0).toUpperCase() + positionName.slice(1)} • Week {gamePlan.weekNumber}
          </Text>
        </View>

        {/* Mental Cue - Big and Bold */}
        <Card style={styles.mentalCueCard}>
          <Text variant="labelSmall" style={styles.sectionLabel}>
            MENTAL CUE
          </Text>
          <Text variant="displaySmall" style={styles.mentalCue}>
            "{gamePlan.mentalCue}"
          </Text>
        </Card>

        {/* Objectives */}
        <Card>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Today's Objectives
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Focus on these 3 specific goals during training
          </Text>
          
          {gamePlan.objectives.map((objective, index) => (
            <View
              key={objective.id}
              style={[
                styles.objectiveItem,
                index === 0 && styles.primaryObjective,
              ]}
            >
              <View style={styles.objectiveHeader}>
                <View style={styles.objectiveNumber}>
                  <Text variant="titleMedium" style={styles.objectiveNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.objectiveContent}>
                  <Text variant="bodyLarge" style={styles.objectiveText}>
                    {objective.description}
                  </Text>
                  <Text variant="bodySmall" style={styles.objectiveTarget}>
                    Target: {objective.targetReps} successful reps
                  </Text>
                  {index === 0 && (
                    <View style={styles.primaryBadge}>
                      <Text variant="bodySmall" style={styles.primaryBadgeText}>
                        PRIMARY FOCUS
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Recommended Drills */}
        <Card>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Recommended Drills
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Warm up with these drills before rolling
          </Text>

          {gamePlan.drillRecommendations.map((drill, index) => (
            <View key={drill.id} style={styles.drillItem}>
              <View style={styles.drillHeader}>
                <Text variant="titleMedium" style={styles.drillName}>
                  {drill.name}
                </Text>
                <View style={styles.drillMeta}>
                  <Text variant="bodySmall" style={styles.drillMetaText}>
                    {Math.floor(drill.duration / 60)} min
                  </Text>
                  <Text variant="bodySmall" style={styles.drillMetaText}>
                    •
                  </Text>
                  <Text variant="bodySmall" style={styles.drillMetaText}>
                    {drill.partnerRequired ? '👥 Partner' : '🧘 Solo'}
                  </Text>
                </View>
              </View>

              <Text variant="bodyMedium" style={styles.drillInstructions}>
                Focus Points:
              </Text>
              {drill.focusPoints.map((point, idx) => (
                <Text key={idx} variant="bodySmall" style={styles.focusPoint}>
                  • {point}
                </Text>
              ))}

              {drill.videoClipUrl && (
                <Button
                  mode="outlined"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/gameplan/drill/${drill.id}` as const);
                  }}
                  icon="play-circle"
                  style={styles.drillButton}
                >
                  View Drill Details
                </Button>
              )}
            </View>
          ))}
        </Card>

        {/* Rolling Strategy */}
        <Card>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Rolling Strategy
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            How to practice during live rolling
          </Text>

          <View style={styles.strategySection}>
            <Text variant="labelSmall" style={styles.strategyLabel}>
              STARTING POSITION
            </Text>
            <Text variant="bodyLarge" style={styles.strategyText}>
              {gamePlan.rollingStrategy.startingPosition}
            </Text>
          </View>

          <View style={styles.strategySection}>
            <Text variant="labelSmall" style={styles.strategyLabel}>
              GOAL
            </Text>
            <Text variant="bodyLarge" style={styles.strategyText}>
              {gamePlan.rollingStrategy.goalReps} escape attempts this session
            </Text>
          </View>

          <View style={styles.strategySection}>
            <Text variant="labelSmall" style={styles.strategyLabel}>
              HOW TO ASK
            </Text>
            <View style={styles.askBox}>
              <Text variant="bodyMedium" style={styles.askText}>
                "Can we start with you in {gamePlan.rollingStrategy.startingPosition.toLowerCase()}? I'm working on escapes."
              </Text>
            </View>
          </View>

          <View style={styles.strategySection}>
            <Text variant="labelSmall" style={styles.strategyLabel}>
              TACTICAL NOTES
            </Text>
            {gamePlan.rollingStrategy.tacticalNotes.map((note, index) => (
              <Text key={index} variant="bodyMedium" style={styles.tacticalNote}>
                {index + 1}. {note}
              </Text>
            ))}
          </View>

          {gamePlan.rollingStrategy.betweenRoundsTip && (
            <View style={[styles.strategySection, styles.tipBox]}>
              <Text variant="labelSmall" style={styles.strategyLabel}>
                💡 BETWEEN ROUNDS
              </Text>
              <Text variant="bodyMedium" style={styles.tipText}>
                {gamePlan.rollingStrategy.betweenRoundsTip}
              </Text>
            </View>
          )}
        </Card>

        {/* Fallback Plan */}
        <Card style={styles.fallbackCard}>
          <Text variant="titleMedium" style={styles.fallbackTitle}>
            If Things Aren't Working...
          </Text>
          <Text variant="bodyMedium" style={styles.fallbackText}>
            {gamePlan.fallbackPlan}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push('/training/pre-session');
            }}
            icon="target"
            style={styles.actionButton}
          >
            Start Training
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
    padding: spacing.md,
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
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  mentalCueCard: {
    padding: spacing.xl,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
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
  cardTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  cardDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.lg,
  },
  objectiveItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  primaryObjective: {
    backgroundColor: Colors.primaryContainer,
    padding: spacing.md,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  objectiveHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  objectiveNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  objectiveNumberText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  objectiveContent: {
    flex: 1,
  },
  objectiveText: {
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  objectiveTarget: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  primaryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  primaryBadgeText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 10,
  },
  drillItem: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drillHeader: {
    marginBottom: spacing.md,
  },
  drillName: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  drillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  drillMetaText: {
    color: Colors.textSecondary,
  },
  drillInstructions: {
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  focusPoint: {
    color: Colors.textSecondary,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
  drillButton: {
    marginTop: spacing.md,
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
  strategyText: {
    color: Colors.text,
    fontWeight: '500',
  },
  askBox: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  askText: {
    color: Colors.text,
    fontStyle: 'italic',
  },
  tacticalNote: {
    color: Colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: Colors.primaryContainer,
    padding: spacing.md,
    borderRadius: 8,
  },
  tipText: {
    color: Colors.text,
    fontStyle: 'italic',
  },
  fallbackCard: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.lg,
  },
  fallbackTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  fallbackText: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
