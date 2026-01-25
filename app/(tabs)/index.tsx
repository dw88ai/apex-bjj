import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { MissionProgressCard } from '../../components/cards/MissionProgressCard';
import { GamePlanCard } from '../../components/cards/GamePlanCard';
import { FAB } from '../../components/ui/FAB';
import { openVideoInBrowser } from '../../components/VideoPlayerBrowser';
import { isVideoCompleted } from '../../utils/videoTracking';
import { extractVideoId } from '../../constants/videoLinks';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { TrainingLog, SessionGamePlan } from '../../types';
import { getTodaysGamePlan } from '../../utils/gamePlanGenerator';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const router = useRouter();
  const { activeMission, trainingLogs, refreshTrainingLogs, user } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [gamePlan, setGamePlan] = useState<SessionGamePlan | null>(null);
  const [stats, setStats] = useState({
    currentWeek: 1,
    escapeRate: 0,
    trend: 0,
    sessionsLogged: 0,
    streak: 0,
    avgEscapeRate: 0,
  });

  useEffect(() => {
    if (activeMission) {
      calculateStats();
      checkMissionCompletion();
      checkVideoWatched();
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

  const checkVideoWatched = async () => {
    if (!activeMission) return;
    
    const currentWeekGoal = activeMission.weeklyGoals?.find(
      g => g.weekNumber === stats.currentWeek
    );
    
    if (currentWeekGoal?.videoUrl) {
      const videoId = extractVideoId(currentWeekGoal.videoUrl);
      if (videoId) {
        const watched = await isVideoCompleted(videoId);
        setVideoWatched(watched);
      }
    }
  };

  const checkMissionCompletion = () => {
    if (!activeMission) return;
    
    const now = new Date();
    const endDate = new Date(activeMission.endDate);
    
    // Check if mission is complete (past end date and has some logs)
    if (now > endDate && trainingLogs.length > 0) {
      // Show mission complete prompt
      setTimeout(() => {
        router.push('/mission-complete');
      }, 500);
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

    // Average escape rate
    const avgEscapeRate = missionLogs.length > 0
      ? Math.round(
          (missionLogs.reduce((sum, log) => sum + log.escapeRate, 0) / missionLogs.length) * 100
        )
      : 0;

    // Calculate streak (days trained in a row)
    const sortedLogs = [...missionLogs].sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    );
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of sortedLogs) {
      const logDate = new Date(log.sessionDate);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor(
        (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
        streak = diffDays + 1;
      } else {
        break;
      }
    }

    setStats({
      currentWeek,
      escapeRate,
      trend,
      sessionsLogged: missionLogs.length,
      streak,
      avgEscapeRate,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTrainingLogs();
    setRefreshing(false);
  };

  const recentLogs = trainingLogs
    .filter(log => log.missionId === activeMission?.id)
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
    .slice(0, 5);

  const currentWeekGoal = activeMission?.weeklyGoals?.find(
    g => g.weekNumber === stats.currentWeek
  );

  if (!activeMission) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.greeting}>
              Welcome back!
            </Text>
            <Text variant="bodyLarge" style={styles.subGreeting}>
              Track your training journey
            </Text>
          </View>

          <Card>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              No Active Mission
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Start a 4-week mission to track your progress with structured goals and AI feedback.
            </Text>
            <Button onPress={() => router.push('/(auth)/profile-setup')} style={styles.emptyButton}>
              Start a Mission
            </Button>
          </Card>

          <Card>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Training Log
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Or log a general training session without a mission.
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => router.push('/training/general-log')}
              icon="plus-circle"
            >
              Log General Training
            </Button>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.greeting}>
            Welcome back!
          </Text>
          <Text variant="bodyLarge" style={styles.subGreeting}>
            Let's keep improving
          </Text>
        </View>

        {/* Mission Progress */}
        <MissionProgressCard
          mission={activeMission}
          currentWeek={stats.currentWeek}
          escapeRate={stats.escapeRate}
          trend={stats.trend}
        />

        {/* Today's Game Plan */}
        {gamePlan && <GamePlanCard gamePlan={gamePlan} />}

        {/* Primary Actions */}
        <View style={styles.actionsRow}>
          <Button
            mode="outlined"
            onPress={() => router.push('/training/pre-session')}
            icon="target"
            style={styles.actionButton}
          >
            Set Focus
          </Button>
          <Button
            onPress={() => router.push('/training/post-session')}
            icon="plus-circle"
            style={styles.actionButton}
          >
            Log Session
          </Button>
        </View>

        {/* General Training Log Option */}
        <Button
          mode="text"
          onPress={() => router.push('/training/general-log')}
          icon="notebook"
          style={styles.generalLogButton}
        >
          Log general training
        </Button>

        {/* This Week's Focus */}
        {currentWeekGoal && (
          <Card>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              This Week's Focus
            </Text>
            <Text variant="bodyLarge" style={styles.focusText}>
              {currentWeekGoal.description}
            </Text>
            {currentWeekGoal.videoUrl && (
              <View>
                <Button
                  mode="outlined"
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    try {
                      await openVideoInBrowser({
                        videoUrl: currentWeekGoal.videoUrl!,
                        videoTitle: currentWeekGoal.videoTimestamp || 'Video Tutorial',
                      });
                      // Recheck watched status after closing
                      setTimeout(() => checkVideoWatched(), 1000);
                    } catch (error) {
                      Alert.alert('Error', 'Unable to open video');
                    }
                  }}
                  icon={videoWatched ? "check-circle" : "play-circle"}
                  style={styles.videoButton}
                >
                  {`${videoWatched ? '✓ ' : ''}${currentWeekGoal.videoTimestamp 
                    ? `Watch: ${currentWeekGoal.videoTimestamp}`
                    : 'Watch: Video Tutorial'}`}
                </Button>
                {videoWatched && (
                  <Badge style={styles.watchedBadge} size={20}>
                    Watched
                  </Badge>
                )}
              </View>
            )}
          </Card>
        )}

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Sessions Logged" value={stats.sessionsLogged} />
          <Card style={styles.streakCard}>
            <Text variant="labelMedium" style={styles.streakLabel}>
              Current Streak
            </Text>
            <View style={styles.streakContent}>
              <Text variant="displaySmall" style={styles.streakFire}>
                {stats.streak === 0 ? '💤' : stats.streak < 3 ? '🔥' : stats.streak < 7 ? '🔥🔥' : '🔥🔥🔥'}
              </Text>
              <Text variant="headlineLarge" style={styles.streakNumber}>
                {stats.streak}
              </Text>
              <Text variant="bodyMedium" style={styles.streakDays}>
                day{stats.streak !== 1 ? 's' : ''}
              </Text>
            </View>
            {stats.streak > 0 && (
              <Text variant="bodySmall" style={styles.streakMessage}>
                {stats.streak < 3 ? "Keep it going!" : stats.streak < 7 ? "You're on fire! 🎉" : "Incredible streak! 💪"}
              </Text>
            )}
            {stats.streak === 0 && (
              <Text variant="bodySmall" style={styles.streakMessage}>
                Log a session to start your streak!
              </Text>
            )}
          </Card>
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            label="Avg Escape Rate"
            value={`${stats.avgEscapeRate}%`}
            trend={stats.trend > 0 ? 'up' : stats.trend < 0 ? 'down' : 'neutral'}
            trendValue={stats.trend !== 0 ? `${Math.abs(stats.trend)}% vs last week` : undefined}
          />
        </View>

        {/* Weekly Review Access */}
        {stats.currentWeek > 1 && (
          <Card>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Weekly Progress
            </Text>
            <Text variant="bodyMedium" style={styles.reviewDescription}>
              Check your week {stats.currentWeek - 1} review and see your recurring problems
            </Text>
            <Button
              mode="outlined"
              onPress={() => router.push(`/review/weekly?weekNumber=${stats.currentWeek - 1}` as const)}
              icon="chart-box"
              style={styles.reviewButton}
            >
              {`View Week ${stats.currentWeek - 1} Review`}
            </Button>
          </Card>
        )}

        {/* Recent Sessions */}
        {recentLogs.length > 0 && (
          <Card>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Sessions
            </Text>
            {recentLogs.map((log, index) => (
              <TouchableOpacity
                key={log.id}
                style={[styles.sessionItem, index !== 0 && styles.sessionItemBorder]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/training/log-detail/${log.id}` as const);
                }}
              >
                <View style={styles.sessionHeader}>
                  <Text variant="bodyMedium" style={styles.sessionDate}>
                    {new Date(log.sessionDate).toLocaleDateString()}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.sessionRate,
                      { color: log.escapeRate >= 0.5 ? Colors.success : Colors.textSecondary },
                    ]}
                  >
                    {Math.round(log.escapeRate * 100)}%
                  </Text>
                </View>
                {log.mainProblem && (
                  <Text variant="bodySmall" style={styles.sessionProblem}>
                    Problem: {log.mainProblem}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        actions={[
          {
            icon: 'microphone',
            label: 'Voice Log',
            onPress: () => router.push('/training/post-session'),
          },
          {
            icon: 'lightning-bolt',
            label: 'Quick Log',
            onPress: () => router.push('/training/post-session'),
          },
          {
            icon: 'target',
            label: 'Set Focus',
            onPress: () => router.push('/training/pre-session'),
          },
        ]}
      />
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
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  focusText: {
    color: Colors.text,
    marginBottom: spacing.md,
  },
  videoButton: {
    marginTop: spacing.sm,
  },
  watchedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: Colors.success,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  streakCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  streakLabel: {
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  streakContent: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  streakFire: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  streakNumber: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  streakDays: {
    color: Colors.textSecondary,
  },
  streakMessage: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  sessionItem: {
    paddingVertical: spacing.md,
  },
  sessionItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDate: {
    color: Colors.text,
  },
  sessionRate: {
    fontWeight: 'bold',
  },
  sessionProblem: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  reviewDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.md,
  },
  reviewButton: {
    marginTop: spacing.sm,
  },
  emptyDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
  generalLogButton: {
    marginVertical: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
