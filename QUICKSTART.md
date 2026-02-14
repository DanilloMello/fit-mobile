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

## MCP Setup

The `.claude/mcp.json` is already configured. When you open this project in Claude Code, it automatically connects to fit-common docs via MCP servers. No manual setup needed.

Available MCP servers:
- `fit-mobile-docs` — shared docs (DOMAIN_SPEC, API_REGISTRY, etc.)
- `fit-mobile-skills` — React Native/NX patterns
- `fit-mobile-scripts` — automation scripts
- `fit-mobile-hooks` — git hook templates

## Working with Shared Documentation

Shared docs live in the **fit-common** repo. To edit:

```bash
cd ../fit-common
# Edit files in docs/
git add docs/API_REGISTRY.md
git commit -m "docs: update API registry"
git push
```

No submodule sync needed — MCP reads directly from fit-common.

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

### MCP not connecting
Verify fit-common is cloned as a sibling directory:
```bash
ls ../fit-common/docs/
# Should list: API_REGISTRY.md, DOMAIN_SPEC.md, etc.
```

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
- Use `fit-mobile-docs` MCP to read `DOMAIN_SPEC.md` for the domain model
- Use `fit-mobile-docs` MCP to read `API_REGISTRY.md` for API endpoints to consume
- Read `.claude/skills/fit-mobile/SKILL.md` for React Native/NX patterns
