import type { Metadata } from "next";
import { AllRecipesList } from "@/components/recipes/all-recipes-list";
import { SubmitRecipeButton } from "@/components/recipes/submit-recipe-button";
import { fetchRecipes } from "@/features/recipes/server";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Recipes | Agent Recipes",
  description: "Browse agent recipes shared by the community.",
};

export default async function AllRecipesPage() {
  const recipes = await fetchRecipes();

  return (
    <div className={`${SHELL_INNER_CLASS} flex flex-1 flex-col py-10 sm:py-14`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Recipes
          </h1>
          <p className="mt-3 text-lg text-muted">
            Discover agent recipes you can run in Cursor.
          </p>
        </div>
        <SubmitRecipeButton />
      </div>

      <div className="mt-10">
        <AllRecipesList recipes={recipes} />
      </div>
    </div>
  );
}
