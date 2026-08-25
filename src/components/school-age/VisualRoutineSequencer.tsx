'use client';

import React, { useState, useEffect } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Plus,
  Clock,
  Award,
  X,
  PlusCircle
} from 'lucide-react';

export interface RoutineStep {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  icon?: string;
}

export interface RoutineSequence {
  id: string;
  title: string;
  icon: string;
  steps: RoutineStep[];
}

const defaultSequences: RoutineSequence[] = [
  {
    id: 'morning',
    title: 'Morning Launch Sequence 🚀',
    icon: '☀️',
    steps: [
      { id: '1', title: 'Put on soft sensory clothes & socks', durationMinutes: 4, completed: false },
      { id: '2', title: 'Crunchy breakfast & sip cold water', durationMinutes: 10, completed: false },
      { id: '3', title: 'Brush teeth with gentle paste', durationMinutes: 2, completed: false },
      { id: '4', title: 'Pack backpack with headphones & fidget tool', durationMinutes: 4, completed: false },
      { id: '5', title: 'Zip jacket and step onto the bus calmly', durationMinutes: 3, completed: false },
    ],
  },
  {
    id: 'bedtime',
    title: 'Calm Night Wind-Down 🌙',
    icon: '🌙',
    steps: [
      { id: 'b1', title: 'Dim bedroom lights to warm mode', durationMinutes: 2, completed: false },
      { id: 'b2', title: 'Warm pajama sensory swap', durationMinutes: 4, completed: false },
      { id: 'b3', title: 'Listen to 5 mins of brown noise ocean waves', durationMinutes: 5, completed: false },
      { id: 'b4', title: 'Weighted blanket cozy tuck-in', durationMinutes: 3, completed: false },
    ],
  },
  {
    id: 'afterschool',
    title: 'Post-School Sensory Decompression 🎮',
    icon: '🎧',
    steps: [
      { id: 'a1', title: 'Kick off school shoes & heavy backpack', durationMinutes: 2, completed: false },
      { id: 'a2', title: '15-minute silent room sensory recharge', durationMinutes: 15, completed: false },
      { id: 'a3', title: 'Comfort snack and cold hydration', durationMinutes: 8, completed: false },
    ],
  },
];

