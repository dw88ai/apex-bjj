import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DilemmaCard, WedgeHUD, ActionButton } from '../../components/battlecards';
import { getSystemById } from '../../data/battlecards/systemsData';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../constants/colors';
import * as Haptics from 'expo-haptics';

export default function BattleCardScreen() {
  const { system: systemId } = useLocalSearchParams<{ system: string }>();
  const router = useRouter();
  const { trackSystemUsage } = useApp();
  
  const [currentSystemId, setCurrentSystemId] = useState(systemId);
  const [system, setSystem] = useState(getSystemById(systemId || ''));
  const [result, setResult] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const newSystem = getSystemById(currentSystemId || '');
    setSystem(newSystem);
    
    if (newSystem && trackSystemUsage) {
      trackSystemUsage(newSystem.id);
    }
  }, [currentSystemId]);

  // Fade in animation when system changes
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [system]);

  if (!system) {
    return (
      <View style={styles.error}>
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={48} 
          color={Colors.error} 
        />
        <Text style={styles.errorText}>System not found</Text>
        <Text style={styles.errorSubtext}>
          The requested system could not be loaded.
        </Text>
      </View>
    );
  }

  const handleDecision = (option: typeof system.dilemma.options[0]) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Show result
    setResult(option.result);

    // Track decision
    if (trackSystemUsage) {
      trackSystemUsage(system.id, option.label);
    }

    // Navigate after delay
    setTimeout(() => {
      if (option.next.startsWith('finish_')) {
        const finishType = option.next.replace('finish_', '');
        router.push(`/battlecards/finish/${finishType}`);
      } else {
        // Fade out, change system, fade in
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentSystemId(option.next);
          setResult(null);
        });
      }
    }, 1500);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResult(null);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: system.title,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <DilemmaCard
              title={system.title}
              goal={system.goal}
              question={system.dilemma.question}
            />

            <View style={styles.wedgeContainer}>
              <WedgeHUD wedges={system.wedges} />
            </View>

            {result ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <MaterialCommunityIcons 
                    name="check-circle" 
                    size={28} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.resultLabel}>EXECUTE</Text>
                </View>
                <Text style={styles.resultText}>{result}</Text>
                <Text style={styles.transitionText}>
                  Transitioning...
                </Text>
              </View>
            ) : (
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsLabel}>
                  OPPONENT'S RESPONSE
                </Text>
                <ActionButton
                  label={system.dilemma.options[0].label}
                  onPress={() => handleDecision(system.dilemma.options[0])}
                  variant="primary"
                />
                <ActionButton
                  label={system.dilemma.options[1].label}
                  onPress={() => handleDecision(system.dilemma.options[1])}
                  variant="secondary"
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  wedgeContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: Colors.success,
    padding: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  transitionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    fontStyle: 'italic',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.error,
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
