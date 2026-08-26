'use client';

import React, { useState } from 'react';
import { useSensoryStore } from '@/store/useSensoryStore';
import { SoundscapeType } from '@/lib/audioEngine';
import { Volume2, VolumeX, Waves, CloudRain, Radio, Music, Sparkles, Clock, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const SOUNDSCAPES: { id: SoundscapeType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'brown-noise', label: 'Velvet Brown Noise', description: 'Deep low-frequency blocker for sensory calming', icon: Waves },
  { id: 'pink-noise', label: 'Balanced Pink Noise', description: 'Even spectral density for soothing hyperactivity', icon: Radio },
  { id: 'white-noise', label: 'Filtered White Noise', description: 'Gentle masking for loud unpredictable environments', icon: Sliders },
  { id: 'rain', label: 'Rhythmic Rainfall', description: 'Organic precipitation texture with gentle taps', icon: CloudRain },
  { id: 'ocean-waves', label: 'Ocean Swell Cycles', description: 'Slow 8-second rhythmic natural breathing waves', icon: Waves },
  { id: 'binaural-theta', label: 'Theta Focus (6 Hz)', description: 'Binaural pulse for sustained hyperfocus & learning', icon: Sparkles },
  { id: 'binaural-delta', label: 'Delta Grounding (2.5 Hz)', description: 'Deep somatic relaxation and pre-sleep winding down', icon: Music },
  { id: 'harmonic-hum', label: 'Earth Resonance (136.1 Hz)', description: 'Tibetan harmonic overtone hum for grounding', icon: Sparkles },
];

export function SensorySoundscapeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    activeSensoryAudio, 
    volumeCeiling, 
    filterCutoff, 
    sleepTimerMinutes, 
    setSensoryAudio, 
    setVolumeCeiling, 
    setFilterCutoff, 
    setSleepTimer 
  } = useSensoryStore();

  const isPlaying = activeSensoryAudio !== 'none';
  const activeItem = SOUNDSCAPES.find(s => s.id === activeSensoryAudio);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Toggle Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle Sensory Soundscape Panel"
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border transition-all duration-300 font-medium text-sm ${
            isPlaying 
              ? 'bg-blue-600/90 text-white border-blue-400/40 shadow-blue-500/20 backdrop-blur-md animate-pulse'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-md'
          }`}
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="truncate max-w-[130px]">{activeItem?.label || 'Sound Playing'}</span>
            </>
          ) : (
            <>
              <Waves className="w-4 h-4 text-blue-500" />
              <span>Sensory Audio</span>
            </>
          )}
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {isPlaying && (
          <button
            onClick={() => setSensoryAudio('none')}
            title="Mute All Audio"
            className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors shadow-md backdrop-blur-md"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded Soundscape Controller Panel */}
      {isOpen && (
        <div 
          role="region"
          aria-label="Sensory Soundscape Synthesizer"
          className="absolute bottom-14 right-0 w-[340px] sm:w-[380px] p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl transition-all"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sensory Soundscapes</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Procedural masking & grounding</p>
              </div>
            </div>
            {isPlaying && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Active
              </span>
            )}
          </div>

          {/* Soundscapes Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {SOUNDSCAPES.map((sound) => {
              const Icon = sound.icon;
              const isCurrent = activeSensoryAudio === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => setSensoryAudio(isCurrent ? 'none' : sound.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1 ${
                    isCurrent
                      ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-blue-500' : 'text-slate-400'}`} />
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
                  </div>
                  <span className="text-xs font-semibold leading-tight">{sound.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{sound.description}</span>
                </button>
              );
            })}
          </div>

          {/* Audio Controls */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  Volume Ceiling
                </span>
                <span className="font-mono text-[11px]">{Math.round(volumeCeiling * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volumeCeiling}
                onChange={(e) => setVolumeCeiling(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Low-pass filter frequency cutoff */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Sensory Warmth (Cutoff)
                </span>
                <span className="font-mono text-[11px]">{filterCutoff} Hz</span>
              </div>
              <input
                type="range"
                min="150"
                max="1500"
                step="50"
                value={filterCutoff}
                onChange={(e) => setFilterCutoff(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Sleep Timer */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Sleep & Calm Timer
                </span>
                <span className="text-[11px] text-blue-500 font-medium">
                  {sleepTimerMinutes > 0 ? `${sleepTimerMinutes} min active` : 'Off'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSleepTimer(mins)}
                    className={`py-1 text-xs rounded-lg font-medium transition-colors ${
                      sleepTimerMinutes === mins
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
