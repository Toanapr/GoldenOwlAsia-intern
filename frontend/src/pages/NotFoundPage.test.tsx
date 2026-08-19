import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { NotFoundPage } from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("explains the error and provides a route back to the dashboard", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Không tìm thấy trang" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Về trang tổng quan" }),
    ).toHaveAttribute("href", "/");
  });
});
