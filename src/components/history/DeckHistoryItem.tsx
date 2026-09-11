"use client";

import React from "react";
import { Trash2, Clock, Layers, HelpCircle } from "lucide-react";
import type { PersistedDeckMetadata } from "@/lib/storage";
import { Badge } from "@/components/ui";

export interface DeckHistoryItemProps {
  deck: PersistedDeckMetadata;
  isActive: boolean;
  onSelect: (deckId: string) => void;
  onDelete: (deckId: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export const DeckHistoryItem: React.FC<DeckHistoryItemProps> = ({
  deck,
  isActive,
  onSelect,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(deck.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(deck.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(deck.id);
        }
      }}
      className={`group relative p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left select-none ${
        isActive
          ? "bg-mist-gray border-carbon-black ring-1 ring-carbon-black"
          : "bg-paper-white hover:bg-mist-gray border-ash"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-carbon-black truncate max-w-[220px]">
              {deck.title}
            </h4>
            {isActive && (
              <Badge variant="mint" size="sm" dot>
                Active
              </Badge>
            )}
          </div>

          {deck.summary && (
            <p className="text-xs text-slate line-clamp-2 leading-relaxed">
              {deck.summary}
            </p>
          )}

          {/* Counts and Time */}
          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-smoke">
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-carbon-black" />
              {deck.cardCount} cards
            </span>

            <span className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-carbon-black" />
              {deck.quizCount} quiz
            </span>

            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(deck.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete deck ${deck.title}`}
          className="opacity-40 group-hover:opacity-100 hover:text-carbon-black p-1.5 rounded-lg hover:bg-ash/30 transition-all shrink-0 text-slate"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

