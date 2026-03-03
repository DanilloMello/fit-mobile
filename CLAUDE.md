# ConnectHealth - fit-mobile

> NX | React Native 0.73 | Expo 50 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform.
Shared documentation lives in the **fit-common** sibling repo and is accessed via MCP servers.

## Common Docs (via MCP — GitHub)

**Use the `github` MCP server to read docs from the fit-common sibling repo.**
Repo: `<org>/fit-common` · branch: `main` · base path: `docs/`

| File | Purpose |
|------|---------|
| `docs/DOMAIN_SPEC.md` | Entities, enums, business rules |
| `docs/API_REGISTRY.md` | API endpoints to consume from fit-api |
| `docs/CODING_GUIDELINES.md` | Coding standards |
| `docs/PRD.md` | Product requirements |
| `docs/SPRINT_PLAN.md` | Development roadmap |
| `docs/VALIDATION_SETUP.md` | Pre-push hooks and CI/CD |

> Never guess API endpoints — always read `API_REGISTRY.md` via the `github` MCP before implementing any API call.

## Dependency Docs (via MCP — Context7)

**Use the `context7` MCP server whenever you need up-to-date documentation or code examples for a library.**

When to use it:
- Adding a new dependency or upgrading an existing one
- Unsure about the correct API / hook signature for a library
- Troubleshooting unexpected behaviour from a third-party package
- Verifying compatibility between library versions

Key packages in this project: `expo`, `react-native`, `@tanstack/react-query`, `zustand`, `expo-router`, `axios`, `zod`, `nativewind`.

## Skills

**If you need patterns and conventions:**
- `.claude/skills/fit-mobile/SKILL.md` - React Native/NX patterns & conventions

## Hook

The pre-push hook lives in this repo at **`.githooks/pre-push`** (version-controlled).
Git is configured to use it automatically via `core.hooksPath = .githooks`.

On a fresh clone, run once:
```bash
git config core.hooksPath .githooks
```

Checks: TypeScript → ESLint → tests → Expo web bundle → guidelines → API Registry

## Architecture

```
fit-mobile/
├── apps/
│   └── mobile/              # Expo app
│       ├── src/app/         # Expo Router screens
│       │   ├── (auth)/      # Login, Register
│       │   └── (app)/       # Authenticated tabs (home, clients, plans, profile)
│       ├── eas.json         # EAS Build profiles
│       └── metro.config.js  # Metro + NX + Node polyfills
├── libs/
│   ├── identity/            # Auth domain + API + store
│   ├── client/              # Client domain + API + hooks
│   ├── training/            # Training domain + API + hooks
│   └── shared/              # Base classes, API client, shared UI
├── docs/
│   ├── sprints/             # Sprint planning docs
│   └── UI_PATTERNS.md       # Mobile UI patterns & React Native best practices
└── package.json
```

## Layers (per lib module)

| Layer | Location | Responsibility |
|-------|----------|----------------|
| domain | `domain/entities/`, `domain/value-objects/` | Entities, VOs |
| application | `application/ports/`, `application/store/` | Repository ports, Zustand stores |
| infrastructure | `infrastructure/api/` | API clients (axios) |
| ui | `ui/hooks/`, `ui/components/` | React hooks, components |

## Rules

- Consume **fit-api** via `API_REGISTRY.md` (use `github` MCP on fit-common) — never guess endpoints
- Use TanStack Query for server state, Zustand for client state
- Module imports: `@connecthealth/{identity,client,training,shared}`
- Expo Router for navigation with file-based routing

## Git Workflow (Gitflow)

**Every change must be committed and pushed. No local-only work.**

### Branch model
| Branch | Purpose |
|--------|---------|
| `master` | Production-ready code only |
| `develop` | Integration branch — all features merge here |
| `feat/<scope>-<description>` | Feature branches (from `develop`) |
| `fix/<scope>-<description>` | Bug fix branches (from `develop`) |
| `hotfix/<description>` | Critical fixes (from `master`) |
| `release/<version>` | Release prep (from `develop`) |

### Daily rule
```bash
# Start work
git checkout develop && git pull
git checkout -b feat/sprint-N-<what-you-are-doing>

# During work — commit every logical change
git add <specific-files>
git commit -m "feat(<scope>): description"
git push -u origin HEAD          # push immediately after first commit
```

### Commit message format (Conventional Commits)
```
feat(identity): add sign-up screen
fix(client): correct API response mapping
refactor(shared): extract api-client helper
chore(deps): add expo-crypto polyfill
```

### Validation gates

| Gate | Trigger | Checks |
|------|---------|--------|
| `pre-push` hook | every `git push` | TypeScript, ESLint, tests, **Expo web bundle** |
| GitHub Actions `validate` job | every push/PR to any branch | same as above + coverage + security audit |
| GitHub Actions `eas-build` job | push to `master` or PR → `master` | EAS cloud build |

**Pre-push hook** — source at `.githooks/pre-push` (version-controlled in this repo).
On a fresh clone, run once: `git config core.hooksPath .githooks`

**Skill sync rule** — after implementing any feature or change, update `.claude/skills/fit-mobile-overview/SKILL.md` to reflect what changed. Do this in the same session, before finishing. Update if any of the following changed:
- Lib module or layer structure
- Dependencies or versions
- Patterns (hook, store, API client, component convention, etc.)
- Screens or navigation routes
- EAS build profiles or Metro config

**Required GitHub Secret** — add `EXPO_TOKEN` to the repository secrets for EAS builds to work in CI:
- Go to `Settings → Secrets → Actions → New repository secret`
- Name: `EXPO_TOKEN` — Value: your token from `expo.dev/settings/access-tokens`

## Commands

```bash
npx nx run mobile:start             # Start Expo dev server
npx nx test                         # Run all tests

# Development (Expo Go on phone via USB or LAN)
cd apps/mobile
npx expo start                       # Start Metro — scan QR with Expo Go app

# EAS cloud builds — run from apps/mobile/
eas build --platform android --profile preview     # APK for QA
eas build --platform android --profile production  # AAB for Play Store
```

## fit-common Structure Sync Rule

> **IMPORTANT**: When implementing code, fetch the fit-common repo structure via the `github` MCP.
> If new docs, scripts, or hooks were added/removed in fit-common, update the table in
> "Common Docs" above to reflect the current structure. This CLAUDE.md must always
> mirror what's available in fit-common.
>
> Current fit-common structure this file tracks:
> - docs/: DOMAIN_SPEC, API_REGISTRY, CODING_GUIDELINES, PRD, SPRINT_PLAN, VALIDATION_SETUP
