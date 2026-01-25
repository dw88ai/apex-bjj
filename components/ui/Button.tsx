import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  onPress: () => void;
  children: string;
  mode?: 'contained' | 'outlined' | 'text';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  mode = 'contained',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <PaperButton
      mode={mode}
      onPress={handlePress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      style={[styles.button, style]}
      labelStyle={styles.label}
      buttonColor={mode === 'contained' ? Colors.primary : undefined}
      textColor={mode === 'contained' ? Colors.text : Colors.primary}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: spacing.sm,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
