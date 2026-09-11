"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";

export interface QuizScoreSummaryProps {
  quizTitle: string;
  totalQuestions: number;
  correctCount: number;
  wrongQuestionIds: string[];
  onRestartFull: () => void;
  onRetestMissed?: () => void;
}

export const QuizScoreSummary: React.FC<QuizScoreSummaryProps> = ({
  quizTitle,
  totalQuestions,
  correctCount,
  wrongQuestionIds,
  onRestartFull,
  onRetestMissed,
}) => {
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Qualitative Assessment Status
  let qualitativeBadge = {
    label: "Needs Reinforcement",
    color: "bg-error-subtle/60 text-error border-error/40",
    icon: Flame,
  };

  if (percentage === 100) {
    qualitativeBadge = {
      label: "Mastery Achieved",
      color: "bg-success-subtle/60 text-success border-success/40",
      icon: Trophy,
    };
  } else if (percentage >= 70) {
    qualitativeBadge = {
      label: "Proficient — Minor Gaps",
      color: "bg-accent-subtle/60 text-accent-primary border-accent-primary/40",
      icon: Sparkles,
    };
  }

  const IconComponent = qualitativeBadge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto space-y-6"
    >
      <Card glow className="border-accent-primary/40 bg-surface shadow-elevated text-center p-6 sm:p-8 space-y-6">
        {/* Top Trophy / Badge Icon */}
        <div className="w-16 h-16 bg-accent-subtle text-accent-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
          <IconComponent className="w-8 h-8 text-accent-primary animate-bounce" />
        </div>

        {/* Title & Assessment Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border shadow-subtle ${qualitativeBadge.color}">
            <span>{qualitativeBadge.label}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Quiz Assessment Completed!
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary truncate max-w-md mx-auto">
            {quizTitle}
          </p>
        </div>

        {/* Percentage Score Hero Display */}
        <div className="py-4">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
            {percentage}%
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary">
            Accuracy Score
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-subtle/60 border border-border-dim space-y-0.5">
            <span className="text-[11px] font-mono text-text-tertiary">Total</span>
            <div className="text-lg font-bold font-mono text-text-primary">
              {totalQuestions}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-success-subtle/40 border border-success/30 space-y-0.5">
            <span className="text-[11px] font-mono text-success/80 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Correct
            </span>
            <div className="text-lg font-bold font-mono text-success">
              {correctCount}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-error-subtle/40 border border-error/30 space-y-0.5">
            <span className="text-[11px] font-mono text-error/80 flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Missed
            </span>
            <div className="text-lg font-bold font-mono text-error">
              {incorrectCount}
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {wrongQuestionIds.length > 0 && onRetestMissed && (
            <Button
              type="button"
              variant="primary"
              onClick={onRetestMissed}
              className="w-full sm:w-auto gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Re-test Wrong Answers Only ({wrongQuestionIds.length})</span>
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={onRestartFull}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Full Quiz</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
