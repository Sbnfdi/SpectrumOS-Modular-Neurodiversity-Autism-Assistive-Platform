'use client';

import React, { useState } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Train,
  Rocket,
  Code2,
  Trophy,
  Compass,
  Zap,
  CheckCircle2,
  Sword,
  Shield,
  ArrowRight
} from 'lucide-react';

interface QuestTheme {
  id: string;
  name: string;
  icon: string;
  color: string;
  prefix: string;
  rankTitle: string;
}

const THEMES: QuestTheme[] = [
  { id: 'trains', name: 'Railroad Logistics', icon: '🚂', color: 'from-blue-600 to-indigo-600', prefix: 'Train Dispatch #402', rankTitle: 'Chief Locomotive Engineer' },
  { id: 'space', name: 'Galactic Deep Space', icon: '🚀', color: 'from-purple-600 to-indigo-700', prefix: 'Orbital Station Alpha', rankTitle: 'Starship Commander' },
  { id: 'dinosaurs', name: 'Jurassic Fossil Dig', icon: '🦖', color: 'from-amber-600 to-emerald-700', prefix: 'Excavation Sector 7', rankTitle: 'Lead Paleontologist' },
  { id: 'coding', name: 'Cyber Terminal Matrix', icon: '💻', color: 'from-teal-600 to-emerald-600', prefix: 'Subroutine 0x8F', rankTitle: 'Cyber Security Architect' },
];

export function SpecialInterestQuestEngine() {
  const [activeTheme, setActiveTheme] = useState<QuestTheme>(THEMES[0]);
  const [demandInput, setDemandInput] = useState('');
  const [questTitle, setQuestTitle] = useState('Inspect Rail Track Clearance');
  const [questNarrative, setQuestNarrative] = useState(
    'The express passenger locomotive is preparing for departure! Before departure, we need to clear 3 loose items off the living room track bed to ensure zero derailment.'
  );
  const [questObjective, setQuestObjective] = useState('Pick up 3 items off the floor and place in bin');
  const [xpEarned, setXpEarned] = useState(120);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTransformDemand = (demand: string) => {
    if (!demand.trim()) return;

    sensoryAudio.playSoftChime('tap');
    setIsCompleted(false);

    if (activeTheme.id === 'trains') {
      setQuestTitle(`Freight Logistics: ${demand}`);
      setQuestNarrative(`Attention Engineer! Station operations require handling: "${demand}". The depot crew needs your specialized machinery inspection.`);
      setQuestObjective(`Complete the dispatch protocol for "${demand}" in under 4 minutes.`);
    } else if (activeTheme.id === 'space') {
      setQuestTitle(`Space Station Maintenance: ${demand}`);
      setQuestNarrative(`Commander, life support sensors on deck 4 detect an unresolved task: "${demand}". Secure the airlock module.`);
      setQuestObjective(`Execute space walk protocol: "${demand}".`);
    } else if (activeTheme.id === 'dinosaurs') {
      setQuestTitle(`Fossil Site Excavation: ${demand}`);
      setQuestNarrative(`Paleontologist, an ancient raptor fossil specimen is buried beneath: "${demand}". Careful brushing required.`);
      setQuestObjective(`Uncover the site by resolving "${demand}".`);
    } else {
      setQuestTitle(`Terminal Patch: ${demand}`);
      setQuestNarrative(`System Architect, a critical buffer overflow bug was flagged: "${demand}". Inject the patch routine.`);
      setQuestObjective(`Compile and deploy fix for "${demand}".`);
    }
  };

  const handleCompleteQuest = () => {
    setIsCompleted(true);
    sensoryAudio.playSoftChime('pda-win');
    setXpEarned((prev) => prev + 50);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#f472b6'],
      });
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl sensory-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Sword className="w-5 h-5 text-amber-500" />
              <span>PDA & Demand-Avoidance Special Interest Quest Engine</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Reframes perceived demands into high-autonomy, special-interest RPG adventures to overcome demand paralysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-800 dark:text-amber-200 text-xs font-extrabold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{xpEarned} XP</span>
            </span>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setActiveTheme(theme);
                sensoryAudio.playSoftChime('tap');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                activeTheme.id === theme.id
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="text-base">{theme.icon}</span>
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demand Input Transformer Bar */}
      <div className="p-5 rounded-3xl sensory-card space-y-3 border-2 border-[var(--border-color)]">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
          Enter Any Direct Demand or Chore Causing Demand Panic
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={demandInput}
            onChange={(e) => setDemandInput(e.target.value)}
            placeholder="e.g., 'Put dirty laundry into the basket' or 'Do 10 math problems'..."
            className="flex-1 px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <button
            onClick={() => handleTransformDemand(demandInput)}
            className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Transform into Quest</span>
          </button>
        </div>
      </div>

      {/* Active Quest Mission Card */}
      <div className="p-6 sm:p-8 rounded-3xl sensory-card border-2 border-amber-400/40 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-secondary)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeTheme.icon}</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                {activeTheme.prefix} • {activeTheme.rankTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                {questTitle}
              </h3>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300">
            +50 XP Reward
          </span>
        </div>

        {/* Narrative */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm sm:text-base leading-relaxed text-[var(--text-primary)] font-medium">
          "{questNarrative}"
        </div>

        {/* Mission Objective */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-700 space-y-1 text-amber-950 dark:text-amber-100">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Autonomous Objective</span>
          </div>
          <p className="text-sm font-semibold">{questObjective}</p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleCompleteQuest}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mission Accomplished! 🎉' : 'Claim Mission Victory'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
