"use client";

import { useMemo, useState } from "react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import type { RecipeDatum } from "@/features/recipes/types";

type AllRecipesListProps = {
  recipes: RecipeDatum[];
};

function matchesQuery(recipe: RecipeDatum, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const haystack = [recipe.title, recipe.summary, recipe.authorName]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function AllRecipesList({ recipes }: AllRecipesListProps) {
  const [query, setQuery] = useState("");

  const filteredRecipes = useMemo(
    () => recipes.filter((recipe) => matchesQuery(recipe, query)),
    [recipes, query],
  );

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Search recipes</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, summary, or author…"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
      </label>

      {filteredRecipes.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.slug} className="h-full">
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          {recipes.length === 0
            ? "No recipes yet. Be the first to submit one."
            : "No recipes match your search."}
        </p>
      )}
    </div>
  );
}
