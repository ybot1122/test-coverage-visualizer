import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "./getCoverageForLine";

export type LineStatus = {
  count: number;
  range: any[];
  covered: boolean;
  line: number;
  fnDecl?: string;
  branchType?: string;
  raw?: string;
  statementIds: string[];
  branchIds: string[];
  fnIds: string[];
};

// Annotates lines based on statement coverage
export function getStatementsStatus(
  source: string,
  coverage: CoverageMap | undefined
): LineStatus[] {
  const lines = source.split("\n");
  const status = Array(lines.length + 1);

  if (!coverage) {
    return status; // No coverage data available
  }

  for (let i = 0; i < status.length; i++) {
    const content = document.getElementById(`line-${i}`)?.textContent;
    status[i] = {
      count: -1,
      range: [],
      covered: true,
      line: i,
      statementIds: [],
      branchIds: [],
      fnIds: [],
    };
    if (content) {
      status[i].raw = content.replace(/^\d+/, "");
    }
  }

  Object.entries(coverage.statementMap).forEach(([id, loc]: [string, any]) => {
    const count = coverage.s[id];
    const lineStart = loc.start.line;
    const lineEnd = loc.end.line ?? loc.start.line;
    for (let i = lineStart; i <= lineEnd; i++) {
      const forLine = getCoverageForLine(coverage, i);
      status[i].covered = !forLine.some((r) => !r.covered);
      status[i].count = count;
      status[i].range = forLine;
      status[i].statementIds.push(id);
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

  Object.entries(coverage.branchMap).forEach(
    ([id, { loc, type, locations }]: [string, any]) => {
      const branchType = `${type} expression with ${locations.length} branch${
        locations.length > 1 ? "es" : ""
      }`;
      for (let i = loc.start.line; i <= loc.end.line; i++) {
        status[i].branchType = branchType;
        status[i].branchIds.push(id);
      }
    }
  );

  return status;
}
