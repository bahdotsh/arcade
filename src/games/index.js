import React from "react";
import SnakeGame from "./SnakeGame/SnakeGame";

// Snake game icon
const SnakeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="100%"
    height="100%"
  >
    <path d="M18.5,2C19.9,2 21,3.1 21,4.5C21,5.89 19.89,7 18.5,7C17.11,7 16,5.89 16,4.5C16,3.11 17.11,2 18.5,2M18.5,7A4.5,4.5 0 0,1 23,11.5A4.5,4.5 0 0,1 18.5,16C17.24,16 16.09,15.5 15.27,14.66L12.76,16.78L12.76,19.91C14.04,20.5 15,21.81 15,23.31C15,24.77 13.77,26 12.31,26C10.85,26 9.62,24.77 9.62,23.31C9.62,21.81 10.57,20.5 11.85,19.91L11.85,16L7.91,12.5L5.27,14.66C4.46,15.5 3.3,16 2.04,16A4.5,4.5 0 0,1 -2.5,11.5A4.5,4.5 0 0,1 2,7C3.3,7 4.4,7.5 5.23,8.34L7.86,6.18C7.86,6.18 9,5.38 10.15,5.38C11.3,5.38 13.14,6.3 13.14,6.3L15.27,8.34C16.09,7.5 17.24,7 18.5,7Z" />
  </svg>
);

// Registry of all games
const games = {
  snake: {
    title: "Snake",
    description:
      "Classic Snake game. Eat food, grow longer, don't hit the walls or yourself!",
    component: SnakeGame,
    icon: <SnakeIcon />,
  },
  // Add more games here in the future
};

export default games;
