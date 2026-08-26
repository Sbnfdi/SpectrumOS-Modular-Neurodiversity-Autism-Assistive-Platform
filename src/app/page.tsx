'use client';

import React from 'react';
import Link from 'next/link';
import { useSensoryStore } from '@/store/useSensoryStore';
import { sensoryAudio } from '@/lib/audioEngine';
import LiveAudioVisualizer from '@/components/home/LiveAudioVisualizer';
import { SensoryProfiler } from '@/components/home/SensoryProfiler';
import { StimmingPlayground } from '@/components/home/StimmingPlayground';
import InteractiveFeatureShowcase from '@/components/home/InteractiveFeatureShowcase';
import ClinicalMatrixSection from '@/components/home/ClinicalMatrixSection';
import ClinicalFAQSection from '@/components/home/ClinicalFAQSection';
import {
  Sparkles,
  MessageSquareHeart,
  Mic,
  BookOpen,
  CalendarCheck,
  Compass,
  ListChecks,
  ShieldAlert,
  Waves,
  ArrowRight,
  Heart,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Radio,
  Sliders,
  Database,
  Lock,
  BatteryCharging
} from 'lucide-react';

export default function HomePage() {
  const { triggerEmergencyCalm } = useSensoryStore();

  const stages = [
    {
      title: 'Early Childhood',
      age: 'Ages 2–7',
      badge: 'Sensory & Speech',
      icon: '🧸',
      color: 'from-blue-500/15 via-teal-500/10 to-transparent border-blue-300/60 dark:border-blue-700/60',
      description: 'Zero-fatigue visual communication, lenient voice play gamification, and meltdown grounding.',
      href: '/early-childhood',
      features: [
        { name: 'Context-Aware Dynamic AAC', desc: '6-tile instant communication board with camera scene scanning' },
        { name: 'EchoBloom Voice Play', desc: 'Lenient phonetic scoring with real-time blooming flower & train canvas' },
        { name: 'Emergency Calm SOS', desc: '4-4-4-4 box breathing pacing with procedural brown noise' },
      ],
    },
    {
      title: 'School Age',
      age: 'Ages 8–12',
      badge: 'Transitions & Routine',
      icon: '🎒',
      color: 'from-teal-500/15 via-emerald-500/10 to-transparent border-teal-300/60 dark:border-teal-700/60',
      description: 'Socialization, predictable transition stories, and gamified routine sequences.',
      href: '/school-age',
      features: [
        { name: 'Carol Gray Social Stories', desc: '4-step structured visual transition stories with TTS narration' },
        { name: 'Visual Routine Sequencer', desc: 'Step-by-step checklist with non-stressful SVG pie countdown timers' },
        { name: 'Persistent Story Binder', desc: 'Save and review customized stories in embedded SQLite database' },
      ],
    },
    {
      title: 'Adolescence & Adulthood',
      age: 'Ages 13+',
      badge: 'Autonomy & Decryption',
      icon: '🧭',
      color: 'from-amber-500/15 via-purple-500/10 to-transparent border-amber-300/60 dark:border-amber-700/60',
      description: 'Autonomy, social subtext decryption, spoon conservation, and executive function scaffolding.',
      href: '/adult',
      features: [
        { name: 'Tone & Subtext Decoder', desc: 'Literal meaning extraction, urgency/sarcasm meters & 3 drafted replies' },
        { name: 'Executive Breakdown Engine', desc: 'Converts overwhelming tasks into 2-minute non-threatening actions' },
        { name: '1-Task Focus Mode', desc: 'Sensory friction reducers with atomic timers and dopamine rewards' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-24">
      {/* 1. HERO SECTION (Organic High-Tech Luxury) */}
      <section className="text-center space-y-8 max-w-5xl mx-auto pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold font-mono text-[var(--accent-primary)] shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>NEURODIVERSITY-AFFIRMING ASSISTIVE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-[var(--text-primary)] leading-[1.06]">
          Assistive autonomy for every{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-teal-500 to-indigo-500">
            stage of neurodivergent life
          </span>
          .
        </h1>

        <p className="text-base sm:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-3xl mx-auto">
          An adaptive, offline-first operating environment designed for AAC communication, sensory self-regulation, transition scaffolding, and executive functioning—engineered without forced masking.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/early-childhood"
            className="px-8 py-4 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-extrabold font-display text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-105 transition-all tactile-btn"
          >
            <span>Explore Life Stages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={triggerEmergencyCalm}
            className="px-7 py-4 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-400 text-rose-700 dark:text-rose-300 font-extrabold font-display text-sm sm:text-base flex items-center gap-2 shadow-xs active:scale-95 transition-all tactile-btn"
          >
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-gentle-pulse" />
            <span>Launch SOS Meltdown Safe Space</span>
          </button>
        </div>

        {/* Quick Telemetry Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Offline Service Worker</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Embedded SQLite Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-teal-500" />
            <span>Zero Tracking Privacy</span>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME ACOUSTIC CALIBRATION & AUDIO ENGINE PLAYGROUND */}
      <section>
        <LiveAudioVisualizer />
      </section>

      {/* 2.5 ENVIRONMENTAL SENSORY PROFILER & DECIBEL SOUND METER */}
      <section>
        <SensoryProfiler />
      </section>

      {/* 2.8 TACTILE STIMMING & FOCUS PLAYGROUND */}
      <section>
        <StimmingPlayground />
      </section>

      {/* 3. INTERACTIVE FEATURE TESTBED & LIVE SANDBOX */}
      <section>
        <InteractiveFeatureShowcase />
      </section>

      {/* 4. DEVELOPMENTAL STAGES GRID (Modules A, B, C) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-xs font-mono text-[var(--accent-primary)] font-bold tracking-wider uppercase">
              Modular Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)] mt-1">
              Developmental Modules by Life Stage
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Active Scaffolds: 03 Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.title}
              className={`p-7 rounded-3xl border-2 bg-gradient-to-b ${stage.color} sensory-card flex flex-col justify-between space-y-6 transition-all hover:scale-[1.02] shadow-sm`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{stage.icon}</span>
                  <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-[var(--border-color)] text-[var(--text-primary)] shadow-xs">
                    {stage.age}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold font-display text-[var(--text-primary)]">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-medium leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-3 border-t border-[var(--border-color)]/60">
                  {stage.features.map((feat) => (
                    <div key={feat.name} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[var(--text-primary)] font-display block font-bold">
                          {feat.name}
                        </strong>
                        <span className="text-[var(--text-secondary)] leading-normal">
                          {feat.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={stage.href}
                className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-[var(--text-primary)] font-extrabold font-display text-xs flex items-center justify-center gap-2 border border-[var(--border-color)] shadow-xs hover:bg-[var(--accent-primary)] hover:text-white transition-all tactile-btn"
              >
                <span>Launch {stage.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CLINICAL MATRIX & PARADIGM SHIFT SECTION */}
      <ClinicalMatrixSection />

      {/* 6. FREQUENTLY ASKED QUESTIONS & CLINICAL GUIDANCE FAQ */}
      <ClinicalFAQSection />
    </div>
  );
}
