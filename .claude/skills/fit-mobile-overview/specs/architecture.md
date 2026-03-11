# Architecture

> Project structure, file locations, module imports, navigation, and tech stack.

---

## 1. Stack

| Tool | Version |
|------|---------|
| React Native | 0.76.9 |
| Expo | ~52.0.0 |
| Expo Router | ~4.0.0 |
| TypeScript | ~5.3.3 |
| TanStack Query | ^5.17.0 |
| Zustand | ^4.5.0 |
| Axios | ^1.6.5 |
| NX | 18.0.0 |

---

## 2. Project Structure

```
fit-mobile/
├── apps/mobile/src/app/
│   ├── _layout.tsx              # Root layout (auth guard)
│   ├── (auth)/                  # Unauthenticated screens
│   │   ├── _layout.tsx
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   └── (app)/                   # Authenticated screens (tabs)
│       ├── _layout.tsx
│       ├── home/index.tsx
│       ├── clients/index.tsx
│       ├── plans/index.tsx
│       └── profile/index.tsx
├── libs/
│   ├── identity/
│   │   ├── domain/src/entities/user.entity.ts
│   │   ├── application/src/store/auth.store.ts
│   │   ├── infrastructure/src/api/auth.api.ts
│   │   └── ui/src/hooks/useAuth.ts
│   ├── client/
│   │   ├── domain/src/entities/client.entity.ts
│   │   ├── application/src/ports/client.repository.ts
│   │   ├── infrastructure/src/api/client.api.ts
│   │   └── ui/src/hooks/useClients.ts
│   ├── training/
│   │   ├── domain/src/entities/{plan,exercise}.entity.ts
│   │   ├── infrastructure/src/api/plan.api.ts
│   │   └── ui/src/hooks/usePlans.ts
│   └── shared/
│       ├── domain/src/entity.base.ts
│       ├── ui/src/components/
│       │   ├── atoms/Button.tsx
│       │   ├── molecules/Card.tsx
│       │   └── organisms/EmptyState.tsx
│       └── utils/src/api-client.ts
└── apps/mobile/eas.json         # EAS Build config
```

---

## 3. DDD Layers (per lib module)

| Layer | Location | Responsibility |
|-------|----------|----------------|
| domain | `domain/entities/`, `domain/value-objects/` | Entities, VOs |
| application | `application/ports/`, `application/store/` | Repository ports, Zustand stores |
| infrastructure | `infrastructure/api/` | API clients (axios) |
| ui | `ui/hooks/`, `ui/components/` | React hooks, components |

---

## 4. File Locations

| Creating | Path |
|----------|------|
| Entity | `libs/{module}/domain/src/entities/{Name}.entity.ts` |
| Repository Port | `libs/{module}/application/src/ports/{name}.repository.ts` |
| Store | `libs/{module}/application/src/store/{name}.store.ts` |
| API Client | `libs/{module}/infrastructure/src/api/{name}.api.ts` |
| Hook | `libs/{module}/ui/src/hooks/use{Name}.ts` |
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` |
| Screen | `apps/mobile/src/app/(app)/{feature}/index.tsx` |

---

## 5. Module Imports

Paths defined in `tsconfig.base.json` — always use these, never relative cross-module imports:

```typescript
import { ... } from '@connecthealth/identity/domain';
import { ... } from '@connecthealth/identity/application';
import { ... } from '@connecthealth/identity/infrastructure';
import { ... } from '@connecthealth/identity/ui';

import { ... } from '@connecthealth/client/domain';
import { ... } from '@connecthealth/client/application';
import { ... } from '@connecthealth/client/infrastructure';
import { ... } from '@connecthealth/client/ui';

import { ... } from '@connecthealth/training/domain';
import { ... } from '@connecthealth/training/infrastructure';
import { ... } from '@connecthealth/training/ui';

import { ... } from '@connecthealth/shared/domain';
import { ... } from '@connecthealth/shared/ui';
import { ... } from '@connecthealth/shared/utils';
```

---

## 6. Navigation (Expo Router)

```
/                   → _layout.tsx     (auth guard — redirects to (auth) or (app))
/(auth)/signin      → SignInScreen
/(auth)/signup      → SignUpScreen
/(app)/home         → HomeScreen
/(app)/clients      → ClientsScreen
/(app)/plans        → PlansScreen
/(app)/profile      → ProfileScreen
```

- `router.replace('/(app)/home')` after login (clears back history)
- `router.push('/(auth)/signup')` for forward navigation

---

## 7. Key Files

| What | Where |
|------|-------|
| Expo Router screens | `apps/mobile/src/app/` |
| EAS config | `apps/mobile/eas.json` |
| Metro config | `apps/mobile/metro.config.js` |
| Pre-push hook | `.githooks/pre-push` |
| Base Entity | `libs/shared/domain/src/entity.base.ts` |
| API client (axios) | `libs/shared/utils/src/api-client.ts` |
| Auth store (Zustand) | `libs/identity/application/src/store/auth.store.ts` |
| useAuth hook | `libs/identity/ui/src/hooks/useAuth.ts` |
| Local docs | `docs/sprints/`, `docs/UI_PATTERNS.md` |
