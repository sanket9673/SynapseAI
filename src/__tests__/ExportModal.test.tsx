import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportModal } from "@/components/export/ExportModal";
import { formatAsMarkdown, formatAsAnkiTSV } from "@/lib/export-utils";
import type { StudySet } from "@/types/study";

const mockDeck: StudySet = {
  id: "deck-export-1",
  title: "Cellular Respiration Review",
  summary: "Comprehensive breakdown of glycolysis, citric acid cycle, and oxidative phosphorylation.",
  createdAt: Date.now(),
  sourceTextSnippet: "Cellular respiration excerpt...",
  flashcards: [
    {
      id: "c1",
      front: "Where does glycolysis occur?",
      back: "In the cytosol of the cell.",
      hint: "Cytoplasm",
      category: "Cell Biology",
    },
    {
      id: "c2",
      front: "What is the net ATP yield of glycolysis?",
      back: "2 ATP molecules per glucose.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "Which electron carrier is produced during the Krebs cycle?",
      options: ["NADH and FADH2", "NADPH only", "ATP Synthase", "Pyruvate"],
      correctOptionIndex: 0,
      explanation: "Krebs cycle reduces NAD+ to NADH and FAD to FADH2.",
    },
  ],
};

describe("Export Utilities & ExportModal", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("formats study deck into structured Markdown string", () => {
    const md = formatAsMarkdown(mockDeck);

    expect(md).toContain("# Cellular Respiration Review");
    expect(md).toContain("> Comprehensive breakdown of glycolysis");
    expect(md).toContain("## Flashcards (2)");
    expect(md).toContain("- **Front**: Where does glycolysis occur?");
    expect(md).toContain("- **Back**: In the cytosol of the cell.");
    expect(md).toContain("- **Hint**: *Cytoplasm*");
    expect(md).toContain("## Quiz Questions (1)");
    expect(md).toContain("### 1. Which electron carrier is produced during the Krebs cycle?");
    expect(md).toContain("- **[A]** NADH and FADH2");
    expect(md).toContain("**Correct Answer**: [A] NADH and FADH2");
    expect(md).toContain("**Explanation**: Krebs cycle reduces NAD+ to NADH and FAD to FADH2.");
  });

  it("formats study deck into Anki TSV tab-separated pairs", () => {
    const tsv = formatAsAnkiTSV(mockDeck);
    const lines = tsv.split("\n");

    // Total 2 flashcards + 1 quiz question = 3 rows
    expect(lines.length).toBe(3);

    // Each row must be tab-separated
    const [front1, back1] = lines[0].split("\t");
    expect(front1).toContain("[Cell Biology] Where does glycolysis occur?");
    expect(back1).toContain("In the cytosol of the cell.");
    expect(back1).toContain("<i>Hint: Cytoplasm</i>");

    const [front2, back2] = lines[1].split("\t");
    expect(front2).toBe("What is the net ATP yield of glycolysis?");
    expect(back2).toBe("2 ATP molecules per glucose.");

    const [quizFront, quizBack] = lines[2].split("\t");
    expect(quizFront).toContain("Which electron carrier is produced during the Krebs cycle?");
    expect(quizBack).toContain("<b>Correct Answer:</b> [A] NADH and FADH2");
  });

  it("renders modal dialog with Markdown tab and copy interaction", async () => {
    const handleClose = vi.fn();
    render(<ExportModal isOpen={true} onClose={handleClose} deck={mockDeck} />);

    expect(screen.getByText("Export Study Deck")).toBeInTheDocument();
    expect(screen.getByText(/2 Cards/i)).toBeInTheDocument();

    // Copy action
    const copyButton = screen.getByRole("button", { name: /Copy Text/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("switches to Anki tab and updates preview text", () => {
    const handleClose = vi.fn();
    render(<ExportModal isOpen={true} onClose={handleClose} deck={mockDeck} />);

    const ankiTab = screen.getByRole("button", { name: /Anki Deck \(\.tsv\)/i });
    fireEvent.click(ankiTab);

    expect(screen.getByText(/Anki-compatible TSV/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download \.tsv/i })).toBeInTheDocument();
  });
});
