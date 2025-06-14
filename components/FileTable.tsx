import { CoverageEntry, CoverageJSON } from "@/types/CoverageSummary";
import { filenameRegex } from "@/utils/filenameRegex";
import { FileTableRow } from "./FileTableRow";
import { useEffect, useState } from "react";
import { SortIcon } from "./SortIcon";
import SortButton from "./SortButton";
import { buildFileKey } from "@/utils/buildFileKey";

interface FileTableProps {
  entries: string[];
  coverageSummary: CoverageJSON;
  coverageByDirectory: Record<string, CoverageEntry>;
  path: string;
}

function getFirstPathSegment(path: string): string {
  // Remove leading/trailing slashes
  path = path.replace(/^\/+|\/+$/g, "");
  // If the path is empty after trimming, return an empty string
  if (path === "") return "";
  // Split by '/' and return the first segment (handles single filename too)
  const segments = path.split("/");
  return segments[0];
}

const EmptyCoverageEntry: CoverageEntry = {
  statements: { pct: 0, covered: 0, total: 0, skipped: 0 },
  branches: { pct: 0, covered: 0, total: 0, skipped: 0 },
  functions: { pct: 0, covered: 0, total: 0, skipped: 0 },
  lines: { pct: 0, covered: 0, total: 0, skipped: 0 },
};

export const FileTable: React.FC<FileTableProps> = ({
  entries,
  coverageByDirectory,
  coverageSummary,
  path,
}) => {
  const [data, setData] = useState<{ [key: string]: CoverageEntry }>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof CoverageEntry | null | string>(
    null,
  );

  useEffect(() => {
    const names = entries.map(getFirstPathSegment);
    const folders = [
      ...new Set(names.filter((file) => !filenameRegex.test(file)).sort()),
    ];
    const files = names.filter((file) => filenameRegex.test(file)).sort();

    const d: { [key: string]: CoverageEntry } = {};

    folders.forEach((folderName) => {
      const k = buildFileKey(path, folderName);
      const key = Object.keys(coverageByDirectory).find((f) => f === k);
      d[folderName] = key ? coverageByDirectory[key] : EmptyCoverageEntry;
    });

    files.forEach((fileName) => {
      const key = Object.keys(coverageSummary).find((f) =>
        f.endsWith(fileName.replace("/", "\\")),
      );
      d[fileName] = key ? coverageSummary[key] : EmptyCoverageEntry;
    });

    setData(d);
  }, [entries, coverageByDirectory, coverageSummary]);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th className="text-left border-b border-gray-300">
            <SortButton
              onClick={() => {
                setSortKey("name");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Name
            </SortButton>
          </th>
          <th className="text-left border-b border-gray-300">
            <SortButton
              onClick={() => {
                setSortKey("statements");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Statements
            </SortButton>
          </th>
          <th className="text-left border-b border-gray-300">
            <SortButton
              onClick={() => {
                setSortKey("branches");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Branches
            </SortButton>
          </th>
          <th className="text-left border-b border-gray-300">
            <SortButton
              onClick={() => {
                setSortKey("functions");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Functions
            </SortButton>
          </th>
          <th className="text-left border-b border-gray-300">
            <button
              type="button"
              className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => {
                setSortKey("lines");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Lines
              <SortIcon />{" "}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data)
          .sort((a, b) => {
            const [nameA, coverageA] = a;
            const [nameB, coverageB] = b;

            if (sortKey === "name") {
              return sortOrder === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            }

            const valueA = coverageA[sortKey as keyof CoverageEntry]?.pct || 0;
            const valueB = coverageB[sortKey as keyof CoverageEntry]?.pct || 0;

            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          })
          .map(([name, coverage]) => {
            const type = filenameRegex.test(name) ? "file" : "directory";

            return (
              <FileTableRow
                key={name}
                path={path}
                name={name}
                type={type}
                coverage={coverage}
              />
            );
          })}
      </tbody>
    </table>
  );
};
