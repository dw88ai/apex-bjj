import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal as RNModal } from 'react-native';
import { Text, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function Settings() {
  const router = useRouter();
  const { user, activeMission, abandonCurrentMission, resetApp } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleChangeMission = () => {
    Alert.alert(
      'Change Mission',
      activeMission 
        ? 'This will abandon your current mission and start a new one. Your training logs will be preserved. Continue?'
        : 'Start a new 4-week mission',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: activeMission ? 'Abandon & Start New' : 'Start Mission',
          style: activeMission ? 'destructive' : 'default',
          onPress: async () => {
            if (activeMission) {
              await abandonCurrentMission();
            }
            router.push('/(auth)/profile-setup');
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure? This will delete all your training logs and missions. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetApp();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const isPremium = user?.subscriptionTier === 'premium';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Settings
        </Text>

        {/* Subscription Status */}
        <Card>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Subscription
              </Text>
              <Text variant="bodyMedium" style={styles.subscriptionStatus}>
                {isPremium ? 'Premium Member' : 'Free Plan'}
              </Text>
            </View>
            {!isPremium && (
              <Button mode="contained" onPress={() => setShowPaywall(true)}>
                Upgrade
              </Button>
            )}
          </View>
          {!isPremium && (
            <>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={styles.featureText}>
                Upgrade to Premium for:
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Unlimited concurrent missions
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Unlimited AI fixes & recommendations
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Video upload & annotation
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Advanced analytics & insights
              </Text>
            </>
          )}
        </Card>

        {/* Profile */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Profile
          </Text>
          <View style={styles.profileItem}>
            <Text variant="bodyMedium" style={styles.profileLabel}>
              Belt Level:
            </Text>
            <Text variant="bodyMedium" style={styles.profileValue}>
              {user?.beltLevel?.charAt(0).toUpperCase() + (user?.beltLevel?.slice(1) || '')} Belt
            </Text>
          </View>
          <View style={styles.profileItem}>
            <Text variant="bodyMedium" style={styles.profileLabel}>
              Training Frequency:
            </Text>
            <Text variant="bodyMedium" style={styles.profileValue}>
              {user?.trainingFrequency} per week
            </Text>
          </View>
        </Card>

        {/* Notifications */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Notifications
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text variant="bodyLarge" style={styles.settingTitle}>
                Training Reminders
              </Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Get notified before typical training times
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={Colors.primary}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text variant="bodyLarge" style={styles.settingTitle}>
                Weekly Reviews
              </Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Sunday evening progress summaries
              </Text>
            </View>
            <Switch value={true} onValueChange={() => {}} color={Colors.primary} />
          </View>
        </Card>

        {/* About */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            About
          </Text>
          <View style={styles.aboutItem}>
            <Text variant="bodyMedium" style={styles.aboutText}>
              Version 1.0.0
            </Text>
          </View>
          <View style={styles.aboutItem}>
            <Text variant="bodyMedium" style={styles.aboutText}>
              Built for BJJ practitioners who want to improve faster
            </Text>
          </View>
        </Card>

        {/* Developer Tools */}
        <Card>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Developer Tools
          </Text>
          <Button mode="outlined" onPress={() => router.push('/seed')} icon="seed">
            Seed Test Data
          </Button>
          <Text variant="bodySmall" style={styles.devNote}>
            Populate app with realistic training data for testing
          </Text>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text variant="titleMedium" style={styles.dangerTitle}>
            Danger Zone
          </Text>
          <Button mode="outlined" onPress={handleResetData} style={styles.dangerButton}>
            Reset All Data
          </Button>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Paywall Modal */}
      <RNModal
        visible={showPaywall}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaywall(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="displaySmall" style={styles.modalTitle}>
              Unlock Your Full Potential 🚀
            </Text>

            <View style={styles.tierSection}>
              <Text variant="titleMedium" style={styles.tierTitle}>
                Free Tier
              </Text>
              <Text variant="bodyMedium" style={styles.tierItem}>
                ✓ 1 active mission at a time
              </Text>
              <Text variant="bodyMedium" style={styles.tierItem}>
                ✓ Basic progress tracking
              </Text>
              <Text variant="bodyMedium" style={styles.tierItem}>
                ✓ 1 AI fix per week
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.premiumSection}>
              <Text variant="titleLarge" style={styles.premiumTitle}>
                Premium Features
              </Text>

              <View style={styles.featureRow}>
                <Text variant="headlineMedium" style={styles.featureIcon}>
                  🎯
                </Text>
                <View style={styles.featureDetails}>
                  <Text variant="titleMedium" style={styles.featureName}>
                    Unlimited concurrent missions
                  </Text>
                  <Text variant="bodySmall" style={styles.featureDesc}>
                    Work on defense + A-game simultaneously
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <Text variant="headlineMedium" style={styles.featureIcon}>
                  🤖
                </Text>
                <View style={styles.featureDetails}>
                  <Text variant="titleMedium" style={styles.featureName}>
                    Unlimited AI fixes
                  </Text>
                  <Text variant="bodySmall" style={styles.featureDesc}>
                    Get personalized help whenever you need it
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <Text variant="headlineMedium" style={styles.featureIcon}>
                  📹
                </Text>
                <View style={styles.featureDetails}>
                  <Text variant="titleMedium" style={styles.featureName}>
                    Video upload & annotation
                  </Text>
                  <Text variant="bodySmall" style={styles.featureDesc}>
                    Review your footage with timestamped notes
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <Text variant="headlineMedium" style={styles.featureIcon}>
                  📊
                </Text>
                <View style={styles.featureDetails}>
                  <Text variant="titleMedium" style={styles.featureName}>
                    Advanced analytics
                  </Text>
                  <Text variant="bodySmall" style={styles.featureDesc}>
                    Compare to belt-level benchmarks
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.pricingOptions}>
              <Card style={StyleSheet.flatten([styles.pricingCard, styles.bestValue])}>
                <View style={styles.bestValueBadge}>
                  <Text variant="labelSmall" style={styles.badgeText}>
                    BEST VALUE
                  </Text>
                </View>
                <Text variant="titleLarge" style={styles.planName}>
                  Annual
                </Text>
                <Text variant="displaySmall" style={styles.price}>
                  $99/year
                </Text>
                <Text variant="bodySmall" style={styles.savings}>
                  Save $45
                </Text>
                <Text variant="bodySmall" style={styles.perMonth}>
                  $8.25/month
                </Text>
              </Card>

              <Card style={styles.pricingCard}>
                <Text variant="titleLarge" style={styles.planName}>
                  Monthly
                </Text>
                <Text variant="headlineLarge" style={styles.price}>
                  $12/month
                </Text>
              </Card>
            </View>

            <View style={styles.testimonial}>
              <Text variant="bodyMedium" style={styles.testimonialText}>
                "Went from getting crushed to escaping 70% of the time in 8 weeks"
              </Text>
              <Text variant="bodySmall" style={styles.testimonialAuthor}>
                - Alex, White Belt
              </Text>
            </View>

            <Button onPress={() => setShowPaywall(false)}>Start Free 7-Day Trial</Button>
            <Text variant="bodySmall" style={styles.disclaimer}>
              Cancel anytime. No commitment.
            </Text>

            <Button mode="text" onPress={() => setShowPaywall(false)}>
              Maybe later
            </Button>
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
    padding: spacing.md,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionStatus: {
    color: Colors.primary,
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: Colors.border,
  },
  featureText: {
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  featureItem: {
    color: Colors.textSecondary,
    marginVertical: spacing.xs,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  profileLabel: {
    color: Colors.textSecondary,
  },
  profileValue: {
    color: Colors.text,
    fontWeight: '600',
  },
  noMissionText: {
    color: Colors.textSecondary,
    marginBottom: spacing.md,
  },
  changeMissionButton: {
    marginTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    color: Colors.textSecondary,
  },
  aboutItem: {
    marginVertical: spacing.sm,
  },
  aboutText: {
    color: Colors.textSecondary,
  },
  devNote: {
    color: Colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerTitle: {
    color: Colors.error,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  dangerButton: {
    borderColor: Colors.error,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tierSection: {
    marginBottom: spacing.md,
  },
  tierTitle: {
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tierItem: {
    color: Colors.textSecondary,
    marginVertical: spacing.xs,
  },
  premiumSection: {
    marginVertical: spacing.md,
  },
  premiumTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    marginRight: spacing.md,
    lineHeight: 40,
    textAlign: 'center',
  },
  featureDetails: {
    flex: 1,
  },
  featureName: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  featureDesc: {
    color: Colors.textSecondary,
  },
  pricingOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  pricingCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  bestValue: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  bestValueBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  planName: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  price: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  savings: {
    color: Colors.success,
    marginBottom: spacing.xs,
  },
  perMonth: {
    color: Colors.textSecondary,
  },
  testimonial: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  testimonialText: {
    color: Colors.text,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  testimonialAuthor: {
    color: Colors.textSecondary,
  },
  disclaimer: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
