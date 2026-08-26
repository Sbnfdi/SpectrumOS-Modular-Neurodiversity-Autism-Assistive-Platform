'use client';

import React, { useState, useEffect } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import { useProfileStore } from '@/store/useProfileStore';
import confetti from 'canvas-confetti';
import {
  ListChecks,
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  Battery,
  ShieldCheck,
  RotateCcw,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Coffee,
  Plus,
  X,
  Zap,
  Split,
  Timer,
  UtensilsCrossed
} from 'lucide-react';

export interface MicroStep {
  stepIndex: number;
  title: string;
  instruction: string;
  durationMinutes: number;
  spoonCost: number;
  dopamineReward: string;
  completed?: boolean;
  subSteps?: string[];
}

export interface TaskBreakdown {
  taskTitle: string;
  estimatedTotalMinutes: number;
  totalSpoons: number;
  sensoryPreparation: string;
  microSteps: MicroStep[];
}

const sampleOverwhelmingTasks = [
  'Clean and organize the whole apartment',
  'Process 40 unread work emails and reply',
  'File monthly taxes and organize receipts',
  'Pack suitcase for a 4-day trip',
  'Meal prep lunches for the upcoming work week',
];

export default function ExecutiveBreakdown() {
  const { apiKey } = useProfileStore();
  const [taskInput, setTaskInput] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [breakdown, setBreakdown] = useState<TaskBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Spoon Theory Budget
  const [dailySpoonBudget, setDailySpoonBudget] = useState<number>(10);
  const [usedSpoons, setUsedSpoons] = useState<number>(0);

  // 1-Task Focus Mode & Just Start 5-min timer
  const [focusStepIndex, setFocusStepIndex] = useState<number | null>(null);
  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(0);
  const [focusTimerTotal, setFocusTimerTotal] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isJustStartMode, setIsJustStartMode] = useState<boolean>(false);

  // Add Custom Step Modal State
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [customStepTitle, setCustomStepTitle] = useState('');
  const [customStepInstruction, setCustomStepInstruction] = useState('');
  const [customStepDuration, setCustomStepDuration] = useState(3);
  const [customStepSpoons, setCustomStepSpoons] = useState(1);
  const [customStepReward, setCustomStepReward] = useState('Take a cold sip of water & stretch');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && focusTimerSeconds > 0) {
      interval = setInterval(() => {
        setFocusTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sensoryAudio.playSoftChime('bloom');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimerSeconds]);

  const handleDeconstruct = async (task: string) => {
    if (!task.trim()) return;

    setIsLoading(true);
    sensoryAudio.playSoftChime('tap');

    try {
      const res = await fetch('/api/ai/executive-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          energyLevel,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.breakdown) {
        const enhancedSteps: MicroStep[] = (data.breakdown.microSteps || []).map((s: MicroStep, i: number) => ({
          ...s,
          spoonCost: s.spoonCost || (energyLevel === 'low' ? 1 : 2),
        }));

        const totalSpoons = enhancedSteps.reduce((acc, s) => acc + s.spoonCost, 0);

        setBreakdown({
          ...data.breakdown,
          microSteps: enhancedSteps,
          totalSpoons,
        });
        setFocusStepIndex(0);
        sensoryAudio.playSoftChime('success');
      }
    } catch (err) {
      console.error('Failed to breakdown task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFocusTimer = (step: MicroStep, index: number) => {
    setFocusStepIndex(index);
    const secs = step.durationMinutes * 60;
    setFocusTimerTotal(secs);
    setFocusTimerSeconds(secs);
    setIsJustStartMode(false);
    setIsTimerRunning(true);
    sensoryAudio.playSoftChime('tap');
  };

  const handleStart5MinRule = () => {
    const secs = 5 * 60;
    setFocusTimerTotal(secs);
    setFocusTimerSeconds(secs);
    setIsJustStartMode(true);
    setIsTimerRunning(true);
    sensoryAudio.playSoftChime('tap');
  };

  const handleCompleteStep = (idx: number) => {
    if (!breakdown) return;

    sensoryAudio.playSoftChime('success');

    const updated = breakdown.microSteps.map((s, i) =>
      i === idx ? { ...s, completed: !s.completed } : s
    );

    const completedSpoons = updated
      .filter((s) => s.completed)
      .reduce((acc, s) => acc + s.spoonCost, 0);
    setUsedSpoons(completedSpoons);

    const allDone = updated.every((s) => s.completed);
    if (allDone) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {}
    }

    setBreakdown({ ...breakdown, microSteps: updated });
  };

  const handleRecursiveBreakdown = (idx: number) => {
    if (!breakdown) return;
    sensoryAudio.playSoftChime('tap');

    const step = breakdown.microSteps[idx];
    const subSteps = [
      `1. Stand up and look at target area without touching anything (10s)`,
      `2. Set phone in silent mode out of reach (15s)`,
      `3. Complete initial micro-action: ${step.title} (90s)`,
      `4. Stop and celebrate with 1 deep breath.`,
    ];

    const updated = breakdown.microSteps.map((s, i) =>
      i === idx ? { ...s, subSteps } : s
    );

    setBreakdown({ ...breakdown, microSteps: updated });
  };

  const handleAddCustomStep = () => {
    if (!breakdown || !customStepTitle.trim()) return;

    const newStep: MicroStep = {
      stepIndex: breakdown.microSteps.length + 1,
      title: customStepTitle.trim(),
      instruction: customStepInstruction.trim() || customStepTitle.trim(),
      durationMinutes: Math.max(1, customStepDuration),
      spoonCost: customStepSpoons,
      dopamineReward: customStepReward.trim(),
      completed: false,
    };

    setBreakdown({
      ...breakdown,
      microSteps: [...breakdown.microSteps, newStep],
      estimatedTotalMinutes: breakdown.estimatedTotalMinutes + newStep.durationMinutes,
      totalSpoons: breakdown.totalSpoons + newStep.spoonCost,
    });

    setShowAddStepModal(false);
    setCustomStepTitle('');
    setCustomStepInstruction('');
    sensoryAudio.playSoftChime('success');
  };

  const currentFocusStep = breakdown && focusStepIndex !== null ? breakdown.microSteps[focusStepIndex] : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Spoon Theory Energy Telemetry Bar */}
      <div className="p-4 rounded-2xl sensory-card flex flex-wrap items-center justify-between gap-3 border border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                Daily Spoon Theory Budget
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                {dailySpoonBudget - usedSpoons} Spoons Left
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Tasks cost spoons. Monitor energy to prevent autistic burnout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart5MinRule}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="The 5-Minute Rule: Zero guilt, stop anytime after 5 minutes"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>"Just Start" 5-Min Timer</span>
          </button>
        </div>
      </div>

      {/* Task Input Header */}
      <div className="p-5 rounded-3xl sensory-card space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-emerald-500" />
            <span>Executive Functioning Decomposer & Focus Engine</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Bypasses task paralysis by splitting big goals into atomic, 2-to-5 minute single actions.
          </p>
        </div>

        {/* Energy Level Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-secondary)]">Spoon State:</span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <button
              onClick={() => setEnergyLevel('low')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                energyLevel === 'low'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Low Spoons (1–2m tasks)</span>
            </button>
            <button
              onClick={() => setEnergyLevel('medium')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                energyLevel === 'medium'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              <span>Balanced</span>
            </button>
            <button
              onClick={() => setEnergyLevel('high')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                energyLevel === 'high'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hyperfocus Sprint</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeconstruct(taskInput);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Type any overwhelming task (e.g., 'Clean kitchen' or 'File quarterly taxes')..."
            className="flex-1 px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] placeholder:text-[var(--text-secondary)]/60"
          />
          <button
            type="submit"
            disabled={isLoading || !taskInput.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Break Down</span>
          </button>
        </form>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs font-semibold text-[var(--text-secondary)] self-center mr-1">
            Presets:
          </span>
          {sampleOverwhelmingTasks.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTaskInput(t);
                handleDeconstruct(t);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 border border-[var(--border-color)] text-[var(--text-primary)] transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown Output */}
      {breakdown && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sensory Prep Recommendation */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-700 flex items-center gap-3 text-teal-900 dark:text-teal-200">
            <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Sensory Friction Reducer (30s Prep)
              </p>
              <p className="text-xs sm:text-sm font-semibold">{breakdown.sensoryPreparation}</p>
            </div>
          </div>

          {/* 1-Task-At-A-Time Focus Mode Card */}
          {currentFocusStep && (
            <div className="p-6 rounded-3xl sensory-card border-2 border-[var(--accent-primary)]/40 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-secondary)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[var(--accent-primary)] text-white">
                  Focus Step {currentFocusStep.stepIndex} of {breakdown.microSteps.length}
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentFocusStep.durationMinutes} Min
                  </span>
                  <span>•</span>
                  <span>{currentFocusStep.spoonCost} Spoon</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                  {currentFocusStep.title}
                </h3>
                <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed">
                  {currentFocusStep.instruction}
                </p>

                {currentFocusStep.subSteps && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-300 dark:border-purple-800 space-y-1.5">
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      Goblin Recursive Sub-Actions:
                    </p>
                    {currentFocusStep.subSteps.map((sub, sIdx) => (
                      <p key={sIdx} className="text-xs text-purple-900 dark:text-purple-200">
                        {sub}
                      </p>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dopamine Reward: {currentFocusStep.dopamineReward}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartFocusTimer(currentFocusStep, focusStepIndex!)}
                    className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[var(--accent-hover)]"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Pause Pacer' : 'Start Micro Timer'}</span>
                  </button>

                  <button
                    onClick={() => handleRecursiveBreakdown(focusStepIndex!)}
                    className="px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-1"
                    title="Break down into smaller 30-second steps"
                  >
                    <Split className="w-3.5 h-3.5 text-purple-500" />
                    <span>Break Down Smaller</span>
                  </button>

                  <button
                    onClick={() => handleCompleteStep(focusStepIndex!)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentFocusStep.completed
                        ? 'bg-emerald-600 text-white'
                        : 'border border-[var(--border-color)] bg-white dark:bg-slate-800 text-[var(--text-primary)]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{currentFocusStep.completed ? 'Step Complete!' : 'Mark Done'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusStepIndex(Math.max(0, focusStepIndex! - 1))}
                    disabled={focusStepIndex === 0}
                    className="p-2 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-primary)] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFocusStepIndex(Math.min(breakdown.microSteps.length - 1, focusStepIndex! + 1))}
                    disabled={focusStepIndex === breakdown.microSteps.length - 1}
                    className="p-2 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-primary)] disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Full Step Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                All Atomic Micro-Steps ({breakdown.microSteps.length}) • Total: {breakdown.totalSpoons} Spoons
              </h4>
              <button
                onClick={() => setShowAddStepModal(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Micro-Step</span>
              </button>
            </div>

            {breakdown.microSteps.map((step, idx) => (
              <div
                key={step.stepIndex}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  step.completed
                    ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-700 opacity-80'
                    : focusStepIndex === idx
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-color)] sensory-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCompleteStep(idx)}
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white dark:text-slate-900" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        step.completed
                          ? 'line-through text-[var(--text-secondary)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {step.instruction}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setFocusStepIndex(idx)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors shrink-0"
                >
                  Focus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Micro-Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md sensory-card p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Add Atomic Micro-Step
              </h3>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                  Micro-Action Name
                </label>
                <input
                  type="text"
                  value={customStepTitle}
                  onChange={(e) => setCustomStepTitle(e.target.value)}
                  placeholder="e.g., 'Wipe just the coffee table'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                  Concrete Instruction (Zero decision fatigue)
                </label>
                <input
                  type="text"
                  value={customStepInstruction}
                  onChange={(e) => setCustomStepInstruction(e.target.value)}
                  placeholder="e.g., 'Grab 1 wet wipe, swipe the surface once, throw in bin.'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                    Duration: {customStepDuration}m
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={customStepDuration}
                    onChange={(e) => setCustomStepDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                    Spoon Cost: {customStepSpoons}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={customStepSpoons}
                    onChange={(e) => setCustomStepSpoons(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowAddStepModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomStep}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700"
              >
                Save Micro-Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
