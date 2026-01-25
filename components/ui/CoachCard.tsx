import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

interface CoachCardProps {
  name: string;
  credentials: string;
  specialty: string;
  emoji: string;
  delay?: number;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  name,
  credentials,
  specialty,
  emoji,
  delay = 0,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.name}>
          {name}
        </Text>
        <Text variant="bodySmall" style={styles.credentials}>
          {credentials}
        </Text>
        <View style={styles.specialtyBadge}>
          <Text variant="labelSmall" style={styles.specialtyText}>
            {specialty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  credentials: {
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialtyText: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
});
