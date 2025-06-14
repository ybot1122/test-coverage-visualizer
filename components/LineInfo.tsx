import { useCoverageData } from "./CoverageDataContext";

export const LineInfo = ({
  line,
  x,
  y,
}: {
  line: number;
  x: number;
  y: number;
}) => {
  const { coverageMap } = useCoverageData();

  console.log(coverageMap);

  return (
    <div
      className="absolute bg-blue-300 p-2"
      style={{
        top: y - 40,
        left: x + 50,
      }}
    >
      Line {line}
    </div>
  );
};
