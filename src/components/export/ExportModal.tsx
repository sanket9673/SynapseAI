"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Copy, Check, X, FileCode } from "lucide-react";
import type { StudySet } from "@/types/study";
import { formatAsMarkdown, formatAsAnkiTSV, downloadFile } from "@/lib/export-utils";
import { Button, Badge } from "@/components/ui";

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-carbon-black/60 backdrop-blur-sm"
          />

          {/* Modal Card Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-2xl bg-paper-white border border-ash rounded-[32px] z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-ash">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-carbon-black">
                    Export Study Deck
                  </h3>
                  <Badge variant="mint" size="sm">
                    {deck.flashcards?.length || 0} Cards
                  </Badge>
                </div>
                <p className="text-xs text-slate truncate max-w-md">
                  {deck.title}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close export dialog"
                className="h-8 w-8 text-smoke hover:text-carbon-black"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Selector & Controls */}
            <div className="px-6 py-3.5 flex items-center justify-between border-b border-ash bg-mist-gray">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("markdown")}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[48px] text-xs font-bold uppercase transition-all select-none ${
                    activeTab === "markdown"
                      ? "bg-carbon-black text-paper-white"
                      : "text-slate hover:text-carbon-black hover:bg-ash/30"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Markdown (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("anki")}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[48px] text-xs font-bold uppercase transition-all select-none ${
                    activeTab === "anki"
                      ? "bg-carbon-black text-paper-white"
                      : "text-slate hover:text-carbon-black hover:bg-ash/30"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Anki Deck (.tsv)</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-smoke hidden sm:inline">
                {activeTab === "markdown"
                  ? "Standard GitHub Markdown"
                  : "Anki-compatible TSV"}
              </span>
            </div>

            {/* Content Preview Box */}
            <div className="p-6 flex-1 overflow-y-auto bg-warm-canvas/20">
              <pre className="p-4 rounded-2xl bg-paper-white border border-ash text-xs font-mono text-slate overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 select-text">
                {activeContent}
              </pre>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-6 border-t border-ash bg-paper-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-smoke">
                {activeTab === "markdown"
                  ? "Formatted for Obsidian, Notion & GitHub."
                  : "Import directly into Anki Desktop via File > Import."}
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleCopy}
                  className={`min-w-[120px] transition-all gap-1.5 ${
                    isCopied
                      ? "bg-mint-chip text-carbon-black border-carbon-black"
                      : ""
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-carbon-black" />
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

