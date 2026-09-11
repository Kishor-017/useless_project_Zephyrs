import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Zap, Target, Clock, AlertTriangle, Play } from 'lucide-react';
import { Passage, PASSAGES } from '../utils/passages';
import { UserConfig, TestResult } from '../types';
import { calculateGrassDebt } from '../utils/math';
import { playKeyClickSound } from '../utils/sound';

interface TypingTestProps {
  config: UserConfig;
  onTestComplete: (result: TestResult) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  config,
  onTestComplete
}) => {
  const [selectedPassage, setSelectedPassage] = useState<Passage>(PASSAGES[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Timer loop when test is active
  useEffect(() => {
    if (!startTime || isCompleted) return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [startTime, isCompleted]);

  // Focus input automatically
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, [selectedPassage]);

  // Select new passage
  const handleSelectPassage = (passage: Passage) => {
    setSelectedPassage(passage);
    resetTest();
  };

  const handleRandomPassage = () => {
    const available = PASSAGES.filter(p => p.id !== selectedPassage.id);
    const random = available[Math.floor(Math.random() * available.length)];
    setSelectedPassage(random || PASSAGES[0]);
    resetTest();
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTotalErrors(0);
    setIsCompleted(false);
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  };

  // Live Metrics calculations
  const text = selectedPassage.text;
  const elapsedSeconds = startTime 
    ? ((endTime || now) - startTime) / 1000 
    : 0;

  let correctCount = 0;
  let incorrectCount = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === text[i]) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const minutesElapsed = Math.max(0.001, elapsedSeconds / 60);
  const liveWpm = Math.round((correctCount / 5) / minutesElapsed);
  const totalTyped = userInput.length;
  const rawAccuracy = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 100;
  const liveAccuracy = Math.max(0, Math.min(100, Math.round(rawAccuracy)));

  // Key handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const newValue = e.target.value;
    if (newValue.length > text.length) return; // limit to text length

    // Start timer on first keystroke
    if (!startTime && newValue.length > 0) {
      setStartTime(Date.now());
    }

    // Play click / error sound
    const charIndex = newValue.length - 1;
    if (charIndex >= 0) {
      const isMismatch = newValue[charIndex] !== text[charIndex];
      playKeyClickSound(isMismatch);
      if (isMismatch && newValue.length > userInput.length) {
        setTotalErrors(prev => prev + 1);
      }
    }

    setUserInput(newValue);

    // Check completion condition
    if (newValue.length === text.length) {
      const finalEndTime = Date.now();
      setEndTime(finalEndTime);
      setIsCompleted(true);

      const finalElapsedSeconds = Math.max(1, (finalEndTime - (startTime || finalEndTime)) / 1000);
      const finalMinutes = finalElapsedSeconds / 60;
      
      let finalCorrect = 0;
      for (let i = 0; i < text.length; i++) {
        if (newValue[i] === text[i]) finalCorrect++;
      }
      
      const finalWpm = Math.round((finalCorrect / 5) / finalMinutes);
      const finalAccuracy = Math.round((finalCorrect / text.length) * 100);

      const calculation = calculateGrassDebt(finalWpm, config, finalElapsedSeconds);

      const testResult: TestResult = {
        id: `test_${Date.now()}`,
        timestamp: Date.now(),
        wpm: finalWpm,
        rawWpm: Math.round((text.length / 5) / finalMinutes),
        accuracy: finalAccuracy,
        charactersTyped: text.length,
        testDurationSeconds: Math.round(finalElapsedSeconds),
        calculation,
        passageTitle: selectedPassage.title
      };

      // Trigger completion callback after slight delay for visual satisfaction
      setTimeout(() => {
        onTestComplete(testResult);
      }, 500);
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={() => hiddenInputRef.current?.focus()}
      style={{ padding: '30px 0 60px 0', cursor: 'text' }}
    >
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Top Controls & Live Stats Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Passage Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {PASSAGES.map((p) => (
              <button
                key={p.id}
                onClick={(e) => { e.stopPropagation(); handleSelectPassage(p); }}
                className={`btn ${selectedPassage.id === p.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {p.title} ({p.category})
              </button>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); handleRandomPassage(); }}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              title="Pick random passage"
            >
              <RefreshCw size={14} />
              <span>Random</span>
            </button>
          </div>

          {/* Live Metrics Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} color="#4ade80" />
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>
                {startTime ? liveWpm : 0} <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>WPM</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={18} color="#86efac" />
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                {startTime ? liveAccuracy : 100}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} color="#86efac" />
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                {elapsedSeconds.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* Hidden Input Field to capture typing */}
        <input
          ref={hiddenInputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', left: '-9999px' }}
          autoFocus
        />

        {/* Passage Display Box */}
        <div className="glass-card" style={{
          padding: '40px 48px',
          minHeight: '220px',
          position: 'relative',
          lineHeight: 1.8,
          fontSize: '1.4rem',
          letterSpacing: '0.01em',
          userSelect: 'none',
          boxShadow: startTime ? '0 0 40px rgba(34, 197, 94, 0.15)' : 'none'
        }}>
          {!startTime && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#4ade80',
              fontWeight: 600,
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '4px 12px',
              borderRadius: '9999px'
            }}>
              <Play size={12} />
              <span>Start typing to begin timing</span>
            </div>
          )}

          {/* Render Text character by character */}
          <div className="font-mono" style={{ wordBreak: 'break-word', color: '#6b7280' }}>
            {text.split('').map((char, index) => {
              let charStyle: React.CSSProperties = {
                position: 'relative',
                transition: 'color 0.1s ease, background-color 0.1s ease'
              };
              
              const isTyped = index < userInput.length;
              const isCurrent = index === userInput.length;
              const isCorrect = isTyped && userInput[index] === char;

              if (isTyped) {
                if (isCorrect) {
                  charStyle.color = '#4ade80';
                  charStyle.fontWeight = '600';
                } else {
                  charStyle.color = '#ffffff';
                  charStyle.backgroundColor = 'rgba(239, 68, 68, 0.4)';
                  charStyle.borderRadius = '2px';
                  charStyle.textDecoration = 'underline red';
                }
              }

              return (
                <span key={index} style={charStyle}>
                  {isCurrent && (
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      bottom: '-2px',
                      width: '100%',
                      height: '3px',
                      backgroundColor: '#22c55e',
                      boxShadow: '0 0 10px #4ade80',
                      animation: 'caretBlink 1s infinite'
                    }} />
                  )}
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Progress & Reset Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '24px',
          padding: '0 8px'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            Progress: <strong style={{ color: '#ffffff' }}>{userInput.length}</strong> / {text.length} characters
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); resetTest(); }}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} />
            <span>Reset Passage</span>
          </button>
        </div>

        {/* Math Context Reminder */}
        <div style={{
          marginTop: '36px',
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'rgba(15, 23, 18, 0.6)',
          border: '1px dashed rgba(34, 197, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: '#9ca3af'
        }}>
          <AlertTriangle size={18} color="#86efac" style={{ flexShrink: 0 }} />
          <div>
            <strong>Baseline:</strong> {config.avgWpm} WPM | <strong>Daily typing:</strong> {config.dailyTypingHours}h {config.dailyTypingMinutes}m.
            If your WPM exceeds baseline, time saved will accumulate into <strong>Grass Debt</strong> immediately after completing this passage!
          </div>
        </div>
      </div>
    </div>
  );
};
