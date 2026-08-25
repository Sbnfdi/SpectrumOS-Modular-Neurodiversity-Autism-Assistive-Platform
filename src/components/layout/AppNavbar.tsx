'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSensoryStore, SensoryTheme } from '@/store/useSensoryStore';
import { useProfileStore } from '@/store/useProfileStore';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Palette,
  ShieldAlert,
  Settings,
  Waves,
  Eye,
  Sliders,
  Check
} from 'lucide-react';

export default function AppNavbar() {
  const pathname = usePathname();
  const {
    theme,
    setTheme,
    volumeCeiling,
    setVolumeCeiling,
    reducedMotion,
    setReducedMotion,
    activeSensoryAudio,
    setSensoryAudio,
    triggerEmergencyCalm
  } = useSensoryStore();

  const { activeProfile } = useProfileStore();
  const [showSensoryMenu, setShowSensoryMenu] = useState(false);

  const navItems = [
    { href: '/early-childhood', label: 'Early Childhood', sub: 'Ages 2–7', icon: '🧸' },
    { href: '/school-age', label: 'School Age', sub: 'Ages 8–12', icon: '🎒' },
    { href: '/adult', label: 'Adulthood', sub: 'Ages 13+', icon: '🧭' },
    { href: '/caregiver', label: 'Caregiver Hub', sub: 'Sync & Config', icon: '⚙️' },
  ];

  const themes: { id: SensoryTheme; label: string; bg: string; border: string }[] = [
    { id: 'calm-blue', label: 'Calm Blue', bg: '#e0effe', border: '#38a5f6' },
    { id: 'warm-sand', label: 'Warm Sand', bg: '#f4ecdf', border: '#c4a174' },
    { id: 'forest-mist', label: 'Forest Mist', bg: '#def0e7', border: '#4f8d7b' },
    { id: 'lavender-dusk', label: 'Lavender Dusk', bg: '#efe8ff', border: '#9c6bf9' },
    { id: 'high-contrast', label: 'High Contrast', bg: '#000000', border: '#ffff00' },
    { id: 'dark', label: 'Midnight Dark', bg: '#111b2b', border: '#38a5f6' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Stage Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                  Spectrum<span className="text-[var(--accent-primary)] font-extrabold">OS</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                  Neurodiversity Assist
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-medium hidden sm:block">
                Active Profile: <strong className="text-[var(--text-primary)]">{activeProfile.displayName}</strong>
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] scale-[1.02]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sensory Controls & SOS Calm Button */}
        <div className="flex items-center gap-2.5">
          {/* Sensory Sound Toggle (Quick Action) */}
          <button
            onClick={() => setSensoryAudio(activeSensoryAudio === 'brown-noise' ? 'none' : 'brown-noise')}
            title={activeSensoryAudio === 'brown-noise' ? 'Turn off brown noise' : 'Turn on soothing brown noise'}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeSensoryAudio === 'brown-noise'
                ? 'bg-emerald-500/15 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Waves className={`w-4 h-4 ${activeSensoryAudio === 'brown-noise' ? 'animate-pulse text-emerald-600' : ''}`} />
            <span className="hidden lg:inline">{activeSensoryAudio === 'brown-noise' ? 'Brown Noise ON' : 'Noise Blocker'}</span>
          </button>

          {/* Sensory Settings Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSensoryMenu(!showSensoryMenu)}
              className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Sensory Adjustments"
            >
              <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
              <Sliders className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>

            {showSensoryMenu && (
              <div className="absolute right-0 mt-2 w-72 sensory-card p-4 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Sensory Preferences
                  </span>
                  <button
                    onClick={() => setShowSensoryMenu(false)}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Done
                  </button>
                </div>

                {/* Theme Switcher */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                    Visual Palette
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border flex items-center justify-between transition-all ${
                          theme === t.id
                            ? 'ring-2 ring-[var(--accent-primary)] border-transparent font-bold'
                            : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: t.bg, color: t.id === 'high-contrast' || t.id === 'dark' ? '#fff' : '#1e293b' }}
                      >
                        <span className="truncate">{t.label}</span>
                        {theme === t.id && <Check className="w-3 h-3 ml-1 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soundscape Mode */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                    Calming Audio Tone
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setSensoryAudio('none')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center ${
                        activeSensoryAudio === 'none'
                          ? 'bg-[var(--accent-primary)] text-white border-transparent font-bold'
                          : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      Mute
                    </button>
                    <button
                      onClick={() => setSensoryAudio('brown-noise')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center ${
                        activeSensoryAudio === 'brown-noise'
                          ? 'bg-emerald-600 text-white border-transparent font-bold'
                          : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      Brown Noise
                    </button>
                    <button
                      onClick={() => setSensoryAudio('binaural')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center ${
                        activeSensoryAudio === 'binaural'
                          ? 'bg-indigo-600 text-white border-transparent font-bold'
                          : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      Theta Waves
                    </button>
                  </div>
                </div>

                {/* Volume Ceiling Slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    <span>Volume Ceiling</span>
                    <span>{Math.round(volumeCeiling * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumeCeiling}
                    onChange={(e) => setVolumeCeiling(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                {/* Reduced Motion Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <span className="text-xs font-medium text-[var(--text-primary)]">Reduced Motion</span>
                  <button
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      reducedMotion ? 'bg-[var(--accent-primary)]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform absolute top-0.5 left-0.5 ${
                        reducedMotion ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Calm SOS Meltdown Tool Button (Immediate 1-Click Access) */}
          <button
            onClick={triggerEmergencyCalm}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400 text-rose-700 dark:text-rose-300 font-bold text-xs shadow-sm active:scale-95 transition-all"
            title="Emergency Calm Grounding Mode"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-gentle-pulse" />
            <span>SOS CALM</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Sub-Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] font-bold shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-[11px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
