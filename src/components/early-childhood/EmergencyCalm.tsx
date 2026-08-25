'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSensoryStore } from '@/store/useSensoryStore';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Wind,
  Heart,
  Sparkles,
  Waves,
  CloudRain,
  Moon
} from 'lucide-react';

export default function EmergencyCalm() {
  const { emergencyCalmActive, dismissEmergencyCalm } = useSensoryStore();

  const [soundMode, setSoundMode] = useState<'brown' | 'binaural' | 'mute'>('brown');
  const [breathPhase, setBreathPhase] = useState<'Breathe In' | 'Hold' | 'Breathe Out' | 'Rest'>('Breathe In');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [isHoldingUnlock, setIsHoldingUnlock] = useState(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4-4-4-4 Box Breathing Cycle for gentle nervous system regulation
  useEffect(() => {
    if (!emergencyCalmActive) return;

    let timer: NodeJS.Timeout;
    const cycle = [
      { phase: 'Breathe In' as const, duration: 4 },
      { phase: 'Hold' as const, duration: 4 },
      { phase: 'Breathe Out' as const, duration: 4 },
      { phase: 'Rest' as const, duration: 2 },
    ];

    let currentIdx = 0;
    let count = cycle[0].duration;

    timer = setInterval(() => {
      count -= 1;
      setSecondsInPhase(count);

      if (count <= 0) {
        currentIdx = (currentIdx + 1) % cycle.length;
        setBreathPhase(cycle[currentIdx].phase);
        count = cycle[currentIdx].duration;
        setSecondsInPhase(count);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [emergencyCalmActive]);

  // Audio Soundscape Switcher
  useEffect(() => {
    if (!emergencyCalmActive) return;

    if (soundMode === 'brown') {
      sensoryAudio.startBrownNoise(320);
      sensoryAudio.stopBinauralBeats();
    } else if (soundMode === 'binaural') {
      sensoryAudio.stopBrownNoise();
      sensoryAudio.startBinauralBeats(196, 6);
    } else {
      sensoryAudio.stopBrownNoise();
      sensoryAudio.stopBinauralBeats();
    }

    return () => {
      sensoryAudio.stopBrownNoise();
      sensoryAudio.stopBinauralBeats();
    };
  }, [emergencyCalmActive, soundMode]);

  // Hold-to-unlock mechanism (prevents accidental tap exits during sensory meltdown)
  const startHold = () => {
    setIsHoldingUnlock(true);
    setUnlockProgress(0);
    const start = Date.now();
    const duration = 2500; // 2.5 seconds hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setUnlockProgress(pct);

      if (elapsed >= duration) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHoldingUnlock(false);
        dismissEmergencyCalm();
      }
    }, 30);
  };

  const endHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHoldingUnlock(false);
    setUnlockProgress(0);
  };

  if (!emergencyCalmActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060c18] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-700">
      {/* Gentle Floating Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-soft-float" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-soft-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Sensory Controls Bar */}
      <div className="w-full max-w-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-teal-300" />
          <span className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
            Safe Sensory Space
          </span>
        </div>

        {/* Audio Soundscape Options */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setSoundMode('brown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              soundMode === 'brown' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Brown Noise</span>
          </button>

          <button
            onClick={() => setSoundMode('binaural')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              soundMode === 'binaural' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Theta Waves</span>
          </button>

          <button
            onClick={() => setSoundMode('mute')}
            className={`p-1.5 rounded-xl text-xs font-medium ${
              soundMode === 'mute' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mute Audio"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Breathing Visualizer Circle */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88">
          {/* Outer Breathing Expanding Ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-teal-400/30 transition-all duration-1000 ${
              breathPhase === 'Breathe In'
                ? 'scale-110 border-teal-300/60 bg-teal-500/10'
                : breathPhase === 'Hold'
                ? 'scale-110 border-indigo-300/60 bg-indigo-500/10'
                : 'scale-90 border-teal-500/20 bg-transparent'
            }`}
          />

          {/* Secondary Soft Pulsing Disc */}
          <div
            className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-teal-600/30 to-indigo-600/30 border border-teal-400/40 backdrop-blur-sm flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
              breathPhase === 'Breathe In'
                ? 'scale-105 shadow-teal-500/20'
                : breathPhase === 'Hold'
                ? 'scale-105 shadow-indigo-500/20'
                : 'scale-95 shadow-none'
            }`}
          >
            <Wind
              className={`w-8 h-8 mb-2 transition-transform duration-700 ${
                breathPhase === 'Breathe In'
                  ? 'text-teal-300 scale-110'
                  : breathPhase === 'Hold'
                  ? 'text-indigo-300 rotate-12'
                  : 'text-slate-400 scale-90'
              }`}
            />
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-100">
              {breathPhase}
            </p>
            <p className="text-sm font-semibold text-teal-300/80 mt-1">
              {secondsInPhase}s
            </p>
          </div>
        </div>

        {/* Soothing Neurodiversity Reassurance */}
        <p className="mt-8 text-sm sm:text-base text-slate-300/90 text-center max-w-md font-medium px-4">
          You are completely safe. Take all the time you need. No expectations, no pressure.
        </p>
      </div>

      {/* Bottom Caregiver Unlock Button (Hold for 2.5s) */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 z-10">
        <div className="relative w-full">
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 relative overflow-hidden transition-all active:scale-[0.99]"
          >
            {/* Progress Fill Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-teal-600/40 transition-all duration-75"
              style={{ width: `${unlockProgress}%` }}
            />
            <div className="relative flex items-center gap-2">
              {unlockProgress >= 100 ? (
                <Unlock className="w-4 h-4 text-teal-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isHoldingUnlock ? `Holding to Exit... ${Math.round(unlockProgress)}%` : 'Hold to Exit Safe Space'}
              </span>
            </div>
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          Caregiver lock prevents accidental taps
        </p>
      </div>
    </div>
  );
}
