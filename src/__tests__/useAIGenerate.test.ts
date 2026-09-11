import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import type { ApiResponse, StudySet } from "@/types/study";

const mockStudySet: StudySet = {
  id: "test-set-1",
  title: "Quantum Superposition & Qubits",
  summary: "A fundamental concept in quantum mechanics.",
  createdAt: 1700000000000,
  sourceTextSnippet: "Quantum superposition snippet...",
  flashcards: [
    {
      id: "c1",
      front: "What is quantum superposition?",
      back: "A state where a physical system exists partly in all possible states.",
      hint: "Wave function",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "Which particle property allows superposition?",
      options: ["Wave-particle duality", "Classical inertia", "Static friction", "Graviton mass"],
      correctOptionIndex: 0,
      explanation: "Wave-particle duality enables quantum coherence.",
    },
  ],
};

describe("useAIGenerate Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("initializes with default idle state", () => {
    const { result } = renderHook(() => useAIGenerate());

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.meta).toBeNull();
    expect(result.current.currentStep).toBeNull();
  });

  it("handles successful generation lifecycle (idle -> loading -> success)", async () => {
    const mockSuccessResponse: ApiResponse<StudySet> = {
      success: true,
      data: mockStudySet,
      meta: {
        latencyMs: 120,
        provider: "groq",
        model: "llama-3.1-70b",
      },
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      })
    );

    const { result } = renderHook(() => useAIGenerate());

    let genPromise: Promise<void>;
    act(() => {
      genPromise = result.current.generate("Test prompt notes here for study.");
    });

    // Immediately in loading state with step 1
    expect(result.current.status).toBe("loading");
    expect(result.current.currentStep?.step).toBe(1);

    // Fast-forward 600ms -> Step 2
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current.currentStep?.step).toBe(2);

    // Fast-forward 800ms more (1400ms total) -> Step 3
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.currentStep?.step).toBe(3);

    // Resolve fetch
    await act(async () => {
      await genPromise;
    });

    expect(result.current.status).toBe("success");
    expect(result.current.data?.title).toBe("Quantum Superposition & Qubits");
    expect(result.current.meta?.provider).toBe("groq");
    expect(result.current.currentStep).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles cancellation correctly", async () => {
    let abortCalled = false;
    global.fetch = vi.fn().mockImplementation((_url, options) => {
      options?.signal?.addEventListener("abort", () => {
        abortCalled = true;
      });
      return new Promise(() => {}); // Never resolves
    });

    const { result } = renderHook(() => useAIGenerate());

    act(() => {
      result.current.generate("Some study material text to generate from");
    });

    expect(result.current.status).toBe("loading");

    act(() => {
      result.current.cancel();
    });

    expect(abortCalled).toBe(true);
    expect(result.current.status).toBe("idle");
    expect(result.current.currentStep).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("protects against race conditions by discarding stale responses", async () => {
    const fastStudySet: StudySet = {
      ...mockStudySet,
      title: "Fast Second Request",
    };

    let slowResolve: (val: unknown) => void;
    const slowPromise = new Promise((resolve) => {
      slowResolve = resolve;
    });

    let fastResolve: (val: unknown) => void;
    const fastPromise = new Promise((resolve) => {
      fastResolve = resolve;
    });

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return slowPromise;
      }
      return fastPromise;
    });

    const { result } = renderHook(() => useAIGenerate());

    // 1st request
    act(() => {
      result.current.generate("First Request Text Notes");
    });

    // 2nd request immediately triggers
    act(() => {
      result.current.generate("Second Request Text Notes");
    });

    // Resolve 2nd request first
    await act(async () => {
      fastResolve!({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: fastStudySet,
            meta: { latencyMs: 50, provider: "groq", model: "fast" },
          }),
      });
    });

    expect(result.current.data?.title).toBe("Fast Second Request");

    // Now resolve 1st (slow) request afterwards
    await act(async () => {
      slowResolve!({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockStudySet, title: "Stale First Request" },
            meta: { latencyMs: 500, provider: "groq", model: "slow" },
          }),
      });
    });

    // The state MUST still retain the fast second request!
    expect(result.current.data?.title).toBe("Fast Second Request");
  });

  it("handles HTTP 500 / API error responses gracefully", async () => {
    const mockErrorResponse: ApiResponse<StudySet> = {
      success: false,
      error: {
        code: "UPSTREAM_FAILURE",
        message: "AI service connection timeout.",
        actionableSuggestion: "Check network connectivity or switch to Offline Mock.",
        recoverable: true,
      },
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve(mockErrorResponse),
      })
    );

    const { result } = renderHook(() => useAIGenerate());

    await act(async () => {
      await result.current.generate("Some valid text for study input");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error?.code).toBe("UPSTREAM_FAILURE");
    expect(result.current.error?.message).toBe("AI service connection timeout.");
    expect(result.current.error?.recoverable).toBe(true);
  });

  it("handles reset() and retry() methods", async () => {
    let fetchCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount++;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockStudySet,
            meta: { latencyMs: 100, provider: "mock", model: "heuristic" },
          }),
      });
    });

    const { result } = renderHook(() => useAIGenerate());

    await act(async () => {
      await result.current.generate("First input test text");
    });

    expect(result.current.status).toBe("success");
    expect(result.current.data).not.toBeNull();

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Retry invokes generate with last payload
    await act(async () => {
      result.current.retry();
    });

    expect(fetchCount).toBe(2);
    expect(result.current.status).toBe("success");
  });
});
