'use client';

import React from 'react';
import { ShieldCheck, Sparkles, X, Check, Brain, HeartHandshake, Eye, Volume2 } from 'lucide-react';

export default function ClinicalMatrixSection() {
  const matrixItems = [
    {
      feature: 'Communication Focus',
      traditional: 'Forced verbal compliance & eye-contact training',
      spectrumOS: 'Authentic multimodal expressive agency (Dynamic AAC + Lenient Phonetics)',
    },
    {
      feature: 'Sensory Overload Management',
      traditional: 'Behavioral extinction & compliance under distress',
      spectrumOS: 'Instant Emergency Calm safe space with brown noise & 4-4-4-4 box breathing',
    },
    {
      feature: 'Social Interactions',
      traditional: 'Forced neurotypical masking & rote scripts',
      spectrumOS: 'Subtext & Tone Decryption preserving spoons and personal boundaries',
    },
    {
      feature: 'Routine Transitions',
      traditional: 'High-stress rigid count-downs and timers',
      spectrumOS: 'Carol Gray compliant predictable stories + stress-free visual pie charts',
    },
  ];

  return (
    <section className="w-full space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
          <Brain className="w-3.5 h-3.5" />
          <span>CLINICAL EVIDENCE & PARADIGM SHIFT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--text-primary)]">
          Neurodiversity-Affirming by Design
        </h2>
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          Built from the ground up on contemporary clinical health-tech principles that empower autistic individuals without demanding conformity or masking.
        </p>
      </div>

      {/* Comparison Grid Matrix */}
      <div className="sensory-card p-6 sm:p-8 border-2 border-[var(--border-color)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-[var(--border-color)] text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hidden md:grid">
          <div className="col-span-4">Assistive Domain</div>
          <div className="col-span-4 text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <X className="w-3.5 h-3.5" />
            <span>Traditional Deficit Model</span>
          </div>
          <div className="col-span-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>SpectrumOS Affirming Engine</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {matrixItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-[var(--bg-surface)]/60 hover:bg-[var(--bg-surface)] border border-[var(--border-color)] transition-colors text-xs"
            >
              <div className="md:col-span-4 font-bold font-display text-sm text-[var(--text-primary)] flex items-center">
                {item.feature}
              </div>
              <div className="md:col-span-4 text-slate-500 line-through opacity-80 flex items-start gap-2">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{item.traditional}</span>
              </div>
              <div className="md:col-span-4 text-[var(--text-primary)] font-bold flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item.spectrumOS}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
