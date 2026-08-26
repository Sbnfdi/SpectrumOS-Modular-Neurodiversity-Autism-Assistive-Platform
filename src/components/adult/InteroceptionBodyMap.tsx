'use client';

import React, { useState } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Heart,
  Brain,
  Zap,
  Droplet,
  Coffee,
  ShieldCheck,
  Sparkles,
  Activity,
  Smile,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

interface BodyZone {
  id: string;
  name: string;
  sensation: string;
  translatedEmotion: string;
  possibleCauses: string[];
  actionRecommendation: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const BODY_ZONES: BodyZone[] = [
  {
    id: 'head',
    name: 'Head & Forehead',
    sensation: 'Brain fog, pressure behind eyes, or buzzing headache',
    translatedEmotion: 'Sensory Overload / Cognitive Fatigue',
    possibleCauses: ['Fluorescent lighting flicker', 'Too much screen time', 'Masking exhaustion', 'Dehydration'],
    actionRecommendation: 'Dim lighting or close eyes for 3 minutes. Sip 200ml cold water.',
    icon: Brain,
    color: 'text-purple-500 bg-purple-500/10 border-purple-400',
  },
  {
    id: 'throat',
    name: 'Throat & Neck',
    sensation: 'Tight lump in throat, voice feeling locked, dry swallow',
    translatedEmotion: 'Non-Verbal Shutdown / Acute Social Anxiety',
    possibleCauses: ['Demand avoidance spike', 'High-pressure social setting', 'Repressed need to stim'],
    actionRecommendation: 'Switch to AAC communication board. Do not force speaking. Sip room-temperature water.',
    icon: Activity,
    color: 'text-blue-500 bg-blue-500/10 border-blue-400',
  },
  {
    id: 'chest',
    name: 'Chest & Lungs',
    sensation: 'Fast racing heartbeat, shallow rib breathing, fluttering feeling',
    translatedEmotion: 'Sympathetic Nervous System Fight/Flight',
    possibleCauses: ['Sudden unexpected schedule change', 'Sensory noise spike', 'Anticipatory dread'],
    actionRecommendation: 'Perform 4-4-4-4 Box Breathing or 2 sharp physiological inhales + 1 long exhale.',
    icon: Heart,
    color: 'text-rose-500 bg-rose-500/10 border-rose-400',
  },
  {
    id: 'stomach',
    name: 'Stomach & Gut',
    sensation: 'Fluttering butterflies, hollow knot, nausea, or cramping',
    translatedEmotion: 'Hunger (Interoceptive lag) or Dread',
    possibleCauses: ['Missed meal due to hyperfocus', 'Sensory aversion', 'Severe stress'],
    actionRecommendation: 'Check if you have eaten in the last 4 hours. Eat 1 safe comfort snack with protein.',
    icon: Droplet,
    color: 'text-amber-500 bg-amber-500/10 border-amber-400',
  },
  {
    id: 'hands',
    name: 'Hands & Fingers',
    sensation: 'Clenched tight fists, restless tapping, shaky cold fingers',
    translatedEmotion: 'Pent-up Proprioceptive Energy / Restlessness',
    possibleCauses: ['Suppressed motor stimming', 'Cold environment', 'Frustration'],
    actionRecommendation: 'Grab a heavy resistance grip or squishy stress ball. Squeeze firmly for 5 seconds x 3 times.',
    icon: Zap,
    color: 'text-teal-500 bg-teal-500/10 border-teal-400',
  },
  {
    id: 'legs',
    name: 'Legs & Feet',
    sensation: 'Restless leg bounce, heavy lead limbs, unable to stand still',
    translatedEmotion: 'Hypo-vestibular Need / Proprioceptive Seeking',
    possibleCauses: ['Sedentary hyperfocus without body breaks', 'Sensory under-stimulation'],
    actionRecommendation: 'Do 10 wall push-ups, pace 20 steps, or wear weighted lap pad for deep pressure therapy.',
    icon: Activity,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-400',
  },
];

export function InteroceptionBodyMap() {
  const [selectedZone, setSelectedZone] = useState<BodyZone>(BODY_ZONES[0]);

  const handleSelect = (zone: BodyZone) => {
    setSelectedZone(zone);
    sensoryAudio.playSoftChime('tap');
  };

  const Icon = selectedZone.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl sensory-card space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
            Interoception & Somatic Body Map
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Autistic individuals often experience delayed or altered bodily signals (alexithymia). Select what you feel physically to decode your emotional needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Anatomical Zone Selector Chips (5 Cols) */}
        <div className="md:col-span-5 sensory-card p-5 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
            Where do you feel discomfort?
          </h3>

          <div className="space-y-2">
            {BODY_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const ZoneIcon = zone.icon;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleSelect(zone)}
                  className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    isSelected
                      ? `${zone.color} shadow-md scale-[1.02] font-bold`
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-300 text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60">
                      <ZoneIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{zone.name}</span>
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-current animate-ping" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Decoded Interoceptive Needs & Coping Action (7 Cols) */}
        <div className="md:col-span-7 sensory-card p-6 space-y-5 border-2 border-[var(--border-color)]">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--border-color)]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Decoded Internal State
              </span>
              <h4 className="text-xl font-extrabold text-[var(--text-primary)]">
                {selectedZone.translatedEmotion}
              </h4>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* Physical Sensation */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Reported Sensation
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
              "{selectedZone.sensation}"
            </p>
          </div>

          {/* Possible Hidden Triggers */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Possible Hidden Triggers
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedZone.possibleCauses.map((cause, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-semibold"
                >
                  {cause}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Somatic Regulation Action */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-700 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recommended Self-Regulation Action</span>
            </div>
            <p className="text-sm font-semibold text-teal-950 dark:text-teal-100 leading-relaxed">
              {selectedZone.actionRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
