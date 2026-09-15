"use client";

import { useState, useEffect } from "react";

/**
 * Client-side detection for Apple platforms (macOS / iOS / iPadOS).
 * Safe for Server-Side Rendering (defaults to true during SSR to prevent hydration issues).
 */
export function getIsMac(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }

  // Modern browsers userAgentData API
  // @ts-ignore
  const userAgentPlatform = navigator.userAgentData?.platform;
  if (typeof userAgentPlatform === "string") {
    return /(Mac|iPhone|iPod|iPad)/i.test(userAgentPlatform);
  }

  // Fallback to platform & userAgent strings
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";

  return /(Mac|iPhone|iPod|iPad)/i.test(platform) || /(Mac|iPhone|iPod|iPad)/i.test(userAgent);
}

/**
 * React hook to reactively get OS modifier state without SSR hydration mismatch.
 */
export function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(getIsMac());
  }, []);

  return isMac;
}

/**
 * Returns primary modifier key symbol/text for the active OS ("⌘" on Mac, "Ctrl" on Windows/Linux).
 */
export function getModifierKey(isMac = true): string {
  return isMac ? "⌘" : "Ctrl";
}

/**
 * Dynamically formats hotkey strings/tokens according to the user's OS:
 * e.g.
 * - formatShortcutKey("⌘", false) -> "Ctrl"
 * - formatShortcutKey("⌘K", false) -> "Ctrl+K"
 * - formatShortcutKey("⌘ + Enter", false) -> "Ctrl + Enter"
 * - formatShortcutKey("mod", true) -> "⌘"
 * - formatShortcutKey("mod", false) -> "Ctrl"
 */
export function formatShortcutKey(key: string, isMac = true): string {
  if (!key || typeof key !== "string") return key;

  if (isMac) {
    const trimmed = key.trim();
    if (trimmed.toLowerCase() === "mod" || trimmed.toLowerCase() === "cmd") return "⌘";
    if (trimmed.toLowerCase() === "opt") return "⌥";
    return key;
  }

  // Windows / Linux replacements
  let formatted = key;

  // Handle composite key strings like "⌘ + Enter" or "⌘K"
  formatted = formatted.replace(/⌘\s*\+\s*/g, "Ctrl + ");
  formatted = formatted.replace(/^⌘([a-zA-Z0-9])$/, "Ctrl+$1");
  formatted = formatted.replace(/⌘/g, "Ctrl");

  // Word replacements
  formatted = formatted.replace(/\bmod\b/gi, "Ctrl");
  formatted = formatted.replace(/\bcmd\b/gi, "Ctrl");
  formatted = formatted.replace(/\bcommand\b/gi, "Ctrl");
  formatted = formatted.replace(/\bopt\b/gi, "Alt");
  formatted = formatted.replace(/\boption\b/gi, "Alt");
  formatted = formatted.replace(/⌥/g, "Alt");

  return formatted;
}
