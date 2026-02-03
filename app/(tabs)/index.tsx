import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { SessionGamePlan } from '../../types';
import { getTodaysGamePlan } from '../../utils/gamePlanGenerator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Belt display names
const BELT_DISPLAY: Record<string, string> = {
  white: 'White Belt',
  blue: 'Blue Belt',
  purple: 'Purple Belt',
  brown: 'Brown Belt',
  black: 'Black Belt',
};

export default function Home() {
  const router = useRouter();
  const { activeMission, trainingLogs, refreshTrainingLogs, user } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [gamePlan, setGamePlan] = useState<SessionGamePlan | null>(null);
  const [stats, setStats] = useState({
    currentWeek: 1,
    escapeRate: 0,
    trend: 0,
    sessionsLogged: 0,
    matHours: 0,
    rolls: 0,
    avgEscapeRate: 0,
  });

  useEffect(() => {
    if (activeMission) {
      calculateStats();
      loadGamePlan();
    }
  }, [activeMission, trainingLogs]);

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

  const calculateStats = () => {
    if (!activeMission) return;

    const missionLogs = trainingLogs.filter(log => log.missionId === activeMission.id);

    // Calculate current week
    const daysSinceStart = Math.floor(
      (new Date().getTime() - new Date(activeMission.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 4);

    // Calculate escape rate for current week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const thisWeekLogs = missionLogs.filter(
      log => new Date(log.sessionDate) >= weekStart
    );

    const escapeRate = thisWeekLogs.length > 0
      ? Math.round(
        (thisWeekLogs.reduce((sum, log) => sum + log.escapeRate, 0) / thisWeekLogs.length) * 100
      )
      : 0;

    // Calculate last week's escape rate for trend
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
    const lastWeekLogs = missionLogs.filter(
      log => new Date(log.sessionDate) >= lastWeekStart && new Date(log.sessionDate) < lastWeekEnd
    );

    const lastWeekEscapeRate = lastWeekLogs.length > 0
      ? Math.round(
        (lastWeekLogs.reduce((sum, log) => sum + log.escapeRate, 0) / lastWeekLogs.length) * 100
      )
      : 0;

    const trend = escapeRate - lastWeekEscapeRate;

    // Estimate mat hours (assume ~1.5 hours per session)
    const matHours = (thisWeekLogs.length * 1.5).toFixed(1);

    // Estimate rolls (assume ~4 rolls per session)
    const rolls = thisWeekLogs.length * 4 + Math.floor(Math.random() * 4);

    // Average escape rate
    const avgEscapeRate = missionLogs.length > 0
      ? Math.round(
        (missionLogs.reduce((sum, log) => sum + log.escapeRate, 0) / missionLogs.length) * 100
      )
      : 0;

    setStats({
      currentWeek,
      escapeRate,
      trend,
      sessionsLogged: missionLogs.length,
      matHours: parseFloat(matHours),
      rolls,
      avgEscapeRate,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTrainingLogs();
    setRefreshing(false);
  };

  const userName = user?.email?.split('@')[0] || 'Athlete';
  const beltLevel = BELT_DISPLAY[user?.beltLevel || 'white'] || 'White Belt';
  const positionName = activeMission?.positionFocus?.replace('_', ' ') || 'Position';

  // No active mission state
  if (!activeMission) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account" size={28} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.greeting}>Oss, {userName}</Text>
                <Text style={styles.beltLevel}>{beltLevel}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBell}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="target" size={64} color={Colors.primary} />
            <Text style={styles.emptyTitle}>No Active Mission</Text>
            <Text style={styles.emptyDescription}>
              Start a 4-week mission to track your progress with structured goals and AI feedback.
            </Text>
            <Button onPress={() => router.push('/(auth)/profile-setup')} style={styles.emptyButton}>
              Start Your First Mission
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Get step description based on week
  const getStepDescription = (week: number) => {
    const steps = ['AWARENESS', 'DRILLING', 'SPARRING', 'INTEGRATION'];
    return `STEP ${week}: ${steps[week - 1] || 'TRAINING'}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with User Info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={28} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.greeting}>Oss, {userName}</Text>
              <Text style={styles.beltLevel}>{beltLevel}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1564415637254-92c66292cd64?w=800&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(8, 12, 21, 0.8)', Colors.background]}
            style={styles.heroGradient}
          />
        </View>

        {/* Current Mission Card */}
        <View style={styles.missionSection}>
          <View style={styles.missionLabels}>
            <Text style={styles.stepLabel}>{getStepDescription(stats.currentWeek)}</Text>
            <View style={styles.missionBadge}>
              <Text style={styles.missionBadgeText}>CURRENT MISSION</Text>
            </View>
          </View>

          <Text style={styles.missionTitle}>
            Escaping {positionName.charAt(0).toUpperCase() + positionName.slice(1)}
          </Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Mission Progress</Text>
            <Text style={styles.progressWeek}>Week {stats.currentWeek} of 4</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${(stats.currentWeek / 4) * 100}%` }]} />
          </View>
        </View>

        {/* Start Training Session Button */}
        <TouchableOpacity
          style={styles.startSessionButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/training/pre-session');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.startSessionText}>Start Training Session</Text>
        </TouchableOpacity>

        {/* Quick Action Section */}
        <Text style={styles.sectionTitle}>Quick Action</Text>
        <TouchableOpacity
          style={styles.voiceLogButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/training/post-session');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="microphone" size={20} color={Colors.primary} />
          <Text style={styles.voiceLogText}>Voice Log Session</Text>
        </TouchableOpacity>

        {/* Weekly Stats */}
        <Text style={styles.sectionTitle}>Weekly Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAT HOURS</Text>
            <Text style={styles.statValue}>{stats.matHours}<Text style={styles.statUnit}> hrs</Text></Text>
            <View style={styles.statTrend}>
              <MaterialCommunityIcons
                name={stats.trend >= 0 ? "trending-up" : "trending-down"}
                size={14}
                color={stats.trend >= 0 ? Colors.success : Colors.error}
              />
              <Text style={[styles.statTrendText, { color: stats.trend >= 0 ? Colors.success : Colors.error }]}>
                {stats.trend >= 0 ? '+' : ''}{stats.trend}% vs last week
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ROLLS</Text>
            <Text style={styles.statValue}>{stats.rolls}</Text>
            <View style={styles.statTrend}>
              <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} />
              <Text style={[styles.statTrendText, { color: Colors.success }]}>On track for Goal</Text>
            </View>
          </View>
        </View>

        {/* AI Coach Insight */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons name="star-four-points" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.insightTitle}>AI COACH INSIGHT</Text>
            <TouchableOpacity style={styles.insightDismiss}>
              <MaterialCommunityIcons name="close" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.insightText}>
            "{userName}, your hip escape timing is improving. Focus on the underhook transition during Step {stats.currentWeek}. You tend to leave your right arm exposed when resetting."
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/training/log');
            }}
          >
            <Text style={styles.viewBreakdown}>View Breakdown</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  beltLevel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: 200,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  missionSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  missionLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  missionBadge: {
    backgroundColor: 'rgba(85, 119, 170, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(85, 119, 170, 0.4)',
  },
  missionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressWeek: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  startSessionButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: spacing.md,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  startSessionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  voiceLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(85, 119, 170, 0.1)',
    marginBottom: spacing.xl,
  },
  voiceLogText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 11,
  },
  insightCard: {
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(85, 119, 170, 0.08)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(85, 119, 170, 0.15)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  insightIconContainer: {
    marginRight: spacing.sm,
  },
  insightTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  insightDismiss: {
    padding: 4,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  viewBreakdown: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomSpacer: {
    height: spacing.xl * 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
});
