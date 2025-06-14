import SyntaxHighlighter from "react-syntax-highlighter";
import { useEffect, useState } from "react";
import { CoverageMap } from "../types/CoverageMap";
import { themeMap, useTheme } from "./ThemeContext";
import { getLinesStatus } from "../utils/getLinesStatus";
import { SyntaxHighlighterTheme } from "../types/SyntaxHighlighterThemes";
import { getBranchesStatus } from "../utils/getBranchesStatus";
import { replaceTextWithSpanByColumn } from "../utils/replaceTextWithSpanByColumn";
import { TestRecommender } from "./TestRecommender";
import { LineInfo } from "./LineInfo";

const dark_bg: SyntaxHighlighterTheme[] = [
  "darcula",
  "dark",
  "hopscotch",
  "nightOwl",
  "ocean",
  "sunburst",
  "vs2015",
];

/**
 * Component to display source code with coverage highlighting.
 */
export function SourceViewer({
  filePath,
  coverage,
}: {
  filePath: string;
  coverage: CoverageMap | undefined;
}) {
  const [source, setSource] = useState("");
  const [error, setError] = useState<string>();
  const [infoCoords, setInfoCoords] = useState<{
    x: number;
    y: number;
    line: number;
  }>();
  const { theme } = useTheme();

  useEffect(() => {
    fetch(`/get_file?path=${encodeURIComponent(filePath)}&ref=main`)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response?.details?.message || response.error);
        }
        return atob(response.content);
      })
      .then(setSource)
      .catch((e) => setError(e.message));
  }, [filePath]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (source === "") {
    return <div className="text-gray-500">Loading...</div>;
  }

  const language =
    filePath.endsWith(".ts") || filePath.endsWith(".tsx")
      ? "typescript"
      : "javascript";

  const linesStatus = getLinesStatus(source, coverage);
  const branchesStatus = getBranchesStatus(source, coverage);

  const uncovered_highlighter = dark_bg.includes(theme)
    ? "bg-red-900"
    : "bg-red-100";

  setTimeout(() => {
    for (let i = 0; i < branchesStatus.length; i++) {
      for (let j = 0; j < branchesStatus[i].length; j++) {
        replaceTextWithSpanByColumn(
          `line-${i}`,
          branchesStatus[i][j].colStart,
          branchesStatus[i][j].colEnd
        );
      }
    }
  }, 500);

  return (
    <>
      {!coverage && (
        <p className="text-red-500">
          Error: Failed to load coverage map. Cannot highlight the lines. This
          is a bug.
        </p>
      )}
      <div className="grid grid-cols-2">
        {infoCoords && (
          <LineInfo
            line={infoCoords.line}
            x={infoCoords.x}
            y={infoCoords.y}
            coverage={coverage}
          />
        )}
        <div>
          <SyntaxHighlighter
            language={language}
            showLineNumbers
            showInlineLineNumbers
            style={themeMap[theme]}
            lineProps={(lineNumber) => {
              const id = `line-${lineNumber}`;
              return {
                key: lineNumber,
                id,
                className: `${
                  linesStatus[lineNumber] === "uncovered"
                    ? uncovered_highlighter
                    : ""
                }`,
                onPointerEnter: (e) => {
                  document.getElementById(id)?.classList.add("hovered-line");
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = rect.left + window.scrollX;
                  const y = rect.top + window.scrollY;
                  setInfoCoords({ line: lineNumber, x, y });
                  console.log(e, lineNumber);
                },
                onPointerLeave: (e) => {
                  document.getElementById(id)?.classList.remove("hovered-line");
                  setInfoCoords(undefined);
                },
              };
            }}
            wrapLines
          >
            {source.replace("```typescript", "")}
          </SyntaxHighlighter>
        </div>
        <div className="border-l-1 border-gray-300">
          <TestRecommender filePath={filePath} language={language} />
        </div>
      </div>
    </>
  );
}
