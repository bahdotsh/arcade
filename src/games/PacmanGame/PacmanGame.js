import React, { useState, useEffect, useRef } from "react";
import "./PacmanGame.css";

// Maze layout constants
const EMPTY = 0;
const WALL = 1;
const DOT = 2;
const POWER_PELLET = 3;
const GHOST_LAIR = 4;

// Define directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

// Ghost states
const NORMAL = 0;
const VULNERABLE = 1;
const EATEN = 2;

// Initial maze layout
const initialMaze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Ghost colors
const GHOST_COLORS = ["#FF0000", "#FFB8FF", "#00FFFF", "#FFB852"];

const PacmanGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({
    maze: JSON.parse(JSON.stringify(initialMaze)),
    pacman: {
      x: 9,
      y: 16,
      direction: RIGHT,
      nextDirection: RIGHT,
      mouthOpen: true,
    },
    ghosts: [
      {
        x: 9,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[0],
        homeX: 9,
        homeY: 10,
      },
      {
        x: 8,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[1],
        homeX: 8,
        homeY: 10,
      },
      {
        x: 10,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[2],
        homeX: 10,
        homeY: 10,
      },
      {
        x: 9,
        y: 9,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[3],
        homeX: 9,
        homeY: 9,
      },
    ],
    score: 0,
    lives: 3,
    gameOver: false,
    gameWon: false,
    level: 1,
    dotsCount: 0,
    totalDots: 0,
    powerMode: false,
    powerModeTimer: null,
    paused: false,
    showInstructions: true,
    gameStarted: false,
  });

  // Calculate total dots for the win condition
  useEffect(() => {
    let count = 0;
    for (let y = 0; y < initialMaze.length; y++) {
      for (let x = 0; x < initialMaze[y].length; x++) {
        if (initialMaze[y][x] === DOT || initialMaze[y][x] === POWER_PELLET) {
          count++;
        }
      }
    }
    setGameState((prev) => ({ ...prev, totalDots: count }));
  }, []);

  // Game loop
  useEffect(() => {
    if (
      gameState.gameOver ||
      gameState.gameWon ||
      gameState.paused ||
      gameState.showInstructions ||
      !gameState.gameStarted
    )
      return;

    const gameLoop = setInterval(() => {
      updateGame();
    }, 200);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const cellSize = canvas.width / initialMaze[0].length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let y = 0; y < gameState.maze.length; y++) {
      for (let x = 0; x < gameState.maze[y].length; x++) {
        const cell = gameState.maze[y][x];

        if (cell === WALL) {
          ctx.fillStyle = "#2121DE";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else if (cell === DOT) {
          ctx.fillStyle = "#FFCC00";
          ctx.beginPath();
          ctx.arc(
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2,
            cellSize / 10,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        } else if (cell === POWER_PELLET) {
          ctx.fillStyle = "#FFCC00";
          ctx.beginPath();
          ctx.arc(
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2,
            cellSize / 4,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }

    // Draw pacman
    ctx.fillStyle = "#FFCC00";
    ctx.beginPath();

    const pacman = gameState.pacman;
    const centerX = pacman.x * cellSize + cellSize / 2;
    const centerY = pacman.y * cellSize + cellSize / 2;
    const radius = cellSize / 2;

    let startAngle, endAngle;

    if (pacman.direction === RIGHT) {
      startAngle = pacman.mouthOpen ? 0.2 : 0;
      endAngle = pacman.mouthOpen ? 1.8 * Math.PI : 2 * Math.PI;
    } else if (pacman.direction === LEFT) {
      startAngle = pacman.mouthOpen ? Math.PI + 0.2 : Math.PI;
      endAngle = pacman.mouthOpen ? 0.8 * Math.PI : 3 * Math.PI;
    } else if (pacman.direction === UP) {
      startAngle = pacman.mouthOpen ? 1.25 * Math.PI : 1.5 * Math.PI;
      endAngle = pacman.mouthOpen ? 0.25 * Math.PI : 3.5 * Math.PI;
    } else {
      startAngle = pacman.mouthOpen ? 0.75 * Math.PI : 0.5 * Math.PI;
      endAngle = pacman.mouthOpen ? 1.75 * Math.PI : 2.5 * Math.PI;
    }

    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw ghosts
    gameState.ghosts.forEach((ghost) => {
      // Base ghost shape
      const ghostX = ghost.x * cellSize + cellSize / 2;
      const ghostY = ghost.y * cellSize + cellSize / 2;

      // Determine ghost color based on state
      if (ghost.state === VULNERABLE) {
        ctx.fillStyle = "#2121DE"; // Blue when vulnerable
      } else if (ghost.state === EATEN) {
        ctx.fillStyle = "#FFFFFF"; // Eyes only when eaten
      } else {
        ctx.fillStyle = ghost.color; // Normal color
      }

      // Draw ghost body
      ctx.beginPath();
      ctx.arc(ghostX, ghostY, radius - 2, Math.PI, 0, false);
      ctx.lineTo(ghostX + radius - 2, ghostY + radius - 2);

      // Wavy bottom
      for (let i = 0; i < 3; i++) {
        ctx.quadraticCurveTo(
          ghostX + radius - 2 - (i * radius) / 1.5,
          ghostY + radius + 2,
          ghostX + radius - 2 - ((i + 1) * radius) / 1.5,
          ghostY + radius - 2,
        );
      }

      ctx.lineTo(ghostX - radius + 2, ghostY);
      ctx.fill();

      // Draw eyes
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(
        ghostX - radius / 3,
        ghostY - radius / 5,
        radius / 4,
        0,
        Math.PI * 2,
      );
      ctx.arc(
        ghostX + radius / 3,
        ghostY - radius / 5,
        radius / 4,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Draw pupils (black part of eyes)
      ctx.fillStyle = "#000000";

      // Adjust pupils based on direction
      let pupilOffsetX = 0,
        pupilOffsetY = 0;

      if (ghost.direction === RIGHT) pupilOffsetX = radius / 8;
      else if (ghost.direction === LEFT) pupilOffsetX = -radius / 8;
      else if (ghost.direction === UP) pupilOffsetY = -radius / 8;
      else if (ghost.direction === DOWN) pupilOffsetY = radius / 8;

      ctx.beginPath();
      ctx.arc(
        ghostX - radius / 3 + pupilOffsetX,
        ghostY - radius / 5 + pupilOffsetY,
        radius / 8,
        0,
        Math.PI * 2,
      );
      ctx.arc(
        ghostX + radius / 3 + pupilOffsetX,
        ghostY - radius / 5 + pupilOffsetY,
        radius / 8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    // Draw UI elements
    // Lives
    for (let i = 0; i < gameState.lives; i++) {
      ctx.fillStyle = "#FFCC00";
      ctx.beginPath();
      const lifeX = cellSize * (i + 1);
      const lifeY = gameState.maze.length * cellSize - cellSize / 2;
      ctx.arc(lifeX, lifeY, cellSize / 3, 0.2, 1.8 * Math.PI);
      ctx.lineTo(lifeX, lifeY);
      ctx.fill();
    }

    // Score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${cellSize}px 'Press Start 2P', monospace`;
    ctx.textAlign = "right";
    ctx.fillText(
      `${gameState.score}`,
      canvas.width - cellSize,
      gameState.maze.length * cellSize - cellSize / 3,
    );
  }, [gameState]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.showInstructions) {
        setGameState((prev) => ({
          ...prev,
          showInstructions: false,
          gameStarted: true,
        }));
        return;
      }

      if (gameState.gameOver || gameState.gameWon) {
        resetGame();
        return;
      }

      if (e.key === "p" || e.key === "P" || e.code === "Space") {
        setGameState((prev) => ({ ...prev, paused: !prev.paused }));
        return;
      }

      let newDirection;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          newDirection = UP;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newDirection = DOWN;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          newDirection = LEFT;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newDirection = RIGHT;
          break;
        default:
          return;
      }

      setGameState((prev) => ({
        ...prev,
        pacman: {
          ...prev.pacman,
          nextDirection: newDirection,
        },
      }));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.gameOver, gameState.gameWon, gameState.showInstructions]);

  // Update game state
  const updateGame = () => {
    setGameState((prevState) => {
      const newState = { ...prevState };

      // Update Pacman
      const pacman = { ...newState.pacman };

      // Try to change direction if requested
      if (canMove(pacman.x, pacman.y, pacman.nextDirection, newState.maze)) {
        pacman.direction = pacman.nextDirection;
      }

      // Move in current direction if possible
      if (canMove(pacman.x, pacman.y, pacman.direction, newState.maze)) {
        pacman.x += pacman.direction.x;
        pacman.y += pacman.direction.y;

        // Handle tunnel wrapping
        if (pacman.x < 0) pacman.x = newState.maze[0].length - 1;
        if (pacman.x >= newState.maze[0].length) pacman.x = 0;

        // Animate mouth
        pacman.mouthOpen = !pacman.mouthOpen;

        // Check if Pacman eats a dot
        const cell = newState.maze[pacman.y][pacman.x];
        if (cell === DOT) {
          newState.maze[pacman.y][pacman.x] = EMPTY;
          newState.score += 10;
          newState.dotsCount++;

          // Check win condition
          if (newState.dotsCount >= newState.totalDots) {
            newState.gameWon = true;
          }
        } else if (cell === POWER_PELLET) {
          newState.maze[pacman.y][pacman.x] = EMPTY;
          newState.score += 50;
          newState.dotsCount++;

          // Enter power mode
          newState.powerMode = true;

          // Make ghosts vulnerable
          newState.ghosts = newState.ghosts.map((ghost) => ({
            ...ghost,
            state: ghost.state === EATEN ? EATEN : VULNERABLE,
          }));

          // Set timer to end power mode
          if (newState.powerModeTimer) {
            clearTimeout(newState.powerModeTimer);
          }

          newState.powerModeTimer = setTimeout(() => {
            setGameState((prev) => {
              const updated = { ...prev };
              updated.powerMode = false;
              updated.ghosts = updated.ghosts.map((ghost) => ({
                ...ghost,
                state: ghost.state === VULNERABLE ? NORMAL : ghost.state,
              }));
              return updated;
            });
          }, 8000);
        }
      }

      newState.pacman = pacman;

      // Update Ghosts
      newState.ghosts = newState.ghosts.map((ghost) => {
        const newGhost = { ...ghost };

        // If eaten, move towards home
        if (newGhost.state === EATEN) {
          // If ghost is back home, return to normal
          if (newGhost.x === newGhost.homeX && newGhost.y === newGhost.homeY) {
            newGhost.state = NORMAL;
          } else {
            // Move towards home
            const dx = newGhost.homeX - newGhost.x;
            const dy = newGhost.homeY - newGhost.y;

            if (Math.abs(dx) > Math.abs(dy)) {
              newGhost.direction = dx > 0 ? RIGHT : LEFT;
            } else {
              newGhost.direction = dy > 0 ? DOWN : UP;
            }
          }
        } else {
          // Normal ghost movement - somewhat random
          // Get possible directions
          const possibleDirections = [];

          if (
            canMove(newGhost.x, newGhost.y, UP, newState.maze) &&
            !areOppositeDirections(newGhost.direction, UP)
          ) {
            possibleDirections.push(UP);
          }
          if (
            canMove(newGhost.x, newGhost.y, DOWN, newState.maze) &&
            !areOppositeDirections(newGhost.direction, DOWN)
          ) {
            possibleDirections.push(DOWN);
          }
          if (
            canMove(newGhost.x, newGhost.y, LEFT, newState.maze) &&
            !areOppositeDirections(newGhost.direction, LEFT)
          ) {
            possibleDirections.push(LEFT);
          }
          if (
            canMove(newGhost.x, newGhost.y, RIGHT, newState.maze) &&
            !areOppositeDirections(newGhost.direction, RIGHT)
          ) {
            possibleDirections.push(RIGHT);
          }

          // If at a junction, maybe change direction
          if (possibleDirections.length > 1) {
            // In vulnerable state, try to move away from Pacman
            if (newGhost.state === VULNERABLE) {
              // Find the direction that maximizes distance to Pacman
              let maxDistance = -1;
              let bestDirection = newGhost.direction;

              possibleDirections.forEach((dir) => {
                const newX = newGhost.x + dir.x;
                const newY = newGhost.y + dir.y;
                const distance = Math.hypot(newX - pacman.x, newY - pacman.y);

                if (distance > maxDistance) {
                  maxDistance = distance;
                  bestDirection = dir;
                }
              });

              newGhost.direction = bestDirection;
            } else {
              // 75% chance to chase Pacman, 25% to move randomly
              if (Math.random() < 0.75) {
                // Find the direction that minimizes distance to Pacman
                let minDistance = Infinity;
                let bestDirection = newGhost.direction;

                possibleDirections.forEach((dir) => {
                  const newX = newGhost.x + dir.x;
                  const newY = newGhost.y + dir.y;
                  const distance = Math.hypot(newX - pacman.x, newY - pacman.y);

                  if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = dir;
                  }
                });

                newGhost.direction = bestDirection;
              } else {
                // Random direction
                const randomIndex = Math.floor(
                  Math.random() * possibleDirections.length,
                );
                newGhost.direction = possibleDirections[randomIndex];
              }
            }
          } else if (possibleDirections.length === 1) {
            // Only one way to go
            newGhost.direction = possibleDirections[0];
          } else if (possibleDirections.length === 0) {
            // Reverse direction if stuck
            newGhost.direction = reverseDirection(newGhost.direction);
          }
        }

        // Move ghost
        if (
          canMove(newGhost.x, newGhost.y, newGhost.direction, newState.maze) ||
          newGhost.state === EATEN
        ) {
          newGhost.x += newGhost.direction.x;
          newGhost.y += newGhost.direction.y;

          // Handle tunnel wrapping
          if (newGhost.x < 0) newGhost.x = newState.maze[0].length - 1;
          if (newGhost.x >= newState.maze[0].length) newGhost.x = 0;
        }

        return newGhost;
      });

      // Check if Pacman collides with a ghost
      for (let i = 0; i < newState.ghosts.length; i++) {
        const ghost = newState.ghosts[i];

        if (ghost.x === pacman.x && ghost.y === pacman.y) {
          if (ghost.state === VULNERABLE) {
            // Eat the ghost
            newState.ghosts[i] = {
              ...ghost,
              state: EATEN,
            };
            newState.score += 200;
          } else if (ghost.state === NORMAL) {
            // Pacman dies
            newState.lives--;

            if (newState.lives <= 0) {
              newState.gameOver = true;
            } else {
              // Reset positions
              resetPositions(newState);
            }
            break;
          }
        }
      }

      return newState;
    });
  };

  // Check if Pacman can move in a direction
  const canMove = (x, y, direction, maze) => {
    const newX = x + direction.x;
    const newY = y + direction.y;

    // Check for tunnel wrapping
    if (newX < 0 || newX >= maze[0].length) return true;

    // Check if the new position is a wall
    return newY >= 0 && newY < maze.length && maze[newY][newX] !== WALL;
  };

  // Check if directions are opposite
  const areOppositeDirections = (dir1, dir2) => {
    return dir1.x === -dir2.x && dir1.y === -dir2.y;
  };

  // Get the opposite direction
  const reverseDirection = (dir) => {
    return { x: -dir.x, y: -dir.y };
  };

  // Reset positions after Pacman dies
  const resetPositions = (state) => {
    state.pacman = {
      x: 9,
      y: 16,
      direction: RIGHT,
      nextDirection: RIGHT,
      mouthOpen: true,
    };
    state.ghosts = [
      {
        x: 9,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[0],
        homeX: 9,
        homeY: 10,
      },
      {
        x: 8,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[1],
        homeX: 8,
        homeY: 10,
      },
      {
        x: 10,
        y: 10,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[2],
        homeX: 10,
        homeY: 10,
      },
      {
        x: 9,
        y: 9,
        direction: UP,
        state: NORMAL,
        color: GHOST_COLORS[3],
        homeX: 9,
        homeY: 9,
      },
    ];
    state.powerMode = false;
    if (state.powerModeTimer) {
      clearTimeout(state.powerModeTimer);
      state.powerModeTimer = null;
    }
  };

  // Reset the entire game
  const resetGame = () => {
    setGameState({
      maze: JSON.parse(JSON.stringify(initialMaze)),
      pacman: {
        x: 9,
        y: 16,
        direction: RIGHT,
        nextDirection: RIGHT,
        mouthOpen: true,
      },
      ghosts: [
        {
          x: 9,
          y: 10,
          direction: UP,
          state: NORMAL,
          color: GHOST_COLORS[0],
          homeX: 9,
          homeY: 10,
        },
        {
          x: 8,
          y: 10,
          direction: UP,
          state: NORMAL,
          color: GHOST_COLORS[1],
          homeX: 8,
          homeY: 10,
        },
        {
          x: 10,
          y: 10,
          direction: UP,
          state: NORMAL,
          color: GHOST_COLORS[2],
          homeX: 10,
          homeY: 10,
        },
        {
          x: 9,
          y: 9,
          direction: UP,
          state: NORMAL,
          color: GHOST_COLORS[3],
          homeX: 9,
          homeY: 9,
        },
      ],
      score: 0,
      lives: 3,
      gameOver: false,
      gameWon: false,
      level: 1,
      dotsCount: 0,
      totalDots: 0,
      powerMode: false,
      powerModeTimer: null,
      paused: false,
      showInstructions: false,
      gameStarted: true,
    });
  };

  // Handle directional buttons (for mobile)
  const handleDirectionButtonClick = (direction) => {
    if (gameState.showInstructions) {
      setGameState((prev) => ({
        ...prev,
        showInstructions: false,
        gameStarted: true,
      }));
      return;
    }

    if (gameState.gameOver || gameState.gameWon) {
      resetGame();
      return;
    }

    setGameState((prev) => ({
      ...prev,
      pacman: {
        ...prev.pacman,
        nextDirection: direction,
      },
    }));
  };

  // Toggle pause state
  const togglePause = () => {
    if (gameState.showInstructions) {
      setGameState((prev) => ({
        ...prev,
        showInstructions: false,
        gameStarted: true,
      }));
      return;
    }

    if (gameState.gameOver || gameState.gameWon) {
      resetGame();
      return;
    }

    setGameState((prev) => ({ ...prev, paused: !prev.paused }));
  };

  return (
    <div className="pacman-game">
      <h2>Pacman</h2>

      <div className="score-container">
        <div className="score">Score: {gameState.score}</div>
        <div className="lives">Lives: {gameState.lives}</div>
      </div>

      <div className="game-area-container">
        <canvas
          ref={canvasRef}
          width={570}
          height={660}
          className="pacman-canvas"
        />

        {gameState.showInstructions && (
          <div className="game-instructions">
            <h3>How to Play</h3>
            <div className="instruction-content">
              <p>• Use arrow keys, WASD, or touch controls to move</p>
              <p>• Eat all dots to complete the level</p>
              <p>• Avoid ghosts or you'll lose a life</p>
              <p>• Power pellets let you eat ghosts temporarily</p>
              <p>• Press P or Space to pause the game</p>
            </div>
            <button
              onClick={() =>
                setGameState((prev) => ({
                  ...prev,
                  showInstructions: false,
                  gameStarted: true,
                }))
              }
            >
              Let's Play!
            </button>
            <p className="instruction-hint">
              Press any key or tap button to start
            </p>
          </div>
        )}

        {gameState.paused &&
          !gameState.gameOver &&
          !gameState.gameWon &&
          !gameState.showInstructions && (
            <div className="game-paused">
              <h3>Game Paused</h3>
              <p>Press P or Space to continue</p>
              <button
                onClick={() =>
                  setGameState((prev) => ({ ...prev, paused: false }))
                }
              >
                Resume
              </button>
            </div>
          )}

        {gameState.gameOver && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <p>Your score: {gameState.score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}

        {gameState.gameWon && (
          <div className="game-won">
            <h3>Level Complete!</h3>
            <p>Your score: {gameState.score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>

      <div className="controls">
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionButtonClick(UP)}
            aria-label="Move Up"
          >
            ↑
          </div>
        </div>
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionButtonClick(LEFT)}
            aria-label="Move Left"
          >
            ←
          </div>
          <div
            className="control-btn"
            onClick={togglePause}
            aria-label={gameState.paused ? "Resume Game" : "Pause Game"}
          >
            {gameState.paused ? "▶" : "⏸"}
          </div>
          <div
            className="control-btn"
            onClick={() => handleDirectionButtonClick(RIGHT)}
            aria-label="Move Right"
          >
            →
          </div>
        </div>
        <div className="controls-row">
          <div
            className="control-btn"
            onClick={() => handleDirectionButtonClick(DOWN)}
            aria-label="Move Down"
          >
            ↓
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacmanGame;
