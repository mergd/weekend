"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 p-3 z-50 bg-card border border-border rounded-md shadow-lg">
        <span className="text-xl leading-none block opacity-0">󰖔</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-4 right-4 p-3 text-foreground hover:text-primary transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring rounded-md z-50 bg-card border border-border shadow-lg"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="text-xl leading-none block">
        {theme === "light" ? "󰖔" : ""}
      </span>
    </button>
  );
}
