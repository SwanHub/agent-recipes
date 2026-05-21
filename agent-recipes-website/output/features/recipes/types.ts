export type GitHubSource = {
  owner: string;
  repo: string;
  defaultBranch: string;
};

export type RecipeDatum = {
  slug: string;
  title: string;
  summary: string;
  installCount: number;
  demoUrl?: string;
  thumbnailUrl?: string;
  authorSlug: string;
  authorName: string;
  authorAvatarUrl: string | null;
  github: GitHubSource;
  createdAt: string;
};
