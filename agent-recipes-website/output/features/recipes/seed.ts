import type { SupabaseClient } from "@supabase/supabase-js";

import { ingestRecipeFromRepo } from "@/features/recipes/ingest";

const SEED_OWNER = "SwanHub";
const SEED_REPO = "agent-recipes";

type GitHubContentEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

async function listTopLevelDirs(
  githubToken: string,
): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${SEED_OWNER}/${SEED_REPO}/contents/`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to list ${SEED_OWNER}/${SEED_REPO}: ${response.status} ${response.statusText}`,
    );
  }

  const entries = (await response.json()) as GitHubContentEntry[];
  const dirs: string[] = [];

  for (const entry of entries) {
    if (entry.type !== "dir") {
      continue;
    }

    const recipeMdPath = `${entry.path}/RECIPE.md`;
    const check = await fetch(
      `https://api.github.com/repos/${SEED_OWNER}/${SEED_REPO}/contents/${recipeMdPath}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (check.ok) {
      dirs.push(recipeMdPath);
    }
  }

  return dirs;
}

export async function seedRecipes(
  supabase: SupabaseClient,
  githubToken: string,
): Promise<number> {
  const recipePaths = await listTopLevelDirs(githubToken);

  const { error: deleteError } = await supabase
    .from("recipes")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");

  if (deleteError) {
    throw deleteError;
  }

  let count = 0;

  for (const recipeMdPath of recipePaths) {
    const result = await ingestRecipeFromRepo(supabase, githubToken, {
      owner: SEED_OWNER,
      repo: SEED_REPO,
      recipeMdPath,
    });

    if (result.ok) {
      count += 1;
    }
  }

  return count;
}
