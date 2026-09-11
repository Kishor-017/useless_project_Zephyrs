import React from 'react';
import { Sprout, BarChart3, Settings, ShieldAlert } from 'lucide-react';
import { AppState } from '../types';
import { formatTimeDisplay } from '../utils/math';

interface NavbarProps {
  currentState: AppState;
  activeDebtSeconds: number;
  onNavigate: (state: AppState) => void;
  onOpenStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentState,
  activeDebtSeconds,
  onNavigate,
  onOpenStats
}) => {
  const hasActiveDebt = activeDebtSeconds > 0;

  return (
    <header style={{
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(34, 197, 94, 0.12)',
      background: 'rgba(7, 10, 8, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => {
          if (!hasActiveDebt) onNavigate('landing');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: hasActiveDebt ? 'not-allowed' : 'pointer'
        }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
        }}>
          <Sprout size={24} color="#052e16" />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            GRASS DEBT <span style={{ color: '#4ade80' }}>🌱</span>
          </h1>
          <p style={{
            fontSize: '0.75rem',
            color: '#86efac',
            margin: 0,
            opacity: 0.8,
            fontWeight: 500
          }}>
            The time you save is the time you owe.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Active Debt Badge */}
        {hasActiveDebt && (
          <div 
            onClick={() => onNavigate('grass')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              animation: 'pulseGlow 2s infinite'
            }}
          >
            <ShieldAlert size={16} />
            <span>UNPAID DEBT: {formatTimeDisplay(activeDebtSeconds)}</span>
          </div>
        )}

        {/* Action Buttons */}
        {!hasActiveDebt && (
          <>
            <button
              onClick={() => onNavigate('setup')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              title="Configure Baseline & Daily Hours"
            >
              <Settings size={16} />
              <span className="hide-mobile">Setup</span>
            </button>

            <button
              onClick={onOpenStats}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              title="View History & Lifetime Stats"
            >
              <BarChart3 size={16} />
              <span className="hide-mobile">Stats</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
