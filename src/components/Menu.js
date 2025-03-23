import React from "react";
import "../styles/Menu.css";
import games from "../games";

const Menu = ({ onSelectGame }) => {
  return (
    <div className="menu-container">
      <h1>Arcade</h1>
      <p className="menu-subtitle">Select a game and start playing!</p>

      <div className="game-list">
        {Object.keys(games).map((gameKey) => (
          <div
            key={gameKey}
            className="game-item"
            onClick={() => onSelectGame(gameKey)}
          >
            <div className="game-icon">{games[gameKey].icon}</div>
            <h2>{games[gameKey].title}</h2>
            <p>{games[gameKey].description}</p>
            <button className="play-button">Play Now</button>
          </div>
        ))}
      </div>

      <div className="footer">
        <p>© 2025 Arcade App | All games for entertainment purposes</p>
      </div>
    </div>
  );
};

export default Menu;
