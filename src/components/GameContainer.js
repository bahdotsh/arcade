import React from "react";
import games from "../games";

const GameContainer = ({ gameKey, onBackToMenu }) => {
  const Game = games[gameKey].component;

  return (
    <div className="game-container">
      <button className="back-button" onClick={onBackToMenu}>
        ← Back to Menu
      </button>
      <Game />
    </div>
  );
};

export default GameContainer;
