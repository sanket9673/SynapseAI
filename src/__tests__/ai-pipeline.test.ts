import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseAndValidateAIOutput,
  stripMarkdownFences,
  parseAndRepairJSON,
  AIParseError,
  AIValidationError,
  AITimeoutError,
  AIRateLimitError,
} from "@/lib/ai/parser";
import { repairAndValidateStudySet, sanitizeRawStudySet } from "@/lib/ai/schema";
import { generateMockStudySet } from "@/lib/ai/mock";
import { generateStudySetWithFallback } from "@/lib/ai/provider";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

describe("AI Pipeline & Schema Validation Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Markdown Fence Stripping & Defensive Parser", () => {
    const validJson = JSON.stringify({
      title: "Cellular Respiration",
      summary: "Overview of glycolysis, citric acid cycle, and oxidative phosphorylation.",
      flashcards: [
        {
          front: "Where does glycolysis occur?",
          back: "In the cytoplasm of the cell.",
          hint: "Outside mitochondria",
          category: "Cellular Energetics",
        },
        {
          front: "What is the net ATP yield of glycolysis?",
          back: "2 ATP molecules per glucose.",
        },
      ],
      quiz: [
        {
          question: "Which process produces the majority of ATP in cellular respiration?",
          options: ["Glycolysis", "Citric Acid Cycle", "Oxidative Phosphorylation", "Fermentation"],
          correctOptionIndex: 2,
          explanation: "Oxidative phosphorylation generates approximately 26-28 ATP via ATP synthase.",
        },
      ],
    });

    it("parses pristine JSON into a valid StudySet", () => {
      const result = parseAndValidateAIOutput(validJson, "Sample cellular biology text");
      expect(result.title).toBe("Cellular Respiration");
      expect(result.flashcards.length).toBe(2);
      expect(result.quiz.length).toBe(1);
      expect(result.quiz[0].options.length).toBe(4);
      expect(result.quiz[0].correctOptionIndex).toBe(2);
    });

    it("strips ```json code fences and parses correctly", () => {
      const fenced = "```json\n" + validJson + "\n```";
      expect(stripMarkdownFences(fenced)).toBe(validJson);

      const result = parseAndValidateAIOutput(fenced);
      expect(result.title).toBe("Cellular Respiration");
    });

    it("strips generic ``` code fences with surrounding commentary", () => {
      const messy = "Here is the synthesized study set:\n```\n" + validJson + "\n```\nHope this helps!";
      const result = parseAndValidateAIOutput(messy);
      expect(result.title).toBe("Cellular Respiration");
    });

    it("successfully repairs and parses truncated JSON missing closing braces", () => {
      // Intentionally truncate the JSON (missing closing braces and bracket)
      const truncated = validJson.slice(0, -15);
      const repaired = parseAndRepairJSON(truncated);
      expect(repaired).toBeDefined();
      expect(typeof repaired).toBe("object");
    });

    it("throws AIParseError when passed non-JSON gibberish", () => {
      expect(() => parseAndValidateAIOutput("This is just plain text without any json")).toThrow(
        AIParseError
      );
    });

    it("throws AIValidationError when required minimal items are missing", () => {
      const invalidSet = JSON.stringify({
        title: "Test",
        summary: "Summary",
        flashcards: [{ front: "Only one card", back: "Not enough" }], // Needs at least 2
        quiz: [],
      });
      expect(() => parseAndValidateAIOutput(invalidSet)).toThrow(AIValidationError);
    });
  });

  describe("2. Heuristic Self-Healing & Schema Repairs", () => {
    it("clamps out-of-bounds correctOptionIndex safely to 0", () => {
      const rawWithBadIndex = {
        title: "Heuristic Test",
        summary: "Testing index repair",
        flashcards: [
          { front: "Q1", back: "A1" },
          { front: "Q2", back: "A2" },
        ],
        quiz: [
          {
            question: "What is the capital?",
            options: ["Paris", "London", "Berlin", "Rome"],
            correctOptionIndex: 99, // Out of bounds!
            explanation: "Capital check",
          },
        ],
      };

      const result = repairAndValidateStudySet(rawWithBadIndex);
      expect(result.quiz[0].correctOptionIndex).toBe(0);
    });

    it("auto-expands quiz questions with fewer than 4 options to exactly 4", () => {
      const rawWith2Options = {
        title: "Option Padding Test",
        summary: "Testing option padding",
        flashcards: [
          { front: "Q1", back: "A1" },
          { front: "Q2", back: "A2" },
        ],
        quiz: [
          {
            question: "True or False?",
            options: ["True", "False"], // Only 2 options!
            correctOptionIndex: 0,
            explanation: "Binary question",
          },
        ],
      };

      const result = repairAndValidateStudySet(rawWith2Options);
      expect(result.quiz[0].options.length).toBe(4);
      expect(result.quiz[0].options[0]).toBe("True");
      expect(result.quiz[0].options[1]).toBe("False");
      expect(result.quiz[0].options[2]).toBe("None of the above");
      expect(result.quiz[0].options[3]).toBe("All of the above");
    });

    it("generates missing UUIDs and createdAt timestamps automatically", () => {
      const rawWithoutIds = {
        title: "ID Generator Test",
        summary: "Testing automatic ID population",
        flashcards: [
          { front: "Card 1", back: "Back 1" },
          { front: "Card 2", back: "Back 2" },
        ],
        quiz: [
          {
            question: "Test Q?",
            options: ["A", "B", "C", "D"],
            correctOptionIndex: 1,
            explanation: "Exp",
          },
        ],
      };

      const sanitized = sanitizeRawStudySet(rawWithoutIds) as any;
      expect(sanitized.id).toBeDefined();
      expect(typeof sanitized.createdAt).toBe("number");
      expect(sanitized.flashcards[0].id).toBeDefined();
      expect(sanitized.quiz[0].id).toBeDefined();
    });
  });

  describe("3. Mock Provider Determinism", () => {
    it("returns high quality study set when mockMode is true", async () => {
      const mockResult = await generateMockStudySet(
        "Synaptic transmission involves long-term potentiation and glutamate neurotransmitters in the brain."
      );

      expect(mockResult.title).toContain("Neurobiology");
      expect(mockResult.flashcards.length).toBeGreaterThanOrEqual(2);
      expect(mockResult.quiz.length).toBeGreaterThanOrEqual(1);
      expect(mockResult.sourceTextSnippet).toContain("Synaptic transmission");
    });

    it("falls back to generic study set when keywords don't match", async () => {
      const mockResult = await generateMockStudySet(
        "Random unexpected topic xyz123 containing enough characters for testing."
      );
      expect(mockResult.flashcards.length).toBeGreaterThanOrEqual(2);
      expect(mockResult.quiz.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("4. Provider Orchestration & Fallback", () => {
    it("routes to mock provider when mockMode: true is specified", async () => {
      const result = await generateStudySetWithFallback("Cellular biology and ATP synthesis", {
        mockMode: true,
      });

      expect(result.provider).toBe("mock");
      expect(result.studySet).toBeDefined();
      expect(result.studySet.flashcards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("5. POST /api/generate Route Handler", () => {
    it("returns HTTP 400 with MALFORMED_INPUT for short input (< 10 chars)", async () => {
      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "too short" }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MALFORMED_INPUT");
      expect(data.error.actionableSuggestion).toBeDefined();
    });

    it("returns HTTP 400 with MALFORMED_INPUT for non-JSON body", async () => {
      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid-json-string{",
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MALFORMED_INPUT");
    });

    it("returns HTTP 200 with valid StudySet and metadata when mockMode is true", async () => {
      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Machine learning transformers use self-attention mechanisms to process tokens.",
          mockMode: true,
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBeDefined();
      expect(data.meta.provider).toBe("mock");
      expect(typeof data.meta.latencyMs).toBe("number");
    });

    it("returns HTTP 504 with TIMEOUT when AI request times out", async () => {
      const providerModule = await import("@/lib/ai/provider");
      vi.spyOn(providerModule, "generateStudySetWithFallback").mockRejectedValueOnce(
        new AITimeoutError()
      );

      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Detailed study text about biology that takes too long to process.",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(504);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("TIMEOUT");
      expect(data.error.actionableSuggestion).toBeDefined();
    });

    it("returns HTTP 429 with RATE_LIMITED when upstream rate limit is encountered", async () => {
      const providerModule = await import("@/lib/ai/provider");
      vi.spyOn(providerModule, "generateStudySetWithFallback").mockRejectedValueOnce(
        new AIRateLimitError()
      );

      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Detailed study text about biology encountering rate limits.",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("RATE_LIMITED");
    });

    it("returns HTTP 422 with PARSE_ERROR when unrecoverable parse/schema error occurs", async () => {
      const providerModule = await import("@/lib/ai/provider");
      vi.spyOn(providerModule, "generateStudySetWithFallback").mockRejectedValueOnce(
        new AIParseError("Unrecoverable output structure")
      );

      const req = new NextRequest("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Detailed study text about neuroscience resulting in broken model structure.",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("PARSE_ERROR");
    });
  });
});

