import React from "react";
import { render, screen } from "@testing-library/react";
import { FileTableRow } from "./FileTableRow";
import "@testing-library/jest-dom";

const coverage = {
  statements: { total: 10, covered: 9, skipped: 0, pct: 90 },
  branches: { total: 10, covered: 8, skipped: 0, pct: 80 },
  functions: { total: 10, covered: 7, skipped: 0, pct: 70 },
  lines: { total: 10, covered: 6, skipped: 0, pct: 60 },
};

describe("FileTableRow", () => {
  it("renders file row with correct icon and link", () => {
    render(
      <table>
        <tbody>
          <FileTableRow
            path="src"
            name="App.tsx"
            type="file"
            coverage={coverage}
          />
        </tbody>
      </table>
    );

    // Icon
    expect(screen.getByText("📄")).toBeInTheDocument();

    // Link
    const link = screen.getByRole("link", { name: "App.tsx" });
    expect(link).toHaveAttribute("href", "/src/App.tsx");
    expect(link).toHaveClass("text-blue-700");
  });

  it("renders directory row with correct icon and link", () => {
    render(
      <table>
        <tbody>
          <FileTableRow
            path="src"
            name="components"
            type="directory"
            coverage={coverage}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("📁")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "components" });
    expect(link).toHaveAttribute("href", "/src/components");
  });

  it("renders correct coverage values", () => {
    render(
      <table>
        <tbody>
          <FileTableRow name="index.ts" type="file" coverage={coverage} />
        </tbody>
      </table>
    );

    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("handles empty path", () => {
    render(
      <table>
        <tbody>
          <FileTableRow name="index.ts" type="file" coverage={coverage} />
        </tbody>
      </table>
    );

    expect(screen.getByRole("link", { name: "index.ts" })).toHaveAttribute(
      "href",
      "/index.ts"
    );
  });
});
