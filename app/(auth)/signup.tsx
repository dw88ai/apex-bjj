import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { Text, TextInput, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export default function Signup() {
    const router = useRouter();
    const { setUser } = useApp();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSignup = async () => {
        setError('');

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!acceptedTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            // Sign up with Supabase
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    setError('Email already registered. Try signing in instead.');
                } else {
                    setError(signUpError.message);
                }
                setLoading(false);
                return;
            }

            if (!data.user) {
                setError('Failed to create account. Please try again.');
                setLoading(false);
                return;
            }

            // Retrieve profile data from storage
            const profileData = await AsyncStorage.getItem('onboarding_profile');
            if (!profileData) {
                setError('Profile data not found. Please go back and complete profile setup.');
                setLoading(false);
                return;
            }

            const { beltLevel, trainingFrequency, problemId } = JSON.parse(profileData);

            // Create user object with real Supabase ID
            const user = {
                id: data.user.id,
                beltLevel,
                trainingFrequency,
                createdAt: new Date(),
            };

            // Save user to context and sync to Supabase
            await setUser(user);

            // Clean up temporary storage
            await AsyncStorage.removeItem('onboarding_profile');

            // Success haptic
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Navigate to mission preview with problemId
            router.push({
                pathname: '/(auth)/mission-preview',
                params: { problemId },
            });
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <OnboardingProgress totalSteps={5} currentStep={3} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>
                        Create Account
                    </Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        Secure your progress and access your data anywhere
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        style={styles.input}
                        outlineColor={Colors.border}
                        activeOutlineColor={Colors.primary}
                        error={!!error && !validateEmail(email) && email.length > 0}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            mode="outlined"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                            textContentType="password"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                            error={!!error && !validatePassword(password) && password.length > 0}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                        <Text variant="bodySmall" style={styles.passwordHint}>
                            Minimum 8 characters
                        </Text>
                    </View>

                    <View style={styles.termsContainer}>
                        <Checkbox
                            status={acceptedTerms ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setAcceptedTerms(!acceptedTerms);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            color={Colors.primary}
                        />
                        <Text variant="bodyMedium" style={styles.termsText}>
                            I accept the{' '}
                            <Text style={styles.link}>Terms & Conditions</Text>
                        </Text>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text variant="bodyMedium" style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    <Button
                        onPress={handleSignup}
                        loading={loading}
                        disabled={loading}
                        style={styles.signupButton}
                    >
                        Create Account
                    </Button>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login' as any)}
                        style={styles.loginLink}
                    >
                        <Text variant="bodyMedium" style={styles.loginText}>
                            Already have an account?{' '}
                            <Text style={styles.link}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button
                        mode="text"
                        onPress={() => router.back()}
                        icon="arrow-left"
                        disabled={loading}
                    >
                        Back
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
        marginBottom: spacing.sm,
    },
    subtitle: {
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        marginBottom: spacing.xl,
    },
    input: {
        marginBottom: spacing.md,
        backgroundColor: Colors.background,
    },
    passwordContainer: {
        marginBottom: spacing.md,
    },
    passwordHint: {
        color: Colors.textSecondary,
        marginTop: spacing.xs,
        marginLeft: spacing.sm,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    termsText: {
        flex: 1,
        color: Colors.text,
        marginLeft: spacing.sm,
    },
    link: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: Colors.error + '20',
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
    },
    signupButton: {
        marginTop: spacing.md,
    },
    loginLink: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    loginText: {
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    footer: {
        marginBottom: spacing.lg,
    },
});
