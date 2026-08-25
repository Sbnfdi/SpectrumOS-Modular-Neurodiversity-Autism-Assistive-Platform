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
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { triggerEmergencyCalm, setSensoryAudio, activeSensoryAudio } = useSensoryStore();

  const stages = [
    {
      title: 'Early Childhood',
      age: 'Ages 2–7',
      icon: '🧸',
      color: 'from-blue-500/20 to-teal-500/10 border-blue-300 dark:border-blue-700',
      description: 'Sensory regulation, expressive speech foundations, and low-cognitive-load communication.',
      href: '/early-childhood',
      features: [
        { name: 'Context-Aware Dynamic AAC', desc: '6-tile instant communication with zero folder fatigue' },
        { name: 'EchoBloom Voice Play', desc: 'Rewards vocal effort with blooming flowers and train tracks' },
        { name: 'Emergency Calm SOS', desc: 'Instant full-screen sensory grounding with low-frequency waves' },
      ],
    },
    {
      title: 'School Age',
      age: 'Ages 8–12',
      icon: '🎒',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-300 dark:border-teal-700',
      description: 'Socialization, predictable transitions, and gamified routine independence.',
      href: '/school-age',
      features: [
        { name: 'Carol Gray Social Stories', desc: '4-step structured visual transition stories with TTS read-aloud' },
        { name: 'Visual Routine Sequencer', desc: 'Step-by-step checklist with non-stressful pie countdown timers' },
      ],
    },
    {
      title: 'Adolescence & Adulthood',
      age: 'Ages 13+',
      icon: '🧭',
      color: 'from-amber-500/20 to-purple-500/10 border-amber-300 dark:border-amber-700',
      description: 'Autonomy, social decryption, spoon conservation, and executive function scaffolding.',
      href: '/adult',
      features: [
        { name: 'Tone & Subtext Decoder', desc: 'Literal meaning extraction, urgency/sarcasm meters & 3 drafted replies' },
        { name: 'Executive Breakdown Engine', desc: 'Converts overwhelming tasks into 2-minute non-threatening actions' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--accent-primary)] shadow-xs">
          <Sparkles className="w-4 h-4" />
          <span>Clinical Health-Tech & Neurodiversity-Affirming Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
          Assistive autonomy for every <span className="text-[var(--accent-primary)]">stage of life</span>.
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
          SpectrumOS supports communication, sensory regulation, and executive functioning across early childhood, school age, and adulthood—grounded in neurodiversity-affirming principles without forced masking.
        </p>

        {/* Hero Quick CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/early-childhood"
            className="px-6 py-3.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <span>Explore Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={triggerEmergencyCalm}
            className="px-6 py-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-400 text-rose-700 dark:text-rose-300 font-extrabold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-gentle-pulse" />
            <span>Launch SOS Safe Space</span>
          </button>
        </div>
      </section>

      {/* 3 Developmental Stages Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Developmental Stages
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Tailored tools designed specifically for cognitive and sensory needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.title}
              className={`p-6 rounded-3xl border-2 bg-gradient-to-b ${stage.color} sensory-card flex flex-col justify-between space-y-6 transition-all hover:scale-[1.02] shadow-sm`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{stage.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-[var(--border-color)] text-[var(--text-primary)]">
                    {stage.age}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 pt-2 border-t border-[var(--border-color)]/60">
                  {stage.features.map((feat) => (
                    <div key={feat.name} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[var(--text-primary)] block">{feat.name}</strong>
                        <span className="text-[var(--text-secondary)]">{feat.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={stage.href}
                className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-1.5 border border-[var(--border-color)] shadow-xs hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
              >
                <span>Launch {stage.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Grounding Principles Footer Card */}
      <section className="p-6 sm:p-8 rounded-3xl sensory-card border-2 border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-secondary)] space-y-4">
        <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>Core Clinical Principles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Neurodiversity-Affirming</strong>
            <p>
              Autism is a lifelong neurodevelopmental difference, not an illness to fix. Every feature prioritizes authentic communication, accommodation, and self-advocacy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Sensory-First Ergonomics</strong>
            <p>
              Calm color palettes, volume ceiling limiters, zero startle popups, low-frequency audio grounding, and reduced motion by default.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
