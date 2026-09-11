"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { RetestEngineProps } from "@/types/retest";
import { useRemediationState } from "@/hooks/useRemediationState";
import { RetestHeader } from "./RetestHeader";
import { RetestVictory } from "./RetestVictory";
import { Button, Card, CardContent } from "@/components/ui";
import { sound } from "@/lib/sound";

export const RetestEngine: React.FC<RetestEngineProps> = ({
  studySet,
  wrongQuestionIds,
  flaggedCardIds,
  scope = "all-weaknesses",
  onDismiss,
  onQuestionsResolved,
  onCardsResolved,
}) => {
  const {
    remainingQuestions,
    remainingCards,
    resolvedCount,
    totalInitial,
    masteryPercentage,
    currentQuestion,
    currentCard,
    resolveCurrentQuestion,
    markQuestionStillWrong,
    resolveCurrentCard,
  } = useRemediationState(studySet, wrongQuestionIds, flaggedCardIds, scope);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [showFloatingPill, setShowFloatingPill] = useState<boolean>(false);

  const isComplete = remainingQuestions.length === 0 && remainingCards.length === 0;

  const handleAnswerSubmit = (option: string) => {
    if (!currentQuestion || selectedOption !== null) return;

    setSelectedOption(option);

    const correctAnswer =
      currentQuestion.correctAnswer ||
      currentQuestion.options[currentQuestion.correctOptionIndex] ||
      "";

    const correct = option === correctAnswer;
    setIsCorrectFeedback(correct);

    if (correct) {
      sound.playCorrect();
      setShowFloatingPill(true);
      setTimeout(() => setShowFloatingPill(false), 1200);

      setTimeout(() => {
        resolveCurrentQuestion(currentQuestion.id);
        onQuestionsResolved([currentQuestion.id]);
        setSelectedOption(null);
        setIsCorrectFeedback(null);
      }, 1000);
    } else {
      sound.playIncorrect();
      setTimeout(() => {
        markQuestionStillWrong(currentQuestion.id);
        setSelectedOption(null);
        setIsCorrectFeedback(null);
      }, 1200);
    }
  };

  const handleCardMastered = () => {
    if (!currentCard) return;
    sound.playCorrect();
    resolveCurrentCard(currentCard.id);
    onCardsResolved([currentCard.id]);
  };

  React.useEffect(() => {
    if (isComplete) {
      sound.playComplete();
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-app text-text-primary flex flex-col">
        <RetestHeader
          resolvedCount={resolvedCount}
          totalInitial={totalInitial}
          masteryPercentage={masteryPercentage}
          onDismiss={onDismiss}
        />
        <RetestVictory
          totalMastered={totalInitial}
          onReturnToDeck={onDismiss}
          onRetakeQuiz={onDismiss}
        />
      </div>
    );
  }

  const questionTitle = currentQuestion?.question || currentQuestion?.text || "";

  return (
    <div className="min-h-screen bg-app text-text-primary flex flex-col selection:bg-warning/30">
      <RetestHeader
        resolvedCount={resolvedCount}
        totalInitial={totalInitial}
        masteryPercentage={masteryPercentage}
        onDismiss={onDismiss}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center relative">
        {/* Floating Delight Pill */}
        <AnimatePresence>
          {showFloatingPill && (
            <motion.div
              initial={{ opacity: 0, y: 0, x: "-50%" }}
              animate={{ opacity: 1, y: -30, x: "-50%" }}
              exit={{ opacity: 0, y: -50, x: "-50%" }}
              className="absolute top-4 left-1/2 z-30 pointer-events-none bg-success text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-success/30 flex items-center gap-1 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              +1 Mastery Point
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 text-center">
          <p className="text-xs font-medium text-text-tertiary italic">
            &ldquo;Errors are just unencoded memories. Let&apos;s lock them in.&rdquo;
          </p>
        </div>

        {/* Question Remediation Loop */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-surface border-warning/40 ring-1 ring-warning/20 shadow-elevated">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-warning/10 text-warning border border-warning/20 uppercase tracking-wider font-mono">
                    Targeted Question Review
                  </span>
                  <span className="text-xs text-text-tertiary font-mono">
                    ID: {currentQuestion.id}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-text-primary leading-snug">
                  {questionTitle}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const correctAnswer =
                      currentQuestion.correctAnswer ||
                      currentQuestion.options[currentQuestion.correctOptionIndex];
                    const isCorrectOption = option === correctAnswer;

                    let btnStyle =
                      "bg-subtle/70 border-border-dim hover:border-border-bright text-text-primary";
                    if (selectedOption !== null) {
                      if (isCorrectOption) {
                        btnStyle =
                          "bg-success-subtle/60 border-success text-success ring-1 ring-success/40";
                      } else if (isSelected && !isCorrectFeedback) {
                        btnStyle =
                          "bg-error-subtle/60 border-error text-error ring-1 ring-error/40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={selectedOption !== null}
                        onClick={() => handleAnswerSubmit(option)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 min-h-[48px] flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrectOption && (
                          <Check className="w-5 h-5 text-success shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && !isCorrectFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-text-primary text-xs sm:text-sm space-y-1"
                  >
                    <span className="font-semibold text-warning block">
                      Review Explanation:
                    </span>
                    <p className="text-text-secondary leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Flashcard Rapid Drill Loop */}
        {!currentQuestion && currentCard && (
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-surface border-warning/40 ring-1 ring-warning/20 shadow-elevated">
              <CardContent className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-warning/10 text-warning border border-warning/20 uppercase tracking-wider font-mono">
                  Flagged Flashcard Drill
                </span>

                <div className="w-full min-h-[160px] p-6 rounded-2xl bg-subtle/60 border border-border-dim flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs text-text-tertiary uppercase font-mono tracking-wider">
                    Front
                  </span>
                  <p className="text-lg font-bold text-text-primary">{currentCard.front}</p>
                  <div className="w-12 h-0.5 bg-border-dim my-2" />
                  <span className="text-xs text-text-tertiary uppercase font-mono tracking-wider">
                    Back
                  </span>
                  <p className="text-base text-success font-medium">{currentCard.back}</p>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCardMastered}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-success hover:bg-emerald-600 text-white"
                >
                  <Check className="w-5 h-5" />
                  <span>I&apos;ve Got It Now (Mark Mastered)</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};
