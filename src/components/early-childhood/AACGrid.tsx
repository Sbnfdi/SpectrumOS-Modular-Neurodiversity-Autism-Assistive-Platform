'use client';

import React, { useState } from 'react';
import { speechService } from '@/lib/speechSynthesis';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Volume2,
  Camera,
  Sparkles,
  Droplet,
  DoorClosed,
  Moon,
  HelpCircle,
  CheckCircle2,
  XCircle,
  VolumeX,
  Apple,
  Home,
  School,
  ShoppingBag,
  Utensils,
  TreePine,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface AACTile {
  id: string;
  label: string;
  spokenPhrase: string;
  category: 'need' | 'sensory' | 'action' | 'social';
  color: string;
  iconName: string;
}

const defaultTiles: Record<string, AACTile[]> = {
  home: [
    { id: 'h1', label: 'More Water', spokenPhrase: 'I would like some water please.', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
    { id: 'h2', label: 'Bathroom', spokenPhrase: 'I need to use the restroom.', category: 'need', color: 'bg-indigo-500/15 border-indigo-400 text-indigo-800 dark:text-indigo-200', iconName: 'DoorClosed' },
    { id: 'h3', label: 'Quiet Break', spokenPhrase: 'I need a few minutes of quiet sensory time.', category: 'sensory', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'Moon' },
    { id: 'h4', label: 'Need Help', spokenPhrase: 'Can you please help me?', category: 'action', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'HelpCircle' },
    { id: 'h5', label: 'Yes, Please', spokenPhrase: 'Yes, please.', category: 'social', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'CheckCircle2' },
    { id: 'h6', label: 'No, Stop', spokenPhrase: 'No thank you, please stop.', category: 'social', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'XCircle' },
  ],
  classroom: [
    { id: 'c1', label: 'Bathroom', spokenPhrase: 'May I please use the restroom?', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'DoorClosed' },
    { id: 'c2', label: 'Sensory Break', spokenPhrase: 'I need a 5-minute quiet break.', category: 'sensory', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'Sparkles' },
    { id: 'c3', label: 'Too Loud', spokenPhrase: 'It is too loud. May I use my headphones?', category: 'sensory', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'VolumeX' },
    { id: 'c4', label: 'Help with Work', spokenPhrase: 'Can you please help me with this assignment?', category: 'action', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'HelpCircle' },
    { id: 'c5', label: 'Drink Water', spokenPhrase: 'May I get a drink of water?', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
    { id: 'c6', label: 'All Done', spokenPhrase: 'I have finished my work.', category: 'social', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'CheckCircle2' },
  ],
  loud: [
    { id: 'l1', label: 'Too Loud', spokenPhrase: 'The sound is overwhelming my ears.', category: 'sensory', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'VolumeX' },
    { id: 'l2', label: 'Step Outside', spokenPhrase: 'Can we please go outside to fresh air?', category: 'action', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'TreePine' },
    { id: 'l3', label: 'Headphones', spokenPhrase: 'Please help me put on my headphones.', category: 'sensory', color: 'bg-indigo-500/15 border-indigo-400 text-indigo-800 dark:text-indigo-200', iconName: 'Volume2' },
    { id: 'l4', label: 'Ready to Leave', spokenPhrase: 'I am ready to go home now.', category: 'action', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'Home' },
    { id: 'l5', label: 'Hold Hand', spokenPhrase: 'Can I please hold your hand?', category: 'social', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'HelpCircle' },
    { id: 'l6', label: 'Need Water', spokenPhrase: 'I need some cold water.', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
  ],
  mealtime: [
    { id: 'm1', label: 'More Food', spokenPhrase: 'Can I please have more food?', category: 'need', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'Utensils' },
    { id: 'm2', label: 'Water / Juice', spokenPhrase: 'I would like something to drink please.', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
    { id: 'm3', label: 'All Done', spokenPhrase: 'I am all done eating, thank you.', category: 'action', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'CheckCircle2' },
    { id: 'm4', label: 'Comfort Snack', spokenPhrase: 'Can I have one of my comfort snacks?', category: 'need', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'Apple' },
    { id: 'm5', label: 'Restroom', spokenPhrase: 'I need to use the bathroom.', category: 'need', color: 'bg-indigo-500/15 border-indigo-400 text-indigo-800 dark:text-indigo-200', iconName: 'DoorClosed' },
    { id: 'm6', label: 'Wipe Hands', spokenPhrase: 'I need a napkin to wipe my hands.', category: 'action', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'Sparkles' },
  ],
};

export default function AACGrid() {
  const [activeContext, setActiveContext] = useState<string>('home');
  const [tiles, setTiles] = useState<AACTile[]>(defaultTiles.home);
  const [lastSpoken, setLastSpoken] = useState<string>('Tap any tile to communicate instantly');
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [sentencePrefix, setSentencePrefix] = useState<string>('');

  const contexts = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classroom', label: 'Classroom', icon: School },
    { id: 'loud', label: 'Loud / Mall', icon: ShoppingBag },
    { id: 'mealtime', label: 'Mealtime', icon: Utensils },
  ];

  const handleContextChange = (ctx: string) => {
    setActiveContext(ctx);
    setTiles(defaultTiles[ctx] || defaultTiles.home);
    sensoryAudio.playSoftChime('tap');
  };

  const handleTilePress = (tile: AACTile) => {
    setActiveTileId(tile.id);
    sensoryAudio.playSoftChime('success');

    const phraseToSpeak = sentencePrefix
      ? `${sentencePrefix} ${tile.spokenPhrase.toLowerCase()}`
      : tile.spokenPhrase;

    setLastSpoken(phraseToSpeak);
    speechService.speak(phraseToSpeak, {
      onEnd: () => setActiveTileId(null),
    });

    // Clear sentence prefix after speaking
    setTimeout(() => {
      setSentencePrefix('');
      setActiveTileId(null);
    }, 1200);
  };

  const handleCameraScan = () => {
    setIsScanning(true);
    sensoryAudio.playSoftChime('tap');

    // Simulate AI Vision Environment Scanner
    setTimeout(() => {
      setIsScanning(false);
      setActiveContext('classroom');
      setTiles(defaultTiles.classroom);
      setLastSpoken('Vision Scan: Classroom environment detected. 6 dynamic tiles updated.');
      speechService.speak('Classroom environment detected. 6 communication tiles ready.');
    }, 1500);
  };

  const renderIcon = (name: string) => {
    const className = "w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]";
    switch (name) {
      case 'Droplet': return <Droplet className={className} />;
      case 'DoorClosed': return <DoorClosed className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'HelpCircle': return <HelpCircle className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'XCircle': return <XCircle className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'VolumeX': return <VolumeX className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Apple': return <Apple className={className} />;
      case 'TreePine': return <TreePine className={className} />;
      case 'Home': return <Home className={className} />;
      default: return <Volume2 className={className} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Context Selection Bar & Vision Scanner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {contexts.map((ctx) => {
            const Icon = ctx.icon;
            const isActive = activeContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => handleContextChange(ctx.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] scale-105'
                    : 'text-[var(--text-secondary)] hover:bg-white/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{ctx.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vision AI Camera Snapshot Button */}
        <button
          onClick={handleCameraScan}
          disabled={isScanning}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          title="Scan Room with Camera to Auto-Suggest 6 AAC Tiles"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning Room...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Vision Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Sentence Builder / Speech Display Bar */}
      <div className="p-4 rounded-2xl sensory-card flex items-center justify-between gap-4 border-2 border-[var(--accent-primary)]/40 bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Spoken Output
            </p>
            <p className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
              {lastSpoken}
            </p>
          </div>
        </div>

        {/* 2-Tap Starter Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => {
              setSentencePrefix('I want');
              sensoryAudio.playSoftChime('tap');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              sentencePrefix === 'I want'
                ? 'bg-[var(--accent-primary)] text-white border-transparent'
                : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]'
            }`}
          >
            I want...
          </button>
          <button
            onClick={() => {
              setSentencePrefix('I feel');
              sensoryAudio.playSoftChime('tap');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              sentencePrefix === 'I feel'
                ? 'bg-[var(--accent-primary)] text-white border-transparent'
                : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]'
            }`}
          >
            I feel...
          </button>
        </div>
      </div>

      {/* Dynamic 6-Tile AAC Grid (Zero Nested Folder Fatigue) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {tiles.map((tile) => {
          const isPressed = activeTileId === tile.id;
          return (
            <button
              key={tile.id}
              onClick={() => handleTilePress(tile)}
              className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 text-center sensory-focus ${
                tile.color
              } ${
                isPressed
                  ? 'scale-105 ring-4 ring-[var(--accent-primary)] shadow-xl'
                  : 'hover:scale-[1.02] shadow-sm'
              }`}
            >
              <div className="transition-transform duration-200">
                {renderIcon(tile.iconName)}
              </div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                {tile.label}
              </span>
              <span className="text-xs opacity-75 font-medium line-clamp-1">
                "{tile.spokenPhrase}"
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
