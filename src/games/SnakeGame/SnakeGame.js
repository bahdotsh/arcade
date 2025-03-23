import React, { useState, useEffect, useRef } from "react";
import "./SnakeGame.css";

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
  ]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(100);
  const gameAreaRef = useRef(null);

  // Game grid size
  const gridSize = 20;
  const cellSize = 20; // pixels

  const reset = () => {
    setSnake([
      [0, 0],
      [2, 0],
      [4, 0],
    ]);
    setFood(getRandomFoodPosition());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(100);
  };

  const getRandomFoodPosition = () => {
    const position = [
      Math.floor(Math.random() * (gridSize - 1)) * 2,
      Math.floor(Math.random() * (gridSize - 1)) * 2,
    ];
    return position;
  };

  // Handle keyboard events for snake movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      let head = [...newSnake[newSnake.length - 1]];

      switch (direction) {
        case "UP":
          head[1] -= 2;
          break;
        case "DOWN":
          head[1] += 2;
          break;
        case "LEFT":
          head[0] -= 2;
          break;
        case "RIGHT":
          head[0] += 2;
          break;
        default:
          break;
      }

      // Check walls collision
      if (
        head[0] < 0 ||
        head[0] >= gridSize * 2 ||
        head[1] < 0 ||
        head[1] >= gridSize * 2
      ) {
        setGameOver(true);
        return;
      }

      // Check self collision
      for (let i = 0; i < newSnake.length; i++) {
        if (head[0] === newSnake[i][0] && head[1] === newSnake[i][1]) {
          setGameOver(true);
          return;
        }
      }

      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomFoodPosition());
        setScore(score + 1);
        // Increase speed slightly with each food eaten
        setSpeed((prevSpeed) => Math.max(prevSpeed - 2, 50));
      } else {
        newSnake.shift(); // Remove tail if no food eaten
      }

      newSnake.push(head);
      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, score, speed]);

  return (
    <div className="snake-game">
      <h2>Snake Game</h2>
      <div className="score">Score: {score}</div>

      <div
        className="game-area"
        ref={gameAreaRef}
        style={{
          width: `${gridSize * cellSize}px`,
          height: `${gridSize * cellSize}px`,
        }}
      >
        {snake.map((cell, i) => (
          <div
            key={i}
            className="snake-cell"
            style={{
              left: `${cell[0] * (cellSize / 2)}px`,
              top: `${cell[1] * (cellSize / 2)}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        ))}

        <div
          className="food"
          style={{
            left: `${food[0] * (cellSize / 2)}px`,
            top: `${food[1] * (cellSize / 2)}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        />
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Your score: {score}</p>
          <button onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="instructions">
        <p>Use arrow keys to move the snake</p>
        <p>Eat food to grow and earn points</p>
      </div>
    </div>
  );
};

export default SnakeGame;
