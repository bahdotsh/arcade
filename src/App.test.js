import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders arcade menu page", () => {
  render(<App />);
  const titleElement = screen.getByText(/React Arcade/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders game list", () => {
  render(<App />);
  const snakeGameTitle = screen.getByText(/Snake/i);
  expect(snakeGameTitle).toBeInTheDocument();

  const snakeDescription = screen.getByText(/Classic Snake game/i);
  expect(snakeDescription).toBeInTheDocument();
});
