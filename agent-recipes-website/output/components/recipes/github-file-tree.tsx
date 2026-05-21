import { GitHubFileTreeClient } from "@/components/recipes/github-file-tree-client";
import { listGitHubDirectory } from "@/features/recipes/github-contents";
import type { GitHubSource } from "@/features/recipes/types";

type GitHubFileTreeProps = {
  github: GitHubSource;
};

export async function GitHubFileTree({ github }: GitHubFileTreeProps) {
  const result = await listGitHubDirectory(
    github.owner,
    github.repo,
    github.defaultBranch,
  );

  if (!result.ok) {
    return (
      <p className="rounded-xl bg-footer-bg p-6 text-sm text-muted">
        Couldn&apos;t load from GitHub — try again in a minute.
      </p>
    );
  }

  return (
    <GitHubFileTreeClient
      owner={github.owner}
      repo={github.repo}
      branch={github.defaultBranch}
      rootEntries={result.entries}
    />
  );
}
