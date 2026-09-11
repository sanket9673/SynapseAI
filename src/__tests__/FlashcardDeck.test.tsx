import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FlashcardDeck } from "@/components/study/FlashcardDeck";
import type { Flashcard } from "@/types/study";

const mockCards: Flashcard[] = [
  {
    id: "c1",
    front: "What is React?",
    back: "A JavaScript library for building user interfaces.",
    category: "Core Concepts",
    hint: "Component based architecture",
  },
  {
    id: "c2",
    front: "What is Tailwind CSS?",
    back: "A utility-first CSS framework.",
    category: "Styling",
  },
];

describe("FlashcardDeck Component", () => {
  it("renders the first card concept on mount", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);
    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getAllByText("1 / 2")[0]).toBeInTheDocument();
    expect(screen.getByText("Core Concepts")).toBeInTheDocument();
  });

  it("reveals hint when hint button is clicked", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);
    const hintButton = screen.getByRole("button", { name: /Reveal Hint/i });
    fireEvent.click(hintButton);

    expect(screen.getByText(/Component based architecture/i)).toBeInTheDocument();
  });

  it("flips card from front to back on click", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);
    const frontText = screen.getByText("What is React?");
    fireEvent.click(frontText);

    // Back face contains the explanation text
    expect(
      screen.getByText("A JavaScript library for building user interfaces.")
    ).toBeInTheDocument();
  });

  it("navigates to next card when next button is clicked", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText("What is Tailwind CSS?")).toBeInTheDocument();
    expect(screen.getAllByText("2 / 2")[0]).toBeInTheDocument();
  });

  it("responds to Space key to flip card", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);
    fireEvent.keyDown(window, { code: "Space" });

    expect(
      screen.getByText("A JavaScript library for building user interfaces.")
    ).toBeInTheDocument();
  });

  it("updates mastery count and advances on marking mastered", async () => {
    const onDeckComplete = vi.fn();
    render(
      <FlashcardDeck
        cards={mockCards}
        deckTitle="Test Deck"
        onDeckComplete={onDeckComplete}
      />
    );

    // Flip to back first to reveal mastery buttons
    fireEvent.click(screen.getByText("What is React?"));

    const masteredButton = screen.getByRole("button", { name: /Got It \/ Mastered/i });
    fireEvent.click(masteredButton);

    // Should auto-advance after 250ms timeout to card #2
    await waitFor(
      () => {
        expect(screen.getByText("What is Tailwind CSS?")).toBeInTheDocument();
      },
      { timeout: 600 }
    );
  });

  it("displays completion screen when last card is mastered", async () => {
    const onDeckComplete = vi.fn();
    render(
      <FlashcardDeck
        cards={mockCards}
        deckTitle="Test Deck"
        onDeckComplete={onDeckComplete}
      />
    );

    // Complete Card 1
    fireEvent.click(screen.getByText("What is React?"));
    fireEvent.click(screen.getByRole("button", { name: /Got It \/ Mastered/i }));

    await waitFor(
      () => {
        expect(screen.getByText("What is Tailwind CSS?")).toBeInTheDocument();
      },
      { timeout: 600 }
    );

    // Complete Card 2 with Needs Review
    fireEvent.click(screen.getByText("What is Tailwind CSS?"));
    fireEvent.click(screen.getByRole("button", { name: /Needs Review/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Deck Completed!/i)).toBeInTheDocument();
        expect(screen.getByText("Study Deck Again")).toBeInTheDocument();
      },
      { timeout: 600 }
    );
  });

  it("handles shuffle and reset toolbar actions", () => {
    render(<FlashcardDeck cards={mockCards} deckTitle="Test Deck" />);

    const shuffleButton = screen.getByRole("button", { name: /shuffle/i });
    fireEvent.click(shuffleButton);

    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);

    expect(screen.getByText("What is React?")).toBeInTheDocument();
  });
});
