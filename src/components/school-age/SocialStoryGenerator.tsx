'use client';

import React, { useState, useEffect } from 'react';
import { speechService } from '@/lib/speechSynthesis';
import { sensoryAudio } from '@/lib/audioEngine';
import { useProfileStore } from '@/store/useProfileStore';
import {
  BookOpen,
  Sparkles,
  Volume2,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smile,
  Compass,
  Lightbulb,
  CheckCircle2,
  BookmarkPlus,
  FolderOpen,
  Edit3,
  Check,
  Plus,
  Trash2,
  FileText,
  Loader2
} from 'lucide-react';

export interface StoryStep {
  stepNumber: number;
  type: string;
  title: string;
  text: string;
  visualIcon?: string;
  copingTip?: string;
}

const presetLibrary: { title: string; category: string; steps: StoryStep[] }[] = [
  {
    title: 'Visiting the Dentist for a Tooth Cleaning',
    category: 'Medical & Health',
    steps: [
      {
        stepNumber: 1,
        type: 'Descriptive',
        title: 'Arriving at the Dental Clinic',
        text: 'Sometimes we visit Dr. Green to make sure our teeth stay strong and healthy. The waiting room has soft chairs and friendly receptionists.',
        visualIcon: 'Smile',
        copingTip: 'I can wear my noise-cancelling headphones while waiting.',
      },
      {
        stepNumber: 2,
        type: 'Perspective',
        title: 'The Reclining Chair',
        text: 'The dental chair can tip back like a spaceship bed. The hygienist wears a clean blue mask and shines a special bright light to see teeth clearly.',
        visualIcon: 'Compass',
        copingTip: 'I can close my eyes or wear sunglasses if the light feels bright.',
      },
      {
        stepNumber: 3,
        type: 'Directive / Affirmative',
        title: 'Sounds and Gentle Vibrations',
        text: 'The special electric toothbrush makes a humming sound like a gentle bee. It tickles as it cleans away plaque.',
        visualIcon: 'Lightbulb',
        copingTip: 'I can raise my left hand if I want the dentist to take a 10-second pause.',
      },
      {
        stepNumber: 4,
        type: 'Cooperative / Resolution',
        title: 'Done and Proud',
        text: 'When the cleaning is finished, my teeth feel smooth and clean. I can pick a cool sticker and head home to celebrate my brave job.',
        visualIcon: 'CheckCircle2',
        copingTip: 'I did a great job taking care of myself today!',
      },
    ],
  },
  {
    title: 'Loud Unexpected Fire Drill at School',
    category: 'School Routines',
    steps: [
      {
        stepNumber: 1,
        type: 'Descriptive',
        title: 'The Loud Alarm Sound',
        text: 'Schools practice fire drills so everyone knows how to stay safe. When the alarm beeps loudly, it does not mean there is danger right now—it is just practice.',
        visualIcon: 'Lightbulb',
        copingTip: 'I can cover my ears with my hands or put on ear defenders immediately.',
      },
      {
        stepNumber: 2,
        type: 'Perspective',
        title: 'Walking in Line Outside',
        text: 'My teacher will tell the class to pause our work and stand in a calm line. Everyone walks quietly together toward the outdoor soccer field.',
        visualIcon: 'Compass',
        copingTip: 'I can focus on looking at the shoes of the person in front of me.',
      },
      {
        stepNumber: 3,
        type: 'Directive',
        title: 'Waiting on the Field',
        text: 'We stand on the green grass while the teacher checks attendance. The fresh air helps my body stay calm.',
        visualIcon: 'Smile',
        copingTip: 'I can take 3 slow belly breaths: smell the flowers, blow out the candle.',
      },
      {
        stepNumber: 4,
        type: 'Resolution',
        title: 'Returning to Class',
        text: 'The principal rings the all-clear bell. The alarm turns off completely and we walk back to our classroom to resume our day.',
        visualIcon: 'CheckCircle2',
        copingTip: 'The loud sound is finished and our classroom is safe and quiet.',
      },
    ],
  },
  {
    title: 'Going to the Haircut Salon',
    category: 'Sensory Transitions',
    steps: [
      {
        stepNumber: 1,
        type: 'Descriptive',
        title: 'Sitting in the Salon Chair',
        text: 'Hair grows longer over time. Going for a trim keeps hair out of our eyes and ears. The stylist puts on a smooth nylon cape.',
        visualIcon: 'Smile',
        copingTip: 'I can bring my favorite tactile fidget toy to squeeze in my hands.',
      },
      {
        stepNumber: 2,
        type: 'Perspective',
        title: 'Water Spray & Comb',
        text: 'The stylist might spray a light mist of water to make hair damp. The comb feels like gentle fingers brushing through hair.',
        visualIcon: 'Compass',
        copingTip: 'I can ask for dry cutting with no spray bottle if the water feels wet.',
      },
      {
        stepNumber: 3,
        type: 'Directive',
        title: 'Snip-Snip with Scissors',
        text: 'The scissors make a soft rhythmic snip-snip sound. Hair falls away gently onto the cape.',
        visualIcon: 'Lightbulb',
        copingTip: 'I can keep my head steady like a stone statue.',
      },
      {
        stepNumber: 4,
        type: 'Resolution',
        title: 'Brushing Off and Finished',
        text: 'The stylist uses a soft fluffy brush to dust off any tiny loose hairs. The cape comes off and my haircut is complete!',
        visualIcon: 'CheckCircle2',
        copingTip: 'I can look in the mirror and smile at my neat new look.',
      },
    ],
  },
];

