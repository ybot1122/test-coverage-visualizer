import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "./getCoverageForLine";

export type LineStatus = {
  count: number;
  range: any[];
  covered: boolean;
  line: number;
  fnDecl?: string;
  raw?: string;
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

  for (let i = 0; i < status.length; i++) {
    const content = document.getElementById(`line-${i}`)?.textContent;
    status[i].line = i;
    if (content) {
      status[i].raw = content;
    }
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
      status[i].covered = !forLine.some((r) => !r.covered);
      status[i].count = count;
      status[i].range = forLine;
    }
  });

  Object.entries(coverage.fnMap).forEach(
    ([id, { decl, name }]: [string, any]) => {
      const fnDecl = `${name} declaration`;
      for (let i = decl.start.line; i <= decl.end.line; i++) {
        status[i].fnDecl = fnDecl;
      }
    }
  );

  return status;
}
