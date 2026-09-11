import { useState, useRef, useCallback, useEffect } from "react";
import type { StudySet, ApiResponse } from "@/types/study";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface GenerationStep {
  step: number;
  total: number;
  label: string;
}

export interface UseAIGenerateReturn {
  status: GenerationStatus;
  data: StudySet | null;
  error: {
    code: string;
    message: string;
    actionableSuggestion: string;
    recoverable: boolean;
  } | null;
  meta: {
    latencyMs: number;
    provider: string;
    model: string;
  } | null;
  currentStep: GenerationStep | null;
  generate: (text: string, options?: { mockMode?: boolean }) => Promise<void>;
  cancel: () => void;
  retry: () => void;
  reset: () => void;
}

const STEPS: GenerationStep[] = [
  { step: 1, total: 3, label: "Analyzing notes & extracting core themes..." },
  { step: 2, total: 3, label: "Synthesizing active-recall flashcards..." },
  { step: 3, total: 3, label: "Validating quiz questions & explanations..." },
];

export function useAIGenerate(): UseAIGenerateReturn {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [data, setData] = useState<StudySet | null>(null);
  const [error, setError] = useState<UseAIGenerateReturn["error"]>(null);
  const [meta, setMeta] = useState<UseAIGenerateReturn["meta"]>(null);
  const [currentStep, setCurrentStep] = useState<GenerationStep | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastRequestRef = useRef<{ text: string; options?: { mockMode?: boolean } } | null>(null);

  const clearStepTimers = useCallback(() => {
    stepTimersRef.current.forEach((t) => clearTimeout(t));
    stepTimersRef.current = [];
  }, []);

  const startStepSimulation = useCallback(() => {
    clearStepTimers();
    setCurrentStep(STEPS[0]);

    const timer1 = setTimeout(() => {
      setCurrentStep(STEPS[1]);
    }, 600);

    const timer2 = setTimeout(() => {
      setCurrentStep(STEPS[2]);
    }, 1400);

    stepTimersRef.current = [timer1, timer2];
  }, [clearStepTimers]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearStepTimers();
    setStatus("idle");
    setCurrentStep(null);
    setError(null);
  }, [clearStepTimers]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearStepTimers();
    setStatus("idle");
    setData(null);
    setError(null);
    setMeta(null);
    setCurrentStep(null);
  }, [clearStepTimers]);

  const generate = useCallback(
    async (text: string, options?: { mockMode?: boolean }) => {
      // Abort previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Increment request ID to guard against stale responses
      requestIdRef.current += 1;
      const currentRequestId = requestIdRef.current;

      lastRequestRef.current = { text, options };

      setStatus("loading");
      setError(null);
      setData(null);
      setMeta(null);
      startStepSimulation();

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            mockMode: options?.mockMode,
          }),
          signal: controller.signal,
        });

        const json: ApiResponse<StudySet> = await response.json();

        // Discard stale responses if newer request has been triggered
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        clearStepTimers();
        setCurrentStep(null);

        if (!response.ok || !json.success) {
          const errPayload = !json.success
            ? json.error
            : {
                code: "UPSTREAM_FAILURE",
                message: "Failed to generate study materials.",
                actionableSuggestion: "Check network or switch to Offline Mock mode.",
                recoverable: true,
              };

          setError(errPayload);
          setStatus("error");
          return;
        }

        setData(json.data);
        setMeta(json.meta);
        setStatus("success");
      } catch (err: unknown) {
        // If aborted, do nothing if user cancelled or new request started
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        clearStepTimers();
        setCurrentStep(null);

        const errorMessage =
          err instanceof Error ? err.message : "An unexpected network or service failure occurred.";

        setError({
          code: "UPSTREAM_FAILURE",
          message: errorMessage,
          actionableSuggestion:
            "Please verify your connection and server configuration, or enable Mock Mode.",
          recoverable: true,
        });
        setStatus("error");
      }
    },
    [clearStepTimers, startStepSimulation]
  );

  const retry = useCallback(() => {
    if (lastRequestRef.current) {
      generate(lastRequestRef.current.text, lastRequestRef.current.options);
    }
  }, [generate]);

  // Clean up timers and in-flight fetch on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearStepTimers();
    };
  }, [clearStepTimers]);

  return {
    status,
    data,
    error,
    meta,
    currentStep,
    generate,
    cancel,
    retry,
    reset,
  };
}