export default function SocialStoryGenerator() {
  const { apiKey } = useProfileStore();
  const [customScenario, setCustomScenario] = useState('');
  const [activeStoryTitle, setActiveStoryTitle] = useState(presetLibrary[0].title);
  const [savedStories, setSavedStories] = useState<{ id: string; scenarioTitle: string; storyData: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'print-grid'>('card');

  const [steps, setSteps] = useState<StoryStep[]>(presetLibrary[0].steps);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetch('/api/social-stories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stories) {
          setSavedStories(data.stories);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async (scenarioToGenerate: string) => {
    if (!scenarioToGenerate.trim()) return;

    setIsLoading(true);
    sensoryAudio.playSoftChime('tap');
    setActiveStoryTitle(scenarioToGenerate);
    setIsSaved(false);

    try {
      const res = await fetch('/api/ai/social-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarioToGenerate,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.steps) {
        setSteps(data.steps);
        setActiveStepIndex(0);
        sensoryAudio.playSoftChime('success');
      }
    } catch (err) {
      console.error('Failed to generate social story:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof presetLibrary[0]) => {
    setActiveStoryTitle(preset.title);
    setSteps(preset.steps);
    setActiveStepIndex(0);
    sensoryAudio.playSoftChime('tap');
  };

  const handleSaveToBinder = async () => {
    setIsSaving(true);
    sensoryAudio.playSoftChime('tap');

    try {
      const res = await fetch('/api/social-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: activeStoryTitle,
          storyData: steps,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setSavedStories((prev) => [data.story, ...prev]);
        setIsSaved(true);
        sensoryAudio.playSoftChime('bloom');
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save story:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSavedStory = (storyObj: { scenarioTitle: string; storyData: string }) => {
    try {
      const parsedSteps = typeof storyObj.storyData === 'string' ? JSON.parse(storyObj.storyData) : storyObj.storyData;
      setSteps(parsedSteps);
      setActiveStoryTitle(storyObj.scenarioTitle);
      setActiveStepIndex(0);
      sensoryAudio.playSoftChime('tap');
    } catch (e) {
      console.error('Error loading saved story:', e);
    }
  };

  const handleReadStep = (stepText: string, copingTip?: string) => {
    setIsSpeaking(true);
    const fullText = copingTip ? `${stepText}. Calming coping strategy: ${copingTip}` : stepText;
    speechService.speak(fullText, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateStepText = (index: number, field: 'title' | 'text' | 'copingTip', val: string) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Header & Controls */}
      <div className="p-5 rounded-3xl sensory-card space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Carol Gray Social Story Generator Pro</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Clinical Carol Gray compliant 4-step transition stories with sensory coping strategies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'print-grid' : 'card')}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{viewMode === 'card' ? '4-Panel Grid View' : 'Single Step View'}</span>
            </button>

            <button
              onClick={handleSaveToBinder}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved in Binder!' : 'Save Story'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Input prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate(customScenario);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="Describe any upcoming event (e.g. 'Airport security line & flight flight takeoff')..."
            className="flex-1 px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] placeholder:text-[var(--text-secondary)]/60"
          />
          <button
            type="submit"
            disabled={isLoading || !customScenario.trim()}
            className="px-5 py-3 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate</span>
          </button>
        </form>

        {/* Curated Clinical Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs font-semibold text-[var(--text-secondary)] self-center mr-1">
            Clinical Presets:
          </span>
          {presetLibrary.map((preset) => (
            <button
              key={preset.title}
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                activeStoryTitle === preset.title
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 border-[var(--border-color)] text-[var(--text-primary)]'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Saved Binder */}
        {savedStories.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Saved Binder:</span>
            </span>
            {savedStories.slice(0, 5).map((story) => (
              <button
                key={story.id}
                onClick={() => handleLoadSavedStory(story)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-500/20 truncate max-w-[180px]"
              >
                {story.scenarioTitle}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4-Panel Grid View (For Printing or Full Story Reading) */}
      {viewMode === 'print-grid' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]">{activeStoryTitle}</h3>
            <span className="text-xs font-bold text-slate-500">4-Step Visual Transition Guide</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl sensory-card border-2 border-[var(--border-color)] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {step.type}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[var(--text-primary)]">{step.title}</h4>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">"{step.text}"</p>
                </div>

                {step.copingTip && (
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{step.copingTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Single Step Interactive Visualizer */
        <div className="p-6 sm:p-8 rounded-3xl sensory-card border-2 border-[var(--border-color)] space-y-6">
          {/* Step Progress Indicators */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    sensoryAudio.playSoftChime('tap');
                  }}
                  className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all ${
                    activeStepIndex === idx
                      ? 'bg-[var(--accent-primary)] text-white scale-110 shadow-md ring-2 ring-[var(--accent-primary)]/40'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isEditing
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'border-[var(--border-color)] text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Edit Carol Gray Text"
              >
                {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">{isEditing ? 'Done Editing' : 'Edit Step'}</span>
              </button>

              <span className="text-xs font-bold text-[var(--accent-primary)] px-3 py-1 rounded-full bg-[var(--accent-primary)]/10">
                Step {activeStepIndex + 1} of {steps.length}: {currentStep.type}
              </span>
            </div>
          </div>

          {/* Active Step Story Card */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              {isEditing ? (
                <input
                  type="text"
                  value={currentStep.title}
                  onChange={(e) => handleUpdateStepText(activeStepIndex, 'title', e.target.value)}
                  className="w-full text-xl font-extrabold px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                />
              ) : (
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {currentStep.title}
                </h3>
              )}

              <button
                onClick={() => handleReadStep(currentStep.text, currentStep.copingTip)}
                className="p-3 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-300 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1.5 shrink-0"
                title="Listen with soothing text-to-speech"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Read Aloud</span>
              </button>
            </div>

            {/* Narrative text */}
            {isEditing ? (
              <textarea
                value={currentStep.text}
                onChange={(e) => handleUpdateStepText(activeStepIndex, 'text', e.target.value)}
                rows={3}
                className="w-full text-base p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium"
              />
            ) : (
              <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-base sm:text-lg leading-relaxed text-[var(--text-primary)] font-medium">
                "{currentStep.text}"
              </div>
            )}

            {/* Sensory Coping Strategy */}
            {isEditing ? (
              <input
                type="text"
                value={currentStep.copingTip || ''}
                onChange={(e) => handleUpdateStepText(activeStepIndex, 'copingTip', e.target.value)}
                placeholder="Sensory coping reminder..."
                className="w-full text-sm p-3 rounded-xl border border-teal-300 bg-teal-50/50 dark:bg-slate-800 text-teal-900 dark:text-teal-200 font-semibold"
              />
            ) : (
              currentStep.copingTip && (
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-700 flex items-center gap-3 text-teal-900 dark:text-teal-200">
                  <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      Sensory Coping Tool
                    </p>
                    <p className="text-sm font-semibold">{currentStep.copingTip}</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (activeStepIndex > 0) {
                  setActiveStepIndex(activeStepIndex - 1);
                  sensoryAudio.playSoftChime('tap');
                }
              }}
              disabled={activeStepIndex === 0}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => {
                if (activeStepIndex < steps.length - 1) {
                  setActiveStepIndex(activeStepIndex + 1);
                  sensoryAudio.playSoftChime('tap');
                }
              }}
              disabled={activeStepIndex === steps.length - 1}
              className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[var(--accent-hover)] disabled:opacity-30 shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
