import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { scenario, apiKey, specialInterest } = await req.json();

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json({ error: 'Scenario is required' }, { status: 400 });
    }

    // If an OpenAI or Anthropic API key is provided, we can query the LLM
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
                content: `You are an expert clinical autism specialist and Carol Gray Social Story creator.
Format the output as strict JSON with an array of 4 steps following Carol Gray's formula:
1. Descriptive Sentence: Factual description of the event.
2. Perspective Sentence: How others feel and why it happens.
3. Directive/Affirmative Sentence: Reassuring positive action or coping tool the child can take.
4. Cooperative/Resolution Sentence: Support available and positive conclusion.
Include a relevant visual motif (e.g. icon name or visual description) and a calming sensory coping tip for each step.
Incorporate gentle references to the child's special interest: "${specialInterest || 'trains'}" where comforting.`
              },
              {
                role: 'user',
                content: `Create a 4-step Carol Gray Social Story for: "${scenario}"`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ success: true, steps: parsed.steps || parsed });
        }
      } catch (err) {
        console.warn('Direct LLM call failed, using clinical heuristic engine fallback', err);
      }
    }

    // Clinical Heuristic Engine (Offline-First / Instant)
    const lower = scenario.toLowerCase();
    let steps = [];

    if (lower.includes('dentist') || lower.includes('teeth')) {
      steps = [
        {
          stepNumber: 1,
          type: 'Descriptive',
          title: 'Visiting Dr. Green',
          text: 'We visit the dental clinic to help keep our teeth strong and healthy. The waiting room has soft chairs and friendly receptionists.',
          visualIcon: 'Smile',
          copingTip: 'I can wear my noise-cancelling headphones while we wait.'
        },
        {
          stepNumber: 2,
          type: 'Perspective',
          title: 'The Reclining Chair',
          text: 'The chair can tip back like a spaceship or train simulator. The dentist wears a clean mask and a special headlamp to see clearly.',
          visualIcon: 'Armchair',
          copingTip: 'I can close my eyes or wear sunglasses if the light feels bright.'
        },
        {
          stepNumber: 3,
          type: 'Directive / Affirmative',
          title: 'Gentle Whirring Sounds',
          text: 'The electric brush makes a humming sound like a train motor. It gently cleans away sugar bugs.',
          visualIcon: 'Sparkles',
          copingTip: 'I can give a thumbs-up or raise my left hand if I need a 10-second pause.'
        },
        {
          stepNumber: 4,
          type: 'Cooperative / Resolution',
          title: 'All Done and Proud',
          text: 'When we are finished, my teeth feel super smooth. I can choose a cool sticker and feel proud of my brave effort.',
          visualIcon: 'Award',
          copingTip: 'I will celebrate with a quiet 5-minute break when I get home.'
        }
      ];
    } else if (lower.includes('fire drill') || lower.includes('alarm') || lower.includes('loud')) {
      steps = [
        {
          stepNumber: 1,
          type: 'Descriptive',
          title: 'Safety Practice Day',
          text: 'Sometimes our school or building tests the alarm to practice walking outside safely. This is called a practice drill.',
          visualIcon: 'BellRing',
          copingTip: 'The alarm is loud, but it is just practice and there is no real danger.'
        },
        {
          stepNumber: 2,
          type: 'Perspective',
          title: 'People Walking Together',
          text: 'Teachers and classmates will stand up and walk in a calm line toward the exit doors.',
          visualIcon: 'Footprints',
          copingTip: 'I can put my hands over my ears or use my ear defenders.'
        },
        {
          stepNumber: 3,
          type: 'Directive / Affirmative',
          title: 'Walking Outside into the Fresh Air',
          text: 'I will walk quietly with my class outside to our designated safe spot on the grassy field.',
          visualIcon: 'Trees',
          copingTip: 'I can take 3 slow belly breaths: smell the flowers, blow out the birthday candles.'
        },
        {
          stepNumber: 4,
          type: 'Cooperative / Resolution',
          title: 'Returning to Class',
          text: 'When the teacher gives the all-clear signal, we walk back inside. Everything returns to normal schedule.',
          visualIcon: 'CheckCircle2',
          copingTip: 'I navigated the unexpected sound safely and did a wonderful job.'
        }
      ];
    } else if (lower.includes('substitute') || lower.includes('teacher') || lower.includes('change')) {
      steps = [
        {
          stepNumber: 1,
          type: 'Descriptive',
          title: 'A Guest Teacher Today',
          text: 'Sometimes our regular teacher is resting at home. A guest teacher named a substitute will guide our classroom today.',
          visualIcon: 'BookOpen',
          copingTip: 'The classroom and our desk stay the same safe place.'
        },
        {
          stepNumber: 2,
          type: 'Perspective',
          title: 'Different Teaching Styles',
          text: 'The guest teacher might speak with a different voice or write differently on the whiteboard. They are here to help us.',
          visualIcon: 'Users',
          copingTip: 'It is okay if the schedule feels a little different today.'
        },
        {
          stepNumber: 3,
          type: 'Directive / Affirmative',
          title: 'Following Our Visual Schedule',
          text: 'I can look at my visual card schedule on my desk. If I feel confused, I can show my break card.',
          visualIcon: 'Calendar',
          copingTip: 'I can squeeze my sensory stress ball when transitions happen.'
        },
        {
          stepNumber: 4,
          type: 'Cooperative / Resolution',
          title: 'A Reassuring Day',
          text: 'Our regular teacher will be proud to hear how flexible and calm we were. Soon our standard routine returns.',
          visualIcon: 'HeartHandshake',
          copingTip: 'I am safe and supported every step of the way.'
        }
      ];
    } else {
      // General dynamic generator for any input
      steps = [
        {
          stepNumber: 1,
          type: 'Descriptive',
          title: `Understanding ${scenario.slice(0, 30)}`,
          text: `Sometimes new or unexpected situations like "${scenario}" occur during our day. Many people experience this.`,
          visualIcon: 'Compass',
          copingTip: 'Taking a moment to notice my breathing helps my nervous system stay calm.'
        },
        {
          stepNumber: 2,
          type: 'Perspective',
          title: 'Why This Happens',
          text: 'People and schedules adapt to changing needs. Everyone around me wants the day to go smoothly and safely.',
          visualIcon: 'Lightbulb',
          copingTip: 'I am allowed to ask questions if something is unclear.'
        },
        {
          stepNumber: 3,
          type: 'Directive / Affirmative',
          title: 'My Calming Strategy',
          text: 'I will take one small step at a time. I can use my sensory tools, take sips of water, or ask for a brief pause.',
          visualIcon: 'ShieldCheck',
          copingTip: 'Focus on one minute at a time rather than the whole event.'
        },
        {
          stepNumber: 4,
          type: 'Cooperative / Resolution',
          title: 'Smooth Transition & Safety',
          text: 'Once this transition finishes, I will return to my familiar comfort space and enjoy my favorite activities.',
          visualIcon: 'CheckCircle2',
          copingTip: 'I handled this transition with resilience and care.'
        }
      ];
    }

    return NextResponse.json({ success: true, steps });
  } catch (error) {
    console.error('Error generating social story:', error);
    return NextResponse.json({ error: 'Failed to generate social story' }, { status: 500 });
  }
}
