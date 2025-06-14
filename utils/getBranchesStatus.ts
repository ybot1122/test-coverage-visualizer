import { CoverageMap } from "@/types/CoverageMap";

// Annotates lines based on branch coverage
export function getBranchesStatus(
  source: string,
  coverage: CoverageMap | undefined,
): { colStart: number; colEnd: number }[][] {
  const lines = source.split("\n");
  const status = Array(lines.length + 1).fill(undefined);
  for (let i = 0; i < status.length; i++) {
    status[i] = [];
  }

  if (!coverage) {
    return status; // No coverage data available
  }

  Object.entries(coverage.branchMap).forEach(
    ([id, { loc, type, locations }]: [string, any]) => {
      for (let i = 0; i < locations.length; i++) {
        const { start, end } = locations[i];
        const count = coverage.b[id][i];
        for (let j = start.line; j <= end.line; j++) {
          if (count === 0) {
            status[j].push({
              colStart: start.column,
              colEnd: end.line === j ? end.column : 10000,
            });
          }
        }
      }
    },
  );

  return status;
}
