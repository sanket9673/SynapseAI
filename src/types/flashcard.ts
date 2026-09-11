import type { Flashcard } from "./study";

export type MasteryStatus = "unseen" | "mastered" | "needs-review";

export interface CardMasteryMap {
  [cardId: string]: MasteryStatus;
}

export interface FlashcardDeckProps {
  cards: Flashcard[];
  deckTitle: string;
  onDeckComplete?: (stats: { masteredCount: number; reviewCount: number }) => void;
  onResetDeck?: () => void;
}

export interface FlashcardItemProps {
  card: Flashcard;
  cardNumber: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  masteryStatus: MasteryStatus;
  onSetMastery: (status: MasteryStatus) => void;
}
