'use client';

import React, { useState } from 'react';
import { sensoryAudio } from '@/lib/audioEngine';
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Heart,
  Smile,
  AlertCircle,
  Apple
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  texture: 'crunchy' | 'smooth' | 'soft' | 'warm' | 'cold' | 'crispy';
  isSafeFood: boolean;
  notes?: string;
}

const defaultSafeFoods: FoodItem[] = [
  { id: 'f1', name: 'Golden Chicken Nuggets', texture: 'crispy', isSafeFood: true, notes: 'Consistent texture, plain' },
  { id: 'f2', name: 'Butter Pasta / Plain Noodles', texture: 'soft', isSafeFood: true, notes: 'No sauce, separate bowl' },
  { id: 'f3', name: 'Salted Pita Crackers', texture: 'crunchy', isSafeFood: true, notes: 'Predictable crunch' },
  { id: 'f4', name: 'Vanilla Greek Yogurt', texture: 'smooth', isSafeFood: true, notes: 'Smooth, no fruit chunks' },
  { id: 'f5', name: 'Sliced Green Apple with Peel Off', texture: 'crunchy', isSafeFood: false, notes: 'Trial food: 1 bite exploratory' },
];

export function SensoryMealPlanner() {
  const [foods, setFoods] = useState<FoodItem[]>(defaultSafeFoods);
  const [selectedTexture, setSelectedTexture] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newTexture, setNewTexture] = useState<FoodItem['texture']>('crunchy');
  const [isNewSafeFood, setIsNewSafeFood] = useState(true);

  // 3-Compartment Separated Plate Visualizer
  const [compartment1, setCompartment1] = useState<FoodItem | null>(defaultSafeFoods[0]);
  const [compartment2, setCompartment2] = useState<FoodItem | null>(defaultSafeFoods[1]);
  const [compartment3, setCompartment3] = useState<FoodItem | null>(defaultSafeFoods[2]);

  const handleAddFood = () => {
    if (!newFoodName.trim()) return;

    const item: FoodItem = {
      id: `food_${Date.now()}`,
      name: newFoodName.trim(),
      texture: newTexture,
      isSafeFood: isNewSafeFood,
      notes: isNewSafeFood ? 'Predictable safe food' : 'Low-pressure exploratory food',
    };

    setFoods((prev) => [item, ...prev]);
    setShowAddModal(false);
    setNewFoodName('');
    sensoryAudio.playSoftChime('success');
  };

  const handleRemoveFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    sensoryAudio.playSoftChime('tap');
  };

  const filteredFoods = selectedTexture === 'all'
    ? foods
    : foods.filter((f) => f.texture === selectedTexture);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl sensory-card space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-500" />
              <span>Sensory-Friendly Meal & Texture Planner (ARFID Friendly)</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Texture-based food profiles, safe-food validation, and non-touching compartment plates.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Safe Food</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: 3-Compartment Divided Plate (5 Cols) */}
        <div className="md:col-span-5 sensory-card p-6 flex flex-col items-center justify-between space-y-4 border-2 border-[var(--border-color)]">
          <div className="w-full text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Divided Plate (No Food Touching)
            </span>
          </div>

          {/* Divided Plate Circular Tray */}
          <div className="w-56 h-56 rounded-full border-4 border-slate-300 dark:border-slate-700 p-2 bg-slate-100 dark:bg-slate-800 flex flex-col gap-2 shadow-inner">
            {/* Top Half Compartment */}
            <div className="w-full h-1/2 rounded-t-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                {compartment1 ? compartment1.name : 'Compartment 1'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">{compartment1?.texture}</span>
            </div>

            {/* Bottom 2 Split Compartments */}
            <div className="w-full h-1/2 flex gap-2">
              <div className="w-1/2 h-full rounded-bl-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 line-clamp-1">
                  {compartment2 ? compartment2.name : 'Comp 2'}
                </span>
                <span className="text-[9px] text-slate-400 capitalize">{compartment2?.texture}</span>
              </div>
              <div className="w-1/2 h-full rounded-br-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 line-clamp-1">
                  {compartment3 ? compartment3.name : 'Comp 3'}
                </span>
                <span className="text-[9px] text-slate-400 capitalize">{compartment3?.texture}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] text-center font-medium">
            Strict separation prevents sensory contamination and food aversion meltdowns.
          </p>
        </div>

        {/* Right: Texture Category Filter & Safe Food Registry (7 Cols) */}
        <div className="md:col-span-7 sensory-card p-6 space-y-4 border-2 border-[var(--border-color)]">
          {/* Texture Filters */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'crunchy', 'crispy', 'smooth', 'soft', 'warm', 'cold'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTexture(t)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                  selectedTexture === t
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Foods List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl text-xs font-bold ${
                    food.isSafeFood ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
                  }`}>
                    {food.isSafeFood ? <Heart className="w-4 h-4" /> : <Apple className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{food.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                        {food.texture}
                      </span>
                    </div>
                    {food.notes && (
                      <p className="text-[11px] text-[var(--text-secondary)]">{food.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCompartment1(food);
                      sensoryAudio.playSoftChime('tap');
                    }}
                    className="p-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white"
                    title="Put in Top Compartment"
                  >
                    1
                  </button>
                  <button
                    onClick={() => {
                      setCompartment2(food);
                      sensoryAudio.playSoftChime('tap');
                    }}
                    className="p-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white"
                    title="Put in Left Compartment"
                  >
                    2
                  </button>
                  <button
                    onClick={() => {
                      setCompartment3(food);
                      sensoryAudio.playSoftChime('tap');
                    }}
                    className="p-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white"
                    title="Put in Right Compartment"
                  >
                    3
                  </button>
                  <button
                    onClick={() => handleRemoveFood(food.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md sensory-card p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Add Food to Registry</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Food Name</label>
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="e.g., 'Plain Salted Popcorn'"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Texture Profile</label>
                <select
                  value={newTexture}
                  onChange={(e) => setNewTexture(e.target.value as FoodItem['texture'])}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)]"
                >
                  <option value="crunchy">Crunchy (crackers, chips)</option>
                  <option value="crispy">Crispy (nuggets, fries)</option>
                  <option value="smooth">Smooth (yogurt, pudding)</option>
                  <option value="soft">Soft (bread, plain pasta)</option>
                  <option value="cold">Cold (ice pops, smoothies)</option>
                  <option value="warm">Warm (plain soup)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="safeFoodCheck"
                  checked={isNewSafeFood}
                  onChange={(e) => setIsNewSafeFood(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <label htmlFor="safeFoodCheck" className="text-xs font-bold text-[var(--text-primary)]">
                  Safe Food (100% accepted, zero sensory distress)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFood}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
              >
                Save Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
