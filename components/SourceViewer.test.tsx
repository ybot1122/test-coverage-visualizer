import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { SourceViewer } from "./SourceViewer";
import { useTheme } from "./ThemeContext";

// Mock dependencies
jest.mock("./ThemeContext", () => ({
  useTheme: jest.fn(),
}));
jest.mock("react-syntax-highlighter/dist/esm/styles/hljs", () => ({}));
jest.mock("../utils/getLinesStatus", () => ({
  getLinesStatus: jest.fn(() => []),
}));
jest.mock("../utils/getBranchesStatus", () => ({
  getBranchesStatus: jest.fn(() => []),
}));
jest.mock("../utils/replaceTextWithSpanByColumn", () => ({
  replaceTextWithSpanByColumn: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Helper to render component
const renderComponent = (props = {}) => {
  (useTheme as jest.Mock).mockReturnValue({ theme: "docco" });
  return render(
    <SourceViewer filePath="file.ts" coverage={{} as any} {...props} />
  );
};

describe("SourceViewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error if fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        error: "Not found",
        details: { message: "File not found" },
      }),
    });
    renderComponent();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/file not found/i)).toBeInTheDocument()
    );
  });

  it("renders source code when fetch succeeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        content: btoa("console.log('hello world')"),
      }),
    });
    renderComponent();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/console/)).toBeInTheDocument()
    );
  });

  it("shows error message when coverage is missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        content: btoa("console.log('hello world')"),
      }),
    });
    renderComponent({ coverage: undefined });
    await waitFor(() =>
      expect(
        screen.getByText(/failed to load coverage map/i)
      ).toBeInTheDocument()
    );
  });
});
