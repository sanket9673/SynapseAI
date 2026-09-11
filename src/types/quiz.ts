import type { QuizQuestion } from "./study";

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: 0 | 1 | 2 | 3;
  correctOptionIndex: 0 | 1 | 2 | 3;
  isCorrect: boolean;
}

export interface QuizSessionState {
  currentIndex: number;
  selectedOptionIndex: (0 | 1 | 2 | 3) | null;
  isSubmitted: boolean;
  answers: Record<string, UserAnswerRecord>;
  wrongQuestionIds: string[];
  isComplete: boolean;
}

export interface QuizEngineProps {
  questions: QuizQuestion[];
  quizTitle: string;
  onQuizComplete?: (summary: {
    total: number;
    correct: number;
    incorrect: number;
    percentage: number;
  }) => void;
  onRetestMissed?: (missedIds: string[]) => void;
}
