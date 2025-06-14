import { CoverageEntry, CoverageJSON } from "@/types/CoverageSummary";
import { filenameRegex } from "./filenameRegex";

export function aggregateCoverageByDirectory(
  coverage: CoverageJSON,
): Record<string, CoverageEntry> {
  const dirStats: Record<string, CoverageEntry> = {};

  for (const [filePath, entry] of Object.entries(coverage)) {
    // Skip any non-file entries (such as "total" or summary fields)
    if (!filePath.includes("/")) continue;

    const dirs = filePath.split("/").slice(0, -1);

    let dir = "";
    dirs.map((seg, idx) => {
      if (filenameRegex.test(seg)) {
        return;
      }

      dir += (idx === 0 ? "" : "/") + seg;

      if (!dirStats[dir]) {
        dirStats[dir] = {
          lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
          functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
          statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
          branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
        };
      }

      dirStats[dir].lines.total += entry.lines.total;
      dirStats[dir].lines.covered += entry.lines.covered;
      dirStats[dir].lines.skipped += entry.lines.skipped;
      dirStats[dir].lines.pct =
        dirStats[dir].lines.total === 0
          ? 100
          : Math.round(
              (dirStats[dir].lines.covered / dirStats[dir].lines.total) *
                100 *
                100,
            ) / 100;

      dirStats[dir].functions.total += entry.functions.total;
      dirStats[dir].functions.covered += entry.functions.covered;
      dirStats[dir].functions.skipped += entry.functions.skipped;
      dirStats[dir].functions.pct =
        dirStats[dir].functions.total === 0
          ? 100
          : Math.round(
              (dirStats[dir].functions.covered /
                dirStats[dir].functions.total) *
                100 *
                100,
            ) / 100;

      dirStats[dir].statements.total += entry.statements.total;
      dirStats[dir].statements.covered += entry.statements.covered;
      dirStats[dir].statements.skipped += entry.statements.skipped;
      dirStats[dir].statements.pct =
        dirStats[dir].statements.total === 0
          ? 100
          : Math.round(
              (dirStats[dir].statements.covered /
                dirStats[dir].statements.total) *
                100 *
                100,
            ) / 100;

      dirStats[dir].branches.total += entry.branches.total;
      dirStats[dir].branches.covered += entry.branches.covered;
      dirStats[dir].branches.skipped += entry.branches.skipped;
      dirStats[dir].branches.pct =
        dirStats[dir].branches.total === 0
          ? 100
          : Math.round(
              (dirStats[dir].branches.covered / dirStats[dir].branches.total) *
                100 *
                100,
            ) / 100;
    });
  }

  return dirStats;
}
