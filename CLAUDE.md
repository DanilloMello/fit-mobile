# ConnectHealth - fit-mobile

> NX | React Native 0.81 | Expo 54 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform.
Shared documentation lives in the **fit-common** GitHub repo: `DanilloMello/fit-common`.

## Git Workflow — MANDATORY

Every task follows this branching model. No exceptions.

1. **Always branch from `develop`**:
   ```bash
   git checkout develop && git pull
   git checkout -b <type>/<short-description>   # e.g. feat/client-list, fix/auth-crash, chore/upgrade-deps
   git push -u origin HEAD
   ```

2. **Commit frequently** — after each logical unit of work (one concern per commit). Use Conventional Commits:
   ```
   feat(scope): description
   fix(scope): description
   chore(scope): description
   docs(scope): description
   refactor(scope): description
   ```

3. **Push every commit immediately** after creating it.

4. **Never commit directly to `develop` or `master`** — always open a PR.

5. **PR target**: feature branches → `develop`; `develop` → `master` for production releases only.

## How to start any task

1. **Run `/fit-mobile-overview`** — the master index skill that orchestrates everything:
   - Fetches coding standards and doc registry from fit-common
   - Points to the right spec files (architecture, patterns, ui-components, rules) based on your task

2. **Commands**:
   ```bash
   cd apps/mobile && npx expo start      # Start Metro — scan QR with Expo Go
   npx nx test                           # Run all tests
   eas build --platform android --profile preview     # APK for QA
   eas build --platform android --profile production  # AAB for Play Store
   ```
