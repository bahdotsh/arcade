import React from "react";
import SnakeGame from "./SnakeGame/SnakeGame";
import PacmanGame from "./PacmanGame/PacmanGame";

// Enhanced Snake game icon with a more arcade-like appearance
const SnakeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="100%"
    height="100%"
    style={{ shapeRendering: "crispEdges" }}
  >
    <path d="M2 4h4v4H2V4m6 0h4v4H8V4m6 0h4v4h-4V4m6 0h4v4h-4V4M2 10h4v4H2v-4m6 0h4v4H8v-4m6 0h4v4h-4v-4m6 4h4v4h-4v-4M2 16h4v4H2v-4m12 0h4v4h-4v-4m6 0h4v4h-4v-4" />
    <circle cx="12" cy="16" r="2" fill="currentColor" />
  </svg>
);

// Pacman game icon
const PacmanIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="100%"
    height="100%"
  >
    <path
      d="M12,2c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2 M12,4C7.6,4,4,7.6,4,12s3.6,8,8,8c0.3,0,0.7,0,1-0.1
    C8.6,19.5,5.3,16,5.3,12S8.6,4.5,13,4.1C12.7,4,12.3,4,12,4 M9,8l7,4l-7,4V8z"
    />
  </svg>
);

// Registry of all games
const games = {
  snake: {
    title: "Snake",
    description:
      "Classic Snake game. Eat food, grow longer, don't hit the walls or yourself! How long can you survive?",
    component: SnakeGame,
    icon: <SnakeIcon />,
  },
  pacman: {
    title: "Pacman",
    description:
      "Navigate through a maze, eat dots, avoid ghosts! Grab power pellets to turn the tables on those pesky ghosts.",
    component: PacmanGame,
    icon: <PacmanIcon />,
  },
  // Add more games here in the future
};

export default games;
