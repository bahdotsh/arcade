import React from "react";
import SnakeGame from "./SnakeGame/SnakeGame";

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

// Registry of all games
const games = {
  snake: {
    title: "Snake",
    description:
      "Classic Snake game. Eat food, grow longer, don't hit the walls or yourself! How long can you survive?",
    component: SnakeGame,
    icon: <SnakeIcon />,
  },
  // Add more games here in the future
};

export default games;
