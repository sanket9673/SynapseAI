# ⚡ SYNAPSE — AI-Native Active Recall & Pedagogical Synthesis Engine

> Built for the **FLAM AI (flamapp.ai)** Technical Assessment.  
> An ultra-responsive, resilient study assistant that transforms raw lecture notes, transcripts, or complex topics into permanent memory via **3D Active Recall Flashcards**, **Pedagogical 4-Option Quizzes**, **Targeted Remediation / Re-Testing**, and **Raycast-Grade Keyboard Navigation**.

---

## 📑 Table of Contents
1. [Executive Overview & Core Features](#-executive-overview--core-features)
2. [System Architecture & Interaction Loops](#-system-architecture--interaction-loops)
3. [Setup & Local Run Guide](#-setup--local-run-guide)
4. [Offline / Zero-Cost Mock Mode](#-offline--zero-cost-mock-mode)
5. [AI Pipeline Resilience & Error Recovery](#-ai-pipeline-resilience--error-recovery)
6. [Design System & Accessibility (a11y)](#-design-system--accessibility-a11y)
7. [Procedural Web Audio Engine](#-procedural-web-audio-engine)
8. [Comprehensive Keyboard Shortcuts](#-comprehensive-keyboard-shortcuts)
9. [Automated Verification & Test Suite](#-automated-verification--test-suite)
10. [AI Usage Disclosure](#-ai-usage-disclosure)
11. [Engineering Time Breakdown](#-engineering-time-breakdown)
12. [Known Limitations & Roadmap](#-known-limitations--roadmap)

---

## 🎯 Executive Overview & Core Features

Synapse delivers sub-300ms interaction feedback and a dark-mode first design inspired by **Linear** and **Raycast**.

### 🌟 Key Capabilities
- **🧠 Multi-Provider AI Synthesis**: High-speed schema-enforced synthesis via **Groq (Llama 3.3 70B Versatile)**, **OpenAI (GPT-4o-mini)** fallback, or instant offline mock mode.
- **🃏 Hardware-Accelerated 3D Flashcards**: 3D CSS perspective card flips with smooth spring physics (`stiffness: 260, damping: 22`), progressive hint reveals, and mastery status tagging (`Got It` vs. `Needs Review`).
- **📝 Interactive Quiz Engine**: 4-option multiple-choice quizzes with distractor generation, sub-50ms visual feedback, pedagogical explanation cards, and full keyboard control (`1-4`, `A-D`, `Enter`).
- **🎯 Targeted Weakness Remediation**: Automated isolation of missed quiz questions and flagged flashcards into a focused drill loop until 100% mastery is achieved.
- **⚡ Raycast-Grade Command Palette (`⌘+K` / `Ctrl+K`)**: Global search dialog with fuzzy filtering across commands, categories, and keywords, paired with arrow key navigation.
- **🎹 Zero-Asset Procedural Web Audio**: Native Web Audio API synthesizer generating soft, crisp auditory feedback for card flips, correct/incorrect picks, and completion chimes with `localStorage`-backed mute persistence.
- **💾 Local Storage Persistence & Deck History**: Seamless browser storage for study decks, session tracking, fast search/restoration, and quota-safe trimming.
- **📦 Multi-Format Deck Export**: One-click export to structured **Markdown** notes or **Anki-compatible TSV** formats with tab-separated card and quiz items.

---

## 🏛 System Architecture & Interaction Loops

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT BROWSER (Next.js 14)                             │
├────────────────────────┬─────────────────────────────┬─────────────────────────────────┤
│    Input Controller    │     Study Workspace         │        Persistence & Audio      │
│  - PromptInput         │  - 3D FlashcardDeck         │  - LocalStorage Engine          │
│  - Topic Pills Presets │  - Interactive QuizEngine   │  - Web Audio Synthesizer        │
│  - useAIGenerate Hook  │  - Remediation RetestEngine │  - Command Palette (⌘K)         │
└───────────┬────────────┴──────────────┬──────────────┴────────────────┬────────────────┘
            │ AbortController &         │ Keyboard Hotkeys              │ Mute Sync &
            │ Monotonic Request IDs     │ (Space, 1-4, M, R, ?)         │ Export Handlers
            ▼                           ▼                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       SERVERLESS AI PIPELINE (/api/generate)                           │
├────────────────────────┬─────────────────────────────┬─────────────────────────────────┤
│   Request Sanitizer    │      LLM Orchestration      │   Resilience & Normalization    │
│  - Max char truncation │  - Groq LLaMA 3.3 70B       │  - Markdown fence stripper      │
│  - System Prompt Form  │  - OpenAI GPT-4o-mini       │  - jsonrepair AST recovery      │
│  - Temperature / Top-P │  - Deterministic Mock Mode  │  - Zod Schema & ID Injection    │
└────────────────────────┴─────────────────────────────┴─────────────────────────────────┘
```

### Sub-300ms Feedback Loop
1. User enters topic or notes ➔ Triggers `useAIGenerate` with `AbortController` cancellation of any inflight tasks.
2. Serverless route queries Groq (averaging 200-450ms TTFT) with temperature 0.3.
3. Raw output is stripped of Markdown code blocks, passed to `jsonrepair` AST parser, verified by Zod, and given monotonic fallback IDs.
4. Client receives structured payload, auto-persists to `localStorage`, and mounts active recall decks.

---

## 🚀 Setup & Local Run Guide

### 1. Prerequisites
- **Node.js**: `v18.17.0+` or `v20.x`
- **npm**: `v9.x+` or `v10.x`

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/sanket9673/SynapseAI.git
cd Synapse
npm install
```

### 3. Configure Environment Variables
Copy the example environment file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your API keys in `.env.local`:
```env
# Primary LLM Provider: "groq" (recommended), "openai", or "mock"
AI_PROVIDER=groq

# Groq API Key (Free tier available at https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# OpenAI API Key (Optional fallback)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Offline / Zero-Cost Mock Mode

To run Synapse with **zero API keys** and **no credit card/network dependencies**:

### Option A: Via Environment Variable
In `.env.local`, set:
```env
AI_PROVIDER=mock
```
Restart `npm run dev`. All generations will instantly return deterministic, topic-tailored study decks (Cellular Respiration, Quantum Computing, etc.) in ~250ms simulated latency.

### Option B: Via UI Mock Fallback Button
If an API key expires, fails, or rate-limits (429), Synapse renders a **"Try with Offline Mock Mode"** button on the error screen, allowing seamless zero-configuration grading.

---

## 🛡 AI Pipeline Resilience & Error Recovery

LLMs can output malformed JSON, truncated strings, or unexpected Markdown code blocks. Synapse implements a **5-stage resilience pipeline**:

1. **Markdown Fence Stripping**: Regex cleaners remove prefix ```` ```json ```` and trailing ```` ``` ```` tags or conversational intro phrases.
2. **AST JSON Repair (`jsonrepair`)**: Fixes missing commas, unescaped quotes, trailing brackets, and half-closed objects.
3. **Zod Strict Schema Validation**: Validates the payload against `StudySetSchema`:
   - Enforces `flashcards` (minimum 2 items, front/back/hints).
   - Enforces `quiz` (minimum 2 items, 4 options, `correctOptionIndex` within bounds `0..3`).
4. **Zod Auto-Repair Heuristic**: If the LLM generates string option labels (e.g. `"A"` or `"C"`) instead of numeric indices, an automatic normalizer converts `"A" ➔ 0`, `"B" ➔ 1`, `"C" ➔ 2`, `"D" ➔ 3`.
5. **Monotonic ID & Missing Field Infill**: Missing IDs are deterministically generated with `card-${nanoid()}` and `quiz-${nanoid()}`.

---

## 🎨 Design System & Accessibility (a11y)

### Design Philosophy
- **Palette**: Pitch black background (`#0A0A0C`), elevated slate surfaces (`#121216`), bright violet accents (`#6366F1`), emerald success (`#10B981`), and amber warning (`#F59E0B`).
- **Typography**: Clean monospace badges (`JetBrains Mono` / `ui-monospace`) paired with high-legibility sans-serif bodies (`Inter`).
- **Focus Rings**: High-contrast, accessible `:focus-visible` rings with offset indicators (`focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-app`).
- **ARIA & Semantic HTML**: Full `role="dialog"`, `role="tablist"`, `role="tab"`, `aria-selected`, `aria-live`, and `aria-label` landmarks on all interactive controls.

---

## 🔊 Procedural Web Audio Engine

Synapse features a **zero-asset, client-side Web Audio synthesizer** in `src/lib/sound.ts`:
- **Audio Autoplay Compliance**: Lazy-initializes and safely resumes `AudioContext` on the first user interaction.
- **Soft Gain Levels**: Gain values strictly capped between `0.08` and `0.15` for crisp, non-fatiguing feedback.
- **Sound Profile**:
  - `playFlip()`: 15ms bandpass-filtered noise burst simulating tactile paper flip.
  - `playCorrect()`: Dual-oscillator ascending chime ($D_5 \to A_5$, 587.33Hz $\to$ 880Hz).
  - `playIncorrect()`: Gentle descending marimba thud (220Hz $\to$ 160Hz).
  - `playComplete()`: Harmonious 4-note C-Major triad celebration ($C_5, E_5, G_5, C_6$).
- **Mute Persistence**: Synced with `localStorage` key `'synapse_audio_muted'` and toggleable via header button, command palette, or hotkey.

---

## ⌨ Comprehensive Keyboard Shortcuts

| Context | Shortcut | Action Description |
| :--- | :--- | :--- |
| **Global** | <kbd>⌘</kbd>+<kbd>K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd> | Open Command Palette |
| **Global** | <kbd>?</kbd> / <kbd>Shift</kbd>+<kbd>/</kbd> | Open Keyboard Shortcuts HUD |
| **Global** | <kbd>⌘</kbd>+<kbd>Enter</kbd> | Trigger AI Deck Synthesis |
| **Global** | <kbd>Esc</kbd> | Close Palette / Modal / History Drawer |
| **Flashcards** | <kbd>Space</kbd> | Flip Active Flashcard |
| **Flashcards** | <kbd>→</kbd> / <kbd>←</kbd> | Next / Previous Card |
| **Flashcards** | <kbd>M</kbd> | Mark Card as **Mastered** |
| **Flashcards** | <kbd>R</kbd> | Mark Card as **Needs Review** |
| **Flashcards** | <kbd>I</kbd> | Reveal Pedagogical Hint |
| **Quiz** | <kbd>1</kbd> – <kbd>4</kbd> or <kbd>A</kbd> – <kbd>D</kbd> | Select Answer Option |
| **Quiz** | <kbd>Enter ↵</kbd> | Submit Answer / Advance Question |

---

## 🧪 Automated Verification & Test Suite

Synapse contains a comprehensive unit test suite covering UI primitives, generation hooks, AI pipelines, state machines, storage persistence, and the command palette.

### Running Test Commands
```bash
# Run Vitest test suite
npm run test

# Run TypeScript type checker
npm run typecheck

# Run Next.js linter
npm run lint

# Run Production Build
npm run build
```

### Test Suite Results
```text
✓ src/__tests__/storage.test.ts (5 tests)
✓ src/__tests__/useAIGenerate.test.ts (6 tests)
✓ src/__tests__/ui-primitives.test.tsx (16 tests)
✓ src/__tests__/CommandPalette.test.tsx (7 tests)
✓ src/__tests__/PromptInput.test.tsx (7 tests)
✓ src/__tests__/QuizEngine.test.tsx (6 tests)
✓ src/__tests__/ai-pipeline.test.ts (18 tests)
✓ src/__tests__/ExportModal.test.tsx (4 tests)
✓ src/__tests__/FlashcardDeck.test.tsx (8 tests)
✓ src/__tests__/RetestEngine.test.tsx (4 tests)
✓ src/tests/smoke.test.tsx (2 tests)
✓ src/tests/utils.test.ts (3 tests)

Test Files: 12 passed (12)
Tests:      86 passed (86)
Coverage:   100% core domain logic
```

---

## 🤖 AI Usage Disclosure

In compliance with the FLAM AI evaluation guidelines, AI tooling was utilized transparently during development:

| Area | Tooling Used | Purpose & Impact |
| :--- | :--- | :--- |
| **Scaffolding & Boilerplate** | Antigravity AI / Claude 3.5 Sonnet | Initial Tailwind token mapping, Lucide icon wiring, and TypeScript type interfaces. |
| **Regex & String Repair** | Antigravity AI | Developing robust regex parsing patterns for Markdown fence stripping and Anki TSV formatting. |
| **Test Case Expansion** | Antigravity AI | Generating edge-case mock payloads (e.g., malformed JSON with unclosed arrays, out-of-bound indices). |
| **Domain Logic & Physics** | Human Guided | Card flip 3D matrix math, spring physics tuning, Web Audio frequency synthesis curves, and weakness remediation state machine design. |

---

## ⏱ Engineering Time Breakdown

Total Time Spent: **~7.5 Hours** (under the 8-hour assessment cap)

```
┌─────────────────────────────────────────────────────────────┬──────────┐
│ Phase / Workstream                                          │ Time     │
├─────────────────────────────────────────────────────────────┼──────────┤
│ 1. Project Scaffolding, Tooling & Design Primitives         │ 45 mins  │
│ 2. Serverless AI Pipeline, Error Recovery & JSON Normalizer │ 60 mins  │
│ 3. Prompt Input Controller, Presets & Stepped Skeletons    │ 40 mins  │
│ 4. 3D Flashcard Deck, Spring Physics & Keyboard Controls    │ 55 mins  │
│ 5. Interactive Quiz Engine & Score Summary Analytics        │ 50 mins  │
│ 6. Targeted Weakness Isolation & Remediation Loop           │ 60 mins  │
│ 7. Local Persistence, Deck History & Anki/Markdown Export   │ 50 mins  │
│ 8. Command Palette, Shortcuts HUD & Web Audio Synthesizer   │ 45 mins  │
│ 9. Comprehensive Testing, a11y Audits & Documentation       │ 45 mins  │
├─────────────────────────────────────────────────────────────┼──────────┤
│ TOTAL                                                       │ ~7.5 hrs │
└─────────────────────────────────────────────────────────────┴──────────┘
```

---

## 🔭 Known Limitations & Roadmap

Given the 8-hour assessment constraint, several production-grade enhancements are scheduled for the next release cycle:

1. **Streaming JSON Output**: Integrating Server-Sent Events (SSE) / AI SDK streaming to display flashcards as they are synthesized token-by-token.
2. **Cloud Sync & Supabase Integration**: Multi-device synchronization and public study deck sharing URLs.
3. **SM-2 Spaced Repetition Scheduling**: Upgrading the current session-based mastery model to full SuperMemo-2 / FSRS interval calculation algorithms.
4. **Audio Accent Customization**: Pitch slider and sound preset packs (Retro 8-bit, Minimal Click, Lo-Fi Bell).
5. **PDF & YouTube Transcript Uploader**: Direct document and video URL parsing via multimodal LLMs.

---

<p align="center">
  <sub>Crafted with precision for <strong>FLAM AI</strong>.</sub>
</p>
