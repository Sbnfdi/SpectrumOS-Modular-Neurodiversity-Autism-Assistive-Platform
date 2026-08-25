'use client';

import React, { useState } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import { useProfileStore } from '@/store/useProfileStore';
import {
  Compass,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  AlertCircle,
  Shield,
  MessageSquare,
  Zap,
  Smile,
  HelpCircle
} from 'lucide-react';

interface ToneAnalysis {
  literalMeaning: string;
  subtext: string;
  toneMetrics: {
    urgency: string;
    urgencyScore: number;
    politeness: string;
    politenessScore: number;
    sarcasmLikelihood: string;
    sarcasmScore: number;
  };
  emotionalState: string;
  suggestedResponses: {
    style: string;
    text: string;
    energyLevel: string;
  }[];
}

const sampleMessages = [
  'Per my last email, the client is expecting the deliverables by noon today.',
  'No worries if not! Just checking in to see if you had bandwidth for this.',
  'We need to talk when you have a minute.',
  'Fine, whatever you think is best.',
  'Can you look at this ASAP?',
];

export default function ToneDecoder() {
  const { apiKey } = useProfileStore();
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleDecode = async (textToDecode: string) => {
    if (!textToDecode.trim()) return;

    setIsLoading(true);
    sensoryAudio.playSoftChime('tap');

    try {
      const res = await fetch('/api/ai/tone-decoder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToDecode,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        sensoryAudio.playSoftChime('success');
      }
    } catch (err) {
      console.error('Failed to decode tone:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    sensoryAudio.playSoftChime('tap');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Header & Prompt */}
      <div className="p-5 rounded-3xl sensory-card space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[var(--accent-primary)]" />
            <span>Tone & Subtext Decoder</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Decodes ambiguous emails, Slack messages, or neurotypical subtext into explicit literal facts and drafted replies.
          </p>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any confusing email, text, or Slack message here..."
            className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none placeholder:text-[var(--text-secondary)]/60"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Quick Sample Presets */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-semibold text-[var(--text-secondary)] self-center mr-1">
                Try:
              </span>
              {sampleMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(msg);
                    handleDecode(msg);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 border border-[var(--border-color)] text-[var(--text-primary)] transition-all truncate max-w-[200px]"
                >
                  "{msg}"
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDecode(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Decode Subtext</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Factual vs Subtext Cards (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Literal Meaning Card */}
            <div className="p-5 rounded-3xl sensory-card border-2 border-blue-400/40 bg-gradient-to-b from-blue-500/5 to-transparent space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>Literal Meaning (Factual Content)</span>
              </div>
              <p className="text-sm sm:text-base text-[var(--text-primary)] font-medium leading-relaxed">
                {analysis.literalMeaning}
              </p>
            </div>

            {/* Hidden Subtext & Emotional Tone */}
            <div className="p-5 rounded-3xl sensory-card border-2 border-purple-400/40 bg-gradient-to-b from-purple-500/5 to-transparent space-y-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                <Zap className="w-4 h-4" />
                <span>Subtext & Social Expectations</span>
              </div>
              <p className="text-sm sm:text-base text-[var(--text-primary)] font-medium leading-relaxed">
                {analysis.subtext}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                <span>Sender State:</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300">
                  {analysis.emotionalState}
                </span>
              </div>
            </div>
          </div>

          {/* Tone Meters (Urgency, Politeness, Sarcasm) */}
          <div className="p-5 rounded-3xl sensory-card border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Urgency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--text-secondary)]">Urgency Level</span>
                <span className="text-[var(--text-primary)]">{analysis.toneMetrics.urgency}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${analysis.toneMetrics.urgencyScore}%` }}
                />
              </div>
            </div>

            {/* Politeness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--text-secondary)]">Politeness Tone</span>
                <span className="text-[var(--text-primary)]">{analysis.toneMetrics.politeness}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${analysis.toneMetrics.politenessScore}%` }}
                />
              </div>
            </div>

            {/* Sarcasm */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--text-secondary)]">Sarcasm Likelihood</span>
                <span className="text-[var(--text-primary)]">{analysis.toneMetrics.sarcasmLikelihood}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${analysis.toneMetrics.sarcasmScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Pre-Drafted Suggested Responses */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Suggested Pre-Drafted Responses</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.suggestedResponses.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl sensory-card border border-[var(--border-color)] flex flex-col justify-between gap-3 bg-[var(--bg-surface)]/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--accent-primary)]">
                        {res.style}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                        {res.energyLevel} Spoons
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                      "{res.text}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(res.text, idx)}
                    className="w-full py-2 px-3 rounded-xl border border-[var(--border-color)] bg-white dark:bg-slate-800 hover:bg-[var(--accent-primary)] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
