import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchPage } from "./SearchPage";

const subjects = [
  ["math", "Toán", 8.4],
  ["literature", "Ngữ văn", 6.75],
  ["foreign_language", "Ngoại ngữ", 8],
  ["physics", "Vật lý", 6],
  ["chemistry", "Hóa học", 5.25],
  ["biology", "Sinh học", 5],
  ["history", "Lịch sử", null],
  ["geography", "Địa lý", null],
  ["civic_education", "Giáo dục công dân", null],
].map(([subjectCode, subjectName, score]) => ({
  subjectCode,
  subjectName,
  score,
}));

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <SearchPage />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SearchPage", () => {
  it("does not call the API for an invalid registration number", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderPage();

    const input = screen.getByLabelText("Số báo danh");
    await user.type(input, "123");
    await user.tab();

    expect(
      screen.getByText("Số báo danh phải gồm đúng 8 chữ số."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tra cứu" })).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders all subjects and uses an em dash for null scores", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              registrationNumber: "01000001",
              foreignLanguageCode: "N1",
              scores: subjects,
            },
            meta: {},
          }),
      }),
    );
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Số báo danh"), "01000001{Enter}");

    expect(await screen.findByText("01000001")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Không có điểm")).toHaveLength(3);
    expect(screen.getByText("Giáo dục công dân")).toBeInTheDocument();
  });

  it("shows not-found differently from a network error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            statusCode: 404,
            code: "SCORE_NOT_FOUND",
            message: "Not found",
            details: [],
          }),
      })
      .mockRejectedValueOnce(new TypeError("network"));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderPage();

    const input = screen.getByLabelText("Số báo danh");
    await user.type(input, "99999999");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));
    expect(
      await screen.findByText("Không tìm thấy kết quả"),
    ).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "88888888");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));
    expect(
      await screen.findByText("Không thể tải dữ liệu"),
    ).toBeInTheDocument();
  });
});
