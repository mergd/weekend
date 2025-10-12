interface BoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: "single" | "double" | "rounded";
  accentColor?: "cyan" | "purple" | "pink" | "green" | "yellow" | "orange";
}

const BORDERS = {
  single: {
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    h: "─",
    v: "│",
  },
  double: {
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    h: "═",
    v: "║",
  },
  rounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "│",
  },
};

const ACCENT_COLORS = {
  cyan: "text-primary",
  purple: "text-primary",
  pink: "text-muted-foreground",
  green: "text-primary",
  yellow: "text-muted-foreground",
  orange: "text-muted-foreground",
};

export default function Box({
  children,
  className = "",
  variant = "single",
  accentColor = "cyan",
}: BoxProps) {
  const b = BORDERS[variant];
  const colorClass = ACCENT_COLORS[accentColor];

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 pointer-events-none select-none ${colorClass} opacity-60`}
      >
        <div className="absolute top-0 left-0">{b.tl}</div>
        <div className="absolute top-0 right-0">{b.tr}</div>
        <div className="absolute bottom-0 left-0">{b.bl}</div>
        <div className="absolute bottom-0 right-0">{b.br}</div>
        <div className="absolute top-0 left-[1ch] right-[1ch] overflow-hidden whitespace-nowrap">
          {b.h.repeat(1000)}
        </div>
        <div className="absolute bottom-0 left-[1ch] right-[1ch] overflow-hidden whitespace-nowrap">
          {b.h.repeat(1000)}
        </div>
        <div className="absolute left-0 top-[1em] bottom-[1em] flex flex-col">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i}>{b.v}</div>
          ))}
        </div>
        <div className="absolute right-0 top-[1em] bottom-[1em] flex flex-col">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i}>{b.v}</div>
          ))}
        </div>
      </div>
      <div className="px-[2ch] py-[1em]">{children}</div>
    </div>
  );
}
