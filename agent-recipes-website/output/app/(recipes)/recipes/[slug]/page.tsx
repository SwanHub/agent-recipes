import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitHubFileTree } from "@/components/recipes/github-file-tree";
import { UseInCursorModal } from "@/components/recipes/use-in-cursor-modal";
import { fetchRecipeBySlug } from "@/features/recipes/server";
import { formatDownloads } from "@/lib/format-downloads";
import { SHELL_INNER_CLASS } from "@/lib/constants";

type RecipeDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await fetchRecipeBySlug(slug);

  if (!recipe) {
    return { title: "Recipe not found | Agent Recipes" };
  }

  return {
    title: `${recipe.title} | Agent Recipes`,
    description: recipe.summary,
  };
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await fetchRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const repoUrl = `https://github.com/${recipe.github.owner}/${recipe.github.repo}`;

  return (
    <div className={`${SHELL_INNER_CLASS} flex flex-1 flex-col py-10 sm:py-14`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl bg-footer-bg lg:shrink-0">
          {recipe.thumbnailUrl ? (
            <Image
              src={recipe.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full min-h-[12rem] items-center justify-center text-sm text-muted">
              No preview
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{recipe.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span>{formatDownloads(recipe.installCount)} installs</span>
            <Link
              href={`/profile/${recipe.authorSlug}`}
              className="font-medium text-foreground transition-colors hover:text-accent"
            >
              by {recipe.authorName}
            </Link>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              View on GitHub
            </a>
            {recipe.demoUrl ? (
              <a
                href={recipe.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                View demo
              </a>
            ) : null}
          </div>

          <div className="mt-8">
            <UseInCursorModal recipe={recipe} />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Repository files</h2>
        <GitHubFileTree github={recipe.github} />
      </section>
    </div>
  );
}
