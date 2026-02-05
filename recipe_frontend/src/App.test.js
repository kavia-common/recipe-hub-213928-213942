import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Recipe Hub brand", () => {
  render(<App />);
  const brand = screen.getByRole("link", { name: /recipe hub/i });
  expect(brand).toBeInTheDocument();
  expect(brand).toHaveAttribute("href", "/");
});
