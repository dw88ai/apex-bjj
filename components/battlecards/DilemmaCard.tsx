import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/colors';

interface DilemmaCardProps {
  title: string;
  goal: string;
  question: string;
}

/**
 * DilemmaCard displays the current position name, goal, and decision question
 * High contrast design for quick reference during training
 */
export function DilemmaCard({ title, goal, question }: DilemmaCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.goal}>{goal}</Text>
      <View style={styles.divider} />
      <Text style={styles.questionLabel}>DECISION POINT</Text>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  goal: {
    fontSize: 18,
    color: Colors.accent,
    marginBottom: 16,
    lineHeight: 24,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  question: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 30,
  },
});
