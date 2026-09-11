import React, { useState, useEffect, useRef } from 'react';
import { Sprout, PauseCircle, Hand, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatTimeDisplay } from '../utils/math';
import { FUNNY_GRASS_MESSAGES } from '../utils/passages';
import { startGrassRustleSound, stopGrassRustleSound, playDebtPaidChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface GrassScreenProps {
  initialDebtSeconds: number;
  onUpdateDebt: (remainingSeconds: number, secondsPaidDelta: number) => void;
  onDebtPaid: () => void;
}

interface Blade {
  x: number;
  height: number;
  width: number;
  lean: number;
  flexibility: number;
  color: string;
  flowerColor?: string;
  flowerSize?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const GrassScreen: React.FC<GrassScreenProps> = ({
  initialDebtSeconds,
  onUpdateDebt,
  onDebtPaid
}) => {
  const [debtSeconds, setDebtSeconds] = useState<number>(initialDebtSeconds);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);
  const requestAnimRef = useRef<number | null>(null);

  // Sync internal state if prop updates externally
  useEffect(() => {
    setDebtSeconds(initialDebtSeconds);
  }, [initialDebtSeconds]);

  // Cycle funny messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % FUNNY_GRASS_MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Main Debt Countdown Timer Loop (Runs only when touching)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTouching && debtSeconds > 0) {
      startGrassRustleSound();
      lastTickTimeRef.current = Date.now();

      timer = setInterval(() => {
        const now = Date.now();
        const deltaSec = (now - (lastTickTimeRef.current || now)) / 1000;
        lastTickTimeRef.current = now;

        setDebtSeconds(prev => {
          const next = Math.max(0, prev - deltaSec);
          onUpdateDebt(next, deltaSec);

          if (next <= 0) {
            // Debt complete!
            stopGrassRustleSound();
            setIsTouching(false);
            playDebtPaidChime();

            // Launch nature celebration confetti
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#22c55e', '#4ade80', '#15803d', '#fef08a', '#ffffff']
            });

            setTimeout(() => {
              onDebtPaid();
            }, 600);
          }

          return next;
        });
      }, 100);
    } else {
      stopGrassRustleSound();
    }

    return () => {
      clearInterval(timer);
      stopGrassRustleSound();
    };
  }, [isTouching, debtSeconds]);

  // Canvas Physics & Grass Animation Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    // Generate Blades of Grass
    const numBlades = Math.floor(width / 3.5);
    const blades: Blade[] = [];
    const colors = ['#15803d', '#166534', '#22c55e', '#4ade80', '#14532d', '#86efac'];
    const flowerColors = ['#fef08a', '#f472b6', '#a78bfa', '#38bdf8', '#ffffff'];

    for (let i = 0; i < numBlades; i++) {
      const isFlower = Math.random() < 0.08;
      blades.push({
        x: (i / numBlades) * width + (Math.random() * 4 - 2),
        height: Math.random() * 90 + 70,
        width: Math.random() * 5 + 3,
        lean: Math.random() * 20 - 10,
        flexibility: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        flowerColor: isFlower ? flowerColors[Math.floor(Math.random() * flowerColors.length)] : undefined,
        flowerSize: isFlower ? Math.random() * 6 + 4 : undefined
      });
    }

    // Spore Particles
    const particles: Particle[] = [];

    let windTime = 0;

    const render = () => {
      windTime += 0.03;
      const windForce = Math.sin(windTime) * 12 + Math.cos(windTime * 0.7) * 6;

      ctx.clearRect(0, 0, width, height);

      // Gradient Meadow Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070a08');
      bgGrad.addColorStop(0.6, '#0d1a10');
      bgGrad.addColorStop(1, '#052e16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Grass Blades
      blades.forEach(blade => {
        let bend = windForce * blade.flexibility;

        // Interactive touch bending effect
        if (touchPos) {
          const dx = blade.x - touchPos.x;
          const dist = Math.abs(dx);
          if (dist < 150) {
            const push = (150 - dist) / 150;
            bend += dx > 0 ? push * 35 : -push * 35;
          }
        }

        ctx.beginPath();
        ctx.moveTo(blade.x, height);
        
        // Control points for organic parabolic blade curve
        const cpX = blade.x + bend * 0.5;
        const cpY = height - blade.height * 0.5;
        const endX = blade.x + blade.lean + bend;
        const endY = height - blade.height;

        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.quadraticCurveTo(cpX + blade.width * 0.5, cpY, blade.x + blade.width, height);
        ctx.fillStyle = blade.color;
        ctx.fill();

        // Optional Wildflower Blooming at tip when touching
        if (blade.flowerColor && blade.flowerSize) {
          ctx.beginPath();
          ctx.arc(endX, endY, blade.flowerSize, 0, Math.PI * 2);
          ctx.fillStyle = blade.flowerColor;
          ctx.fill();
        }
      });

      // Spawn Pollen Particles if user is touching grass
      if (isTouching && touchPos) {
        if (Math.random() < 0.4) {
          particles.push({
            x: touchPos.x + (Math.random() * 60 - 30),
            y: touchPos.y + (Math.random() * 40 - 20),
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 4 + 2,
            alpha: 1
          });
        }
      }

      // Render Spores
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render Touch Point Halo
      if (touchPos && isTouching) {
        ctx.save();
        const haloGrad = ctx.createRadialGradient(touchPos.x, touchPos.y, 0, touchPos.x, touchPos.y, 80);
        haloGrad.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
        haloGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(touchPos.x, touchPos.y, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestAnimRef.current) cancelAnimationFrame(requestAnimRef.current);
    };
  }, [isTouching, touchPos]);

  // Pointer Event Handlers for Mouse & Touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setTouchPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsTouching(true);
    touchStartTimeRef.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTouching) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTouchPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = () => {
    setIsTouching(false);
  };

  const currentMessage = FUNNY_GRASS_MESSAGES[messageIndex];

  return (
    <div style={{ padding: '20px 0 60px 0', minHeight: 'calc(100vh - 90px)' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <AlertTriangle size={16} />
            <span>MANDATORY RECONNECTION REQUIRED</span>
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            TOUCH THE GRASS 🌱
          </h2>

          <p style={{ color: '#9ca3af', fontSize: '1rem', margin: 0 }}>
            Hold your finger or mouse continuously on the grass canvas to repay your debt.
          </p>
        </div>

        {/* Big Live Debt Counter Display */}
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '24px',
          marginBottom: '20px',
          background: isTouching ? 'rgba(22, 101, 52, 0.4)' : 'rgba(18, 26, 20, 0.85)',
          borderColor: isTouching ? '#22c55e' : 'rgba(34, 197, 94, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            YOUR REMAINING GRASS DEBT
          </div>

          <div className="font-mono text-gradient-bright" style={{
            fontSize: 'clamp(3.5rem, 8vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1,
            margin: '10px 0'
          }}>
            {formatTimeDisplay(debtSeconds)}
          </div>

          <div style={{ fontSize: '0.95rem', color: isTouching ? '#4ade80' : '#f87171', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isTouching ? (
              <>
                <Sprout size={18} className="animate-float" />
                <span>Repaying debt... Keep holding!</span>
              </>
            ) : (
              <>
                <PauseCircle size={18} />
                <span>You left the grass. Debt paused. 🌱</span>
              </>
            )}
          </div>
        </div>

        {/* Interactive Grass Canvas Container */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            position: 'relative',
            height: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: isTouching ? '2px solid #4ade80' : '2px solid rgba(34, 197, 94, 0.3)',
            boxShadow: isTouching ? '0 0 50px rgba(34, 197, 94, 0.4)' : '0 12px 40px rgba(0,0,0,0.6)',
            cursor: isTouching ? 'grabbing' : 'grab',
            touchAction: 'none' // Disable page scroll on touch drag
          }}
        >
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

          {/* Touch Overlay Instruction when NOT touching */}
          {!isTouching && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(7, 10, 8, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '24px',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px dashed #4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseGlow 2s infinite'
              }}>
                <Hand size={36} color="#4ade80" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  PRESS & HOLD THE GRASS
                </h3>
                <p style={{ color: '#86efac', fontSize: '0.95rem', maxWidth: '400px' }}>
                  Place your finger or hold mouse button down inside this box to resume your debt countdown.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Deadpan Humor Message Ticker */}
        <div style={{
          marginTop: '24px',
          padding: '16px 24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 18, 0.7)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          textAlign: 'center',
          color: '#86efac',
          fontStyle: 'italic',
          fontSize: '1rem',
          fontWeight: 500
        }}>
          💬 “{currentMessage}”
        </div>
      </div>
    </div>
  );
};
