import React, { useState, useEffect, useRef } from "react";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 160, y: 160 }]);
  const [dx, setDx] = useState(20);
  const [dy, setDy] = useState(0);
  const [apple, setApple] = useState({ x: 320, y: 320 });
  const [score, setScore] = useState(0);

  const grid = 20;
  const canvasSize = 400;

  // Déplacer le serpent
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (dy === 0) { setDx(0); setDy(-grid); }
          break;
        case "ArrowDown":
          if (dy === 0) { setDx(0); setDy(grid); }
          break;
        case "ArrowLeft":
          if (dx === 0) { setDx(-grid); setDy(0); }
          break;
        case "ArrowRight":
          if (dx === 0) { setDx(grid); setDy(0); }
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dx, dy]);

  // Boucle du jeu
  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = { x: prevSnake[0].x + dx, y: prevSnake[0].y + dy };

        // Collision avec mur
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= canvasSize ||
          newHead.y >= canvasSize ||
          prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          alert(`Game Over! Score: ${score}`);
          setScore(0);
          setDx(grid);
          setDy(0);
          return [{ x: 160, y: 160 }];
        }

        let newSnake = [newHead, ...prevSnake];

        // Manger la pomme
        if (newHead.x === apple.x && newHead.y === apple.y) {
          setScore(score + 1);
          setApple({
            x: Math.floor(Math.random() * (canvasSize / grid)) * grid,
            y: Math.floor(Math.random() * (canvasSize / grid)) * grid,
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dx, dy, apple, score]);

  // Dessiner le jeu
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "lime";
    snake.forEach(seg => ctx.fillRect(seg.x, seg.y, grid-1, grid-1));

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

  }, [snake, apple]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Snake Game</h1>
      <p>Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ backgroundColor: "#000", marginTop: "20px" }}
      />
    </div>
  );
}
