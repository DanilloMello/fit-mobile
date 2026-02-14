# ConnectHealth fit-mobile Quick Start

## Prerequisites

- Git 2.13+ (for submodule support)
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

## Clone Repository

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/DanilloMello/fit-mobile.git
cd fit-mobile

# Ensure fit-common is on latest version
git submodule update --remote .claude/common

# If you already cloned without --recurse-submodules:
git submodule init
git submodule update --remote .claude/common
```

## Verify Setup

```bash
# Check submodule status
git submodule status
# Should show: [hash] .claude/common (heads/master)

# Check documentation is available
ls .claude/common/docs/
# Should show: API_REGISTRY.md, DOMAIN_SPEC.md, etc.
```

## Install Git Hooks

```bash
# Install pre-push validation hooks + automated submodule updates
./.claude/common/scripts/install-hooks.sh
```

This installs:
- **pre-commit hook** - Warns if fit-common documentation is outdated
- **post-merge hook** - Auto-updates fit-common after `git pull`
- **post-checkout hook** - Auto-updates fit-common when switching branches
- **pre-push hook** - Validates code quality before push (tests, lint, etc.)
- **git config** - Sets `submodule.recurse = true` for automatic updates

## Install Dependencies

```bash
npm install
```

## Run Application

```bash
# Start Expo dev server
npx nx run mobile:start

# Run on iOS simulator (macOS only)
npx nx run mobile:ios

# Run on Android emulator
npx nx run mobile:android

# Run all tests
npx nx test

# Run specific tests
npx nx test identity  # Test identity module
```

## Working with Shared Documentation

### Read Documentation

All shared docs are in `.claude/common/docs/`:
- `DOMAIN_SPEC.md` - Entities and business rules
- `API_REGISTRY.md` - API endpoints to consume
- `CODING_GUIDELINES.md` - Code standards
- `VALIDATION_SETUP.md` - Hook and CI/CD setup
- `SUBMODULE_GUIDE.md` - Git submodule workflow

### Update Documentation

```bash
# Navigate to submodule
cd .claude/common

# Edit files
vim docs/API_REGISTRY.md

# Commit to fit-common
git add docs/API_REGISTRY.md
git commit -m "docs: add endpoint for X"
git push origin master

# Return to fit-mobile
cd ../..

# Update submodule reference
git add .claude/common
git commit -m "chore: update fit-common"
git push
```

### Pull Latest Documentation

```bash
# Automatic (with git config and post-merge hook):
git pull

# Manual:
git submodule update --remote .claude/common
git add .claude/common
git commit -m "chore: update fit-common to latest"
git push
```

## Daily Workflow

```bash
# 1. Pull latest changes (including submodules)
git pull
# post-merge hook automatically updates .claude/common ✅

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes...
# ...

# 4. Commit
git commit -m "feat: add my feature"
# pre-commit hook checks if .claude/common is outdated ✅

# 5. Push
git push origin feature/my-feature
# pre-push hook validates code quality ✅

# 6. Create PR on GitHub
```

## Automated Workflow

Once hooks are installed:

### On `git pull`:
- **post-merge hook** auto-updates `.claude/common/`
- Documentation always fresh ✅

### On `git checkout`:
- **post-checkout hook** updates `.claude/common/` when switching branches
- Documentation matches your branch context ✅

### On `git commit`:
- **pre-commit hook** warns if `.claude/common/` is behind remote
- Option to cancel and update first ✅

### On `git push`:
- **pre-push hook** validates:
  - TypeScript type check
  - ESLint validation
  - Tests
  - Build check
  - Coding guidelines
  - API Registry compliance
  - Dependency check

## Project Structure

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
└── .claude/
    └── common/              # Git submodule (fit-common)
```

## Troubleshooting

### Submodule not found

```bash
git submodule init
git submodule update --remote .claude/common
```

### fit-common is outdated

```bash
git submodule update --remote .claude/common
git add .claude/common
git commit -m "chore: update fit-common"
```

### node_modules issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### Pre-push hook fails

Fix the errors shown by the hook, then push again. To bypass (NOT recommended):
```bash
git push --no-verify
```

### Expo issues

```bash
# Clear Expo cache
npx expo start -c

# Clear NX cache
npx nx reset
```

See `.claude/common/docs/SUBMODULE_GUIDE.md` for detailed troubleshooting.

## Next Steps

- Read `CLAUDE.md` for project overview
- Read `.claude/common/docs/DOMAIN_SPEC.md` for domain model
- Read `.claude/common/docs/CODING_GUIDELINES.md` for code standards
- Read `.claude/common/docs/API_REGISTRY.md` for API endpoints to consume

## Resources

- [Git Submodules Guide](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [fit-common SUBMODULE_GUIDE.md](./.claude/common/docs/SUBMODULE_GUIDE.md)
- [VALIDATION_SETUP.md](./.claude/common/docs/VALIDATION_SETUP.md)
- [Expo Documentation](https://docs.expo.dev/)
- [NX Documentation](https://nx.dev/)
