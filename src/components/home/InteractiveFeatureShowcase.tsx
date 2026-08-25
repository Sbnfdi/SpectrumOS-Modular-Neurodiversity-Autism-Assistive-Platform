'use client';

import React, { useState } from 'react';
import { speechService } from '@/lib/speechSynthesis';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  MessageSquareHeart,
  Mic,
  BookOpen,
  Compass,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Droplet,
  DoorClosed,
  Moon,
  Clock,
  Zap,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function InteractiveFeatureShowcase() {
  const [activeTab, setActiveTab] = useState<'aac' | 'stories' | 'tone' | 'focus'>('aac');
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState('Tap any tile below to preview instant speech synthesis');

  const demoTiles = [
    { label: 'Need Water', phrase: 'May I please have some water?', icon: Droplet, color: 'border-blue-400 bg-blue-500/10 text-blue-800 dark:text-blue-200' },
    { label: 'Bathroom', phrase: 'I need to use the restroom.', icon: DoorClosed, color: 'border-indigo-400 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200' },
    { label: 'Sensory Break', phrase: 'I need a 5-minute quiet sensory break.', icon: Moon, color: 'border-purple-400 bg-purple-500/10 text-purple-800 dark:text-purple-200' },
    { label: 'Too Loud', phrase: 'The sound is too loud. May I use my headphones?', icon: Sparkles, color: 'border-rose-400 bg-rose-500/10 text-rose-800 dark:text-rose-200' },
  ];

  const handleTileClick = (phrase: string) => {
    setSpokenText(phrase);
    sensoryAudio.playSoftChime('success');
    speechService.speak(phrase);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(text);
    sensoryAudio.playSoftChime('tap');
    setTimeout(() => setCopiedResponse(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Showcase Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-primary)] font-bold tracking-wider uppercase">
            Interactive Testbed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)] mt-1">
            Experience the Core Assistive Engines
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('aac')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all tactile-btn flex items-center gap-1.5 ${
              activeTab === 'aac'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-blue-500" />
            <span>AAC Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all tactile-btn flex items-center gap-1.5 ${
              activeTab === 'stories'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-500" />
            <span>Social Stories</span>
          </button>

          <button
            onClick={() => setActiveTab('tone')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all tactile-btn flex items-center gap-1.5 ${
              activeTab === 'tone'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Tone Decoder</span>
          </button>
        </div>
      </div>

      {/* Interactive Feature Display Panels */}
      <div className="p-6 sm:p-8 rounded-3xl sensory-card border-2 border-[var(--border-color)] min-h-[340px] flex flex-col justify-between space-y-6">
        {activeTab === 'aac' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Audio Bar */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-secondary)]">
                    Live Speech Synthesis Output
                  </span>
                  <p className="text-base font-extrabold text-[var(--text-primary)]">
                    "{spokenText}"
                  </p>
                </div>
              </div>

              <Link
                href="/early-childhood"
                className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold font-display flex items-center gap-1 hover:bg-[var(--accent-hover)] transition-colors shrink-0"
              >
                <span>Full AAC Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Interactive Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {demoTiles.map((tile, i) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleTileClick(tile.phrase)}
                    className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all tactile-btn text-center hover:scale-105 shadow-xs ${tile.color}`}
                  >
                    <Icon className="w-8 h-8 stroke-[2.2]" />
                    <span className="text-sm font-extrabold font-display">{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">
                  Scenario Preview
                </span>
                <h4 className="text-lg font-extrabold font-display text-[var(--text-primary)]">
                  Carol Gray 4-Step Social Story: "Visiting the Dentist"
                </h4>
              </div>

              <Link
                href="/school-age"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold font-display flex items-center gap-1 hover:bg-teal-700 transition-colors shrink-0"
              >
                <span>Generate Custom Stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <span className="font-mono font-bold text-teal-600">STEP 1: DESCRIPTIVE</span>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  "We visit the dental clinic so our teeth stay strong and healthy. The waiting room has soft chairs."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <span className="font-mono font-bold text-blue-600">STEP 2: PERSPECTIVE</span>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  "The dentist wears a clean blue mask and shines a special light to inspect teeth carefully."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-800 space-y-1">
                <span className="font-mono font-bold text-teal-700 dark:text-teal-300">STEP 3: COPING DIRECTIVE</span>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  "The brush hums like a gentle bee. I can raise my hand if I need a 10-second pause."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <span className="font-mono font-bold text-purple-600">STEP 4: RESOLUTION</span>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  "My teeth feel super clean. I pick a reward sticker and celebrate my brave effort."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tone' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Subtext Analysis Sample
                </span>
                <h4 className="text-lg font-extrabold font-display text-[var(--text-primary)]">
                  Input: "Per my last email, please provide the requested files."
                </h4>
              </div>

              <Link
                href="/adult"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold font-display flex items-center gap-1 hover:bg-amber-700 transition-colors shrink-0"
              >
                <span>Full Tone Decoder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-300 dark:border-blue-800 space-y-1">
                <strong className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 block">
                  LITERAL FACTUAL CONTENT
                </strong>
                <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  The sender is referencing earlier information and requests the files again.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-300 dark:border-purple-800 space-y-1">
                <strong className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 block">
                  SOCIAL SUBTEXT DECODED
                </strong>
                <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  Mild impatience: Sender wants you to check the earlier thread before asking.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-md">
                Pre-drafted reply: <em>"Received, thank you. Attaching the files directly for your convenience."</em>
              </span>
              <button
                onClick={() => handleCopy("Received, thank you. Attaching the files directly for your convenience.")}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-white dark:bg-slate-800 text-xs font-bold flex items-center gap-1 hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
