# ISSUES

Issues JSON is provided at start of context. Parse it to get open issues with their bodies and comments.

# TASK BREAKDOWN

Break down the issues into tasks. An issue may contain a single task (a small bugfix or visual tweak) or many, many tasks (a PRD or a large refactor).

Make each task the smallest possible unit of work. We don't want to outrun our headlights. Aim for one small change per task.

# TASK SELECTION

Pick the next task. Prioritize tasks in this order:

1. Critical bugfixes
2. Tracer bullets for new features

Tracer bullets comes from the Pragmatic Programmer. When building systems, you want to write code that gets you feedback as quickly as possible. Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.

TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.

3. Polish and quick wins
4. Refactors

If all tasks are complete, output <promise>COMPLETE</promise>.

# EXPLORATION

Explore the repo and fill your context window with relevant information that will allow you to complete the task.

# EXECUTION

Create a new branch to work, base the name on the issue you chose.
Complete the task.
Open a Pull Request.

If you find that the task is larger than you expected (for instance, requires a refactor first), output "HANG ON A SECOND".

Then, find a way to break it into a smaller chunk and only do that chunk (i.e. complete the smaller refactor).

# FEEDBACK LOOPS

Before committing, run the feedback loops:

- `pnpm run check:all` to run all type and format checkers
- `pnpm run build:all` to test if the build succeeds for all projects in this monorepo

# PROGRESS

After completing, append to progress.txt:

- Task completed and PRD reference
- Key decisions made
- Files changed
- Blockers or notes for next iteration
  Keep entries concise.
- Ensure you commit progress.txt with the changed code

# COMMIT

Make a git commit with a clear message.

# THE ISSUE

If the task is complete, close the original GitHub issue.

If the task is not complete, leave a comment on the GitHub issue with what was done.

# FINAL RULES

ONLY WORK ON A SINGLE TASK.
