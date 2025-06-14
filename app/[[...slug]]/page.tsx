"use client";

import { SourceViewer } from "@/components/SourceViewer";
import { filenameRegex } from "@/utils/filenameRegex";
import Link from "next/link";
import { useParams } from "next/navigation";
import { aggregateCoverageByDirectory } from "@/utils/aggregateCoverageByDirectory";
import { CoverageEntry } from "@/types/CoverageSummary";
import { getAllFiles } from "@/utils/getAllFiles";
import { FileTable } from "@/components/FileTable";
import { ThemeProvider } from "@/components/ThemeContext";
import ThemeSelector from "@/components/ThemeSelector";
import { useCoverageData } from "@/components/CoverageDataContext";
import { filepathToLinks } from "@/utils/filepathToLinks";
import { buildFileKey } from "@/utils/buildFileKey";
import { PageStatItem } from "@/components/PageStatItem";

export default function Page() {
  const params = useParams();
  const { summary, coverageMap } = useCoverageData();

  if (!summary || !coverageMap) {
    return <div>Fetching coverage report...</div>;
  }

  const slug = params.slug;
  const path = slug ? (Array.isArray(slug) ? slug.join("/") : slug) : "";
  const isRoot = !path || path === "/";
  const isFile = !!(slug && filenameRegex.test(slug[slug.length - 1]));
  const coverageByDirectory = aggregateCoverageByDirectory(summary);
  const files = getAllFiles(summary);
  const trimmedFiles = files
    .filter((f) => f.startsWith("/" + path))
    .map((f) => f.replace("/" + path, ""));
  const key = buildFileKey(path, "");
  const fileKey = isFile
    ? Object.keys(summary).find((f) => f === key)
    : Object.keys(coverageByDirectory).find((f) => f === key);

  let coverage: CoverageEntry = summary["total"];

  if (!isRoot && fileKey) {
    coverage = isFile
      ? summary[fileKey as keyof typeof summary]
      : coverageByDirectory[fileKey];
  }

  const { statements, branches, functions, lines } = coverage;

  return (
    <ThemeProvider>
      <div className="grid min-h-screen p-8 gap-16 w-full">
        <main className="w-full">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl">Test Coverage Report</h1>
            {isFile && (
              <div className="ml-auto">
                <ThemeSelector />
              </div>
            )}
          </div>
          <div className="mb-5">
            <div>
              {" "}
              <Link
                href={`/`}
                className="text-blue-700 underline bg-none border-none cursor-pointer p-0 mx-1"
              >
                root
              </Link>
              <span className="mx-1">/</span>
              {filepathToLinks(path)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-5 w-full text-sm">
            <PageStatItem
              pct={statements.pct}
              stat="Statements"
              covered={statements.covered}
              total={statements.total}
            />
            <PageStatItem
              pct={branches.pct}
              stat="Branches"
              covered={branches.covered}
              total={branches.total}
            />
            <PageStatItem
              pct={functions.pct}
              stat="Functions"
              covered={functions.covered}
              total={functions.total}
            />
            <PageStatItem
              pct={lines.pct}
              stat="Lines"
              covered={lines.covered}
              total={lines.total}
            />
          </div>
          {!isFile && (
            <FileTable
              entries={trimmedFiles}
              coverageSummary={summary}
              coverageByDirectory={coverageByDirectory}
              path={path}
            />
          )}

          {isFile && (
            <SourceViewer
              filePath={path}
              coverage={
                fileKey
                  ? coverageMap[fileKey as keyof typeof coverageMap]
                  : undefined
              }
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
