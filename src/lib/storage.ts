import type { StudySet } from "@/types/study";

export interface PersistedDeckMetadata {
  id: string;
  title: string;
  summary: string;
  cardCount: number;
  quizCount: number;
  createdAt: number;
}

export interface DeckStorageService {
  saveDeck: (deck: StudySet) => boolean;
  getDeckById: (id: string) => StudySet | null;
  getAllDeckSummaries: () => PersistedDeckMetadata[];
  deleteDeck: (id: string) => boolean;
  clearAllDecks: () => void;
}

const INDEX_KEY = "synapse_index_v1";
const DECK_PREFIX = "synapse_deck_";

class LocalDeckStorageService implements DeckStorageService {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  public getAllDeckSummaries(): PersistedDeckMetadata[] {
    if (!this.isBrowser()) return [];

    try {
      const rawIndex = localStorage.getItem(INDEX_KEY);
      if (!rawIndex) return [];
      const parsed: PersistedDeckMetadata[] = JSON.parse(rawIndex);
      return Array.isArray(parsed)
        ? parsed.sort((a, b) => b.createdAt - a.createdAt)
        : [];
    } catch {
      return [];
    }
  }

  public getDeckById(id: string): StudySet | null {
    if (!this.isBrowser() || !id) return null;

    try {
      const rawDeck = localStorage.getItem(`${DECK_PREFIX}${id}`);
      if (!rawDeck) return null;
      return JSON.parse(rawDeck) as StudySet;
    } catch {
      return null;
    }
  }

  public saveDeck(deck: StudySet): boolean {
    if (!this.isBrowser() || !deck || !deck.id) return false;

    const metadata: PersistedDeckMetadata = {
      id: deck.id,
      title: deck.title || "Untitled Study Set",
      summary: deck.summary || "",
      cardCount: deck.flashcards?.length || 0,
      quizCount: (deck.quiz?.length || deck.questions?.length || 0),
      createdAt: deck.createdAt || Date.now(),
    };

    const attemptSave = (): boolean => {
      // 1. Save individual deck
      localStorage.setItem(`${DECK_PREFIX}${deck.id}`, JSON.stringify(deck));

      // 2. Update index
      const existingSummaries = this.getAllDeckSummaries().filter((s) => s.id !== deck.id);
      const updatedIndex = [metadata, ...existingSummaries];
      localStorage.setItem(INDEX_KEY, JSON.stringify(updatedIndex));
      return true;
    };

    try {
      return attemptSave();
    } catch (err: unknown) {
      // Handle QuotaExceededError by evicting oldest unpinned deck
      if (
        err instanceof DOMException &&
        (err.name === "QuotaExceededError" || err.code === 22)
      ) {
        const summaries = this.getAllDeckSummaries();
        if (summaries.length > 0) {
          // Evict oldest deck
          const oldest = summaries[summaries.length - 1];
          this.deleteDeck(oldest.id);
          try {
            return attemptSave();
          } catch {
            return false;
          }
        }
      }
      return false;
    }
  }

  public deleteDeck(id: string): boolean {
    if (!this.isBrowser() || !id) return false;

    try {
      localStorage.removeItem(`${DECK_PREFIX}${id}`);
      const summaries = this.getAllDeckSummaries().filter((s) => s.id !== id);
      localStorage.setItem(INDEX_KEY, JSON.stringify(summaries));
      return true;
    } catch {
      return false;
    }
  }

  public clearAllDecks(): void {
    if (!this.isBrowser()) return;

    try {
      const summaries = this.getAllDeckSummaries();
      summaries.forEach((s) => {
        localStorage.removeItem(`${DECK_PREFIX}${s.id}`);
      });
      localStorage.removeItem(INDEX_KEY);
    } catch {
      // Ignore cleanup error
    }
  }
}

export const deckStorage: DeckStorageService = new LocalDeckStorageService();
