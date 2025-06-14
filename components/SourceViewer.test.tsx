import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { SourceViewer } from "./SourceViewer";
import { ThemeProvider } from "./ThemeContext";

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
jest.mock("./TestRecommender", () => ({
  TestRecommender: () => <div>Test Recommender</div>,
}));

// Mock fetch
global.fetch = jest.fn();

// Helper to render component
const renderComponent = (props = {}) => {
  return render(
    <ThemeProvider>
      <SourceViewer filePath="file.ts" coverage={{} as any} {...props} />
    </ThemeProvider>
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
