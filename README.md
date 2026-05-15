# Agent Recipes

### What is a "recipe"

A recipe is a guided conversation with an agent. It is comprised of a `RECIPE.md` file to describe the goal and `steps/{n}/` folders that hold
independent markdown files for the agent to run in parallel (per recipe instructions). Each markdown file inside a step folder should make work and acceptance clear, usually with explicit **Verify** criteria. **The agent must not start the next step or phase until every Verify in the current scope is satisfied** — no “we’ll confirm that later” deferrals.

The executing agent should **state explicitly** which step file and phase it is on, and when each is finished, so the human is never left guessing how far the run has progressed.

To start a recipe, point your agent at the recipe folder, have it read `RECIPE.md` then `CONVENTIONS.md`, then run `steps/{n}/` in order (see the recipe’s **How to run** section if present).

### Write New Recipes

Compile a project into a recipe using the `write-recipe` skill.

### Discover New Recipes

Check out the cookbook (link tbd) for discovering new code recipes.