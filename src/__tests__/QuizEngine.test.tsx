import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import type { QuizQuestion } from "@/types/study";

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary function of the JavaScript Event Loop?",
    options: [
      "To coordinate execution between the call stack, microtask queue, and macrotask queue.",
      "To compile JavaScript code into machine bytecode.",
      "To allocate heap memory for closures and objects.",
      "To manage multi-threaded CPU worker threads automatically.",
    ],
    correctOptionIndex: 0,
    explanation:
      "The Event Loop monitors the call stack and dequeues pending microtasks and macrotasks in order of priority.",
  },
  {
    id: "q2",
    question: "Which of the following operations executes in the microtask queue?",
    options: [
      "setTimeout callback",
      "Promise.then resolution callback",
      "setInterval timer callback",
      "setImmediate callback",
    ],
    correctOptionIndex: 1,
    explanation:
      "Promise reactions, queueMicrotask, and MutationObservers resolve in the microtask queue before macrotasks.",
  },
];

describe("QuizEngine Component", () => {
  it("renders the first question and 4 options accurately", () => {
    render(<QuizEngine questions={mockQuestions} quizTitle="JavaScript Concurrency Quiz" />);

    expect(
      screen.getByText("What is the primary function of the JavaScript Event Loop?")
    ).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument();

    // 4 options
    expect(
      screen.getByText(
        "To coordinate execution between the call stack, microtask queue, and macrotask queue."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("To compile JavaScript code into machine bytecode.")
    ).toBeInTheDocument();

    // Submit button is disabled before an option is selected
    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    expect(submitBtn).toBeDisabled();
  });

  it("updates option selection and enables submit button", () => {
    render(<QuizEngine questions={mockQuestions} quizTitle="JavaScript Concurrency Quiz" />);

    const optionA = screen.getByLabelText(/Option A:/i);
    fireEvent.click(optionA);

    expect(optionA).toHaveAttribute("aria-pressed", "true");

    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("submits correct option, shows success feedback and explanation", () => {
    render(<QuizEngine questions={mockQuestions} quizTitle="JavaScript Concurrency Quiz" />);

    const optionA = screen.getByLabelText(/Option A:/i);
    fireEvent.click(optionA);

    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    fireEvent.click(submitBtn);

    // Success feedback
    expect(screen.getByText(/Outstanding recall\. Correct!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The Event Loop monitors the call stack/i)
    ).toBeInTheDocument();

    // Next question button appears
    expect(screen.getByRole("button", { name: /Next Question/i })).toBeInTheDocument();
  });

  it("submits incorrect option, highlights error and reveals true correct answer", () => {
    render(<QuizEngine questions={mockQuestions} quizTitle="JavaScript Concurrency Quiz" />);

    // Select Option B (Incorrect)
    const optionB = screen.getByLabelText(/Option B:/i);
    fireEvent.click(optionB);

    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    fireEvent.click(submitBtn);

    // Error feedback
    expect(screen.getByText(/Incorrect\. Key concept to review:/i)).toBeInTheDocument();
  });

  it("drives full quiz navigation via keyboard shortcuts 1-4 and Enter", () => {
    render(<QuizEngine questions={mockQuestions} quizTitle="JavaScript Concurrency Quiz" />);

    // Press key "1" to select Option A
    fireEvent.keyDown(window, { code: "Digit1", key: "1" });

    // Press Enter to Submit Question 1
    fireEvent.keyDown(window, { code: "Enter", key: "Enter" });
    expect(screen.getByText(/Outstanding recall\. Correct!/i)).toBeInTheDocument();

    // Press Enter to Advance to Question 2
    fireEvent.keyDown(window, { code: "Enter", key: "Enter" });
    expect(
      screen.getByText("Which of the following operations executes in the microtask queue?")
    ).toBeInTheDocument();
    expect(screen.getByText(/Question 2 of 2/i)).toBeInTheDocument();

    // Press key "2" to select Option B
    fireEvent.keyDown(window, { code: "Digit2", key: "2" });

    // Press Enter to Submit Question 2
    fireEvent.keyDown(window, { code: "Enter", key: "Enter" });
    expect(screen.getByText(/View Results/i)).toBeInTheDocument();

    // Press Enter to View Results
    fireEvent.keyDown(window, { code: "Enter", key: "Enter" });

    // Score Summary Screen
    expect(screen.getByText(/Quiz Assessment Completed!/i)).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Mastery Achieved")).toBeInTheDocument();
  });

  it("displays score summary with retest missed option when some answers are wrong", async () => {
    const onQuizComplete = vi.fn();
    render(
      <QuizEngine
        questions={mockQuestions}
        quizTitle="JavaScript Concurrency Quiz"
        onQuizComplete={onQuizComplete}
      />
    );

    // Question 1: Pick correct (A)
    fireEvent.click(screen.getByLabelText(/Option A:/i));
    fireEvent.click(screen.getByRole("button", { name: /Submit Answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/i }));

    // Question 2: Pick wrong (A instead of B)
    fireEvent.click(screen.getByLabelText(/Option A:/i));
    fireEvent.click(screen.getByRole("button", { name: /Submit Answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /View Results/i }));

    // Verify summary calculations: 1 / 2 = 50%
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Needs Reinforcement")).toBeInTheDocument();

    // Retest wrong answers button exists
    const retestBtn = screen.getByRole("button", {
      name: /Re-test Wrong Answers Only \(1\)/i,
    });
    expect(retestBtn).toBeInTheDocument();

    // Click retest
    fireEvent.click(retestBtn);

    // Retest question 2 starts
    expect(
      screen.getByText("Which of the following operations executes in the microtask queue?")
    ).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 1/i)).toBeInTheDocument();

    expect(onQuizComplete).toHaveBeenCalledWith({
      total: 2,
      correct: 1,
      incorrect: 1,
      percentage: 50,
    });
  });
});
