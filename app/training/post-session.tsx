import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal as RNModal, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, ActivityIndicator, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { mockTranscribe, mockParseTranscript } from '../../utils/mockData';
import { TrainingLog, SessionGamePlan, ObjectiveAchievement } from '../../types';
import { getTodaysGamePlan } from '../../utils/gamePlanGenerator';
import * as Haptics from 'expo-haptics';

export default function PostSession() {
  const router = useRouter();
  const { activeMission, user, addTrainingLog, trainingLogs } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState<{
    escapeAttempts: number;
    successfulEscapes: number;
    mainProblem: string;
    trainingNotes: string;
    intensityLevel: number;
  } | null>(null);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);

  // Quick log state
  const [quickEscapes, setQuickEscapes] = useState('1-2');
  const [quickAttempts, setQuickAttempts] = useState('3-5');
  const [quickProblem, setQuickProblem] = useState('');
  const [quickNotes, setQuickNotes] = useState('');

  // Game plan and objectives tracking
  const [gamePlan, setGamePlan] = useState<SessionGamePlan | null>(null);
  const [objectiveAchievements, setObjectiveAchievements] = useState<Record<string, 'yes' | 'partial' | 'no'>>({});
  const [showObjectivesReview, setShowObjectivesReview] = useState(false);

  const { initialMode } = useLocalSearchParams();

  // Load game plan on mount and check params
  React.useEffect(() => {
    if (initialMode === 'quick') {
      setShowQuickLog(true);
    }
    loadGamePlan();
  }, [activeMission, initialMode]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef) {
        clearInterval(timerRef);
      }
    };
  }, [timerRef]);

  const loadGamePlan = async () => {
    if (!activeMission || !user) return;

    try {
      const recentLogs = trainingLogs
        .filter(log => log.missionId === activeMission.id)
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
        .slice(0, 5);

      const plan = await getTodaysGamePlan(activeMission, recentLogs, user.beltLevel);
      setGamePlan(plan);

      // Initialize objectives achievements
      const initialAchievements: Record<string, 'yes' | 'partial' | 'no'> = {};
      plan.objectives.forEach(obj => {
        initialAchievements[obj.id] = 'no';
      });
      setObjectiveAchievements(initialAchievements);
    } catch (error) {
      console.error('Error loading game plan:', error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);

      // Simulate timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
      setTimerRef(timer);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    // Clear timer
    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
    }

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      await processRecording(uri);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const processRecording = async (uri: string) => {
    setIsProcessing(true);
    try {
      // Mock transcription and parsing
      const transcriptText = await mockTranscribe(uri);
      setTranscript(transcriptText);

      const parsed = await mockParseTranscript(transcriptText);
      setParsedData(parsed);
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveLog = async () => {
    if (!parsedData || !activeMission || !user) return;

    // Validation
    const attempts = Math.max(0, Math.min(100, parsedData.escapeAttempts || 0));
    const escapes = Math.max(0, Math.min(attempts, parsedData.successfulEscapes || 0));

    if (attempts === 0) {
      alert('Please enter at least 1 escape attempt');
      return;
    }

    // Show objectives review if we have a game plan
    if (gamePlan && gamePlan.objectives.length > 0) {
      setShowObjectivesReview(true);
      return;
    }

    // Save without objectives if no game plan
    await saveLogWithObjectives();
  };

  const saveLogWithObjectives = async () => {
    if (!parsedData || !activeMission || !user) return;

    const attempts = Math.max(0, Math.min(100, parsedData.escapeAttempts || 0));
    const escapes = Math.max(0, Math.min(attempts, parsedData.successfulEscapes || 0));

    try {
      // Build objectives achievements array
      const objectivesAchieved: ObjectiveAchievement[] = gamePlan
        ? gamePlan.objectives.map(obj => ({
          objectiveId: obj.id,
          objectiveText: obj.description,
          targetReps: obj.targetReps,
          achieved: objectiveAchievements[obj.id] || 'no',
        }))
        : [];

      const log: TrainingLog = {
        id: `log-${Date.now()}`,
        userId: user.id,
        missionId: activeMission.id,
        sessionDate: new Date(),
        voiceTranscript: transcript,
        escapeAttempts: attempts,
        successfulEscapes: escapes,
        escapeRate: attempts > 0 ? escapes / attempts : 0,
        mainProblem: parsedData.mainProblem || undefined,
        trainingNotes: parsedData.trainingNotes || undefined,
        intensityLevel: Math.max(1, Math.min(10, parsedData.intensityLevel || 7)),
        objectivesAchieved: objectivesAchieved.length > 0 ? objectivesAchieved : undefined,
        gamePlanId: gamePlan?.id,
        createdAt: new Date(),
      };

      await addTrainingLog(log);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowObjectivesReview(false);
      router.back();
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save training log. Please try again.');
    }
  };

  const saveQuickLog = async () => {
    if (!activeMission || !user) return;

    const escapes = parseQuickValue(quickEscapes);
    const attempts = parseQuickValue(quickAttempts);

    // Validation
    if (attempts === 0) {
      alert('Please select at least 1 escape attempt');
      return;
    }

    if (escapes > attempts) {
      alert('Successful escapes cannot be more than attempts');
      return;
    }

    try {
      const log: TrainingLog = {
        id: `log-${Date.now()}`,
        userId: user.id,
        missionId: activeMission.id,
        sessionDate: new Date(),
        escapeAttempts: attempts,
        successfulEscapes: escapes,
        escapeRate: attempts > 0 ? escapes / attempts : 0,
        mainProblem: quickProblem || undefined,
        trainingNotes: quickNotes || undefined,
        intensityLevel: 7,
        createdAt: new Date(),
      };

      await addTrainingLog(log);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowQuickLog(false);
      router.back();
    } catch (error) {
      console.error('Error saving quick log:', error);
      alert('Failed to save training log. Please try again.');
    }
  };

  const parseQuickValue = (value: string): number => {
    if (value.includes('+')) return parseInt(value) + 2;
    if (value.includes('-')) {
      const parts = value.split('-');
      return Math.floor((parseInt(parts[0]) + parseInt(parts[1])) / 2);
    }
    return parseInt(value) || 0;
  };

  const reRecord = () => {
    setTranscript('');
    setParsedData(null);
    setRecordingTime(0);
  };

  if (!activeMission) {
    router.back();
    return null;
  }

  const positionName = activeMission.positionFocus.replace('_', ' ');

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
          How did {positionName} escapes go?
        </Text>

        {!isRecording && !transcript && !isProcessing && (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Card style={styles.recordCard}>
              <View style={styles.micIconContainer}>
                <Text variant="displayMedium" style={styles.micIcon}>
                  🎤
                </Text>
              </View>
              <Text variant="headlineSmall" style={styles.recordText}>
                Tap to record
              </Text>
              <Text variant="bodyMedium" style={styles.recordHint}>
                Just talk naturally about what happened (60 sec max)
              </Text>
            </Card>
          </TouchableOpacity>
        )}

        {isRecording && (
          <Card style={styles.recordingCard}>
            <View style={styles.waveform}>
              <Text variant="displayLarge" style={styles.recordingIcon}>
                🔴
              </Text>
            </View>
            <Text variant="headlineLarge" style={styles.timer}>
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </Text>
            <Button onPress={stopRecording}>Stop & Process</Button>
          </Card>
        )}

        {isProcessing && (
          <Card style={styles.processingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text variant="bodyLarge" style={styles.processingText}>
              Transcribing and analyzing...
            </Text>
          </Card>
        )}

        {transcript && parsedData && (
          <View>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Here's what I understood:
            </Text>

            <Card>
              <View style={styles.dataRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Escape Attempts:
                </Text>
                <TextInput
                  value={parsedData.escapeAttempts.toString()}
                  onChangeText={(text) =>
                    setParsedData({ ...parsedData, escapeAttempts: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
              </View>

              <View style={styles.dataRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Successful Escapes:
                </Text>
                <TextInput
                  value={parsedData.successfulEscapes.toString()}
                  onChangeText={(text) =>
                    setParsedData({ ...parsedData, successfulEscapes: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
              </View>

              {/* Live Escape Rate Calculator */}
              <View style={styles.escapeRateCard}>
                <View style={styles.escapeRateHeader}>
                  <Text variant="labelLarge" style={styles.escapeRateLabel}>
                    Your Escape Rate
                  </Text>
                  <Text variant="displaySmall" style={[
                    styles.escapeRateValue,
                    {
                      color: parsedData.escapeAttempts > 0
                        ? (parsedData.successfulEscapes / parsedData.escapeAttempts) >= 0.5
                          ? Colors.success
                          : (parsedData.successfulEscapes / parsedData.escapeAttempts) >= 0.3
                            ? Colors.primary
                            : Colors.textSecondary
                        : Colors.textSecondary
                    }
                  ]}>
                    {parsedData.escapeAttempts > 0
                      ? Math.round((parsedData.successfulEscapes / parsedData.escapeAttempts) * 100)
                      : 0}%
                  </Text>
                </View>
                {parsedData.escapeAttempts > 0 && (
                  <View style={styles.escapeRateFeedback}>
                    <Text variant="bodyMedium" style={styles.escapeRateFraction}>
                      {parsedData.successfulEscapes} out of {parsedData.escapeAttempts} attempts
                    </Text>
                    {(() => {
                      const rate = parsedData.successfulEscapes / parsedData.escapeAttempts;
                      const lastSessionRate = trainingLogs.length > 0
                        ? trainingLogs[trainingLogs.length - 1].escapeRate
                        : 0;
                      const improvement = rate - lastSessionRate;

                      if (trainingLogs.length > 0 && improvement !== 0) {
                        return (
                          <Text variant="bodySmall" style={[
                            styles.escapeRateComparison,
                            { color: improvement > 0 ? Colors.success : Colors.error }
                          ]}>
                            {improvement > 0 ? '📈 ' : '📉 '}
                            {improvement > 0 ? 'Up' : 'Down'} {Math.abs(Math.round(improvement * 100))}% from last session!
                          </Text>
                        );
                      }

                      return (
                        <Text variant="bodySmall" style={styles.escapeRateMessage}>
                          {rate >= 0.7 ? '🔥 Excellent work!' :
                            rate >= 0.5 ? '💪 Great progress!' :
                              rate >= 0.3 ? '👍 Keep practicing!' :
                                '🎯 Focus on fundamentals'}
                        </Text>
                      );
                    })()}
                  </View>
                )}
              </View>

              <View style={styles.dataRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Main Problem:
                </Text>
                <TextInput
                  value={parsedData.mainProblem}
                  onChangeText={(text) => setParsedData({ ...parsedData, mainProblem: text })}
                  style={styles.inputFull}
                  mode="outlined"
                />
              </View>
            </Card>

            <Card>
              <Text variant="labelLarge" style={styles.transcriptLabel}>
                Full Transcript:
              </Text>
              <Text variant="bodyMedium" style={styles.transcriptText}>
                {transcript}
              </Text>
            </Card>

            <View style={styles.buttonRow}>
              <Button mode="outlined" onPress={reRecord} style={styles.halfButton}>
                Re-record
              </Button>
              <Button onPress={saveLog} style={styles.halfButton}>
                Save Session
              </Button>
            </View>
          </View>
        )}

        {!isRecording && !transcript && !isProcessing && (
          <Button mode="text" onPress={() => setShowQuickLog(true)}>
            Prefer to tap instead of voice?
          </Button>
        )}
      </ScrollView>

      {/* Quick Log Modal */}
      <RNModal
        visible={showQuickLog}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQuickLog(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
              >
                <Text variant="headlineMedium" style={styles.modalTitle}>
                  Quick Log
                </Text>

                <Text variant="bodyMedium" style={styles.questionText}>
                  How many times did you escape?
                </Text>
                <View style={styles.optionGroup}>
                  {['0', '1-2', '3-4', '5+'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        quickEscapes === option && styles.optionButtonSelected,
                      ]}
                      onPress={() => setQuickEscapes(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          quickEscapes === option && styles.optionTextSelected,
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
                  {['1-2', '3-5', '6-8', '9+'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        quickAttempts === option && styles.optionButtonSelected,
                      ]}
                      onPress={() => setQuickAttempts(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          quickAttempts === option && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text variant="bodyMedium" style={styles.questionText}>
                  Main problem today?
                </Text>
                <View style={styles.optionGroupVertical}>
                  {[
                    'Lost inside elbow position',
                    "Couldn't create frames",
                    'Gave up back during escape',
                    'Bad timing on hip escape',
                    'Other',
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButtonWide,
                        quickProblem === option && styles.optionButtonSelected,
                      ]}
                      onPress={() => setQuickProblem(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          quickProblem === option && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  placeholder="Any other notes? (optional)"
                  value={quickNotes}
                  onChangeText={setQuickNotes}
                  multiline
                  numberOfLines={3}
                  style={styles.notesInput}
                  mode="outlined"
                />

                {/* Quick Log Escape Rate Calculator */}
                {(() => {
                  const escapes = parseQuickValue(quickEscapes);
                  const attempts = parseQuickValue(quickAttempts);
                  const rate = attempts > 0 ? escapes / attempts : 0;

                  return (
                    <View style={styles.quickEscapeRateCard}>
                      <View style={styles.escapeRateHeader}>
                        <Text variant="labelLarge" style={styles.escapeRateLabel}>
                          Escape Rate
                        </Text>
                        <Text variant="displaySmall" style={[
                          styles.escapeRateValue,
                          {
                            color: rate >= 0.5 ? Colors.success :
                              rate >= 0.3 ? Colors.primary :
                                Colors.textSecondary
                          }
                        ]}>
                          {Math.round(rate * 100)}%
                        </Text>
                      </View>
                      {attempts > 0 && (
                        <Text variant="bodyMedium" style={styles.quickEscapeRateFraction}>
                          ~{escapes} out of ~{attempts} attempts
                        </Text>
                      )}
                    </View>
                  );
                })()}

                <View style={styles.modalButtons}>
                  <Button mode="outlined" onPress={() => setShowQuickLog(false)} style={styles.halfButton}>
                    Cancel
                  </Button>
                  <Button onPress={saveQuickLog} style={styles.halfButton}>
                    Save
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>

      {/* Objectives Review Modal */}
      <RNModal
        visible={showObjectivesReview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowObjectivesReview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text variant="headlineMedium" style={styles.modalTitle}>
                How did your objectives go?
              </Text>
              <Text variant="bodyMedium" style={styles.objectivesDescription}>
                Tracking your objectives helps improve future game plans
              </Text>

              {gamePlan?.objectives.map((objective, index) => (
                <View key={objective.id} style={styles.objectiveReviewItem}>
                  <View style={styles.objectiveReviewHeader}>
                    <Text variant="labelSmall" style={styles.objectiveReviewLabel}>
                      {objective.priority === 'primary' ? '🎯 PRIMARY' : 'SECONDARY'} OBJECTIVE {index + 1}
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.objectiveReviewText}>
                    {objective.description}
                  </Text>
                  <Text variant="bodySmall" style={styles.objectiveReviewTarget}>
                    Target: {objective.targetReps} successful reps
                  </Text>

                  <Text variant="bodyMedium" style={styles.achievementQuestion}>
                    Did you achieve this?
                  </Text>
                  <View style={styles.achievementButtons}>
                    {(['yes', 'partial', 'no'] as const).map((achievement) => (
                      <TouchableOpacity
                        key={achievement}
                        style={[
                          styles.achievementButton,
                          objectiveAchievements[objective.id] === achievement && styles.achievementButtonSelected,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setObjectiveAchievements(prev => ({
                            ...prev,
                            [objective.id]: achievement,
                          }));
                        }}
                      >
                        <Text
                          style={[
                            styles.achievementButtonText,
                            objectiveAchievements[objective.id] === achievement && styles.achievementButtonTextSelected,
                          ]}
                        >
                          {achievement === 'yes' ? '✓ Yes' : achievement === 'partial' ? '~ Partially' : '✗ No'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowObjectivesReview(false)}
                  style={styles.halfButton}
                >
                  Skip
                </Button>
                <Button onPress={saveLogWithObjectives} style={styles.halfButton}>
                  Save Session
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </RNModal>
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
    marginBottom: spacing.xl,
  },
  recordButton: {
    marginVertical: spacing.xl,
  },
  recordCard: {
    alignItems: 'center',
    padding: spacing.xxl,
    paddingVertical: 64,
  },
  micIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: 'transparent',
  },
  micIcon: {
    fontSize: 80,
    textAlign: 'center',
    lineHeight: 88,
  },
  recordText: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  recordHint: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recordingCard: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  waveform: {
    marginVertical: spacing.xl,
  },
  recordingIcon: {
    fontSize: 80,
    lineHeight: 88,
    textAlign: 'center',
  },
  timer: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  processingCard: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  processingText: {
    color: Colors.textSecondary,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  label: {
    color: Colors.text,
    flex: 1,
  },
  value: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  escapeRateCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  escapeRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  escapeRateLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  escapeRateValue: {
    fontWeight: 'bold',
  },
  escapeRateFeedback: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  escapeRateFraction: {
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  escapeRateComparison: {
    fontWeight: '500',
  },
  escapeRateMessage: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  input: {
    width: 80,
    backgroundColor: Colors.background,
  },
  inputFull: {
    flex: 1,
    backgroundColor: Colors.background,
    marginLeft: spacing.sm,
  },
  transcriptLabel: {
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  transcriptText: {
    color: Colors.text,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  halfButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  questionText: {
    color: Colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionGroupVertical: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionButtonWide: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
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
  notesInput: {
    backgroundColor: Colors.background,
    marginBottom: spacing.md,
  },
  quickEscapeRateCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  quickEscapeRateFraction: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  objectivesDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.lg,
  },
  objectiveReviewItem: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  objectiveReviewHeader: {
    marginBottom: spacing.sm,
  },
  objectiveReviewLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  objectiveReviewText: {
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  objectiveReviewTarget: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  achievementQuestion: {
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  achievementButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  achievementButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  achievementButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  achievementButtonText: {
    color: Colors.text,
    fontSize: 14,
  },
  achievementButtonTextSelected: {
    color: Colors.text,
    fontWeight: 'bold',
  },
});
