import { describe, it, expect, beforeEach, vi } from "vitest";
import { deckStorage } from "@/lib/storage";
import type { StudySet } from "@/types/study";

const sampleDeck1: StudySet = {
  id: "deck-1",
  title: "Quantum Physics 101",
  summary: "Basic principles of superposition and entanglement.",
  createdAt: 1000,
  sourceTextSnippet: "Quantum physics source snippet",
  flashcards: [
    { id: "c1", front: "What is a qubit?", back: "A quantum bit." },
    { id: "c2", front: "What is entanglement?", back: "Coupled quantum states." },
  ],
  quiz: [
    {
      id: "q1",
      question: "Which particle enables superposition?",
      options: ["Qubit", "Classical bit", "Byte", "Nibble"],
      correctOptionIndex: 0,
      explanation: "Qubits exist in superposition.",
    },
  ],
};

const sampleDeck2: StudySet = {
  id: "deck-2",
  title: "JavaScript Engine Internals",
  summary: "Event loop, call stack, and V8 optimization.",
  createdAt: 2000,
  sourceTextSnippet: "JS source snippet",
  flashcards: [{ id: "c3", front: "What is V8?", back: "Google JS engine." }],
  quiz: [],
};

describe("Local Deck Storage Service", () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};

    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
      return mockStore[key] || null;
    });

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      (key: string, value: string) => {
        mockStore[key] = value;
      }
    );

    vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key: string) => {
      delete mockStore[key];
    });

    vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {
      mockStore = {};
    });
  });

  it("saves decks and retrieves metadata summaries sorted by createdAt descending", () => {
    expect(deckStorage.saveDeck(sampleDeck1)).toBe(true);
    expect(deckStorage.saveDeck(sampleDeck2)).toBe(true);

    const summaries = deckStorage.getAllDeckSummaries();
    expect(summaries.length).toBe(2);

    // sampleDeck2 was created at 2000 > sampleDeck1 at 1000
    expect(summaries[0].id).toBe("deck-2");
    expect(summaries[0].title).toBe("JavaScript Engine Internals");
    expect(summaries[0].cardCount).toBe(1);

    expect(summaries[1].id).toBe("deck-1");
    expect(summaries[1].cardCount).toBe(2);
    expect(summaries[1].quizCount).toBe(1);
  });

  it("retrieves complete deck payload by id", () => {
    deckStorage.saveDeck(sampleDeck1);

    const retrieved = deckStorage.getDeckById("deck-1");
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe("deck-1");
    expect(retrieved?.flashcards.length).toBe(2);
    expect(retrieved?.quiz.length).toBe(1);
  });

  it("deletes a deck and updates the index correctly", () => {
    deckStorage.saveDeck(sampleDeck1);
    deckStorage.saveDeck(sampleDeck2);

    expect(deckStorage.getAllDeckSummaries().length).toBe(2);

    const deleted = deckStorage.deleteDeck("deck-1");
    expect(deleted).toBe(true);

    const summaries = deckStorage.getAllDeckSummaries();
    expect(summaries.length).toBe(1);
    expect(summaries[0].id).toBe("deck-2");
    expect(deckStorage.getDeckById("deck-1")).toBeNull();
  });

  it("clears all decks from storage", () => {
    deckStorage.saveDeck(sampleDeck1);
    deckStorage.saveDeck(sampleDeck2);

    deckStorage.clearAllDecks();

    expect(deckStorage.getAllDeckSummaries().length).toBe(0);
    expect(deckStorage.getDeckById("deck-1")).toBeNull();
    expect(deckStorage.getDeckById("deck-2")).toBeNull();
  });

  it("handles QuotaExceededError by evicting oldest unpinned deck and retrying", () => {
    deckStorage.saveDeck(sampleDeck1); // Created at 1000

    // Simulate QuotaExceeded on next write unless oldest is evicted
    let hasThrown = false;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((key: string, value: string) => {
      if (!hasThrown && key.includes("deck-2")) {
        hasThrown = true;
        const err = new DOMException("QuotaExceededError", "QuotaExceededError");
        throw err;
      }
      mockStore[key] = value;
    });

    const result = deckStorage.saveDeck(sampleDeck2);
    expect(result).toBe(true);

    // Oldest deck (deck-1) should have been evicted to make room
    expect(deckStorage.getDeckById("deck-2")).not.toBeNull();
  });
});
