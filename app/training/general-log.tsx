import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { TrainingLog, GeneralTrainingType } from '../../types';
import * as Haptics from 'expo-haptics';

const TRAINING_TYPES: { value: GeneralTrainingType; label: string; emoji: string }[] = [
  { value: 'rolling', label: 'Rolling', emoji: '🥋' },
  { value: 'drilling', label: 'Drilling', emoji: '🔄' },
  { value: 'technique', label: 'Technique', emoji: '📚' },
  { value: 'open_mat', label: 'Open Mat', emoji: '🏟️' },
];

const QUICK_VALUES = ['0', '1-2', '3-4', '5-6', '7-8', '9+'];

export default function GeneralLog() {
  const router = useRouter();
  const { user, addTrainingLog } = useApp();
  
  const [trainingType, setTrainingType] = useState<GeneralTrainingType>('rolling');
  const [escapes, setEscapes] = useState('1-2');
  const [attempts, setAttempts] = useState('3-4');
  const [mainProblem, setMainProblem] = useState('');
  const [trainingNotes, setTrainingNotes] = useState('');
  const [intensityLevel, setIntensityLevel] = useState(7);
  const [isSaving, setIsSaving] = useState(false);

  const parseQuickValue = (value: string): number => {
    if (value.includes('+')) return parseInt(value) + 2;
    if (value.includes('-')) {
      const parts = value.split('-');
      return Math.floor((parseInt(parts[0]) + parseInt(parts[1])) / 2);
    }
    return parseInt(value) || 0;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please complete onboarding first.');
      return;
    }

    const escapesNum = parseQuickValue(escapes);
    const attemptsNum = parseQuickValue(attempts);

    // Validation
    if (attemptsNum === 0) {
      Alert.alert('Validation Error', 'Please select at least 1 escape attempt');
      return;
    }

    if (escapesNum > attemptsNum) {
      Alert.alert('Validation Error', 'Successful escapes cannot be more than attempts');
      return;
    }

    setIsSaving(true);
    try {
      const log: TrainingLog = {
        id: `log-${Date.now()}`,
        userId: user.id,
        // No missionId for general training
        sessionDate: new Date(),
        escapeAttempts: attemptsNum,
        successfulEscapes: escapesNum,
        escapeRate: attemptsNum > 0 ? escapesNum / attemptsNum : 0,
        mainProblem: mainProblem || undefined,
        trainingNotes: trainingNotes || undefined,
        intensityLevel,
        generalTrainingType: trainingType,
        createdAt: new Date(),
      };

      await addTrainingLog(log);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Training log saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving general log:', error);
      Alert.alert('Error', 'Failed to save training log. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button 
          mode="text" 
          onPress={() => router.back()} 
          icon="arrow-left"
          style={styles.backButton}
        >
          Cancel
        </Button>

        <Text variant="headlineLarge" style={styles.title}>
          Log General Training
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track training sessions without a specific mission
        </Text>

        <Card style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Training Type
          </Text>
          <View style={styles.typeGrid}>
            {TRAINING_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeCard,
                  trainingType === type.value && styles.typeCardSelected,
                ]}
                onPress={() => {
                  setTrainingType(type.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    trainingType === type.value && styles.typeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Performance
          </Text>

          <Text variant="bodyMedium" style={styles.questionText}>
            How many times did you escape?
          </Text>
          <View style={styles.optionGroup}>
            {QUICK_VALUES.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  escapes === option && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  setEscapes(option);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    escapes === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text variant="bodyMedium" style={styles.questionText}>
            How many times did you attempt?
          </Text>
          <View style={styles.optionGroup}>
            {QUICK_VALUES.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  attempts === option && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  setAttempts(option);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    attempts === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text variant="bodyMedium" style={styles.questionText}>
            Intensity Level (1-10)
          </Text>
          <View style={styles.intensityRow}>
            {Array.from({ length: 10 }).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.intensityDot,
                  i < intensityLevel && styles.intensityDotFilled,
                ]}
                onPress={() => {
                  setIntensityLevel(i + 1);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
            ))}
            <Text variant="bodyLarge" style={styles.intensityText}>
              {intensityLevel}/10
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notes
          </Text>

          <Text variant="bodyMedium" style={styles.inputLabel}>
            Main problem or focus area?
          </Text>
          <TextInput
            value={mainProblem}
            onChangeText={setMainProblem}
            placeholder="e.g., Lost inside elbow position"
            style={styles.input}
            mode="outlined"
          />

          <Text variant="bodyMedium" style={styles.inputLabel}>
            Additional notes (optional)
          </Text>
          <TextInput
            value={trainingNotes}
            onChangeText={setTrainingNotes}
            placeholder="What did you work on? How did it go?"
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />
        </Card>

        <View style={styles.footer}>
          <Button 
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            Save Training Log
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  typeCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  typeEmoji: {
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  typeLabel: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typeLabelSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  questionText: {
    color: Colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  intensityDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surfaceVariant,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intensityDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  intensityText: {
    color: Colors.text,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: Colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
