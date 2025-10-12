"use client";

import { useEffect } from "react";

interface OverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  accentColor?: "cyan" | "purple" | "pink" | "green" | "yellow" | "orange";
}

export default function Overlay({
  children,
  onClose,
  title,
  accentColor = "cyan",
}: OverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-card border border-border p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          >
            [x]
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
