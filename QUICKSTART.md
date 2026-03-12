# ConnectHealth fit-mobile Quick Start

## Prerequisites

- Git 2.13+
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

## Clone Repositories

Both repos must be siblings under the same parent directory:

```bash
git clone https://github.com/DanilloMello/fit-mobile.git
git clone https://github.com/DanilloMello/fit-common.git
```

Expected layout:

```
projetos/
├── fit-api/        # (optional, for backend work)
├── fit-common/
└── fit-mobile/
```

## Install Pre-Push Hook

```bash
cd fit-common
./scripts/install-hooks.sh
```

This installs the **pre-push hook** that validates code quality before pushing (TypeScript, ESLint, tests, build, guidelines).

## Install Dependencies

```bash
cd fit-mobile
npm install
```

## Start Development

```bash
# Start Expo dev server
npx nx run mobile:start

# Run on iOS simulator (macOS only)
npx nx run mobile:ios

# Run on Android emulator
npx nx run mobile:android

# Run all tests
npx nx test
```

## Design System Tokens

Design tokens live in `libs/shared/ui/src/tokens/tokens.json` (Tokens Studio format).
After updating tokens via the Figma plugin, regenerate the TypeScript constants:

```bash
npm run build:tokens
# or
npx nx run shared-ui:build-tokens
```

**Design-first flow:**
1. Designer updates tokens in Figma via **Tokens Studio** plugin → exports to `tokens.json`
2. Dev runs `npm run build:tokens` → regenerates `colors.ts`, `spacing.ts`, `typography.ts`, `radii.ts`, `shadows.ts`
3. Commit both `tokens.json` and the generated `*.ts` files together

> The generated files have an `// auto-generated` header — edit `tokens.json`, not the `.ts` files directly.

## MCP Setup

MCP servers are configured via Claude Code. Three servers are used:

| Server | Purpose |
|--------|---------|
| `github` | Reads shared docs from `DanilloMello/fit-common` (DOMAIN_SPEC, API_REGISTRY, CODING_GUIDELINES, etc.) |
| `context7` | Library docs and code examples for any package in the stack |
| `figma` | Design assets and component specs |

## Working with Shared Documentation

Shared docs live in the **fit-common** repo. To edit:

```bash
cd ../fit-common
# Edit files in docs/
git add docs/API_REGISTRY.md
git commit -m "docs: update API registry"
git push
```

## Daily Workflow

```bash
git pull                    # Pull latest changes
# ... make changes ...
git commit -m "feat: ..."   # Commit
git push                    # Pre-push hook validates automatically
```

## Troubleshooting

### Pre-push hook fails
Fix the errors shown by the hook, then push again.

### node_modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo issues
```bash
npx expo start -c    # Clear Expo cache
npx nx reset          # Clear NX cache
```

## Next Steps

- Read `CLAUDE.md` for project overview
- Fetch `docs/DOMAIN_SPEC.md` from `fit-common` via `github` MCP for the domain model
- Fetch `docs/API_REGISTRY.md` from `fit-common` via `github` MCP for API endpoints
- Run `/fit-mobile-overview` in Claude Code to load architecture and coding patterns
