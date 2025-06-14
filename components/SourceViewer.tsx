import SyntaxHighlighter from "react-syntax-highlighter";
import { useEffect, useState } from "react";
import {
  docco,
  ascetic,
  darcula,
  dark,
  github,
  hopscotch,
  idea,
  nightOwl,
  ocean,
  sunburst,
  vs2015,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CoverageMap } from "@/types/CoverageMap";
import { useTheme } from "./ThemeContext";
import { getLinesStatus } from "@/utils/getLinesStatus";
import { SyntaxHighlighterTheme } from "@/types/SyntaxHighlighterThemes";
import { getBranchesStatus } from "@/utils/getBranchesStatus";
import { replaceTextWithSpanByColumn } from "@/utils/replaceTextWithSpanByColumn";

const themeMap = {
  docco,
  ascetic,
  darcula,
  dark,
  github,
  hopscotch,
  idea,
  nightOwl,
  ocean,
  sunburst,
  vs2015,
} as const;

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
        console.log(branchesStatus[i][j]);
        replaceTextWithSpanByColumn(
          `line-${i}`,
          branchesStatus[i][j].colStart,
          branchesStatus[i][j].colEnd,
        );
      }
    }
  }, 500);

  console.log(branchesStatus);

  return (
    <>
      {!coverage && (
        <p className="text-red-500">
          Error: Failed to load coverage map. Cannot highlight the lines. This
          is a bug.
        </p>
      )}
      <SyntaxHighlighter
        language={language}
        showLineNumbers
        showInlineLineNumbers
        style={themeMap[theme]}
        lineProps={(lineNumber) => {
          return {
            key: lineNumber,
            id: `line-${lineNumber}`,
            className: `${
              linesStatus[lineNumber] === "uncovered"
                ? uncovered_highlighter
                : ""
            }`,
          };
        }}
        wrapLines
      >
        {source}
      </SyntaxHighlighter>
    </>
  );
}
