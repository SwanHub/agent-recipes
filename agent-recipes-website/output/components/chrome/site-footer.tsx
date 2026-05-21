import Link from "next/link";
import { EmailSignupForm } from "@/components/agent-recipes-website-email-signup-form";
import {
  GITHUB_REPO_URL,
  SHELL_INNER_CLASS,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-footer-bg">
      <div className={`${SHELL_INNER_CLASS} py-10`}>
        <div className="mx-auto max-w-xl">
          <p className="text-center text-sm font-medium text-foreground">
            Get new recipes in your inbox
          </p>
          <div className="mt-4">
            <EmailSignupForm source="footer" />
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-muted sm:flex-row sm:text-left">
            <p>Agent Recipes — a catalog of community agent recipes.</p>
            <p>
              Built by{" "}
              <Link
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                SwanHub
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
