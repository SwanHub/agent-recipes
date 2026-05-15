# Agent Recipes

### Guided Agentic Engineering

A Recipe is a guided conversation with an agent. It is comprised of a `RECIPE.md` file to describe the goal and `/step/{n}` folders that hold
independent markdown files that the agent runs in parallel. Each file inside of a `/step` folder contains a `Do` clause and `Verify` clause. The
user cannot move forward without meeting all `Verify` conditions in all files within a step.

### Write Recipes

Compile a project into a recipe using the `write-recipe` skill.
