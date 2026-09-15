# AI Usage Disclosure & Engineering Methodology — Synapse

**Author:** Sanket Kisan Chavhan  
**Project:** Synapse — AI-Native Active Recall Study Assistant  
**Assessment:** FLAM AI Frontend Engineer Assessment  

---

## 1. Executive Summary & Transparency Commitment

In accordance with the FLAM assignment guidelines (*"Being honest about AI usage counts in your favor"*), this document provides a comprehensive, transparent disclosure of how AI tooling was utilized during the design, architecture, implementation, and verification of **Synapse**.

AI tools (specifically Anthropic Claude 3.5 Sonnet / Claude 3.7 Sonnet via Antigravity IDE and OpenAI GPT-4o) were treated as an **autonomous pair-programmer and high-velocity implementation engine**, while all architectural design, system safety invariants, state machine logic, and critical edge-case recovery strategies were actively verified, tested, and fact-checked by human engineering judgment.

---

## 2. Tooling & Environment

| Tool / Model | Primary Role | Scope of Contribution |
| :--- | :--- | :--- |
| **Antigravity IDE (Claude 3.5/3.7)** | Scaffold & Code Generation | TypeScript component implementation, Tailwind v4 tokens, AST regex utilities, Vitest suites. |
| **Groq (Llama 3.3 70B Versatile / GPT OSS 120B)** | Production Inference Engine | Dynamic, schema-constrained active recall deck and quiz generation in `/api/generate`. |
| **OpenAI (GPT-4o-mini)** | Secondary Provider Fallback | Automatic fallback when Groq hits 429 rate limits or upstream timeouts. |
| **Offline Deterministic Synthesizer** | Zero-Latency Mock Mode | Keyword-matched, pre-validated study decks for offline / keyless testing. |

---

## 3. Granular Breakdown by Component

### A. System Architecture & Safety Invariants (Human Directed)
- **Race Condition Guards**: Architected the monotonic integer request ID pattern (`requestIdRef.current += 1`) and `AbortController` cancellation in `useAIGenerate` to ensure that fast successive prompt submissions never cause stale state overwrites.
- **Serverless API Boundary**: Enforced that all third-party API keys (`GROQ_API_KEY`, `OPENAI_API_KEY`) remain strictly on the Next.js serverless route (`/api/generate`), never exposed to the client bundle or client-side storage.

### B. Defensive AI Normalization Pipeline (`src/lib/ai/parser.ts`)
- **AI Contribution**: Generated initial regex patterns for markdown code block stripping (```` ```json ```` fences) and boilerplated the Zod schema definitions.
- **Human Fact-Checking & Hardening**:
  1. Identified that LLMs frequently output trailing commas or truncated JSON tokens. Integrated `jsonrepair` AST parsing to recover malformed payloads before passing to Zod.
  2. Caught an edge case where LLMs returned option letters (`"A"`, `"B"`, `"C"`, `"D"`) or 1-indexed integers instead of zero-indexed numbers (`0`, `1`, `2`, `3`). Added a heuristic normalizer:
     ```typescript
     if (typeof rawIdx === "string") {
       const mapped = { A: 0, B: 1, C: 2, D: 3 }[rawIdx.toUpperCase()];
       if (mapped !== undefined) return mapped;
     }
     ```
  3. Added padding logic to ensure that quiz questions with fewer than 4 options are safely padded with plausible standard distractors without throwing unhandled exceptions.

### C. Visual Design System (Dayos Brutalist Editorial Showroom)
- **AI Contribution**: Applied Dayos-style tokens (`#e5e5e5` warm canvas, `#ffffff` flat paper cards, `#000000` carbon black blocks, `#d1ffca` mint tags, and `#fff100` voltage yellow highlights) across all UI primitives.
- **Human Verification**: Verified that zero box-shadows and zero gradient cards were strictly respected across all 20+ components, ensuring depth is derived solely from surface contrast and large radii (24px–32px).

### D. Audio & Haptics Engine (`src/lib/sound.ts`)
- **AI Contribution**: Drafted basic Web Audio oscillator curves.
- **Human Fact-Checking**: Corrected browser `AudioContext` autoplay restrictions by deferring initialization to first user gesture and wrapping state checks in safe try/catch blocks with persistent mute toggling in `localStorage`.

### E. Test Suites & Automated Quality Assurance
- **AI Contribution**: Generated initial test fixtures and Vitest test skeletons across 12 test files.
- **Human Verification**: Fixed assertion mismatches in UI component class checking, ensured 100% passing status across all **86 tests**, and validated `npm run typecheck`, `npm run lint`, and `npm run build`.

---

## 4. Where AI Failed & Required Manual Intervention

1. **Upstream Model Deprecations / 404 Errors**:
   - *Issue*: Initial API calls targeted deprecated model endpoints (`llama-3.1-8b-instant`).
   - *Fix*: Reconfigured Groq client to dynamically fall back across supported production models (`llama-3.3-70b-versatile`, `openai/gpt-oss-120b`, `gpt-4o-mini`, and instant mock mode).
2. **Schema Drift in JSON Output**:
   - *Issue*: LLaMA 3.3 occasionally included conversational preamble before the JSON object (e.g., *"Here is your study deck:"*).
   - *Fix*: Implemented regex boundary extractors (`findFirstJsonObject`) to slice clean JSON boundaries before parsing.
3. **Accessibility (ARIA) in Complex 3D Flip Cards**:
   - *Issue*: AI initially hid flipped card content using `display: none`, breaking keyboard accessibility and screen reader traversal.
   - *Fix*: Refactored to CSS 3D backface visibility transforms with `aria-hidden` toggling synced to flip state.

---

## 5. Conclusion

AI tools accelerated implementation velocity by ~4x, enabling a complete, production-grade active recall platform (interactive 3D cards, multi-choice quiz, remediation mode, local history, export engine, Web Audio cues, and Command Palette) to be constructed and verified within the ~8-hour engineering budget without compromising on architecture, security, or testing rigor.
