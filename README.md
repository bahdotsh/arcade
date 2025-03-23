# Arcade

Arcade is a flexible, modular game platform built with React that allows you to enjoy multiple games in one application.
Its hosted at [https://arcade.gokuls.in/](https://arcade.gokuls.in/)

## Currently Available Games

- **Snake**


## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bahdotsh/arcade.git
   cd react-arcade
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Adding New Games

The arcade is designed to make adding new games straightforward:

1. Create a new folder in `src/games/` (e.g., `TetrisGame`)
2. Create your game component and CSS files
3. Add your game to the registry in `src/games/index.js`:

```javascript
import SnakeGame from "./SnakeGame/SnakeGame";
import TetrisGame from "./TetrisGame/TetrisGame";

const games = {
  snake: {
    title: "Snake",
    description: "Classic Snake game...",
    component: SnakeGame,
  },
  tetris: {
    title: "Tetris",
    description: "Block-stacking puzzle game...",
    component: TetrisGame,
  },
  // Add more games here
};

export default games;
```

## Project Structure

```
react-arcade/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # Reusable components
│   │   ├── GameContainer.js
│   │   └── Menu.js
│   ├── games/           # Individual games
│   │   ├── SnakeGame/
│   │   │   ├── SnakeGame.js
│   │   │   └── SnakeGame.css
│   │   └── index.js     # Game registry
│   ├── styles/          # Global styles
│   │   ├── App.css
│   │   └── Menu.css
│   ├── App.js           # Main component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## Contributing

Contributions are welcome! If you'd like to add a game or improve the platform:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-game`)
3. Commit your changes (`git commit -m 'Add amazing game'`)
4. Push to the branch (`git push origin feature/amazing-game`)
5. Open a Pull Request

## Future Plans

- Add more classic games (Tetris, Pong, Breakout, etc.)
- Add user accounts and score tracking
- Implement multiplayer functionality
- Create mobile-optimized controls


---

Happy gaming!
