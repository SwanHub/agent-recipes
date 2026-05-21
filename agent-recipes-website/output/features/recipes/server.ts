import "server-only";

import { db } from "@/lib/supabase/db";
import type { RecipeDatum } from "@/features/recipes/types";

type AuthorEmbed = {
  slug: string;
  name: string;
  avatar_url: string | null;
};

type RecipeRow = {
  slug: string;
  title: string;
  summary: string;
  install_count: number;
  demo_url: string | null;
  thumbnail_url: string | null;
  owner: string;
  repo: string;
  default_branch: string;
  created_at: string;
  users: AuthorEmbed | AuthorEmbed[];
};

function resolveAuthor(users: AuthorEmbed | AuthorEmbed[]): AuthorEmbed {
  return Array.isArray(users) ? users[0] : users;
}

function mapRowToRecipe(row: RecipeRow): RecipeDatum {
  const author = resolveAuthor(row.users);

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    installCount: row.install_count,
    demoUrl: row.demo_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    authorSlug: author.slug,
    authorName: author.name,
    authorAvatarUrl: author.avatar_url,
    github: {
      owner: row.owner,
      repo: row.repo,
      defaultBranch: row.default_branch,
    },
    createdAt: row.created_at,
  };
}

const recipeSelect = `
  slug,
  title,
  summary,
  install_count,
  demo_url,
  thumbnail_url,
  owner,
  repo,
  default_branch,
  created_at,
  users!recipes_author_id_fkey ( slug, name, avatar_url )
`;

export async function fetchRecipes(): Promise<RecipeDatum[]> {
  const { data, error } = await db
    .from("recipes")
    .select(recipeSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as unknown as RecipeRow[]).map(mapRowToRecipe);
}

export async function fetchFeaturedRecipes(
  limit = 6,
): Promise<RecipeDatum[]> {
  const { data, error } = await db
    .from("recipes")
    .select(recipeSelect)
    .order("title", { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as unknown as RecipeRow[]).map(mapRowToRecipe);
}

export async function fetchRecipeBySlug(slug: string): Promise<RecipeDatum | null> {
  const { data, error } = await db
    .from("recipes")
    .select(recipeSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRowToRecipe(data as unknown as RecipeRow);
}

export async function fetchRecipesForPersonName(
  name: string,
): Promise<RecipeDatum[]> {
  const { data: user, error: userError } = await db
    .from("users")
    .select("id")
    .eq("slug", name)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return [];
  }

  const { data, error } = await db
    .from("recipes")
    .select(recipeSelect)
    .eq("author_id", user.id)
    .order("install_count", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as unknown as RecipeRow[]).map(mapRowToRecipe);
}

export async function incrementRecipeInstallCount(slug: string): Promise<void> {
  const { data: recipe, error: fetchError } = await db
    .from("recipes")
    .select("install_count")
    .eq("slug", slug)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!recipe) {
    throw new Error(`Recipe not found: ${slug}`);
  }

  const { error: updateError } = await db
    .from("recipes")
    .update({ install_count: recipe.install_count + 1 })
    .eq("slug", slug);

  if (updateError) {
    throw updateError;
  }
}
