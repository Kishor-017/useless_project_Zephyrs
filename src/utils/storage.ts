import { UserStats, UserConfig, TestResult } from '../types';

const STORAGE_KEY = 'grass_debt_app_data_v1';

const DEFAULT_CONFIG: UserConfig = {
  dailyTypingHours: 4,
  dailyTypingMinutes: 0,
  avgWpm: 40
};

const DEFAULT_STATS: UserStats = {
  config: DEFAULT_CONFIG,
  activeGrassDebtSeconds: 0,
  totalTestsCompleted: 0,
  totalTimeSavedSeconds: 0,
  totalGrassPaidSeconds: 0,
  bestWpm: 0,
  history: []
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      config: {
        ...DEFAULT_CONFIG,
        ...(parsed.config || {})
      }
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function updateConfig(config: UserConfig): UserStats {
  const current = loadUserStats();
  const updated: UserStats = {
    ...current,
    config
  };
  saveUserStats(updated);
  return updated;
}

export function recordTestCompletion(result: TestResult): UserStats {
  const current = loadUserStats();
  const newDebt = result.calculation.grassDebtSeconds;
  
  const updated: UserStats = {
    ...current,
    activeGrassDebtSeconds: current.activeGrassDebtSeconds + newDebt,
    totalTestsCompleted: current.totalTestsCompleted + 1,
    totalTimeSavedSeconds: current.totalTimeSavedSeconds + (result.calculation.dailyTimeSavedHours * 3600 / 24), // portion saved
    bestWpm: Math.max(current.bestWpm, result.wpm),
    history: [result, ...current.history].slice(0, 50)
  };

  saveUserStats(updated);
  return updated;
}

export function updateActiveDebt(remainingSeconds: number, secondsJustPaid: number): UserStats {
  const current = loadUserStats();
  const safeRemaining = Math.max(0, Number(remainingSeconds.toFixed(1)));
  
  const updated: UserStats = {
    ...current,
    activeGrassDebtSeconds: safeRemaining,
    totalGrassPaidSeconds: current.totalGrassPaidSeconds + secondsJustPaid
  };

  saveUserStats(updated);
  return updated;
}

export function clearAllData(): UserStats {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return DEFAULT_STATS;
}
