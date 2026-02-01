import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress totalSteps={5} currentStep={0} />
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text variant="displaySmall" style={styles.title}>
            Apex BJJ
          </Text>
          <Text variant="headlineSmall" style={styles.emoji}>
            🥋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Get better at BJJ faster with AI coaching
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text variant="headlineMedium" style={styles.featureIcon}>
              🎯
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              4-week missions focused on your biggest problems
            </Text>
          </View>

          <View style={styles.feature}>
            <Text variant="headlineMedium" style={styles.featureIcon}>
              🎤
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Voice log sessions in 60 seconds
            </Text>
          </View>

          <View style={styles.feature}>
            <Text variant="headlineMedium" style={styles.featureIcon}>
              🤖
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Weekly AI feedback on your #1 recurring mistake
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button onPress={() => router.push('/(auth)/how-it-works')}>
            Start Your First Mission
          </Button>
          <Button
            mode="text"
            onPress={() => router.push('/(auth)/login' as any)}
            style={styles.signInButton}
          >
            Already have an account? Sign In
          </Button>
        </View>
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
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    lineHeight: 88,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  features: {
    marginVertical: spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  featureIcon: {
    marginRight: spacing.md,
    lineHeight: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
    color: Colors.text,
  },
  footer: {
    marginBottom: spacing.lg,
  },
  signInButton: {
    marginTop: spacing.md,
  },
});
