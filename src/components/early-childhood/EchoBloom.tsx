'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import { speechService } from '@/lib/speechSynthesis';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Flower2,
  Train,
  CircleDot,
  Trophy,
  Sliders,
  Flame,
  Star,
  Compass,
  RotateCcw
} from 'lucide-react';

interface TargetWord {
  word: string;
  category: 'needs' | 'animals' | 'trains' | 'space' | 'dinosaurs';
  phoneticPrompt: string;
  allowedApproximations: string[];
  icon: string;
}

const targetWords: TargetWord[] = [
  {
    word: 'Water',
    category: 'needs',
    phoneticPrompt: 'Try saying "Wuh" or "Water"',
    allowedApproximations: ['wuh', 'wah', 'water', 'wawa', 'wata', 'otter', 'wa'],
    icon: '💧',
  },
  {
    word: 'Break',
    category: 'needs',
    phoneticPrompt: 'Try saying "Buh" or "Break"',
    allowedApproximations: ['buh', 'bayk', 'break', 'bake', 'bray', 'rayk', 'brek'],
    icon: '⏸️',
  },
  {
    word: 'Help',
    category: 'needs',
    phoneticPrompt: 'Try saying "Heh" or "Help"',
    allowedApproximations: ['heh', 'hep', 'help', 'elp', 'ha', 'peh'],
    icon: '🤝',
  },
  {
    word: 'Train',
    category: 'trains',
    phoneticPrompt: 'Try saying "Choo" or "Train"',
    allowedApproximations: ['choo', 'twayn', 'train', 'tayn', 'chug', 'toot'],
    icon: '🚂',
  },
  {
    word: 'Rocket',
    category: 'space',
    phoneticPrompt: 'Try saying "Raw" or "Rocket"',
    allowedApproximations: ['raw', 'wocket', 'rocket', 'rokit', 'rock', 'zoom'],
    icon: '🚀',
  },
  {
    word: 'Star',
    category: 'space',
    phoneticPrompt: 'Try saying "Tah" or "Star"',
    allowedApproximations: ['tah', 'star', 'stah', 'tar', 'sar'],
    icon: '⭐',
  },
  {
    word: 'Dino',
    category: 'dinosaurs',
    phoneticPrompt: 'Try saying "Dee" or "Dino"',
    allowedApproximations: ['dee', 'dino', 'rawr', 'dyno', 'dina'],
    icon: '🦖',
  },
  {
    word: 'Cat',
    category: 'animals',
    phoneticPrompt: 'Try saying "Meow" or "Cat"',
    allowedApproximations: ['meow', 'cat', 'kah', 'tat', 'cah'],
    icon: '🐱',
  },
  {
    word: 'More',
    category: 'needs',
    phoneticPrompt: 'Try saying "Mo" or "More"',
    allowedApproximations: ['mo', 'more', 'maw', 'moo', 'mor'],
    icon: '➕',
  },
];

type VisualTheme = 'flower' | 'train' | 'bubbles' | 'stars' | 'pond';

