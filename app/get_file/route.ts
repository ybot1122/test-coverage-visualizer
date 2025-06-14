import { GH_HOST, GH_OWNER, GH_REPO, PAT } from "@/pat_token";
import { filenameRegex } from "@/utils/filenameRegex";
import { NextRequest, NextResponse } from "next/server";

const getLastPathSegment = (path: string): string => {
  const lastSlashIdx = path.lastIndexOf("/");
  if (lastSlashIdx === -1) return path;
  return path.slice(lastSlashIdx, path.length);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = GH_OWNER;
  const repo = GH_REPO;
  const encodedPath = searchParams.get("path");
  const ref = searchParams.get("ref");

  const path = decodeURIComponent(encodedPath || "");

  if (!ref || !path) {
    return NextResponse.json(
      { error: "Missing required parameters: owner, repo, path" },
      { status: 400 },
    );
  }

  const last = getLastPathSegment(path);
  if (!filenameRegex.test(last)) {
    return NextResponse.json(
      { error: "Invalid file path format" },
      { status: 400 },
    );
  }

  const githubApiUrl = `${GH_HOST}/repos/${owner}/${repo}/contents/src%2F${encodeURIComponent(
    path,
  )}${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;

  const GITHUB_TOKEN = PAT;

  try {
    const githubRes = await fetch(githubApiUrl, {
      headers: GITHUB_TOKEN
        ? { Authorization: `token ${GITHUB_TOKEN}` }
        : undefined,
    });

    if (!githubRes.ok) {
      return NextResponse.json(
        {
          error: "Error fetching file from GitHub",
          details: await githubRes.json(),
        },
        { status: githubRes.status },
      );
    }

    const data = await githubRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
