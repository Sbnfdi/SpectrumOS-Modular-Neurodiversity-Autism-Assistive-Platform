'use client';

import React, { useState } from 'react';
import SocialStoryGenerator from '@/components/school-age/SocialStoryGenerator';
import VisualRoutineSequencer from '@/components/school-age/VisualRoutineSequencer';
import { SensoryMealPlanner } from '@/components/school-age/SensoryMealPlanner';
import { BookOpen, CalendarCheck, Sparkles, Utensils } from 'lucide-react';

export default function SchoolAgePage() {
  const [activeTab, setActiveTab] = useState<'stories' | 'routines' | 'meals'>('stories');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl sensory-card bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-blue-500/10 border-2 border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎒</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              School Age Stage (Ages 8–12)
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Socialization, predictable transitions, gamified visual routines, and sensory meal planning.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Predictability & Autonomy</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('stories')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'stories'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Carol Gray Social Stories</span>
        </button>

        <button
          onClick={() => setActiveTab('routines')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'routines'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Visual Routine Sequencer</span>
        </button>

        <button
          onClick={() => setActiveTab('meals')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'meals'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Sensory Meal Planner</span>
        </button>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'stories' && <SocialStoryGenerator />}
        {activeTab === 'routines' && <VisualRoutineSequencer />}
        {activeTab === 'meals' && <SensoryMealPlanner />}
      </main>
    </div>
  );
}
