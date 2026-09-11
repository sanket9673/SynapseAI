"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { FlashcardDeckProps, CardMasteryMap, MasteryStatus } from "@/types/flashcard";
import { FlashcardItem } from "./FlashcardItem";
import { FlashcardControls } from "./FlashcardControls";
import { useFlashcardKeyboard } from "@/hooks/useFlashcardKeyboard";
import { Button, Card, Badge } from "@/components/ui";
import { CheckCircle2, AlertTriangle, Trophy, RefreshCw, Layers } from "lucide-react";
import { sound } from "@/lib/sound";

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  deckTitle,
  onDeckComplete,
  onMasteryChange,
  onResetDeck,
}) => {
  const [cardOrder, setCardOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteryMap, setMasteryMap] = useState<CardMasteryMap>({});
  const [isComplete, setIsComplete] = useState(false);

  const activeCardOriginalIndex = cardOrder[currentIndex];
  const activeCard = cards[activeCardOriginalIndex];

  // Compute counts
  const stats = useMemo(() => {
    let masteredCount = 0;
    let reviewCount = 0;
    Object.values(masteryMap).forEach((status) => {
      if (status === "mastered") masteredCount++;
      if (status === "needs-review") reviewCount++;
    });
    return { masteredCount, reviewCount };
  }, [masteryMap]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < cardOrder.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onDeckComplete?.(stats);
    }
  }, [currentIndex, cardOrder.length, onDeckComplete, stats]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    sound.playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const handleSetMastery = useCallback(
    (status: MasteryStatus) => {
      if (!activeCard) return;

      setMasteryMap((prev) => {
        const nextMap = {
          ...prev,
          [activeCard.id]: status,
        };
        return nextMap;
      });

      onMasteryChange?.(activeCard.id, status);

      // Satisfying micro-delay (250ms) before auto-advancing
      setTimeout(() => {
        if (currentIndex < cardOrder.length - 1) {
          handleNext();
        } else {
          setIsComplete(true);
          sound.playComplete();
          const nextMastered =
            stats.masteredCount + (status === "mastered" && masteryMap[activeCard.id] !== "mastered" ? 1 : 0);
          const nextReview =
            stats.reviewCount + (status === "needs-review" && masteryMap[activeCard.id] !== "needs-review" ? 1 : 0);
          onDeckComplete?.({
            masteredCount: nextMastered,
            reviewCount: nextReview,
          });
        }
      }, 250);
    },
    [activeCard, currentIndex, cardOrder.length, handleNext, onDeckComplete, onMasteryChange, stats, masteryMap]
  );

  const handleToggleMasteryShortcut = useCallback(() => {
    handleSetMastery("mastered");
  }, [handleSetMastery]);

  const handleToggleReviewShortcut = useCallback(() => {
    handleSetMastery("needs-review");
  }, [handleSetMastery]);

  const handleToggleHint = useCallback(() => {
    // Hint disclosure toggle handler
  }, []);

  // Fisher-Yates shuffle retaining mastery mappings
  const handleShuffle = useCallback(() => {
    const shuffled = [...cardOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cardOrder]);

  const handleReset = useCallback(() => {
    setCardOrder(cards.map((_, i) => i));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    onResetDeck?.();
  }, [cards, onResetDeck]);

  // Keyboard navigation hook bindings
  useFlashcardKeyboard(
    {
      onFlip: handleFlip,
      onNext: handleNext,
      onPrev: handlePrev,
      onToggleMastery: handleToggleMasteryShortcut,
      onToggleReview: handleToggleReviewShortcut,
      onToggleHint: handleToggleHint,
    },
    !isComplete && !!activeCard
  );

  if (!cards || cards.length === 0) {
    return (
      <Card className="p-8 text-center text-text-tertiary border-border-dim bg-surface">
        No flashcards available in this deck.
      </Card>
    );
  }

  // Completion State View
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-paper-white border border-ash/50 rounded-[32px] text-center space-y-6"
      >
        <div className="w-16 h-16 bg-carbon-black text-paper-white rounded-2xl flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8 text-mint-chip" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-carbon-black uppercase">
            Deck Completed!
          </h2>
          <p className="text-sm text-slate">
            You have successfully reviewed all cards in{" "}
            <span className="font-bold text-carbon-black">{deckTitle}</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="flex items-center gap-3 bg-mint-chip/40 border border-mint-chip p-4 rounded-2xl text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
            <div>
              <div className="text-[11px] font-mono font-bold text-slate uppercase">Mastered</div>
              <div className="text-xl font-bold font-mono text-carbon-black">
                {stats.masteredCount}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-voltage-yellow/30 border border-voltage-yellow p-4 rounded-2xl text-left">
            <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <div className="text-[11px] font-mono font-bold text-slate uppercase">Needs Review</div>
              <div className="text-xl font-bold font-mono text-carbon-black">
                {stats.reviewCount}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto gap-2 rounded-xl"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Study Deck Again</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto gap-2 rounded-xl border-ash hover:border-carbon-black"
            onClick={() => {
              // Filter order to focus solely on cards marked 'needs-review'
              const reviewIndices = cardOrder.filter(
                (origIdx) => masteryMap[cards[origIdx].id] === "needs-review"
              );
              if (reviewIndices.length > 0) {
                setCardOrder(reviewIndices);
                setCurrentIndex(0);
                setIsComplete(false);
                setIsFlipped(false);
              }
            }}
            disabled={stats.reviewCount === 0}
          >
            Focus on Weak Cards ({stats.reviewCount})
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between max-w-xl mx-auto px-1">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-carbon-black" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate truncate max-w-[280px] sm:max-w-md">
            {deckTitle}
          </h3>
        </div>
        <Badge variant="accent" size="sm" dot>
          Active Recall Mode
        </Badge>
      </div>

      <FlashcardItem
        card={activeCard}
        cardNumber={currentIndex + 1}
        totalCards={cardOrder.length}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        masteryStatus={masteryMap[activeCard.id] || "unseen"}
        onSetMastery={handleSetMastery}
      />

      <FlashcardControls
        currentIndex={currentIndex}
        totalCards={cardOrder.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onShuffle={handleShuffle}
        onReset={handleReset}
      />
    </div>
  );
};
