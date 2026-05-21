import "server-only";

const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

export type GitHubTreeEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

type GitHubApiEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function listGitHubDirectory(
  owner: string,
  repo: string,
  branch: string,
  path = "",
): Promise<{ ok: true; entries: GitHubTreeEntry[] } | { ok: false }> {
  const pathSuffix = path ? `/${path}` : "";
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents${pathSuffix}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    return { ok: false };
  }

  const data = (await response.json()) as GitHubApiEntry | GitHubApiEntry[];

  const entries = (Array.isArray(data) ? data : [data]).map((entry) => ({
    name: entry.name,
    path: entry.path,
    type: entry.type,
  }));

  entries.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  return { ok: true, entries };
}

export async function fetchGitHubFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
): Promise<{ ok: true; content: string } | { ok: false }> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    return { ok: false };
  }

  const data = (await response.json()) as {
    type: string;
    encoding: string;
    content: string;
  };

  if (data.type !== "file" || data.encoding !== "base64") {
    return { ok: false };
  }

  return {
    ok: true,
    content: Buffer.from(data.content, "base64").toString("utf8"),
  };
}
