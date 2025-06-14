import { GH_HOST, GH_OWNER, GH_REPO } from "@/github_config";
import { filenameRegex } from "@/utils/filenameRegex";
import { NextRequest, NextResponse } from "next/server";

const PAT =
  process.env.VERCEL_ENV === "development"
    ? require("@/pat").PAT
    : process.env.PAT;

export const getFile = async ({ path, ref }: { path: string; ref: string }) => {
  const githubApiUrl = `${GH_HOST}/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(
    path
  )}${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;

  const GITHUB_TOKEN = PAT;

  const githubRes = await fetch(githubApiUrl, {
    headers: GITHUB_TOKEN
      ? { Authorization: `token ${GITHUB_TOKEN}` }
      : undefined,
  });

  if (!githubRes.ok) {
    throw new Error(
      JSON.stringify({
        error: "Error fetching file from GitHub",
        details: await githubRes.json(),
      })
    );
  }

  const data = await githubRes.json();
  return data;
};
