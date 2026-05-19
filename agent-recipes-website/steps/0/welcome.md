# Welcome

Greet the user and initialize recipe state. This is your first user-facing output — before any commands, scaffolding, or subagents.

## Do

1. **Send this message to the user** verbatim (paraphrase lightly is fine; keep all four beats):

   > Welcome — we're going to build **Agent Recipes Website**, a minimal community site for discovering agent recipes and the creators who publish them. The build runs in seven steps (bootstrap → shared shell → People → Recipes → Home). There are three checkpoints where I'll stop and ask you to visually confirm before continuing: after People ships, after Recipes ships, and after the landing page. Starting now with step 1 — machine prereqs and project scaffold.

2. **Write `.recipe-state.json`** at the recipe root (overwrite if present):

   ```json
   { "completed_steps": [0], "current_step": 1 }
   ```

   The file is already covered by `.gitignore` at the recipe root.

## Verify

- The welcome message has been delivered to the user.
- `.recipe-state.json` exists at the recipe root with `completed_steps: [0]` and `current_step: 1`.
