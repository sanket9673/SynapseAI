"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowUpDown, CornerDownLeft, X } from "lucide-react";
import type { CommandAction } from "@/types/palette";
import { Kbd } from "@/components/ui";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  actions,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter actions based on query
  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const lower = query.toLowerCase().trim();

    return actions.filter((action) => {
      const matchTitle = action.title.toLowerCase().includes(lower);
      const matchDesc = action.description?.toLowerCase().includes(lower);
      const matchCat = action.category.toLowerCase().includes(lower);
      const matchKeywords = action.keywords?.some((k) => k.toLowerCase().includes(lower));
      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [actions, query]);

  // Reset selection index when filtered actions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev + 1 >= filteredActions.length ? 0 : prev + 1
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? Math.max(0, filteredActions.length - 1) : prev - 1
        );
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredActions[selectedIndex];
        if (selected) {
          selected.perform();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl && typeof activeEl.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[15vh] px-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative w-full max-w-xl bg-paper-white border border-ash/80 rounded-[32px] shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-ash/40 bg-paper-white">
              <Search className="h-4 w-4 text-slate shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search action..."
                className="w-full bg-transparent text-sm text-carbon-black placeholder:text-smoke focus:outline-none font-medium"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear query"
                  className="p-1 rounded-md text-smoke hover:text-carbon-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <Kbd keys={["Esc"]} className="text-[10px]" />
            </div>

            {/* Results Action List */}
            <div
              ref={listRef}
              className="max-h-[340px] overflow-y-auto p-3 space-y-1 divide-y divide-transparent"
            >
              {filteredActions.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-smoke space-y-1">
                  <div>No matching actions found for &ldquo;{query}&rdquo;</div>
                  <div className="text-[11px] opacity-70">Try searching for &ldquo;deck&rdquo;, &ldquo;quiz&rdquo;, or &ldquo;history&rdquo;</div>
                </div>
              ) : (
                filteredActions.map((action, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={action.id}
                      data-index={idx}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        action.perform();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl cursor-pointer select-none transition-colors text-xs ${
                        isSelected
                          ? "bg-carbon-black text-paper-white"
                          : "hover:bg-mist-gray text-carbon-black"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-mist-gray text-slate border border-ash/40"
                          }`}
                        >
                          {action.icon}
                        </span>

                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">
                            {action.title}
                          </div>
                          {action.description && (
                            <div
                              className={`text-[11px] truncate ${
                                isSelected ? "text-paper-white/80" : "text-smoke"
                              }`}
                            >
                              {action.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-[64px] font-semibold ${
                            isSelected
                              ? "bg-paper-white/20 text-paper-white"
                              : "bg-mist-gray text-slate border border-ash/40"
                          }`}
                        >
                          {action.category}
                        </span>

                        {action.shortcut && (
                          <div className="hidden sm:flex items-center gap-1">
                            {action.shortcut.map((key) => (
                              <Kbd
                                key={key}
                                keys={[key]}
                                className={`text-[10px] ${
                                  isSelected ? "bg-white/20 text-white border-white/30" : ""
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="p-3 px-5 border-t border-ash/40 bg-mist-gray/60 flex items-center justify-between text-[11px] font-mono text-smoke">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-slate">
                  <ArrowUpDown className="h-3 w-3" /> Navigate
                </span>
                <span className="flex items-center gap-1 font-bold text-slate">
                  <CornerDownLeft className="h-3 w-3" /> Select
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate">Raycast-Grade Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
