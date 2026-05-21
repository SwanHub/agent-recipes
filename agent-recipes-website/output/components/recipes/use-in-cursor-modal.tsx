"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { RecipeDatum } from "@/features/recipes/types";

type UseInCursorModalProps = {
  recipe: RecipeDatum;
};

function buildSnippet(recipe: RecipeDatum): string {
  const { owner, repo, defaultBranch } = recipe.github;
  return `Read and execute the recipe at https://github.com/${owner}/${repo}/blob/${defaultBranch}/RECIPE.md`;
}

export function UseInCursorModal({ recipe }: UseInCursorModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const snippet = buildSnippet(recipe);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);

      await fetch(`/api/recipes/${recipe.slug}/install`, { method: "POST" });

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Use in Cursor
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="use-in-cursor-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-lg">
            <h2
              id="use-in-cursor-title"
              className="text-lg font-semibold text-foreground"
            >
              Use in Cursor
            </h2>
            <p className="mt-2 text-sm text-muted">
              Copy this prompt into Cursor to run the recipe from its source repo.
            </p>

            <pre className="mt-4 overflow-x-auto rounded-xl bg-footer-bg p-4 text-sm leading-relaxed text-foreground">
              {snippet}
            </pre>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy snippet"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
