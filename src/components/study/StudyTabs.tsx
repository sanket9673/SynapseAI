"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, HelpCircle } from "lucide-react";

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
      className="flex items-center gap-1.5 p-1.5 rounded-[48px] bg-mist-gray border border-ash/60 max-w-fit"
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
        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-[48px] text-xs sm:text-sm font-bold uppercase tracking-tight transition-colors duration-150 select-none ${
          activeTab === "flashcards"
            ? "text-paper-white"
            : "text-slate hover:text-carbon-black hover:bg-ash/30"
        }`}
      >
        {activeTab === "flashcards" && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 rounded-[48px] bg-carbon-black"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>3D Flashcards</span>
          <span
            className={`px-2 py-0.5 rounded-[64px] font-mono text-[11px] font-bold ${
              activeTab === "flashcards"
                ? "bg-paper-white/20 text-paper-white"
                : "bg-ash/40 text-slate"
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
        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-[48px] text-xs sm:text-sm font-bold uppercase tracking-tight transition-colors duration-150 select-none ${
          activeTab === "quiz"
            ? "text-paper-white"
            : "text-slate hover:text-carbon-black hover:bg-ash/30"
        }`}
      >
        {activeTab === "quiz" && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 rounded-[48px] bg-carbon-black"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Interactive Quiz</span>
          <span
            className={`px-2 py-0.5 rounded-[64px] font-mono text-[11px] font-bold ${
              activeTab === "quiz"
                ? "bg-paper-white/20 text-paper-white"
                : "bg-ash/40 text-slate"
            }`}
          >
            {quizCount}
          </span>
        </span>
      </button>
    </div>
  );
};
