import Link from "next/link";
import { AgentRecipesWebsiteMark } from "@/components/chrome/agent-recipes-website-mark";
import { SHELL_INNER_CLASS } from "@/lib/constants";

const navLinkClass =
  "text-sm font-medium text-muted transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div
        className={`${SHELL_INNER_CLASS} flex h-14 items-center justify-between gap-4 sm:h-16`}
      >
        <AgentRecipesWebsiteMark />

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/profiles/all" className={navLinkClass}>
            Community
          </Link>
          <Link href="/recipes/all" className={navLinkClass}>
            Recipes
          </Link>
          <Link
            href="/recipes/submit"
            className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:px-4 sm:py-2"
          >
            Submit recipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
