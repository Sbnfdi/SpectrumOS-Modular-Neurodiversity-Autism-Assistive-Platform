import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { task, energyLevel, apiKey } = await req.json();

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert ADHD & Autism Executive Functioning Coach.
Break down overwhelming, multi-step tasks into atomic, frictionless micro-steps (2 to 5 minutes each).
Return strict JSON with this structure:
{
  "taskTitle": "Gentle title of the goal",
  "estimatedTotalMinutes": number,
  "sensoryPreparation": "A 30-second sensory prep step before starting (e.g. put on headphones, grab cold water)",
  "microSteps": [
    {
      "stepIndex": 1,
      "title": "Atomic action name",
      "instruction": "Concrete, single-action step (no ambiguity, zero decision fatigue)",
      "durationMinutes": 3,
      "dopamineReward": "Gentle sensory check-in or micro-reward"
    }
  ]
}`
              },
              {
                role: 'user',
                content: `Break down this task: "${task}" for someone with energy level: "${energyLevel || 'medium'}"`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ success: true, breakdown: parsed });
        }
      } catch (err) {
        console.warn('LLM task breakdown failed, using heuristic engine fallback', err);
      }
    }

    // Heuristic Task Deconstruction Engine
    const lower = task.toLowerCase();
    let microSteps = [];
    let sensoryPreparation = 'Put on your favorite comfort playlist, noise-cancelling headphones, and take a sip of water.';

    if (lower.includes('clean') || lower.includes('apartment') || lower.includes('room') || lower.includes('house')) {
      microSteps = [
        {
          stepIndex: 1,
          title: 'Grab Trash Bag Only',
          instruction: 'Pick up one empty plastic bag. Walk around the room and collect only visible trash or wrappers. Stop when done.',
          durationMinutes: 3,
          dopamineReward: 'Toss the bag in the bin. Celebrate 1 clean category complete!'
        },
        {
          stepIndex: 2,
          title: 'Dish Migration to Sink',
          instruction: 'Pick up any cups, bowls, or plates and move them to the kitchen sink counter. Do NOT wash them yet.',
          durationMinutes: 4,
          dopamineReward: 'Take a deep breath and wipe hands with a warm towel.'
        },
        {
          stepIndex: 3,
          title: 'Clothes Basket Toss',
          instruction: 'Gather any clothes on the floor or chairs into the laundry hamper. Don’t worry about sorting right now.',
          durationMinutes: 4,
          dopamineReward: 'Floor space cleared! Stretch your arms.'
        },
        {
          stepIndex: 4,
          title: 'Clear 1 Flat Surface',
          instruction: 'Choose just one desk or coffee table. Stack papers neatly and line up pens/items.',
          durationMinutes: 5,
          dopamineReward: 'Admire your clean focal point.'
        }
      ];
    } else if (lower.includes('email') || lower.includes('inbox') || lower.includes('message')) {
      sensoryPreparation = 'Dim your monitor brightness slightly and rest your feet flat on the floor.';
      microSteps = [
        {
          stepIndex: 1,
          title: 'Open 1 Single Message',
          instruction: 'Open only the most recent or easiest email. Do not scroll through the rest of the inbox.',
          durationMinutes: 2,
          dopamineReward: 'You bypassed task paralysis.'
        },
        {
          stepIndex: 2,
          title: 'Identify the Literal Need',
          instruction: 'Read just the first 2 sentences. What is the one factual answer needed? (Yes/No/Date)',
          durationMinutes: 3,
          dopamineReward: 'No overthinking needed.'
        },
        {
          stepIndex: 3,
          title: 'Draft a 1-Sentence Reply',
          instruction: 'Type: "Hi [Name], thanks for following up. [Your answer]. Best, [You]". Click send.',
          durationMinutes: 2,
          dopamineReward: 'Inbox monster tamed by one item!'
        }
      ];
    } else if (lower.includes('study') || lower.includes('homework') || lower.includes('exam') || lower.includes('work')) {
      microSteps = [
        {
          stepIndex: 1,
          title: 'Open Only the Document',
          instruction: 'Open the single textbook chapter or Google Doc. Close all other browser tabs.',
          durationMinutes: 2,
          dopamineReward: 'Environment prepared.'
        },
        {
          stepIndex: 2,
          title: 'Read 2 Headings Only',
          instruction: 'Scan just the subheadings and bold words in the current section.',
          durationMinutes: 4,
          dopamineReward: 'Your brain has absorbed the structure.'
        },
        {
          stepIndex: 3,
          title: 'Write 3 Bullet Points',
          instruction: 'Jot down 3 quick bullet points or notes on what you just read.',
          durationMinutes: 5,
          dopamineReward: 'Active progress logged!'
        }
      ];
    } else {
      microSteps = [
        {
          stepIndex: 1,
          title: 'Prepare the Workspace',
          instruction: `Clear just the immediate 12-inch space where you will work on "${task.slice(0, 25)}".`,
          durationMinutes: 2,
          dopamineReward: 'Physical friction removed.'
        },
        {
          stepIndex: 2,
          title: 'The 3-Minute Starter Push',
          instruction: 'Do only the very first obvious step for 3 minutes without worrying about the final outcome.',
          durationMinutes: 3,
          dopamineReward: 'You broke through task inertia.'
        },
        {
          stepIndex: 3,
          title: 'Check In & Next Bite',
          instruction: 'Pick one tiny follow-up action to complete before taking a rest.',
          durationMinutes: 4,
          dopamineReward: 'Great work! Take a soothing break.'
        }
      ];
    }

    const breakdown = {
      taskTitle: task,
      estimatedTotalMinutes: microSteps.reduce((acc, s) => acc + s.durationMinutes, 0),
      sensoryPreparation,
      microSteps
    };

    return NextResponse.json({ success: true, breakdown });
  } catch (error) {
    console.error('Error breaking down task:', error);
    return NextResponse.json({ error: 'Failed to break down task' }, { status: 500 });
  }
}
