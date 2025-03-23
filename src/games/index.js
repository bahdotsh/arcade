import SnakeGame from "./SnakeGame/SnakeGame";

// Registry of all games
const games = {
  snake: {
    title: "Snake",
    description:
      "Classic Snake game. Eat food, grow longer, don't hit the walls or yourself!",
    component: SnakeGame,
  },
  // Add more games here in the future
};

export default games;
