import { render, screen } from "@testing-library/react";
import App from "./App";
import { ThemeContext } from "./context/ThemeContext";

// This approach creates a custom wrapper that provides the ThemeContext values directly
// instead of using the actual ThemeProvider that depends on browser APIs
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
  const titleElement = screen.getByText(/Arcade/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders game list", () => {
  renderWithTheme(<App />);
  // Use a more specific query or query by role
  const gameItem = screen.getByRole("heading", { name: /Snake/i });
  expect(gameItem).toBeInTheDocument();

  const snakeDescription = screen.getByText(
    /Classic Snake game. Eat food, grow longer/i,
  );
  expect(snakeDescription).toBeInTheDocument();
});
