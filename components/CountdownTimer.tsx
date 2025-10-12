"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: string;
  projectTitle: string;
}

export default function CountdownTimer({
  targetDate,
  projectTitle,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDate);

  if (isPast) {
    return (
      <div className="text-center py-4">
        <div className="text-xs text-muted-foreground mb-1"> ALL CAUGHT UP</div>
        <div className="text-xs text-foreground">All projects shipped!</div>
      </div>
    );
  }

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="text-left">
      <div className="text-xs text-muted-foreground mb-2">
        {" "}
        NEXT DROP: <span className="text-primary">{projectTitle}</span>
      </div>
      <div
        className="grid grid-cols-4 gap-3 text-center"
        suppressHydrationWarning
      >
        <div>
          <div
            className="text-lg font-normal tabular-nums text-primary"
            suppressHydrationWarning
          >
            {formatNumber(days)}
          </div>
          <div className="text-xs text-muted-foreground">DAYS</div>
        </div>
        <div>
          <div
            className="text-lg font-normal tabular-nums text-primary"
            suppressHydrationWarning
          >
            {formatNumber(hours)}
          </div>
          <div className="text-xs text-muted-foreground">HRS</div>
        </div>
        <div>
          <div
            className="text-lg font-normal tabular-nums text-primary"
            suppressHydrationWarning
          >
            {formatNumber(minutes)}
          </div>
          <div className="text-xs text-muted-foreground">MIN</div>
        </div>
        <div>
          <div
            className="text-lg font-normal tabular-nums text-primary"
            suppressHydrationWarning
          >
            {formatNumber(seconds)}
          </div>
          <div className="text-xs text-muted-foreground">SEC</div>
        </div>
      </div>
    </div>
  );
}
