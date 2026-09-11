import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateStudySetWithFallback } from "@/lib/ai/provider";
import {
  AIParseError,
  AIValidationError,
  AITimeoutError,
  AIRateLimitError,
} from "@/lib/ai/parser";
import type { ApiResponse, StudySet } from "@/types/study";

const RequestBodySchema = z.object({
  text: z
    .string({ required_error: "Source study text is required." })
    .transform((val) => val.trim())
    .refine((val) => val.length >= 10, {
      message: "Study material must be at least 10 characters long to generate meaningful cards.",
    })
    .refine((val) => val.length <= 10000, {
      message: "Study material exceeds the 10,000 character limit per generation request.",
    }),
  mockMode: z.boolean().optional(),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudySet>>> {
  try {
    let bodyJson: unknown;
    try {
      bodyJson = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<StudySet>>(
        {
          success: false,
          error: {
            code: "MALFORMED_INPUT",
            message: "Request payload must be valid JSON.",
            actionableSuggestion:
              "Ensure Content-Type header is application/json and body is correctly formatted.",
            recoverable: true,
          },
        },
        { status: 400 }
      );
    }

    const parseResult = RequestBodySchema.safeParse(bodyJson);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Invalid input parameters.";
      return NextResponse.json<ApiResponse<StudySet>>(
        {
          success: false,
          error: {
            code: "MALFORMED_INPUT",
            message: firstError,
            actionableSuggestion:
              "Provide at least 10 characters of conceptual study text (max 10,000 characters).",
            recoverable: true,
          },
        },
        { status: 400 }
      );
    }

    const { text, mockMode } = parseResult.data;

    const result = await generateStudySetWithFallback(text, { mockMode });

    return NextResponse.json<ApiResponse<StudySet>>(
      {
        success: true,
        data: result.studySet,
        meta: {
          latencyMs: result.latencyMs,
          provider: result.provider,
          model: result.model,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof AITimeoutError) {
      return NextResponse.json<ApiResponse<StudySet>>(
        {
          success: false,
          error: {
            code: "TIMEOUT",
            message: "The AI inference engine exceeded the 15-second response threshold.",
            actionableSuggestion:
              "Try shortening the study text, or test with mockMode=true for instant synthesis.",
            recoverable: true,
          },
        },
        { status: 504 }
      );
    }

    if (error instanceof AIRateLimitError) {
      return NextResponse.json<ApiResponse<StudySet>>(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "AI provider rate limit reached.",
            actionableSuggestion:
              "Please wait a few seconds before retrying, or switch to mock mode.",
            recoverable: true,
          },
        },
        { status: 429 }
      );
    }

    if (error instanceof AIParseError || error instanceof AIValidationError) {
      return NextResponse.json<ApiResponse<StudySet>>(
        {
          success: false,
          error: {
            code: "PARSE_ERROR",
            message: error.message,
            actionableSuggestion:
              "The model generated non-conforming structure. Please retry or adjust your prompt notes.",
            recoverable: true,
          },
        },
        { status: 422 }
      );
    }

    // Default Upstream Failure
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected upstream AI service failure occurred.";

    return NextResponse.json<ApiResponse<StudySet>>(
      {
        success: false,
        error: {
          code: "UPSTREAM_FAILURE",
          message: errorMessage,
          actionableSuggestion:
            "Check your network connectivity and API keys in .env.local, or enable mockMode.",
          recoverable: true,
        },
      },
      { status: 500 }
    );
  }
}
