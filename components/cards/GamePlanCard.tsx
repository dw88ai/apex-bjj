import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from '../ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { SessionGamePlan } from '../../types';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface GamePlanCardProps {
  gamePlan: SessionGamePlan;
}

export const GamePlanCard: React.FC<GamePlanCardProps> = ({ gamePlan }) => {
  const router = useRouter();
  
  const primaryObjective = gamePlan.objectives.find(obj => obj.priority === 'primary');
  const topDrill = gamePlan.drillRecommendations[0];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/gameplan/today');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎯</Text>
          </View>
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.title}>
              Today's Game Plan
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Week {gamePlan.weekNumber} Focus
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>

        <View style={styles.divider} />

        {/* Primary Objective */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionLabel}>
            PRIMARY OBJECTIVE
          </Text>
          <Text variant="bodyLarge" style={styles.objectiveText}>
            {primaryObjective?.description || 'Focus on technique fundamentals'}
          </Text>
          <Text variant="bodySmall" style={styles.targetText}>
            Target: {primaryObjective?.targetReps || 3} successful reps
          </Text>
        </View>

        {/* Mental Cue */}
        <View style={styles.mentalCueContainer}>
          <Text variant="titleMedium" style={styles.mentalCue}>
            "{gamePlan.mentalCue}"
          </Text>
        </View>

        {/* Quick Drill Suggestion */}
        {topDrill && (
          <View style={styles.drillSection}>
            <Text variant="labelSmall" style={styles.sectionLabel}>
              RECOMMENDED DRILL
            </Text>
            <View style={styles.drillInfo}>
              <Text variant="bodyMedium" style={styles.drillName}>
                {topDrill.name}
              </Text>
              <View style={styles.drillMeta}>
                <Text variant="bodySmall" style={styles.drillMetaText}>
                  {Math.floor(topDrill.duration / 60)} min
                </Text>
                <Text variant="bodySmall" style={styles.drillMetaText}>
                  •
                </Text>
                <Text variant="bodySmall" style={styles.drillMetaText}>
                  {topDrill.partnerRequired ? 'Partner' : 'Solo'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* View Full Plan Button */}
        <View style={styles.footer}>
          <Text variant="bodyMedium" style={styles.viewFullText}>
            View Full Plan & Strategy
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    fontSize: 24,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  objectiveText: {
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  targetText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  mentalCueContainer: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  mentalCue: {
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  drillSection: {
    marginTop: spacing.md,
  },
  drillInfo: {
    marginTop: spacing.xs,
  },
  drillName: {
    color: Colors.text,
    fontWeight: '500',
  },
  drillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  drillMetaText: {
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  viewFullText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
