import { NextResponse } from 'next/server';
import { db } from '@/db';
import { speechAttempts } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const { profileId, targetWord, phonemeDetected, accuracyScore } = await req.json();

    if (!targetWord) {
      return NextResponse.json({ error: 'Target word is required' }, { status: 400 });
    }

    const attempt = {
      id: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      profileId: profileId || 'prof_early_leo',
      targetWord,
      phonemeDetected: phonemeDetected || targetWord,
      accuracyScore: typeof accuracyScore === 'number' ? accuracyScore : 0.85,
      recordedAt: new Date(),
    };

    await db.insert(speechAttempts).values(attempt).run();

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error('Error logging speech attempt:', error);
    return NextResponse.json({ error: 'Failed to record speech attempt' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const attempts = await db.select().from(speechAttempts).all();
    return NextResponse.json({ success: true, attempts });
  } catch (error) {
    console.error('Error fetching speech attempts:', error);
    return NextResponse.json({ error: 'Failed to fetch speech attempts' }, { status: 500 });
  }
}