export default function VisualRoutineSequencer() {
  const [sequences, setSequences] = useState<RoutineSequence[]>(defaultSequences);
  const [activeSeqId, setActiveSeqId] = useState<string>('morning');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Modal State for adding custom steps
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDuration, setNewStepDuration] = useState(3);

  // Timer state (seconds remaining in active step)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [totalStepSeconds, setTotalStepSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const currentSequence = sequences.find((s) => s.id === activeSeqId) || sequences[0];

  // Visual Pie Chart Calculation (Percentage of time elapsed)
  const percentElapsed = totalStepSeconds > 0
    ? Math.max(0, Math.min(100, ((totalStepSeconds - timerSeconds) / totalStepSeconds) * 100))
    : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
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
  }, [isTimerRunning, timerSeconds]);

  const handleStartStepTimer = (step: RoutineStep) => {
    setActiveStepId(step.id);
    const secs = step.durationMinutes * 60;
    setTotalStepSeconds(secs);
    setTimerSeconds(secs);
    setIsTimerRunning(true);
    sensoryAudio.playSoftChime('tap');
  };

  const handleToggleComplete = (stepId: string) => {
    sensoryAudio.playSoftChime('success');

    setSequences((prev) =>
      prev.map((seq) => {
        if (seq.id === activeSeqId) {
          const updatedSteps = seq.steps.map((st) =>
            st.id === stepId ? { ...st, completed: !st.completed } : st
          );
          // Check if all are completed
          const allDone = updatedSteps.every((st) => st.completed);
          if (allDone) {
            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#38a5f6', '#4f8d7b', '#c4a174', '#9c6bf9'],
              });
            } catch {}
          }

          // Persist to SQLite
          try {
            fetch('/api/routines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: seq.id,
                title: seq.title,
                steps: updatedSteps,
                isCompleted: allDone,
              }),
            }).catch(() => {});
          } catch {}

          return { ...seq, steps: updatedSteps };
        }
        return seq;
      })
    );
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;

    const newStep: RoutineStep = {
      id: `step_${Date.now()}`,
      title: newStepTitle.trim(),
      durationMinutes: Math.max(1, newStepDuration),
      completed: false,
    };

    setSequences((prev) =>
      prev.map((seq) => {
        if (seq.id === activeSeqId) {
          const updated = { ...seq, steps: [...seq.steps, newStep] };
          try {
            fetch('/api/routines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            }).catch(() => {});
          } catch {}
          return updated;
        }
        return seq;
      })
    );

    setShowAddStepModal(false);
    setNewStepTitle('');
    setNewStepDuration(3);
    sensoryAudio.playSoftChime('success');
  };

  const handleResetRoutine = () => {
    setSequences((prev) =>
      prev.map((seq) => {
        if (seq.id === activeSeqId) {
          return {
            ...seq,
            steps: seq.steps.map((st) => ({ ...st, completed: false })),
          };
        }
        return seq;
      })
    );
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setActiveStepId(null);
    sensoryAudio.playSoftChime('tap');
  };

  const activeStep = currentSequence.steps.find((s) => s.id === activeStepId);
  const completedCount = currentSequence.steps.filter((s) => s.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Routine Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl sensory-card">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sequences.map((seq) => (
            <button
              key={seq.id}
              onClick={() => {
                setActiveSeqId(seq.id);
                setActiveStepId(null);
                setIsTimerRunning(false);
                sensoryAudio.playSoftChime('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                activeSeqId === seq.id
                  ? 'bg-[var(--accent-primary)] text-white shadow-md scale-105'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{seq.icon}</span>
              <span>{seq.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStepModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Add Custom Routine Step"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>

          <button
            onClick={handleResetRoutine}
            className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5"
            title="Reset Checkboxes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Routine Grid with Non-Stressful Pie Timer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Step-by-Step Visual Checklist (7 Cols) */}
        <div className="md:col-span-7 sensory-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <span>{currentSequence.icon}</span>
              <span>{currentSequence.title}</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">
              {completedCount} / {currentSequence.steps.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {currentSequence.steps.map((step) => {
              const isCurrent = activeStepId === step.id;
              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                    step.completed
                      ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-700 opacity-80'
                      : isCurrent
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-sm'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleComplete(step.id)}
                      className="text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform"
                      title={step.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-slate-900" />
                      ) : (
                        <Circle className="w-6 h-6 stroke-[2]" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-extrabold ${
                          step.completed
                            ? 'line-through text-[var(--text-secondary)]'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {step.title}
                      </p>
                      <span className="text-[11px] font-semibold text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {step.durationMinutes} min gentle pace
                      </span>
                    </div>
                  </div>

                  {/* Start Timer for this step button */}
                  <button
                    onClick={() => handleStartStepTimer(step)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCurrent && isTimerRunning
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{isCurrent && isTimerRunning ? 'Running' : 'Timer'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Stress-Free Visual Pie-Chart Timer (5 Cols) */}
        <div className="md:col-span-5 sensory-card p-6 flex flex-col items-center justify-between text-center space-y-4 border-2 border-[var(--border-color)]">
          <div className="w-full">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Visual Pie Countdown
            </span>
            <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">
              {activeStep ? activeStep.title : 'Select a step to start timer'}
            </p>
          </div>

          {/* Non-digital SVG Pie-Chart (Soft Visual Circle) */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track Circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Smooth Pie Arc Filling */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-[var(--accent-primary)] transition-all duration-1000 ease-linear"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentElapsed / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Gentle Icon & Status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-6 h-6 text-[var(--accent-primary)] mb-1 animate-gentle-pulse" />
              <span className="text-xl font-extrabold text-[var(--text-primary)]">
                {Math.round(percentElapsed)}%
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                {isTimerRunning ? 'Pacing smoothly' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          {activeStep && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause Pacing' : 'Resume'}</span>
              </button>

              <button
                onClick={() => handleToggleComplete(activeStep.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Step</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-[var(--text-secondary)] font-medium">
            Visual pie charts reduce time blindness without the anxiety of ticking digital numbers.
          </p>
        </div>
      </div>

      {/* Add Custom Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md sensory-card p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Add Step to {currentSequence.title}
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
                  Step Description
                </label>
                <input
                  type="text"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="e.g., 'Put on noise-cancelling headphones'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                  Gentle Duration (Minutes): {newStepDuration} min
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={newStepDuration}
                  onChange={(e) => setNewStepDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                />
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
                onClick={handleAddStep}
                className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700"
              >
                Save Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
