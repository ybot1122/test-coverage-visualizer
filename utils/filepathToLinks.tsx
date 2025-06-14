import Link from "next/link";
import { filenameRegex } from "./filenameRegex";

export function filepathToLinks(filepath: string): React.ReactNode {
  const segments = filepath.replace(/^\/+|\/+$/g, "").split("/");
  let pathSoFar = "";
  const links = segments.map((seg: string, idx) => {
    pathSoFar += (idx === 0 ? "" : "/") + seg;
    return (
      <span key={pathSoFar}>
        <Link
          href={`/${pathSoFar}`}
          className="underline bg-none border-none cursor-pointer p-0"
        >
          {decodeURIComponent(seg)}
        </Link>
        {!filenameRegex.test(seg) && filepath && (
          <span className="mx-1">/</span>
        )}
      </span>
    );
  });
  return links;
}
