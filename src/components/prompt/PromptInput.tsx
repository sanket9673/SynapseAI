"use client";

import * as React from "react";
import { Sparkles, StopCircle, RefreshCw, Layers, Check, Bot, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, Badge, Kbd, Textarea } from "@/components/ui";

export interface PromptInputProps {
  onGenerate: (text: string, options?: { mockMode?: boolean }) => void;
  onCancel: () => void;
  isLoading: boolean;
  disabled?: boolean;
  initialValue?: string;
}

interface SampleTopic {
  title: string;
  content: string;
}

const SAMPLE_TOPICS: SampleTopic[] = [
  {
    title: "Quantum Superposition & Qubits",
    content:
      "Quantum superposition is a fundamental principle of quantum mechanics where a physical system exists partly in all theoretically possible states simultaneously. Unlike classical bits that must be strictly 0 or 1, a quantum bit (qubit) can represent a coherent superposition of |0⟩ and |1⟩ states. When measured, the wave function collapses to a definite state with probabilities given by the square of the state's amplitude. Quantum entanglement further binds multiple qubits so that the quantum state of each particle cannot be described independently of the others.",
  },
  {
    title: "JavaScript Event Loop & Microtasks",
    content:
      "The JavaScript runtime operates on a single-threaded event loop concurrency model. Synchronous execution occurs on the call stack. When asynchronous tasks finish, their callbacks enter specific task queues. Microtasks (Promise resolutions, queueMicrotask, MutationObserver) have higher priority than macrotasks (setTimeout, setInterval, setImmediate, I/O events). The event loop empties the entire microtask queue before rendering and moving on to the next macrotask in the queue.",
  },
  {
    title: "Cellular Respiration (Krebs Cycle)",
    content:
      "Cellular respiration is the biochemical pathway that converts glucose into adenosine triphosphate (ATP). In eukaryotic cells, glycolysis produces pyruvate in the cytosol, which is transported into the mitochondrial matrix and converted into Acetyl-CoA. The Krebs cycle (citric acid cycle) oxidizes Acetyl-CoA, releasing CO2 and transferring high-energy electrons to reduce NAD+ to NADH and FAD to FADH2. These electron carriers then fuel oxidative phosphorylation across the inner mitochondrial membrane.",
  },
];

const MIN_CHARS = 10;
const MAX_CHARS = 10000;

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  onCancel,
  isLoading,
  disabled = false,
  initialValue = "",
}) => {
  const [text, setText] = React.useState(initialValue);
  const [mockMode, setMockMode] = React.useState(false);

  const trimmedLength = text.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_CHARS;
  const isTooLong = trimmedLength > MAX_CHARS;
  const isValid = trimmedLength >= MIN_CHARS && !isTooLong;

  const handleGenerate = React.useCallback(() => {
    if (isValid && !isLoading && !disabled) {
      onGenerate(text.trim(), { mockMode });
    }
  }, [isValid, isLoading, disabled, onGenerate, text, mockMode]);

  // Global & Textarea keyboard shortcut listener (⌘ + Enter / Ctrl + Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSelectSample = (sampleContent: string) => {
    if (isLoading || disabled) return;
    setText(sampleContent);
  };

  return (
    <Card className="border-border-dim bg-surface shadow-elevated transition-all">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Top bar: Section Title + Sample Pills + Mock Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border-dim/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
              Source Study Notes
            </span>
            <Badge variant="neutral" size="sm">
              AI Engine Ready
            </Badge>
          </div>

          {/* Mock Mode Selector */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMockMode(!mockMode)}
              disabled={isLoading || disabled}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                mockMode
                  ? "bg-accent-subtle/70 text-accent-primary border-accent-primary/40"
                  : "bg-subtle text-text-tertiary border-border-dim hover:text-text-secondary"
              }`}
              title="Toggle offline simulated AI inference without consuming API credits"
            >
              <Bot className="h-3 w-3" />
              <span>Offline Mock:</span>
              <span className={mockMode ? "font-bold text-accent-primary" : "text-text-tertiary"}>
                {mockMode ? "ON" : "OFF"}
              </span>
            </button>
          </div>
        </div>

        {/* Sample Pills Row */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-text-tertiary font-mono">
            Quick Load Sample Topics:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_TOPICS.map((topic) => {
              const isSelected = text === topic.content;
              return (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => handleSelectSample(topic.content)}
                  disabled={isLoading || disabled}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    isSelected
                      ? "bg-accent-subtle text-accent-primary border-accent-primary/50 shadow-glow"
                      : "bg-subtle/70 hover:bg-subtle text-text-secondary hover:text-text-primary border-border-dim"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Layers className="h-3 w-3" />
                  <span>{topic.title}</span>
                  {isSelected && <Check className="h-3 w-3 text-accent-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="space-y-1.5">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            placeholder="Paste your raw lecture notes, textbook excerpt, markdown summary, or research paper passage here..."
            rows={6}
            error={
              isTooShort
                ? `Minimum ${MIN_CHARS} characters required (${trimmedLength}/${MIN_CHARS})`
                : isTooLong
                ? `Character limit exceeded (${trimmedLength.toLocaleString()}/${MAX_CHARS.toLocaleString()})`
                : undefined
            }
            shortcutHint="⌘ + Enter"
          />
        </div>

        {/* Footer: Stats + Clear Button + Action (Generate / Cancel) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Left info: Character Budget & Shortcut info */}
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span
              className={`font-mono text-xs ${
                isTooShort || isTooLong ? "text-warning" : "text-text-secondary"
              }`}
            >
              {trimmedLength.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-text-tertiary">
              Press <Kbd keys={["⌘", "Enter"]} /> to generate
            </span>
          </div>

          {/* Right actions: Clear button + Submit / Cancel */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {text.length > 0 && !isLoading && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setText("")}
                disabled={disabled}
              >
                Clear
              </Button>
            )}

            {isLoading ? (
              <Button
                type="button"
                size="md"
                variant="danger"
                onClick={onCancel}
                leftIcon={<StopCircle className="h-4 w-4" />}
              >
                Cancel Generation
              </Button>
            ) : (
              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={handleGenerate}
                disabled={!isValid || disabled}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Generate Study Set
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
