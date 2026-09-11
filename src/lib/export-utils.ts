import type { StudySet } from "@/types/study";

export interface ExportUtils {
  formatAsMarkdown: (deck: StudySet) => string;
  formatAsAnkiTSV: (deck: StudySet) => string;
  downloadFile: (filename: string, content: string, mimeType: string) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function formatAsMarkdown(deck: StudySet): string {
  const lines: string[] = [];

  // Deck Title & Header
  lines.push(`# ${deck.title || "Synapse Study Deck"}`);
  lines.push("");

  if (deck.summary) {
    lines.push(`> ${deck.summary}`);
    lines.push("");
  }

  // Flashcards Section
  const flashcards = deck.flashcards || [];
  lines.push(`## Flashcards (${flashcards.length})`);
  lines.push("");

  if (flashcards.length === 0) {
    lines.push("_No flashcards in this deck._");
    lines.push("");
  } else {
    flashcards.forEach((card, index) => {
      const categoryTag = card.category ? ` \`[${card.category}]\`` : "";
      lines.push(`### Card ${index + 1}${categoryTag}`);
      lines.push(`- **Front**: ${card.front}`);
      lines.push(`- **Back**: ${card.back}`);
      if (card.hint) {
        lines.push(`- **Hint**: *${card.hint}*`);
      }
      lines.push("");
    });
  }

  // Quiz Section
  const questions = deck.quiz || deck.questions || [];
  lines.push(`## Quiz Questions (${questions.length})`);
  lines.push("");

  if (questions.length === 0) {
    lines.push("_No quiz questions in this deck._");
    lines.push("");
  } else {
    questions.forEach((q, index) => {
      const qText = q.question || q.text || "";
      lines.push(`### ${index + 1}. ${qText}`);
      lines.push("");

      q.options.forEach((opt, optIdx) => {
        const letter = OPTION_LETTERS[optIdx] || `${optIdx + 1}`;
        lines.push(`- **[${letter}]** ${opt}`);
      });

      lines.push("");
      const correctLetter = OPTION_LETTERS[q.correctOptionIndex] || `${q.correctOptionIndex + 1}`;
      const correctAnswerStr = q.options[q.correctOptionIndex] || q.correctAnswer || "";
      lines.push(`**Correct Answer**: [${correctLetter}] ${correctAnswerStr}`);
      lines.push(`**Explanation**: ${q.explanation}`);
      lines.push("");
    });
  }

  lines.push("---");
  lines.push("*Exported from Synapse AI Active Recall Assistant*");

  return lines.join("\n");
}

export function formatAsAnkiTSV(deck: StudySet): string {
  const rows: string[] = [];

  // 1. Add Flashcards
  const flashcards = deck.flashcards || [];
  flashcards.forEach((card) => {
    // Escape tabs and replace newlines with HTML linebreaks for Anki compatibility
    const frontText = (card.category ? `[${card.category}] ` : "") + card.front;
    const backText = card.back + (card.hint ? `<br><br><i>Hint: ${card.hint}</i>` : "");

    const cleanFront = frontText.replace(/\t/g, "  ").replace(/\r?\n/g, "<br>");
    const cleanBack = backText.replace(/\t/g, "  ").replace(/\r?\n/g, "<br>");

    rows.push(`${cleanFront}\t${cleanBack}`);
  });

  // 2. Add Quiz Questions as Q&A Anki cards
  const questions = deck.quiz || deck.questions || [];
  questions.forEach((q) => {
    const qText = q.question || q.text || "";
    const optionsText = q.options
      .map((opt, i) => `${OPTION_LETTERS[i] || i + 1}) ${opt}`)
      .join("<br>");

    const front = `${qText}<br><br>${optionsText}`;
    const correctLetter = OPTION_LETTERS[q.correctOptionIndex] || `${q.correctOptionIndex + 1}`;
    const correctAnswerStr = q.options[q.correctOptionIndex] || q.correctAnswer || "";
    const back = `<b>Correct Answer:</b> [${correctLetter}] ${correctAnswerStr}<br><br><b>Explanation:</b> ${q.explanation}`;

    const cleanFront = front.replace(/\t/g, "  ").replace(/\r?\n/g, "<br>");
    const cleanBack = back.replace(/\t/g, "  ").replace(/\r?\n/g, "<br>");

    rows.push(`${cleanFront}\t${cleanBack}`);
  });

  return rows.join("\n");
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const exportUtils: ExportUtils = {
  formatAsMarkdown,
  formatAsAnkiTSV,
  downloadFile,
};
