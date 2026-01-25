import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { spacing } from '../constants/theme';
import { seedAppWithData, clearSeedData } from '../utils/seedData';
import { useApp } from '../context/AppContext';

export default function SeedDataScreen() {
  const router = useRouter();
  const { resetApp } = useApp();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('');
    try {
      await seedAppWithData();
      setMessage('✅ Success! Seeded 9 training sessions over 3 weeks. Restart the app to see the data.');
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAndSeed = async () => {
    setLoading(true);
    setMessage('');
    try {
      await clearSeedData();
      await seedAppWithData();
      setMessage('✅ Cleared old data and seeded fresh! Close and reopen the app.');
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    await resetApp();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          🌱 Seed Test Data
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Populate the app with realistic BJJ training data for testing
        </Text>

        <Card>
          <Text variant="titleMedium" style={styles.cardTitle}>
            What This Does:
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            • Creates a Blue Belt user profile{'\n'}
            • Starts a 4-week side control escape mission{'\n'}
            • Adds 9 realistic training sessions over 3 weeks{'\n'}
            • Shows progression from 17% → 67% escape rate{'\n'}
            • Includes real problems and notes
          </Text>
        </Card>

        {message ? (
          <Card>
            <Text variant="bodyMedium" style={styles.message}>
              {message}
            </Text>
          </Card>
        ) : null}

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Seeding data...
            </Text>
          </View>
        ) : (
          <>
            <Button onPress={handleSeedData} icon="sprout">
              Seed Data (Keep Existing)
            </Button>
            <Button onPress={handleClearAndSeed} icon="refresh" mode="outlined">
              Clear & Seed Fresh
            </Button>
            <Button onPress={handleRestart} mode="text">
              Restart App
            </Button>
            <Button onPress={() => router.back()} mode="text">
              Go Back
            </Button>
          </>
        )}

        <Card style={styles.tipCard}>
          <Text variant="titleSmall" style={styles.tipTitle}>
            💡 Tip:
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            After seeding, close and reopen the app to see all the data loaded. You'll land on the
            Home screen with a mission in progress and 9 logged sessions!
          </Text>
        </Card>
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
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  description: {
    color: Colors.text,
    lineHeight: 24,
  },
  message: {
    color: Colors.text,
    lineHeight: 24,
  },
  loading: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  tipCard: {
    backgroundColor: Colors.surfaceVariant,
    marginTop: spacing.xl,
  },
  tipTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  tipText: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
