'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Sparkles,
  RotateCw,
  Waves,
  CircleDot,
  RotateCcw,
  Volume2,
  Zap
} from 'lucide-react';

type StimmingMode = 'bubbles' | 'particles' | 'spinner';

export function StimmingPlayground() {
  const [mode, setMode] = useState<StimmingMode>('bubbles');
  const [bubbleGrid, setBubbleGrid] = useState<boolean[]>(Array(24).fill(false));
  const [popCount, setPopCount] = useState<number>(0);
  const [spinnerAngle, setSpinnerAngle] = useState(0);
  const [spinnerSpeed, setSpinnerSpeed] = useState(0);

  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Bubble Wrap Popping Handler
  const handlePopBubble = (index: number) => {
    if (bubbleGrid[index]) return;

    setBubbleGrid((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    setPopCount((prev) => prev + 1);
    sensoryAudio.playSoftChime('tap');

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {}
    }
  };

  const handleResetBubbles = () => {
    setBubbleGrid(Array(24).fill(false));
    sensoryAudio.playSoftChime('tap');
  };

  // Particle Fluid Simulation Canvas
  useEffect(() => {
    if (mode !== 'particles') return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mode]);

  // Spinner Inertia Animation
  useEffect(() => {
    if (mode !== 'spinner') return;

    let anim: number;
    const updateSpinner = () => {
      setSpinnerAngle((prev) => (prev + spinnerSpeed) % 360);
      setSpinnerSpeed((prev) => Math.max(0, prev * 0.985)); // gentle deceleration
      anim = requestAnimationFrame(updateSpinner);
    };

    anim = requestAnimationFrame(updateSpinner);
    return () => cancelAnimationFrame(anim);
  }, [mode, spinnerSpeed]);

  const handleSpinFidget = () => {
    setSpinnerSpeed((prev) => Math.min(45, prev + 12));
    sensoryAudio.playSoftChime('tap');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl sensory-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>Tactile Stimming & Focus Playground</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Sensory regulation through non-judgmental digital fidget tools and fluid physics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <button
              onClick={() => setMode('bubbles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === 'bubbles'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Bubble Wrap</span>
            </button>

            <button
              onClick={() => setMode('particles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === 'particles'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Fluid Particles</span>
            </button>

            <button
              onClick={() => setMode('spinner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === 'spinner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Fidget Spinner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode View */}
      {mode === 'bubbles' && (
        <div className="p-6 rounded-3xl sensory-card border-2 border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Pops Count: <strong className="text-blue-500 font-mono text-sm">{popCount}</strong>
            </span>
            <button
              onClick={handleResetBubbles}
              className="px-3 py-1 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Fresh Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {bubbleGrid.map((isPopped, idx) => (
              <button
                key={idx}
                onClick={() => handlePopBubble(idx)}
                className={`h-16 rounded-2xl border-2 transition-all transform active:scale-90 flex items-center justify-center ${
                  isPopped
                    ? 'bg-slate-200/50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 shadow-inner'
                    : 'bg-gradient-to-tr from-blue-400/30 to-teal-400/20 border-blue-400/60 shadow-md hover:scale-105'
                }`}
              >
                <div className={`w-6 h-6 rounded-full transition-all ${
                  isPopped
                    ? 'bg-slate-300 dark:bg-slate-700 scale-75'
                    : 'bg-white/80 dark:bg-blue-300/80 shadow-sm'
                }`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'particles' && (
        <div className="p-6 rounded-3xl sensory-card border-2 border-[var(--border-color)] flex flex-col items-center space-y-3">
          <span className="text-xs font-bold text-[var(--text-secondary)]">
            Soothing Kinetic Particle Simulation
          </span>
          <canvas
            ref={particleCanvasRef}
            width={600}
            height={300}
            className="w-full max-w-[600px] h-[260px] rounded-2xl bg-slate-900/90 object-contain shadow-inner"
          />
        </div>
      )}

      {mode === 'spinner' && (
        <div className="p-8 rounded-3xl sensory-card border-2 border-[var(--border-color)] flex flex-col items-center space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Tap or Click Repeatedly to Spin Faster
            </span>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Speed: {Math.round(spinnerSpeed * 10)} RPM
            </p>
          </div>

          <button
            onClick={handleSpinFidget}
            className="w-48 h-48 rounded-full border-4 border-teal-400/40 bg-teal-500/10 flex items-center justify-center transition-transform active:scale-95 shadow-xl hover:shadow-teal-500/20"
            style={{ transform: `rotate(${spinnerAngle}deg)` }}
          >
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Spinner Arms */}
              <div className="absolute w-8 h-32 bg-teal-500 rounded-full shadow-md" />
              <div className="absolute w-32 h-8 bg-blue-500 rounded-full shadow-md" />
              <div className="absolute w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-teal-300 z-10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
