import { NextResponse } from 'next/server';
import { db } from '@/db';
import { routines } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allRoutines = await db.select().from(routines).all();
    return NextResponse.json({ success: true, routines: allRoutines });
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json({ error: 'Failed to fetch routines' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, profileId, title, steps, isCompleted } = await req.json();

    if (!title || !steps) {
      return NextResponse.json({ error: 'Title and steps are required' }, { status: 400 });
    }

    const routineId = id || `rout_${Date.now()}`;
    const stepsJson = typeof steps === 'string' ? steps : JSON.stringify(steps);

    // Upsert routine
    const existing = await db.select().from(routines).where(eq(routines.id, routineId)).all();

    if (existing.length > 0) {
      await db
        .update(routines)
        .set({
          title,
          steps: stepsJson,
          isCompleted: !!isCompleted,
        })
        .where(eq(routines.id, routineId))
        .run();
    } else {
      await db
        .insert(routines)
        .values({
          id: routineId,
          profileId: profileId || 'prof_school_maya',
          title,
          steps: stepsJson,
          isCompleted: !!isCompleted,
        })
        .run();
    }

    return NextResponse.json({ success: true, routineId });
  } catch (error) {
    console.error('Error saving routine:', error);
    return NextResponse.json({ error: 'Failed to save routine' }, { status: 500 });
  }
}
