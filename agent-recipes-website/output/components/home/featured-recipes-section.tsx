import { RecipeCard } from "@/components/recipes/recipe-card";
import { SubmitRecipeButton } from "@/components/recipes/submit-recipe-button";
import { SHELL_INNER_CLASS } from "@/lib/constants";
import type { RecipeDatum } from "@/features/recipes/types";

type FeaturedRecipesSectionProps = {
  recipes: RecipeDatum[];
};

export function FeaturedRecipesSection({ recipes }: FeaturedRecipesSectionProps) {
  return (
    <section className={`${SHELL_INNER_CLASS} py-12 sm:py-16`}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Featured recipes
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Real projects you can run today — each with a file tree, install
            snippet, and live preview when available.
          </p>
        </div>
        <SubmitRecipeButton size="small" className="self-start sm:self-auto" />
      </div>

      {recipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-muted">
          No recipes yet. Be the first to submit one.
        </p>
      )}
    </section>
  );
}
