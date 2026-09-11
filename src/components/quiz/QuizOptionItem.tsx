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
  let containerStyles = "bg-paper-white border-ash/60 text-carbon-black hover:border-carbon-black hover:bg-mist-gray/40";
  let letterBadgeStyles = "bg-mist-gray text-slate border-ash/60";
  let statusIcon: React.ReactNode = null;

  if (!isSubmitted) {
    if (isSelected) {
      containerStyles =
        "bg-carbon-black text-paper-white border-carbon-black ring-2 ring-carbon-black/20";
      letterBadgeStyles = "bg-paper-white text-carbon-black border-transparent font-bold";
    }
  } else {
    // Submitted state
    if (isUserPick && isCorrectOption) {
      // User Picked Correctly
      containerStyles =
        "bg-mint-chip/60 border-emerald-600 text-carbon-black font-semibold";
      letterBadgeStyles = "bg-emerald-600 text-white border-transparent";
      statusIcon = <CheckCircle2 className="h-5 w-5 text-emerald-800 shrink-0" />;
    } else if (isUserPick && !isCorrectOption) {
      // User Picked Incorrectly
      containerStyles =
        "bg-red-50 border-red-400 text-red-950 font-medium";
      letterBadgeStyles = "bg-red-600 text-white border-transparent";
      statusIcon = <XCircle className="h-5 w-5 text-red-600 shrink-0" />;
    } else if (!isCorrectOption && !isUserPick) {
      // Other unselected neutral options
      containerStyles = "bg-mist-gray/40 border-ash/40 text-smoke opacity-60";
      letterBadgeStyles = "bg-mist-gray text-smoke border-ash/30";
    } else if (isCorrectOption) {
      // Revealed Correct (when user missed)
      containerStyles =
        "bg-mint-chip/30 border-emerald-500 text-carbon-black font-semibold";
      letterBadgeStyles = "bg-mint-chip text-carbon-black border-emerald-500";
      statusIcon = <Check className="h-4 w-4 text-emerald-800 shrink-0" />;
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(optionIndex)}
      disabled={disabled || isSubmitted}
      aria-label={`Option ${letter}: ${optionText}`}
      aria-pressed={isSelected}
      className={`group relative flex w-full items-center justify-between gap-3.5 p-4 rounded-2xl border text-left min-h-[56px] select-none transition-all duration-150 ${containerStyles} ${
        !isSubmitted ? "active:scale-[0.985] cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Letter Indicator (A, B, C, D) */}
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border font-mono text-xs font-bold transition-colors ${letterBadgeStyles}`}
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
