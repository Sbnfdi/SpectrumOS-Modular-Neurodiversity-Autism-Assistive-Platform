'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function ClinicalFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SpectrumOS ensure neurodiversity-affirming clinical compliance?',
      a: 'All modules are developed without ABA compliance quotas or forced eye contact prompts. We focus purely on functional communication, sensory self-regulation, executive functioning support, and personal autonomy.',
    },
    {
      q: 'Does SpectrumOS work 100% offline without internet access?',
      a: 'Yes. SpectrumOS utilizes Service Workers for instant offline caching, an embedded local SQLite database, and procedural Web Audio synthesizers (Brown Noise and Binaural beats) that generate calm soundscapes entirely on-device with zero network latency.',
    },
    {
      q: 'How does the EchoBloom Lenient Phonetic scoring algorithm work?',
      a: 'Rather than penalizing non-standard speech or demanding dictionary-exact pronunciation, EchoBloom evaluates genuine acoustic effort and phoneme approximations (e.g., rewarding "Wuh" for "Water") to encourage expressive confidence without frustration.',
    },
    {
      q: 'What is the Carol Gray Social Story formula used in Module B?',
      a: 'Stories follow Carol Gray’s clinical formula with 4 specific sentence types: Descriptive (factual environment), Perspective (how others feel), Directive/Affirmative (reassuring positive coping choice), and Cooperative/Resolution (available support and positive closure).',
    },
    {
      q: 'How is user medical and behavioral data protected?',
      a: 'SpectrumOS stores data locally in encrypted SQLite/IndexedDB on the client device. Caregivers can export backups as JSON files with complete data ownership.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--text-primary)]">
          Clinical Guidance & Technology FAQ
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-color)]/80'
              }`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-[var(--text-primary)]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--accent-primary)] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-color)]/60 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
