import React from 'react';
import { CheckCircle2, RotateCcw, Award, Clock, Zap, Target, Sprout, BarChart2 } from 'lucide-react';
import { TestResult, UserStats } from '../types';
import { formatTimeDisplay, formatGrassRateSummary } from '../utils/math';

interface ResultsModalProps {
  latestResult: TestResult | null;
  userStats: UserStats;
  onTestAgain: () => void;
  onCloseModal?: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  latestResult,
  userStats,
  onTestAgain
}) => {
  const calc = latestResult?.calculation;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 7, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <div className="glass-card animate-pulse-glow" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '36px',
        border: '1px solid rgba(74, 222, 128, 0.4)',
        background: 'rgba(12, 20, 14, 0.95)'
      }}>
        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={36} color="#052e16" />
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
            DEBT PAID. 🌱
          </h2>

          <p style={{ color: '#86efac', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            Nature thanks you. You may return to the keyboard.
          </p>
        </div>

        {/* Latest Test Results Grid */}
        {latestResult && calc && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4ade80', fontWeight: 700, marginBottom: '14px' }}>
              📊 Your Latest Test Performance
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <Zap size={14} color="#4ade80" /> Typing Speed
                </div>
                <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>
                  {latestResult.wpm} <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>WPM</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                  Baseline: {calc.avgWpm} WPM average
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <Target size={14} color="#86efac" /> Accuracy
                </div>
                <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                  {latestResult.accuracy}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                  Chars: {latestResult.charactersTyped} typed
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <Clock size={14} color="#86efac" /> Daily Typing
                </div>
                <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                  {calc.dailyTypingTimeHours}h <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>/ day</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#86efac', marginTop: '2px' }}>
                  Estimated saved: {calc.dailyTimeSavedHours}h / day
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <Sprout size={14} color="#4ade80" /> Grass Debt Paid
                </div>
                <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>
                  {formatTimeDisplay(calc.grassDebtSeconds)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                  Grass Rate: {calc.grassRateHoursPerTypingHour}h grass / hr
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lifetime Stats Summary Box */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '28px'
        }}>
          <h4 style={{ fontSize: '0.9rem', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} /> Lifetime Statistics
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Total Tests</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{userStats.totalTestsCompleted}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Best Speed</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4ade80' }}>{userStats.bestWpm} WPM</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Total Grass Touched</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#86efac' }}>
                {formatTimeDisplay(userStats.totalGrassPaidSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onTestAgain}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          <RotateCcw size={20} />
          <span>TEST AGAIN</span>
        </button>
      </div>
    </div>
  );
};
