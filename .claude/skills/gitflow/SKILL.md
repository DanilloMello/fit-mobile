---
name: gitflow
description: >
  Git workflow enforcer for fit-mobile. Fetches the live gitflow conventions
  from fit-common and applies them to every branch, commit, and PR action.
  Invoke at the start of any task that involves git work.
---

# fit-mobile — Gitflow

## Step 1 — Fetch the canonical spec

Fetch the live gitflow conventions from fit-common using the GitHub MCP:

```
mcp__github__get_file_contents:
  owner: DanilloMello
  repo:  fit-common
  path:  docs/GITFLOW.md
```

Read the full content. **All branching, commit, PR, and merge rules come from this document — follow it exactly.**

---

## Step 2 — Inspect current state

```bash
git status
git branch --show-current
git log --oneline -5
```

---

## Step 3 — Execute

Apply the rules from the fetched GITFLOW.md to the current task:

- **No branch yet** → create one following the naming conventions in the doc
- **Need to commit** → use the commit message format from the doc
- **Need a PR** → rebase, then open a PR to the correct target branch using the PR format from the doc
- **After merge** → clean up following the cleanup steps in the doc

Use the GitHub MCP (`mcp__github__create_pull_request`) for opening PRs whenever possible.
