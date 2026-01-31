import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
}

interface FABProps {
  actions: FABAction[];
}

export const FAB: React.FC<FABProps> = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };

  const handleActionPress = (action: FABAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleMenu();
    setTimeout(() => action.onPress(), 300);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      {
        open && (
          <TouchableOpacity
            style={styles.backdrop}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        )
      }

      {/* Action Buttons */}
      {
        open && actions.map((action, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(60 * (actions.length - index))],
          });

          const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.actionButton,
                {
                  transform: [{ translateY }, { scale }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleActionPress(action)}
                style={styles.actionTouchable}
              >
                <View style={styles.actionContent}>
                  <Text variant="labelMedium" style={styles.actionLabel}>
                    {action.label}
                  </Text>
                  <View style={styles.actionIcon}>
                    <IconButton
                      icon={action.icon}
                      iconColor={Colors.text}
                      size={24}
                      onPress={() => handleActionPress(action)}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })
      }

      {/* Main FAB Button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.fab}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <IconButton
            icon="plus"
            iconColor={Colors.text}
            size={28}
            onPress={toggleMenu}
          />
        </Animated.View>
      </TouchableOpacity>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionLabel: {
    color: Colors.text,
    backgroundColor: Colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'transparent',
  },
});
