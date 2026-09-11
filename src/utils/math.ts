import { CalculationResult, UserConfig } from '../types';

export function calculateGrassDebt(
  userWpm: number,
  config: UserConfig,
  testDurationSeconds: number
): CalculationResult {
  const dailyTypingTimeHours = config.dailyTypingHours + config.dailyTypingMinutes / 60;
  const safeDailyHours = Math.max(0.1, dailyTypingTimeHours); // prevent div 0
  const avgWpm = Math.max(1, config.avgWpm);

  const speedRatio = userWpm / avgWpm;
  
  // Work completed in dailyTypingTimeHours takes avg typist:
  const equivalentAvgHours = safeDailyHours * speedRatio;
  
  // Time saved daily
  const rawDailySavedHours = equivalentAvgHours - safeDailyHours;
  const dailyTimeSavedHours = Math.max(0, rawDailySavedHours);

  // Grass rate: hours of grass owed per hour of typing
  // Grass Rate = Daily Time Saved ÷ Daily Typing Time
  const grassRateHoursPerTypingHour = safeDailyHours > 0 
    ? dailyTimeSavedHours / safeDailyHours 
    : 0;

  // Grass Debt = Grass Rate * Test Duration
  // Test duration converted to hours
  const testDurationHours = testDurationSeconds / 3600;
  const grassDebtHours = grassRateHoursPerTypingHour * testDurationHours;
  const grassDebtSeconds = Math.max(0, grassDebtHours * 3600);

  return {
    dailyTypingTimeHours: safeDailyHours,
    userWpm: Math.round(userWpm),
    avgWpm: Math.round(avgWpm),
    speedRatio: Number(speedRatio.toFixed(2)),
    equivalentAvgHours: Number(equivalentAvgHours.toFixed(2)),
    dailyTimeSavedHours: Number(dailyTimeSavedHours.toFixed(2)),
    grassRateHoursPerTypingHour: Number(grassRateHoursPerTypingHour.toFixed(2)),
    testDurationSeconds: Math.round(testDurationSeconds),
    grassDebtSeconds: Number(grassDebtSeconds.toFixed(1))
  };
}

export function formatTimeDisplay(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 10);
  
  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');
  
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m ${paddedSecs}s`;
  }

  return `${paddedMins}:${paddedSecs}`;
}

export function formatGrassRateSummary(grassRateHours: number): string {
  if (grassRateHours <= 0) {
    return '0 minutes of grass (You are as slow as or slower than average!)';
  }
  const totalMins = Math.round(grassRateHours * 60);
  if (totalMins >= 60) {
    const hrs = (totalMins / 60).toFixed(1).replace('.0', '');
    return `${hrs} hour${totalMins > 60 ? 's' : ''} of grass per hour of typing`;
  }
  return `${totalMins} minute${totalMins > 1 ? 's' : ''} of grass per hour of typing`;
}
