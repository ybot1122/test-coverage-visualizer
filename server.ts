import summary from "./public/coverage-wb-summary.json";
import coverageMap from "./public/coverage-wb-final.json";

import express from "express";
import next from "next";
import { CoverageEntry, CoverageJSON } from "./types/CoverageSummary";
import { CoverageMap } from "./types/CoverageMap";
import { getAllFiles } from "./utils/getAllFiles";
import { getCommonPathPrefix } from "./utils/getCommonPathPrefix";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

// Normalize coverage reports
const normalizedSummary: CoverageJSON = {
  total: { ...summary["total"] },
};
Object.keys(summary).forEach((k) => {
  const normalizedKey = k.replace("\\", "/");
  normalizedSummary[normalizedKey] = (summary as any)[k];
});

// Normalize coverage reports
const normalizedMap: Record<string, CoverageMap> = {};
Object.keys(coverageMap).forEach((k) => {
  const normalizedKey = k.replace("\\", "/");
  normalizedMap[normalizedKey] = (coverageMap as any)[k];
});

// Remove common prefix
const normalizedSummaryFinal: CoverageJSON = {
  total: { ...summary["total"] },
};
const files = getAllFiles(summary);
const commonPrefix = getCommonPathPrefix(files);
Object.keys(normalizedSummary).forEach((k) => {
  const normalizedKey = k.replace(commonPrefix, "");
  normalizedSummaryFinal[normalizedKey] = (normalizedSummary as any)[k];
});

// Remove common prefix
const normalizedMapFinal: Record<string, CoverageMap> = {};
Object.keys(normalizedMap).forEach((k) => {
  const normalizedKey = k.replace(commonPrefix, "");
  normalizedMapFinal[normalizedKey] = (normalizedMap as any)[k];
});

const cache = {
  main: {
    summary: normalizedSummaryFinal,
    coverage: normalizedMapFinal,
  },
};

/**
 * Returns the summary and coverage report.
 * {
 *  summary: { ... },
 *  coverage: { ... }
 * }
 */
server.get("/api/coverage-report", (req, res) => {
  res.json(cache.main);
});

server.get("/{*splat}", (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  server.listen(port, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
