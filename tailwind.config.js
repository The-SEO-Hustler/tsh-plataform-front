// tailwind.config.js
function withAlpha(variableName) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${variableName}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),

        card: withAlpha("--card"),
        "card-foreground": withAlpha("--card-foreground"),

        popover: withAlpha("--popover"),
        "popover-foreground": withAlpha("--popover-foreground"),

        primary: {
          DEFAULT: withAlpha("--primary"),
          foreground: withAlpha("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withAlpha("--secondary"),
          foreground: withAlpha("--secondary-foreground"),
        },

        muted: {
          DEFAULT: withAlpha("--muted"),
          foreground: withAlpha("--muted-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          foreground: withAlpha("--accent-foreground"),
        },

        destructive: withAlpha("--destructive"),
        border: withAlpha("--border"),
        input: withAlpha("--input"),
        ring: withAlpha("--ring"),

        success: withAlpha("--success"),
        warning: withAlpha("--warning"),
        info: withAlpha("--info"),

        // chart colors
        "chart-1": withAlpha("--chart-1"),
        "chart-2": withAlpha("--chart-2"),
        "chart-3": withAlpha("--chart-3"),
        "chart-4": withAlpha("--chart-4"),
        "chart-5": withAlpha("--chart-5"),

        // sidebar
        sidebar: withAlpha("--sidebar"),
        "sidebar-foreground": withAlpha("--sidebar-foreground"),
        "sidebar-primary": withAlpha("--sidebar-primary"),
        "sidebar-primary-foreground": withAlpha("--sidebar-primary-foreground"),
        "sidebar-accent": withAlpha("--sidebar-accent"),
        "sidebar-accent-foreground": withAlpha("--sidebar-accent-foreground"),
        "sidebar-border": withAlpha("--sidebar-border"),
        "sidebar-ring": withAlpha("--sidebar-ring"),
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
    },
  },
  keyframes: {
    "accordion-down": {
      from: { height: 0 },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: 0 },
    },
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
  },
  safelist: [
    // gradients
    "from-emerald-500",
    "to-emerald-400",
    "from-blue-500",
    "to-blue-400",
    "from-amber-500",
    "to-amber-400",
    "from-red-500",
    "to-red-400",

    // text colors
    "text-emerald-600",
    "text-blue-600",
    "text-amber-600",
    "text-red-600",

    // borders
    "border-emerald-200",
    "border-blue-200",
    "border-amber-200",
    "border-red-200",

    // bg
    "bg-emerald-50",
    "bg-blue-50",
    "bg-amber-50",
    "bg-red-50",
  ],
};
export default config;
