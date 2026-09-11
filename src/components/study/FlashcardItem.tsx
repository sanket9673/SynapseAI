"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { FlashcardItemProps } from "@/types/flashcard";
import { Badge, Button, Kbd } from "@/components/ui";
import { Lightbulb, CheckCircle2, AlertTriangle, RotateCw } from "lucide-react";

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  cardNumber,
  totalCards,
  isFlipped,
  onFlip,
  masteryStatus,
  onSetMastery,
}) => {
  const [showHint, setShowHint] = useState(false);

  // Border glow and status styling dependent on mastery status
  const getBorderGlow = () => {
    if (masteryStatus === "mastered") {
      return "border-success/60 ring-1 ring-success/30 shadow-[0_0_24px_-4px_rgba(16,185,129,0.25)]";
    }
    if (masteryStatus === "needs-review") {
      return "border-warning/60 ring-1 ring-warning/30 shadow-[0_0_24px_-4px_rgba(245,158,11,0.25)]";
    }
    return "border-border-dim hover:border-border-bright";
  };

  return (
    <div className="w-full max-w-xl h-80 sm:h-96 mx-auto relative perspective-1000 select-none">
      <motion.div
        className={`w-full h-full relative cursor-pointer transform-style-3d rounded-2xl bg-surface border transition-all duration-300 shadow-elevated ${getBorderGlow()}`}
        onClick={onFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full bg-surface border border-border-dim/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backface-hidden overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm" className="font-medium font-mono">
                  {card.category || "Active Recall"}
                </Badge>
                {masteryStatus === "mastered" && (
                  <span className="inline-flex items-center gap-1 text-xs text-success font-medium bg-success/10 border border-success/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Mastered
                  </span>
                )}
                {masteryStatus === "needs-review" && (
                  <span className="inline-flex items-center gap-1 text-xs text-warning font-medium bg-warning/10 border border-warning/30 px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Needs Review
                  </span>
                )}
              </div>
              <span className="text-xs text-text-tertiary font-mono">
                {cardNumber} / {totalCards}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mt-3 leading-snug">
              {card.front}
            </h3>

            {card.hint && (
              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors py-1.5 px-3 rounded-lg bg-subtle/70 hover:bg-subtle border border-border-dim"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-warning" />
                    <span>Reveal Hint</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-text-secondary bg-subtle/80 border border-border-dim p-3 rounded-lg leading-relaxed"
                  >
                    <span className="font-semibold text-text-primary block mb-0.5">
                      💡 Pedagogical Hint:
                    </span>
                    {card.hint}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border-dim text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              Click anywhere or press <Kbd keys={["Space"]} /> to flip
            </span>
            <RotateCw className="w-4 h-4 text-text-tertiary/60" />
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full bg-surface border border-border-dim/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Stop flip trigger when clicking inside actions
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider text-accent-primary uppercase font-mono">
                Explanation & Answer
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                {cardNumber} / {totalCards}
              </span>
            </div>

            <div className="text-base sm:text-lg text-text-primary leading-relaxed mt-2 font-normal">
              {card.back}
            </div>
          </div>

          {/* Quick Mastery Footer Actions */}
          <div className="pt-4 border-t border-border-dim">
            <p className="text-xs text-text-tertiary mb-2 text-center">
              Rate your active recall mastery:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-warning/40 hover:bg-warning/10 hover:text-warning text-warning font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                onClick={() => onSetMastery("needs-review")}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Needs Review</span>
                <Kbd keys={["R"]} className="ml-auto text-[10px]" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 bg-success/10 hover:bg-success/20 text-success border border-success/30 font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                onClick={() => onSetMastery("mastered")}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It / Mastered</span>
                <Kbd keys={["M"]} className="ml-auto text-[10px]" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
