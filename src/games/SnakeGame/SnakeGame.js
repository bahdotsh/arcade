import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./SnakeGame.css";

const SnakeGame = () => {
  const { darkMode } = useContext(ThemeContext);
  const [snake, setSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
  ]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const gameAreaRef = useRef(null);
  const [gameSize, setGameSize] = useState({ width: 400, height: 400 });

  // Game grid size - smaller cell size for more precise movement
  const gridSize = 20;
  const cellSize = Math.min(gameSize.width, gameSize.height) / gridSize;

  // Responsive game size
  useEffect(() => {
    const updateGameSize = () => {
      if (gameAreaRef.current) {
        const container = gameAreaRef.current.parentElement;
        const containerWidth = container.clientWidth - 30; // padding
        const containerHeight = container.clientHeight - 30;
        const size = Math.min(containerWidth, containerHeight, 400);
        setGameSize({ width: size, height: size });
      }
    };

    updateGameSize();
    window.addEventListener("resize", updateGameSize);
    return () => window.removeEventListener("resize", updateGameSize);
  }, []);

  useEffect(() => {
    // Initialize high score from localStorage
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

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
    setIsPaused(false);
  };

  const getRandomFoodPosition = () => {
    const position = [
      Math.floor(Math.random() * (gridSize - 1)) * 2,
      Math.floor(Math.random() * (gridSize - 1)) * 2,
    ];
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
      if (position[0] === segment[0] && position[1] === segment[1]) {
        return getRandomFoodPosition();
      }
    }
    return position;
  };

  const handleDirectionChange = (newDirection) => {
    if (
      (newDirection === "UP" && direction !== "DOWN") ||
      (newDirection === "DOWN" && direction !== "UP") ||
      (newDirection === "LEFT" && direction !== "RIGHT") ||
      (newDirection === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  // Handle keyboard events for snake movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      // Prevent default behavior for arrow keys and game controls to avoid page scrolling
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          " ",
          "p",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
          handleDirectionChange("UP");
          break;
        case "ArrowDown":
        case "s":
          handleDirectionChange("DOWN");
          break;
        case "ArrowLeft":
        case "a":
          handleDirectionChange("LEFT");
          break;
        case "ArrowRight":
        case "d":
          handleDirectionChange("RIGHT");
          break;
        case " ":
        case "p":
          // Spacebar or P to pause/unpause
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

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
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("snakeHighScore", score.toString());
        }
        return;
      }

      // Check self collision
      for (let i = 0; i < newSnake.length; i++) {
        if (head[0] === newSnake[i][0] && head[1] === newSnake[i][1]) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snakeHighScore", score.toString());
          }
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
  }, [snake, direction, food, gameOver, score, speed, isPaused, highScore]);

  return (
    <div className="snake-game">
      <h2>Snake</h2>

      <div className="score-container">
        <div className="score">Score: {score}</div>
        <div className="high-score">Best: {highScore}</div>
      </div>

      <div className="game-area-container">
        <div
          className="game-area"
          ref={gameAreaRef}
          style={{
            width: `${gameSize.width}px`,
            height: `${gameSize.height}px`,
          }}
        >
          {snake.map((cell, i) => (
            <div
              key={i}
              className={`snake-cell ${i === snake.length - 1 ? "snake-head" : ""}`}
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

          {isPaused && !gameOver && (
            <div className="game-over">
              <h3>Paused</h3>
              <p>Press space or P to continue</p>
              <button onClick={() => setIsPaused(false)}>Resume</button>
            </div>
          )}

          {gameOver && (
            <div className="game-over">
              <h3>Game Over!</h3>
              <p>Your score: {score}</p>
              {score >= highScore && score > 0 && (
                <p className="new-high-score">New High Score! 🎉</p>
              )}
              <button onClick={reset}>Play Again</button>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionChange("UP")}
            aria-label="Move Up"
          >
            ↑
          </div>
        </div>
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionChange("LEFT")}
            aria-label="Move Left"
          >
            ←
          </div>
          <div
            className="control-btn"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume Game" : "Pause Game"}
          >
            {isPaused ? "▶" : "⏸"}
          </div>
          <div
            className="control-btn"
            onClick={() => handleDirectionChange("RIGHT")}
            aria-label="Move Right"
          >
            →
          </div>
        </div>
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionChange("DOWN")}
            aria-label="Move Down"
          >
            ↓
          </div>
        </div>
      </div>

      <div className="instructions">
        <h3>How to Play</h3>
        <p>• Use arrows/WASD or touch controls for movement</p>
        <p>• Eat food to grow and score points</p>
        <p>• Avoid walls and yourself</p>
      </div>
    </div>
  );
};

export default SnakeGame;
