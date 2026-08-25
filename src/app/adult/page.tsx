'use client';

import React, { useState } from 'react';
import ToneDecoder from '@/components/adult/ToneDecoder';
import ExecutiveBreakdown from '@/components/adult/ExecutiveBreakdown';
import { Compass, ListChecks, Sparkles } from 'lucide-react';

export default function AdultPage() {
  const [activeTab, setActiveTab] = useState<'tone' | 'executive'>('tone');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl sensory-card bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-500/10 border-2 border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧭</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Adolescence & Adulthood Stage (Ages 13+)
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Autonomy, social decryption, spoon conservation, and executive function scaffolding.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Neurodivergent Autonomy</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('tone')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'tone'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Tone & Subtext Decoder</span>
        </button>

        <button
          onClick={() => setActiveTab('executive')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'executive'
              ? 'bg-[var(--accent-primary)] text-white shadow-md scale-[1.02]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Executive Task Breakdown</span>
        </button>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'tone' ? <ToneDecoder /> : <ExecutiveBreakdown />}
      </main>
    </div>
  );
}
