"use client";

import {
  ChevronRight,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  loadGitHubDirectory,
  loadGitHubFileContent,
} from "@/features/recipes/github-actions";
import type { GitHubTreeEntry } from "@/features/recipes/github-contents";

type GitHubFileTreeClientProps = {
  owner: string;
  repo: string;
  branch: string;
  rootEntries: GitHubTreeEntry[];
};

type ContentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; content: string; path: string }
  | { status: "error" };

function fileIcon(name: string) {
  const lower = name.toLowerCase();

  if (lower.endsWith(".md")) {
    return FileText;
  }

  if (
    lower.endsWith(".ts") ||
    lower.endsWith(".tsx") ||
    lower.endsWith(".py") ||
    lower.endsWith(".sh")
  ) {
    return FileCode;
  }

  return File;
}

function isMarkdown(path: string): boolean {
  return path.toLowerCase().endsWith(".md");
}

function pickDefaultFile(entries: GitHubTreeEntry[]): GitHubTreeEntry | null {
  const readme = entries.find(
    (entry) => entry.type === "file" && entry.name.toLowerCase() === "readme.md",
  );

  if (readme) {
    return readme;
  }

  return (
    entries.find(
      (entry) => entry.type === "file" && entry.name.toLowerCase().endsWith(".md"),
    ) ?? null
  );
}

export function GitHubFileTreeClient({
  owner,
  repo,
  branch,
  rootEntries,
}: GitHubFileTreeClientProps) {
  const [childrenByPath, setChildrenByPath] = useState<
    Record<string, GitHubTreeEntry[]>
  >({ "": rootEntries });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [contentState, setContentState] = useState<ContentState>({
    status: "idle",
  });
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadFile = useCallback(
    async (path: string) => {
      setSelectedPath(path);
      setContentState({ status: "loading" });

      const result = await loadGitHubFileContent(owner, repo, branch, path);

      if (!result.ok) {
        setContentState({ status: "error" });
        return;
      }

      setContentState({ status: "ready", content: result.content, path });
    },
    [owner, repo, branch],
  );

  const ensureDirectory = useCallback(
    async (path: string): Promise<GitHubTreeEntry[]> => {
      if (childrenByPath[path]) {
        return childrenByPath[path];
      }

      const result = await loadGitHubDirectory(owner, repo, branch, path);

      if (!result.ok) {
        setLoadError(true);
        return [];
      }

      setChildrenByPath((current) => ({
        ...current,
        [path]: result.entries,
      }));

      return result.entries;
    },
    [owner, repo, branch, childrenByPath],
  );

  const toggleFolder = useCallback(
    async (path: string) => {
      const next = new Set(expanded);

      if (next.has(path)) {
        next.delete(path);
        setExpanded(next);
        return;
      }

      next.add(path);
      setExpanded(next);
      setLoadError(false);

      const entries = await ensureDirectory(path);
      const defaultFile = pickDefaultFile(entries);

      if (defaultFile) {
        await loadFile(defaultFile.path);
      }
    },
    [expanded, ensureDirectory, loadFile],
  );

  const handleSelectFile = useCallback(
    async (path: string) => {
      setMobileTreeOpen(false);
      await loadFile(path);
    },
    [loadFile],
  );

  const treeNodes = useMemo(() => rootEntries, [rootEntries]);

  function renderEntries(entries: GitHubTreeEntry[], depth: number) {
    return entries.map((entry) => {
      const paddingLeft = `${depth * 0.75 + 0.5}rem`;
      const isSelected = selectedPath === entry.path;
      const selectedClass = isSelected
        ? "bg-accent/10 font-bold text-foreground"
        : "font-normal text-muted hover:bg-footer-bg hover:text-foreground";

      if (entry.type === "dir") {
        const isOpen = expanded.has(entry.path);
        const Icon = isOpen ? FolderOpen : Folder;
        const children = childrenByPath[entry.path] ?? [];

        return (
          <div key={entry.path}>
            <button
              type="button"
              onClick={() => toggleFolder(entry.path)}
              className={`flex w-full items-center gap-1 rounded-md py-1.5 pr-2 text-left text-sm ${selectedClass}`}
              style={{ paddingLeft }}
            >
              <ChevronRight
                className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <Icon className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate">{entry.name}</span>
            </button>
            {isOpen ? (
              <div>
                {children.length === 0 ? (
                  <p
                    className="py-2 text-xs text-muted"
                    style={{ paddingLeft: `${(depth + 1) * 0.75 + 0.5}rem` }}
                  >
                    No files to preview.
                  </p>
                ) : (
                  renderEntries(children, depth + 1)
                )}
              </div>
            ) : null}
          </div>
        );
      }

      const Icon = fileIcon(entry.name);

      return (
        <button
          key={entry.path}
          type="button"
          onClick={() => handleSelectFile(entry.path)}
          className={`flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm ${selectedClass}`}
          style={{ paddingLeft: `${depth * 0.75 + 1.25}rem` }}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{entry.name}</span>
        </button>
      );
    });
  }

  function renderContent() {
    if (loadError && contentState.status === "idle") {
      return (
        <p className="rounded-xl bg-footer-bg p-6 text-sm text-muted">
          Couldn&apos;t load from GitHub — try again in a minute.
        </p>
      );
    }

    if (contentState.status === "idle") {
      return (
        <p className="rounded-xl bg-footer-bg p-6 text-sm text-muted">
          Select a file to preview its contents.
        </p>
      );
    }

    if (contentState.status === "loading") {
      return (
        <p className="rounded-xl bg-footer-bg p-6 text-sm text-muted">Loading…</p>
      );
    }

    if (contentState.status === "error") {
      return (
        <p className="rounded-xl bg-footer-bg p-6 text-sm text-muted">
          Couldn&apos;t load from GitHub — try again in a minute.
        </p>
      );
    }

    if (isMarkdown(contentState.path)) {
      return (
        <article className="prose prose-stone max-w-none rounded-xl bg-footer-bg p-6 text-foreground prose-headings:font-semibold prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-accent prose-code:rounded prose-code:bg-background prose-code:px-1 prose-pre:bg-background prose-pre:text-foreground dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentState.content}
          </ReactMarkdown>
        </article>
      );
    }

    return (
      <pre className="overflow-x-auto rounded-xl bg-footer-bg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {contentState.content}
      </pre>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTreeOpen((open) => !open)}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
        >
          Files
        </button>
      </div>

      <aside
        className={`w-full shrink-0 lg:block lg:w-72 ${mobileTreeOpen ? "block" : "hidden"}`}
      >
        <div className="max-h-[28rem] overflow-y-auto rounded-xl border border-border bg-background p-2 lg:max-h-[36rem]">
          {treeNodes.length === 0 ? (
            <p className="p-3 text-sm text-muted">No files to preview.</p>
          ) : (
            renderEntries(treeNodes, 0)
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">{renderContent()}</div>
    </div>
  );
}
