"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, BookOpen } from "lucide-react";
import { deckStorage, type PersistedDeckMetadata } from "@/lib/storage";
import { DeckHistoryItem } from "./DeckHistoryItem";
import { Button } from "@/components/ui";

export interface DeckHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDeckId: string | null;
  onSelectDeck: (deckId: string) => void;
  onDeleteDeck: (deckId: string) => void;
  onClearAll?: () => void;
}

export const DeckHistoryDrawer: React.FC<DeckHistoryDrawerProps> = ({
  isOpen,
  onClose,
  activeDeckId,
  onSelectDeck,
  onDeleteDeck,
  onClearAll,
}) => {
  const [decks, setDecks] = useState<PersistedDeckMetadata[]>([]);

  const refreshDecks = useCallback(() => {
    setDecks(deckStorage.getAllDeckSummaries());
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshDecks();
    }
  }, [isOpen, refreshDecks]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDelete = (id: string) => {
    deckStorage.deleteDeck(id);
    onDeleteDeck(id);
    refreshDecks();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all study deck history?")) {
      deckStorage.clearAllDecks();
      onClearAll?.();
      refreshDecks();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-carbon-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-paper-white border-l border-ash z-50 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-ash bg-paper-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-mint-chip text-carbon-black">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-carbon-black">
                    Study Deck History
                  </h3>
                  <p className="text-[11px] font-mono text-smoke">
                    {decks.length} {decks.length === 1 ? "session" : "sessions"} saved locally
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {decks.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearAll}
                    className="text-xs text-smoke hover:text-carbon-black"
                    title="Clear all saved history"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  aria-label="Close history drawer"
                  className="h-8 w-8 text-smoke hover:text-carbon-black"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Decks List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-warm-canvas/30">
              {decks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-smoke">
                  <div className="p-3 rounded-2xl bg-paper-white border border-ash">
                    <BookOpen className="h-8 w-8 text-slate opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase text-carbon-black">
                      No Past Sessions
                    </h4>
                    <p className="text-xs text-slate max-w-xs leading-relaxed">
                      Decks generated with the AI active recall engine will automatically save here for offline review.
                    </p>
                  </div>
                </div>
              ) : (
                decks.map((deck) => (
                  <DeckHistoryItem
                    key={deck.id}
                    deck={deck}
                    isActive={deck.id === activeDeckId}
                    onSelect={(id) => {
                      onSelectDeck(id);
                      onClose();
                    }}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

