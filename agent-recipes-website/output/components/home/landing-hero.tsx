import Link from "next/link";
import { SubmitRecipeButton } from "@/components/recipes/submit-recipe-button";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className={`${SHELL_INNER_CLASS} py-16 sm:py-24`}>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Discover agent recipes. Run them in Cursor.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          Browse guided build plans from the community, see what each recipe
          produces, and copy them straight into your editor.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/recipes/all"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Browse recipes
          </Link>
          <SubmitRecipeButton />
        </div>
      </div>
    </section>
  );
}
