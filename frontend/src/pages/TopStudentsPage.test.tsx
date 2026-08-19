import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopStudentsPage } from "./TopStudentsPage";

afterEach(() => vi.unstubAllGlobals());

describe("TopStudentsPage", () => {
  it("keeps the exact order returned by the API", async () => {
    const registrationNumbers = [
      "26020938",
      "01000001",
      "42000002",
      "03000003",
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              group: { code: "A", subjects: ["math", "physics", "chemistry"] },
              students: registrationNumbers.map(
                (registrationNumber, index) => ({
                  position: index + 1,
                  registrationNumber,
                  math: 10 - index * 0.1,
                  physics: 10,
                  chemistry: 10,
                  total: 30 - index * 0.1,
                }),
              ),
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
        <TopStudentsPage />
      </QueryClientProvider>,
    );

    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(4);
    expect(
      rows.map((row) => within(row).getByRole("rowheader").textContent?.trim()),
    ).toEqual(registrationNumbers);
  });
});
