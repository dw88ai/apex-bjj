import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from './Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendValue }) => {
  const getTrendColor = () => {
    if (trend === 'up') return Colors.success;
    if (trend === 'down') return Colors.error;
    return Colors.textSecondary;
  };

  return (
    <Card style={styles.container}>
      <Text variant="bodySmall" style={styles.label}>
        {label}
      </Text>
      <Text variant="headlineMedium" style={styles.value}>
        {value}
      </Text>
      {trendValue && (
        <Text variant="bodySmall" style={[styles.trend, { color: getTrendColor() }]}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
  },
  label: {
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  trend: {
    marginTop: spacing.xs,
  },
});
