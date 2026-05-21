import { ingestRecipeFromRepo } from "@/features/recipes/ingest";
import { db } from "@/lib/supabase/db";
import { NextResponse } from "next/server";

function requireGithubToken(): string {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Missing required environment variable: GITHUB_TOKEN");
  }

  return token;
}

function parseGitHubRepoUrl(url: URL): { owner: string; repo: string } | null {
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  return { owner: segments[0], repo: segments[1] };
}

export async function POST(request: Request) {
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  const rawUrl = body.url?.trim();

  if (!rawUrl) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  const hostname = parsed.hostname.toLowerCase();

  if (hostname !== "github.com" && hostname !== "www.github.com") {
    return NextResponse.json({ error: "not_github" }, { status: 400 });
  }

  const repoParts = parseGitHubRepoUrl(parsed);

  if (!repoParts) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  try {
    const githubToken = requireGithubToken();
    const result = await ingestRecipeFromRepo(db, githubToken, repoParts);

    if (result.ok && result.created) {
      return NextResponse.json({ slug: result.slug }, { status: 201 });
    }

    if (result.ok && !result.created) {
      return NextResponse.json({
        slug: result.slug,
        already_in_catalog: true,
      });
    }

    if (!result.ok) {
      switch (result.code) {
        case "no_recipe_md":
          return NextResponse.json({ error: "no_recipe_md" }, { status: 400 });
        case "invalid_recipe_md":
          return NextResponse.json(
            { error: "invalid_recipe_md" },
            { status: 400 },
          );
        case "repo_not_found":
          return NextResponse.json({ error: "repo_not_found" }, { status: 404 });
        case "github_rate_limit":
          return NextResponse.json(
            { error: "github_rate_limit" },
            { status: 429 },
          );
        default:
          return NextResponse.json({ error: "server_error" }, { status: 500 });
      }
    }
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ error: "server_error" }, { status: 500 });
}
