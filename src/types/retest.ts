import type { StudySet } from "./study";

export type RetestScope = "quiz-misses" | "flagged-cards" | "all-weaknesses";

export interface RemediationSessionState {
  scope: RetestScope;
  initialCount: number;
  remainingQuestionIds: string[];
  remainingCardIds: string[];
  resolvedCount: number;
  isComplete: boolean;
}

export interface RetestEngineProps {
  studySet: StudySet;
  wrongQuestionIds: string[];
  flaggedCardIds: string[];
  scope?: RetestScope;
  onDismiss: () => void;
  onQuestionsResolved: (resolvedQuestionIds: string[]) => void;
  onCardsResolved: (resolvedCardIds: string[]) => void;
}
