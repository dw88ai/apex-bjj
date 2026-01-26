import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { FINISH_SCREENS, FinishType } from '../../../types/battlecards';
import * as Haptics from 'expo-haptics';

export default function FinishScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  const finishData = FINISH_SCREENS[type as FinishType] || FINISH_SCREENS.control;

  useEffect(() => {
    // Success haptic on screen load
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.dismissAll();
    router.replace('/(tabs)/systems');
  };

  const handlePracticeAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{finishData.emoji}</Text>
        </View>
        
        <Text style={styles.title}>{finishData.title}</Text>
        <Text style={styles.message}>{finishData.message}</Text>

        <View style={styles.successBadge}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={24} 
            color={Colors.success} 
          />
          <Text style={styles.successText}>Technique Complete</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handlePracticeAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Practice Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: Colors.success,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  successText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
