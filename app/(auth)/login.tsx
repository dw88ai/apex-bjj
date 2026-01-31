import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { signIn, signUp, isSupabaseConfigured } from '../../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = isSignUp 
        ? await signUp(email.trim(), password)
        : await signIn(email.trim(), password);

      if (authError) {
        setError(authError.message);
      } else {
        // Success - navigate to main app or continue onboarding
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Continue without account (local only)
    router.push('/(auth)/how-it-works');
  };

  // Show message if Supabase not configured
  if (!isSupabaseConfigured()) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Cloud Sync
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Cloud sync is not configured yet. You can still use the app locally.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text variant="bodyMedium" style={styles.infoText}>
              To enable cloud sync, add your Supabase credentials to .env.local
            </Text>
          </View>

          <View style={styles.footer}>
            <Button onPress={handleSkip}>
              Continue Locally
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                {isSignUp 
                  ? 'Sign up to sync your training across devices'
                  : 'Sign in to access your training data'
                }
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                textColor={Colors.text}
                theme={{ colors: { onSurfaceVariant: Colors.textSecondary } }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                textColor={Colors.text}
                theme={{ colors: { onSurfaceVariant: Colors.textSecondary } }}
              />

              {error && (
                <HelperText type="error" visible={!!error} style={styles.error}>
                  {error}
                </HelperText>
              )}

              <Button 
                onPress={handleSubmit} 
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>

              <Button 
                mode="text"
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                style={styles.toggleButton}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="bodySmall" style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button 
              mode="outlined"
              onPress={handleSkip}
            >
              Continue Without Account
            </Button>
            <Text variant="bodySmall" style={styles.skipHint}>
              Your data will be stored locally on this device
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: Colors.surface,
  },
  error: {
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  toggleButton: {
    marginTop: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  skipHint: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  infoText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
});
