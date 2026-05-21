"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

function errorMessage(code: string): string {
  switch (code) {
    case "not_github":
      return "Only github.com URLs are accepted.";
    case "invalid_url":
      return "That doesn't look like a GitHub repo URL.";
    case "no_recipe_md":
      return "That repo doesn't have a `RECIPE.md` at its root.";
    case "invalid_recipe_md":
      return "We found `RECIPE.md` but couldn't parse the frontmatter.";
    case "repo_not_found":
      return "Couldn't find that repo (private or doesn't exist?).";
    case "github_rate_limit":
      return "GitHub rate-limited us. Try again in a minute.";
    default:
      return "Something went wrong. Try again.";
  }
}

export function SubmitRecipeForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "loading" });

    try {
      const response = await fetch("/api/recipes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as {
        slug?: string;
        error?: string;
        already_in_catalog?: boolean;
      };

      if (response.ok && data.slug) {
        if (data.already_in_catalog) {
          setState({
            kind: "success",
            message: "Already in the catalog — opening it now.",
          });
        }

        router.push(`/recipes/${data.slug}`);
        return;
      }

      setState({
        kind: "error",
        message: errorMessage(data.error ?? "server_error"),
      });
    } catch {
      setState({
        kind: "error",
        message: errorMessage("server_error"),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">GitHub repository URL</span>
        <input
          type="url"
          name="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://github.com/owner/repo"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
      </label>

      <button
        type="submit"
        disabled={state.kind === "loading"}
        className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state.kind === "loading" ? "Submitting…" : "Submit recipe"}
      </button>

      {state.kind === "error" ? (
        <p className="text-sm text-accent" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.kind === "success" ? (
        <p className="text-sm text-muted" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
