# Welcome

**You are on step 0 only.** Orient the user warmly, set expectations, and wait for an explicit **"go"** before building anything.

**DO NOT PROCEED WITHOUT EXPLICIT APPROVAL.**  
**DO NOT READ `steps/1/` OR ANY LATER STEP.**  
**DO NOT RUN ANY TOOLS UNTIL THIS STEP'S STOP GATE IS CLEARED.**

## Do

1. **Send this welcome message first** — before any tool call, including `Read`, `Bash`, grep, subagents, or opening other files. Paraphrase lightly if needed; keep the three beats (what we're building, how it works, what's needed) and end with the explicit "ready?" question:

> Hey! I'm going to walk you through building **Agent Recipes** — a minimal community site for sharing agent recipes and the creators behind them.
>
> **Six steps**, run in order: bootstrap → shell → People + Recipes (parallel) → ship + review → email signup → home. People and Recipes are written side-by-side by parallel subagents in the same step.
>
> **Two checkpoints** for you to approve along the way — once after People + Recipes ship together, and a final walkthrough at the landing page. I'll need a Supabase project, a GitHub token (public read), and your eyes at those checkpoints. Nothing else.
>
> Ready? Reply with **"go"** (or "ready" / "yes" / "proceed") and I'll move into step 1 — machine prereqs and project scaffold.

2. **Do not treat other replies as approval.** The following are **not** sufficient to leave step 0 — answer any questions, then ask again for an explicit go:
   - "Make this recipe" / "build it" / "let's start" / "get going"
   - Silence, "ok," thumbs-up, or vague enthusiasm
   - Questions about how the recipe works (answer, then re-ask for **go**)

## STOP — APPROVE WITH USER

**HALT. ZERO TOOLS.**

Until the user replies with an allowed approval phrase, you must **not**:

- Call **any** tool (`Read`, `Write`, `Bash`, `Grep`, `Glob`, subagents, MCP, etc.)
- Read `RECIPE.md`, `steps/1/bootstrap.md`, or **any** path under `steps/1/` through `steps/6/`
- Check Node, Supabase, or prereqs ("just to get ahead")
- Create or update `.recipe-state.json`, `output/`, or any scaffold
- Start bootstrap because the user wants the recipe built — **welcome and approval come first**

**Allowed approvals (only these):** `go`, `ready`, `yes`, `proceed` (case-insensitive is fine).

If the user replies with a question or concern, answer in chat only (no tools), then re-ask for **go**.

**ONLY AFTER** explicit approval:

1. Write `.recipe-state.json` (see Update state below)
2. Open and execute `steps/1/bootstrap.md` — and nothing from step 2 onward yet

## Verify

- The welcome message has been **delivered to the user in chat** (not skipped or summarized away)
- The user has **explicitly** approved with **go / ready / yes / proceed** — not build-intent phrasing alone

## Update state

**Write** `.recipe-state.json` at the recipe root (overwrite if present) **only after** Verify passes — not before the user approves:

```json
{ "completed_steps": [0], "current_step": 1 }
```
