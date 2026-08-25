'use client';

// Web Audio API Procedural Sound Engine & Meltdown Grounding Synth
class SensoryAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private isBinauralPlaying: boolean = false;
  private isNoisePlaying: boolean = false;

  // Mic Analysis
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public volumeCeiling: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volumeCeiling, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    this.volumeCeiling = Math.min(1.0, Math.max(0.0, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volumeCeiling, this.ctx.currentTime, 0.05);
    }
  }

  // Play a soft, reassuring chime (pentatonic chord: C5, E5, G5, B5)
  public playSoftChime(type: 'success' | 'tap' | 'bloom' | 'calm' = 'tap') {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const freqs = {
        tap: [440],
        success: [523.25, 659.25, 783.99],
        bloom: [329.63, 440, 554.37, 659.25],
        calm: [261.63, 329.63, 392.00]
      }[type];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + (idx * 0.05);
        const duration = type === 'bloom' ? 1.2 : 0.6;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12 / freqs.length, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });
    } catch (e) {
      console.warn('Audio playSoftChime error:', e);
    }
  }

  // Generate continuous Brown Noise (low-frequency sensory blocker, superior for autism calming)
  public startBrownNoise(filterCutoff: number = 400) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isNoisePlaying) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      // Low pass filter to make it velvet smooth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 1.0);

      this.noiseSource.connect(filter);
      filter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseSource.start();
      this.isNoisePlaying = true;
    } catch (e) {
      console.warn('startBrownNoise error:', e);
    }
  }

  public stopBrownNoise() {
    if (this.noiseGain && this.ctx && this.noiseSource && this.isNoisePlaying) {
      this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        try {
          this.noiseSource?.stop();
          this.noiseSource?.disconnect();
          this.noiseSource = null;
        } catch {
          // ignore
        }
        this.isNoisePlaying = false;
      }, 800);
    }
  }

  // Binaural Beat (Theta 6Hz difference: Left 196Hz, Right 202Hz)
  public startBinauralBeats(baseFreq: number = 196, beatDiff: number = 6) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isBinauralPlaying) return;

      const merger = this.ctx.createChannelMerger(2);

      this.binauralLeftOsc = this.ctx.createOscillator();
      this.binauralLeftOsc.type = 'sine';
      this.binauralLeftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      this.binauralRightOsc = this.ctx.createOscillator();
      this.binauralRightOsc.type = 'sine';
      this.binauralRightOsc.frequency.setValueAtTime(baseFreq + beatDiff, this.ctx.currentTime);

      const leftGain = this.ctx.createGain();
      leftGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      const rightGain = this.ctx.createGain();
      rightGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.binauralLeftOsc.connect(leftGain);
      this.binauralRightOsc.connect(rightGain);

      leftGain.connect(merger, 0, 0); // Left channel
      rightGain.connect(merger, 0, 1); // Right channel

      this.binauralGain = this.ctx.createGain();
      this.binauralGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.binauralGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);

      merger.connect(this.binauralGain);
      this.binauralGain.connect(this.masterGain);

      this.binauralLeftOsc.start();
      this.binauralRightOsc.start();
      this.isBinauralPlaying = true;
    } catch (e) {
      console.warn('startBinauralBeats error:', e);
    }
  }

  public stopBinauralBeats() {
    if (this.binauralGain && this.ctx && this.isBinauralPlaying) {
      this.binauralGain.gain.setValueAtTime(this.binauralGain.gain.value, this.ctx.currentTime);
      this.binauralGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        try {
          this.binauralLeftOsc?.stop();
          this.binauralRightOsc?.stop();
          this.binauralLeftOsc?.disconnect();
          this.binauralRightOsc?.disconnect();
          this.binauralLeftOsc = null;
          this.binauralRightOsc = null;
        } catch {
          // ignore
        }
        this.isBinauralPlaying = false;
      }, 800);
    }
  }

  // Real-time Microphone Setup for EchoBloom Voice Visualizer
  public async startMicAnalysis(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Microphone not supported on this browser');
        return false;
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.micSource.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      return true;
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      return false;
    }
  }

  public getMicMetrics(): { volume: number; dominantPitch: number; waveform: Uint8Array } {
    if (!this.analyser || !this.dataArray) {
      return { volume: 0, dominantPitch: 0, waveform: new Uint8Array(0) };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.analyser.getByteFrequencyData(this.dataArray as any);

    let sum = 0;
    let maxVal = 0;
    let maxIdx = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const val = this.dataArray[i];
      sum += val;
      if (val > maxVal) {
        maxVal = val;
        maxIdx = i;
      }
    }

    const avg = sum / this.dataArray.length;
    const normalizedVolume = Math.min(1.0, avg / 128);
    const dominantPitch = maxIdx * (this.ctx ? this.ctx.sampleRate / this.analyser.fftSize : 1);

    return {
      volume: normalizedVolume,
      dominantPitch,
      waveform: this.dataArray
    };
  }

  public stopMicAnalysis() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}

export const sensoryAudio = new SensoryAudioEngine();
