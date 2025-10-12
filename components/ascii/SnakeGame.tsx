"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface SnakeSegment {
  pos: Position;
  dir: Direction;
}

export default function SnakeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 60, height: 30 });
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { pos: { x: 10, y: 10 }, dir: "RIGHT" },
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [dissipating, setDissipating] = useState(false);
  const [dissipateIndex, setDissipateIndex] = useState(0);
  const directionRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<NodeJS.Timeout>(null);

  const updateGridSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const charWidth = 11;
      const charHeight = 22;
      const width = Math.floor(containerWidth / charWidth);
      const height = Math.floor(containerHeight / charHeight);
      setGridSize({ width: Math.max(40, width), height: Math.max(20, height) });
    }
  }, []);

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, [updateGridSize]);

  const is404Position = useCallback(
    (x: number, y: number): boolean => {
      const art404 = get404Art();
      const centerY =
        Math.floor(gridSize.height / 2) - Math.floor(art404.length / 2);
      const centerX =
        Math.floor(gridSize.width / 2) - Math.floor(art404[0].length / 2);

      return (
        x >= centerX - 2 &&
        x < centerX + art404[0].length + 2 &&
        y >= centerY - 2 &&
        y < centerY + art404.length + 2
      );
    },
    [gridSize]
  );

  const generateFood = useCallback(
    (currentSnake: SnakeSegment[]): Position => {
      let newFood: Position;
      let attempts = 0;
      do {
        newFood = {
          x: Math.floor(Math.random() * (gridSize.width - 10)) + 5,
          y: Math.floor(Math.random() * (gridSize.height - 10)) + 5,
        };
        attempts++;
        if (attempts > 100) break;
      } while (
        is404Position(newFood.x, newFood.y) ||
        currentSnake.some(
          (segment) =>
            Math.abs(segment.pos.x - newFood.x) < 3 &&
            Math.abs(segment.pos.y - newFood.y) < 2
        )
      );
      return newFood;
    },
    [gridSize, is404Position]
  );

  const resetGame = useCallback(() => {
    const startX = Math.floor(Math.random() * (gridSize.width - 10)) + 5;
    const startY = Math.floor(Math.random() * (gridSize.height - 10)) + 5;
    const directions: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    const initialSnake = [
      { pos: { x: startX, y: startY }, dir: randomDirection },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    directionRef.current = randomDirection;
    setGameOver(false);
    setDissipating(false);
    setDissipateIndex(0);
  }, [gridSize, generateFood]);

  useEffect(() => {
    resetGame();
  }, [gridSize, resetGame]);

  const checkCollision = useCallback(
    (pos: Position, snakeBody: SnakeSegment[]): boolean => {
      if (is404Position(pos.x, pos.y)) {
        return true;
      }

      return snakeBody.some(
        (segment, idx) =>
          idx > 3 &&
          Math.abs(segment.pos.x - pos.x) <= 2 &&
          Math.abs(segment.pos.y - pos.y) <= 1
      );
    },
    [is404Position]
  );

  const moveSnake = useCallback(() => {
    if (gameOver || dissipating) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDirection = directionRef.current;
      let newHeadPos: Position;

      switch (currentDirection) {
        case "UP":
          newHeadPos = { x: head.pos.x, y: head.pos.y - 1 };
          break;
        case "DOWN":
          newHeadPos = { x: head.pos.x, y: head.pos.y + 1 };
          break;
        case "LEFT":
          newHeadPos = { x: head.pos.x - 1, y: head.pos.y };
          break;
        case "RIGHT":
          newHeadPos = { x: head.pos.x + 1, y: head.pos.y };
          break;
      }

      if (newHeadPos.x < 0) newHeadPos.x = gridSize.width - 1;
      if (newHeadPos.x >= gridSize.width) newHeadPos.x = 0;
      if (newHeadPos.y < 0) newHeadPos.y = gridSize.height - 1;
      if (newHeadPos.y >= gridSize.height) newHeadPos.y = 0;

      if (checkCollision(newHeadPos, prevSnake.slice(1))) {
        setGameOver(true);
        setDissipating(true);
        return prevSnake;
      }

      const newSnake = [
        { pos: newHeadPos, dir: currentDirection },
        ...prevSnake,
      ];

      if (
        Math.abs(newHeadPos.x - food.x) < 2 &&
        Math.abs(newHeadPos.y - food.y) < 2
      ) {
        setFood(generateFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, dissipating, food, gridSize, generateFood, checkCollision]);

  useEffect(() => {
    if (dissipating) {
      const interval = setInterval(() => {
        setDissipateIndex((prev) => {
          if (prev >= snake.length - 1) {
            clearInterval(interval);
            setTimeout(() => resetGame(), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [dissipating, snake.length, resetGame]);

  useEffect(() => {
    if (dissipating || gameOver) return;

    const aiMove = () => {
      const head = snake[0];
      const currentDirection = directionRef.current;

      const possibleMoves: Direction[] = [];
      const isValidMove = (dir: Direction): boolean => {
        let testPos = { ...head.pos };
        if (dir === "UP") testPos.y--;
        if (dir === "DOWN") testPos.y++;
        if (dir === "LEFT") testPos.x--;
        if (dir === "RIGHT") testPos.x++;

        if (testPos.x < 0) testPos.x = gridSize.width - 1;
        if (testPos.x >= gridSize.width) testPos.x = 0;
        if (testPos.y < 0) testPos.y = gridSize.height - 1;
        if (testPos.y >= gridSize.height) testPos.y = 0;

        return !checkCollision(testPos, snake.slice(1));
      };

      if (currentDirection !== "DOWN" && isValidMove("UP")) {
        possibleMoves.push("UP");
      }
      if (currentDirection !== "UP" && isValidMove("DOWN")) {
        possibleMoves.push("DOWN");
      }
      if (currentDirection !== "RIGHT" && isValidMove("LEFT")) {
        possibleMoves.push("LEFT");
      }
      if (currentDirection !== "LEFT" && isValidMove("RIGHT")) {
        possibleMoves.push("RIGHT");
      }

      if (possibleMoves.length === 0) return;

      const towardsFood = possibleMoves.find((dir) => {
        let nextX = head.pos.x;
        let nextY = head.pos.y;
        if (dir === "UP") nextY--;
        if (dir === "DOWN") nextY++;
        if (dir === "LEFT") nextX--;
        if (dir === "RIGHT") nextX++;

        if (nextX < 0) nextX = gridSize.width - 1;
        if (nextX >= gridSize.width) nextX = 0;
        if (nextY < 0) nextY = gridSize.height - 1;
        if (nextY >= gridSize.height) nextY = 0;

        const currentDist =
          Math.abs(head.pos.x - food.x) + Math.abs(head.pos.y - food.y);
        const newDist = Math.abs(nextX - food.x) + Math.abs(nextY - food.y);
        return newDist < currentDist;
      });

      if (towardsFood && Math.random() > 0.15) {
        directionRef.current = towardsFood;
      } else if (
        possibleMoves.includes(currentDirection) &&
        Math.random() > 0.25
      ) {
        directionRef.current = currentDirection;
      } else {
        directionRef.current =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
    };

    aiMove();
  }, [snake, food, gameOver, dissipating, checkCollision, gridSize]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 100);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  const get404Art = () => {
    return [
      " ╔═══╗    ╔═══╗    ╔═══╗ ",
      " ║   ║    ║   ║    ║   ║ ",
      " ║ 4 ║    ║ 0 ║    ║ 4 ║ ",
      " ║   ║    ║   ║    ║   ║ ",
      " ╚═══╝    ╚═══╝    ╚═══╝ ",
    ];
  };

  const getSnakeSegment = (
    segment: SnakeSegment,
    index: number,
    prevSeg?: SnakeSegment,
    nextSeg?: SnakeSegment
  ): string[] => {
    const isDissipated =
      dissipating && snake.length - 1 - index <= dissipateIndex;

    if (isDissipated) {
      const dissipateChars = ["░░░", "▒▒▒", "▓▓▓", "···", "∴∴∴", "⋮⋮⋮", "   "];
      const randomChar =
        dissipateChars[Math.floor(Math.random() * dissipateChars.length)];
      return [randomChar, randomChar, randomChar];
    }

    const dir = segment.dir;
    const prevDir = prevSeg?.dir;
    const nextDir = nextSeg?.dir;

    if (index === 0) {
      if (dir === "RIGHT") return ["╔═╗", "║©║", "╚═╝"];
      if (dir === "LEFT") return ["╔═╗", "║©║", "╚═╝"];
      if (dir === "UP") return ["╔═╗", "║©║", "╚═╝"];
      if (dir === "DOWN") return ["╔═╗", "║©║", "╚═╝"];
    }

    const isTurn = prevDir && prevDir !== dir;

    if (isTurn) {
      if (
        (prevDir === "RIGHT" && dir === "DOWN") ||
        (dir === "RIGHT" && prevDir === "DOWN")
      ) {
        return ["╔══", "║  ", "║  "];
      }
      if (
        (prevDir === "LEFT" && dir === "DOWN") ||
        (dir === "LEFT" && prevDir === "DOWN")
      ) {
        return ["══╗", "  ║", "  ║"];
      }
      if (
        (prevDir === "RIGHT" && dir === "UP") ||
        (dir === "RIGHT" && prevDir === "UP")
      ) {
        return ["║  ", "║  ", "╚══"];
      }
      if (
        (prevDir === "LEFT" && dir === "UP") ||
        (dir === "LEFT" && prevDir === "UP")
      ) {
        return ["  ║", "  ║", "══╝"];
      }
    }

    if (dir === "RIGHT" || dir === "LEFT") {
      return ["═══", "   ", "═══"];
    }

    return ["║ ║", "║ ║", "║ ║"];
  };

  const renderGrid = () => {
    const grid: string[][] = Array(gridSize.height)
      .fill(null)
      .map(() => Array(gridSize.width).fill(" "));

    const art404 = get404Art();
    const centerY =
      Math.floor(gridSize.height / 2) - Math.floor(art404.length / 2);
    const centerX =
      Math.floor(gridSize.width / 2) - Math.floor(art404[0].length / 2);

    const foodChars = ["╔═╗", "║©║", "╚═╝"];
    for (let dy = 0; dy < 3; dy++) {
      const y = food.y + dy - 1;
      if (y >= 0 && y < gridSize.height) {
        for (let dx = 0; dx < 3; dx++) {
          const x = food.x + dx - 1;
          if (x >= 0 && x < gridSize.width) {
            if (
              foodChars[dy] &&
              foodChars[dy][dx] &&
              foodChars[dy][dx] !== " "
            ) {
              grid[y][x] = foodChars[dy][dx];
            }
          }
        }
      }
    }

    snake.forEach((segment, index) => {
      const prevSeg = index > 0 ? snake[index - 1] : undefined;
      const nextSeg = index < snake.length - 1 ? snake[index + 1] : undefined;
      const snakeChars = getSnakeSegment(segment, index, prevSeg, nextSeg);

      for (let dy = 0; dy < 3; dy++) {
        const y = segment.pos.y + dy - 1;
        if (y >= 0 && y < gridSize.height) {
          for (let dx = 0; dx < 3; dx++) {
            const x = segment.pos.x + dx - 1;
            if (x >= 0 && x < gridSize.width) {
              if (
                snakeChars[dy] &&
                snakeChars[dy][dx] &&
                snakeChars[dy][dx] !== " "
              ) {
                grid[y][x] = snakeChars[dy][dx];
              }
            }
          }
        }
      }
    });

    art404.forEach((line, i) => {
      const y = centerY + i;
      if (y >= 0 && y < gridSize.height) {
        for (let j = 0; j < line.length; j++) {
          const x = centerX + j;
          if (x >= 0 && x < gridSize.width) {
            grid[y][x] = line[j];
          }
        }
      }
    });

    return grid.map((row, i) => (
      <div key={i} className="leading-none whitespace-pre">
        {row.map((char, j) => {
          const isFood =
            i >= food.y - 1 &&
            i <= food.y + 1 &&
            j >= food.x - 1 &&
            j <= food.x + 1;
          const isSnake = snake.some(
            (seg) =>
              i >= seg.pos.y - 1 &&
              i <= seg.pos.y + 1 &&
              j >= seg.pos.x - 1 &&
              j <= seg.pos.x + 1
          );
          const is404 =
            i >= centerY &&
            i < centerY + art404.length &&
            j >= centerX &&
            j < centerX + art404[0].length;
          const isDissipateChar = ["░", "▒", "▓", "·", "∴", "⋮"].includes(char);

          let colorClass = "text-lime-400";
          if (is404) colorClass = "text-lime-400";
          else if (isFood) colorClass = "text-orange-500";
          else if (isSnake && isDissipateChar) colorClass = "text-lime-400/30";
          else if (isSnake) colorClass = "text-lime-400";

          return (
            <span key={j} className={colorClass}>
              {char}
            </span>
          );
        })}
      </div>
    ));
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-start justify-start"
      ref={containerRef}
    >
      <div className="font-mono text-[11px] leading-[22px] select-none">
        {renderGrid()}
      </div>
    </div>
  );
}
