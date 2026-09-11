"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Sparkles, Layers, HelpCircle, Globe } from "lucide-react";
import { Kbd, Button, Card } from "@/components/ui";

export interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  label: string;
  keys: string[];
}

interface ShortcutSection {
  title: string;
  icon: React.ReactNode;
  shortcuts: ShortcutRow[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: "Global Commands",
    icon: <Globe className="h-4 w-4 text-accent-primary" />,
    shortcuts: [
      { label: "Open Command Palette", keys: ["⌘", "K"] },
      { label: "Show Keyboard Shortcuts", keys: ["?"] },
      { label: "Generate Active Recall Deck", keys: ["⌘", "Enter"] },
      { label: "Close Modal / Drawer", keys: ["Esc"] },
    ],
  },
  {
    title: "3D Flashcard Deck",
    icon: <Layers className="h-4 w-4 text-accent-primary" />,
    shortcuts: [
      { label: "Flip Active Card", keys: ["Space"] },
      { label: "Navigate Previous / Next", keys: ["←", "→"] },
      { label: "Mark as Mastered", keys: ["M"] },
      { label: "Mark for Review", keys: ["R"] },
      { label: "Reveal Pedagogical Hint", keys: ["I"] },
    ],
  },
  {
    title: "Interactive Quiz Engine",
    icon: <HelpCircle className="h-4 w-4 text-accent-primary" />,
    shortcuts: [
      { label: "Select Option A, B, C, or D", keys: ["1-4", "or", "A-D"] },
      { label: "Submit Answer / Next Question", keys: ["Enter ↵"] },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-xl bg-paper-white border border-ash/80 rounded-[32px] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-ash/40 bg-paper-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-mint-chip text-carbon-black border border-mint-chip">
                  <Keyboard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-carbon-black uppercase font-mono">
                    Keyboard Shortcuts Reference
                  </h3>
                  <p className="text-[11px] font-mono text-smoke">
                    Hardware-accelerated sub-300ms navigation
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close shortcuts modal"
                className="h-8 w-8 text-smoke hover:text-carbon-black rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Sections */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {SHORTCUT_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>

                  <div className="space-y-1.5 rounded-2xl border border-ash/40 bg-mist-gray p-3 sm:p-4">
                    {section.shortcuts.map((shortcut) => (
                      <div
                        key={shortcut.label}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs"
                      >
                        <span className="text-slate font-medium">{shortcut.label}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((k) => (
                            <Kbd key={k} keys={[k]} className="text-[11px] bg-paper-white border-ash text-carbon-black" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3.5 px-5 border-t border-ash/40 bg-mist-gray/60 text-center text-xs text-smoke font-mono font-medium">
              Press <Kbd keys={["Esc"]} className="text-[10px]" /> or click outside to dismiss
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
