import { z } from "zod";
import type { Flashcard, QuizQuestion, StudySet } from "@/types/study";

export const FlashcardZodSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  front: z.string().min(1, "Flashcard front cannot be empty"),
  back: z.string().min(1, "Flashcard back cannot be empty"),
  hint: z.string().optional(),
  category: z.string().optional(),
});

export const QuizQuestionZodSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  question: z.string().min(1, "Quiz question cannot be empty"),
  options: z.tuple([
    z.string().min(1),
    z.string().min(1),
    z.string().min(1),
    z.string().min(1),
  ]),
  correctOptionIndex: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  explanation: z.string().min(1, "Quiz explanation cannot be empty"),
});

export const StudySetZodSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().min(1, "Title cannot be empty"),
  summary: z.string().min(1, "Summary cannot be empty"),
  createdAt: z.number().default(() => Date.now()),
  sourceTextSnippet: z.string().default(""),
  flashcards: z
    .array(FlashcardZodSchema)
    .min(2, "StudySet must contain at least 2 flashcards"),
  quiz: z
    .array(QuizQuestionZodSchema)
    .min(1, "StudySet must contain at least 1 quiz question"),
});

/**
 * Pre-processes raw AI output with heuristic self-healing repairs
 * before running final Zod schema validation.
 */
export function sanitizeRawStudySet(raw: unknown, sourceText = ""): unknown {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const obj = { ...(raw as Record<string, unknown>) };

  // 1. Ensure Top-Level Identifiers & Snippet
  if (!obj.id || typeof obj.id !== "string") {
    obj.id = crypto.randomUUID();
  }
  if (!obj.createdAt || typeof obj.createdAt !== "number") {
    obj.createdAt = Date.now();
  }
  if (!obj.sourceTextSnippet || typeof obj.sourceTextSnippet !== "string") {
    obj.sourceTextSnippet = sourceText
      ? sourceText.slice(0, 150) + (sourceText.length > 150 ? "..." : "")
      : "Synthesized study content";
  }

  // 2. Self-Heal Flashcards
  if (Array.isArray(obj.flashcards)) {
    obj.flashcards = obj.flashcards
      .map((card: unknown): Flashcard | null => {
        if (!card || typeof card !== "object") return null;
        const c = { ...(card as Record<string, unknown>) };
        const front = typeof c.front === "string" ? c.front.trim() : String(c.front || "").trim();
        const back = typeof c.back === "string" ? c.back.trim() : String(c.back || "").trim();
        if (!front || !back) return null;

        const cardItem: Flashcard = {
          id: typeof c.id === "string" && c.id ? c.id : crypto.randomUUID(),
          front,
          back,
        };
        if (typeof c.hint === "string" && c.hint.trim()) {
          cardItem.hint = c.hint.trim();
        }
        if (typeof c.category === "string" && c.category.trim()) {
          cardItem.category = c.category.trim();
        }
        return cardItem;
      })
      .filter((c): c is Flashcard => c !== null);
  }

  // 3. Self-Heal Quiz Questions
  if (Array.isArray(obj.quiz)) {
    const fallbackOptions = [
      "None of the above",
      "All of the above",
      "Cannot be determined from the text",
      "Option not specified",
    ];

    obj.quiz = obj.quiz
      .map((q: unknown) => {
        if (!q || typeof q !== "object") return null;
        const questionObj = { ...(q as Record<string, unknown>) };

        const questionText =
          typeof questionObj.question === "string"
            ? questionObj.question.trim()
            : String(questionObj.question || "").trim();

        if (!questionText) return null;

        // Extract options array and clean entries
        let optionsList: string[] = [];
        if (Array.isArray(questionObj.options)) {
          optionsList = questionObj.options
            .map((opt) => (typeof opt === "string" ? opt.trim() : String(opt || "").trim()))
            .filter(Boolean);
        }

        // Heuristic: If fewer than 4 options, pad with fallback choices in priority order
        const fallbackChoices = [
          "None of the above",
          "All of the above",
          "Cannot be determined from the text",
          "Option not specified",
        ];

        for (const choice of fallbackChoices) {
          if (optionsList.length >= 4) break;
          if (!optionsList.includes(choice)) {
            optionsList.push(choice);
          }
        }

        let padCount = 1;
        while (optionsList.length < 4) {
          optionsList.push(`Alternative ${padCount++}`);
        }

        // Slice to exactly 4 options
        const fixedOptions = optionsList.slice(0, 4) as [string, string, string, string];

        // Clamp correctOptionIndex safely to [0, 3]
        let correctIdx = Number(questionObj.correctOptionIndex);
        if (Number.isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
          correctIdx = 0;
        } else {
          correctIdx = Math.floor(correctIdx);
        }

        const explanationText =
          typeof questionObj.explanation === "string" && questionObj.explanation.trim()
            ? questionObj.explanation.trim()
            : `Option "${fixedOptions[correctIdx]}" is the correct answer based on the source text.`;

        return {
          id:
            typeof questionObj.id === "string" && questionObj.id
              ? questionObj.id
              : crypto.randomUUID(),
          question: questionText,
          options: fixedOptions,
          correctOptionIndex: correctIdx as 0 | 1 | 2 | 3,
          explanation: explanationText,
        };
      })
      .filter((q): q is QuizQuestion => !!q);
  }

  return obj;
}

/**
 * Validates and repairs raw input against the StudySet schema.
 */
export function repairAndValidateStudySet(raw: unknown, sourceText = ""): StudySet {
  const sanitized = sanitizeRawStudySet(raw, sourceText);
  return StudySetZodSchema.parse(sanitized) as StudySet;
}
