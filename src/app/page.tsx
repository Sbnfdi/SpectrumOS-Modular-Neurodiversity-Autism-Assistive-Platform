'use client';

import React from 'react';
import Link from 'next/link';
import { useSensoryStore } from '@/store/useSensoryStore';
import { sensoryAudio } from '@/lib/audioEngine';
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
  Radio
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* Hero Section (Organic High-Tech) */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold font-mono text-[var(--accent-primary)] shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CLINICAL HEALTH-TECH & ASSISTIVE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-[var(--text-primary)] leading-[1.08]">
          Assistive autonomy for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-indigo-500 to-teal-400">stage of life</span>.
        </h1>

        <p className="text-base sm:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto">
          An adaptive, offline-first operating environment designed for neurodivergent communication, sensory regulation, and executive functioning—crafted without forced masking.
        </p>

        {/* Hero Quick CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/early-childhood"
            className="px-7 py-3.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-extrabold font-display text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all tactile-btn"
          >
            <span>Explore Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={triggerEmergencyCalm}
            className="px-6 py-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-400/80 text-rose-700 dark:text-rose-300 font-extrabold font-display text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all tactile-btn"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-gentle-pulse" />
            <span>Launch SOS Safe Space</span>
          </button>
        </div>
      </section>

      {/* 3 Developmental Stages Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">
              Developmental Modules
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
              Customized cognitive and sensory scaffolds tailored for each stage of life.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Stage Scaffolds: 03 Active
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

                {/* Feature Checklist */}
                <div className="space-y-3 pt-3 border-t border-[var(--border-color)]/60">
                  {stage.features.map((feat) => (
                    <div key={feat.name} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[var(--text-primary)] font-display block font-bold">{feat.name}</strong>
                        <span className="text-[var(--text-secondary)] leading-normal">{feat.desc}</span>
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

      {/* Clinical Grounding Principles Section */}
      <section className="p-7 sm:p-10 rounded-3xl sensory-card border-2 border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-secondary)] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold font-display text-[var(--text-primary)] flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Clinical Grounding & Neurodiversity Pillars</span>
          </h3>
          <span className="text-xs font-mono text-[var(--text-secondary)] hidden sm:block">
            Evidence-Based Ergonomics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-[var(--border-color)] space-y-1.5 shadow-xs">
            <strong className="text-[var(--text-primary)] font-display text-base block font-bold">
              Neurodiversity-Affirming Architecture
            </strong>
            <p>
              Autism is a lifelong neurodevelopmental difference, not a curable pathology. Every tool prioritizes authentic self-expression, communication, sensory regulation, and autonomy—never forced masking or compliance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-[var(--border-color)] space-y-1.5 shadow-xs">
            <strong className="text-[var(--text-primary)] font-display text-base block font-bold">
              Sensory-First Ergonomics
            </strong>
            <p>
              Harmonious color palettes, master volume clamp limits, zero startle popups, procedural low-frequency audio grounding, and smooth inertia physics without motion sickness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
