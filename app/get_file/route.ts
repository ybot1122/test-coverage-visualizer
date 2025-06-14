import { GH_HOST, GH_OWNER, GH_REPO } from "@/github_config";
import { filenameRegex } from "@/utils/filenameRegex";
import { getFile } from "@/utils/getFile";
import { NextRequest, NextResponse } from "next/server";

const getLastPathSegment = (path: string): string => {
  const lastSlashIdx = path.lastIndexOf("/");
  if (lastSlashIdx === -1) return path;
  return path.slice(lastSlashIdx, path.length);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedPath = searchParams.get("path");
  const ref = searchParams.get("ref");

  const path = decodeURIComponent(encodedPath || "");

  if (!ref || !path) {
    return NextResponse.json(
      { error: "Missing required parameters: owner, repo, path" },
      { status: 400 }
    );
  }

  const last = getLastPathSegment(path);
  if (!filenameRegex.test(last)) {
    return NextResponse.json(
      { error: "Invalid file path format" },
      { status: 400 }
    );
  }

  try {
    const data = await getFile({ path, ref });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        error: "Error fetching file from GitHub",
        details: e,
      },
      { status: 500 }
    );
  }
}
