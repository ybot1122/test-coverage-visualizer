import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "@/utils/getCoverageForLine";
import { LineStatus } from "@/utils/getStatementsStatus";
import { useEffect, useState } from "react";

export const LineInfo = ({
  line,
  x,
  y,
  coverage,
  lineStatus,
}: {
  line: number;
  x: number;
  y: number;
  coverage: CoverageMap | undefined;
  lineStatus: LineStatus;
}) => {
  if (!coverage) return null;
  const [info, setInfo] = useState<{
    fnDecl: string;
  }>();

  useEffect(() => {
    let lineCount: number | undefined = undefined;
    let fnDecl = "";

    Object.entries(coverage.fnMap).forEach(
      ([id, { decl, name }]: [string, any]) => {
        for (let i = decl.start.line; i <= decl.end.line; i++) {
          if (i === line) {
            fnDecl = `${name} declaration`;
          }
        }
      }
    );

    const exCount =
      lineCount === undefined
        ? ""
        : lineCount === 0
        ? "never executed"
        : `executed ${lineCount}x`;

    setInfo({ fnDecl });
  }, [line, lineStatus]);

  const exCount =
    lineStatus.count === -1 ? "" : `executed ${lineStatus.count}x`;

  return (
    <div className="fixed top-[200px] right-0 bg-blue-300 z-3000 w-[50vw]">
      <div className="grid grid-cols-3">
        <div>Line {line}</div>
        <div>{exCount}</div>
        <div></div>
      </div>
      {info?.fnDecl && <div>{info.fnDecl}</div>}
    </div>
  );
};
