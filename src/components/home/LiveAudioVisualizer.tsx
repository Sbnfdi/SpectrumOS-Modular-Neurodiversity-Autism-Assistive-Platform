'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import { useSensoryStore } from '@/store/useSensoryStore';
import { Waves, Mic, Sparkles, Volume2, VolumeX, Radio, Activity } from 'lucide-react';

export default function LiveAudioVisualizer() {
  const { activeSensoryAudio, setSensoryAudio } = useSensoryStore();
  const [isMicActive, setIsMicActive] = useState(false);
  const [soundMode, setSoundMode] = useState<'brown' | 'binaural' | 'none'>(
    activeSensoryAudio === 'brown-noise' ? 'brown' : activeSensoryAudio === 'binaural' ? 'binaural' : 'none'
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const metrics = sensoryAudio.getMicMetrics();
      const amplitude = isMicActive ? metrics.volume * 80 + 10 : soundMode !== 'none' ? 24 : 8;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw Multi-layered Sine Oscilloscope Waveform
      const layers = [
        { color: 'rgba(56, 189, 248, 0.7)', speed: 0.04, freq: 0.02, offset: 0 },
        { color: 'rgba(52, 211, 153, 0.5)', speed: 0.03, freq: 0.015, offset: 2 },
        { color: 'rgba(168, 85, 247, 0.4)', speed: 0.02, freq: 0.025, offset: 4 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        for (let x = 0; x < width; x++) {
          const y =
            centerY +
            Math.sin(x * layer.freq + phase * layer.speed + layer.offset) * amplitude * Math.sin((x / width) * Math.PI);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      phase += 1;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [soundMode, isMicActive]);

  const handleSoundChange = (mode: 'brown' | 'binaural' | 'none') => {
    setSoundMode(mode);
    setSensoryAudio(mode === 'brown' ? 'brown-noise' : mode === 'binaural' ? 'binaural' : 'none');
    sensoryAudio.playSoftChime('tap');
  };

  const handleToggleMic = async () => {
    if (isMicActive) {
      sensoryAudio.stopMicAnalysis();
      setIsMicActive(false);
    } else {
      const ok = await sensoryAudio.startMicAnalysis();
      if (ok) {
        setIsMicActive(true);
        sensoryAudio.playSoftChime('bloom');
      }
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl sensory-card border-2 border-[var(--border-color)] bg-gradient-to-br from-white/90 via-[var(--bg-surface)] to-[var(--bg-secondary)] dark:from-[#0b1322] dark:via-[#101c33] dark:to-[#090e18] space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              Web Audio Telemetry & Soundscape Synth
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display text-[var(--text-primary)] mt-1">
            Real-Time Sensory Acoustic Calibration
          </h3>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
          <button
            onClick={() => handleSoundChange('none')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all tactile-btn ${
              soundMode === 'none' && !isMicActive
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Mute
          </button>
          <button
            onClick={() => handleSoundChange('brown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all tactile-btn ${
              soundMode === 'brown'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Brown Noise (400Hz)
          </button>
          <button
            onClick={() => handleSoundChange('binaural')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all tactile-btn ${
              soundMode === 'binaural'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Theta Waves (6Hz)
          </button>
          <button
            onClick={handleToggleMic}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all tactile-btn flex items-center gap-1 ${
              isMicActive
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isMicActive ? 'Mic Live' : 'Test Mic'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Oscilloscope Waveform */}
      <div className="relative rounded-2xl bg-[#030712] border border-slate-800 p-2 overflow-hidden flex items-center justify-center min-h-[140px] shadow-inner">
        <canvas
          ref={canvasRef}
          width={700}
          height={130}
          className="w-full h-[130px] object-contain"
        />

        {/* Telemetry Labels */}
        <div className="absolute top-3 left-4 flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>OUTPUT: {isMicActive ? 'MIC INPUT (LENIENT FFT)' : soundMode === 'brown' ? 'PROCEDURAL BROWN NOISE' : soundMode === 'binaural' ? 'BINAURAL THETA 196Hz/202Hz' : 'STANDBY'}</span>
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500">
          SAMPLE RATE: 48000 Hz / ZERO LATENCY
        </div>
      </div>
    </div>
  );
}
