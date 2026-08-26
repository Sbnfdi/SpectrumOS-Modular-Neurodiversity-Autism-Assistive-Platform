'use client';

export type SoundscapeType = 
  | 'none' 
  | 'brown-noise' 
  | 'pink-noise' 
  | 'white-noise' 
  | 'rain' 
  | 'ocean-waves' 
  | 'binaural-theta' 
  | 'binaural-delta' 
  | 'harmonic-hum';

// Web Audio API Procedural Sound Engine & Meltdown Grounding Synthesizer
class SensoryAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSoundscape: SoundscapeType = 'none';

  // Noise Sources & Gains
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // Binaural Oscillators
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  // Rain & Water Generators
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  // Ocean Swell LFO
  private oceanSource: AudioBufferSourceNode | null = null;
  private oceanGain: GainNode | null = null;
  private oceanLFO: OscillatorNode | null = null;
  private oceanLFOGain: GainNode | null = null;

  // Harmonic Hum Oscillators
  private harmonicOscs: OscillatorNode[] = [];
  private harmonicGain: GainNode | null = null;

  // Mic Analysis
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public volumeCeiling: number = 0.7;
  private sleepTimerId: NodeJS.Timeout | null = null;

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

  public setFilterCutoff(cutoff: number) {
    if (this.noiseFilter && this.ctx) {
      this.noiseFilter.frequency.setTargetAtTime(Math.max(100, Math.min(8000, cutoff)), this.ctx.currentTime, 0.1);
    }
  }

  // Play a soft, reassuring chime (pentatonic chord: C5, E5, G5, B5)
  public playSoftChime(type: 'success' | 'tap' | 'bloom' | 'calm' | 'pda-win' = 'tap') {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const freqs = {
        tap: [440],
        success: [523.25, 659.25, 783.99],
        bloom: [329.63, 440, 554.37, 659.25],
        calm: [261.63, 329.63, 392.00],
        'pda-win': [392.0, 523.25, 659.25, 1046.5]
      }[type];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + (idx * 0.05);
        const duration = type === 'bloom' || type === 'pda-win' ? 1.2 : 0.6;

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

  // Soundscape Switcher
  public playSoundscape(type: SoundscapeType, filterCutoff: number = 450) {
    this.stopAllSoundscapes();
    this.currentSoundscape = type;

    switch (type) {
      case 'brown-noise':
        this.startBrownNoise(filterCutoff);
        break;
      case 'pink-noise':
        this.startPinkNoise(filterCutoff);
        break;
      case 'white-noise':
        this.startWhiteNoise(filterCutoff);
        break;
      case 'rain':
        this.startRainSound();
        break;
      case 'ocean-waves':
        this.startOceanWaves();
        break;
      case 'binaural-theta':
        this.startBinauralBeats(196, 6); // 6Hz Theta for deep focus & soothing
        break;
      case 'binaural-delta':
        this.startBinauralBeats(144, 2.5); // 2.5Hz Delta for sleep & somatic grounding
        break;
      case 'harmonic-hum':
        this.startHarmonicHum();
        break;
      case 'none':
      default:
        break;
    }
  }

  public stopAllSoundscapes() {
    this.stopBrownNoise();
    this.stopBinauralBeats();
    this.stopRain();
    this.stopOcean();
    this.stopHarmonicHum();
    this.currentSoundscape = 'none';
  }

  // Generate continuous Brown Noise (low-frequency sensory blocker)
  public startBrownNoise(filterCutoff: number = 400) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.28, this.ctx.currentTime + 1.0);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseSource.start();
    } catch (e) {
      console.warn('startBrownNoise error:', e);
    }
  }

  // Pink Noise
  public startPinkNoise(filterCutoff: number = 800) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.20, this.ctx.currentTime + 1.0);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseSource.start();
    } catch (e) {
      console.warn('startPinkNoise error:', e);
    }
  }

  // Velvet Smooth White Noise
  public startWhiteNoise(filterCutoff: number = 1200) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.12;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + 1.0);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseSource.start();
    } catch (e) {
      console.warn('startWhiteNoise error:', e);
    }
  }

  // Rain Sound Generator
  public startRainSound() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Rain sprinkle texture
        const drop = Math.random() > 0.998 ? (Math.random() * 0.5) : 0;
        data[i] = (last * 0.92 + white * 0.08) * 0.7 + drop;
        last = data[i];
      }

      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = buffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.rainGain.gain.exponentialRampToValueAtTime(0.22, this.ctx.currentTime + 1.2);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);

      this.rainSource.start();
    } catch (e) {
      console.warn('startRainSound error:', e);
    }
  }

  // Ocean Waves with Gentle LFO Swells
  public startOceanWaves() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + (0.02 * white)) / 1.02;
        last = data[i];
        data[i] *= 2.8;
      }

      this.oceanSource = this.ctx.createBufferSource();
      this.oceanSource.buffer = buffer;
      this.oceanSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, this.ctx.currentTime);

      this.oceanGain = this.ctx.createGain();
      this.oceanGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      // LFO for rhythmic swells (0.12 Hz ~ 8 second waves)
      this.oceanLFO = this.ctx.createOscillator();
      this.oceanLFO.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      this.oceanLFOGain = this.ctx.createGain();
      this.oceanLFOGain.gain.setValueAtTime(0.10, this.ctx.currentTime);

      this.oceanLFO.connect(this.oceanLFOGain);
      this.oceanLFOGain.connect(this.oceanGain.gain);

      this.oceanSource.connect(filter);
      filter.connect(this.oceanGain);
      this.oceanGain.connect(this.masterGain);

      this.oceanSource.start();
      this.oceanLFO.start();
    } catch (e) {
      console.warn('startOceanWaves error:', e);
    }
  }

  // Tibetan Singing Bowl / Harmonic Grounding Hum
  public startHarmonicHum() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const fundamental = 136.1; // Ohm frequency / Earth resonance
      const overtones = [fundamental, fundamental * 1.5, fundamental * 2.01, fundamental * 2.99];

      this.harmonicGain = this.ctx.createGain();
      this.harmonicGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.harmonicGain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + 1.5);
      this.harmonicGain.connect(this.masterGain);

      this.harmonicOscs = overtones.map((freq, idx) => {
        if (!this.ctx) throw new Error('No ctx');
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.2 / (idx + 1), this.ctx.currentTime);
        osc.connect(g);
        if (this.harmonicGain) g.connect(this.harmonicGain);
        osc.start();
        return osc;
      });
    } catch (e) {
      console.warn('startHarmonicHum error:', e);
    }
  }

  // Binaural Beat Synthesizer
  public startBinauralBeats(baseFreq: number = 196, beatDiff: number = 6) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

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

      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);

      this.binauralGain = this.ctx.createGain();
      this.binauralGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.binauralGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);

      merger.connect(this.binauralGain);
      this.binauralGain.connect(this.masterGain);

      this.binauralLeftOsc.start();
      this.binauralRightOsc.start();
    } catch (e) {
      console.warn('startBinauralBeats error:', e);
    }
  }

  // Teardown Helpers
  public stopBrownNoise() {
    if (this.noiseGain && this.ctx && this.noiseSource) {
      this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, this.ctx.currentTime);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.noiseSource?.stop();
          this.noiseSource?.disconnect();
          this.noiseSource = null;
        } catch {}
      }, 500);
    }
  }

  public stopBinauralBeats() {
    if (this.binauralGain && this.ctx) {
      this.binauralGain.gain.setValueAtTime(this.binauralGain.gain.value, this.ctx.currentTime);
      this.binauralGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.binauralLeftOsc?.stop();
          this.binauralRightOsc?.stop();
          this.binauralLeftOsc?.disconnect();
          this.binauralRightOsc?.disconnect();
          this.binauralLeftOsc = null;
          this.binauralRightOsc = null;
        } catch {}
      }, 500);
    }
  }

  public stopRain() {
    if (this.rainGain && this.ctx && this.rainSource) {
      this.rainGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.rainSource?.stop();
          this.rainSource?.disconnect();
          this.rainSource = null;
        } catch {}
      }, 500);
    }
  }

  public stopOcean() {
    if (this.oceanGain && this.ctx && this.oceanSource) {
      this.oceanGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.oceanSource?.stop();
          this.oceanLFO?.stop();
          this.oceanSource?.disconnect();
          this.oceanLFO?.disconnect();
          this.oceanSource = null;
          this.oceanLFO = null;
        } catch {}
      }, 500);
    }
  }

  public stopHarmonicHum() {
    if (this.harmonicGain && this.ctx) {
      this.harmonicGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.harmonicOscs.forEach(o => {
          try {
            o.stop();
            o.disconnect();
          } catch {}
        });
        this.harmonicOscs = [];
      }, 500);
    }
  }

  // Sleep Timer
  public setSleepTimer(minutes: number, onFinish?: () => void) {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }
    if (minutes > 0) {
      this.sleepTimerId = setTimeout(() => {
        this.stopAllSoundscapes();
        if (onFinish) onFinish();
      }, minutes * 60 * 1000);
    }
  }

  public clearSleepTimer() {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }
  }

  // Real-time Microphone Setup for EchoBloom Voice Visualizer & Decibel Meter
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

  public getMicMetrics(): { volume: number; decibels: number; dominantPitch: number; waveform: Uint8Array } {
    if (!this.analyser || !this.dataArray) {
      return { volume: 0, decibels: 0, dominantPitch: 0, waveform: new Uint8Array(0) };
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
    const approxDecibels = Math.round(30 + (normalizedVolume * 65)); // Estimates 30dB (silent) to 95dB (loud)
    const dominantPitch = maxIdx * (this.ctx ? this.ctx.sampleRate / this.analyser.fftSize : 1);

    return {
      volume: normalizedVolume,
      decibels: approxDecibels,
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
