import { useEffect, useState } from "react";
import { useLineInfo } from "./LineContext";
import { useCoverageData } from "./CoverageDataContext";

export const LineInfo = ({ filePath }: { filePath: string }) => {
  const { lineInfo, setLineInfo } = useLineInfo();
  const { coverageMap } = useCoverageData();

  const [info, setInfo] = useState<{
    fnDecl: string;
  }>();

  useEffect(() => {
    if (!coverageMap || !coverageMap[filePath] || !lineInfo) return;

    let fnDecl = "";

    Object.entries(coverageMap[filePath].fnMap).forEach(
      ([id, { decl, name }]: [string, any]) => {
        for (let i = decl.start.line; i <= decl.end.line; i++) {
          if (i === lineInfo.line) {
            fnDecl = `${name} declaration`;
          }
        }
      }
    );
    setInfo({ fnDecl });
  }, [lineInfo]);

  if (!coverageMap) {
    return null;
  }
  if (!lineInfo) {
    return null;
  }

  const exCount = lineInfo.count === -1 ? "" : `executed ${lineInfo.count}x`;

  return (
    <div className="bg-blue-300 z-3000 w-full">
      <div className="grid grid-cols-3 p-2">
        <div>Line {lineInfo.line}</div>
        <div>{exCount}</div>
        <div className="text-right">
          <button
            className="hover:font-bold cursor-pointer"
            onClick={() => setLineInfo(undefined)}
          >
            X
          </button>
        </div>
      </div>
      {info?.fnDecl && <div>{info.fnDecl}</div>}
    </div>
  );
};
