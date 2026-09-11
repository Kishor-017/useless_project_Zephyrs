import { useState, useEffect } from 'react';
import { AppState, UserStats, UserConfig, TestResult } from './types';
import { loadUserStats, updateConfig, recordTestCompletion, updateActiveDebt } from './utils/storage';
import { Navbar } from './components/Navbar';
import { LandingSetup } from './components/LandingSetup';
import { TypingTest } from './components/TypingTest';
import { GrassScreen } from './components/GrassScreen';
import { ResultsModal } from './components/ResultsModal';
import { StatsModal } from './components/StatsModal';

export function App() {
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats());
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Persistence check: If unpaid grass debt exists on reload, force Grass screen!
  useEffect(() => {
    const loaded = loadUserStats();
    setUserStats(loaded);
    if (loaded.activeGrassDebtSeconds > 0) {
      setCurrentState('grass');
    }
  }, []);

  const handleSaveConfig = (newConfig: UserConfig) => {
    const updated = updateConfig(newConfig);
    setUserStats(updated);
  };

  const handleStartTest = () => {
    // Prevent taking a test if user still owes grass debt
    if (userStats.activeGrassDebtSeconds > 0) {
      setCurrentState('grass');
    } else {
      setCurrentState('test');
    }
  };

  const handleTestComplete = (result: TestResult) => {
    setLatestResult(result);
    const updatedStats = recordTestCompletion(result);
    setUserStats(updatedStats);

    // If grass debt was incurred, go to grass screen. If 0 (user slow), go to results!
    if (result.calculation.grassDebtSeconds > 0) {
      setCurrentState('grass');
    } else {
      setCurrentState('results');
    }
  };

  const handleUpdateDebt = (remainingSeconds: number, secondsJustPaid: number) => {
    const updated = updateActiveDebt(remainingSeconds, secondsJustPaid);
    setUserStats(updated);
  };

  const handleDebtPaid = () => {
    // Clear active debt in storage
    const updated = updateActiveDebt(0, 0);
    setUserStats(updated);
    setCurrentState('results');
  };

  const handleTestAgain = () => {
    setLatestResult(null);
    setCurrentState('test');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Header Navbar */}
      <Navbar
        currentState={currentState}
        activeDebtSeconds={userStats.activeGrassDebtSeconds}
        onNavigate={(state) => {
          if (userStats.activeGrassDebtSeconds > 0 && state !== 'grass') {
            alert('🌱 You cannot leave! You must pay off your Grass Debt first.');
            return;
          }
          setCurrentState(state);
        }}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {(currentState === 'landing' || currentState === 'setup') && (
          <LandingSetup
            config={userStats.config}
            onSaveConfig={handleSaveConfig}
            onStartTest={handleStartTest}
          />
        )}

        {currentState === 'test' && (
          <TypingTest
            config={userStats.config}
            onTestComplete={handleTestComplete}
          />
        )}

        {currentState === 'grass' && (
          <GrassScreen
            initialDebtSeconds={userStats.activeGrassDebtSeconds}
            onUpdateDebt={handleUpdateDebt}
            onDebtPaid={handleDebtPaid}
          />
        )}
      </main>

      {/* Results Modal */}
      {currentState === 'results' && (
        <ResultsModal
          latestResult={latestResult}
          userStats={userStats}
          onTestAgain={handleTestAgain}
        />
      )}

      {/* Analytics & History Stats Modal */}
      {isStatsOpen && (
        <StatsModal
          userStats={userStats}
          onClose={() => setIsStatsOpen(false)}
          onStatsReset={() => setUserStats(loadUserStats())}
        />
      )}
    </div>
  );
}

export default App;
