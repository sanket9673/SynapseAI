# Synapse — AI-Native Active Recall & Study Assistant

[![Tests](https://img.shields.io/badge/Tests-86%20Passing-brightgreen.svg)](https://github.com/sanket9673/SynapseAI)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%200%20Errors-blue.svg)](https://github.com/sanket9673/SynapseAI)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black.svg)](https://nextjs.org/)
[![Design System](https://img.shields.io/badge/Design-Dayos%20Brutalist%20Showroom-f3f3f3.svg)](https://github.com/sanket9673/SynapseAI)

> **Built for the FLAM AI Technical Assessment.**  
> Synapse is an AI-native active recall study platform that synthesizes unstructured notes, transcripts, and complex articles into interactive 3D flashcards and pedagogical quiz assessments in seconds. Featuring weak-point remediation loops, Raycast-grade Command Palette (`⌘K`), procedural Web Audio micro-haptics, local session persistence, and full export capabilities.

---

## 🔗 Submission Links

- **GitHub Repository**: [https://github.com/sanket9673/SynapseAI](https://github.com/sanket9673/SynapseAI)
- **Live Deployment**: [https://synapse-ai-study.vercel.app](https://synapse-ai-study.vercel.app) *(or your deployed Vercel URL)*
- **AI Usage Disclosure**: See [AI_USAGE.md](AI_USAGE.md) for a comprehensive disclosure of AI tooling and verification methodologies.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [System Architecture & Security](#-system-architecture--security)
3. [Setup & Local Development](#-setup--local-development)
4. [Offline Mock Mode (Zero Latency / Keyless)](#-offline-mock-mode-zero-latency--keyless)
5. [Defensive AI Normalization & Error Recovery](#-defensive-ai-normalization--error-recovery)
6. [Design System: Dayos Brutalist Editorial Showroom](#-design-system-dayos-brutalist-editorial-showroom)
7. [Procedural Web Audio Engine](#-procedural-web-audio-engine)
8. [Keyboard Shortcuts Matrix](#-keyboard-shortcuts-matrix)
9. [Automated Testing & Verification](#-automated-testing--verification)
10. [Honest AI Usage Disclosure](#-honest-ai-usage-disclosure)
11. [Engineering Time Breakdown (~8 Hours)](#-engineering-time-breakdown-8-hours)
12. [Known Limitations & Roadmap](#-known-limitations--roadmap)

---

## 🌟 Key Features

- **Multi-Provider Resilient AI Pipeline**: Primary inference through ultra-low latency Groq (LLaMA 3.3 70B / GPT OSS 120B) with automatic fallback to OpenAI (GPT-4o-mini) and zero-dependency deterministic Mock Mode.
- **Hardware-Accelerated 3D Flashcards**: True CSS 3D perspective transforms with spring flip physics, progressive hint disclosure, and mastery telemetry (`Mastered` vs. `Needs Review`).
- **Pedagogical 4-Option Quiz Engine**: Dynamic distractor generation, sub-50ms visual verification, conceptual rationale breakdowns, and hotkey selection (`1`-`4` / `A`-`D`).
- **Targeted Weak-Point Remediation (`RetestMode`)**: Automatically isolates missed quiz questions and flagged flashcards into a focused remediation drill that updates mastery metrics in real-time until 100% completion.
- **Raycast-Grade Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across actions, navigation tabs, audio settings, and deck operations with keyboard traversal.
- **Procedural Web Audio Micro-Haptics**: Zero-asset procedural oscillator synthesizer for tactile audio cues (flip tick, correct chime, incorrect thud, victory chord) with persistent mute control.
- **Local Persistence & Session Drawer (`⌘H`)**: Browser `localStorage` engine with quota guards, deck search, and instant session restoring.
- **Dual Format Export (`⌘E`)**: One-click export to clean GitHub-flavored Markdown or Anki-compatible TSV format.

---

## 🏛️ System Architecture & Security

```
+-----------------------------------------------------------------------------------------+
|                                CLIENT BROWSER (Next.js 14)                              |
+------------------------+-----------------------------+----------------------------------+
|    Input Controller    |       Study Workspace       |        Persistence & Audio       |
|  - PromptInput         |  - 3D FlashcardDeck         |  - LocalStorage Engine           |
|  - Topic Presets       |  - Interactive QuizEngine   |  - Web Audio Synthesizer         |
|  - useAIGenerate Hook  |  - Remediation RetestEngine |  - Command Palette (Cmd+K)       |
+-----------+------------+--------------+--------------+----------------+-----------------+
            | Monotonic Request IDs &   | Keyboard Hotkeys              | Mute Sync &
            | AbortController Signals   | (Space, 1-4, M, R, ?)         | Export Handlers
            v                           v                               v
+-----------------------------------------------------------------------------------------+
|                        SERVERLESS API LAYER (/api/generate)                             |
+------------------------+-----------------------------+----------------------------------+
|   Security & Sanitizer |      LLM Orchestration      |    Resilience & Normalization    |
|  - Server-side Keys    |  - Groq LLaMA 3.3 70B       |  - Markdown fence stripper       |
|  - Length/Input Bounds |  - OpenAI GPT-4o-mini       |  - jsonrepair AST recovery       |
|  - Zod Input Contract  |  - Deterministic Mock Mode  |  - Zod Schema & UUID Injection   |
+------------------------+-----------------------------+----------------------------------+
```

### Critical Architecture & Security Guarantees:
1. **Zero Client-Side API Key Exposure**: Third-party API keys (`GROQ_API_KEY`, `OPENAI_API_KEY`) are accessed strictly on the server-side Next.js route handler (`src/app/api/generate/route.ts`). Client code never touches or bundles sensitive credentials.
2. **Race-Condition Protection via Monotonic Request IDs & AbortController**: Fast successive prompt submissions or rapid button presses immediately trigger `abortControllerRef.current.abort()` and increment an internal monotonic request ID (`requestIdRef.current += 1`). Responses from canceled or stale requests are discarded before touching React state.
3. **Strict Zod Contract Validation**: Inbound and outbound payloads are validated using Zod schemas (`StudySetZodSchema`), ensuring the UI never receives undefined structures.

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js 18.17.0+ or 20.x
- npm 9.x+ or 10.x

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sanket9673/SynapseAI.git
cd SynapseAI
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Set your configuration in `.env.local`:
```env
# AI Provider: "mock" (offline test mode), "groq" (recommended), or "openai"
AI_PROVIDER=groq

# Groq API Key (https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# OpenAI API Key (Optional secondary fallback)
OPENAI_API_KEY=sk_your_openai_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the active port displayed in your terminal) in your browser.

---

## ⚡ Offline Mock Mode (Zero Latency / Keyless)

Synapse can be tested and evaluated with **zero network dependencies and zero API keys**:

- **Method A (Environment Variable)**: Set `AI_PROVIDER=mock` in `.env.local`. All generation requests return rich, topic-matched study sets in under 100ms.
- **Method B (In-App Toggle)**: Enable the **Offline Mock** toggle in the prompt card.
- **Method C (Automatic Rate-Limit Fallback)**: If upstream AI providers encounter a 429 rate limit or 504 timeout, the UI presents an instant one-click fallback button to load deterministic mock study materials.

---

## 🛡️ Defensive AI Normalization & Error Recovery

Large Language Models frequently produce non-deterministic formatting quirks, markdown wrapping, and malformed JSON. Synapse uses a 5-layer defensive pipeline to guarantee the application never crashes:

1. **Markdown Fence Stripping**: Regex removes leading ```` ```json ```` and trailing ```` ``` ```` code blocks, as well as conversational preambles.
2. **AST JSON Repair (`jsonrepair`)**: Resolves trailing commas, unescaped quotes, unclosed brackets, and truncated tokens at the abstract syntax tree level.
3. **Zod Strict Schema Validation**: Enforces exact data types (minimum 2 flashcards, minimum 1 quiz question with exactly 4 options and valid answer index).
4. **Heuristic Normalization & Self-Healing**:
   - Converts alphabetic option letters (`"A"`, `"B"`, `"C"`, `"D"`) and 1-indexed integers to 0-indexed numbers (`0`-`3`).
   - If a quiz item contains fewer than 4 choices, safely pads options with standard pedagogical distractors.
   - Clamps out-of-bounds indices safely to the closest valid option.
5. **Deterministic UUID & Timestamp Injection**: Injects unique identifiers and timestamps if omitted by the upstream model.

---

## 🎨 Design System: Dayos Brutalist Editorial Showroom

Synapse features a **Dayos / Linear / Vercel Brutalist Editorial Showroom** design language:

- **Warm Gray Canvas (`#e5e5e5`)**: Applied to the page background (`--color-warm-canvas`), distinguishing the workspace from a clinical pure white canvas.
- **Paper White Flat Surfaces (`#ffffff`)**: Cards, prompt inputs, flashcard faces, and dialogs sit with `24px` to `32px` border radius, **0 box shadows**, and **0 gradients**. Depth is achieved purely through surface contrast against the warm canvas.
- **Inverted Carbon Black Blocks (`#000000`)**: High-contrast filled action buttons, active tab pills, and inverted badge blocks.
- **Signature Chromatic Accents**:
  - **Mint Chip (`#d1ffca`)**: Category taxonomy tag pills (`rounded-[64px]`), active statuses, and mastery indicators.
  - **Voltage Yellow (`#fff100`)**: Targeted remediation focus badges, warning indicators, and micro-accents.
- **Typography**: Giant condensed uppercase display headings (`font-display`, line-height `0.9`, tight tracking) paired with neo-grotesque body copy and 12px monospace micro-labels.
- **Floating Top Nav Pill (`rounded-[48px]`)**: Centered top navigation capsule on `#ffffff` with quick command search (`⌘K`), sound toggles, and session history.

---

## 🔊 Procedural Web Audio Engine

Synapse includes a zero-asset procedural Web Audio synthesizer (`src/lib/sound.ts`):
- **Card Flip (`playFlip`)**: Filtered noise burst simulating a physical tactile card flip.
- **Correct Answer (`playCorrect`)**: High ascending two-tone major chime (587Hz → 880Hz).
- **Incorrect Answer (`playIncorrect`)**: Low descending minor tone (220Hz → 160Hz).
- **Session Complete (`playComplete`)**: 4-note ascending victory chord (C5, E5, G5, C6).
- **Volume & Mute**: Master volume clamped to non-fatiguing levels (`0.08`–`0.15`) with persistent mute state in `localStorage`.

---

## ⌨️ Keyboard Shortcuts Matrix

| Context | macOS Shortcut | Windows / Linux | Action |
| :--- | :--- | :--- | :--- |
| **Global** | `⌘ + K` | `Ctrl + K` | Open Command Palette |
| **Global** | `?` | `?` | Toggle Keyboard Shortcuts HUD |
| **Global** | `⌘ + Enter` | `Ctrl + Enter` | Synthesize Study Set from Text |
| **Global** | `Esc` | `Esc` | Close Modals / Drawers / Overlays |
| **Flashcards** | `Space` | `Space` | Flip Active Flashcard |
| **Flashcards** | `→` / `←` | `→` / `←` | Next / Previous Flashcard |
| **Flashcards** | `M` | `M` | Mark as Mastered |
| **Flashcards** | `R` | `R` | Mark for Review |
| **Flashcards** | `I` | `I` | Toggle Progressive Hint |
| **Quiz** | `1` - `4` or `A` - `D` | `1` - `4` or `A` - `D` | Select Quiz Option |
| **Quiz** | `Enter` | `Enter` | Submit Answer / Next Question |

---

## 🧪 Automated Testing & Verification

The repository contains an automated test suite across 12 test files:

```bash
# Run all 86 unit and integration tests
npm test

# Run TypeScript strict type-checking
npm run typecheck

# Run Next.js and ESLint code hygiene checks
npm run lint

# Compile production build
npm run build
```

### Test Suite Coverage:
- `src/__tests__/ui-primitives.test.tsx`: Button, Card, Badge, Kbd, Progress, Notice, Skeleton primitives.
- `src/__tests__/ai-pipeline.test.ts`: Zod schema validation, JSON fence stripping, AST repair, fallback orchestration.
- `src/__tests__/useAIGenerate.test.ts`: Request lifecycle, monotonic ID race protection, AbortController cancellation.
- `src/__tests__/FlashcardDeck.test.tsx`: 3D flip physics, keyboard navigation, mastery progress tracking.
- `src/__tests__/QuizEngine.test.tsx`: Multiple choice validation, score calculations, explanation rendering.
- `src/__tests__/RetestEngine.test.tsx`: Weakness isolation, targeted remediation state machine.
- `src/__tests__/storage.test.ts`: Deck persistence, retrieval, deletion, quota overflow safeguards.
- `src/__tests__/CommandPalette.test.tsx`: Fuzzy filtering, shortcut triggers, command execution.
- `src/__tests__/ExportModal.test.tsx`: Markdown and Anki TSV conversion and clipboard copying.

---

## 🤖 Honest AI Usage Disclosure

In compliance with the FLAM assessment instructions, AI tooling was leveraged transparently:

- **AI Acceleration**: Anthropic Claude (via Antigravity IDE) and OpenAI GPT-4o were utilized as pair-programming assistants for high-velocity scaffolding of TypeScript types, initial CSS styling blocks, and test case skeletons.
- **Human Engineering & Verification**: Core system architecture, race condition safeguards, Web Audio oscillator curves, AST repair pipelines (`jsonrepair` integration), and Dayos brutalist styling audits were designed, fact-checked, and verified by human engineering.
- **Detailed Audit**: Full itemized breakdown available in [AI_USAGE.md](AI_USAGE.md).

---

## ⏱️ Engineering Time Breakdown (~8 Hours)

Total Time Invested: **~7.5 - 8 Hours**

| Module / Milestone | Time Spent | Key Deliverables |
| :--- | :--- | :--- |
| **1. Scaffolding & Design Primitives** | ~45 mins | Next.js 14 App Router, Tailwind v4 theme, atomic UI components |
| **2. Resilient Serverless AI Pipeline** | ~60 mins | Route handler, Groq/OpenAI orchestration, `jsonrepair`, Zod schemas |
| **3. Input Controller & Skeletons** | ~40 mins | `PromptInput`, character counter, topic pill presets, step skeletons |
| **4. 3D Flashcard Deck & Physics** | ~55 mins | CSS 3D transforms, card flip spring physics, keyboard bindings |
| **5. Quiz Engine & Scoring Summary** | ~50 mins | 4-option randomized questions, instant validation, explanation view |
| **6. Weakness Remediation Loop** | ~60 mins | Mistake tracking, retest state machine, mastery recovery |
| **7. Local Storage & Deck Export** | ~50 mins | LocalStorage engine, session drawer, Markdown/Anki TSV exporters |
| **8. Command Palette & Web Audio** | ~45 mins | `⌘K` fuzzy command dialog, procedural audio synthesizer |
| **9. Dayos Brutalist Overhaul & Tests** | ~45 mins | Warm canvas redesign, 86 Vitest tests, strict TypeScript verification |

---

## 🔮 Known Limitations & Roadmap

Given the 8-hour assessment constraint, the following deliberate tradeoffs were made:

1. **Streaming Card Generation**: Decks are currently delivered atomically upon validation. *Next Step*: Implement Server-Sent Events (SSE) to stream flashcards progressively as they are generated.
2. **Spaced Repetition Algorithm (FSRS/SM-2)**: Mastery is currently session-based. *Next Step*: Implement SuperMemo-2 (SM-2) or Free Spaced Repetition Scheduler (FSRS) with persistent next-review date calculations.
3. **Cloud Synchronization**: Storage is currently browser-local (`localStorage`). *Next Step*: Add PostgreSQL + Supabase backend for multi-device sync and public deck sharing.
4. **Direct Document Ingestion**: Text is input via copy-paste. *Next Step*: Add direct drag-and-drop parsing for PDF, EPUB, and audio lecture recordings.

---

## 👤 Author

**Sanket Kisan Chavhan**  
- **GitHub**: [@sanket9673](https://github.com/sanket9673)  
- **Role**: Software Development Engineer (Frontend / AI-Native Applications)  
- **Assessment**: FLAM AI Technical Submission
