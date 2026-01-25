import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { CoachCard } from '../../components/ui/CoachCard';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

const COACHES = [
  {
    name: 'Lachlan Giles',
    credentials: 'ADCC Champion, PhD Physiotherapy',
    specialty: 'Escapes & Defense',
    emoji: '🎓',
  },
  {
    name: 'John Danaher',
    credentials: 'Coach of Gordon Ryan & GSP',
    specialty: 'Systematic Approach',
    emoji: '🧠',
  },
  {
    name: 'Gordon Ryan',
    credentials: 'Multiple ADCC Champion',
    specialty: 'Pressure & Control',
    emoji: '👑',
  },
  {
    name: 'Craig Jones',
    credentials: 'ADCC Medalist',
    specialty: 'Leg Locks',
    emoji: '🦵',
  },
  {
    name: 'Bernardo Faria',
    credentials: '5x World Champion',
    specialty: 'Half Guard',
    emoji: '🏆',
  },
  {
    name: 'Keenan Cornelius',
    credentials: 'World Champion',
    specialty: 'Guard Work',
    emoji: '🌀',
  },
];

export default function Coaches() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(auth)/profile-setup');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress totalSteps={5} currentStep={2} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Meet Your Coaches
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Learn from world-class instructors through our curated video resources
          </Text>
        </View>

        <View style={styles.coachesList}>
          {COACHES.map((coach, index) => (
            <CoachCard
              key={coach.name}
              {...coach}
              delay={400 + index * 100}
            />
          ))}
        </View>

        <View style={styles.note}>
          <Text variant="bodySmall" style={styles.noteText}>
            All coaches have free YouTube content linked in your weekly reviews
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="text" onPress={handleBack} icon="arrow-left">
          Back
        </Button>
        <Button onPress={handleNext}>
          Continue
        </Button>
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
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  coachesList: {
    marginBottom: spacing.lg,
  },
  note: {
    backgroundColor: Colors.primary + '10',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  noteText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
