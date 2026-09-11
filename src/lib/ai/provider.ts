import { generateMockStudySet } from "./mock";
import {
  parseAndValidateAIOutput,
  AITimeoutError,
  AIRateLimitError,
  AIUpstreamError,
} from "./parser";
import type { StudySet } from "@/types/study";

export interface AIProviderResult {
  studySet: StudySet;
  provider: "groq" | "openai" | "mock";
  model: string;
  latencyMs: number;
}

const SYSTEM_PROMPT = `You are Synapse, an expert AI cognitive study assistant and active recall tutor.
Your task is to analyze the provided study text and synthesize a pristine, high-yield study set.

You MUST respond ONLY with a valid JSON object adhering strictly to this format:
{
  "title": "Concise and engaging topic title",
  "summary": "High-yield summary synthesizing the core concepts (2-4 sentences)",
  "flashcards": [
    {
      "front": "Clear active recall question or prompt",
      "back": "Direct, precise explanation or concept definition",
      "hint": "Optional conceptual hint or mnemonic",
      "category": "Subtopic or concept category"
    }
  ],
  "quiz": [
    {
      "question": "Challenging multiple choice question testing conceptual understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Detailed explanation of why the correct option is right and others are distractors"
    }
  ]
}

CRITICAL RULES:
1. Generate between 3 and 8 flashcards.
2. Generate between 2 and 4 multiple-choice quiz questions.
3. Every quiz question MUST contain EXACTLY 4 distinct options in the "options" array.
4. "correctOptionIndex" MUST be an integer between 0 and 3 matching the correct option.
5. Return ONLY the JSON object. Do not include introductory or concluding conversational text.`;

async function callChatCompletion(
  url: string,
  apiKey: string,
  model: string,
  userPrompt: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Study Source Material:\n"""\n${userPrompt}\n"""\n\nGenerate the complete JSON study set now.`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new AIRateLimitError();
      }
      const errorText = await response.text().catch(() => "");
      throw new AIUpstreamError(
        `Upstream AI API returned status ${response.status}: ${errorText.slice(0, 200)}`,
        response.status
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new AIUpstreamError("Invalid response structure from upstream AI provider.");
    }

    return content;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (
      (error instanceof Error && error.name === "AbortError") ||
      (error instanceof Error && error.name === "TimeoutError")
    ) {
      throw new AITimeoutError();
    }
    throw error;
  }
}

/**
 * Orchestrates multi-provider generation with fallback support
 */
export async function generateStudySetWithFallback(
  inputText: string,
  options?: { mockMode?: boolean }
): Promise<AIProviderResult> {
  const startTime = Date.now();

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const configuredProvider = (process.env.AI_PROVIDER || "groq").toLowerCase();

  // Route directly to Mock if requested or if no API keys are present
  const shouldUseMock =
    options?.mockMode === true ||
    configuredProvider === "mock" ||
    (!groqKey && !openAiKey);

  if (shouldUseMock) {
    const studySet = await generateMockStudySet(inputText);
    return {
      studySet,
      provider: "mock",
      model: "deterministic-synthesizer-v1",
      latencyMs: Date.now() - startTime,
    };
  }

  // Attempt Primary Provider: Groq
  if (configuredProvider === "groq" && groqKey) {
    const defaultModel = "openai/gpt-oss-120b";
    const requestedModel = process.env.GROQ_MODEL?.trim() || defaultModel;
    const modelCandidates = Array.from(
      new Set([
        requestedModel,
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3.6-27b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
      ])
    );

    let lastError: unknown = null;

    for (const model of modelCandidates) {
      try {
        const rawOutput = await callChatCompletion(
          "https://api.groq.com/openai/v1/chat/completions",
          groqKey,
          model,
          inputText
        );
        const studySet = parseAndValidateAIOutput(rawOutput, inputText);
        return {
          studySet,
          provider: "groq",
          model,
          latencyMs: Date.now() - startTime,
        };
      } catch (err) {
        lastError = err;
        // If error is 404 (model_not_found), try next model candidate in list
        if (err instanceof AIUpstreamError && err.statusCode === 404) {
          continue;
        }
        // If it's a rate limit or timeout, break out to OpenAI fallback
        break;
      }
    }

    // If Groq failed but OpenAI is configured, attempt fallback
    if (openAiKey && !(lastError instanceof AITimeoutError)) {
      try {
        const fallbackModel = "gpt-4o-mini";
        const rawOutput = await callChatCompletion(
          "https://api.openai.com/v1/chat/completions",
          openAiKey,
          fallbackModel,
          inputText
        );
        const studySet = parseAndValidateAIOutput(rawOutput, inputText);
        return {
          studySet,
          provider: "openai",
          model: fallbackModel,
          latencyMs: Date.now() - startTime,
        };
      } catch {
        // Fall through to throw original primary error
      }
    }
    if (lastError) throw lastError;
  }

  // Attempt Secondary Provider: OpenAI
  if (configuredProvider === "openai" && openAiKey) {
    const model = "gpt-4o-mini";
    const rawOutput = await callChatCompletion(
      "https://api.openai.com/v1/chat/completions",
      openAiKey,
      model,
      inputText
    );
    const studySet = parseAndValidateAIOutput(rawOutput, inputText);
    return {
      studySet,
      provider: "openai",
      model,
      latencyMs: Date.now() - startTime,
    };
  }

  // Fallback to mock if provider configuration was incomplete
  const studySet = await generateMockStudySet(inputText);
  return {
    studySet,
    provider: "mock",
    model: "fallback-mock",
    latencyMs: Date.now() - startTime,
  };
}
