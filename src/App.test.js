import { render, screen } from "@testing-library/react";
import App from "./App";
import { ThemeContext } from "./context/ThemeContext";

// Custom theme provider for testing
const CustomThemeProvider = ({ children }) => {
  const themeContextValue = {
    darkMode: false,
    toggleTheme: jest.fn(),
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

const renderWithTheme = (ui, options) =>
  render(ui, { wrapper: CustomThemeProvider, ...options });

test("renders arcade menu page", () => {
  renderWithTheme(<App />);
  // Be more specific - look for the heading element instead
  const titleElement = screen.getByRole("heading", {
    name: /Arcade$/i,
    level: 1,
  });
  expect(titleElement).toBeInTheDocument();
});

test("renders game list", () => {
  renderWithTheme(<App />);
  const gameItem = screen.getByRole("heading", { name: /Snake/i });
  expect(gameItem).toBeInTheDocument();

  const snakeDescription = screen.getByText(
    /Classic Snake game. Eat food, grow longer/i,
  );
  expect(snakeDescription).toBeInTheDocument();
});
