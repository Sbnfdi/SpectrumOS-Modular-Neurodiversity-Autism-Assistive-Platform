'use client';

import React, { useState, useRef, useEffect } from 'react';
import { speechService } from '@/lib/speechSynthesis';
import { sensoryAudio } from '@/lib/audioEngine';
import { useProfileStore } from '@/store/useProfileStore';
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
  Plus,
  X,
  Loader2,
  Heart,
  Smile,
  Zap,
  Hand,
  Play,
  Trash2,
  Printer,
  Settings2,
  Frown,
  Meh,
  Flame,
  ShieldAlert,
  Activity
} from 'lucide-react';

export interface AACTile {
  id: string;
  label: string;
  spokenPhrase: string;
  category: 'need' | 'sensory' | 'action' | 'social' | 'emotion';
  color: string;
  iconName: string;
}

const defaultDecks: Record<string, AACTile[]> = {
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
    { id: 'l5', label: 'Hold Hand', spokenPhrase: 'Can I please hold your hand?', category: 'social', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'Heart' },
    { id: 'l6', label: 'Need Water', spokenPhrase: 'I need some cold water.', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
  ],
  mealtime: [
    { id: 'm1', label: 'More Food', spokenPhrase: 'Can I please have more food?', category: 'need', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'Utensils' },
    { id: 'm2', label: 'Water / Juice', spokenPhrase: 'I would like something to drink please.', category: 'need', color: 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200', iconName: 'Droplet' },
    { id: 'm3', label: 'All Done', spokenPhrase: 'I am all done eating, thank you.', category: 'action', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'CheckCircle2' },
    { id: 'm4', label: 'Comfort Snack', spokenPhrase: 'Can I have one of my comfort snacks?', category: 'need', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'Apple' },
    { id: 'm5', label: 'Restroom', spokenPhrase: 'I need to use the bathroom.', category: 'need', color: 'bg-indigo-500/15 border-indigo-400 text-indigo-800 dark:text-indigo-200', iconName: 'DoorClosed' },
    { id: 'm6', label: 'Wipe Hands', spokenPhrase: 'I need a napkin to wipe my hands.', category: 'action', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'Hand' },
  ],
  emotions: [
    { id: 'e1', label: 'Happy / Good', spokenPhrase: 'I am feeling happy and regulated.', category: 'emotion', color: 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200', iconName: 'Smile' },
    { id: 'e2', label: 'Overwhelmed', spokenPhrase: 'I am feeling sensory overload right now.', category: 'emotion', color: 'bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-200', iconName: 'Flame' },
    { id: 'e3', label: 'Tired / Low', spokenPhrase: 'My energy is low, I feel tired.', category: 'emotion', color: 'bg-indigo-500/15 border-indigo-400 text-indigo-800 dark:text-indigo-200', iconName: 'Moon' },
    { id: 'e4', label: 'Frustrated', spokenPhrase: 'I am feeling frustrated and need patience.', category: 'emotion', color: 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-200', iconName: 'Frown' },
    { id: 'e5', label: 'Excited', spokenPhrase: 'I am super excited and happy!', category: 'emotion', color: 'bg-teal-500/15 border-teal-400 text-teal-800 dark:text-teal-200', iconName: 'Zap' },
    { id: 'e6', label: 'Unsure', spokenPhrase: 'I am not sure what is happening next.', category: 'emotion', color: 'bg-purple-500/15 border-purple-400 text-purple-800 dark:text-purple-200', iconName: 'Meh' },
  ],
  emergency: [
    { id: 'em1', label: 'Need Space', spokenPhrase: 'Please give me space. Do not touch me right now.', category: 'sensory', color: 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-100', iconName: 'ShieldAlert' },
    { id: 'em2', label: 'Hurts Inside', spokenPhrase: 'Something in my body hurts or feels uncomfortable.', category: 'need', color: 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100', iconName: 'Activity' },
    { id: 'em3', label: 'Call Caregiver', spokenPhrase: 'Please call my trusted parent or caregiver.', category: 'action', color: 'bg-blue-500/20 border-blue-500 text-blue-900 dark:text-blue-100', iconName: 'Heart' },
    { id: 'em4', label: 'Quiet Room', spokenPhrase: 'Take me to a quiet and dark room immediately.', category: 'sensory', color: 'bg-purple-500/20 border-purple-500 text-purple-900 dark:text-purple-100', iconName: 'Moon' },
    { id: 'em5', label: 'Deep Breath', spokenPhrase: 'Help me take three slow deep breaths.', category: 'action', color: 'bg-teal-500/20 border-teal-500 text-teal-900 dark:text-teal-100', iconName: 'Sparkles' },
    { id: 'em6', label: 'Safe Now', spokenPhrase: 'I am feeling safer now, thank you.', category: 'social', color: 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-100', iconName: 'CheckCircle2' },
  ]
};

export default function AACGrid() {
  const { apiKey } = useProfileStore();
  const [activeContext, setActiveContext] = useState<string>('home');
  const [tiles, setTiles] = useState<AACTile[]>(defaultDecks.home);
  const [lastSpoken, setLastSpoken] = useState<string>('Tap any tile to communicate instantly');
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [sentenceRibbon, setSentenceRibbon] = useState<AACTile[]>([]);
  const [showAddTileModal, setShowAddTileModal] = useState(false);
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  // New Custom Tile Form State
  const [newLabel, setNewLabel] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState<'need' | 'sensory' | 'action' | 'social' | 'emotion'>('need');
  const [newColor, setNewColor] = useState('blue');
  const [newIcon, setNewIcon] = useState('Smile');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const contexts = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classroom', label: 'Classroom', icon: School },
    { id: 'loud', label: 'Loud / Mall', icon: ShoppingBag },
    { id: 'mealtime', label: 'Mealtime', icon: Utensils },
    { id: 'emotions', label: 'Emotions', icon: Smile },
    { id: 'emergency', label: 'SOS / Urgent', icon: ShieldAlert },
  ];

  useEffect(() => {
    speechService.setSpeechSettings(speechRate, speechPitch);
  }, [speechRate, speechPitch]);

  const handleContextChange = (ctx: string) => {
    setActiveContext(ctx);
    setTiles(defaultDecks[ctx] || defaultDecks.home);
    sensoryAudio.playSoftChime('tap');
  };

  // Tap on a tile adds it to sentence ribbon and plays soft auditory feedback
  const handleTilePress = (tile: AACTile) => {
    setActiveTileId(tile.id);
    sensoryAudio.playSoftChime('tap');

    // Add to ribbon
    setSentenceRibbon((prev) => [...prev, tile]);
    setLastSpoken(tile.spokenPhrase);
    speechService.speak(tile.spokenPhrase, {
      rate: speechRate,
      pitch: speechPitch,
      onEnd: () => setActiveTileId(null),
    });
  };

  // Speak full assembled sentence ribbon
  const handleSpeakRibbon = () => {
    if (sentenceRibbon.length === 0) return;
    const fullSentence = sentenceRibbon.map(t => t.spokenPhrase).join(' ');
    setLastSpoken(fullSentence);
    sensoryAudio.playSoftChime('success');
    speechService.speak(fullSentence, {
      rate: speechRate,
      pitch: speechPitch,
    });
  };

  const handleClearRibbon = () => {
    setSentenceRibbon([]);
    sensoryAudio.playSoftChime('tap');
  };

  const handleRemoveFromRibbon = (index: number) => {
    setSentenceRibbon(prev => prev.filter((_, i) => i !== index));
    sensoryAudio.playSoftChime('tap');
  };

  const handlePrintBoard = () => {
    window.print();
  };

  // Camera file upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    sensoryAudio.playSoftChime('tap');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;

      try {
        const res = await fetch('/api/ai/vision-aac', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contextTag: 'custom',
            imageBase64: base64,
            apiKey,
          }),
        });

        const data = await res.json();
        if (data.success && data.tiles && data.tiles.length > 0) {
          const formattedTiles: AACTile[] = data.tiles.map((t: { id?: string; label: string; spokenPhrase: string; category?: string; color?: string; iconName?: string }, idx: number) => ({
            id: t.id || `dyn_${idx}`,
            label: t.label,
            spokenPhrase: t.spokenPhrase,
            category: (t.category as 'need' | 'sensory' | 'action' | 'social' | 'emotion') || 'need',
            color: t.color ? `bg-${t.color}-500/15 border-${t.color}-400 text-${t.color}-800 dark:text-${t.color}-200` : 'bg-blue-500/15 border-blue-400 text-blue-800 dark:text-blue-200',
            iconName: t.iconName || 'Sparkles',
          }));

          setTiles(formattedTiles.slice(0, 6));
          setLastSpoken('Vision Scan complete: 6 adaptive tiles generated from your photo.');
          speechService.speak('Vision environment scanned. Communication board updated.');
          sensoryAudio.playSoftChime('bloom');
        }
      } catch (err) {
        console.error('Vision AAC error:', err);
      } finally {
        setIsScanning(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAddCustomTile = () => {
    if (!newLabel.trim() || !newPhrase.trim()) return;

    const newTile: AACTile = {
      id: `custom_${Date.now()}`,
      label: newLabel.trim(),
      spokenPhrase: newPhrase.trim(),
      category: newCategory,
      color: `bg-${newColor}-500/15 border-${newColor}-400 text-${newColor}-800 dark:text-${newColor}-200`,
      iconName: newIcon,
    };

    const updated = [newTile, ...tiles.slice(0, 5)];
    setTiles(updated);
    setShowAddTileModal(false);
    setNewLabel('');
    setNewPhrase('');
    sensoryAudio.playSoftChime('success');
  };

  const renderIcon = (name: string) => {
    const className = "w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]";
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
      case 'Heart': return <Heart className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Hand': return <Hand className={className} />;
      case 'Frown': return <Frown className={className} />;
      case 'Meh': return <Meh className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Activity': return <Activity className={className} />;
      default: return <Volume2 className={className} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Context Bar & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {contexts.map((ctx) => {
            const Icon = ctx.icon;
            const isActive = activeContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => handleContextChange(ctx.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] scale-105'
                    : 'text-[var(--text-secondary)] hover:bg-white/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ctx.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Scan surroundings with camera to adapt AAC board"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scan</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddTileModal(true)}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title="Create Custom AAC Tile"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Tile</span>
          </button>

          <button
            onClick={() => setShowSpeechSettings(!showSpeechSettings)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold border border-[var(--border-color)]"
            title="Voice Pitch & Speed Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintBoard}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold border border-[var(--border-color)]"
            title="Print Communication Board"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Settings Drawer */}
      {showSpeechSettings && (
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
          <div>
            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
              <span>Speech Rate (Pacing)</span>
              <span className="font-mono">{speechRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.3"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
              <span>Voice Pitch (Tone)</span>
              <span className="font-mono">{speechPitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.1"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Dynamic Sentence Ribbon Builder */}
      <div className="p-4 rounded-2xl sensory-card space-y-3 border-2 border-[var(--accent-primary)]/40 bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-secondary)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Sentence Ribbon Builder
              </p>
              <p className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                {sentenceRibbon.length > 0
                  ? sentenceRibbon.map((t) => t.label).join(' ➔ ')
                  : lastSpoken}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {sentenceRibbon.length > 0 && (
              <>
                <button
                  onClick={handleSpeakRibbon}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Speak All</span>
                </button>
                <button
                  onClick={handleClearRibbon}
                  className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Clear sentence ribbon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Word Badges in Ribbon */}
        {sentenceRibbon.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-color)]">
            {sentenceRibbon.map((tile, idx) => (
              <span
                key={`${tile.id}_${idx}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-400 text-blue-900 dark:text-blue-200 text-xs font-bold"
              >
                <span>{tile.label}</span>
                <button
                  onClick={() => handleRemoveFromRibbon(idx)}
                  className="hover:text-rose-500 transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic 6-Tile AAC Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 print:grid-cols-3 print:gap-6">
        {tiles.map((tile) => {
          const isPressed = activeTileId === tile.id;
          return (
            <button
              key={tile.id}
              onClick={() => handleTilePress(tile)}
              className={`p-6 sm:p-7 rounded-3xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all transform active:scale-95 text-center sensory-focus ${
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
              <span className="text-base sm:text-lg font-extrabold tracking-tight">
                {tile.label}
              </span>
              <span className="text-xs opacity-75 font-medium line-clamp-1">
                "{tile.spokenPhrase}"
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom AAC Tile Modal */}
      {showAddTileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md sensory-card p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Create Custom AAC Tile
              </h3>
              <button
                onClick={() => setShowAddTileModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                  Tile Display Name
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., 'Weighted Blanket', 'Sensory Swing'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                  Spoken Sentence Output
                </label>
                <input
                  type="text"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="e.g., 'I would like to use the weighted blanket.'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                    Tile Theme Color
                  </label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="blue">Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="rose">Rose</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">
                    Visual Icon
                  </label>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="Smile">Smile</option>
                    <option value="Heart">Heart</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Moon">Moon</option>
                    <option value="Zap">Zap</option>
                    <option value="Hand">Hand</option>
                    <option value="Droplet">Droplet</option>
                    <option value="Utensils">Utensils</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowAddTileModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomTile}
                className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold shadow-sm hover:bg-[var(--accent-hover)]"
              >
                Save Tile to Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
