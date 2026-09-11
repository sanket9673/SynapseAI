"use client";

import React from "react";
import { Button, Progress, Kbd } from "@/components/ui";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react";

export interface FlashcardControlsProps {
  currentIndex: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onReset: () => void;
}

export const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  currentIndex,
  totalCards,
  onPrev,
  onNext,
  onShuffle,
  onReset,
}) => {
  const progressValue = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mt-6 space-y-4">
      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-text-secondary">
          <span>
            Card {currentIndex + 1} of {totalCards}
          </span>
          <span className="font-semibold text-accent-primary">
            {Math.round(progressValue)}% Completed
          </span>
        </div>
        <Progress value={progressValue} className="h-2 w-full" />
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onShuffle}
            className="text-xs gap-1.5 h-9 px-3"
            title="Shuffle Deck Order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs gap-1.5 h-9 px-3"
            title="Reset Deck Order"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="text-xs gap-1 h-9 px-3 sm:px-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentIndex === totalCards - 1}
            className="text-xs gap-1 h-9 px-3 sm:px-4"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px] font-mono text-text-tertiary border-t border-border-dim">
        <span className="inline-flex items-center gap-1">
          <Kbd keys={["Space"]} /> Flip
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd keys={["←"]} />/<Kbd keys={["→"]} /> Navigate
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd keys={["M"]} /> Mastered
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd keys={["R"]} /> Review
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd keys={["I"]} /> Hint
        </span>
      </div>
    </div>
  );
};
