import "server-only";

import { db } from "@/lib/supabase/db";
import type { Person } from "@/features/people/types";

type UserRow = {
  id: string;
  slug: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  github_url: string;
  joined_at: string;
  recipes: { count: number }[] | null;
};

function mapRowToPerson(row: UserRow): Person {
  const recipeCount = row.recipes?.[0]?.count ?? 0;

  return {
    slug: row.slug,
    name: row.name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    website: row.website,
    twitter: row.twitter,
    githubUrl: row.github_url,
    joinedAt: row.joined_at,
    recipeCount,
  };
}

export async function fetchPeople(): Promise<Person[]> {
  const { data, error } = await db
    .from("users")
    .select("*, recipes(count)")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as UserRow[]).map(mapRowToPerson);
}

export async function fetchFeaturedPeople(limit = 6): Promise<Person[]> {
  const { data, error } = await db
    .from("users")
    .select("*, recipes(count)")
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as UserRow[]).map(mapRowToPerson);
}

export async function fetchPersonBySlug(slug: string): Promise<Person | null> {
  const { data, error } = await db
    .from("users")
    .select("*, recipes(count)")
    .ilike("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRowToPerson(data as UserRow);
}
