import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { Mission } from '../../types';

interface MissionProgressCardProps {
  mission: Mission;
  currentWeek: number;
  escapeRate: number;
  trend?: number;
}

export const MissionProgressCard: React.FC<MissionProgressCardProps> = ({
  mission,
  currentWeek,
  escapeRate,
  trend,
}) => {
  const daysRemaining = Math.ceil(
    (new Date(mission.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const positionName = mission.positionFocus.replace('_', ' ');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="titleLarge" style={styles.title}>
            {positionName.charAt(0).toUpperCase() + positionName.slice(1)} Escapes
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Week {currentWeek} of 4 • {daysRemaining} days left
          </Text>
        </View>
        <ProgressRing progress={escapeRate} size={80} strokeWidth={8} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {escapeRate}%
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Escape Rate
          </Text>
        </View>
        {trend !== undefined && (
          <View style={styles.stat}>
            <Text
              variant="headlineSmall"
              style={[
                styles.statValue,
                { color: trend > 0 ? Colors.success : trend < 0 ? Colors.error : Colors.text },
              ]}
            >
              {trend > 0 ? '+' : ''}
              {trend}%
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              vs Last Week
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
});
