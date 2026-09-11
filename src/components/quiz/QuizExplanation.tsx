"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button, Kbd } from "@/components/ui";

export interface QuizExplanationProps {
  isCorrect: boolean;
  explanation: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

export const QuizExplanation: React.FC<QuizExplanationProps> = ({
  isCorrect,
  explanation,
  isLastQuestion,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`p-4 sm:p-5 rounded-2xl border space-y-4 shadow-elevated ${
        isCorrect
          ? "bg-success-subtle/30 border-success/40"
          : "bg-error-subtle/30 border-error/40"
      }`}
    >
      {/* Feedback Title */}
      <div className="flex items-center gap-2.5">
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-error shrink-0" />
        )}
        <h4
          className={`text-sm font-bold tracking-tight ${
            isCorrect ? "text-success" : "text-error"
          }`}
        >
          {isCorrect
            ? "Outstanding recall. Correct!"
            : "Incorrect. Key concept to review:"}
        </h4>
      </div>

      {/* Explanation Rationale Text */}
      <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
        {explanation}
      </p>

      {/* Advance Action Button with Enter Hint */}
      <div className="flex items-center justify-between pt-2 border-t border-border-dim/60">
        <span className="text-[11px] text-text-tertiary hidden sm:inline-flex items-center gap-1.5 font-mono">
          Press <Kbd keys={["Enter ↵"]} className="text-[10px]" /> to advance
        </span>

        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onNext}
          className="ml-auto gap-2"
        >
          <span>{isLastQuestion ? "View Results" : "Next Question"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
