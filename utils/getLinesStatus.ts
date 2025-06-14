import { CoverageMap } from "@/types/CoverageMap";

// Annotates lines based on statement coverage
export function getLinesStatus(
  source: string,
  coverage: CoverageMap | undefined,
): ("covered" | "uncovered" | undefined)[] {
  const lines = source.split("\n");
  const status = Array(lines.length + 1).fill(undefined);

  if (!coverage) {
    return status; // No coverage data available
  }

  Object.entries(coverage.statementMap).forEach(([id, loc]: [string, any]) => {
    const count = coverage.s[id];
    const lineStart = loc.start.line;
    const lineEnd = loc.end.line ?? loc.start.line;
    for (let i = lineStart; i <= lineEnd; i++) {
      status[i] = count > 0 ? "covered" : "uncovered";
    }
  });
  return status;
}
