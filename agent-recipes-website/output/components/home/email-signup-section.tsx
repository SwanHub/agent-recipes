import { EmailSignupForm } from "@/components/agent-recipes-website-email-signup-form";
import { SHELL_INNER_CLASS } from "@/lib/constants";

export function EmailSignupSection() {
  return (
    <section className="border-y border-border bg-footer-bg">
      <div className={`${SHELL_INNER_CLASS} py-12 sm:py-14`}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Stay in the loop
          </h2>
          <p className="mt-2 text-muted">New recipes weekly. No spam.</p>
          <div className="mt-6">
            <EmailSignupForm source="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
