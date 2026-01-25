import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Button } from '../../components/ui/Button';
import { BeltSelector } from '../../components/ui/BeltSelector';
import { Dropdown } from '../../components/ui/Dropdown';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { TRAINING_FREQUENCIES, PROBLEM_OPTIONS, BeltLevel, TrainingFrequency } from '../../types';
import { useApp } from '../../context/AppContext';

export default function ProfileSetup() {
  const router = useRouter();
  const { setUser } = useApp();
  
  const [beltLevel, setBeltLevel] = useState<BeltLevel>('white');
  const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency>('3x');
  const [problemId, setProblemId] = useState(PROBLEM_OPTIONS[0].id);

  const handleNext = async () => {
    // Create user
    const user = {
      id: 'user-1', // In real app, this would be generated
      beltLevel,
      trainingFrequency,
      createdAt: new Date(),
    };
    
    await setUser(user);
    
    // Pass selected problem to mission preview
    router.push({
      pathname: '/(auth)/mission-preview',
      params: { problemId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress totalSteps={5} currentStep={3} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text variant="displaySmall" style={styles.title}>
            Profile Setup
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Help us personalize your training plan
          </Text>
        </View>

        <View style={styles.form}>
          <BeltSelector
            value={beltLevel}
            onChange={(value) => {
              setBeltLevel(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />

          <Dropdown
            label="Training Frequency"
            value={trainingFrequency}
            options={TRAINING_FREQUENCIES}
            onChange={(value) => setTrainingFrequency(value as TrainingFrequency)}
          />

          <ProblemPositionSelector
            value={problemId}
            onChange={setProblemId}
          />
        </View>

        <View style={styles.footer}>
          <Button mode="text" onPress={() => router.back()} icon="arrow-left">
            Back
          </Button>
          <Button onPress={handleNext}>
            Generate My Mission
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ProblemPositionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ProblemPositionSelector: React.FC<ProblemPositionSelectorProps> = ({ value, onChange }) => {
  return (
    <View style={styles.problemSelector}>
      <Text variant="labelLarge" style={styles.problemLabel}>
        Biggest Problem Position
      </Text>
      <View style={styles.problemGrid}>
        {PROBLEM_OPTIONS.map((problem) => (
          <TouchableOpacity
            key={problem.id}
            style={[
              styles.problemCard,
              value === problem.id && styles.problemCardSelected,
            ]}
            onPress={() => {
              onChange(problem.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.problemEmoji}>{problem.emoji}</Text>
            <Text
              variant="labelMedium"
              style={[
                styles.problemText,
                value === problem.id && styles.problemTextSelected,
              ]}
            >
              {problem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    marginVertical: spacing.lg,
  },
  problemSelector: {
    marginTop: spacing.lg,
  },
  problemLabel: {
    color: Colors.text,
    marginBottom: spacing.md,
  },
  problemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  problemCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  problemCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  problemEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  problemText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  problemTextSelected: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
