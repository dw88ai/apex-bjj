import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

interface OnboardingProgressProps {
  totalSteps: number;
  currentStep: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <ProgressDot
          key={index}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
        />
      ))}
    </View>
  );
};

interface ProgressDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

const ProgressDot: React.FC<ProgressDotProps> = ({ isActive, isCompleted }) => {
  const scale = React.useRef(new Animated.Value(isActive ? 1.2 : 1)).current;
  const opacity = React.useRef(new Animated.Value(isActive || isCompleted ? 1 : 0.3)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.2 : 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: isActive || isCompleted ? 1 : 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isActive, isCompleted]);

  const dotColor = isCompleted ? Colors.success : isActive ? Colors.primary : Colors.border;

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: dotColor },
        { transform: [{ scale }], opacity },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
