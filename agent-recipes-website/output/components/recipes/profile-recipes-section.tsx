import Image from "next/image";
import Link from "next/link";
import { formatDownloads } from "@/lib/format-downloads";
import { fetchRecipesForPersonName } from "@/features/recipes/server";
import type { Person } from "@/features/people/types";

type ProfileRecipesSectionProps = {
  person: Person;
};

function totalInstalls(recipes: { installCount: number }[]): number {
  return recipes.reduce((sum, recipe) => sum + recipe.installCount, 0);
}

export async function ProfileRecipesSection({
  person,
}: ProfileRecipesSectionProps) {
  const recipes = await fetchRecipesForPersonName(person.slug);
  const installs = totalInstalls(recipes);

  return (
    <section className="mt-10 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recipes</h2>
          <p className="mt-1 text-sm text-muted">
            {person.recipeCount === 0
              ? "No recipes published yet."
              : `${person.recipeCount} in the catalog`}
          </p>
        </div>
        {installs > 0 ? (
          <span className="rounded-full border border-border bg-footer-bg px-3 py-1 text-sm font-medium text-foreground">
            {formatDownloads(installs)} total installs
          </span>
        ) : null}
      </div>

      {recipes.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <li key={recipe.slug}>
              <Link
                href={`/recipes/${recipe.slug}`}
                className="flex gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-accent/40"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-footer-bg">
                  {recipe.thumbnailUrl ? (
                    <Image
                      src={recipe.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">{recipe.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {recipe.summary}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {formatDownloads(recipe.installCount)} installs
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Recipes from this creator will appear here once published.
        </p>
      )}
    </section>
  );
}
