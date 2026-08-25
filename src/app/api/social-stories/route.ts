import { NextResponse } from 'next/server';
import { db } from '@/db';
import { socialStories } from '@/db/schema';

export async function GET() {
  try {
    const stories = await db.select().from(socialStories).all();
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    console.error('Error fetching social stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { scenarioTitle, storyData, profileId } = await req.json();

    if (!scenarioTitle || !storyData) {
      return NextResponse.json({ error: 'scenarioTitle and storyData are required' }, { status: 400 });
    }

    const newStory = {
      id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      profileId: profileId || 'prof_school_maya',
      scenarioTitle,
      storyData: typeof storyData === 'string' ? storyData : JSON.stringify(storyData),
      createdAt: new Date(),
    };

    await db.insert(socialStories).values(newStory).run();

    return NextResponse.json({ success: true, story: newStory });
  } catch (error) {
    console.error('Error saving social story:', error);
    return NextResponse.json({ error: 'Failed to save social story' }, { status: 500 });
  }
}
