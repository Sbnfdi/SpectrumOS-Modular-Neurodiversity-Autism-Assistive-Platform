import { create } from 'zustand';

export type DevelopmentalStage = 'early' | 'school' | 'adult';
export type UserRole = 'individual' | 'caregiver' | 'therapist' | 'educator';

export interface UserProfile {
  id: string;
  displayName: string;
  role: UserRole;
  developmentalStage: DevelopmentalStage;
  sensorySensitivities: string[];
  specialInterests: string[];
  preferredTheme: string;
  avatarIcon: string;
}

interface ProfileState {
  activeStage: DevelopmentalStage;
  activeProfile: UserProfile;
  availableProfiles: UserProfile[];
  apiKey: string;
  isOfflineMode: boolean;

  setActiveStage: (stage: DevelopmentalStage) => void;
  setActiveProfile: (profile: UserProfile) => void;
  addProfile: (profile: UserProfile) => void;
  updateSensorySensitivities: (sensitivities: string[]) => void;
  setApiKey: (key: string) => void;
  toggleOfflineMode: () => void;
}

const defaultProfiles: UserProfile[] = [
  {
    id: 'prof_early_leo',
    displayName: 'Leo',
    role: 'individual',
    developmentalStage: 'early',
    sensorySensitivities: ['Loud Sudden Sounds', 'Bright Flashing Lights', 'Scratchy Fabrics'],
    specialInterests: ['Steam Trains', 'Ocean Wildlife', 'Bubbles'],
    preferredTheme: 'calm-blue',
    avatarIcon: '🧸',
  },
  {
    id: 'prof_school_maya',
    displayName: 'Maya',
    role: 'individual',
    developmentalStage: 'school',
    sensorySensitivities: ['Crowded Hallways', 'Unscheduled Changes', 'High-Pitched Whistling'],
    specialInterests: ['Space Exploration', 'Minecraft Redstone', 'Dinosaurs'],
    preferredTheme: 'forest-mist',
    avatarIcon: '🎒',
  },
  {
    id: 'prof_adult_sam',
    displayName: 'Sam',
    role: 'individual',
    developmentalStage: 'adult',
    sensorySensitivities: ['Fluorescent Lighting Buzz', 'Ambiguous Directives', 'Overstimulation'],
    specialInterests: ['Modular Synthesizers', 'Cybersecurity', 'Botany'],
    preferredTheme: 'warm-sand',
    avatarIcon: '🧭',
  },
  {
    id: 'prof_caregiver_sarah',
    displayName: 'Sarah (Parent)',
    role: 'caregiver',
    developmentalStage: 'adult',
    sensorySensitivities: ['Sleep Deprivation', 'Administrative Fatigue'],
    specialInterests: ['Care Coordination', 'Autism Advocacy'],
    preferredTheme: 'lavender-dusk',
    avatarIcon: '🛡️',
  },
  {
    id: 'prof_therapist_dr_clara',
    displayName: 'Dr. Clara (SLP / OT)',
    role: 'therapist',
    developmentalStage: 'adult',
    sensorySensitivities: ['Documentation Overload'],
    specialInterests: ['AAC Gestalt Language Processing', 'Interoceptive Therapy'],
    preferredTheme: 'calm-blue',
    avatarIcon: '🩺',
  },
];

export const useProfileStore = create<ProfileState>((set, get) => ({
  activeStage: 'early',
  activeProfile: defaultProfiles[0],
  availableProfiles: defaultProfiles,
  apiKey: '',
  isOfflineMode: false,

  setActiveStage: (stage) => {
    const profile = get().availableProfiles.find((p) => p.developmentalStage === stage && p.role === 'individual') || get().activeProfile;
    set({ activeStage: stage, activeProfile: profile });
  },

  setActiveProfile: (profile) => {
    set({ activeProfile: profile, activeStage: profile.developmentalStage });
  },

  addProfile: (newProf) => {
    set((state) => ({
      availableProfiles: [...state.availableProfiles, newProf],
      activeProfile: newProf,
      activeStage: newProf.developmentalStage,
    }));
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
