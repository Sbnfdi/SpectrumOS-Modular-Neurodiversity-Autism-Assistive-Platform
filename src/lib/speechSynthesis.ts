'use client';

// Predictable, soothing Text-to-Speech (TTS) engine using Web Speech API
export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize soothing, natural sounding voices (Google US English, Samantha, Daniel, Natural)
    this.preferredVoice =
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Karen')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  public speak(text: string, options: { rate?: number; pitch?: number; onEnd?: () => void } = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this environment');
      return;
    }

    // Cancel any overlapping or queued speech to prevent auditory clutter
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    // Soothing default parameters: slightly slower rate (0.9) and gentle pitch (1.0)
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1.0;

    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = SpeechService.getInstance();
