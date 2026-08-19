import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReportsPage } from "./ReportsPage";

const subjectNames = [
  "Toán",
  "Ngữ văn",
  "Ngoại ngữ",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "Giáo dục công dân",
];

afterEach(() => vi.unstubAllGlobals());

describe("ReportsPage", () => {
  it("renders nine subjects and four score bands from the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              subjects: subjectNames.map((subjectName, index) => ({
                subjectCode: `subject_${index}`,
                subjectName,
                totalWithScore: 100,
                bands: [
                  { key: "gte_8", label: ">= 8", count: 10 },
                  { key: "gte_6_lt_8", label: ">= 6 và < 8", count: 20 },
                  { key: "gte_4_lt_6", label: ">= 4 và < 6", count: 30 },
                  { key: "lt_4", label: "< 4", count: 40 },
                ],
              })),
            },
            meta: {},
          }),
      }),
    );
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <ReportsPage />
      </QueryClientProvider>,
    );

    await userEvent.click(await screen.findByText("Xem bảng số liệu chi tiết"));
    const table = await screen.findByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(10);
    expect(within(table).getByText("Giáo dục công dân")).toBeInTheDocument();
    expect(within(table).getByText("Từ 8 điểm")).toBeInTheDocument();
    expect(within(table).getAllByText("10")).toHaveLength(9);
  });
});
