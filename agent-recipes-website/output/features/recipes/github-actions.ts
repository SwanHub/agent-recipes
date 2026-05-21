"use server";

import {
  fetchGitHubFileContent,
  listGitHubDirectory,
  type GitHubTreeEntry,
} from "@/features/recipes/github-contents";

export async function loadGitHubDirectory(
  owner: string,
  repo: string,
  branch: string,
  path = "",
): Promise<{ ok: true; entries: GitHubTreeEntry[] } | { ok: false }> {
  return listGitHubDirectory(owner, repo, branch, path);
}

export async function loadGitHubFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
): Promise<{ ok: true; content: string } | { ok: false }> {
  return fetchGitHubFileContent(owner, repo, branch, path);
}
