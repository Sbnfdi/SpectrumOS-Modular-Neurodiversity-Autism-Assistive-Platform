# SpectrumOS 🌐🧩
### Modular Neurodiversity & Autism Assistive Platform

> **Adaptive, offline-first Progressive Web Application (PWA) designed to support autistic children, adolescents, adults, and their caregivers across every developmental stage.**

---

## 🌟 Foundational Clinical Grounding
* **Neurodiversity-Affirming Principle:** Autism is a lifelong neurodevelopmental difference, not a curable disease. All features focus on communication, sensory regulation, executive functioning, and independence—never "masking" or forced neurotypical compliance.
* **Sensory-First Ergonomics:** Interfaces prevent cognitive and sensory overload. No erratic animations, intrusive popups, harsh color contrasts, or punishing error states.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router) + React 18** | Modern, responsive, accessible web foundation |
| **Styling & Design System** | **Tailwind CSS + CSS Variables** | Sensory themes (Calm Blue, Warm Sand, Forest Mist, Dark, High Contrast) |
| **State Management** | **Zustand** | Lightweight reactive sensory & audio mode management |
| **Database & Edge Sync** | **Turso (libSQL / SQLite) via Drizzle ORM** | Embedded local SQLite database with edge cloud sync & offline fallback |
| **Audio Processing** | **Web Audio API** | Real-time mic pitch/amplitude visualizer, Brown noise, Theta binaural beats |
| **Voice & Speech** | **Web Speech API** | Predictable, soothing Text-to-Speech (TTS) & speech recognition |
| **AI Assistive Engines** | **Vision API + LLMs (GPT-4o / Claude / Heuristics)** | Context-aware AAC, Carol Gray Social Stories, Subtext Decoding |

---

## 🧩 Modular Features by Developmental Stage

### 🧸 Module A: Early Childhood (Ages 2–7)
1. **Context-Aware Dynamic AAC (Augmentative Communication):**
   - Camera snapshots / environment tags dynamically surface a 6-tile communication grid (e.g. *"Too Loud"*, *"Water"*, *"Bathroom"*, *"Break"*).
   - Single-tap spoken output with zero nested folder fatigue.
2. **EchoBloom (Lenient Phonetic Voice Gamification):**
   - Listens via microphone with Web Audio API.
   - Evaluates vocal effort over dictionary perfection (e.g., rewarding *"Wuh"* for *"Water"*).
   - Visual reward loops: Blooming flowers, connecting steam train tracks, and floating bioluminescent bubbles.
3. **Emergency Calm (SOS Meltdown Tool):**
   - One-touch caregiver/individual activation.
   - Locks UI into full-screen low-frequency sensory grounding (4-4-4-4 box breathing visualizer, soothing brown noise, caregiver hold-to-unlock bypass).

---

### 🎒 Module B: School Age (Ages 8–12)
1. **Carol Gray Compliant Social Story Generator:**
   - 4-step structured story generator (Descriptive, Perspective, Directive/Affirmative, Cooperative sentences) for unexpected transitions (e.g., *"Dentist visit"*, *"Fire drill"*, *"Substitute teacher"*).
   - Audio read-aloud per step with sensory coping strategies and print mode.
2. **Gamified Visual Routine Sequencer:**
   - Step-by-step checklist for morning, school, and bedtime routines.
   - Non-stressful SVG visual countdown pie-timer (no anxiety-inducing digital numbers).

---

### 🧭 Module C: Adolescence & Adulthood (Ages 13+)
1. **Tone & Subtext Decoder:**
   - Parses ambiguous emails, Slack messages, and neurotypical subtext.
   - Extracts `Literal Meaning`, `Subtext & Emotional Tone` (urgency, politeness, sarcasm ratings), and drafts 3 customized responses (Formal, Casual, Boundary-Setting).
2. **Executive Functioning Breakdown Engine:**
   - Converts overwhelming tasks (e.g., *"Clean your apartment"*) into atomic 2-minute non-threatening single actions.
   - 1-task-at-a-time focus mode with sensory friction reducers.

---

### ⚙️ Caregiver & Clinical Sync Hub
- Multi-profile management (Leo, Maya, Sam).
- Sensory sensitivity tagging & accommodation thresholds.
- Drizzle SQLite speech attempt tracking and routine analytics.
- Offline-first configuration with edge sync capabilities.

---

## 🚀 Quick Start & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/SpectrumOS.git
cd SpectrumOS

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000 (or http://localhost:3001)
```

---

## 📄 License
MIT License - Neurodiversity-Affirming Open Assistive Software.
