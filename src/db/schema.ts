import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// users & profiles
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  role: text('role', { enum: ['caregiver', 'individual', 'therapist'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  displayName: text('display_name').notNull(),
  developmentalStage: text('developmental_stage', { enum: ['early', 'school', 'adult'] }).notNull(),
  sensorySensitivities: text('sensory_sensitivities'), // JSON array: ['bright_light', 'high_pitch']
  specialInterests: text('special_interests'), // JSON array: ['trains', 'space']
  preferredTheme: text('preferred_theme').default('calm-blue'),
});

// communication & speech tracking
export const speechAttempts = sqliteTable('speech_attempts', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  targetWord: text('target_word').notNull(),
  phonemeDetected: text('phoneme_detected'),
  accuracyScore: real('accuracy_score'), // 0.0 to 1.0 (lenient)
  recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(),
});

// routines and social stories
export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  title: text('title').notNull(),
  steps: text('steps').notNull(), // JSON array of step objects
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
});

export const socialStories = sqliteTable('social_stories', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  scenarioTitle: text('scenario_title').notNull(),
  storyData: text('story_data').notNull(), // JSON of steps and image URLs
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type SpeechAttempt = typeof speechAttempts.$inferSelect;
export type Routine = typeof routines.$inferSelect;
export type SocialStory = typeof socialStories.$inferSelect;
