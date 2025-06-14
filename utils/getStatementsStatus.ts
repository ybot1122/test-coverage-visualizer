import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "./getCoverageForLine";

export type LineStatus = {
  count: number;
  range: any[];
  covered: boolean;
};

// Annotates lines based on statement coverage
export function getStatementsStatus(
  source: string,
  coverage: CoverageMap | undefined
): LineStatus[] {
  const lines = source.split("\n");
  const status = Array(lines.length + 1).fill({
    count: -1,
    range: [],
    covered: true,
  });

  if (!coverage) {
    return status; // No coverage data available
  }

  Object.entries(coverage.s).forEach(([id, count]: [string, number]) => {
    if (count === 0) {
      const lineStart = coverage.statementMap[id].start.line;
      const lineEnd = coverage.statementMap[id].end.line;
      for (let i = lineStart; i <= lineEnd; i++) {
        status[i] = "uncovered";
      }
    }
  });

  Object.entries(coverage.statementMap).forEach(([id, loc]: [string, any]) => {
    const count = coverage.s[id];
    const lineStart = loc.start.line;
    const lineEnd = loc.end.line ?? loc.start.line;
    for (let i = lineStart; i <= lineEnd; i++) {
      const forLine = getCoverageForLine(coverage, i);
      status[i] = {
        covered: !forLine.some((r) => !r.covered),
        count,
        range: forLine,
      };
    }
  });
  return status;
}
