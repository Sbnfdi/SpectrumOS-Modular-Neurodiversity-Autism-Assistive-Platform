'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import { speechService } from '@/lib/speechSynthesis';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Flower2,
  Train,
  CircleDot,
  CheckCircle,
  RotateCcw,
  Trophy
} from 'lucide-react';

interface TargetWord {
  word: string;
  phoneticPrompt: string;
  allowedApproximations: string[];
  icon: string;
}

const targetWords: TargetWord[] = [
  {
    word: 'Water',
    phoneticPrompt: 'Try saying "Wuh" or "Water"',
    allowedApproximations: ['wuh', 'wah', 'water', 'wawa', 'wata', 'otter', 'wa'],
    icon: '💧',
  },
  {
    word: 'Break',
    phoneticPrompt: 'Try saying "Buh" or "Break"',
    allowedApproximations: ['buh', 'bayk', 'break', 'bake', 'bray', 'rayk', 'brek'],
    icon: '⏸️',
  },
  {
    word: 'Help',
    phoneticPrompt: 'Try saying "Heh" or "Help"',
    allowedApproximations: ['heh', 'hep', 'help', 'elp', 'ha', 'peh'],
    icon: '🤝',
  },
  {
    word: 'Train',
    phoneticPrompt: 'Try saying "Choo" or "Train"',
    allowedApproximations: ['choo', 'twayn', 'train', 'tayn', 'chug', 'toot'],
    icon: '🚂',
  },
  {
    word: 'More',
    phoneticPrompt: 'Try saying "Mo" or "More"',
    allowedApproximations: ['mo', 'more', 'maw', 'moo', 'mor'],
    icon: '➕',
  },
];

export default function EchoBloom() {
  const [selectedWord, setSelectedWord] = useState<TargetWord>(targetWords[0]);
  const [visualMode, setVisualMode] = useState<'flower' | 'train' | 'bubbles'>('flower');
  const [isListening, setIsListening] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(0);
  const [lastRecognizedPhoneme, setLastRecognizedPhoneme] = useState<string>('');
  const [rewardLevel, setRewardLevel] = useState<number>(0); // 0 to 100
  const [successCount, setSuccessCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<unknown>(null);

  // Canvas visual loop (flower bloom / train track / bubbles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let growth = 0;
    let trainPos = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const metrics = sensoryAudio.getMicMetrics();
      setVocalVolume(metrics.volume);

      // Growth progresses with microphone energy + reward Level
      const targetGrowth = (rewardLevel / 100) * 120 + metrics.volume * 60;
      growth += (targetGrowth - growth) * 0.1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (visualMode === 'flower') {
        // Stem
        ctx.beginPath();
        ctx.moveTo(centerX, canvas.height - 20);
        ctx.quadraticCurveTo(centerX + Math.sin(Date.now() * 0.002) * 10, centerY + 40, centerX, centerY + 30 - growth * 0.5);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#4f8d7b';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaves
        ctx.beginPath();
        ctx.ellipse(centerX - 25, centerY + 40, 20, 10, -0.4, 0, Math.PI * 2);
        ctx.ellipse(centerX + 25, centerY + 20, 20, 10, 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#6da996';
        ctx.fill();

        // Flower Petals
        const petalCount = 8;
        const petalRadius = 25 + (growth * 0.45);
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * (Math.PI * 2)) / petalCount + (growth * 0.01);
          const px = centerX + Math.cos(angle) * (petalRadius * 0.7);
          const py = centerY - growth * 0.5 + Math.sin(angle) * (petalRadius * 0.7);

          ctx.beginPath();
          ctx.arc(px, py, petalRadius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${280 + i * 12}, 85%, 72%, 0.85)`;
          ctx.fill();
        }

        // Flower Center Glowing Core
        ctx.beginPath();
        ctx.arc(centerX, centerY - growth * 0.5, 20 + metrics.volume * 15, 0, Math.PI * 2);
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
        trainPos = (trainPos + (metrics.volume * 4) + (rewardLevel > 50 ? 2 : 0.5)) % (canvas.width + 100);
        const tx = trainPos - 80;

        // Train body
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(tx, centerY - 10, 70, 45);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(tx + 45, centerY - 25, 25, 30); // Cabin

        // Smoke puff
        if (metrics.volume > 0.1 || rewardLevel > 30) {
          ctx.beginPath();
          ctx.arc(tx + 15, centerY - 35 - (metrics.volume * 20), 12 + metrics.volume * 15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        }
      } else {
        // Bioluminescent Bubbles
        const time = Date.now() * 0.003;
        for (let i = 0; i < 7; i++) {
          const bx = centerX + Math.sin(time + i) * 80;
          const by = ((canvas.height - (time * 40 + i * 50)) % canvas.height + canvas.height) % canvas.height;
          const r = 18 + Math.sin(time + i) * 6 + (metrics.volume * 20);

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
  }, [visualMode, rewardLevel]);

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

      // Initialize Web Speech Recognition if available in browser
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

  // Lenient Phoneme & Vocal Effort Evaluation
  const evaluatePhoneme = (heardText: string) => {
    const isMatch = selectedWord.allowedApproximations.some((approx) => heardText.includes(approx));
    const score = isMatch ? 0.95 : 0.75;

    // Log attempt to SQLite database
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
      setSuccessCount((prev) => prev + 1);
      sensoryAudio.playSoftChime('bloom');

      setTimeout(() => {
        setRewardLevel(0);
      }, 3000);
    } else {
      // Reward any genuine vocal attempt with partial bloom (neurodiversity-affirming)
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Top Controls & Visual Theme Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl sensory-card">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <span>EchoBloom</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
              Lenient Voice Play
            </span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Rewards any vocal effort and sounds—perfection is never required!
          </p>
        </div>

        {/* Visual Animation Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <button
            onClick={() => setVisualMode('flower')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              visualMode === 'flower'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Flowers</span>
          </button>
          <button
            onClick={() => setVisualMode('train')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              visualMode === 'train'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-blue-500" />
            <span>Train</span>
          </button>
          <button
            onClick={() => setVisualMode('bubbles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              visualMode === 'bubbles'
                ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5 text-teal-500" />
            <span>Bubbles</span>
          </button>
        </div>
      </div>

      {/* Target Word Selection Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {targetWords.map((item) => {
          const isSelected = selectedWord.word === item.word;
          return (
            <button
              key={item.word}
              onClick={() => handleWordSelect(item)}
              className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                isSelected
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold scale-105 shadow-md'
                  : 'border-[var(--border-color)] sensory-card hover:border-[var(--accent-primary)]/50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">{item.word}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Interactive Animation Screen */}
      <div className="relative rounded-3xl sensory-card border-2 border-[var(--border-color)] overflow-hidden bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-secondary)] flex flex-col items-center justify-center p-4 min-h-[320px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full max-w-[600px] h-[260px] object-contain"
        />

        {/* Floating Success Celebration Banner */}
        {rewardLevel >= 100 && (
          <div className="absolute top-6 px-6 py-2.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span>Wonderful Sound! Beautiful Effort! 🎉</span>
          </div>
        )}

        {/* Microphone Energy Indicator Bar */}
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

      {/* Action Bar & Prompt */}
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
          {/* Audio Hear Target Word Button */}
          <button
            onClick={() => speechService.speak(selectedWord.word)}
            className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 text-[var(--text-primary)] transition-colors"
            title="Hear Target Word"
          >
            <Volume2 className="w-5 h-5 text-[var(--accent-primary)]" />
          </button>

          {/* Big Mic Start / Stop Button */}
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
