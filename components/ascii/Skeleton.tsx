"use client";

import { useState, useEffect } from "react";

interface SkeletonProps {
  width?: string;
  className?: string;
  animated?: boolean;
  length?: number;
}

export default function Skeleton({
  width = "100%",
  className = "",
  animated = true,
  length = 16,
}: SkeletonProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % (length + 6));
    }, 120);

    return () => clearInterval(interval);
  }, [animated, length]);

  const getShimmerChar = (position: number, frame: number) => {
    const distance = Math.abs(position - frame);
    if (distance === 0) return "█";
    if (distance === 1) return "▓";
    if (distance === 2) return "▒";
    return "░";
  };

  const pattern = animated
    ? Array.from({ length }, (_, i) => getShimmerChar(i, frame)).join("")
    : "░".repeat(length);

  return (
    <span
      className={`inline-block text-muted-foreground opacity-40 ${className}`}
      style={{ width }}
    >
      {pattern}
    </span>
  );
}

export function SkeletonLine({
  width = "100%",
  animated = true,
  length = 12,
}: {
  width?: string;
  animated?: boolean;
  length?: number;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % (length + 6));
    }, 100);

    return () => clearInterval(interval);
  }, [animated, length]);

  const getShimmerChar = (position: number, frame: number) => {
    const distance = Math.abs(position - frame);
    if (distance === 0) return "█";
    if (distance === 1) return "▓";
    if (distance === 2) return "▒";
    return "░";
  };

  const pattern = animated
    ? Array.from({ length }, (_, i) => getShimmerChar(i, frame)).join("")
    : "░".repeat(length);

  return (
    <span
      className="inline-block text-muted-foreground opacity-40"
      style={{ width }}
    >
      {pattern}
    </span>
  );
}

export function SkeletonBox({
  className = "",
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const boxWidth = 20;

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % (boxWidth + 6));
    }, 120);

    return () => clearInterval(interval);
  }, [animated]);

  const getShimmerChar = (position: number, frame: number) => {
    const distance = Math.abs(position - frame);
    if (distance === 0) return "█";
    if (distance === 1) return "▓";
    if (distance === 2) return "▒";
    return "░";
  };

  const fillPattern = animated
    ? Array.from({ length: boxWidth }, (_, i) => getShimmerChar(i, frame)).join(
        ""
      )
    : "░".repeat(boxWidth);

  return (
    <div className={`text-muted-foreground opacity-30 ${className}`}>
      <div>┌{"─".repeat(boxWidth)}┐</div>
      <div>│{fillPattern}│</div>
      <div>│{fillPattern}│</div>
      <div>└{"─".repeat(boxWidth)}┘</div>
    </div>
  );
}
