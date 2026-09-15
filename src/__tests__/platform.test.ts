import { describe, it, expect } from "vitest";
import { formatShortcutKey, getModifierKey } from "@/lib/platform";

describe("Platform & Dynamic Shortcut Formatting Suite", () => {
  describe("formatShortcutKey on macOS / Apple platforms (isMac = true)", () => {
    it("preserves Mac command symbols and converts semantic mod/cmd tokens", () => {
      expect(formatShortcutKey("⌘", true)).toBe("⌘");
      expect(formatShortcutKey("⌘K", true)).toBe("⌘K");
      expect(formatShortcutKey("⌘ + Enter", true)).toBe("⌘ + Enter");
      expect(formatShortcutKey("mod", true)).toBe("⌘");
      expect(formatShortcutKey("cmd", true)).toBe("⌘");
      expect(formatShortcutKey("opt", true)).toBe("⌥");
      expect(formatShortcutKey("Shift", true)).toBe("Shift");
      expect(formatShortcutKey("Esc", true)).toBe("Esc");
    });
  });

  describe("formatShortcutKey on Windows / Linux platforms (isMac = false)", () => {
    it("dynamically transforms Mac command symbols to Windows/Linux Ctrl equivalents", () => {
      expect(formatShortcutKey("⌘", false)).toBe("Ctrl");
      expect(formatShortcutKey("⌘K", false)).toBe("Ctrl+K");
      expect(formatShortcutKey("⌘N", false)).toBe("Ctrl+N");
      expect(formatShortcutKey("⌘ + Enter", false)).toBe("Ctrl + Enter");
      expect(formatShortcutKey("mod", false)).toBe("Ctrl");
      expect(formatShortcutKey("cmd", false)).toBe("Ctrl");
      expect(formatShortcutKey("command", false)).toBe("Ctrl");
      expect(formatShortcutKey("opt", false)).toBe("Alt");
      expect(formatShortcutKey("⌥", false)).toBe("Alt");
      expect(formatShortcutKey("Shift", false)).toBe("Shift");
      expect(formatShortcutKey("Esc", false)).toBe("Esc");
    });
  });

  describe("getModifierKey", () => {
    it("returns correct primary modifier symbol", () => {
      expect(getModifierKey(true)).toBe("⌘");
      expect(getModifierKey(false)).toBe("Ctrl");
    });
  });
});
