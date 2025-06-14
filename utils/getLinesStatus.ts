import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "./getCoverageForLine";

// Annotates lines based on statement coverage
export function getLinesStatus(
  source: string,
  coverage: CoverageMap | undefined
): ("covered" | "uncovered" | undefined)[] {
  const lines = source.split("\n");
  const status = Array(lines.length + 1).fill("covered");

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
      status[i] = getCoverageForLine(coverage, i).some((r) => !r.covered)
        ? "uncovered"
        : "covered";
    }
  });
  return status;
}
