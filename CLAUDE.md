# ConnectHealth - fit-mobile

> NX | React Native 0.73 | Expo 50 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform.
Shared documentation lives in the **fit-common** sibling repo and is accessed via MCP servers.

## Common Docs (via MCP)

**If you need any of these docs, use the `fit-mobile-docs` MCP server:**
- `DOMAIN_SPEC.md` - Entities, enums, business rules
- `API_REGISTRY.md` - API endpoints to consume from fit-api
- `CODING_GUIDELINES.md` - Coding standards
- `PRD.md` - Product requirements
- `SPRINT_PLAN.md` - Development roadmap
- `VALIDATION_SETUP.md` - Pre-push hooks and CI/CD

## Skills

**If you need patterns and conventions:**
- `.claude/skills/fit-mobile/SKILL.md` - React Native/NX patterns & conventions

## Scripts (via MCP)

**If you need automation scripts, use the `fit-mobile-scripts` MCP server:**
- `install-hooks.sh` - Install pre-push validation hook

## Hooks (via MCP)

**If you need to review or update git hooks, use the `fit-mobile-hooks` MCP server:**
- `pre-push.sh` - Code quality validation before push

## Architecture

```
fit-mobile/
├── apps/
│   └── mobile/src/app/      # Expo Router screens
│       ├── (auth)/          # Login, Register
│       └── (app)/           # Authenticated tabs
├── libs/
│   ├── identity/            # Auth domain + API + store
│   ├── client/              # Client domain + API + hooks
│   ├── training/            # Training domain + API + hooks
│   └── shared/              # Base classes, API client, shared UI
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

- Consume **fit-api** via `API_REGISTRY.md` (use `fit-mobile-docs` MCP) - never guess endpoints
- Use TanStack Query for server state, Zustand for client state
- Module imports: `@connecthealth/{identity,client,training,shared}`
- Expo Router for navigation with file-based routing

## Commands

```bash
npx nx run mobile:start             # Start Expo dev server
npx nx run mobile:ios                # Run on iOS simulator
npx nx run mobile:android            # Run on Android emulator
npx nx test                          # Run all tests
```

## fit-common Structure Sync Rule

> **IMPORTANT**: When implementing code, check the fit-common repo structure.
> If new docs, scripts, or hooks were added/removed in fit-common, update the
> lists above to reflect the current structure. This CLAUDE.md must always
> mirror what's available in fit-common.
>
> Current fit-common structure this file tracks:
> - docs/: DOMAIN_SPEC, API_REGISTRY, CODING_GUIDELINES, PRD, SPRINT_PLAN, VALIDATION_SETUP
> - scripts/: install-hooks.sh
> - templates/hooks/: pre-push.sh
