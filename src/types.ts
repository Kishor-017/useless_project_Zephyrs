export type AppState = 'landing' | 'setup' | 'test' | 'grass' | 'results';

export interface UserConfig {
  dailyTypingHours: number;
  dailyTypingMinutes: number;
  avgWpm: number;
}

export interface CalculationResult {
  dailyTypingTimeHours: number; // e.g. 4.0
  userWpm: number;
  avgWpm: number;
  speedRatio: number; // e.g. 80 / 40 = 2.0
  equivalentAvgHours: number; // 4 * 2.0 = 8.0
  dailyTimeSavedHours: number; // 8 - 4 = 4.0
  grassRateHoursPerTypingHour: number; // 4 / 4 = 1.0 (1 hour grass / 1 hour typing)
  testDurationSeconds: number; // e.g. 30 seconds
  grassDebtSeconds: number; // GrassRate * testDuration = 1.0 * 30s = 30s
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  charactersTyped: number;
  testDurationSeconds: number;
  calculation: CalculationResult;
  passageTitle: string;
}

export interface UserStats {
  config: UserConfig;
  activeGrassDebtSeconds: number; // Unpaid debt
  totalTestsCompleted: number;
  totalTimeSavedSeconds: number;
  totalGrassPaidSeconds: number;
  bestWpm: number;
  history: TestResult[];
}
