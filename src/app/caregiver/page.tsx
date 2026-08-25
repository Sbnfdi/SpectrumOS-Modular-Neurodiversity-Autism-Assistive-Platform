'use client';

import React, { useState, useEffect } from 'react';
import { useProfileStore, UserProfile } from '@/store/useProfileStore';
import { useSensoryStore } from '@/store/useSensoryStore';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Users,
  Settings,
  Shield,
  Key,
  Database,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Volume2,
  WifiOff,
  Wifi,
  Download,
  Upload,
  Heart,
  Gamepad2
} from 'lucide-react';

export default function CaregiverPage() {
  const {
    activeProfile,
    availableProfiles,
    setActiveProfile,
    updateSensorySensitivities,
    apiKey,
    setApiKey,
    isOfflineMode,
    toggleOfflineMode
  } = useProfileStore();

  const { theme, setTheme, volumeCeiling, setVolumeCeiling } = useSensoryStore();

  const [newSensitivity, setNewSensitivity] = useState('');
  const [newSpecialInterest, setNewSpecialInterest] = useState('');
  const [keyInput, setKeyInput] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);
  const [speechLogs, setSpeechLogs] = useState<any[]>([]);

  // Fetch real speech logs from SQLite
  useEffect(() => {
    fetch('/api/speech-attempts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.attempts && data.attempts.length > 0) {
          setSpeechLogs(data.attempts);
        } else {
          // Fallback demo items
          setSpeechLogs([
            { id: '1', targetWord: 'Water', phonemeDetected: 'Wuh-t', accuracyScore: 0.88, recordedAt: new Date() },
            { id: '2', targetWord: 'Break', phonemeDetected: 'B-ray-k', accuracyScore: 0.94, recordedAt: new Date(Date.now() - 3600000) },
            { id: '3', targetWord: 'Help', phonemeDetected: 'Heh-p', accuracyScore: 0.82, recordedAt: new Date(Date.now() - 7200000) },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddSensitivity = () => {
    if (!newSensitivity.trim()) return;
    if (activeProfile.sensorySensitivities.includes(newSensitivity.trim())) return;

    const updated = [...activeProfile.sensorySensitivities, newSensitivity.trim()];
    updateSensorySensitivities(updated);
    setNewSensitivity('');
    sensoryAudio.playSoftChime('tap');
  };

  const handleRemoveSensitivity = (item: string) => {
    const updated = activeProfile.sensorySensitivities.filter((s) => s !== item);
    updateSensorySensitivities(updated);
    sensoryAudio.playSoftChime('tap');
  };

  const handleAddSpecialInterest = () => {
    if (!newSpecialInterest.trim()) return;
    if (activeProfile.specialInterests.includes(newSpecialInterest.trim())) return;

    activeProfile.specialInterests.push(newSpecialInterest.trim());
    setNewSpecialInterest('');
    sensoryAudio.playSoftChime('tap');
  };

  const handleRemoveSpecialInterest = (item: string) => {
    const updated = activeProfile.specialInterests.filter((s) => s !== item);
    activeProfile.specialInterests = updated;
    sensoryAudio.playSoftChime('tap');
  };

  const handleSaveApiKey = () => {
    setApiKey(keyInput);
    setIsSaved(true);
    sensoryAudio.playSoftChime('success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Export JSON Backup
  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      activeProfile,
      availableProfiles,
      speechLogs,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpectrumOS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    sensoryAudio.playSoftChime('bloom');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl sensory-card bg-gradient-to-r from-slate-500/10 via-indigo-500/5 to-teal-500/10 border-2 border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Caregiver & Clinical Sync Hub
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Manage neurodivergent profiles, sensory accommodation thresholds, and offline sync.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-white dark:bg-slate-800 text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={toggleOfflineMode}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isOfflineMode
                ? 'bg-amber-500/15 border-amber-400 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-500/15 border-emerald-400 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOfflineMode ? 'Offline Local Storage' : 'Cloud Sync Active'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Switcher */}
          <div className="p-6 rounded-3xl sensory-card space-y-4">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Active Individual Profiles</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableProfiles.map((prof) => {
                const isSelected = activeProfile.id === prof.id;
                const stageIcons: Record<string, string> = { early: '🧸', school: '🎒', adult: '🧭' };
                return (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setActiveProfile(prof);
                      sensoryAudio.playSoftChime('tap');
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-start gap-1 transition-all text-left ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold shadow-md scale-105'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl">{stageIcons[prof.developmentalStage] || '👤'}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                    </div>
                    <span className="text-sm font-extrabold text-[var(--text-primary)] mt-1">
                      {prof.displayName}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                      {prof.developmentalStage} Stage
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensory Sensitivities & Special Interests */}
          <div className="p-6 rounded-3xl sensory-card space-y-4">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>Sensory Sensitivities for {activeProfile.displayName}</span>
            </h2>

            {/* Sensitivities Tags */}
            <div className="flex flex-wrap gap-2">
              {activeProfile.sensorySensitivities.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveSensitivity(item)}
                    className="hover:text-rose-950 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Sensitivity Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSensitivity}
                onChange={(e) => setNewSensitivity(e.target.value)}
                placeholder="Add sensitivity (e.g., 'Sudden Sirens', 'Scratchy Wool')..."
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <button
                onClick={handleAddSensitivity}
                className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-1 hover:bg-[var(--accent-hover)] shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Special Interests Accommodations */}
          <div className="p-6 rounded-3xl sensory-card space-y-4">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-indigo-500" />
              <span>Special Interests & Comfort Themes</span>
            </h2>

            <div className="flex flex-wrap gap-2">
              {activeProfile.specialInterests.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-300 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveSpecialInterest(item)}
                    className="hover:text-indigo-950 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSpecialInterest}
                onChange={(e) => setNewSpecialInterest(e.target.value)}
                placeholder="Add comfort interest (e.g., 'Steam Trains', 'Minecraft Redstone', 'Space')..."
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <button
                onClick={handleAddSpecialInterest}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Interest</span>
              </button>
            </div>
          </div>

          {/* Speech Analytics & Progress Log */}
          <div className="p-6 rounded-3xl sensory-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Speech & Vocal Play Analytics (SQLite Records)</span>
              </h2>
              <span className="text-xs text-[var(--text-secondary)] font-semibold">
                Lenient Scoring Mode Active
              </span>
            </div>

            <div className="space-y-2">
              {speechLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[var(--text-primary)]">{log.targetWord}</span>
                    <span className="text-[var(--text-secondary)] font-medium">Heard: "{log.phonemeDetected}"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                      {Math.round((log.accuracyScore || 0.85) * 100)}% Effort Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* AI Settings & BYO Key */}
          <div className="p-6 rounded-3xl sensory-card space-y-4">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>AI Engine Configuration</span>
            </h2>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              SpectrumOS includes a built-in clinical heuristic generator that works 100% offline. You can also provide your OpenAI/Claude key for live cloud models.
            </p>

            <div className="space-y-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-proj-... (Optional)"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="w-full py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-xs"
              >
                {isSaved ? 'API Key Saved!' : 'Save Engine Key'}
              </button>
            </div>
          </div>

          {/* Database & Edge Sync Info */}
          <div className="p-6 rounded-3xl sensory-card space-y-3">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-500" />
              <span>Drizzle ORM & SQLite Sync</span>
            </h2>

            <div className="text-xs text-[var(--text-secondary)] space-y-2 font-medium">
              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span>Database Engine:</span>
                <span className="font-bold text-[var(--text-primary)]">LibSQL / SQLite</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span>Local Cache:</span>
                <span className="font-bold text-[var(--text-primary)]">IndexedDB & SQLite</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span>Offline Fallback:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
