'use client';

import React, { useState, useEffect } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Volume2,
  Mic,
  MicOff,
  AlertTriangle,
  Headphones,
  Sun,
  ShieldCheck,
  Activity,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';

export function SensoryProfiler() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentDb, setCurrentDb] = useState(38);
  const [peakDb, setPeakDb] = useState(42);
  const [ambientLighting, setAmbientLighting] = useState<'dim' | 'natural' | 'harsh'>('natural');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        const metrics = sensoryAudio.getMicMetrics();
        const db = metrics.decibels || 35;
        setCurrentDb(db);
        setPeakDb((prev) => Math.max(prev, db));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const toggleMonitoring = async () => {
    if (isMonitoring) {
      sensoryAudio.stopMicAnalysis();
      setIsMonitoring(false);
      sensoryAudio.playSoftChime('tap');
    } else {
      const ok = await sensoryAudio.startMicAnalysis();
      if (ok) {
        setIsMonitoring(true);
        sensoryAudio.playSoftChime('tap');
      } else {
        alert('Please allow microphone permissions to measure environmental noise.');
      }
    }
  };

  const getNoiseClassification = (db: number) => {
    if (db < 50) return { label: 'Quiet & Calming', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-400', level: 'safe' };
    if (db < 70) return { label: 'Moderate Sound', color: 'text-blue-500 bg-blue-500/10 border-blue-400', level: 'moderate' };
    if (db < 82) return { label: 'Caution: Sensory Strain', color: 'text-amber-500 bg-amber-500/10 border-amber-400', level: 'warning' };
    return { label: 'Sensory Overload Danger', color: 'text-rose-500 bg-rose-500/10 border-rose-400', level: 'danger' };
  };

  const currentStatus = getNoiseClassification(currentDb);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl sensory-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
              Environmental Sensory Noise Profiler
            </h2>
          </div>

          <button
            onClick={toggleMonitoring}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
              isMonitoring
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isMonitoring ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isMonitoring ? 'Stop Meter' : 'Start Live dB Meter'}</span>
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Real-time ambient noise telemetry protects against unpredictable acoustic spikes and auditory fatigue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Decibel Meter Dial Card (6 Cols) */}
        <div className="md:col-span-6 sensory-card p-6 flex flex-col items-center justify-between text-center space-y-4 border-2 border-[var(--border-color)]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
            Live Acoustic Pressure
          </span>

          {/* Large Circular Gauge */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-blue-500 transition-all duration-200"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(100, (currentDb / 100)))}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono">
                {currentDb}
              </span>
              <span className="text-xs font-bold text-[var(--text-secondary)]">decibels (dB)</span>
            </div>
          </div>

          {/* Classification Badge */}
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${currentStatus.color}`}>
            {currentStatus.label}
          </div>

          <div className="w-full flex justify-between text-xs font-semibold text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
            <span>Peak Session: {peakDb} dB</span>
            <span>Recommended Max: 75 dB</span>
          </div>
        </div>

        {/* Sensory Recommendations (6 Cols) */}
        <div className="md:col-span-6 sensory-card p-6 space-y-4 border-2 border-[var(--border-color)]">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Contextual Environmental Advice</span>
          </h3>

          <div className="space-y-3">
            {currentDb >= 75 ? (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400 text-rose-900 dark:text-rose-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Headphone Trigger Recommended</span>
                </div>
                <p>Noise level exceeds 75dB. Put on active noise-canceling headphones or step into a quiet room.</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Acoustics are Safe & Calming</span>
                </div>
                <p>Environment is within comfortable neurodivergent processing thresholds.</p>
              </div>
            )}

            {/* Lighting Check */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Lighting Sensory Check
                </span>
                <span className="capitalize text-slate-500">{ambientLighting}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['dim', 'natural', 'harsh'] as const).map((light) => (
                  <button
                    key={light}
                    onClick={() => setAmbientLighting(light)}
                    className={`py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      ambientLighting === light
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {light}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => sensoryAudio.startBrownNoise(350)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Headphones className="w-4 h-4" />
              <span>Activate Brown Noise Shield</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
