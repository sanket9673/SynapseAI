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
      className={`p-6 rounded-[32px] border space-y-4 ${
        isCorrect
          ? "bg-mint-chip/30 border-emerald-500/40 text-carbon-black"
          : "bg-red-50/60 border-red-200 text-carbon-black"
      }`}
    >
      {/* Feedback Title */}
      <div className="flex items-center gap-2.5">
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
        )}
        <h4
          className={`text-sm font-bold tracking-tight uppercase font-mono ${
            isCorrect ? "text-emerald-800" : "text-red-700"
          }`}
        >
          {isCorrect
            ? "Outstanding recall. Correct!"
            : "Incorrect. Key concept to review:"}
        </h4>
      </div>

      {/* Explanation Rationale Text */}
      <p className="text-xs sm:text-sm text-slate leading-relaxed font-medium">
        {explanation}
      </p>

      {/* Advance Action Button with Enter Hint */}
      <div className="flex items-center justify-between pt-3 border-t border-ash/40">
        <span className="text-[11px] text-smoke hidden sm:inline-flex items-center gap-1.5 font-mono">
          Press <Kbd keys={["Enter ↵"]} className="text-[10px]" /> to advance
        </span>

        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onNext}
          className="ml-auto gap-2 rounded-xl"
        >
          <span>{isLastQuestion ? "View Results" : "Next Question"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
