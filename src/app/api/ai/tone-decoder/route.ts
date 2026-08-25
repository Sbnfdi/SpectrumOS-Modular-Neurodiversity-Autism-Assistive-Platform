import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, apiKey } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text message is required' }, { status: 400 });
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
                content: `You are an expert Neurodivergent Communication & Subtext Decoding Specialist.
Analyze ambiguous, passive-aggressive, or neurotypical messages for autistic adults who value explicit, direct communication.
Return strict JSON with this exact schema:
{
  "literalMeaning": "Clear, factual, non-emotional breakdown of what is being requested or stated.",
  "subtext": "The unspoken subtext, hidden expectation, or passive social cue.",
  "toneMetrics": {
    "urgency": "Low" | "Medium" | "High" | "Critical",
    "urgencyScore": number (0-100),
    "politeness": "Blunt" | "Neutral" | "Polite" | "Passive-Aggressive",
    "politenessScore": number (0-100),
    "sarcasmLikelihood": "None" | "Possible" | "Likely" | "Definite",
    "sarcasmScore": number (0-100)
  },
  "emotionalState": "Description of sender's likely emotional state (e.g., Busy, Stressed, Cheerful, Impatient)",
  "suggestedResponses": [
    {
      "style": "Formal & Direct",
      "text": "Professional response maintaining clear communication without over-explaining.",
      "energyLevel": "Medium"
    },
    {
      "style": "Casual & Warm",
      "text": "Friendly, approachable reply.",
      "energyLevel": "Low"
    },
    {
      "style": "Boundary-Setting / Low-Energy",
      "text": "Protecting time, spoons, and mental bandwidth politely.",
      "energyLevel": "Minimal"
    }
  ]
}`
              },
              {
                role: 'user',
                content: `Decode this message: "${text}"`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ success: true, analysis: parsed });
        }
      } catch (err) {
        console.warn('LLM decode failed, using intelligent neurodiversity decoder fallback', err);
      }
    }

    // Heuristic Subtext Decoding Engine (Offline-First / Instant)
    const lower = text.toLowerCase();

    let literalMeaning = `The sender is asking or notifying: "${text.trim()}".`;
    let subtext = "The sender is making a straightforward request or notification.";
    let urgencyScore = 35;
    let urgency: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
    let politenessScore = 70;
    let politeness: 'Blunt' | 'Neutral' | 'Polite' | 'Passive-Aggressive' = 'Neutral';
    let sarcasmScore = 10;
    let sarcasmLikelihood: 'None' | 'Possible' | 'Likely' | 'Definite' = 'None';
    let emotionalState = 'Neutral / Work-Focused';

    if (lower.includes('per my last email') || lower.includes('as per my previous')) {
      literalMeaning = 'The sender is referring to information they believe was previously communicated in an earlier message.';
      subtext = 'Passive-aggressive cue: The sender is feeling frustrated or impatient that they had to repeat themselves. They want you to check previous messages before asking.';
      urgencyScore = 65;
      urgency = 'Medium';
      politenessScore = 30;
      politeness = 'Passive-Aggressive';
      sarcasmScore = 40;
      sarcasmLikelihood = 'Possible';
      emotionalState = 'Frustrated / Impatient';
    } else if (lower.includes('no worries if not') || lower.includes('no pressure')) {
      literalMeaning = 'The sender has made a request and explicitly said you can say no.';
      subtext = 'Politeness softening: They genuinely hope you can help, but want to appear considerate. It is completely safe to decline without social penalty.';
      urgencyScore = 20;
      urgency = 'Low';
      politenessScore = 90;
      politeness = 'Polite';
      sarcasmScore = 0;
      sarcasmLikelihood = 'None';
      emotionalState = 'Considerate / Tentative';
    } else if (lower.includes('we need to talk') || lower.includes('do you have a minute?')) {
      literalMeaning = 'The sender wants to initiate a conversation with you.';
      subtext = 'High ambiguity cue: While this phrasing triggers anxiety, people often use it casually for mundane logistics. Ask for the topic immediately to avoid rumination.';
      urgencyScore = 80;
      urgency = 'High';
      politenessScore = 50;
      politeness = 'Blunt';
      sarcasmScore = 5;
      sarcasmLikelihood = 'None';
      emotionalState = 'Focused / Urgent';
    } else if (lower.includes('fine') || lower.includes('whatever you think')) {
      literalMeaning = 'The sender has agreed to the plan or decision.';
      subtext = 'Potential resignation: The word "fine" or "whatever" often indicates mild fatigue or unstated disagreement, rather than enthusiastic approval.';
      urgencyScore = 40;
      urgency = 'Low';
      politenessScore = 35;
      politeness = 'Passive-Aggressive';
      sarcasmScore = 60;
      sarcasmLikelihood = 'Likely';
      emotionalState = 'Fatigued / Reluctant';
    } else if (lower.includes('asap') || lower.includes('urgent') || lower.includes('immediately')) {
      literalMeaning = 'The sender wants this prioritized right away.';
      subtext = 'Time-pressure cue: They are experiencing deadline stress and need immediate acknowledgment or completion timeline.';
      urgencyScore = 95;
      urgency = 'Critical';
      politenessScore = 45;
      politeness = 'Blunt';
      sarcasmScore = 0;
      sarcasmLikelihood = 'None';
      emotionalState = 'Stressed / High-Pressure';
    }

    const suggestedResponses = [
      {
        style: 'Formal & Direct',
        text: `Thank you for the note. I've noted the details and will follow up with the completed updates by end of day.`,
        energyLevel: 'Medium'
      },
      {
        style: 'Casual & Friendly',
        text: `Got it! Thanks for flagging this. I'm on it and will send a quick update shortly! 👍`,
        energyLevel: 'Low'
      },
      {
        style: 'Boundary-Setting / Low-Energy',
        text: `Received. I currently have a full queue today, but I will review this tomorrow morning and let you know if I have questions.`,
        energyLevel: 'Minimal'
      }
    ];

    const analysis = {
      literalMeaning,
      subtext,
      toneMetrics: {
        urgency,
        urgencyScore,
        politeness,
        politenessScore,
        sarcasmLikelihood,
        sarcasmScore
      },
      emotionalState,
      suggestedResponses
    };

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error decoding tone:', error);
    return NextResponse.json({ error: 'Failed to decode message' }, { status: 500 });
  }
}
