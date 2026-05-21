"use client";

import { useState } from "react";

type EmailSignupSource = "hero" | "footer";

type SignupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "duplicate" }
  | { kind: "error"; message: string };

type EmailSignupFormProps = {
  source: EmailSignupSource;
};

export function AgentRecipesWebsiteEmailSignupForm({
  source,
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "loading" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (response.ok) {
        setState({ kind: "success" });
        setEmail("");
        return;
      }

      if (response.status === 409) {
        setState({ kind: "duplicate" });
        return;
      }

      const data = (await response.json()) as { error?: string };

      if (data.error === "invalid_email") {
        setState({
          kind: "error",
          message: "Enter a valid email address.",
        });
        return;
      }

      setState({
        kind: "error",
        message: "Something went wrong. Try again.",
      });
    } catch {
      setState({
        kind: "error",
        message: "Something went wrong. Try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state.kind === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {state.kind === "success" ? (
        <p className="text-sm text-muted" role="status">
          You&apos;re on the list — we&apos;ll be in touch.
        </p>
      ) : null}
      {state.kind === "duplicate" ? (
        <p className="text-sm text-muted" role="status">
          You&apos;re already subscribed.
        </p>
      ) : null}
      {state.kind === "error" ? (
        <p className="text-sm text-accent" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export { AgentRecipesWebsiteEmailSignupForm as EmailSignupForm };
