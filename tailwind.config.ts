import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        "bg-app": "var(--bg-app)",
        surface: "var(--bg-surface)",
        "bg-surface": "var(--bg-surface)",
        "surface-hover": "var(--bg-surface-hover)",
        "bg-surface-hover": "var(--bg-surface-hover)",
        subtle: "var(--bg-subtle)",
        "bg-subtle": "var(--bg-subtle)",
        border: {
          dim: "var(--border-dim)",
          bright: "var(--border-bright)",
        },
        dim: "var(--border-dim)",
        bright: "var(--border-bright)",
        "border-dim": "var(--border-dim)",
        "border-bright": "var(--border-bright)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: {
          primary: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
        },
        "accent-primary": "var(--accent-primary)",
        "accent-hover": "var(--accent-hover)",
        "accent-subtle": "var(--accent-subtle)",
        success: {
          DEFAULT: "var(--success)",
          subtle: "var(--success-subtle)",
        },
        "success-subtle": "var(--success-subtle)",
        error: {
          DEFAULT: "var(--error)",
          subtle: "var(--error-subtle)",
        },
        "error-subtle": "var(--error-subtle)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
        elevated: "0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
        glow: "0 0 24px -2px rgba(99, 102, 241, 0.25)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
