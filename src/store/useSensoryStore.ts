import { create } from 'zustand';
import { sensoryAudio, SoundscapeType } from '@/lib/audioEngine';

export type SensoryTheme = 'calm-blue' | 'warm-sand' | 'forest-mist' | 'lavender-dusk' | 'high-contrast' | 'dark';
export type SpecialInterestTheme = 'trains' | 'space' | 'ocean' | 'nature' | 'dinosaurs' | 'coding';

interface SensoryState {
  theme: SensoryTheme;
  volumeCeiling: number;
  filterCutoff: number;
  reducedMotion: boolean;
  highContrastText: boolean;
  emergencyCalmActive: boolean;
  activeSensoryAudio: SoundscapeType;
  sleepTimerMinutes: number;
  specialInterest: SpecialInterestTheme;

  // Actions
  setTheme: (theme: SensoryTheme) => void;
  setVolumeCeiling: (volume: number) => void;
  setFilterCutoff: (cutoff: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrastText: (enabled: boolean) => void;
  setSpecialInterest: (interest: SpecialInterestTheme) => void;
  triggerEmergencyCalm: () => void;
  dismissEmergencyCalm: () => void;
  setSensoryAudio: (type: SoundscapeType) => void;
  setSleepTimer: (minutes: number) => void;
}

export const useSensoryStore = create<SensoryState>((set, get) => ({
  theme: 'calm-blue',
  volumeCeiling: 0.7,
  filterCutoff: 450,
  reducedMotion: false,
  highContrastText: false,
  emergencyCalmActive: false,
  activeSensoryAudio: 'none',
  sleepTimerMinutes: 0,
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

  setFilterCutoff: (cutoff) => {
    set({ filterCutoff: cutoff });
    sensoryAudio.setFilterCutoff(cutoff);
  },

  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setHighContrastText: (enabled) => set({ highContrastText: enabled }),
  setSpecialInterest: (interest) => set({ specialInterest: interest }),

  triggerEmergencyCalm: () => {
    sensoryAudio.playSoundscape('brown-noise', 350);
    set({ emergencyCalmActive: true, activeSensoryAudio: 'brown-noise' });
  },

  dismissEmergencyCalm: () => {
    sensoryAudio.stopAllSoundscapes();
    set({ emergencyCalmActive: false, activeSensoryAudio: 'none' });
  },

  setSensoryAudio: (type) => {
    const cutoff = get().filterCutoff;
    sensoryAudio.playSoundscape(type, cutoff);
    set({ activeSensoryAudio: type });
  },

  setSleepTimer: (minutes) => {
    set({ sleepTimerMinutes: minutes });
    sensoryAudio.setSleepTimer(minutes, () => {
      set({ activeSensoryAudio: 'none', sleepTimerMinutes: 0 });
    });
  },
}));
