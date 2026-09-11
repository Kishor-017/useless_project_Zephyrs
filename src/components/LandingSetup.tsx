import React, { useState } from 'react';
import { Sprout, Keyboard, Clock, ArrowRight, Zap, Info, Sparkles } from 'lucide-react';
import { UserConfig } from '../types';
import { formatGrassRateSummary, calculateGrassDebt } from '../utils/math';

interface LandingSetupProps {
  config: UserConfig;
  onSaveConfig: (config: UserConfig) => void;
  onStartTest: () => void;
}

export const LandingSetup: React.FC<LandingSetupProps> = ({
  config,
  onSaveConfig,
  onStartTest
}) => {
  const [hours, setHours] = useState<number>(config.dailyTypingHours);
  const [minutes, setMinutes] = useState<number>(config.dailyTypingMinutes);
  const [avgWpm, setAvgWpm] = useState<number>(config.avgWpm);
  const [step, setStep] = useState<'hero' | 'config'>('hero');

  // Preview mock calculation at 80 WPM
  const mockCalc = calculateGrassDebt(80, { dailyTypingHours: hours, dailyTypingMinutes: minutes, avgWpm }, 60);

  const handleProceedToTest = () => {
    onSaveConfig({
      dailyTypingHours: hours,
      dailyTypingMinutes: minutes,
      avgWpm
    });
    onStartTest();
  };

  return (
    <div style={{ padding: '40px 0 80px 0', minHeight: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container">
        {step === 'hero' ? (
          /* HERO LANDING PAGE */
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            {/* Plant Icon Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#86efac',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '28px'
            }}>
              <Sprout size={18} className="animate-float" />
              <span>Intentionally Useless Productivity Tool</span>
            </div>

            {/* Title & Tagline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              GRASS DEBT <span style={{ color: '#4ade80' }}>🌱</span>
            </h1>

            <h2 className="text-gradient-bright" style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.85rem)',
              fontWeight: 600,
              marginBottom: '28px'
            }}>
              “The time you save is the time you owe.”
            </h2>

            {/* Short explanation block */}
            <div className="glass-card" style={{
              padding: '28px 36px',
              marginBottom: '40px',
              textAlign: 'left',
              borderLeft: '4px solid #22c55e',
              background: 'rgba(18, 26, 20, 0.85)'
            }}>
              <p style={{
                fontSize: '1.2rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                margin: 0
              }}>
                Type faster than average? <strong>Congratulations.</strong> You've saved some time.
                <br />
                <span style={{ color: '#86efac', fontStyle: 'italic', display: 'block', marginTop: '8px' }}>
                  Unfortunately, you now owe that exact time to nature. Touch grass to repay your debt.
                </span>
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '44px',
              textAlign: 'left'
            }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <Zap size={24} color="#4ade80" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>1. Type Fast</h3>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Take a real-time typing test against human baselines.</p>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <Clock size={24} color="#4ade80" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>2. Save Time</h3>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Our math converts WPM gains into exact hours saved.</p>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <Sprout size={24} color="#4ade80" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>3. Hold The Grass</h3>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Touch & physically hold the screen to unlock your next test.</p>
              </div>
            </div>

            {/* Start CTA */}
            <button
              onClick={() => setStep('config')}
              className="btn btn-primary btn-lg animate-pulse-glow"
              style={{ minWidth: '220px' }}
            >
              <span>START NOW</span>
              <ArrowRight size={22} />
            </button>
          </div>
        ) : (
          /* USER SETUP CONFIGURATION */
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.875rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.1em' }}>
                STEP 1 OF 2 — BASELINE SETUP
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
                Calculate Your Baseline
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
                Set your daily typing habits to calibrate your personal Grass Rate.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Daily Typing Time */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <Clock size={20} color="#22c55e" />
                  <span>Daily typing time</span>
                </label>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>
                  “How many hours do you spend typing every day?”
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600 }}>Hours</span>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        marginTop: '6px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600 }}>Minutes</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        marginTop: '6px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {[2, 4, 6, 8].map((h) => (
                    <button
                      key={h}
                      onClick={() => { setHours(h); setMinutes(0); }}
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      {h} hours/day
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(34, 197, 94, 0.15)' }} />

              {/* Average Typing Speed Baseline */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <Keyboard size={20} color="#22c55e" />
                  <span>Average typing speed (Baseline)</span>
                </label>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '16px' }}>
                  This is the typing speed we'll use as the average human baseline. Default is <strong>40 WPM</strong>.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={avgWpm}
                    onChange={(e) => setAvgWpm(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#22c55e', height: '8px', cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#4ade80',
                    minWidth: '90px',
                    textAlign: 'right'
                  }}>
                    {avgWpm} WPM
                  </span>
                </div>
              </div>

              {/* Live Grass Rate Preview Box */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}>
                <Info size={22} color="#86efac" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🌱 Estimated Grass Rate Preview (if you type 80 WPM)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    {formatGrassRateSummary(mockCalc.grassRateHoursPerTypingHour)}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                <button
                  onClick={() => setStep('hero')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToTest}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  <span>PROCEED TO TYPING TEST</span>
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
