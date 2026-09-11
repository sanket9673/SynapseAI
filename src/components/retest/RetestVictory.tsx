"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export interface RetestVictoryProps {
  totalMastered: number;
  onReturnToDeck: () => void;
  onRetakeQuiz: () => void;
}

export const RetestVictory: React.FC<RetestVictoryProps> = ({
  totalMastered,
  onReturnToDeck,
  onRetakeQuiz,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md"
      >
        <Card
          glow
          className="bg-surface border-success/40 shadow-2xl backdrop-blur-xl text-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-success/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="pt-8 pb-8 px-6 flex flex-col items-center">
            {/* Animated Check Ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-success-subtle border border-success/40 flex items-center justify-center text-success mb-6 shadow-lg shadow-success/20"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-subtle text-success text-xs font-semibold mb-3 border border-success/30 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              100% Comprehension Achieved
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
              All Knowledge Gaps Resolved!
            </h2>

            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              Fantastic work. 100% of missed items ({totalMastered} total) have been successfully re-encoded and mastered in this session.
            </p>

            <div className="w-full space-y-3">
              <Button
                variant="primary"
                onClick={onReturnToDeck}
                className="w-full bg-success hover:bg-emerald-600 text-white font-medium shadow-lg shadow-success/20 flex items-center justify-center gap-2"
              >
                <span>Return to Full Deck</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                onClick={onRetakeQuiz}
                className="w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Full Quiz</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
