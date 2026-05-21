import type { Metadata } from "next";
import { SubmitRecipeForm } from "@/components/recipes/submit-recipe-form";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submit recipe | Agent Recipes",
  description: "Add a GitHub repository with a RECIPE.md to the Agent Recipes catalog.",
};

export default function SubmitRecipePage() {
  return (
    <div
      className={`${SHELL_INNER_CLASS} flex flex-1 flex-col items-center py-10 sm:py-14`}
    >
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Submit a recipe
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Paste a GitHub repo. It joins the catalog as soon as we can parse its
          RECIPE.md.
        </p>
      </div>

      <div className="mt-10 w-full max-w-xl">
        <SubmitRecipeForm />
      </div>
    </div>
  );
}
