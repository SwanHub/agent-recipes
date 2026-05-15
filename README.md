# Agent Recipes

### Guided Agentic Engineering

A recipe is a guided conversation with an agent. It is comprised of a `RECIPE.md` file to describe the goal and `/step/{n}` folders that hold
independent markdown files for the agent to run in parallel. Each markdown file inside of a `/step` folder contains a `Do` clause and `Verify` clause. The user cannot move forward without meeting all `Verify` conditions within a step.

To start a recipe, simply point your agent at the folder.

### Write Recipes

Compile a project into a recipe using the `write-recipe` skill.
