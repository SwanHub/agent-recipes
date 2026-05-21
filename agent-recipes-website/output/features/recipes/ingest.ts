import type { SupabaseClient } from "@supabase/supabase-js";

export type IngestResult =
  | { ok: true; slug: string; created: boolean }
  | {
      ok: false;
      code:
        | "no_recipe_md"
        | "invalid_recipe_md"
        | "repo_not_found"
        | "github_rate_limit"
        | "author_fetch_failed"
        | "slug_collision";
    };

type IngestOptions = {
  owner: string;
  repo: string;
  recipeMdPath?: string;
};

type GitHubContentFile = {
  type: "file";
  content: string;
  encoding: string;
};

type GitHubRepo = {
  default_branch: string;
};

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  twitter_username: string | null;
  html_url: string;
  created_at: string;
};

type ParsedFrontmatter = {
  title: string;
  summary: string;
  demoUrl?: string;
};

const GITHUB_API = "https://api.github.com";

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function decodeBase64(content: string): string {
  return Buffer.from(content, "base64").toString("utf8");
}

function parseFrontmatter(raw: string): ParsedFrontmatter | null {
  const closedMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const openMatch = raw.match(/^---\r?\n([\s\S]*?)(?:\r?\n---|\r?\n\r?\n)/);
  const body = closedMatch?.[1] ?? openMatch?.[1];

  if (!body) {
    return null;
  }

  const meta: Record<string, string> = {};

  for (const line of body.split("\n")) {
    const colon = line.indexOf(":");

    if (colon === -1) {
      continue;
    }

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key && value) {
      meta[key] = value;
    }
  }

  const title = meta.name?.trim();
  const summary = meta.description?.trim();

  if (!title || !summary) {
    return null;
  }

  const demoUrl =
    meta["demo url"] ?? meta.demo_url ?? meta.demourl ?? meta["demo-url"];

  return {
    title,
    summary,
    demoUrl: demoUrl?.trim() || undefined,
  };
}

function recipeNameFromPath(recipeMdPath: string | undefined, repo: string): string {
  if (!recipeMdPath) {
    return repo;
  }

  const segments = recipeMdPath.split("/");
  const fileName = segments[segments.length - 1] ?? "RECIPE.md";

  if (fileName.toLowerCase() === "recipe.md" && segments.length > 1) {
    return segments[segments.length - 2] ?? repo;
  }

  return fileName.replace(/\.md$/i, "") || repo;
}

function baseSlug(owner: string, recipeName: string): string {
  return `${owner.toLowerCase()}-${recipeName.toLowerCase()}`;
}

function recipeDirectory(recipeMdPath: string | undefined): string {
  if (!recipeMdPath) {
    return "";
  }

  const segments = recipeMdPath.split("/");
  segments.pop();

  return segments.join("/");
}

async function githubFetch<T>(
  url: string,
  token: string,
): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  const response = await fetch(url, { headers: githubHeaders(token) });

  if (response.status === 403 || response.status === 429) {
    return { ok: false, status: response.status };
  }

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  return { ok: true, data: (await response.json()) as T };
}

async function fetchRecipeMarkdown(
  owner: string,
  repo: string,
  recipeMdPath: string | undefined,
  token: string,
): Promise<
  | { ok: true; content: string }
  | { ok: false; code: "no_recipe_md" | "repo_not_found" | "github_rate_limit" }
> {
  const path = recipeMdPath ?? "RECIPE.md";
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const result = await githubFetch<GitHubContentFile>(url, token);

  if (!result.ok) {
    if (result.status === 403 || result.status === 429) {
      return { ok: false, code: "github_rate_limit" };
    }

    if (result.status === 404) {
      return { ok: false, code: "no_recipe_md" };
    }

    return { ok: false, code: "repo_not_found" };
  }

  if (result.data.type !== "file" || result.data.encoding !== "base64") {
    return { ok: false, code: "no_recipe_md" };
  }

  return { ok: true, content: decodeBase64(result.data.content) };
}

