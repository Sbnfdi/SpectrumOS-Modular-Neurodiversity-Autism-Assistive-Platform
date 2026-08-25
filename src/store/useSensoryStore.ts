import { create } from 'zustand';
import { sensoryAudio } from '@/lib/audioEngine';

export type SensoryTheme = 'calm-blue' | 'warm-sand' | 'forest-mist' | 'lavender-dusk' | 'high-contrast' | 'dark';
export type SpecialInterestTheme = 'trains' | 'space' | 'ocean' | 'nature';

interface SensoryState {
  theme: SensoryTheme;
  volumeCeiling: number;
  reducedMotion: boolean;
  highContrastText: boolean;
  emergencyCalmActive: boolean;
  activeSensoryAudio: 'none' | 'binaural' | 'brown-noise';
  specialInterest: SpecialInterestTheme;

  // Actions
  setTheme: (theme: SensoryTheme) => void;
  setVolumeCeiling: (volume: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrastText: (enabled: boolean) => void;
  setSpecialInterest: (interest: SpecialInterestTheme) => void;
  triggerEmergencyCalm: () => void;
  dismissEmergencyCalm: () => void;
  setSensoryAudio: (type: 'none' | 'binaural' | 'brown-noise') => void;
}

export const useSensoryStore = create<SensoryState>((set, get) => ({
  theme: 'calm-blue',
  volumeCeiling: 0.7,
  reducedMotion: false,
  highContrastText: false,
  emergencyCalmActive: false,
  activeSensoryAudio: 'none',
  specialInterest: 'trains',

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark' || theme === 'high-contrast') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  setVolumeCeiling: (volume) => {
    set({ volumeCeiling: volume });
    sensoryAudio.setVolume(volume);
  },

  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setHighContrastText: (enabled) => set({ highContrastText: enabled }),
  setSpecialInterest: (interest) => set({ specialInterest: interest }),

  triggerEmergencyCalm: () => {
    sensoryAudio.startBrownNoise(350);
    set({ emergencyCalmActive: true, activeSensoryAudio: 'brown-noise' });
  },

  dismissEmergencyCalm: () => {
    sensoryAudio.stopBrownNoise();
    sensoryAudio.stopBinauralBeats();
    set({ emergencyCalmActive: false, activeSensoryAudio: 'none' });
  },

  setSensoryAudio: (type) => {
    const current = get().activeSensoryAudio;
    if (current === 'brown-noise') sensoryAudio.stopBrownNoise();
    if (current === 'binaural') sensoryAudio.stopBinauralBeats();

    if (type === 'brown-noise') {
      sensoryAudio.startBrownNoise();
    } else if (type === 'binaural') {
      sensoryAudio.startBinauralBeats();
    }
    set({ activeSensoryAudio: type });
  },
}));
