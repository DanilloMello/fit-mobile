# ConnectHealth - fit-mobile

> NX | React Native 0.81 | Expo 54 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform.
Shared documentation lives in the **fit-common** GitHub repo: `DanilloMello/fit-common`.

## Git Workflow — MANDATORY

Run **`/gitflow`** before any task that involves branching, committing, or opening a PR. It fetches the live conventions from fit-common and enforces them.

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
