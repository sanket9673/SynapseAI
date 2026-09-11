import { jsonrepair } from "jsonrepair";
import { ZodError } from "zod";
import { repairAndValidateStudySet } from "./schema";
import type { StudySet } from "@/types/study";

export class AIParseError extends Error {
  constructor(message: string, public rawOutput?: string) {
    super(message);
    this.name = "AIParseError";
  }
}

export class AIValidationError extends Error {
  constructor(message: string, public zodErrors?: unknown) {
    super(message);
    this.name = "AIValidationError";
  }
}

export class AITimeoutError extends Error {
  constructor(message = "AI request timed out after 15 seconds") {
    super(message);
    this.name = "AITimeoutError";
  }
}

export class AIRateLimitError extends Error {
  constructor(message = "AI provider rate limit reached. Please retry in a few moments.") {
    super(message);
    this.name = "AIRateLimitError";
  }
}

export class AIUpstreamError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "AIUpstreamError";
  }
}

/**
 * Strips markdown codeblock markers (e.g. ```json ... ``` or ``` ... ```)
 * and extracts candidate JSON object string.
 */
export function stripMarkdownFences(text: string): string {
  if (!text) return "";

  let cleaned = text.trim();

  // Match ```json ... ``` or ``` ... ```
  const codeBlockRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i;
  const match = cleaned.match(codeBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  } else {
    // If text contains markdown block within other text
    const embeddedBlock = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
    if (embeddedBlock && embeddedBlock[1]) {
      cleaned = embeddedBlock[1].trim();
    }
  }

  return cleaned;
}

/**
 * Defensive JSON extraction and repair pipeline using jsonrepair
 */
export function parseAndRepairJSON(rawText: string): Record<string, unknown> {
  const stripped = stripMarkdownFences(rawText);

  // Attempt 1: Direct JSON.parse on stripped text
  try {
    const parsed = JSON.parse(stripped);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall through to repair
  }

  // Attempt 2: Locate outermost JSON object boundaries {...}
  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");

  if (firstBrace !== -1) {
    const candidate =
      lastBrace !== -1 && lastBrace > firstBrace
        ? stripped.substring(firstBrace, lastBrace + 1)
        : stripped.substring(firstBrace);

    try {
      const repairedCandidate = jsonrepair(candidate);
      const parsed = JSON.parse(repairedCandidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // Continue to fallback
    }
  }

  // Attempt 3: Use jsonrepair on stripped text
  try {
    const repaired = jsonrepair(stripped);
    const parsed = JSON.parse(repaired);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall through to final error
  }

  throw new AIParseError(
    "Failed to extract or repair valid JSON structure from AI output.",
    rawText
  );
}

/**
 * High-level parser that sanitizes, repairs JSON, and validates with Zod
 */
export function parseAndValidateAIOutput(rawText: string, sourceText = ""): StudySet {
  if (!rawText || !rawText.trim()) {
    throw new AIParseError("Empty response received from AI model.");
  }

  const parsedJson = parseAndRepairJSON(rawText);

  try {
    return repairAndValidateStudySet(parsedJson, sourceText);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorSummary = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");
      throw new AIValidationError(`StudySet schema validation failed: ${errorSummary}`, error.errors);
    }
    throw error;
  }
}
