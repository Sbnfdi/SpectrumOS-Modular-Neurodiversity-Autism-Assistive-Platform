'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSensoryStore, SensoryTheme } from '@/store/useSensoryStore';
import { useProfileStore, UserProfile } from '@/store/useProfileStore';
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
  Check,
  Activity,
  Users,
  UserCheck,
  Plus,
  X
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

  const { activeProfile, availableProfiles, setActiveProfile, addProfile } = useProfileStore();
  const [showSensoryMenu, setShowSensoryMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New Profile Form
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileStage, setNewProfileStage] = useState<'early' | 'school' | 'adult'>('early');
  const [newProfileRole, setNewProfileRole] = useState<'individual' | 'caregiver' | 'therapist' | 'educator'>('individual');
  const [newProfileAvatar, setNewProfileAvatar] = useState('🌟');

  const navItems = [
    { href: '/early-childhood', label: 'Early Childhood', sub: '2–7 yrs', icon: '🧸' },
    { href: '/school-age', label: 'School Age', sub: '8–12 yrs', icon: '🎒' },
    { href: '/adult', label: 'Adulthood', sub: '13+ yrs', icon: '🧭' },
    { href: '/caregiver', label: 'Caregiver Hub', sub: 'Sync', icon: '⚙️' },
  ];

  const themes: { id: SensoryTheme; label: string; bg: string; border: string }[] = [
    { id: 'calm-blue', label: 'Calm Blue', bg: '#e0effe', border: '#38a5f6' },
    { id: 'warm-sand', label: 'Warm Sand', bg: '#f4ecdf', border: '#c4a174' },
    { id: 'forest-mist', label: 'Forest Mist', bg: '#def0e7', border: '#4f8d7b' },
    { id: 'lavender-dusk', label: 'Lavender Dusk', bg: '#efe8ff', border: '#9c6bf9' },
    { id: 'high-contrast', label: 'High Contrast', bg: '#000000', border: '#ffff00' },
    { id: 'dark', label: 'Midnight Dark', bg: '#111b2b', border: '#38a5f6' },
  ];

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;

    const newProf: UserProfile = {
      id: `prof_${Date.now()}`,
      displayName: newProfileName.trim(),
      role: newProfileRole,
      developmentalStage: newProfileStage,
      sensorySensitivities: ['Loud sounds', 'Unexpected transitions'],
      specialInterests: ['Special interest exploration'],
      preferredTheme: 'calm-blue',
      avatarIcon: newProfileAvatar,
    };

    addProfile(newProf);
    setNewProfileName('');
    setShowProfileModal(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-[#0b111a]/75 border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Stage Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-400 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b111a]/30 dark:bg-[#0b111a]/60 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight font-display text-[var(--text-primary)]">
                  Spectrum<span className="text-[var(--accent-primary)] font-extrabold">OS</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                  v1.0
                </span>
              </div>
            </div>
          </Link>

          {/* Profile Switcher Quick Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-400 text-xs text-[var(--text-secondary)] transition-all"
            title="Switch User Profile"
          >
            <span>{activeProfile.avatarIcon || '👤'}</span>
            <span className="font-bold text-[var(--text-primary)]">{activeProfile.displayName}</span>
            <span className="text-[10px] capitalize px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 font-semibold">
              {activeProfile.role}
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-2 transition-all tactile-btn ${
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
        <div className="flex items-center gap-2">
          {/* Mobile Profile Switch Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="sm:hidden p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm"
          >
            {activeProfile.avatarIcon || '👤'}
          </button>

          {/* Sensory Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSensoryMenu(!showSensoryMenu)}
              className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1 tactile-btn"
              title="Sensory Adjustments"
            >
              <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
              <Sliders className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>

            {showSensoryMenu && (
              <div className="absolute right-0 mt-2 w-72 sensory-card p-4 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-[var(--text-primary)]">
                    Sensory Preferences
                  </span>
                  <button
                    onClick={() => setShowSensoryMenu(false)}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold"
                  >
                    Done
                  </button>
                </div>

                {/* Theme Switcher */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2 font-display">
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

                {/* Volume Ceiling Slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    <span className="font-display">Volume Ceiling</span>
                    <span className="font-mono">{Math.round(volumeCeiling * 100)}%</span>
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
                  <span className="text-xs font-medium text-[var(--text-primary)] font-display">Reduced Motion</span>
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

          {/* Emergency Calm SOS Meltdown Button */}
          <button
            onClick={triggerEmergencyCalm}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400 text-rose-700 dark:text-rose-300 font-extrabold text-xs font-display shadow-xs active:scale-95 transition-all"
            title="Emergency Calm Grounding Mode"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-gentle-pulse" />
            <span>SOS CALM</span>
          </button>
        </div>
      </div>

      {/* Multi-Profile Switcher Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg sensory-card p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  Select or Switch User Profile
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
              {availableProfiles.map((prof) => {
                const isActive = activeProfile.id === prof.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setActiveProfile(prof);
                      setShowProfileModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-500/15 border-blue-500 shadow-sm scale-[1.02]'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{prof.avatarIcon || '👤'}</span>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{prof.displayName}</p>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          {prof.role} • {prof.developmentalStage}
                        </span>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>

            {/* Add New Profile Form */}
            <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Create New Member / Client Profile
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Display Name (e.g. 'Alex')"
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                />
                <select
                  value={newProfileRole}
                  onChange={(e) => setNewProfileRole(e.target.value as UserProfile['role'])}
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                >
                  <option value="individual">Individual (User)</option>
                  <option value="caregiver">Caregiver / Parent</option>
                  <option value="therapist">Therapist (OT/SLP)</option>
                  <option value="educator">Educator / Teacher</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newProfileStage}
                  onChange={(e) => setNewProfileStage(e.target.value as UserProfile['developmentalStage'])}
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                >
                  <option value="early">Early Childhood (2–7)</option>
                  <option value="school">School Age (8–12)</option>
                  <option value="adult">Adulthood (13+)</option>
                </select>

                <select
                  value={newProfileAvatar}
                  onChange={(e) => setNewProfileAvatar(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                >
                  <option value="🌟">🌟 Star</option>
                  <option value="🚂">🚂 Train</option>
                  <option value="🚀">🚀 Space Rocket</option>
                  <option value="🦖">🦖 Dinosaur</option>
                  <option value="💻">💻 Code Terminal</option>
                  <option value="🎨">🎨 Artist</option>
                </select>
              </div>

              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
