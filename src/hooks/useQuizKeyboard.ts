import { useEffect } from "react";

export interface QuizKeyHandlers {
  onSelectOption: (index: 0 | 1 | 2 | 3) => void;
  onSubmit: () => void;
  onNext: () => void;
  isSubmitted: boolean;
  hasSelection: boolean;
}

export function useQuizKeyboard(handlers: QuizKeyHandlers, enabled: boolean = true) {
  const { onSelectOption, onSubmit, onNext, isSubmitted, hasSelection } = handlers;

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

      // Hotkey option selections 1-4 or A-D
      if (!isSubmitted) {
        if (event.code === "Digit1" || event.key === "1" || event.code === "KeyA" || event.key.toLowerCase() === "a") {
          event.preventDefault();
          onSelectOption(0);
          return;
        }
        if (event.code === "Digit2" || event.key === "2" || event.code === "KeyB" || event.key.toLowerCase() === "b") {
          event.preventDefault();
          onSelectOption(1);
          return;
        }
        if (event.code === "Digit3" || event.key === "3" || event.code === "KeyC" || event.key.toLowerCase() === "c") {
          event.preventDefault();
          onSelectOption(2);
          return;
        }
        if (event.code === "Digit4" || event.key === "4" || event.code === "KeyD" || event.key.toLowerCase() === "d") {
          event.preventDefault();
          onSelectOption(3);
          return;
        }
      }

      // Enter key handler
      if (event.code === "Enter" || event.key === "Enter") {
        event.preventDefault();
        if (!isSubmitted) {
          if (hasSelection) {
            onSubmit();
          }
        } else {
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onSelectOption, onSubmit, onNext, isSubmitted, hasSelection]);
}
