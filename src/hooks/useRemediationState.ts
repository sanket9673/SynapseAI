import { useState, useMemo } from "react";
import type { StudySet, QuizQuestion, Flashcard } from "@/types/study";
import { shuffleQuestionOptions } from "@/lib/quiz-utils";
import type { RetestScope } from "@/types/retest";

export interface UseRemediationStateReturn {
  remainingQuestions: QuizQuestion[];
  remainingCards: Flashcard[];
  currentIndex: number;
  resolvedCount: number;
  totalInitial: number;
  masteryPercentage: number;
  currentQuestion: QuizQuestion | undefined;
  currentCard: Flashcard | undefined;
  resolveCurrentQuestion: (questionId: string) => void;
  markQuestionStillWrong: (questionId: string) => void;
  resolveCurrentCard: (cardId: string) => void;
  resetRemediation: () => void;
}

export function useRemediationState(
  studySet: StudySet,
  wrongQuestionIds: string[],
  flaggedCardIds: string[],
  scope: RetestScope = "all-weaknesses"
): UseRemediationStateReturn {
  const initialQuestions = useMemo(() => {
    if (scope === "flagged-cards") return [];
    const allQuestions = studySet.questions || studySet.quiz || [];
    return allQuestions
      .filter((q) => wrongQuestionIds.includes(q.id))
      .map((q) => shuffleQuestionOptions(q));
  }, [studySet.questions, studySet.quiz, wrongQuestionIds, scope]);

  const initialCards = useMemo(() => {
    if (scope === "quiz-misses") return [];
    const allCards = studySet.flashcards || [];
    return allCards.filter((c) => flaggedCardIds.includes(c.id));
  }, [studySet.flashcards, flaggedCardIds, scope]);

  const [remainingQIds, setRemainingQIds] = useState<string[]>(() =>
    initialQuestions.map((q) => q.id)
  );
  const [remainingCIds, setRemainingCIds] = useState<string[]>(() =>
    initialCards.map((c) => c.id)
  );
  const [resolvedCount, setResolvedCount] = useState<number>(0);

  const totalInitial = initialQuestions.length + initialCards.length;

  const remainingQuestions = useMemo(() => {
    return initialQuestions.filter((q) => remainingQIds.includes(q.id));
  }, [initialQuestions, remainingQIds]);

  const remainingCards = useMemo(() => {
    return initialCards.filter((c) => remainingCIds.includes(c.id));
  }, [initialCards, remainingCIds]);

  const masteryPercentage =
    totalInitial === 0 ? 100 : Math.round((resolvedCount / totalInitial) * 100);

  // Serve questions first, then flagged flashcards
  const currentQuestion = remainingQuestions[0];
  const currentCard = remainingQuestions.length === 0 ? remainingCards[0] : undefined;

  const resolveCurrentQuestion = (questionId: string) => {
    setRemainingQIds((prev) => prev.filter((id) => id !== questionId));
    setResolvedCount((prev) => prev + 1);
  };

  const markQuestionStillWrong = (questionId: string) => {
    // Move to back of the queue
    setRemainingQIds((prev) => {
      const filtered = prev.filter((id) => id !== questionId);
      return [...filtered, questionId];
    });
  };

  const resolveCurrentCard = (cardId: string) => {
    setRemainingCIds((prev) => prev.filter((id) => id !== cardId));
    setResolvedCount((prev) => prev + 1);
  };

  const resetRemediation = () => {
    setRemainingQIds(initialQuestions.map((q) => q.id));
    setRemainingCIds(initialCards.map((c) => c.id));
    setResolvedCount(0);
  };

  return {
    remainingQuestions,
    remainingCards,
    currentIndex: 0,
    resolvedCount,
    totalInitial,
    masteryPercentage,
    currentQuestion,
    currentCard,
    resolveCurrentQuestion,
    markQuestionStillWrong,
    resolveCurrentCard,
    resetRemediation,
  };
}
