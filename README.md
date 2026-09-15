# Synapse — Active Recall & Study Assistant

Built for the FLAM AI technical assessment. Synapse is a study tool designed to turn unstructured notes and study text into active recall flashcards and practice quizzes, featuring keyboard-driven navigation, weak-point remediation, and offline mock support.

---

## Table of Contents
1. [Overview & Core Features](#overview--core-features)
2. [System Architecture](#system-architecture)
3. [Setup & Local Development](#setup--local-development)
4. [Offline Mock Mode](#offline-mock-mode)
5. [AI Pipeline & Error Recovery](#ai-pipeline--error-recovery)
6. [Design System & Accessibility](#design-system--accessibility)
7. [Web Audio Synthesizer](#web-audio-synthesizer)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Testing & Verification](#testing--verification)
10. [AI Usage Disclosure](#ai-usage-disclosure)
11. [Engineering Time Breakdown](#engineering-time-breakdown)
12. [Roadmap & Limitations](#roadmap--limitations)

---

## Overview & Core Features

Synapse converts raw study notes into structured decks using schema-enforced LLM synthesis, backed by local storage and keyboard-first workflows.

### Key Features
- **Multi-Provider AI Pipeline**: Primary generation through Groq (Llama 3.3 70B Versatile), fallback to OpenAI (GPT-4o-mini), and a zero-latency offline mock mode.
- **3D Active Recall Flashcards**: CSS perspective card flip interface with spring physics, progressive hints, and self-assessment tagging (Mastered vs. Review).
- **Multiple-Choice Quiz Engine**: 4-option questions with generated distractors, instant answer validation, conceptual explanations, and full keyboard selection.
- **Targeted Weak-Point Retesting**: Automatically isolates incorrectly answered questions and flagged flashcards into a focused practice queue until resolved.
- **Command Palette (Cmd+K / Ctrl+K)**: System-wide command dialog supporting fuzzy search, category filtering, and direct action execution.
- **Synthesized Web Audio**: Lightweight Web Audio API synthesizer for tactile auditory feedback on flips, correct/incorrect selections, and session completion, with persistent mute control.
- **Deck History & Local Persistence**: Browser-local deck storage with restoration, search, and quota handling.
- **Export Options**: Export decks to structured Markdown or Anki-compatible TSV format.

---

## System Architecture

```
+----------------------------------------------------------------------------------------+
|                                CLIENT BROWSER (Next.js 14)                             |
+------------------------+-----------------------------+---------------------------------+
|    Input Controller    |     Study Workspace         |        Persistence & Audio      |
|  - PromptInput         |  - 3D FlashcardDeck         |  - LocalStorage Engine          |
|  - Topic Presets       |  - Interactive QuizEngine   |  - Web Audio Synthesizer        |
|  - useAIGenerate Hook  |  - Remediation RetestEngine |  - Command Palette (Cmd+K)      |
+-----------+------------+--------------+--------------+----------------+----------------+
            | AbortController &         | Keyboard Hotkeys              | Mute Sync &
            | Request Tracking          | (Space, 1-4, M, R, ?)         | Export Handlers
            v                           v                               v
+----------------------------------------------------------------------------------------+
|                       SERVERLESS AI PIPELINE (/api/generate)                           |
+------------------------+-----------------------------+---------------------------------+
|   Request Sanitizer    |      LLM Orchestration      |   Resilience & Normalization    |
|  - Char validation     |  - Groq LLaMA 3.3 70B       |  - Markdown fence stripper      |
|  - System Prompt Form  |  - OpenAI GPT-4o-mini       |  - jsonrepair AST recovery      |
|  - Low Temperature     |  - Deterministic Mock Mode  |  - Zod Schema & ID Injection    |
+------------------------+-----------------------------+---------------------------------+
```

### Request Flow
1. User submits text via `PromptInput`, triggering `useAIGenerate` with an `AbortController` to cancel any inflight requests.
2. The `/api/generate` route queries Groq with strict JSON output formatting.
3. Raw output passes through a markdown stripper, AST-level repair (`jsonrepair`), and Zod schema validation with automatic ID generation.
4. The client receives validated data, saves the deck to `localStorage`, and updates UI state.

---

## Setup & Local Development

### Prerequisites
- Node.js 18.17.0+ or 20.x
- npm 9.x+ or 10.x

### Installation
```bash
git clone https://github.com/sanket9673/SynapseAI.git
cd Synapse
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

Set your configuration in `.env.local`:
```env
# Primary Provider: "groq", "openai", or "mock"
AI_PROVIDER=groq

# Groq API Key (https://console.groq.com)
GROQ_API_KEY=gsk_your_key_here

# OpenAI API Key (Optional secondary fallback)
OPENAI_API_KEY=sk_your_key_here
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:4000](http://localhost:4000) (or configured port) in your browser.

---

## Offline Mock Mode

To run Synapse without API keys or network dependencies:

### Via Environment Variable
In `.env.local`:
```env
AI_PROVIDER=mock
```
Generations will immediately return deterministic, topic-matched study sets (e.g., Neuroscience, Machine Learning, Cellular Biology) in ~100ms.

### Via In-App Toggle / Fallback
- Toggle the **Offline Mock** switch directly on the input card.
- If upstream API calls fail or hit rate limits (429), the error screen presents a direct one-click fallback to mock mode.

---

## AI Pipeline & Error Recovery

To prevent failures caused by imperfect model outputs, the pipeline uses a defensive multi-step repair strategy:

1. **Markdown Fence Stripping**: Cleans leading ```` ```json ```` and trailing ```` ``` ```` tags or accidental commentary text.
2. **AST JSON Repair (`jsonrepair`)**: Resolves syntax errors such as missing commas, unescaped quotes, trailing brackets, and half-closed objects.
3. **Zod Strict Validation**: Validates the payload structure against `StudySetZodSchema` (minimum 2 flashcards, minimum 1 quiz question with 4 options and valid index).
4. **Heuristic Self-Healing**:
   - Converts non-numeric option markers to integer indices (0-3).
   - If a quiz question has fewer than 4 options, pads it with standard fallback choices (e.g. "None of the above").
   - Clamps out-of-bounds indices safely to valid options.
5. **UUID & Timestamp Injection**: Automatically generates missing UUIDs and creation timestamps if omitted by the model.

---

## Design System & Accessibility

- **Palette**: Dark canvas (`#090A0F`), surface layers (`#11131A`), border definitions, and subtle indigo accents (`#6366F1`).
- **Typography**: `Inter` for body copy paired with `JetBrains Mono` for metadata, keyboard hints, and tags.
- **Dynamic OS Key Hints**: Automatically detects user OS and renders native modifiers (`Cmd` on macOS/iOS, `Ctrl` on Windows/Linux).
- **Focus & ARIA**: Visible focus rings with high-contrast offsets, descriptive labels, and standard dialog/tablist landmarks.

---

## Web Audio Synthesizer

The client audio engine in `src/lib/sound.ts` uses the browser Web Audio API:
- **Autoplay Handling**: Initializes and resumes `AudioContext` upon the first user interaction.
- **Volume**: Gain levels are capped between `0.08` and `0.15` for subtle, non-distracting feedback.
- **Audio Cues**:
  - `playFlip()`: Short filtered noise burst simulating a card turn.
  - `playCorrect()`: Ascending two-tone chime (587Hz to 880Hz).
  - `playIncorrect()`: Low descending tone (220Hz to 160Hz).
  - `playComplete()`: Four-note chord (C5, E5, G5, C6).
- **Mute Control**: Persisted to `localStorage` under `synapse_audio_muted` and toggleable in the header or command palette.

---

## Keyboard Shortcuts

| Context | Shortcut (Mac) | Shortcut (Windows/Linux) | Action |
| :--- | :--- | :--- | :--- |
| Global | Cmd + K | Ctrl + K | Open Command Palette |
| Global | ? | ? | Open Keyboard Shortcuts Reference |
| Global | Cmd + Enter | Ctrl + Enter | Generate Study Set from Text |
| Global | Esc | Esc | Close Dialogs / Drawers |
| Flashcards | Space | Space | Flip Current Flashcard |
| Flashcards | Right / Left Arrow | Right / Left Arrow | Next / Previous Card |
| Flashcards | M | M | Mark as Mastered |
| Flashcards | R | R | Mark for Review |
| Flashcards | I | I | Reveal Hint |
| Quiz | 1 - 4 or A - D | 1 - 4 or A - D | Select Option |
| Quiz | Enter | Enter | Submit Answer / Next Question |

---

## Testing & Verification

The project includes unit and integration tests covering UI primitives, AI parsing, generation hooks, storage, and retest workflows.

### Commands
```bash
# Run unit and integration tests
npm test

# Run TypeScript type check
npm run typecheck

# Run linter
npm run lint

# Run production build
npm run build
```

---

## AI Usage Disclosure

In line with assessment requirements, AI tools were utilized during development:

| Area | Tooling | Usage Details |
| :--- | :--- | :--- |
| Boilerplate & Types | Antigravity IDE / Claude | Generating initial TypeScript interfaces and baseline Tailwind configurations. |
| Regex & Normalization | Antigravity IDE | Regex pattern drafts for markdown fence stripping and TSV formatting. |
| Edge Case Payloads | Antigravity IDE | Creating test fixtures for truncated JSON and schema edge cases. |
| Core Logic & Architecture | Manual Engineering | Component state machines, spring physics configuration, Web Audio oscillator curves, weakness queue logic, and multi-provider fallback. |

---

## Engineering Time Breakdown

Total Time: ~7.5 Hours

| Phase | Duration | Focus Areas |
| :--- | :--- | :--- |
| 1. Scaffolding & Design Primitives | ~45 mins | Next.js 14 setup, Tailwind tokens, base UI primitive suite |
| 2. AI Pipeline & Normalization | ~60 mins | Route handler, Groq/OpenAI orchestration, jsonrepair, Zod validation |
| 3. Input Controller & Skeletons | ~40 mins | PromptInput, character budget, topic presets, loading states |
| 4. 3D Flashcard Deck & Physics | ~55 mins | Perspective transforms, spring physics, keyboard bindings |
| 5. Quiz Engine & Scoring | ~50 mins | 4-option question layout, instant feedback, explanation views |
| 6. Weak-Point Remediation Loop | ~60 mins | Error collection, retest state machine, queue drain logic |
| 7. Local Persistence & Export | ~50 mins | LocalStorage engine, history drawer, Markdown/TSV exporters |
| 8. Command Palette & Web Audio | ~45 mins | Cmd+K dialog, fuzzy search, Web Audio oscillator synthesis |
| 9. Testing & Documentation | ~45 mins | Vitest test suites, type checking, README documentation |

---

## Roadmap & Limitations

Key improvements planned for subsequent iterations:

1. **Streaming Output**: Stream flashcards incrementally using SSE / AI SDK.
2. **Spaced Repetition Scheduling**: Integrate FSRS or SM-2 algorithms for scheduled multi-day review intervals.
3. **Cloud Synchronization**: User accounts and database-backed cross-device syncing.
4. **Document Ingestion**: Support direct PDF, EPUB, and YouTube transcript imports.
