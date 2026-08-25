import { db, initDatabase } from './index';
import { users, profiles, routines, socialStories, speechAttempts } from './schema';

export async function seedInitialData() {
  try {
    await initDatabase();

    const existingUsers = await db.select().from(users).all();
    if (existingUsers.length > 0) {
      return;
    }

    const now = new Date();

    // 1. Create Default Caregiver User
    const caregiverUser = {
      id: 'usr_caregiver_1',
      email: 'caregiver@spectrumos.internal',
      role: 'caregiver' as const,
      createdAt: now,
    };
    await db.insert(users).values(caregiverUser).run();

    // 2. Profiles for 3 developmental stages
    const profileEarly = {
      id: 'prof_early_leo',
      userId: caregiverUser.id,
      displayName: 'Leo (Age 5)',
      developmentalStage: 'early' as const,
      sensorySensitivities: JSON.stringify(['loud_sounds', 'bright_flashes', 'scratchy_tags']),
      specialInterests: JSON.stringify(['Steam Trains', 'Ocean Creatures', 'Bubbles']),
      preferredTheme: 'calm-blue',
    };

    const profileSchool = {
      id: 'prof_school_maya',
      userId: caregiverUser.id,
      displayName: 'Maya (Age 10)',
      developmentalStage: 'school' as const,
      sensorySensitivities: JSON.stringify(['crowded_spaces', 'unpredictable_transitions', 'whistling']),
      specialInterests: JSON.stringify(['Space Exploration', 'Minecraft Mechanics', 'Dinosaurs']),
      preferredTheme: 'forest-mist',
    };

    const profileAdult = {
      id: 'prof_adult_sam',
      userId: caregiverUser.id,
      displayName: 'Sam (Age 22)',
      developmentalStage: 'adult' as const,
      sensorySensitivities: JSON.stringify(['fluorescent_hum', 'open_plan_offices', 'social_subtext_ambiguity']),
      specialInterests: JSON.stringify(['Retro Synthesizers', 'Cybersecurity', 'Gardening']),
      preferredTheme: 'warm-sand',
    };

    await db.insert(profiles).values([profileEarly, profileSchool, profileAdult]).run();

    // 3. Sample Routines for School Age
    await db.insert(routines).values([
      {
        id: 'rout_morning_1',
        profileId: profileSchool.id,
        title: 'Morning Launch Sequence 🚀',
        steps: JSON.stringify([
          { id: '1', title: 'Put on soft socks and sensory clothes', durationMinutes: 5, completed: false, icon: 'Shirt' },
          { id: '2', title: 'Crunchy cereal breakfast & sip water', durationMinutes: 10, completed: false, icon: 'Utensils' },
          { id: '3', title: 'Brush teeth with gentle bubblegum paste (2 min timer)', durationMinutes: 2, completed: false, icon: 'Sparkles' },
          { id: '4', title: 'Pack backpack with headphones & comfort toy', durationMinutes: 5, completed: false, icon: 'Backpack' },
          { id: '5', title: 'Zip up jacket & step onto the school bus', durationMinutes: 3, completed: false, icon: 'Bus' },
        ]),
        isCompleted: false,
      },
      {
        id: 'rout_bedtime_1',
        profileId: profileSchool.id,
        title: 'Calm Night Wind-Down 🌙',
        steps: JSON.stringify([
          { id: '1', title: 'Dim bedroom lights to warm mode', durationMinutes: 2, completed: false, icon: 'Moon' },
          { id: '2', title: 'Warm pajama sensory swap', durationMinutes: 5, completed: false, icon: 'Shirt' },
          { id: '3', title: 'Listen to 5 minutes of brown noise ocean sounds', durationMinutes: 5, completed: false, icon: 'Headphones' },
          { id: '4', title: 'Weighted blanket cozy tuck-in', durationMinutes: 3, completed: false, icon: 'Bed' },
        ]),
        isCompleted: false,
      }
    ]).run();

    // 4. Sample Social Stories
    await db.insert(socialStories).values([
      {
        id: 'story_dentist_1',
        profileId: profileSchool.id,
        scenarioTitle: 'Visiting the Dentist for a Tooth Cleaning',
        storyData: JSON.stringify([
          {
            stepNumber: 1,
            type: 'Descriptive',
            title: 'Arriving at the Office',
            text: 'Sometimes we visit Dr. Green to make sure our teeth stay strong and healthy. The waiting room has soft chairs and friendly receptionists.',
            visualType: 'dentist_chair',
            copingTip: 'I can wear my noise-cancelling headphones while waiting.'
          },
          {
            stepNumber: 2,
            type: 'Perspective',
            title: 'The Cleaning Chair',
            text: 'The dental chair can recline like a spaceship bed. The dentist wears a clean blue mask and shines a special bright light to see teeth clearly.',
            visualType: 'spaceship_chair',
            copingTip: 'I can close my eyes or wear sunglasses if the light feels bright.'
          },
          {
            stepNumber: 3,
            type: 'Directive / Affirmative',
            title: 'Sounds and Gentle Vibrations',
            text: 'The special electric toothbrush makes a humming sound like a gentle bee. It tickles as it cleans away plaque.',
            visualType: 'toothbrush_bee',
            copingTip: 'I can raise my left hand if I want the dentist to take a 10-second pause.'
          },
          {
            stepNumber: 4,
            type: 'Cooperative / Resolution',
            title: 'Done and Proud',
            text: 'When the cleaning is finished, my teeth feel smooth and clean. I can pick a cool sticker and head home to celebrate my brave job.',
            visualType: 'reward_sticker',
            copingTip: 'I did a great job taking care of myself today!'
          }
        ]),
        createdAt: now,
      }
    ]).run();

    // 5. Sample Speech Attempts for Early Childhood
    await db.insert(speechAttempts).values([
      {
        id: 'sp_1',
        profileId: profileEarly.id,
        targetWord: 'Water',
        phonemeDetected: 'Wuh-t',
        accuracyScore: 0.85,
        recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: 'sp_2',
        profileId: profileEarly.id,
        targetWord: 'Break',
        phonemeDetected: 'B-ray-k',
        accuracyScore: 0.92,
        recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: 'sp_3',
        profileId: profileEarly.id,
        targetWord: 'Help',
        phonemeDetected: 'Heh-p',
        accuracyScore: 0.78,
        recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      }
    ]).run();

  } catch (error) {
    console.error('Failed to seed initial data:', error);
  }
}
