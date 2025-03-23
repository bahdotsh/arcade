import React, { useState } from "react";
import Menu from "./components/Menu";
import GameContainer from "./components/GameContainer";
import "./styles/App.css";

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleSelectGame = (gameKey) => {
    setCurrentGame(gameKey);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <div className="app">
      {currentGame ? (
        <GameContainer gameKey={currentGame} onBackToMenu={handleBackToMenu} />
      ) : (
        <Menu onSelectGame={handleSelectGame} />
      )}
    </div>
  );
}

export default App;
