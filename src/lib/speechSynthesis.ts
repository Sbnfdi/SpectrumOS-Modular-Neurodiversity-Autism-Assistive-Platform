'use client';

// Predictable, soothing Text-to-Speech (TTS) engine using Web Speech API
export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  private defaultRate: number = 0.9;
  private defaultPitch: number = 1.0;

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

  public loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    // Prioritize soothing, natural sounding voices
    this.preferredVoice =
      this.voices.find((v) => v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel')) ||
      this.voices.find((v) => v.lang.startsWith('en')) ||
      this.voices[0] ||
      null;
    return this.voices;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  public setPreferredVoiceByName(name: string) {
    const match = this.voices.find((v) => v.name === name);
    if (match) {
      this.preferredVoice = match;
    }
  }

  public setSpeechSettings(rate: number, pitch: number) {
    this.defaultRate = Math.max(0.5, Math.min(2.0, rate));
    this.defaultPitch = Math.max(0.5, Math.min(2.0, pitch));
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
    utterance.rate = options.rate ?? this.defaultRate;
    utterance.pitch = options.pitch ?? this.defaultPitch;

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
