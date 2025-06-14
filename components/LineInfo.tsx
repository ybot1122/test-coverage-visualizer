import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageForLine } from "@/utils/getCoverageForLine";
import { useEffect, useState } from "react";

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
  const [info, setInfo] = useState<{
    exCount: string;
    fnDecl: string;
    ranges: any[];
  }>();

  useEffect(() => {
    let lineCount: number | undefined = undefined;
    let fnDecl = "";

    const ranges = getCoverageForLine(coverage, line);
    console.log(ranges);

    Object.entries(coverage.fnMap).forEach(
      ([id, { decl, name }]: [string, any]) => {
        for (let i = decl.start.line; i <= decl.end.line; i++) {
          if (i === line) {
            fnDecl = `; ${name} declaration`;
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

    setInfo({ exCount, fnDecl, ranges });
  }, [line]);

  return (
    <div
      className="absolute bg-blue-300 p-2"
      style={{
        top: y - 140,
        left: x + 50,
      }}
    >
      Line {line}: {info?.exCount}
      {info?.fnDecl} {JSON.stringify(info?.ranges)}
    </div>
  );
};
