# ConnectHealth - fit-mobile

> NX | React Native 0.76 | Expo 52 | TypeScript

## Context

This is the **mobile app** for ConnectHealth platform.
Shared documentation lives in the **fit-common** GitHub repo: `DanilloMello/fit-common`.

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
