"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui";

export interface StudyTabsProps {
  activeTab: "flashcards" | "quiz";
  onTabChange: (tab: "flashcards" | "quiz") => void;
  flashcardsCount: number;
  quizCount: number;
}

export const StudyTabs: React.FC<StudyTabsProps> = ({
  activeTab,
  onTabChange,
  flashcardsCount,
  quizCount,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Study modes"
      className="flex items-center gap-2 p-1.5 rounded-xl bg-surface border border-border-dim shadow-subtle max-w-fit"
    >
      {/* Flashcards Tab */}
      <button
        type="button"
        role="tab"
        id="tab-flashcards"
        aria-selected={activeTab === "flashcards"}
        aria-controls="panel-flashcards"
        tabIndex={activeTab === "flashcards" ? 0 : -1}
        onClick={() => onTabChange("flashcards")}
        className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 select-none ${
          activeTab === "flashcards"
            ? "text-white"
            : "text-text-secondary hover:text-text-primary hover:bg-subtle/50"
        }`}
      >
        {activeTab === "flashcards" && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 rounded-lg bg-accent-primary shadow-glow"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>3D Flashcards</span>
          <span
            className={`px-1.5 py-0.2 rounded font-mono text-[11px] ${
              activeTab === "flashcards"
                ? "bg-white/20 text-white"
                : "bg-subtle text-text-tertiary"
            }`}
          >
            {flashcardsCount}
          </span>
        </span>
      </button>

      {/* Quiz Tab */}
      <button
        type="button"
        role="tab"
        id="tab-quiz"
        aria-selected={activeTab === "quiz"}
        aria-controls="panel-quiz"
        tabIndex={activeTab === "quiz" ? 0 : -1}
        onClick={() => onTabChange("quiz")}
        className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 select-none ${
          activeTab === "quiz"
            ? "text-white"
            : "text-text-secondary hover:text-text-primary hover:bg-subtle/50"
        }`}
      >
        {activeTab === "quiz" && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 rounded-lg bg-accent-primary shadow-glow"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Interactive Quiz</span>
          <span
            className={`px-1.5 py-0.2 rounded font-mono text-[11px] ${
              activeTab === "quiz"
                ? "bg-white/20 text-white"
                : "bg-subtle text-text-tertiary"
            }`}
          >
            {quizCount}
          </span>
        </span>
      </button>
    </div>
  );
};
