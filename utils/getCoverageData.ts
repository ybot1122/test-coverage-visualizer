import summary from "../public/coverage-summary.json";
import coverageMap from "../public/coverage-final.json";
import { CoverageJSON } from "@/types/CoverageSummary";
import { CoverageMap } from "@/types/CoverageMap";
import { getAllFiles } from "./getAllFiles";
import { getCommonPathPrefix } from "./getCommonPathPrefix";

export const getCoverageData = () => {
  // Normalize coverage reports
  const normalizedSummary: CoverageJSON = {
    total: { ...summary["total"] },
  };
  Object.keys(summary).forEach((k) => {
    const normalizedKey = k.replace(/\\/g, "/");
    normalizedSummary[normalizedKey] = (summary as any)[k];
  });

  // Normalize coverage reports
  const normalizedMap: Record<string, CoverageMap> = {};
  Object.keys(coverageMap).forEach((k) => {
    const normalizedKey = k.replace(/\\/g, "/");
    normalizedMap[normalizedKey] = (coverageMap as any)[k];
  });

  // Remove common prefix
  const normalizedSummaryFinal: CoverageJSON = {
    total: { ...summary["total"] },
  };
  const files = getAllFiles(normalizedSummary);
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

  return { summary: normalizedSummaryFinal, coverage: normalizedMapFinal };
};
