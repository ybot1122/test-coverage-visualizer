import { CoverageEntry } from "@/types/CoverageSummary";
import Link from "next/link";

export const FileTableRow: React.FC<{
  path?: string;
  name: string;
  type: "file" | "directory";
  coverage: CoverageEntry;
}> = ({ path = "", name, type, coverage }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="p-1 border-l border-r border-gray-200">
        {type === "file" ? "📄" : "📁"}
        <Link
          className="text-blue-700 underline bg-none border-none cursor-pointer font-inherit p-0"
          href={`${path ? `/${path}` : ""}/${name}`}
        >
          {name}
        </Link>
      </td>
      <td className="p-1 border-r border-gray-200">
        {coverage.statements.pct}%{" "}
      </td>
      <td className="p-1 border-r border-gray-200">{coverage.branches.pct}%</td>
      <td className="p-1 border-r border-gray-200">
        {coverage.functions.pct}%
      </td>
      <td className="p-1 border-r border-gray-200">{coverage.lines.pct}%</td>
    </tr>
  );
};
