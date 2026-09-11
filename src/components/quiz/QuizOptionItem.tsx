"use client";

import React from "react";
import { CheckCircle2, XCircle, Check } from "lucide-react";
import { Kbd } from "@/components/ui";

export interface QuizOptionItemProps {
  optionText: string;
  optionIndex: 0 | 1 | 2 | 3;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrectOption: boolean;
  isUserPick: boolean;
  onSelect: (index: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;
const OPTION_DIGITS = ["1", "2", "3", "4"] as const;

export const QuizOptionItem: React.FC<QuizOptionItemProps> = ({
  optionText,
  optionIndex,
  isSelected,
  isSubmitted,
  isCorrectOption,
  isUserPick,
  onSelect,
  disabled = false,
}) => {
  const letter = OPTION_LETTERS[optionIndex];
  const digit = OPTION_DIGITS[optionIndex];

  // Determine state styles
  let containerStyles = "bg-surface border-border-dim text-text-primary hover:border-border-bright hover:bg-subtle/40";
  let letterBadgeStyles = "bg-subtle text-text-secondary border-border-dim";
  let statusIcon: React.ReactNode = null;

  if (!isSubmitted) {
    if (isSelected) {
      containerStyles =
        "bg-accent-subtle/40 border-accent-primary text-text-primary ring-1 ring-accent-primary/60 shadow-glow";
      letterBadgeStyles = "bg-accent-primary text-white border-transparent";
    }
  } else {
    // Submitted state
    if (isUserPick && isCorrectOption) {
      // 3. User Picked Correctly
      containerStyles =
        "bg-success-subtle/60 border-success text-success ring-1 ring-success/40";
      letterBadgeStyles = "bg-success text-white border-transparent";
      statusIcon = <CheckCircle2 className="h-5 w-5 text-success shrink-0" />;
    } else if (isUserPick && !isCorrectOption) {
      // 4. User Picked Incorrectly
      containerStyles =
        "bg-error-subtle/60 border-error text-error ring-1 ring-error/40";
      letterBadgeStyles = "bg-error text-white border-transparent";
      statusIcon = <XCircle className="h-5 w-5 text-error shrink-0" />;
    } else if (!isUserPick && isCorrectOption) {
      // 5. Revealed Correct (when user missed)
      containerStyles =
        "bg-success-subtle/30 border-success/70 text-success font-medium ring-1 ring-success/30";
      letterBadgeStyles = "bg-success/20 text-success border-success/40";
      statusIcon = <Check className="h-4 w-4 text-success shrink-0" />;
    } else {
      // Other unselected neutral options
      containerStyles = "bg-surface/60 border-border-dim/50 text-text-tertiary opacity-60";
      letterBadgeStyles = "bg-subtle/50 text-text-tertiary border-border-dim/40";
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(optionIndex)}
      disabled={disabled || isSubmitted}
      aria-label={`Option ${letter}: ${optionText}`}
      aria-pressed={isSelected}
      className={`group relative flex w-full items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border text-left min-h-[52px] sm:min-h-[56px] select-none transition-all duration-150 ${containerStyles} ${
        !isSubmitted ? "active:scale-[0.985] cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Letter Indicator (A, B, C, D) */}
        <span
          className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-colors ${letterBadgeStyles}`}
        >
          {letter}
        </span>

        {/* Option Text */}
        <span className="text-xs sm:text-sm font-medium leading-snug break-words">
          {optionText}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Number hotkey pill for desktop */}
        {!isSubmitted && (
          <span className="hidden sm:inline-flex opacity-40 group-hover:opacity-100 transition-opacity">
            <Kbd keys={[digit]} className="text-[10px]" />
          </span>
        )}

        {/* Live outcome icon */}
        {statusIcon}
      </div>
    </button>
  );
};
