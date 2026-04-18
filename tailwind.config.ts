import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        foreground: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 24px 60px rgba(139, 92, 246, 0.2)",
        card: "0 10px 40px rgba(2, 6, 23, 0.5)"
      },
      fontFamily: {
        body: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"]
      },
      backgroundImage: {
        stars:
          "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.12), transparent 30%), radial-gradient(circle at 80% 0%, rgba(245, 158, 11, 0.18), transparent 35%), radial-gradient(circle at 30% 80%, rgba(14, 165, 233, 0.16), transparent 30%)"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(139, 92, 246, 0)" },
          "50%": { boxShadow: "0 0 30px rgba(139, 92, 246, 0.2)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