export default function EchoBloom() {
  const [selectedWord, setSelectedWord] = useState<TargetWord>(targetWords[0]);
  const [visualMode, setVisualMode] = useState<VisualTheme>('flower');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isListening, setIsListening] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(0);
  const [lastRecognizedPhoneme, setLastRecognizedPhoneme] = useState<string>('');
  const [rewardLevel, setRewardLevel] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalEfforts, setTotalEfforts] = useState<number>(0);
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState<number>(1.5);
  const [showSettings, setShowSettings] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<unknown>(null);

  // Canvas visual loop (flower bloom / train track / bubbles / stars / pond ripples)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let growth = 0;
    let trainPos = 0;
    let angleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const metrics = sensoryAudio.getMicMetrics();
      const boostedVolume = Math.min(1.0, metrics.volume * sensitivityMultiplier);
      setVocalVolume(boostedVolume);

      // Growth progresses with microphone energy + reward level
      const targetGrowth = (rewardLevel / 100) * 120 + boostedVolume * 70;
      growth += (targetGrowth - growth) * 0.12;
      angleOffset += 0.02;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (visualMode === 'flower') {
        // Blooming Lotus & Garden Flora
        ctx.beginPath();
        ctx.moveTo(centerX, canvas.height - 20);
        ctx.quadraticCurveTo(centerX + Math.sin(Date.now() * 0.002) * 10, centerY + 40, centerX, centerY + 30 - growth * 0.5);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#4f8d7b';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaves
        ctx.beginPath();
        ctx.ellipse(centerX - 28, centerY + 40, 22, 12, -0.4, 0, Math.PI * 2);
        ctx.ellipse(centerX + 28, centerY + 20, 22, 12, 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#6da996';
        ctx.fill();

        // Petals
        const petalCount = 8;
        const petalRadius = 28 + (growth * 0.5);
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * (Math.PI * 2)) / petalCount + (growth * 0.015);
          const px = centerX + Math.cos(angle) * (petalRadius * 0.75);
          const py = centerY - growth * 0.5 + Math.sin(angle) * (petalRadius * 0.75);

          ctx.beginPath();
          ctx.arc(px, py, petalRadius * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${280 + i * 14}, 85%, 72%, 0.85)`;
          ctx.fill();
        }

        // Glowing Core
        ctx.beginPath();
        ctx.arc(centerX, centerY - growth * 0.5, 20 + boostedVolume * 15, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (visualMode === 'train') {
        // Railroad tracks
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(20, centerY + 40);
        ctx.lineTo(canvas.width - 20, centerY + 40);
        ctx.moveTo(20, centerY + 60);
        ctx.lineTo(canvas.width - 20, centerY + 60);
        ctx.stroke();

        // Ties
        for (let x = 30; x < canvas.width - 20; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, centerY + 35);
          ctx.lineTo(x, centerY + 65);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#94a3b8';
          ctx.stroke();
        }

        // Train Engine position
        trainPos = (trainPos + (boostedVolume * 5) + (rewardLevel > 50 ? 3 : 0.6)) % (canvas.width + 120);
        const tx = trainPos - 90;

        // Train body
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(tx, centerY - 10, 75, 45);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(tx + 50, centerY - 25, 25, 30);

        // Smoke puff
        if (boostedVolume > 0.08 || rewardLevel > 30) {
          ctx.beginPath();
          ctx.arc(tx + 18, centerY - 35 - (boostedVolume * 22), 12 + boostedVolume * 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fill();
        }
      } else if (visualMode === 'stars') {
        // Expanding Constellation Matrix
        const time = Date.now() * 0.002;
        const starCount = 12;
        for (let i = 0; i < starCount; i++) {
          const r = 40 + i * 8 + growth * 0.4;
          const a = (i * Math.PI * 2) / starCount + time;
          const sx = centerX + Math.cos(a) * r;
          const sy = centerY + Math.sin(a) * r * 0.6;

          ctx.beginPath();
          ctx.arc(sx, sy, 4 + boostedVolume * 5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#c084fc';
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (visualMode === 'pond') {
        // Water Ripple Rings
        const ringCount = 5;
        for (let i = 0; i < ringCount; i++) {
          const r = ((Date.now() * 0.05 + i * 30 + growth) % 120) + 10;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, r * 1.5, r * 0.8, 0, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - r / 120) * 0.8})`;
          ctx.stroke();
        }
      } else {
        // Bioluminescent Bubbles
        const time = Date.now() * 0.003;
        for (let i = 0; i < 7; i++) {
          const bx = centerX + Math.sin(time + i) * 80;
          const by = ((canvas.height - (time * 40 + i * 50)) % canvas.height + canvas.height) % canvas.height;
          const r = 18 + Math.sin(time + i) * 6 + (boostedVolume * 22);

          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${170 + i * 25}, 80%, 65%, 0.6)`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [visualMode, rewardLevel, sensitivityMultiplier]);

  // Start Mic & Lenient Speech Recognition
  const toggleListening = async () => {
    if (isListening) {
      sensoryAudio.stopMicAnalysis();
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as { stop: () => void }).stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      const micOk = await sensoryAudio.startMicAnalysis();
      if (!micOk) {
        alert('Please allow microphone permissions to practice vocal sounds.');
        return;
      }

      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new (SpeechRecognition as new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onresult: (e: any) => void;
          start: () => void;
          stop: () => void;
        })();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          if (event.results && event.results.length > 0) {
            const transcript = event.results[event.results.length - 1][0]?.transcript?.toLowerCase()?.trim() || '';
            setLastRecognizedPhoneme(transcript);
            evaluatePhoneme(transcript);
          }
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
        }
      }

      setIsListening(true);
      sensoryAudio.playSoftChime('tap');
    }
  };

  const evaluatePhoneme = (heardText: string) => {
    const isMatch = selectedWord.allowedApproximations.some((approx) => heardText.includes(approx));
    const score = isMatch ? 0.95 : 0.75;

    setTotalEfforts((prev) => prev + 1);

    // Async log attempt to SQLite
    try {
      fetch('/api/speech-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: selectedWord.word,
          phonemeDetected: heardText,
          accuracyScore: score,
        }),
      }).catch(() => {});
    } catch {}

    if (isMatch) {
      setRewardLevel(100);
      setStreakCount((prev) => prev + 1);
      sensoryAudio.playSoftChime('bloom');

      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6']
        });
      } catch {}

      setTimeout(() => {
        setRewardLevel(0);
      }, 3000);
    } else {
      // Affirming partial vocal effort reward
      setRewardLevel(50);
      setTimeout(() => setRewardLevel(0), 1800);
    }
  };

  const handleWordSelect = (word: TargetWord) => {
    setSelectedWord(word);
    setLastRecognizedPhoneme('');
    setRewardLevel(0);
    speechService.speak(word.word);
    sensoryAudio.playSoftChime('tap');
  };

  const filteredWords = activeCategory === 'all'
    ? targetWords
    : targetWords.filter(w => w.category === activeCategory);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Top Header & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl sensory-card">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <span>EchoBloom Phonetics 2.0</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
              Lenient Voice Play
            </span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Rewards any vocal effort and sounds—zero clinical pressure!
          </p>
        </div>

        {/* Gamification Badges & Sensitivity */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-800 dark:text-amber-200 text-xs font-extrabold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streakCount} Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-400 text-blue-800 dark:text-blue-200 text-xs font-extrabold">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span>{totalEfforts} Tries</span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            title="Calibrate Mic Sensitivity"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mic Sensitivity Slider Drawer */}
      {showSettings && (
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
              <span>Microphone Sensitivity Booster</span>
              <span className="font-mono">{sensitivityMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.25"
              value={sensitivityMultiplier}
              onChange={(e) => setSensitivityMultiplier(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Visual Canvas Theme Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'flower', label: 'Flora', icon: Flower2 },
            { id: 'train', label: 'Train Track', icon: Train },
            { id: 'stars', label: 'Constellations', icon: Star },
            { id: 'pond', label: 'Ripple Pond', icon: Compass },
            { id: 'bubbles', label: 'Bubbles', icon: CircleDot },
          ].map((theme) => {
            const Icon = theme.icon;
            const isActive = visualMode === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setVisualMode(theme.id as VisualTheme)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>

        {/* Word Category Filter */}
        <div className="flex items-center gap-1">
          {['all', 'needs', 'trains', 'space', 'dinosaurs'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Target Word Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {filteredWords.map((item) => {
          const isSelected = selectedWord.word === item.word;
          return (
            <button
              key={item.word}
              onClick={() => handleWordSelect(item)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                isSelected
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold scale-105 shadow-md'
                  : 'border-[var(--border-color)] sensory-card hover:border-[var(--accent-primary)]/50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-bold text-[var(--text-primary)]">{item.word}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Animation Canvas */}
      <div className="relative rounded-3xl sensory-card border-2 border-[var(--border-color)] overflow-hidden bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-secondary)] flex flex-col items-center justify-center p-4 min-h-[320px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full max-w-[600px] h-[260px] object-contain"
        />

        {rewardLevel >= 100 && (
          <div className="absolute top-6 px-6 py-2.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span>Wonderful Sound! Beautiful Effort! 🎉</span>
          </div>
        )}

        {/* Microphone Energy Indicator */}
        <div className="w-full max-w-xs mt-2 flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-[var(--border-color)]">
          <Mic className={`w-4 h-4 ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-75"
              style={{ width: `${Math.min(100, vocalVolume * 100 * 2.5)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-secondary)]">
            {Math.round(vocalVolume * 100)}%
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 rounded-2xl sensory-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Target Prompt
          </p>
          <p className="text-base font-extrabold text-[var(--text-primary)]">
            {selectedWord.phoneticPrompt}
          </p>
          {lastRecognizedPhoneme && (
            <p className="text-xs text-[var(--accent-primary)] font-semibold">
              Heard sound: "{lastRecognizedPhoneme}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => speechService.speak(selectedWord.word)}
            className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 text-[var(--text-primary)] transition-colors"
            title="Hear Target Word"
          >
            <Volume2 className="w-5 h-5 text-[var(--accent-primary)]" />
          </button>

          <button
            onClick={toggleListening}
            className={`px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2.5 shadow-lg transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-gentle-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Practice</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
