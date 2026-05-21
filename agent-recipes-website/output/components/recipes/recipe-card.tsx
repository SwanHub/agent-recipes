import Image from "next/image";
import Link from "next/link";
import { formatDownloads } from "@/lib/format-downloads";
import type { RecipeDatum } from "@/features/recipes/types";

type RecipeCardProps = {
  recipe: RecipeDatum;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-accent/40">
      <Link href={`/recipes/${recipe.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] w-full bg-footer-bg">
          {recipe.thumbnailUrl ? (
            <Image
              src={recipe.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              No preview
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {recipe.title}
          </h2>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
            {recipe.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{formatDownloads(recipe.installCount)} installs</span>
            <span>by {recipe.authorName}</span>
          </div>
        </div>
      </Link>
      {recipe.demoUrl ? (
        <div className="border-t border-border px-5 py-3">
          <a
            href={recipe.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            View demo
          </a>
        </div>
      ) : null}
    </article>
  );
}
