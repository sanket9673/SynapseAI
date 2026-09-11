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
        <Card className="bg-paper-white border border-ash/60 rounded-[32px] text-center overflow-hidden relative">
          <CardContent className="pt-8 pb-8 px-6 sm:px-8 flex flex-col items-center">
            {/* Animated Check Ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-mint-chip border border-emerald-500/30 flex items-center justify-center text-carbon-black mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-800" />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-[64px] bg-mint-chip text-carbon-black text-xs font-bold mb-3 border border-mint-chip font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              100% Comprehension Achieved
            </div>

            <h2 className="text-2xl font-bold text-carbon-black mb-2 tracking-tight uppercase">
              All Knowledge Gaps Resolved!
            </h2>

            <p className="text-slate text-sm mb-8 leading-relaxed">
              Fantastic work. 100% of missed items ({totalMastered} total) have been successfully re-encoded and mastered in this session.
            </p>

            <div className="w-full space-y-3">
              <Button
                variant="primary"
                onClick={onReturnToDeck}
                className="w-full bg-carbon-black hover:bg-slate text-paper-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <span>Return to Full Deck</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                onClick={onRetakeQuiz}
                className="w-full rounded-xl border-ash hover:border-carbon-black flex items-center justify-center gap-2"
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
