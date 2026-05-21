import type { SupabaseClient } from "@supabase/supabase-js";

const USERNAMES = ["SwanHub"];

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

type UserInsert = {
  slug: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  github_url: string;
  joined_at: string;
};

async function fetchGitHubProfile(
  username: string,
  githubToken: string,
): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub profile for ${username}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<GitHubUser>;
}

function mapGitHubUserToRow(user: GitHubUser): UserInsert {
  const website = user.blog?.trim() ? user.blog.trim() : null;
  const twitter = user.twitter_username
    ? `https://twitter.com/${user.twitter_username}`
    : null;

  return {
    slug: user.login,
    name: user.name?.trim() ? user.name.trim() : user.login,
    avatar_url: user.avatar_url,
    bio: user.bio?.trim() ? user.bio.trim() : null,
    website,
    twitter,
    github_url: user.html_url,
    joined_at: user.created_at,
  };
}

export async function seedPeople(
  supabase: SupabaseClient,
  githubToken: string,
): Promise<number> {
  const rows: UserInsert[] = [];

  for (const username of USERNAMES) {
    const profile = await fetchGitHubProfile(username, githubToken);
    rows.push(mapGitHubUserToRow(profile));
  }

  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");

  if (deleteError) {
    throw deleteError;
  }

  const { error: insertError } = await supabase.from("users").insert(rows);

  if (insertError) {
    throw insertError;
  }

  return rows.length;
}
