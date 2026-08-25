import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local_spectrumos.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize tables if they do not exist
export async function initDatabase() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        role TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        display_name TEXT NOT NULL,
        developmental_stage TEXT NOT NULL,
        sensory_sensitivities TEXT,
        special_interests TEXT,
        preferred_theme TEXT DEFAULT 'calm-blue'
      );
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS speech_attempts (
        id TEXT PRIMARY KEY,
        profile_id TEXT REFERENCES profiles(id),
        target_word TEXT NOT NULL,
        phoneme_detected TEXT,
        accuracy_score REAL,
        recorded_at INTEGER NOT NULL
      );
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS routines (
        id TEXT PRIMARY KEY,
        profile_id TEXT REFERENCES profiles(id),
        title TEXT NOT NULL,
        steps TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0
      );
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS social_stories (
        id TEXT PRIMARY KEY,
        profile_id TEXT REFERENCES profiles(id),
        scenario_title TEXT NOT NULL,
        story_data TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  } catch (err) {
    console.warn('initDatabase notice:', err);
  }
}

export const db = drizzle(client, { schema });
