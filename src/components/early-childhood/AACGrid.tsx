'use client';

import React, { useState, useRef } from 'react';
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
  Upload,
  Loader2,
  Heart,
  Smile,
  Zap,
  Hand
} from 'lucide-react';

export interface AACTile {
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
};

export default function AACGrid() {
  const { apiKey } = useProfileStore();
  const [activeContext, setActiveContext] = useState<string>('home');
  const [tiles, setTiles] = useState<AACTile[]>(defaultTiles.home);
  const [lastSpoken, setLastSpoken] = useState<string>('Tap any tile to communicate instantly');
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [sentencePrefix, setSentencePrefix] = useState<string>('');
  const [showAddTileModal, setShowAddTileModal] = useState(false);

  // New Custom Tile Form State
  const [newLabel, setNewLabel] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newColor, setNewColor] = useState('blue');
  const [newIcon, setNewIcon] = useState('Smile');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            category: (t.category as 'need' | 'sensory' | 'action' | 'social') || 'need',
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
      category: 'need',
      color: `bg-${newColor}-500/15 border-${newColor}-400 text-${newColor}-800 dark:text-${newColor}-200`,
      iconName: newIcon,
    };

    // Replace 6th tile or append up to 6
    const updated = [newTile, ...tiles.slice(0, 5)];
    setTiles(updated);
    setShowAddTileModal(false);
    setNewLabel('');
    setNewPhrase('');
    sensoryAudio.playSoftChime('success');
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
      case 'Heart': return <Heart className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Hand': return <Hand className={className} />;
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

        <div className="flex items-center gap-2">
          {/* Hidden File Input for Real Camera Capture / Gallery Upload */}
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
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Take a photo or upload to auto-scan environment"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Scene...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Camera Scan</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddTileModal(true)}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Create Custom AAC Tile"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tile</span>
          </button>
        </div>
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

      {/* Dynamic 6-Tile AAC Grid */}
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

      {/* Add Custom AAC Tile Modal */}
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
                  placeholder="e.g., 'Music Time', 'Weighted Blanket'"
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
                  placeholder="e.g., 'May I please listen to my music?'"
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
