"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Send } from "lucide-react";
import type { QuizEngineProps } from "@/types/quiz";
import type { QuizQuestion } from "@/types/study";
import { useQuizState } from "@/hooks/useQuizState";
import { useQuizKeyboard } from "@/hooks/useQuizKeyboard";
import { QuizOptionItem } from "./QuizOptionItem";
import { QuizExplanation } from "./QuizExplanation";
import { QuizScoreSummary } from "./QuizScoreSummary";
import { Button, Card, Badge, Progress, Kbd } from "@/components/ui";
import { sound } from "@/lib/sound";

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  quizTitle,
  onQuizComplete,
  onRetestMissed,
}) => {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);

  // Sync questions prop if it updates
  useEffect(() => {
    setActiveQuestions(questions);
  }, [questions]);

  const { state, selectOption, submitAnswer, nextQuestion, restartQuiz } =
    useQuizState(activeQuestions.length);

  const {
    currentIndex,
    selectedOptionIndex,
    isSubmitted,
    answers,
    wrongQuestionIds,
    isComplete,
  } = state;

  const currentQuestion: QuizQuestion | undefined = activeQuestions[currentIndex];

  const totalQuestions = activeQuestions.length;
  const progressValue = ((currentIndex + 1) / totalQuestions) * 100;

  // Calculate correct answers count
  const correctCount = useMemo(() => {
    return Object.values(answers).filter((a) => a.isCorrect).length;
  }, [answers]);

  const handleSubmit = useCallback(() => {
    if (currentQuestion && selectedOptionIndex !== null && !isSubmitted) {
      const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
      if (isCorrect) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
      submitAnswer(currentQuestion);
    }
  }, [currentQuestion, selectedOptionIndex, isSubmitted, submitAnswer]);

  const handleNext = useCallback(() => {
    nextQuestion(totalQuestions);
  }, [nextQuestion, totalQuestions]);

  // When completed, trigger parent callback and sound
  useEffect(() => {
    if (isComplete && onQuizComplete) {
      sound.playComplete();
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      onQuizComplete({
        total: totalQuestions,
        correct: correctCount,
        incorrect: totalQuestions - correctCount,
        percentage,
      });
    }
  }, [isComplete, correctCount, totalQuestions, onQuizComplete]);

  // Bind hotkeys (1-4/A-D for options, Enter for submit/next)
  useQuizKeyboard(
    {
      onSelectOption: selectOption,
      onSubmit: handleSubmit,
      onNext: handleNext,
      isSubmitted,
      hasSelection: selectedOptionIndex !== null,
    },
    !isComplete && !!currentQuestion
  );

  const handleRetestMissed = () => {
    const missedSubset = questions.filter((q) => wrongQuestionIds.includes(q.id));
    if (missedSubset.length > 0) {
      setActiveQuestions(missedSubset);
      restartQuiz();
      onRetestMissed?.(wrongQuestionIds);
    }
  };

  const handleRestartFull = () => {
    setActiveQuestions(questions);
    restartQuiz();
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 text-center text-text-tertiary border-border-dim bg-surface">
        No quiz questions available for this deck.
      </Card>
    );
  }

  if (isComplete) {
    return (
      <QuizScoreSummary
        quizTitle={quizTitle}
        totalQuestions={totalQuestions}
        correctCount={correctCount}
        wrongQuestionIds={wrongQuestionIds}
        onRestartFull={handleRestartFull}
        onRetestMissed={wrongQuestionIds.length > 0 ? handleRetestMissed : undefined}
      />
    );
  }

  if (!currentQuestion) return null;

  const currentAnswerRecord = answers[currentQuestion.id];
  const isCorrect = currentAnswerRecord?.isCorrect ?? false;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top Bar: Title & Progress Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent-primary" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-tertiary truncate max-w-[280px] sm:max-w-md">
              {quizTitle}
            </h3>
          </div>
          <Badge variant="neutral" size="sm" className="font-mono text-[11px]">
            Question {currentIndex + 1} of {totalQuestions}
          </Badge>
        </div>

        <Progress value={progressValue} className="h-2 w-full" />
      </div>

      {/* Main Question & Options Card */}
      <motion.div
        key={currentQuestion.id || currentIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="space-y-6"
      >
        <Card className="border border-ash/50 bg-paper-white rounded-[32px] p-6 sm:p-8 space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate uppercase tracking-wider">
              Multiple Choice Question
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-carbon-black leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 4-Option Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((optionText, idx) => {
              const optIndex = idx as 0 | 1 | 2 | 3;
              const isSelected = selectedOptionIndex === optIndex;
              const isCorrectOption = optIndex === currentQuestion.correctOptionIndex;
              const isUserPick = isSubmitted && currentAnswerRecord?.selectedOptionIndex === optIndex;

              return (
                <QuizOptionItem
                  key={optIndex}
                  optionText={optionText}
                  optionIndex={optIndex}
                  isSelected={isSelected}
                  isSubmitted={isSubmitted}
                  isCorrectOption={isCorrectOption}
                  isUserPick={isUserPick}
                  onSelect={selectOption}
                />
              );
            })}
          </div>

          {/* Pre-submit Action Bar */}
          {!isSubmitted && (
            <div className="flex items-center justify-between pt-4 border-t border-ash/40">
              <span className="text-[11px] text-smoke hidden sm:inline-flex items-center gap-1.5 font-mono">
                Select <Kbd keys={["1-4"]} className="text-[10px]" /> & press{" "}
                <Kbd keys={["Enter ↵"]} className="text-[10px]" /> to confirm
              </span>

              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={handleSubmit}
                disabled={selectedOptionIndex === null}
                className="ml-auto gap-2 rounded-xl"
              >
                <span>Submit Answer</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Post-submit Animated Explanation Card */}
        {isSubmitted && (
          <QuizExplanation
            isCorrect={isCorrect}
            explanation={currentQuestion.explanation}
            isLastQuestion={currentIndex === totalQuestions - 1}
            onNext={handleNext}
          />
        )}
      </motion.div>
    </div>
  );
};
