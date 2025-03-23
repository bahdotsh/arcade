import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders arcade menu page", () => {
  render(<App />);
  const titleElement = screen.getByText(/Arcade/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders game list", () => {
  render(<App />);
  // Use a more specific query or query by role
  const gameItem = screen.getByRole("heading", { name: /Snake/i });
  expect(gameItem).toBeInTheDocument();

  const snakeDescription = screen.getByText(
    /Classic Snake game. Eat food, grow longer/i,
  );
  expect(snakeDescription).toBeInTheDocument();
});
