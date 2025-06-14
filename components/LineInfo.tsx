import { CoverageMap } from "@/types/CoverageMap";

export const LineInfo = ({
  line,
  x,
  y,
  coverage,
}: {
  line: number;
  x: number;
  y: number;
  coverage: CoverageMap | undefined;
}) => {
  if (!coverage) return null;

  let lineCount: number | undefined = undefined;
  let isFnDecl = false;

  Object.entries(coverage.statementMap).forEach(([id, loc]: [string, any]) => {
    const count = coverage.s[id];
    const lineStart = loc.start.line;
    const lineEnd = loc.end.line ?? loc.start.line;
    for (let i = lineStart; i <= lineEnd; i++) {
      if (i === line && count > 0) {
        lineCount = (lineCount ?? 0) + count;
      }
    }
  });

  Object.entries(coverage.fnMap).forEach(([id, { decl }]: [string, any]) => {
    for (let i = decl.start; i <= decl.end; i++) {
      if (i === line) {
        isFnDecl = true;
      }
    }
  });

  const exCount =
    lineCount === undefined
      ? ""
      : lineCount === 0
      ? "never executed"
      : `executed ${lineCount}x`;
  const fnDecl = isFnDecl ? "function declaration" : "";

  return (
    <div
      className="absolute bg-blue-300 p-2"
      style={{
        top: y - 40,
        left: x + 50,
      }}
    >
      Line {line}: {exCount} {fnDecl}
    </div>
  );
};
