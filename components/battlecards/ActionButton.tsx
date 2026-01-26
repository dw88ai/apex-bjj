import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/colors';
import * as Haptics from 'expo-haptics';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

/**
 * ActionButton - Large, high-contrast button for decision making
 * Full-width design for one-tap access during training
 */
export function ActionButton({ 
  label, 
  onPress, 
  variant = 'primary',
  disabled = false 
}: ActionButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[
        styles.label,
        disabled && styles.disabledLabel,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFA500',
    minHeight: 80,
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  disabledButton: {
    backgroundColor: Colors.surfaceVariant,
    borderColor: Colors.border,
    opacity: 0.6,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  disabledLabel: {
    color: Colors.textSecondary,
  },
});
