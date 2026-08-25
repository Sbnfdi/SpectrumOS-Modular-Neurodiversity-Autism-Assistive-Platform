'use client';

import React, { useState, useEffect } from 'react';
import { speechService } from '@/lib/speechSynthesis';
import { sensoryAudio } from '@/lib/audioEngine';
import { useProfileStore } from '@/store/useProfileStore';
import {
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smile,
  Compass,
  Lightbulb,
  CheckCircle2,
  Send,
  Loader2,
  BookmarkPlus,
  FolderOpen
} from 'lucide-react';

export interface StoryStep {
  stepNumber: number;
  type: string;
  title: string;
  text: string;
  visualIcon?: string;
  copingTip?: string;
}

const presetScenarios = [
  'Visiting the Dentist for a Tooth Cleaning',
  'Loud Unexpected Fire Drill at School',
  'Guest Substitute Teacher in Class',
  'Sudden Rainstorm Canceling Outdoor Recess',
  'Going to the Haircut Salon',
];

export default function SocialStoryGenerator() {
  const { apiKey } = useProfileStore();
  const [customScenario, setCustomScenario] = useState('');
  const [activeStoryTitle, setActiveStoryTitle] = useState('Visiting the Dentist for a Tooth Cleaning');
  const [savedStories, setSavedStories] = useState<{ id: string; scenarioTitle: string; storyData: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [steps, setSteps] = useState<StoryStep[]>([
    {
      stepNumber: 1,
      type: 'Descriptive',
      title: 'Arriving at the Office',
      text: 'Sometimes we visit Dr. Green to make sure our teeth stay strong and healthy. The waiting room has soft chairs and friendly receptionists.',
      visualIcon: 'Smile',
      copingTip: 'I can wear my noise-cancelling headphones while waiting.',
    },
    {
      stepNumber: 2,
      type: 'Perspective',
      title: 'The Reclining Chair',
      text: 'The dental chair can tip back like a spaceship bed. The dentist wears a clean blue mask and shines a special bright light to see teeth clearly.',
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
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch saved stories on mount
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
      const parsedSteps = JSON.parse(storyObj.storyData);
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
    const fullText = copingTip ? `${stepText}. Calming reminder: ${copingTip}` : stepText;
    speechService.speak(fullText, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Header & Presets */}
      <div className="p-5 rounded-3xl sensory-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Carol Gray Social Story Generator</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              4-step clinical transition stories with predictable visuals and sensory coping strategies.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              <span>Print Cards</span>
            </button>
          </div>
        </div>

        {/* Input bar */}
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
            placeholder="Type any upcoming event (e.g., 'First day riding the school bus')..."
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

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs font-semibold text-[var(--text-secondary)] self-center mr-1">
            Quick Scenarios:
          </span>
          {presetScenarios.map((sc) => (
            <button
              key={sc}
              onClick={() => {
                setCustomScenario(sc);
                handleGenerate(sc);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-surface)] hover:bg-white dark:hover:bg-slate-800 border border-[var(--border-color)] text-[var(--text-primary)] transition-all"
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Saved Stories Binder Chips */}
        {savedStories.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Saved Binder:</span>
            </span>
            {savedStories.slice(0, 4).map((story) => (
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

      {/* 4-Step Interactive Story Visualizer */}
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

          <span className="text-xs font-bold text-[var(--accent-primary)] px-3 py-1 rounded-full bg-[var(--accent-primary)]/10">
            Step {activeStepIndex + 1} of {steps.length}: {currentStep.type}
          </span>
        </div>

        {/* Active Step Story Card */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {currentStep.title}
            </h3>

            {/* Read Aloud Button */}
            <button
              onClick={() => handleReadStep(currentStep.text, currentStep.copingTip)}
              className="p-3 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-300 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1.5 shrink-0"
              title="Listen with soothing text-to-speech"
            >
              <Volume2 className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Read Aloud</span>
            </button>
          </div>

          {/* Factual & Affirming Story Narrative */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-base sm:text-lg leading-relaxed text-[var(--text-primary)] font-medium">
            "{currentStep.text}"
          </div>

          {/* Calming Sensory Coping Strategy */}
          {currentStep.copingTip && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-300/60 dark:border-teal-700 flex items-center gap-3 text-teal-900 dark:text-teal-200">
              <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Sensory Coping Tool
                </p>
                <p className="text-sm font-semibold">{currentStep.copingTip}</p>
              </div>
            </div>
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
    </div>
  );
}