async function thumbnailExists(
  owner: string,
  repo: string,
  defaultBranch: string,
  recipeMdPath: string | undefined,
  token: string,
): Promise<string | undefined> {
  const dir = recipeDirectory(recipeMdPath);
  const path = dir ? `${dir}/assets/recipe-thumbnail.png` : "assets/recipe-thumbnail.png";
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const result = await githubFetch<unknown>(url, token);

  if (!result.ok) {
    return undefined;
  }

  return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${path}`;
}

async function fetchRepo(
  owner: string,
  repo: string,
  token: string,
): Promise<
  | { ok: true; defaultBranch: string }
  | { ok: false; code: "repo_not_found" | "github_rate_limit" }
> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}`;
  const result = await githubFetch<GitHubRepo>(url, token);

  if (!result.ok) {
    if (result.status === 403 || result.status === 429) {
      return { ok: false, code: "github_rate_limit" };
    }

    return { ok: false, code: "repo_not_found" };
  }

  return { ok: true, defaultBranch: result.data.default_branch || "main" };
}

async function upsertAuthor(
  supabase: SupabaseClient,
  owner: string,
  token: string,
): Promise<{ ok: true; authorId: string } | { ok: false; code: "author_fetch_failed" }> {
  const url = `${GITHUB_API}/users/${owner}`;
  const result = await githubFetch<GitHubUser>(url, token);

  if (!result.ok) {
    if (result.status === 403 || result.status === 429) {
      return { ok: false, code: "author_fetch_failed" };
    }

    return { ok: false, code: "author_fetch_failed" };
  }

  const user = result.data;
  const website = user.blog?.trim() ? user.blog.trim() : null;
  const twitter = user.twitter_username
    ? `https://twitter.com/${user.twitter_username}`
    : null;

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        slug: user.login,
        name: user.name?.trim() ? user.name.trim() : user.login,
        avatar_url: user.avatar_url,
        bio: user.bio?.trim() ? user.bio.trim() : null,
        website,
        twitter,
        github_url: user.html_url,
        joined_at: user.created_at,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, code: "author_fetch_failed" };
  }

  return { ok: true, authorId: data.id };
}

async function resolveSlug(
  supabase: SupabaseClient,
  owner: string,
  repo: string,
  recipeMdPath: string | undefined,
): Promise<{ ok: true; slug: string } | { ok: false; code: "slug_collision" }> {
  const recipeName = recipeNameFromPath(recipeMdPath, repo);
  const candidates = [baseSlug(owner, recipeName)];

  for (let suffix = 2; suffix <= 6; suffix += 1) {
    candidates.push(`${baseSlug(owner, recipeName)}-${suffix}`);
  }

  for (const slug of candidates) {
    const { data, error } = await supabase
      .from("recipes")
      .select("slug, owner, repo")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return { ok: true, slug };
    }

    if (data.owner === owner && data.repo === repo) {
      return { ok: true, slug };
    }
  }

  return { ok: false, code: "slug_collision" };
}

export async function ingestRecipeFromRepo(
  supabase: SupabaseClient,
  githubToken: string,
  options: IngestOptions,
): Promise<IngestResult> {
  const { owner, repo, recipeMdPath } = options;

  const { data: existing, error: existingError } = await supabase
    .from("recipes")
    .select("slug")
    .eq("owner", owner)
    .eq("repo", repo)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return { ok: true, slug: existing.slug, created: false };
  }

  const repoResult = await fetchRepo(owner, repo, githubToken);

  if (!repoResult.ok) {
    return { ok: false, code: repoResult.code };
  }

  const markdownResult = await fetchRecipeMarkdown(
    owner,
    repo,
    recipeMdPath,
    githubToken,
  );

  if (!markdownResult.ok) {
    return { ok: false, code: markdownResult.code };
  }

  const parsed = parseFrontmatter(markdownResult.content);

  if (!parsed) {
    return { ok: false, code: "invalid_recipe_md" };
  }

  const authorResult = await upsertAuthor(supabase, owner, githubToken);

  if (!authorResult.ok) {
    return { ok: false, code: authorResult.code };
  }

  const slugResult = await resolveSlug(supabase, owner, repo, recipeMdPath);

  if (!slugResult.ok) {
    return { ok: false, code: slugResult.code };
  }

  const thumbnailUrl = await thumbnailExists(
    owner,
    repo,
    repoResult.defaultBranch,
    recipeMdPath,
    githubToken,
  );

  const { error: insertError } = await supabase.from("recipes").insert({
    slug: slugResult.slug,
    title: parsed.title,
    summary: parsed.summary,
    demo_url: parsed.demoUrl ?? null,
    thumbnail_url: thumbnailUrl ?? null,
    author_id: authorResult.authorId,
    owner,
    repo,
    default_branch: repoResult.defaultBranch,
  });

  if (insertError) {
    throw insertError;
  }

  return { ok: true, slug: slugResult.slug, created: true };
}
