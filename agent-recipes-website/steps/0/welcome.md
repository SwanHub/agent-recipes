# Welcome

Greet the user and initialize recipe state. This is your first user-facing output — before any commands, scaffolding, or subagents.

## Do

1. **Send this message to the user** verbatim (paraphrase lightly is fine; keep all three beats):
  > Welcome — we're going to build **Agent Recipes Website**, a minimal community site for discovering agent recipes and the creators who publish them. The build runs in seven steps (bootstrap → shared shell → People → Recipes → Home). There are three checkpoints where I'll stop and ask you to visually confirm before continuing: after People ships, after Recipes ships, and after the landing page.
2. **Write `.recipe-state.json`** at the recipe root (overwrite if present):
  ```json
   { "completed_steps": [0], "current_step": 1 }
  ```
   The file is already covered by `.gitignore` at the recipe root.

## STOP — APPROVE WITH USER

Send this message to the user, then **stop**. Call **zero tools** — no `Read`, no `Bash`, no subagents, no opening of `steps/1/` — until they reply.

> When you're ready, I'll start step 1 — machine prereqs and project scaffold. Ready to start?

Wait for explicit approval before step 1. "Looks good" / "yes" / "approved" / "proceed" all qualify; silence and vague replies do not.

## Verify

- The welcome message has been delivered to the user.
- `.recipe-state.json` exists at the recipe root with `completed_steps: [0]` and `current_step: 1`.
- The STOP — APPROVE gate has passed: the user explicitly approved continuing before step 1 begins.

