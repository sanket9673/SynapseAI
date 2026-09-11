import { useEffect } from "react";

export interface FlashcardKeyHandlers {
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleMastery: () => void;
  onToggleReview: () => void;
  onToggleHint: () => void;
}

export function useFlashcardKeyboard(handlers: FlashcardKeyHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Guard against typing in input/textarea/contenteditable elements
      const target = event.target as HTMLElement;
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName) ||
        target?.isContentEditable
      ) {
        return;
      }

      switch (event.code) {
        case "Space":
        case "Enter":
          event.preventDefault();
          handlers.onFlip();
          break;
        case "ArrowRight":
        case "KeyL":
          event.preventDefault();
          handlers.onNext();
          break;
        case "ArrowLeft":
        case "KeyH":
          event.preventDefault();
          handlers.onPrev();
          break;
        case "KeyM":
          event.preventDefault();
          handlers.onToggleMastery();
          break;
        case "KeyR":
          event.preventDefault();
          handlers.onToggleReview();
          break;
        case "KeyI":
          event.preventDefault();
          handlers.onToggleHint();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers, enabled]);
}
