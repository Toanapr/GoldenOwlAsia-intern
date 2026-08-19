import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppLayout } from "./AppLayout";

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<h1>Trang tổng quan</h1>} />
          <Route path="search" element={<h1>Trang tra cứu</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AppLayout accessibility", () => {
  it("supports skip navigation, Escape dismissal and route focus", async () => {
    const user = userEvent.setup();
    renderLayout();

    expect(
      screen.getByRole("link", { name: "Bỏ qua điều hướng" }),
    ).toHaveAttribute("href", "#main-content");

    const menuButton = screen.getByRole("button", { name: "Mở menu" });
    await user.click(menuButton);
    const dialog = screen.getByRole("dialog", { name: "Menu điều hướng" });
    expect(
      within(dialog).getByRole("button", { name: "Đóng menu" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();

    await user.click(menuButton);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("link", {
        name: "Tra cứu điểm",
      }),
    );
    expect(screen.getByRole("main")).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "Trang tra cứu" }),
    ).toBeInTheDocument();
  });
});
