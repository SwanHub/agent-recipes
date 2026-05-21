import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

import { seedPeople } from "@/features/people/seed";
import { seedRecipes } from "@/features/recipes/seed";

loadEnvConfig(process.cwd());

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

const db = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
);

async function main() {
  const githubToken = requireEnv("GITHUB_TOKEN");
  const userCount = await seedPeople(db, githubToken);
  console.log(`seeded users: ${userCount}`);

  const recipeCount = await seedRecipes(db, githubToken);
  console.log(`seeded recipes: ${recipeCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
