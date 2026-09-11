import { useReducer, useCallback } from "react";
import type { QuizQuestion } from "@/types/study";
import type { QuizSessionState, UserAnswerRecord } from "@/types/quiz";

type QuizAction =
  | { type: "SELECT_OPTION"; optionIndex: 0 | 1 | 2 | 3 }
  | { type: "SUBMIT_ANSWER"; currentQuestion: QuizQuestion }
  | { type: "NEXT_QUESTION"; totalQuestions: number }
  | { type: "RESTART_QUIZ" };

const initialState: QuizSessionState = {
  currentIndex: 0,
  selectedOptionIndex: null,
  isSubmitted: false,
  answers: {},
  wrongQuestionIds: [],
  isComplete: false,
};

function quizReducer(state: QuizSessionState, action: QuizAction): QuizSessionState {
  switch (action.type) {
    case "SELECT_OPTION": {
      if (state.isSubmitted) return state;
      return {
        ...state,
        selectedOptionIndex: action.optionIndex,
      };
    }

    case "SUBMIT_ANSWER": {
      if (state.isSubmitted || state.selectedOptionIndex === null) return state;

      const { currentQuestion } = action;
      const isCorrect = state.selectedOptionIndex === currentQuestion.correctOptionIndex;
      const record: UserAnswerRecord = {
        questionId: currentQuestion.id,
        selectedOptionIndex: state.selectedOptionIndex,
        correctOptionIndex: currentQuestion.correctOptionIndex,
        isCorrect,
      };

      const nextWrong = isCorrect
        ? state.wrongQuestionIds
        : Array.from(new Set([...state.wrongQuestionIds, currentQuestion.id]));

      return {
        ...state,
        isSubmitted: true,
        answers: {
          ...state.answers,
          [currentQuestion.id]: record,
        },
        wrongQuestionIds: nextWrong,
      };
    }

    case "NEXT_QUESTION": {
      if (!state.isSubmitted) return state;

      if (state.currentIndex + 1 >= action.totalQuestions) {
        return {
          ...state,
          isComplete: true,
        };
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedOptionIndex: null,
        isSubmitted: false,
      };
    }

    case "RESTART_QUIZ": {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}

export function useQuizState(initialQuestionsCount: number = 0) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const selectOption = useCallback((optionIndex: 0 | 1 | 2 | 3) => {
    dispatch({ type: "SELECT_OPTION", optionIndex });
  }, []);

  const submitAnswer = useCallback((currentQuestion: QuizQuestion) => {
    dispatch({ type: "SUBMIT_ANSWER", currentQuestion });
  }, []);

  const nextQuestion = useCallback((totalQuestions: number) => {
    dispatch({ type: "NEXT_QUESTION", totalQuestions });
  }, []);

  const restartQuiz = useCallback(() => {
    dispatch({ type: "RESTART_QUIZ" });
  }, []);

  return {
    state,
    selectOption,
    submitAnswer,
    nextQuestion,
    restartQuiz,
  };
}
