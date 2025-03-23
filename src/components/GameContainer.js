import React from "react";
import games from "../games";

const GameContainer = ({ gameKey, onBackToMenu }) => {
  const Game = games[gameKey].component;
  const gameTitle = games[gameKey].title;

  return (
    <div className="game-container">
      <button className="back-button" onClick={onBackToMenu}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
        </svg>
        Back to Menu
      </button>
      <Game />
    </div>
  );
};

export default GameContainer;
