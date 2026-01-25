import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { Mission, PROBLEM_OPTIONS } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateMissionGoals } from '../../utils/mockData';

export default function MissionPreview() {
  const router = useRouter();
  const { problemId } = useLocalSearchParams();
  const { user, setActiveMission, completeOnboarding } = useApp();
  const [mission, setMission] = useState<Mission | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI generating mission
    setIsGenerating(true);
    
    const generateMission = async () => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const problem = PROBLEM_OPTIONS.find(p => p.id === problemId) || PROBLEM_OPTIONS[0];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 28);

      const newMission: Mission = {
        id: 'mission-1',
        userId: user?.id || 'user-1',
        missionType: 'defense',
        positionFocus: problem.position,
        goalDescription: `Escape ${problem.position.replace('_', ' ')} 50% of the time`,
        startDate,
        endDate,
        status: 'active',
        createdAt: new Date(),
        weeklyGoals: generateMissionGoals(problem.position),
      };

      setMission(newMission);
      setIsGenerating(false);
    };

    generateMission();
  }, [problemId, user]);

  const handleStart = async () => {
    if (mission) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setActiveMission(mission);
      await completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const positionName = mission?.positionFocus.replace('_', ' ');

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <OnboardingProgress totalSteps={5} currentStep={4} />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text variant="headlineSmall" style={styles.loadingTitle}>
              Creating Your Mission
            </Text>
            <Text variant="bodyMedium" style={styles.loadingText}>
              Analyzing your profile and generating a personalized 4-week plan...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!mission) return null;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress totalSteps={5} currentStep={4} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.emoji}>
            🎯
          </Text>
          <Text variant="displaySmall" style={styles.title}>
            Your 4-Week Mission
          </Text>
          <Text variant="headlineSmall" style={styles.goal}>
            Escape {positionName} 50% of the time
          </Text>
          <Text variant="bodyMedium" style={styles.dates}>
            {mission.startDate.toLocaleDateString()} - {mission.endDate.toLocaleDateString()}
          </Text>
        </View>

        <View>
          <Card style={styles.weeklyBreakdown}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Weekly Breakdown
            </Text>
            {mission.weeklyGoals?.map((goal, index) => (
              <View 
                key={goal.weekNumber} 
                style={styles.weekItem}
              >
                <View style={styles.weekBadge}>
                  <Text variant="labelLarge" style={styles.weekNumber}>
                    W{goal.weekNumber}
                  </Text>
                </View>
                <View style={styles.weekContent}>
                  <Text variant="bodyMedium" style={styles.weekGoal}>
                    {goal.description}
                  </Text>
                  {index < 3 && <View style={styles.progressLine} />}
                </View>
              </View>
            ))}
          </Card>
        </View>

        <View>
          <Card style={styles.explanation}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              How it works:
            </Text>
            <View style={styles.step}>
              <Text variant="bodyMedium" style={styles.stepBullet}>
                •
              </Text>
              <Text variant="bodyMedium" style={styles.stepText}>
                <Text style={styles.bold}>Before training:</Text> Set your focus (10 sec)
              </Text>
            </View>
            <View style={styles.step}>
              <Text variant="bodyMedium" style={styles.stepBullet}>
                •
              </Text>
              <Text variant="bodyMedium" style={styles.stepText}>
                <Text style={styles.bold}>After training:</Text> Voice log what happened (60 sec)
              </Text>
            </View>
            <View style={styles.step}>
              <Text variant="bodyMedium" style={styles.stepBullet}>
                •
              </Text>
              <Text variant="bodyMedium" style={styles.stepText}>
                <Text style={styles.bold}>Every Sunday:</Text> Get personalized fix for your #1 mistake
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.footer}>
          <Button mode="text" onPress={() => router.back()} icon="arrow-left">
            Back
          </Button>
          <Button onPress={handleStart}>
            Start Mission 🚀
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 60,
    lineHeight: 66,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  goal: {
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  dates: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  weeklyBreakdown: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  weekBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    zIndex: 1,
  },
  weekNumber: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  weekContent: {
    flex: 1,
    position: 'relative',
  },
  weekGoal: {
    color: Colors.text,
    marginBottom: spacing.md,
  },
  progressLine: {
    position: 'absolute',
    left: -32,
    top: 40,
    width: 2,
    height: 40,
    backgroundColor: Colors.border,
  },
  explanation: {
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  stepBullet: {
    color: Colors.primary,
    marginRight: spacing.sm,
    fontSize: 20,
  },
  stepText: {
    flex: 1,
    color: Colors.text,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xl,
  },
});
