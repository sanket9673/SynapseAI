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
        "carbon-black": "#000000",
        "paper-white": "#ffffff",
        "warm-canvas": "#e5e5e5",
        "mist-gray": "#f3f3f3",
        ash: "#c6c6c6",
        smoke: "#979797",
        slate: "#444444",
        graphite: "#2f2f2f",
        "mint-chip": "#d1ffca",
        "voltage-yellow": "#fff100",

        // Semantic bindings
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
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
        "pill": "48px",
        "tag": "64px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        elevated: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
        glow: "none",
      },
      lineHeight: {
        tightest: "0.9",
      },
      letterSpacing: {
        tighter: "-0.03em",
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
