import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RetestEngine } from "@/components/retest/RetestEngine";
import type { StudySet } from "@/types/study";

const mockStudySet: StudySet = {
  id: "set-1",
  title: "Test Study Set",
  summary: "Testing weakness remediation",
  createdAt: Date.now(),
  sourceTextSnippet: "Snippet for tests",
  questions: [
    {
      id: "q1",
      question: "What is 2 + 2?",
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctOptionIndex: 1,
      correctAnswer: "4",
      explanation: "Basic addition math.",
    },
    {
      id: "q2",
      question: "What is capital of France?",
      text: "What is capital of France?",
      options: ["London", "Berlin", "Paris", "Rome"],
      correctOptionIndex: 2,
      correctAnswer: "Paris",
      explanation: "Geography fact.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "What is 2 + 2?",
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctOptionIndex: 1,
      correctAnswer: "4",
      explanation: "Basic addition math.",
    },
    {
      id: "q2",
      question: "What is capital of France?",
      text: "What is capital of France?",
      options: ["London", "Berlin", "Paris", "Rome"],
      correctOptionIndex: 2,
      correctAnswer: "Paris",
      explanation: "Geography fact.",
    },
  ],
  flashcards: [
    {
      id: "c1",
      front: "React Hook",
      back: "useState",
    },
  ],
};

describe("RetestEngine Remediation Workflow", () => {
  it("correctly initializes with only failed question IDs and flagged cards", () => {
    const handleDismiss = vi.fn();
    const handleQResolved = vi.fn();
    const handleCResolved = vi.fn();

    render(
      <RetestEngine
        studySet={mockStudySet}
        wrongQuestionIds={["q1"]}
        flaggedCardIds={["c1"]}
        onDismiss={handleDismiss}
        onQuestionsResolved={handleQResolved}
        onCardsResolved={handleCResolved}
      />
    );

    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.queryByText("What is capital of France?")).not.toBeInTheDocument();
    expect(screen.getByText("Remediation Progress")).toBeInTheDocument();
  });

  it("re-queues question when answered incorrectly", async () => {
    render(
      <RetestEngine
        studySet={mockStudySet}
        wrongQuestionIds={["q1"]}
        flaggedCardIds={[]}
        onDismiss={() => {}}
        onQuestionsResolved={() => {}}
        onCardsResolved={() => {}}
      />
    );

    const wrongOption = screen.getByText("3");
    fireEvent.click(wrongOption);

    // Explanation should display for incorrect answer
    await waitFor(() => {
      expect(screen.getByText(/Review Explanation:/i)).toBeInTheDocument();
    });
  });

  it("removes item from queue and triggers callback when answered correctly", async () => {
    const handleQResolved = vi.fn();

    render(
      <RetestEngine
        studySet={mockStudySet}
        wrongQuestionIds={["q1"]}
        flaggedCardIds={[]}
        onDismiss={() => {}}
        onQuestionsResolved={handleQResolved}
        onCardsResolved={() => {}}
      />
    );

    const correctOption = screen.getByText("4");
    fireEvent.click(correctOption);

    await waitFor(
      () => {
        expect(handleQResolved).toHaveBeenCalledWith(["q1"]);
      },
      { timeout: 2000 }
    );
  });

  it("handles flagged flashcard drill and transitions to victory when all resolved", async () => {
    const handleCResolved = vi.fn();
    const handleDismiss = vi.fn();

    render(
      <RetestEngine
        studySet={mockStudySet}
        wrongQuestionIds={[]}
        flaggedCardIds={["c1"]}
        onDismiss={handleDismiss}
        onQuestionsResolved={() => {}}
        onCardsResolved={handleCResolved}
      />
    );

    expect(screen.getByText("Flagged Flashcard Drill")).toBeInTheDocument();
    expect(screen.getByText("React Hook")).toBeInTheDocument();
    expect(screen.getByText("useState")).toBeInTheDocument();

    const markMasteredBtn = screen.getByRole("button", {
      name: /I've Got It Now \(Mark Mastered\)/i,
    });
    fireEvent.click(markMasteredBtn);

    expect(handleCResolved).toHaveBeenCalledWith(["c1"]);

    // Victory celebration view
    await waitFor(() => {
      expect(screen.getByText("All Knowledge Gaps Resolved!")).toBeInTheDocument();
      expect(screen.getByText("100% Comprehension Achieved")).toBeInTheDocument();
    });
  });
});
