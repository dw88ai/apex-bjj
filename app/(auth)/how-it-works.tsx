import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    emoji: '🎯',
    title: 'Set Your Focus',
    description: 'Before each training session, review your weekly goal. Prime your mind for learning.',
    duration: '10 seconds',
  },
  {
    emoji: '🥋',
    title: 'Train Hard',
    description: 'Go to class and focus on your mission. Pay attention to what works and what doesn\'t.',
    duration: 'Your session',
  },
  {
    emoji: '🎤',
    title: 'Quick Voice Log',
    description: 'After training, record a quick summary. Our AI extracts the key data automatically.',
    duration: '60 seconds',
  },
  {
    emoji: '📊',
    title: 'Get AI Feedback',
    description: 'Every week, discover your #1 recurring problem and get a specific fix with video resources.',
    duration: 'Every Sunday',
  },
];

export default function HowItWorks() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / containerWidth);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * containerWidth, animated: true });
    } else {
      router.push('/(auth)/profile-setup');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/profile-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress totalSteps={5} currentStep={1} />

      <View style={styles.content} onLayout={handleLayout}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {STEPS.map((step, index) => (
            <StepCard key={index} step={step} width={containerWidth} />
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button mode="text" onPress={handleSkip}>
            Skip
          </Button>
          <Button onPress={handleNext}>
            {currentIndex === STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface StepCardProps {
  step: {
    emoji: string;
    title: string;
    description: string;
    duration: string;
  };
  width: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, width }) => {
  return (
    <View style={[styles.stepCard, { width }]}>
      <Text style={styles.emoji}>{step.emoji}</Text>
      <Text variant="displaySmall" style={styles.title}>
        {step.title}
      </Text>
      <Text variant="bodyLarge" style={styles.description}>
        {step.description}
      </Text>
      <View style={styles.durationBadge}>
        <Text variant="labelMedium" style={styles.durationText}>
          {step.duration}
        </Text>
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
  },
  scrollView: {
    flex: 1,
  },
  stepCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 100,
    lineHeight: 110,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  durationBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  durationText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
