import { create } from 'zustand';

export type DevelopmentalStage = 'early' | 'school' | 'adult';

export interface UserProfile {
  id: string;
  displayName: string;
  developmentalStage: DevelopmentalStage;
  sensorySensitivities: string[];
  specialInterests: string[];
  preferredTheme: string;
}

interface ProfileState {
  activeStage: DevelopmentalStage;
  activeProfile: UserProfile;
  availableProfiles: UserProfile[];
  apiKey: string;
  isOfflineMode: boolean;

  setActiveStage: (stage: DevelopmentalStage) => void;
  setActiveProfile: (profile: UserProfile) => void;
  updateSensorySensitivities: (sensitivities: string[]) => void;
  setApiKey: (key: string) => void;
  toggleOfflineMode: () => void;
}

const defaultProfiles: UserProfile[] = [
  {
    id: 'prof_early_leo',
    displayName: 'Leo',
    developmentalStage: 'early',
    sensorySensitivities: ['Loud Sudden Sounds', 'Bright Flashing Lights', 'Scratchy Fabrics'],
    specialInterests: ['Steam Trains', 'Ocean Wildlife', 'Bubbles'],
    preferredTheme: 'calm-blue',
  },
  {
    id: 'prof_school_maya',
    displayName: 'Maya',
    developmentalStage: 'school',
    sensorySensitivities: ['Crowded Hallways', 'Unscheduled Changes', 'High-Pitched Whistling'],
    specialInterests: ['Space Exploration', 'Minecraft Redstone', 'Dinosaurs'],
    preferredTheme: 'forest-mist',
  },
  {
    id: 'prof_adult_sam',
    displayName: 'Sam',
    developmentalStage: 'adult',
    sensorySensitivities: ['Fluorescent Lighting Buzz', 'Ambiguous Directives', 'Overstimulation'],
    specialInterests: ['Modular Synthesizers', 'Cybersecurity', 'Botany'],
    preferredTheme: 'warm-sand',
  },
];

export const useProfileStore = create<ProfileState>((set, get) => ({
  activeStage: 'early',
  activeProfile: defaultProfiles[0],
  availableProfiles: defaultProfiles,
  apiKey: '',
  isOfflineMode: false,

  setActiveStage: (stage) => {
    const profile = get().availableProfiles.find((p) => p.developmentalStage === stage) || get().activeProfile;
    set({ activeStage: stage, activeProfile: profile });
  },

  setActiveProfile: (profile) => {
    set({ activeProfile: profile, activeStage: profile.developmentalStage });
  },

  updateSensorySensitivities: (sensitivities) => {
    const active = get().activeProfile;
    const updated = { ...active, sensorySensitivities: sensitivities };
    set({
      activeProfile: updated,
      availableProfiles: get().availableProfiles.map((p) => (p.id === active.id ? updated : p)),
    });
  },

  setApiKey: (key) => set({ apiKey: key }),
  toggleOfflineMode: () => set((state) => ({ isOfflineMode: !state.isOfflineMode })),
}));
