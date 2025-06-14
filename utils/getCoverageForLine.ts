import { CoverageMap } from "@/types/CoverageMap";

/**
 * Given a Jest/Istanbul coverage report for a file, and a line number,
 * returns the covered and uncovered ranges on that line.
 *
 * @param {Object} fileCoverage - The JSON coverage object for a specific file.
 * @param {number} lineNumber - The 1-based line number to check.
 * @returns {Array<{ startColumn: number, endColumn: number, covered: boolean }>}
 */
export function getCoverageForLine(
  fileCoverage: CoverageMap,
  lineNumber: number
) {
  const { statementMap, s } = fileCoverage;
  const ranges = [];

  for (const [stmtId, loc] of Object.entries(statementMap)) {
    // Check if the statement overlaps with the line
    if (loc.start.line <= lineNumber && loc.end.line >= lineNumber) {
      let startColumn, endColumn;
      if (loc.start.line === lineNumber && loc.end.line === lineNumber) {
        // Statement is fully on this line
        startColumn = loc.start.column;
        endColumn = loc.end.column;
      } else if (loc.start.line === lineNumber) {
        // Statement starts on this line, ends later
        startColumn = loc.start.column;
        endColumn = Infinity; // until end of line
      } else if (loc.end.line === lineNumber) {
        // Statement started earlier, ends on this line
        startColumn = 0;
        endColumn = loc.end.column;
      } else {
        // Statement fully spans this line (started before, ends after)
        startColumn = 0;
        endColumn = Infinity; // until end of line
      }

      ranges.push({
        startColumn,
        endColumn,
        covered: s[stmtId] > 0,
      });
    }
  }

  // Optionally, you could sort and/or merge overlapping ranges here

  return ranges;
}
