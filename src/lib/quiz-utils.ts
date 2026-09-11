import type { QuizQuestion } from "@/types/study";

export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const correctAnswerStr =
    question.correctAnswer ||
    question.options[question.correctOptionIndex] ||
    "";

  const optionsCopy = [...question.options] as [string, string, string, string];
  // Fisher-Yates shuffle
  for (let i = optionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = optionsCopy[i];
    optionsCopy[i] = optionsCopy[j];
    optionsCopy[j] = temp;
  }

  const newCorrectIndex = optionsCopy.findIndex((opt) => opt === correctAnswerStr);

  return {
    ...question,
    options: optionsCopy,
    correctAnswer: correctAnswerStr,
    correctOptionIndex: (newCorrectIndex >= 0 ? newCorrectIndex : question.correctOptionIndex) as
      | 0
      | 1
      | 2
      | 3,
  };
}
