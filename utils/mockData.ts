import { Mission, TrainingLog, WeeklyReview, Position, WeeklyGoal } from '../types';
import { SIDE_CONTROL_VIDEOS, MOUNT_ESCAPE_VIDEOS, BACK_ESCAPE_VIDEOS, GUARD_RETENTION_VIDEOS, CLOSED_GUARD_VIDEOS, OPEN_GUARD_VIDEOS, HALF_GUARD_VIDEOS } from '../constants/videoLinks';

export const generateMissionGoals = (position: Position): WeeklyGoal[] => {
  const goalsMap: Record<Position, WeeklyGoal[]> = {
    side_control: [
      {
        weekNumber: 1,
        description: 'Master inside elbow concept + basic escape',
        videoUrl: SIDE_CONTROL_VIDEOS.week1.url,
        videoTimestamp: SIDE_CONTROL_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Add frame timing and hip escape',
        videoUrl: SIDE_CONTROL_VIDEOS.week2.url,
        videoTimestamp: SIDE_CONTROL_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Chain escapes under resistance',
        videoUrl: SIDE_CONTROL_VIDEOS.week3.url,
        videoTimestamp: SIDE_CONTROL_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Test and refine under pressure',
        videoUrl: SIDE_CONTROL_VIDEOS.week4.url,
        videoTimestamp: SIDE_CONTROL_VIDEOS.week4.title,
      },
    ],
    mount: [
      {
        weekNumber: 1,
        description: 'Defensive framing and trap & roll basics',
        videoUrl: MOUNT_ESCAPE_VIDEOS.week1.url,
        videoTimestamp: MOUNT_ESCAPE_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Elbow escape fundamentals',
        videoUrl: MOUNT_ESCAPE_VIDEOS.week2.url,
        videoTimestamp: MOUNT_ESCAPE_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Combining escapes and transitions',
        videoUrl: MOUNT_ESCAPE_VIDEOS.week3.url,
        videoTimestamp: MOUNT_ESCAPE_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Live testing and refinement',
        videoUrl: MOUNT_ESCAPE_VIDEOS.week4.url,
        videoTimestamp: MOUNT_ESCAPE_VIDEOS.week4.title,
      },
    ],
    back: [
      {
        weekNumber: 1,
        description: 'Hand fighting and preventing hooks',
        videoUrl: BACK_ESCAPE_VIDEOS.week1.url,
        videoTimestamp: BACK_ESCAPE_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Escaping the back control',
        videoUrl: BACK_ESCAPE_VIDEOS.week2.url,
        videoTimestamp: BACK_ESCAPE_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Counter-attacks and reversals',
        videoUrl: BACK_ESCAPE_VIDEOS.week3.url,
        videoTimestamp: BACK_ESCAPE_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Stress testing under pressure',
        videoUrl: BACK_ESCAPE_VIDEOS.week4.url,
        videoTimestamp: BACK_ESCAPE_VIDEOS.week4.title,
      },
    ],
    guard: [
      {
        weekNumber: 1,
        description: 'Basic guard retention concepts',
        videoUrl: GUARD_RETENTION_VIDEOS.week1.url,
        videoTimestamp: GUARD_RETENTION_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Framing and distance management',
        videoUrl: GUARD_RETENTION_VIDEOS.week2.url,
        videoTimestamp: GUARD_RETENTION_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Recovery techniques',
        videoUrl: GUARD_RETENTION_VIDEOS.week3.url,
        videoTimestamp: GUARD_RETENTION_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Live guard retention drills',
        videoUrl: GUARD_RETENTION_VIDEOS.week4.url,
        videoTimestamp: GUARD_RETENTION_VIDEOS.week4.title,
      },
    ],
    closed_guard: [
      {
        weekNumber: 1,
        description: 'Posture breaking fundamentals',
        videoUrl: CLOSED_GUARD_VIDEOS.week1.url,
        videoTimestamp: CLOSED_GUARD_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Basic submission setups',
        videoUrl: CLOSED_GUARD_VIDEOS.week2.url,
        videoTimestamp: CLOSED_GUARD_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Chaining attacks',
        videoUrl: CLOSED_GUARD_VIDEOS.week3.url,
        videoTimestamp: CLOSED_GUARD_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Testing your A-game',
        videoUrl: CLOSED_GUARD_VIDEOS.week4.url,
        videoTimestamp: CLOSED_GUARD_VIDEOS.week4.title,
      },
    ],
    open_guard: [
      {
        weekNumber: 1,
        description: 'Open guard basics and grips',
        videoUrl: OPEN_GUARD_VIDEOS.week1.url,
        videoTimestamp: OPEN_GUARD_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Sweeps from open guard',
        videoUrl: OPEN_GUARD_VIDEOS.week2.url,
        videoTimestamp: OPEN_GUARD_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Submission threats',
        videoUrl: OPEN_GUARD_VIDEOS.week3.url,
        videoTimestamp: OPEN_GUARD_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Live sparring from open guard',
        videoUrl: OPEN_GUARD_VIDEOS.week4.url,
        videoTimestamp: OPEN_GUARD_VIDEOS.week4.title,
      },
    ],
    half_guard: [
      {
        weekNumber: 1,
        description: 'Half guard fundamentals',
        videoUrl: HALF_GUARD_VIDEOS.week1.url,
        videoTimestamp: HALF_GUARD_VIDEOS.week1.title,
      },
      {
        weekNumber: 2,
        description: 'Sweeps and recoveries',
        videoUrl: HALF_GUARD_VIDEOS.week2.url,
        videoTimestamp: HALF_GUARD_VIDEOS.week2.title,
      },
      {
        weekNumber: 3,
        description: 'Submissions from half guard',
        videoUrl: HALF_GUARD_VIDEOS.week3.url,
        videoTimestamp: HALF_GUARD_VIDEOS.week3.title,
      },
      {
        weekNumber: 4,
        description: 'Testing your half guard game',
        videoUrl: HALF_GUARD_VIDEOS.week4.url,
        videoTimestamp: HALF_GUARD_VIDEOS.week4.title,
      },
    ],
  };

  return goalsMap[position] || goalsMap.side_control;
};

