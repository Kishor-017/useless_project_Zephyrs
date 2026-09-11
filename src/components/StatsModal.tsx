import React from 'react';
import { X, Trophy, History, Trash2, Sprout } from 'lucide-react';
import { UserStats } from '../types';
import { formatTimeDisplay } from '../utils/math';
import { clearAllData } from '../utils/storage';

interface StatsModalProps {
  userStats: UserStats;
  onClose: () => void;
  onStatsReset: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  userStats,
  onClose,
  onStatsReset
}) => {
  const handleClear = () => {
    if (confirm('Are you sure you want to reset all Grass Debt history and settings?')) {
      clearAllData();
      onStatsReset();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 7, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <div className="glass-card" style={{
        maxWidth: '650px',
        width: '100%',
        padding: '32px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={24} color="#4ade80" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Grass Debt Analytics
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Lifetime Stats Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tests Taken</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{userStats.totalTestsCompleted}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Personal Best WPM</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80' }}>{userStats.bestWpm}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Grass Touched</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#86efac' }}>
              {formatTimeDisplay(userStats.totalGrassPaidSeconds)}
            </div>
          </div>
        </div>

        {/* History List */}
        <h3 style={{ fontSize: '1rem', color: '#86efac', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={16} /> Recent Test History
        </h3>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {userStats.history.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '30px 0' }}>
              No tests completed yet. Take a test to incur grass debt!
            </div>
          ) : (
            userStats.history.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(18, 26, 20, 0.6)',
                border: '1px solid rgba(34, 197, 94, 0.15)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.passageTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(item.timestamp).toLocaleTimeString()} — {item.accuracy}% Accuracy
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>
                    {item.wpm} WPM
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sprout size={12} /> Debt: {formatTimeDisplay(item.calculation.grassDebtSeconds)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={handleClear}
          className="btn btn-secondary"
          style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
        >
          <Trash2 size={16} />
          <span>Reset All Stats & History</span>
        </button>
      </div>
    </div>
  );
};
