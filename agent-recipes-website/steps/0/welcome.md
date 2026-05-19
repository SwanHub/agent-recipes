# Welcome

This is the agent's first user-facing moment. A recipe is a guided conversation — orient the user warmly, set expectations, and wait for an explicit "go" before building anything.

**Do not collapse step 0 into step 1, even if the user's invocation ("execute this recipe," "make this," "run it," "build it") sounded like "just do it." That invocation is permission to begin step 0 — this step — not permission to skip past it. The user wants to be welcomed and oriented first.**

## Do

1. **Send this welcome message** to the user (paraphrase lightly is fine; keep the three beats — what we're building, how it works, what's needed — and end with the explicit "ready?" question):

   > Hey! I'm going to walk you through building **Agent Recipes Website** — a minimal community site for sharing agent recipes and the creators behind them. Peaceful, step by step.
   >
   > **Seven steps**, run in order: bootstrap → shared shell → People (write + ship) → Recipes (write + ship) → Home. Each step is a set of tasks with a Verify gate to make sure things actually work before moving on.
   >
   > **Three checkpoints** along the way for you to look at what we built and approve before continuing — after People ships, after Recipes ships, and at the landing page. I'll need a Supabase project, a GitHub token (public read), and your eyes at those checkpoints. Nothing else.
   >
   > Ready? Reply with **"go"** (or "ready" / "yes") and I'll move into step 1 — machine prereqs and project scaffold.

2. **Write `.recipe-state.json`** at the recipe root (overwrite if present):

   ```json
   { "completed_steps": [0], "current_step": 1 }
   ```

   The file is already covered by `.gitignore` at the recipe root.

## STOP — APPROVE WITH USER

**Hard halt — treat this exactly like the STOP — REVIEW gates in steps 4, 6, and 7.** After sending the welcome above and writing the state file, **stop**. Call **zero tools** — no `Read`, no `Bash`, no subagents, no opening of `steps/1/` — until the user replies.

**Critical anti-pattern to avoid:** The user's original invocation ("execute this recipe," "make this recipe," "run it," "build it," etc.) is **NOT** approval to begin step 1. That phrase is permission to begin step 0 — this welcome step. Do not infer step-1 approval from the original invocation. Do not collapse step 0 and step 1 into one action.

Wait here for an explicit **"go" / "ready" / "yes" / "proceed"** before opening `steps/1/`. Silence, vague replies, and a neutral "ok" do not qualify. If the user replies with a question or a concern, answer it and re-ask.

## Verify

- The welcome message has been delivered to the user.
- `.recipe-state.json` exists at the recipe root with `completed_steps: [0]` and `current_step: 1`.
- The STOP — APPROVE gate has passed: the user explicitly said "go" (or equivalent) before step 1 begins.
