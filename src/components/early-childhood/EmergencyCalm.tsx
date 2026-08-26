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
  Moon,
  ShieldAlert,
  Phone,
  QrCode,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';

type BreathingTechnique = 'box' | '478' | 'sigh';

export default function EmergencyCalm() {
  const { emergencyCalmActive, dismissEmergencyCalm } = useSensoryStore();

  const [soundMode, setSoundMode] = useState<'brown' | 'binaural' | 'rain' | 'mute'>('brown');
  const [technique, setTechnique] = useState<BreathingTechnique>('box');
  const [breathPhase, setBreathPhase] = useState<string>('Breathe In');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [isHoldingUnlock, setIsHoldingUnlock] = useState(false);
  const [showDeescalationCard, setShowDeescalationCard] = useState(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing Cycles
  useEffect(() => {
    if (!emergencyCalmActive) return;

    let timer: NodeJS.Timeout;

    let cycle: { phase: string; duration: number }[];
    if (technique === 'box') {
      cycle = [
        { phase: 'Breathe In Slowly', duration: 4 },
        { phase: 'Hold Gently', duration: 4 },
        { phase: 'Breathe Out Smoothly', duration: 4 },
        { phase: 'Rest & Settle', duration: 4 },
      ];
    } else if (technique === '478') {
      cycle = [
        { phase: 'Breathe In Deeply', duration: 4 },
        { phase: 'Hold Still', duration: 7 },
        { phase: 'Exhale Completely', duration: 8 },
      ];
    } else {
      // Physiological Sigh (2 sharp inhales, 1 long exhale)
      cycle = [
        { phase: 'Inhale through nose', duration: 2 },
        { phase: 'Extra top-off sip of air', duration: 1 },
        { phase: 'Long relaxing sigh exhale', duration: 6 },
      ];
    }

    let currentIdx = 0;
    let count = cycle[0].duration;
    setBreathPhase(cycle[0].phase);
    setSecondsInPhase(count);

    timer = setInterval(() => {
      count -= 1;
      setSecondsInPhase(count);

      if (count <= 0) {
        currentIdx = (currentIdx + 1) % cycle.length;
        setBreathPhase(cycle[currentIdx].phase);
        count = cycle[currentIdx].duration;
        setSecondsInPhase(count);

        // Haptic feedback if supported
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(60);
          } catch {}
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [emergencyCalmActive, technique]);

  // Audio Soundscape Switcher
  useEffect(() => {
    if (!emergencyCalmActive) return;

    if (soundMode === 'brown') {
      sensoryAudio.startBrownNoise(300);
    } else if (soundMode === 'binaural') {
      sensoryAudio.startBinauralBeats(144, 2.5); // 2.5Hz Delta deep calming
    } else if (soundMode === 'rain') {
      sensoryAudio.startRainSound();
    } else {
      sensoryAudio.stopAllSoundscapes();
    }

    return () => {
      sensoryAudio.stopAllSoundscapes();
    };
  }, [emergencyCalmActive, soundMode]);

  // Hold-to-unlock mechanism
  const startHold = () => {
    setIsHoldingUnlock(true);
    setUnlockProgress(0);
    const start = Date.now();
    const duration = 2500;

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
    <div className="fixed inset-0 z-50 bg-[#040814] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-700">
      {/* Gentle Floating Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-soft-float" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-soft-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Sensory Controls Bar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-teal-300" />
          <span className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
            SOS Meltdown Recovery Protocol
          </span>
        </div>

        {/* Breathing Mode Switcher & Audio Soundscapes */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => setTechnique('box')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${technique === 'box' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
            >
              Box (4-4-4-4)
            </button>
            <button
              onClick={() => setTechnique('478')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${technique === '478' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
            >
              4-7-8 Deep
            </button>
            <button
              onClick={() => setTechnique('sigh')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${technique === 'sigh' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
            >
              Double Sigh
            </button>
          </div>

          <button
            onClick={() => setShowDeescalationCard(!showDeescalationCard)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-teal-300 hover:text-white"
            title="Public De-escalation Help Card"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Breathing Visualizer or Public Card */}
      {showDeescalationCard ? (
        <div className="max-w-lg p-8 rounded-3xl bg-slate-900/95 border-2 border-teal-400 shadow-2xl text-center space-y-4 my-auto z-10 animate-in zoom-in-95">
          <ShieldAlert className="w-12 h-12 text-teal-400 mx-auto" />
          <h3 className="text-2xl font-extrabold text-white">Sensory De-escalation Card</h3>
          <p className="text-base text-slate-200 leading-relaxed font-medium">
            "I am autistic and experiencing severe sensory overload. I cannot process questions or speech right now."
          </p>
          <div className="p-4 rounded-2xl bg-slate-800 text-left space-y-2 text-sm text-slate-300">
            <p>• Please give me personal space.</p>
            <p>• Do not touch or speak loudly to me.</p>
            <p>• Allow me a dark, quiet room to regulate.</p>
          </div>
          <button
            onClick={() => setShowDeescalationCard(false)}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm"
          >
            Return to Breathing Pacer
          </button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center my-auto z-10">
          <div className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88">
            <div
              className={`absolute inset-0 rounded-full border-2 border-teal-400/30 transition-all duration-1000 ${
                breathPhase.includes('Inhale') || breathPhase.includes('In')
                  ? 'scale-110 border-teal-300/60 bg-teal-500/10'
                  : breathPhase.includes('Hold')
                  ? 'scale-110 border-indigo-300/60 bg-indigo-500/10'
                  : 'scale-90 border-teal-500/20 bg-transparent'
              }`}
            />

            <div
              className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-teal-600/30 to-indigo-600/30 border border-teal-400/40 backdrop-blur-sm flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
                breathPhase.includes('Inhale') || breathPhase.includes('In')
                  ? 'scale-105 shadow-teal-500/20'
                  : breathPhase.includes('Hold')
                  ? 'scale-105 shadow-indigo-500/20'
                  : 'scale-95 shadow-none'
              }`}
            >
              <Wind
                className={`w-8 h-8 mb-2 transition-transform duration-700 ${
                  breathPhase.includes('Inhale') || breathPhase.includes('In')
                    ? 'text-teal-300 scale-110'
                    : breathPhase.includes('Hold')
                    ? 'text-indigo-300 rotate-12'
                    : 'text-slate-400 scale-90'
                }`}
              />
              <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-teal-100 text-center px-4">
                {breathPhase}
              </p>
              <p className="text-sm font-semibold text-teal-300/80 mt-1">
                {secondsInPhase}s
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm sm:text-base text-slate-300/90 text-center max-w-md font-medium px-4">
            You are safe. Take all the time you need. Your nervous system will settle at its own pace.
          </p>
        </div>
      )}

      {/* Bottom Caregiver Unlock Button */}
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
