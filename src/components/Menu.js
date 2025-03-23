import React from "react";
import "../styles/Menu.css";
import games from "../games";

const Menu = ({ onSelectGame }) => {
  return (
    <div className="menu-container">
      <h1>React Arcade</h1>
      <div className="game-list">
        {Object.keys(games).map((gameKey) => (
          <div
            key={gameKey}
            className="game-item"
            onClick={() => onSelectGame(gameKey)}
          >
            <h2>{games[gameKey].title}</h2>
            <p>{games[gameKey].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
