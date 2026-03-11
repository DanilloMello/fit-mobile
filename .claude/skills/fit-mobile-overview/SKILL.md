---
name: fit-mobile-overview
description: Frontend skill for fit-mobile. React Native/NX patterns and conventions.
---

# fit-mobile — Master Index

> Orchestrator skill. Read this first, then load the spec files you need for the task at hand.

---

## Step 1 — Fetch mobile CODING_GUIDELINES (master index for fit-common)

Always start by fetching this single file — it contains coding standards **and** a doc registry that tells you what other fit-common docs to fetch based on your task:

```bash
gh api repos/DanilloMello/fit-common/contents/docs/mobile/CODING_GUIDELINES.md --jq '.content' | base64 -d
```

> If the mobile-specific file doesn't exist yet, fall back to the general one:
> ```bash
> gh api repos/DanilloMello/fit-common/contents/docs/CODING_GUIDELINES.md --jq '.content' | base64 -d
> ```

The doc registry inside it maps tasks to specific docs (DOMAIN_SPEC, API_REGISTRY, SPRINT_PLAN, etc.) with fetch commands. Only load additional docs when the task requires them.

---

## Step 2 — Load spec files based on task

Read **only** the specs relevant to what you're doing. Each file is self-contained.

| Spec file | Path | When to load |
|-----------|------|-------------|
| **Architecture** | `specs/architecture.md` | Understanding project layout, modules, layers, file locations, imports, navigation, or exploring the codebase |
| **Patterns** | `specs/patterns.md` | Writing new code — entities, API clients, stores, hooks, auth guard, screens |
| **UI Components** | `specs/ui-components.md` | Building UI — atomic design, component patterns, tokens, screen layouts, accessibility, animations, performance |
| **Rules & Checklists** | `specs/rules-and-checklists.md` | Verifying compliance, reviewing code, or working through new-feature/new-module/code-review checklists |

### Loading a spec

Use the **Read** tool with the path relative to this skill:

```
Read: .claude/skills/fit-mobile-overview/specs/architecture.md
Read: .claude/skills/fit-mobile-overview/specs/patterns.md
Read: .claude/skills/fit-mobile-overview/specs/ui-components.md
Read: .claude/skills/fit-mobile-overview/specs/rules-and-checklists.md
```

### Task → spec mapping

| Task | Specs to load |
|------|--------------|
| Explore / understand the project | `architecture` |
| Implement a new endpoint consumer | `architecture` + `patterns` + `rules-and-checklists` |
| Build a new screen or component | `architecture` + `patterns` + `ui-components` |
| Write or fix UI components | `ui-components` |
| Full feature (entity + API + hook + screen) | All four specs |
| Code review / compliance check | `rules-and-checklists` + `patterns` |
| Add a new module | `architecture` + `rules-and-checklists` |
| Setup, builds, or CI/CD questions | `rules-and-checklists` |
