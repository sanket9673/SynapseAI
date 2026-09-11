"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Flame,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

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
    badgeClass: "bg-voltage-yellow text-carbon-black border-voltage-yellow",
    icon: Flame,
  };

  if (percentage === 100) {
    qualitativeBadge = {
      label: "Mastery Achieved",
      badgeClass: "bg-mint-chip text-carbon-black border-mint-chip",
      icon: Trophy,
    };
  } else if (percentage >= 70) {
    qualitativeBadge = {
      label: "Proficient — Minor Gaps",
      badgeClass: "bg-mint-chip/60 text-carbon-black border-mint-chip",
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
      <Card className="border border-ash/50 bg-paper-white rounded-[32px] text-center p-6 sm:p-8 space-y-6">
        {/* Top Trophy / Badge Icon */}
        <div className="w-16 h-16 bg-carbon-black text-paper-white rounded-2xl flex items-center justify-center mx-auto">
          <IconComponent className="w-8 h-8 text-mint-chip" />
        </div>

        {/* Title & Assessment Badge */}
        <div className="space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-[64px] text-xs font-mono font-bold border ${qualitativeBadge.badgeClass}`}>
            <span>{qualitativeBadge.label}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-carbon-black uppercase">
            Quiz Assessment Completed!
          </h2>
          <p className="text-xs sm:text-sm text-slate truncate max-w-md mx-auto font-mono">
            {quizTitle}
          </p>
        </div>

        {/* Percentage Score Hero Display */}
        <div className="py-4">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-carbon-black">
            {percentage}%
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-smoke font-bold">
            Accuracy Score
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-left">
          <div className="p-4 rounded-2xl bg-mist-gray border border-ash/40 space-y-0.5">
            <span className="text-[11px] font-mono text-smoke font-bold uppercase">Total</span>
            <div className="text-xl font-bold font-mono text-carbon-black">
              {totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-mint-chip/40 border border-mint-chip space-y-0.5">
            <span className="text-[11px] font-mono text-emerald-800 font-bold flex items-center gap-1 uppercase">
              <CheckCircle2 className="h-3 w-3" /> Correct
            </span>
            <div className="text-xl font-bold font-mono text-carbon-black">
              {correctCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-0.5">
            <span className="text-[11px] font-mono text-red-700 font-bold flex items-center gap-1 uppercase">
              <XCircle className="h-3 w-3" /> Missed
            </span>
            <div className="text-xl font-bold font-mono text-carbon-black">
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
              className="w-full sm:w-auto gap-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Re-test Wrong Answers Only ({wrongQuestionIds.length})</span>
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={onRestartFull}
            className="w-full sm:w-auto gap-2 rounded-xl border-ash hover:border-carbon-black"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Full Quiz</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
