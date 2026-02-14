# ConnectHealth - fit-mobile

> NX | React Native 0.73 | Expo 50 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform. For full project documentation, see `.claude/common/`.

## Docs (multi-repo)

Before working, read these docs from `.claude/common/`:

1. `docs/DOMAIN_SPEC.md` - Entities, enums, business rules
2. `docs/API_REGISTRY.md` - API endpoints to consume from fit-api
3. `skills/fit-mobile/SKILL.md` - React Native/NX patterns & conventions
4. `fit-mobile/ARCHITECTURE.md` - Module structure & layers (if exists)
5. `fit-mobile/SCREENS.md` - Screen specifications (if exists)

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

- Consume **fit-api** via `.claude/common/docs/API_REGISTRY.md` - never guess endpoints
- Use TanStack Query for server state, Zustand for client state
- Module imports: `@connecthealth/{identity,client,training,shared}`
- Expo Router for navigation with file-based routing

## Sprint Plan

See `.claude/common/docs/SPRINT_PLAN.md` for roadmap.

## Commands

```bash
npx nx run mobile:start             # Start Expo dev server
npx nx run mobile:ios                # Run on iOS simulator
npx nx run mobile:android            # Run on Android emulator
npx nx test                          # Run all tests
```
