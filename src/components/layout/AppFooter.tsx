'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Radio, Activity, Database, Github, Cpu } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';

export default function AppFooter() {
  const { activeProfile, isOfflineMode } = useProfileStore();

  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)] backdrop-blur-xl mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Main Footer Links & Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
                Spectrum<span className="text-[var(--accent-primary)]">OS</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Modular, neurodiversity-affirming assistive computing environment designed for autistic individuals, caregivers, and clinicians.
            </p>

            {/* Real-Time Telemetry Badge */}
            <div className="inline-flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>STATUS: {isOfflineMode ? 'LOCAL OFFLINE' : 'EDGE ACTIVE'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3 text-[var(--accent-primary)]" />
                <span>SQLITE SYNC</span>
              </div>
            </div>
          </div>

          {/* Module Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <span className="font-mono font-bold uppercase text-[var(--text-primary)] tracking-wider">
                Modules
              </span>
              <ul className="space-y-2 text-[var(--text-secondary)] font-medium">
                <li>
                  <Link href="/early-childhood" className="hover:text-[var(--accent-primary)] transition-colors">
                    🧸 Early Childhood (2–7)
                  </Link>
                </li>
                <li>
                  <Link href="/school-age" className="hover:text-[var(--accent-primary)] transition-colors">
                    🎒 School Age (8–12)
                  </Link>
                </li>
                <li>
                  <Link href="/adult" className="hover:text-[var(--accent-primary)] transition-colors">
                    🧭 Adulthood (13+)
                  </Link>
                </li>
                <li>
                  <Link href="/caregiver" className="hover:text-[var(--accent-primary)] transition-colors">
                    ⚙️ Caregiver Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-mono font-bold uppercase text-[var(--text-primary)] tracking-wider">
                Core Engines
              </span>
              <ul className="space-y-2 text-[var(--text-secondary)] font-medium">
                <li>Dynamic AAC Board</li>
                <li>EchoBloom Voice Play</li>
                <li>Carol Gray Social Stories</li>
                <li>Tone & Subtext Decoder</li>
                <li>Emergency Calm SOS</li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-mono font-bold uppercase text-[var(--text-primary)] tracking-wider">
                Privacy & Data
              </span>
              <ul className="space-y-2 text-[var(--text-secondary)] font-medium">
                <li>100% Offline Capable</li>
                <li>Zero Forced Masking</li>
                <li>Local SQLite Encryption</li>
                <li>JSON Medical Export</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p className="flex items-center gap-1 font-medium">
            <span>SpectrumOS Platform</span>
            <span>•</span>
            <span>Neurodiversity-Affirming Architecture</span>
          </p>

          <p className="text-[11px] text-center sm:text-right opacity-75">
            Designed with clinical input from autistic advocates, occupational therapists, and speech-language pathologists.
          </p>
        </div>
      </div>
    </footer>
  );
}
