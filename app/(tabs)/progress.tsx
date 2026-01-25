import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get('window').width;

type ViewMode = 'week' | 'month' | 'all';

export default function Progress() {
  const router = useRouter();
  const { activeMission, trainingLogs } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({ labels: [], datasets: [{ data: [] }] });
  const [problemCounts, setProblemCounts] = useState<{ problem: string; count: number }[]>([]);

  useEffect(() => {
    if (activeMission) {
      prepareChartData();
      calculateProblemCounts();
    }
  }, [activeMission, trainingLogs, viewMode]);

  const prepareChartData = () => {
    const missionLogs = trainingLogs
      .filter(log => log.missionId === activeMission?.id)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

    if (missionLogs.length === 0) {
      setChartData({ labels: ['No data'], datasets: [{ data: [0] }] });
      return;
    }

    let filteredLogs = missionLogs;
    
    if (viewMode === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredLogs = missionLogs.filter(log => new Date(log.sessionDate) >= weekAgo);
    } else if (viewMode === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      filteredLogs = missionLogs.filter(log => new Date(log.sessionDate) >= monthAgo);
    }

    const labels = filteredLogs.map(log => {
      const date = new Date(log.sessionDate);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const data = filteredLogs.map(log => Math.round(log.escapeRate * 100));

    setChartData({
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [{ data: data.length > 0 ? data : [0] }],
    });
  };

  const calculateProblemCounts = () => {
    const missionLogs = trainingLogs.filter(log => log.missionId === activeMission?.id);
    const counts: Record<string, number> = {};

    missionLogs.forEach(log => {
      if (log.mainProblem) {
        counts[log.mainProblem] = (counts[log.mainProblem] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .map(([problem, count]) => ({ problem, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setProblemCounts(sorted);
  };

  // Filter logs based on toggle
  const displayLogs = showAllLogs 
    ? trainingLogs
    : trainingLogs.filter(log => log.missionId === activeMission?.id);
  
  const missionLogs = trainingLogs
    .filter(log => log.missionId === activeMission?.id)
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  
  const sortedDisplayLogs = displayLogs
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  
  const hasGeneralLogs = trainingLogs.some(log => !log.missionId);

  const averageEscapeRate = missionLogs.length > 0
    ? Math.round(
        (missionLogs.reduce((sum, log) => sum + log.escapeRate, 0) / missionLogs.length) * 100
      )
    : 0;

  const firstLogRate = missionLogs.length > 0 
    ? Math.round(missionLogs[missionLogs.length - 1].escapeRate * 100) 
    : 0;
  const latestLogRate = missionLogs.length > 0 
    ? Math.round(missionLogs[0].escapeRate * 100) 
    : 0;
  const improvement = latestLogRate - firstLogRate;

  if (!activeMission) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.emptyStateContainer}>
          <Text variant="displayMedium" style={styles.emptyEmoji}>
            🎯
          </Text>
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            No Active Mission
          </Text>
          <Text variant="bodyLarge" style={styles.emptyDescription}>
            Start a 4-week mission to track your progress and see your improvement over time!
          </Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/(auth)/profile-setup')}
            icon="rocket-launch"
            style={styles.emptyButton}
          >
            Start Your First Mission
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Progress
        </Text>

        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'all', label: 'All Time' },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Escape Rate Chart */}
        <Card>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Escape Success Rate
          </Text>
          {chartData.datasets[0].data.length > 0 && chartData.datasets[0].data[0] !== 0 ? (
            <>
              <LineChart
                data={chartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: Colors.surface,
                  backgroundGradientFrom: Colors.surface,
                  backgroundGradientTo: Colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(88, 166, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(230, 237, 243, ${opacity})`,
                  style: {
                    borderRadius: 12,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: Colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
              />
              {improvement > 0 && (
                <View style={styles.insight}>
                  <Text variant="bodyMedium" style={styles.insightText}>
                    📈 You've improved from {firstLogRate}% → {latestLogRate}% (+{improvement}%)!
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text variant="displaySmall" style={styles.noDataEmoji}>
                📊
              </Text>
              <Text variant="titleLarge" style={styles.noDataTitle}>
                No Progress Data Yet
              </Text>
              <Text variant="bodyMedium" style={styles.noDataText}>
                Start tracking your escape rate by logging your first training session!
              </Text>
              <Button 
                mode="outlined" 
                onPress={() => router.push('/training/post-session')}
                icon="plus-circle"
                style={styles.noDataButton}
              >
                Log Your First Session
              </Button>
            </View>
          )}
        </Card>

        {/* Training Consistency Calendar */}
        <Card>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Training Consistency
          </Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 28 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (27 - i));
              const hasSession = missionLogs.some(
                log =>
                  new Date(log.sessionDate).toDateString() === date.toDateString()
              );

              return (
                <View
                  key={i}
                  style={[
                    styles.calendarDay,
                    hasSession && styles.calendarDayActive,
                  ]}
                />
              );
            })}
          </View>
          <Text variant="bodyMedium" style={styles.consistencyText}>
            {missionLogs.filter(log => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(log.sessionDate) >= weekAgo;
            }).length}{' '}
            sessions logged this week
          </Text>
        </Card>

        {/* Problem Patterns */}
        {problemCounts.length > 0 && (
          <Card>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Most Common Problems
            </Text>
            {problemCounts.map((item, index) => (
              <View key={item.problem} style={styles.problemItem}>
                <View style={styles.problemRank}>
                  <Text variant="titleMedium" style={styles.problemRankText}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.problemDetails}>
                  <Text variant="bodyLarge" style={styles.problemText}>
                    {item.problem}
                  </Text>
                  <Text variant="bodySmall" style={styles.problemCount}>
                    Occurred {item.count} time{item.count !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Session History */}
        <Card>
          <View style={styles.sessionHistoryHeader}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Session History
            </Text>
            {hasGeneralLogs && (
              <SegmentedButtons
                value={showAllLogs ? 'all' : 'mission'}
                onValueChange={(value) => setShowAllLogs(value === 'all')}
                buttons={[
                  { value: 'mission', label: 'Mission' },
                  { value: 'all', label: 'All' },
                ]}
                style={styles.filterButtons}
              />
            )}
          </View>
          {sortedDisplayLogs.length > 0 ? (
            sortedDisplayLogs.slice(0, 10).map((log, index) => (
              <TouchableOpacity
                key={log.id}
                style={[styles.sessionItem, index !== 0 && styles.sessionItemBorder]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/training/log-detail/${log.id}` as const);
                }}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionDateContainer}>
                    <Text variant="bodyLarge" style={styles.sessionDate}>
                      {new Date(log.sessionDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                    {log.generalTrainingType && (
                      <View style={styles.generalBadge}>
                        <Text variant="bodySmall" style={styles.generalBadgeText}>
                          {log.generalTrainingType}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    variant="headlineSmall"
                    style={[
                      styles.sessionRate,
                      {
                        color:
                          log.escapeRate >= 0.5
                            ? Colors.success
                            : log.escapeRate >= 0.3
                            ? Colors.accent
                            : Colors.error,
                      },
                    ]}
                  >
                    {Math.round(log.escapeRate * 100)}%
                  </Text>
                </View>
                <View style={styles.sessionStats}>
                  <Text variant="bodySmall" style={styles.sessionStat}>
                    {log.successfulEscapes}/{log.escapeAttempts} escapes
                  </Text>
                  {log.intensityLevel && (
                    <Text variant="bodySmall" style={styles.sessionStat}>
                      • Intensity: {log.intensityLevel}/10
                    </Text>
                  )}
                </View>
                {log.mainProblem && (
                  <Text variant="bodySmall" style={styles.sessionProblem}>
                    Problem: {log.mainProblem}
                  </Text>
                )}
                {log.trainingNotes && (
                  <Text variant="bodySmall" style={styles.sessionNotes} numberOfLines={2}>
                    {log.trainingNotes}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noSessionsText}>
              No sessions logged yet
            </Text>
          )}
        </Card>

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
  content: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  segmentedButtons: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 12,
  },
  insight: {
    backgroundColor: Colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  insightText: {
    color: Colors.success,
    textAlign: 'center',
  },
  noDataContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  noDataEmoji: {
    fontSize: 64,
    lineHeight: 72,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  noDataTitle: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  noDataText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  noDataButton: {
    marginTop: spacing.sm,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: spacing.md,
  },
  calendarDay: {
    width: (screenWidth - 64 - 27 * 4) / 7,
    height: (screenWidth - 64 - 27 * 4) / 7,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
  },
  calendarDayActive: {
    backgroundColor: Colors.primary,
  },
  consistencyText: {
    color: Colors.text,
    textAlign: 'center',
  },
  problemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  problemRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  problemRankText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  problemDetails: {
    flex: 1,
  },
  problemText: {
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  problemCount: {
    color: Colors.textSecondary,
  },
  sessionHistoryHeader: {
    marginBottom: spacing.md,
  },
  filterButtons: {
    marginTop: spacing.sm,
  },
  sessionItem: {
    paddingVertical: spacing.md,
  },
  sessionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  generalBadge: {
    backgroundColor: Colors.accent + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  generalBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sessionItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sessionDate: {
    color: Colors.text,
  },
  sessionRate: {
    fontWeight: 'bold',
  },
  sessionStats: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  sessionStat: {
    color: Colors.textSecondary,
    marginRight: spacing.sm,
  },
  sessionProblem: {
    color: Colors.accent,
    marginBottom: spacing.xs,
  },
  sessionNotes: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  noSessionsText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    lineHeight: 88,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyDescription: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
