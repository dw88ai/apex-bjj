import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors } from '../../../constants/colors';
import { spacing } from '../../../constants/theme';
import { useApp } from '../../../context/AppContext';
import { TrainingLog } from '../../../types';
import * as Haptics from 'expo-haptics';

export default function LogDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLogById, updateTrainingLog, deleteTrainingLog, activeMission } = useApp();
  
  const [log, setLog] = useState<TrainingLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit state
  const [editEscapeAttempts, setEditEscapeAttempts] = useState('');
  const [editSuccessfulEscapes, setEditSuccessfulEscapes] = useState('');
  const [editMainProblem, setEditMainProblem] = useState('');
  const [editTrainingNotes, setEditTrainingNotes] = useState('');
  const [editIntensityLevel, setEditIntensityLevel] = useState('');

  useEffect(() => {
    loadLog();
  }, [id]);

  const loadLog = () => {
    setIsLoading(true);
    const foundLog = getLogById(id);
    
    if (!foundLog) {
      Alert.alert('Error', 'Training log not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      return;
    }
    
    setLog(foundLog);
    setEditEscapeAttempts(foundLog.escapeAttempts.toString());
    setEditSuccessfulEscapes(foundLog.successfulEscapes.toString());
    setEditMainProblem(foundLog.mainProblem || '');
    setEditTrainingNotes(foundLog.trainingNotes || '');
    setEditIntensityLevel(foundLog.intensityLevel?.toString() || '7');
    setIsLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values
    if (log) {
      setEditEscapeAttempts(log.escapeAttempts.toString());
      setEditSuccessfulEscapes(log.successfulEscapes.toString());
      setEditMainProblem(log.mainProblem || '');
      setEditTrainingNotes(log.trainingNotes || '');
      setEditIntensityLevel(log.intensityLevel?.toString() || '7');
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveEdit = async () => {
    if (!log) return;

    const attempts = parseInt(editEscapeAttempts) || 0;
    const escapes = parseInt(editSuccessfulEscapes) || 0;
    const intensity = parseInt(editIntensityLevel) || 7;

    // Validation
    if (attempts === 0) {
      Alert.alert('Validation Error', 'Please enter at least 1 escape attempt');
      return;
    }

    if (escapes > attempts) {
      Alert.alert('Validation Error', 'Successful escapes cannot be more than attempts');
      return;
    }

    if (intensity < 1 || intensity > 10) {
      Alert.alert('Validation Error', 'Intensity must be between 1 and 10');
      return;
    }

    setIsSaving(true);
    try {
      const updates: Partial<TrainingLog> = {
        escapeAttempts: attempts,
        successfulEscapes: escapes,
        escapeRate: attempts > 0 ? escapes / attempts : 0,
        mainProblem: editMainProblem || undefined,
        trainingNotes: editTrainingNotes || undefined,
        intensityLevel: intensity,
      };

      await updateTrainingLog(log.id, updates);
      
      // Update local state
      setLog({ ...log, ...updates });
      setIsEditing(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Training log updated successfully');
    } catch (error) {
      console.error('Error updating log:', error);
      Alert.alert('Error', 'Failed to update training log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Delete Training Log',
      'Are you sure you want to delete this training log? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!log) return;

    setIsSaving(true);
    try {
      await deleteTrainingLog(log.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Deleted', 'Training log deleted successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error deleting log:', error);
      Alert.alert('Error', 'Failed to delete training log. Please try again.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading training log...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!log) {
    return null;
  }

  const escapeRate = Math.round(log.escapeRate * 100);
  const missionInfo = log.missionId && activeMission?.id === log.missionId 
    ? activeMission 
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button 
          mode="text" 
          onPress={() => router.back()} 
          icon="arrow-left"
          style={styles.backButton}
        >
          Back
        </Button>

        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Training Session
          </Text>
          <Text variant="bodyLarge" style={styles.date}>
            {log.sessionDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {!isEditing && (
          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              onPress={handleEdit}
              icon="pencil"
              style={styles.actionButton}
            >
              Edit
            </Button>
            <Button 
              mode="outlined" 
              onPress={handleDelete}
              icon="delete"
              style={[styles.actionButton, styles.deleteButton]}
              textColor={Colors.error}
            >
              Delete
            </Button>
          </View>
        )}

        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text variant="displayMedium" style={styles.statValue}>
                {escapeRate}%
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Escape Rate
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="displayMedium" style={styles.statValue}>
                {log.successfulEscapes}/{log.escapeAttempts}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Successful
              </Text>
            </View>
          </View>
        </Card>

        {isEditing ? (
          <Card style={styles.editCard}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Edit Session Details
            </Text>

            <View style={styles.editRow}>
              <Text variant="bodyMedium" style={styles.editLabel}>
                Escape Attempts:
              </Text>
              <TextInput
                value={editEscapeAttempts}
                onChangeText={setEditEscapeAttempts}
                keyboardType="numeric"
                style={styles.editInput}
                mode="outlined"
              />
            </View>

            <View style={styles.editRow}>
              <Text variant="bodyMedium" style={styles.editLabel}>
                Successful Escapes:
              </Text>
              <TextInput
                value={editSuccessfulEscapes}
                onChangeText={setEditSuccessfulEscapes}
                keyboardType="numeric"
                style={styles.editInput}
                mode="outlined"
              />
            </View>

            <View style={styles.editRow}>
              <Text variant="bodyMedium" style={styles.editLabel}>
                Intensity (1-10):
              </Text>
              <TextInput
                value={editIntensityLevel}
                onChangeText={setEditIntensityLevel}
                keyboardType="numeric"
                style={styles.editInput}
                mode="outlined"
              />
            </View>

            <Text variant="bodyMedium" style={styles.editLabelFull}>
              Main Problem:
            </Text>
            <TextInput
              value={editMainProblem}
              onChangeText={setEditMainProblem}
              style={styles.editInputFull}
              mode="outlined"
              placeholder="e.g., Lost inside elbow position"
            />

            <Text variant="bodyMedium" style={styles.editLabelFull}>
              Training Notes:
            </Text>
            <TextInput
              value={editTrainingNotes}
              onChangeText={setEditTrainingNotes}
              multiline
              numberOfLines={4}
              style={styles.editInputFull}
              mode="outlined"
              placeholder="Additional notes about this session..."
            />

            <View style={styles.editButtons}>
              <Button 
                mode="outlined" 
                onPress={handleCancelEdit}
                style={styles.halfButton}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onPress={handleSaveEdit}
                style={styles.halfButton}
                loading={isSaving}
                disabled={isSaving}
              >
                Save Changes
              </Button>
            </View>
          </Card>
        ) : (
          <>
            {log.mainProblem && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Main Problem
                </Text>
                <Text variant="bodyLarge" style={styles.detailText}>
                  {log.mainProblem}
                </Text>
              </Card>
            )}

            {log.trainingNotes && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Training Notes
                </Text>
                <Text variant="bodyMedium" style={styles.detailText}>
                  {log.trainingNotes}
                </Text>
              </Card>
            )}

            {log.voiceTranscript && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Voice Transcript
                </Text>
                <Text variant="bodyMedium" style={styles.detailText}>
                  {log.voiceTranscript}
                </Text>
              </Card>
            )}

            {log.intensityLevel && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Intensity Level
                </Text>
                <View style={styles.intensityRow}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.intensityDot,
                        i < log.intensityLevel! && styles.intensityDotFilled,
                      ]}
                    />
                  ))}
                  <Text variant="bodyLarge" style={styles.intensityText}>
                    {log.intensityLevel}/10
                  </Text>
                </View>
              </Card>
            )}

            {missionInfo && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Mission Context
                </Text>
                <Text variant="bodyMedium" style={styles.detailText}>
                  {missionInfo.goalDescription}
                </Text>
                <Text variant="bodySmall" style={styles.detailSubtext}>
                  Position: {missionInfo.positionFocus.replace('_', ' ')}
                </Text>
              </Card>
            )}

            {log.generalTrainingType && (
              <Card style={styles.detailCard}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  Training Type
                </Text>
                <Text variant="bodyMedium" style={styles.detailText}>
                  {log.generalTrainingType.charAt(0).toUpperCase() + log.generalTrainingType.slice(1).replace('_', ' ')}
                </Text>
              </Card>
            )}
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  date: {
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.border,
  },
  editCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  editLabel: {
    color: Colors.text,
    flex: 1,
  },
  editInput: {
    width: 100,
    backgroundColor: Colors.background,
  },
  editLabelFull: {
    color: Colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  editInputFull: {
    backgroundColor: Colors.background,
    marginBottom: spacing.md,
  },
  editButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  halfButton: {
    flex: 1,
  },
  detailCard: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  detailText: {
    color: Colors.text,
    lineHeight: 24,
  },
  detailSubtext: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.surfaceVariant,
    marginRight: spacing.xs,
  },
  intensityDotFilled: {
    backgroundColor: Colors.primary,
  },
  intensityText: {
    color: Colors.text,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
});
