import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { BeltLevel } from '../../types';

interface BeltSelectorProps {
  value: BeltLevel;
  onChange: (value: BeltLevel) => void;
}

const BELT_OPTIONS: Array<{ value: BeltLevel; label: string; color: string }> = [
  { value: 'white', label: 'White Belt', color: '#F5F5F5' },
  { value: 'blue', label: 'Blue Belt', color: '#4A90E2' },
  { value: 'purple', label: 'Purple Belt', color: '#9B59B6' },
  { value: 'brown', label: 'Brown Belt', color: '#8B4513' },
  { value: 'black', label: 'Black Belt', color: '#2C3E50' },
];

export const BeltSelector: React.FC<BeltSelectorProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>
        Belt Level
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BELT_OPTIONS.map((belt) => (
          <BeltOption
            key={belt.value}
            belt={belt}
            isSelected={value === belt.value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(belt.value);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface BeltOptionProps {
  belt: { value: BeltLevel; label: string; color: string };
  isSelected: boolean;
  onPress: () => void;
}

const BeltOption: React.FC<BeltOptionProps> = ({ belt, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.beltCard,
        isSelected && styles.beltCardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.beltIcon, { backgroundColor: belt.color }]}>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
      <Text
        variant="labelMedium"
        style={[styles.beltLabel, isSelected && styles.beltLabelSelected]}
      >
        {belt.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  beltCard: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 110,
    minHeight: 100, // Touch target
    justifyContent: 'center',
  },
  beltCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  beltIcon: {
    width: 80, // Larger belt
    height: 24,
    borderRadius: 4,
    marginBottom: spacing.md,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkmark: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  beltLabel: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  beltLabelSelected: {
    color: Colors.text,
    fontWeight: 'bold',
  },
});
