import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "tg": "#01021E",
        "tg-text": "var(--tg-theme-text-color, #ffffff)",
        "tg-hint": "var(--tg-theme-hint-color, #ffffff)",
        "tg-link": "var(--tg-theme-link-color, #007aff)",
        "tg-button": "var(--tg-theme-button-color, #007aff)",
        "tg-secondary": "#01021E",
        "tg-header": "var(--tg-theme-header-bg-color, #1c1c1c)",
        "tg-accent": "var(--tg-theme-accent-text-color, #007aff)",
        "tg-section": "#09122F",
        "tg-section-header":
          "var(--tg-theme-section-header-text-color, #e5e5e5)",
        "tg-subtitle-text-color":
          "var(--tg-theme-theme-subtitle-text-color, #ffffff)",
        "tg-destructive-text-color":
          "var(--tg-theme-theme-destructive-text-color, #ff453a)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