export const mockTranscribe = async (audioUri: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockTranscripts = [
    "Today was tough. I tried to escape side control about 5 times but only got out twice. Main problem was losing my inside elbow position when they crossfaced me. Training partners were a blue belt and a purple belt, both were pretty heavy on top.",
    "Good session! Attempted side control escapes 4 times, successful 3 times. I'm getting better at keeping that inside elbow. One time I lost it when the person switched to north-south. Intensity was probably 7 out of 10 today.",
    "Rough day. Got stuck under side control 6 times, only escaped once. I keep making the same mistake - not getting my frames in early enough. By the time I try to frame, they're already settled. Need to work on this.",
    "Great progress! 5 escape attempts, 4 successes. The inside elbow concept is really clicking now. My training partner mentioned I'm getting much harder to hold down. Feels good!",
  ];
  
  return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
};

export const mockParseTranscript = async (transcript: string): Promise<{
  escapeAttempts: number;
  successfulEscapes: number;
  mainProblem: string;
  trainingNotes: string;
  intensityLevel: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mock parsing (in real app, this would use GPT-4)
  const escapeAttempts = Math.floor(Math.random() * 4) + 3; // 3-6
  const successfulEscapes = Math.floor(Math.random() * escapeAttempts);
  
  const problems = [
    'Lost inside elbow position',
    'Couldn\'t create frames early enough',
    'Gave up back during escape attempt',
    'Bad timing on hip escape',
    'Partner switched to north-south',
    'Too flat on back, couldn\'t turn',
  ];
  
  return {
    escapeAttempts,
    successfulEscapes,
    mainProblem: problems[Math.floor(Math.random() * problems.length)],
    trainingNotes: transcript,
    intensityLevel: Math.floor(Math.random() * 4) + 6, // 6-10
  };
};

export const generateMockLogs = (missionId: string, count: number = 10): TrainingLog[] => {
  const logs: TrainingLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = count - i;
    const sessionDate = new Date(now);
    sessionDate.setDate(sessionDate.getDate() - daysAgo);
    
    const escapeAttempts = Math.floor(Math.random() * 4) + 3;
    const successfulEscapes = Math.floor(Math.random() * (escapeAttempts + 1));
    
    logs.push({
      id: `log-${i}`,
      userId: 'user-1',
      missionId,
      sessionDate,
      escapeAttempts,
      successfulEscapes,
      escapeRate: escapeAttempts > 0 ? successfulEscapes / escapeAttempts : 0,
      mainProblem: ['Lost inside elbow', 'Bad framing', 'Timing issues', 'Gave up back'][Math.floor(Math.random() * 4)],
      trainingNotes: 'Mock training notes',
      intensityLevel: Math.floor(Math.random() * 4) + 6,
      createdAt: sessionDate,
    });
  }
  
  return logs;
};
