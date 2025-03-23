import { render, screen } from "@testing-library/react";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Helper function to render with theme provider
const renderWithTheme = (ui, options) =>
  render(ui, { wrapper: ThemeProvider, ...options });

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
