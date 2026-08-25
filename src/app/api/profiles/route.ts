import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, routines, socialStories, speechAttempts } from '@/db/schema';
import { seedInitialData } from '@/db/seed';

export async function GET() {
  try {
    await seedInitialData();

    const allProfiles = await db.select().from(profiles).all();
    const allRoutines = await db.select().from(routines).all();
    const allStories = await db.select().from(socialStories).all();
    const allSpeech = await db.select().from(speechAttempts).all();

    return NextResponse.json({
      success: true,
      profiles: allProfiles,
      routines: allRoutines,
      socialStories: allStories,
      speechAttempts: allSpeech,
    });
  } catch (error) {
    console.error('Error querying SQLite database:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
