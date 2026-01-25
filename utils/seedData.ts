import { User, Mission, TrainingLog, BeltLevel, TrainingFrequency, Position } from '../types';
import * as Storage from './storage';
import { generateMissionGoals } from './mockData';

/**
 * Seed the app with realistic training data for a BJJ practitioner
 * This simulates 3 weeks of training (9 sessions)
 */
export async function seedAppWithData() {
  console.log('🌱 Seeding app with realistic BJJ training data...');

  // Create a realistic user
  const user: User = {
    id: 'user-seed-1',
    email: 'john.doe@example.com',
    createdAt: new Date('2024-01-01'),
    beltLevel: 'blue' as BeltLevel,
    trainingFrequency: '3x' as TrainingFrequency,
    timezone: 'America/New_York',
    subscriptionTier: 'free',
  };

  await Storage.saveUser(user);
  console.log('✅ Created user profile');

  // Create an active mission (side control escapes)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 21); // Started 3 weeks ago
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 28); // 4-week mission

  const mission: Mission = {
    id: 'mission-seed-1',
    userId: user.id,
    missionType: 'defense',
    positionFocus: 'side_control' as Position,
    goalDescription: 'Escape side control 50% of the time',
    startDate,
    endDate,
    status: 'active',
    createdAt: startDate,
    weeklyGoals: generateMissionGoals('side_control'),
  };

  await Storage.saveMission(mission);
  await Storage.setActiveMissionId(mission.id);
  console.log('✅ Created 4-week side control mission');

  // Generate realistic training logs over 3 weeks (3 sessions per week = 9 total)
  const trainingLogs: TrainingLog[] = [];
  
  // Week 1: Learning phase (20-30% escape rate)
  const week1Sessions = [
    { daysAgo: 20, attempts: 6, escapes: 1, problem: 'Lost inside elbow position', notes: 'First day focusing on this. Coach showed me the inside elbow concept but I kept losing it when partner put pressure.' },
    { daysAgo: 18, attempts: 5, escapes: 1, problem: "Couldn't create frames early enough", notes: 'Training with Carlos (purple belt). He was heavy on top. Realized I need to frame before he settles.' },
    { daysAgo: 16, attempts: 7, escapes: 2, problem: 'Bad timing on hip escape', notes: 'Better session. Got the inside elbow twice! Hip escape still needs work on timing.' },
  ];

  // Week 2: Building consistency (30-45% escape rate)
  const week2Sessions = [
    { daysAgo: 13, attempts: 6, escapes: 2, problem: 'Gave up back during escape attempt', notes: 'Rolled with Mike and Sarah. Inside elbow is clicking more. Once I gave up back trying to escape too fast.' },
    { daysAgo: 11, attempts: 5, escapes: 2, problem: 'Lost inside elbow position', notes: 'Good training day. 40% escape rate! Still lose the position sometimes when they crossface hard.' },
    { daysAgo: 9, attempts: 6, escapes: 3, problem: 'Partner switched to north-south', notes: '50% today! Starting to feel more comfortable. Need to learn what to do when they switch to north-south.' },
  ];

  // Week 3: Getting better (45-60% escape rate)
  const week3Sessions = [
    { daysAgo: 6, attempts: 5, escapes: 3, problem: 'Too flat on back initially', notes: 'Training felt great. Getting my inside elbow almost every time now. Coach said I need to turn to my side faster.' },
    { daysAgo: 4, attempts: 7, escapes: 4, problem: 'Lost inside elbow position', notes: 'Best session yet! 57% escape rate. Rolled with a brown belt and still got some escapes. Feels like real progress.' },
    { daysAgo: 1, attempts: 6, escapes: 4, problem: "Couldn't create frames early enough", notes: 'Yesterday was awesome. 67% escape rate! Coach noticed the improvement. One round I still got flattened early but recovered.' },
  ];

  const allSessions = [...week1Sessions, ...week2Sessions, ...week3Sessions];

  for (let i = 0; i < allSessions.length; i++) {
    const session = allSessions[i];
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() - session.daysAgo);
    sessionDate.setHours(18, 30, 0, 0); // 6:30 PM training

    const log: TrainingLog = {
      id: `log-seed-${i + 1}`,
      userId: user.id,
      missionId: mission.id,
      sessionDate,
      voiceTranscript: session.notes,
      escapeAttempts: session.attempts,
      successfulEscapes: session.escapes,
      escapeRate: session.escapes / session.attempts,
      mainProblem: session.problem,
      trainingNotes: session.notes,
      intensityLevel: Math.floor(Math.random() * 3) + 7, // 7-9 intensity
      createdAt: sessionDate,
    };

    trainingLogs.push(log);
    await Storage.saveTrainingLog(log);
  }

  console.log(`✅ Created ${trainingLogs.length} training sessions`);
  console.log('📊 Progress: 17% → 67% escape rate over 3 weeks');
  console.log('🎉 Seed data complete! Restart the app to see the data.');

  return {
    user,
    mission,
    trainingLogs,
  };
}

/**
 * Clear all seeded data and start fresh
 */
export async function clearSeedData() {
  await Storage.clearAllData();
  console.log('🗑️ Cleared all seed data');
}
