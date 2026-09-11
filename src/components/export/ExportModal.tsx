"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Copy, Check, X, FileCode } from "lucide-react";
import type { StudySet } from "@/types/study";
import { formatAsMarkdown, formatAsAnkiTSV, downloadFile } from "@/lib/export-utils";
import { Button, Card, Badge } from "@/components/ui";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: StudySet;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, deck }) => {
  const [activeTab, setActiveTab] = useState<"markdown" | "anki">("markdown");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const markdownContent = useMemo(() => formatAsMarkdown(deck), [deck]);
  const ankiContent = useMemo(() => formatAsAnkiTSV(deck), [deck]);

  const activeContent = activeTab === "markdown" ? markdownContent : ankiContent;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = activeContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const slug = (deck.title || "study-deck")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (activeTab === "markdown") {
      downloadFile(`${slug || "synapse-deck"}.md`, markdownContent, "text/markdown");
    } else {
      downloadFile(
        `${slug || "synapse-deck"}-anki.tsv`,
        ankiContent,
        "text/tab-separated-values"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-2xl bg-surface border border-border-dim rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-dim">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    Export Study Deck
                  </h3>
                  <Badge variant="accent" size="sm">
                    {deck.flashcards?.length || 0} Cards
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary truncate max-w-md">
                  {deck.title}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close export dialog"
                className="h-8 w-8 text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Selector & Controls */}
            <div className="px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between border-b border-border-dim bg-subtle/30">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("markdown")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                    activeTab === "markdown"
                      ? "bg-accent-primary text-white shadow-glow"
                      : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Markdown (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("anki")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                    activeTab === "anki"
                      ? "bg-accent-primary text-white shadow-glow"
                      : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Anki Deck (.tsv)</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-text-tertiary hidden sm:inline">
                {activeTab === "markdown"
                  ? "Standard GitHub Markdown"
                  : "Anki-compatible TSV"}
              </span>
            </div>

            {/* Content Preview Box */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-app border border-border-dim text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
                {activeContent}
              </pre>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 sm:p-6 border-t border-border-dim bg-surface/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-text-tertiary">
                {activeTab === "markdown"
                  ? "Formatted for Obsidian, Notion & GitHub."
                  : "Import directly into Anki Desktop via File > Import."}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleCopy}
                  className={`min-w-[120px] transition-all gap-1.5 ${
                    isCopied
                      ? "bg-success text-white border-success hover:bg-success hover:border-success shadow-glow scale-[1.03]"
                      : ""
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Text</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {activeTab === "markdown" ? ".md" : ".tsv"}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
