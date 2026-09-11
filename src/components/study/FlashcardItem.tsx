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

  // Border and status styling dependent on mastery status
  const getBorderStatus = () => {
    if (masteryStatus === "mastered") {
      return "border-emerald-500 ring-2 ring-emerald-500/30";
    }
    if (masteryStatus === "needs-review") {
      return "border-voltage-yellow ring-2 ring-voltage-yellow/40";
    }
    return "border-ash/60 hover:border-carbon-black";
  };

  return (
    <div className="w-full max-w-xl h-80 sm:h-96 mx-auto relative perspective-1000 select-none">
      <motion.div
        className={`w-full h-full relative cursor-pointer transform-style-3d rounded-[32px] bg-paper-white border transition-all duration-300 ${getBorderStatus()}`}
        onClick={onFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full bg-paper-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between backface-hidden overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm" className="font-semibold font-mono">
                  {card.category || "Active Recall"}
                </Badge>
                {masteryStatus === "mastered" && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-mint-chip px-3 py-0.5 rounded-[64px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                  </span>
                )}
                {masteryStatus === "needs-review" && (
                  <span className="inline-flex items-center gap-1 text-xs text-carbon-black font-bold bg-voltage-yellow px-3 py-0.5 rounded-[64px] font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" /> Needs Review
                  </span>
                )}
              </div>
              <span className="text-xs text-smoke font-mono font-bold">
                {cardNumber} / {totalCards}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-carbon-black mt-3 leading-snug">
              {card.front}
            </h3>

            {card.hint && (
              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-carbon-black transition-colors py-1.5 px-3.5 rounded-[64px] bg-mist-gray hover:bg-ash/40 border border-ash/50 font-mono font-medium"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reveal Hint</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-slate bg-mist-gray border border-ash/60 p-4 rounded-2xl leading-relaxed"
                  >
                    <span className="font-bold text-carbon-black block mb-0.5 font-mono">
                      💡 Pedagogical Hint:
                    </span>
                    {card.hint}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ash/40 text-xs text-smoke font-mono">
            <span className="flex items-center gap-1.5">
              Click to flip or press <Kbd keys={["Space"]} />
            </span>
            <RotateCw className="w-4 h-4 text-smoke" />
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full bg-paper-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Stop flip trigger when clicking inside actions
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-carbon-black uppercase font-mono">
                Explanation & Answer
              </span>
              <span className="text-xs text-smoke font-mono font-bold">
                {cardNumber} / {totalCards}
              </span>
            </div>

            <div className="text-base sm:text-lg text-carbon-black leading-relaxed mt-3 font-normal">
              {card.back}
            </div>
          </div>

          {/* Quick Mastery Footer Actions */}
          <div className="pt-4 border-t border-ash/40">
            <p className="text-xs text-smoke mb-2.5 text-center font-mono font-medium">
              Rate your active recall mastery:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-ash hover:border-carbon-black hover:bg-voltage-yellow/30 text-carbon-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl"
                onClick={() => onSetMastery("needs-review")}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Needs Review</span>
                <Kbd keys={["R"]} className="ml-auto text-[10px]" />
              </Button>
              <Button
                type="button"
                variant="primary"
                className="h-11 bg-carbon-black hover:bg-slate text-paper-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 rounded-xl"
                onClick={() => onSetMastery("mastered")}
              >
                <CheckCircle2 className="w-4 h-4 text-mint-chip" />
                <span>Got It / Mastered</span>
                <Kbd keys={["M"]} className="ml-auto text-[10px] text-carbon-black bg-paper-white border-none" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
