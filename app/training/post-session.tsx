import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal as RNModal, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { Text, ActivityIndicator, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { TrainingLog, SessionGamePlan, ObjectiveAchievement } from '../../types';
import { getTodaysGamePlan } from '../../utils/gamePlanGenerator';
import { mockTranscribe, mockParseTranscript } from '../../utils/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 1 | 2 | 3 | 4;

export default function PostSession() {
  const router = useRouter();
  const { activeMission, user, addTrainingLog, trainingLogs } = useApp();
  const { initialMode } = useLocalSearchParams();

  // Wizard State
  const [step, setStep] = useState<Step>(1);
  const [winsTranscript, setWinsTranscript] = useState('');
  const [challengesTranscript, setChallengesTranscript] = useState('');
  const [escapeAttempts, setEscapeAttempts] = useState('0');
  const [successfulEscapes, setSuccessfulEscapes] = useState('0');
  const [intensity, setIntensity] = useState(7);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // UI State
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [gamePlan, setGamePlan] = useState<SessionGamePlan | null>(null);

  useEffect(() => {
    if (initialMode === 'quick') {
      setShowQuickLog(true);
    }
    loadGamePlan();
  }, [activeMission, initialMode]);

  useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const loadGamePlan = async () => {
    if (!activeMission || !user) return;
    try {
      const recentLogs = trainingLogs
        .filter(log => log.missionId === activeMission.id)
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
        .slice(0, 5);
      const plan = await getTodaysGamePlan(activeMission, recentLogs, user.beltLevel);
      setGamePlan(plan);
    } catch (error) {
      console.error('Error loading game plan:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
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
      const text = await mockTranscribe(uri);
      if (step === 1) setWinsTranscript(prev => prev + (prev ? ' ' : '') + text);
      if (step === 2) setChallengesTranscript(prev => prev + (prev ? ' ' : '') + text);
    } catch (error) {
      console.error('Error processing:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      saveLog();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      router.back();
    }
  };

  const saveLog = async () => {
    if (!activeMission || !user) return;

    const attemptsNum = parseInt(escapeAttempts) || 0;
    const escapesNum = parseInt(successfulEscapes) || 0;

    const log: TrainingLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      missionId: activeMission.id,
      sessionDate: new Date(),
      voiceTranscript: `Wins: ${winsTranscript}\nChallenges: ${challengesTranscript}`,
      escapeAttempts: attemptsNum,
      successfulEscapes: escapesNum,
      escapeRate: attemptsNum > 0 ? escapesNum / attemptsNum : 0,
      mainProblem: challengesTranscript.substring(0, 100),
      trainingNotes: winsTranscript + '\n' + challengesTranscript,
      intensityLevel: intensity,
      createdAt: new Date(),
    };

    try {
      await addTrainingLog(log);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i <= step && styles.progressSegmentActive,
            i === step && styles.progressSegmentCurrent
          ]}
        />
      ))}
    </View>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return "What went well?";
      case 2: return "What was a challenge?";
      case 3: return "How did the stats look?";
      case 4: return "Review & Intensity";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Describe one positive technical win today";
      case 2: return "What position or movement felt difficult?";
      case 3: return "Enter your attempts and escapes";
      case 4: return "Final summary of your training de-brief";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <MaterialCommunityIcons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.headerTitle}>BJJ Reflection</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <MaterialCommunityIcons name="help-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {renderProgress()}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.promptSection}>
          <Text variant="headlineMedium" style={styles.title}>{getStepTitle()}</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>{getStepSubtitle()}</Text>
        </View>

        {(step === 1 || step === 2) && (
          <View style={styles.recordingArea}>
            <View style={styles.pulseContainer}>
              {isRecording && (
                <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }], opacity: 0.3 }]} />
              )}
              <TouchableOpacity
                style={[styles.micButton, isRecording && styles.micButtonActive]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={isRecording ? "microphone" : "microphone-outline"}
                  size={40}
                  color={isRecording ? Colors.background : Colors.text}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.holdToTalk}>{isRecording ? "Listening..." : "Hold to record"}</Text>

            <View style={styles.transcriptionBox}>
              <View style={styles.transcriptionHeader}>
                <View style={[styles.liveDot, isRecording && styles.liveDotActive]} />
                <Text style={styles.transcriptionLabel}>
                  {isProcessing ? "PROCESSING..." : isRecording ? "TRANSCRIBING LIVE" : "TRANSCRIPT"}
                </Text>
              </View>
              <Text style={styles.transcriptText}>
                {step === 1 ? winsTranscript : challengesTranscript || "Your words will appear here..."}
              </Text>
              {(winsTranscript !== '' || challengesTranscript !== '') && (
                <TouchableOpacity onPress={() => step === 1 ? setWinsTranscript('') : setChallengesTranscript('')} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {step === 1 && (
              <TouchableOpacity onPress={() => setShowQuickLog(true)} style={styles.quickEntryLink}>
                <Text style={styles.quickEntryText}>Prefer to tap instead of voice?</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={styles.statsArea}>
            <View style={styles.statInputRow}>
              <View style={styles.statInputGroup}>
                <Text variant="labelLarge" style={styles.statLabel}>Attempts</Text>
                <TextInput
                  value={escapeAttempts}
                  onChangeText={setEscapeAttempts}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.statInput}
                  outlineColor={Colors.border}
                  activeOutlineColor={Colors.primary}
                />
              </View>
              <View style={styles.statInputGroup}>
                <Text variant="labelLarge" style={styles.statLabel}>Escapes</Text>
                <TextInput
                  value={successfulEscapes}
                  onChangeText={setSuccessfulEscapes}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.statInput}
                  outlineColor={Colors.border}
                  activeOutlineColor={Colors.primary}
                />
              </View>
            </View>

            <View style={styles.rateDisplay}>
              <Text style={styles.rateLabel}>Escape Rate</Text>
              <Text style={styles.rateValue}>
                {parseInt(escapeAttempts) > 0
                  ? Math.round((parseInt(successfulEscapes) / parseInt(escapeAttempts)) * 100)
                  : 0}%
              </Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.reviewArea}>
            <View style={styles.reviewCard}>
              <Text variant="labelSmall" style={styles.reviewLabel}>WINS</Text>
              <Text style={styles.reviewText}>{winsTranscript || "No wins recorded"}</Text>
            </View>
            <View style={styles.reviewCard}>
              <Text variant="labelSmall" style={styles.reviewLabel}>CHALLENGES</Text>
              <Text style={styles.reviewText}>{challengesTranscript || "No challenges recorded"}</Text>
            </View>
            <View style={styles.intensitySection}>
              <View style={styles.intensityHeader}>
                <Text variant="labelLarge" style={styles.intensitySectionLabel}>Training Intensity</Text>
                <Text style={styles.intensityValueText}>{intensity}</Text>
              </View>

              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={intensity}
                  onValueChange={(val) => {
                    setIntensity(val);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor={Colors.primary}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Light</Text>
                  <Text style={styles.sliderLabel}>Max</Text>
                </View>
              </View>
            </View>

          </View>
        )}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialCommunityIcons name="undo" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 4 ? "Save Reflection" : "Next Prompt"}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={Colors.background} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      {/* Quick Log Modal Overlay */}
      <RNModal visible={showQuickLog} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={styles.modalTitle}>Quick Entry</Text>
              <TouchableOpacity onPress={() => setShowQuickLog(false)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="labelLarge" style={styles.modalLabel}>Main Problem</Text>
              <TextInput
                multiline
                numberOfLines={4}
                value={challengesTranscript}
                onChangeText={setChallengesTranscript}
                mode="outlined"
                style={styles.modalTextInput}
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                placeholder="What was the main difficulty today?"
              />

              <View style={styles.modalStatRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text variant="labelLarge" style={styles.modalLabel}>Attempts</Text>
                  <TextInput
                    value={escapeAttempts}
                    onChangeText={setEscapeAttempts}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.modalInput}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="labelLarge" style={styles.modalLabel}>Escapes</Text>
                  <TextInput
                    value={successfulEscapes}
                    onChangeText={setSuccessfulEscapes}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.modalInput}
                  />
                </View>
              </View>

              <Button style={{ marginTop: 24 }} onPress={() => {
                setShowQuickLog(false);
                setStep(4);
              }}>
                Continue to Review
              </Button>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.text,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: Colors.primary,
  },
  progressSegmentCurrent: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  promptSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recordingArea: {
    alignItems: 'center',
  },
  pulseContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
  micButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  holdToTalk: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  transcriptionBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 8,
  },
  liveDotActive: {
    backgroundColor: Colors.error,
  },
  transcriptionLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  transcriptText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  clearButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 12,
  },
  quickEntryLink: {
    marginTop: spacing.xl,
  },
  quickEntryText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nextButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  statsArea: {
    width: '100%',
  },
  statInputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: spacing.xl,
  },
  statInputGroup: {
    flex: 1,
  },
  statLabel: {
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  statInput: {
    backgroundColor: Colors.surface,
  },
  rateDisplay: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(88, 166, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(88, 166, 255, 0.1)',
  },
  rateLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  rateValue: {
    color: Colors.primary,
    fontSize: 48,
    fontWeight: 'bold',
  },
  reviewArea: {
    width: '100%',
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  reviewLabel: {
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  reviewText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  intensitySection: {
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  intensitySectionLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  intensityValueText: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '800',
  },
  sliderContainer: {
    width: '100%',
    paddingVertical: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  modalLabel: {
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  modalTextInput: {
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  modalStatRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: Colors.surface,
  }
});
