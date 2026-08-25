import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { contextTag, imageBase64, apiKey } = await req.json();

    // If an image and API key is provided, we can call OpenAI Vision
    if (imageBase64 && apiKey && apiKey.startsWith('sk-')) {
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
                content: `You are an AAC (Augmentative and Alternative Communication) assistive expert.
Analyze the user's uploaded environment photo and return a strict JSON array of exactly 6 high-probability AAC communication tiles suited for this immediate environment.
Each tile object must have:
{
  "id": "unique_id",
  "label": "Short spoken title (e.g. 'More Water', 'Too Loud', 'Need Bathroom')",
  "spokenPhrase": "Full natural sentence to speak aloud (e.g. 'Can I please have a glass of water?')",
  "category": "sensory" | "need" | "action" | "social" | "emotion",
  "color": "emerald" | "blue" | "amber" | "rose" | "indigo" | "purple",
  "iconName": "Icon identifier (e.g. 'VolumeX', 'Droplet', 'DoorClosed', 'Coffee', 'HandMetal', 'Heart')"
}`
              },
              {
                role: 'user',
                content: [
                  { type: 'text', text: 'Generate 6 dynamic AAC communication tiles for this scene.' },
                  { type: 'image_url', image_url: { url: imageBase64 } }
                ]
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ success: true, tiles: parsed.tiles || parsed });
        }
      } catch (err) {
        console.warn('Vision API call failed, using intelligent context mapper', err);
      }
    }

    // Dynamic Context Mapper presets
    const tag = (contextTag || 'home').toLowerCase();

    let tiles = [];

    if (tag === 'classroom' || tag === 'school') {
      tiles = [
        { id: 'c1', label: 'Bathroom', spokenPhrase: 'May I please use the restroom?', category: 'need', color: 'blue', iconName: 'DoorClosed' },
        { id: 'c2', label: 'Sensory Break', spokenPhrase: 'I need a 5-minute quiet sensory break.', category: 'sensory', color: 'emerald', iconName: 'Sparkles' },
        { id: 'c3', label: 'Too Loud', spokenPhrase: 'It is too loud in here. May I use my headphones?', category: 'sensory', color: 'rose', iconName: 'VolumeX' },
        { id: 'c4', label: 'Need Help', spokenPhrase: 'Can you please help me with this assignment?', category: 'action', color: 'amber', iconName: 'HelpCircle' },
        { id: 'c5', label: 'Water Drink', spokenPhrase: 'I would like to take a drink of water.', category: 'need', color: 'indigo', iconName: 'Droplet' },
        { id: 'c6', label: 'Finished Work', spokenPhrase: 'I have finished my work for now.', category: 'social', color: 'purple', iconName: 'CheckCircle2' },
      ];
    } else if (tag === 'loud' || tag === 'mall' || tag === 'public') {
      tiles = [
        { id: 'p1', label: 'Overwhelmed', spokenPhrase: 'I am feeling overwhelmed by the environment.', category: 'sensory', color: 'rose', iconName: 'AlertCircle' },
        { id: 'p2', label: 'Go Outside', spokenPhrase: 'Can we please step outside for fresh air?', category: 'action', color: 'emerald', iconName: 'TreePine' },
        { id: 'p3', label: 'Headphones', spokenPhrase: 'Please help me get my noise-cancelling headphones.', category: 'sensory', color: 'indigo', iconName: 'Headphones' },
        { id: 'p4', label: 'Ready to Leave', spokenPhrase: 'I am ready to go home now please.', category: 'action', color: 'amber', iconName: 'Home' },
        { id: 'p5', label: 'Hold Hand', spokenPhrase: 'Can I please hold your hand for grounding?', category: 'social', color: 'purple', iconName: 'Heart' },
        { id: 'p6', label: 'Drink Water', spokenPhrase: 'I need some cold water to sip.', category: 'need', color: 'blue', iconName: 'Droplet' },
      ];
    } else if (tag === 'mealtime' || tag === 'kitchen') {
      tiles = [
        { id: 'm1', label: 'More Food', spokenPhrase: 'Can I please have more food?', category: 'need', color: 'emerald', iconName: 'Utensils' },
        { id: 'm2', label: 'Water / Juice', spokenPhrase: 'I would like something to drink please.', category: 'need', color: 'blue', iconName: 'CupSoda' },
        { id: 'm3', label: 'All Done', spokenPhrase: 'I am all done eating, thank you.', category: 'action', color: 'purple', iconName: 'Check' },
        { id: 'm4', label: 'Too Hot / Texture', spokenPhrase: 'The texture or temperature feels uncomfortable.', category: 'sensory', color: 'rose', iconName: 'Flame' },
        { id: 'm5', label: 'Favorite Snack', spokenPhrase: 'Can I have one of my comfort snacks?', category: 'need', color: 'amber', iconName: 'Apple' },
        { id: 'm6', label: 'Wipe Hands', spokenPhrase: 'I would like a napkin to wipe my hands.', category: 'action', color: 'indigo', iconName: 'Hand' },
      ];
    } else {
      // Default versatile 6-tile grid
      tiles = [
        { id: 'd1', label: 'Yes / Agree', spokenPhrase: 'Yes, that sounds good to me.', category: 'social', color: 'emerald', iconName: 'CheckCircle2' },
        { id: 'd2', label: 'No / Stop', spokenPhrase: 'No thank you, please stop.', category: 'social', color: 'rose', iconName: 'XCircle' },
        { id: 'd3', label: 'Need Water', spokenPhrase: 'Can I please have some fresh water?', category: 'need', color: 'blue', iconName: 'Droplet' },
        { id: 'd4', label: 'Restroom', spokenPhrase: 'I need to use the bathroom please.', category: 'need', color: 'indigo', iconName: 'DoorClosed' },
        { id: 'd5', label: 'Quiet Break', spokenPhrase: 'I need a few minutes of quiet sensory rest.', category: 'sensory', color: 'purple', iconName: 'Moon' },
        { id: 'd6', label: 'Help Me', spokenPhrase: 'Could you please assist me with this?', category: 'action', color: 'amber', iconName: 'HelpCircle' },
      ];
    }

    return NextResponse.json({ success: true, tiles, context: tag });
  } catch (error) {
    console.error('Error in vision AAC:', error);
    return NextResponse.json({ error: 'Failed to generate dynamic AAC tiles' }, { status: 500 });
  }
}
