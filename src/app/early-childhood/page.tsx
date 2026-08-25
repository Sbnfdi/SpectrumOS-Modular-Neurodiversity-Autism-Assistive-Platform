'use client';

import React, { useState } from 'react';
import AACGrid from '@/components/early-childhood/AACGrid';
import EchoBloom from '@/components/early-childhood/EchoBloom';
import { useSensoryStore } from '@/store/useSensoryStore';
import {
  MessageSquareHeart,
  Mic,
  ShieldAlert,
  Sparkles,
  Heart
} from 'lucide-react';

export default function EarlyChildhoodPage() {
  const [activeTab, setActiveTab] = useState<'aac' | 'echobloom'>('aac');
  const { triggerEmergencyCalm } = useSensoryStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl sensory-card bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-teal-500/10 border-2 border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧸</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Early Childhood Stage (Ages 2–7)
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Sensory regulation, expressive foundations, and low-friction communication.
          </p>
        </div>

        {/* SOS Meltdown Quick Action */}
        <button
          onClick={triggerEmergencyCalm}
          className="px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-400 text-rose-700 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>SOS Meltdown Safe Space</span>
        </button>
      </div>

      {/* Module Sub-Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('aac')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'aac'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Dynamic 6-Tile AAC</span>
        </button>

        <button
          onClick={() => setActiveTab('echobloom')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'echobloom'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>EchoBloom Voice Play</span>
        </button>
      </div>

      {/* Module Content */}
      <main>
        {activeTab === 'aac' ? <AACGrid /> : <EchoBloom />}
      </main>
    </div>
  );
}
