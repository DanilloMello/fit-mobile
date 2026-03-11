# Rules & Checklists

> Coding rules, new feature checklist, development commands, builds, and validation gates.

---

## 1. Coding Rules

- **Server state**: TanStack Query (`useQuery`, `useMutation`, `useQueryClient`)
- **Client state**: Zustand — no `persist` middleware unless explicitly required
- **Styles**: always `StyleSheet.create` — no inline style objects
- **Env vars**: prefix with `EXPO_PUBLIC_` for client-exposed values
- **Endpoints**: always read `docs/API_REGISTRY.md` via `github` MCP (fit-common) — never guess URLs
- **Library docs**: use `context7` MCP for up-to-date hook/API signatures for any package
- **Imports**: use `@connecthealth/*` paths — never relative imports across modules
- **Error handling**: catch `unknown`, narrow with `instanceof Error`
- **Auth response envelope**: backend wraps auth in `{ data: T }`, unwrap as `response.data.data`
- **AuthGuard**: use declarative `<Redirect href="...">` in root `_layout.tsx` — NOT `useEffect + useRouter` (race conditions in Expo Router 4)
- **Root tsconfig.json**: extends `./tsconfig.base.json` (NOT `expo/tsconfig.base`) so `tsc --noEmit` resolves `@connecthealth/*` paths
- **All UI components** go in `libs/`, never in `apps/mobile/`
- **Atoms only in `shared/ui`** — domain libs never define atoms

---

## 2. Checklist: New Feature

- [ ] Read `docs/API_REGISTRY.md` via `github` MCP (fit-common) for endpoint contract
- [ ] Entity in `libs/{module}/domain/src/entities/`
- [ ] API client in `libs/{module}/infrastructure/src/api/`
- [ ] Hook in `libs/{module}/ui/src/hooks/`
- [ ] Atoms (if new primitives needed) in `libs/shared/ui/src/components/atoms/`
- [ ] Molecules in `libs/{module}/ui/src/components/molecules/`
- [ ] Organisms in `libs/{module}/ui/src/components/organisms/`
- [ ] Screen in `apps/mobile/src/app/(app)/{feature}/index.tsx`
- [ ] Export from each `libs/{module}/{layer}/src/index.ts` and atomic `index.ts` barrels

---

## 3. Checklist: New Module

- [ ] Create `libs/{module}/domain/src/entities/` + barrel
- [ ] Create `libs/{module}/application/src/` (ports, store) + barrel
- [ ] Create `libs/{module}/infrastructure/src/api/` + barrel
- [ ] Create `libs/{module}/ui/src/hooks/` + `components/molecules/` + `components/organisms/` + barrel
- [ ] Add `@connecthealth/{module}/*` paths in `tsconfig.base.json`
- [ ] Update `specs/architecture.md` to reflect the new module

---

## 4. Checklist: Code Review / Compliance

- [ ] No relative cross-module imports — only `@connecthealth/*`
- [ ] No inline styles — all `StyleSheet.create`
- [ ] Error handling uses `catch (e: unknown)` + `instanceof Error`
- [ ] No guessed API endpoints — verified against `API_REGISTRY.md`
- [ ] Atoms only in `shared/ui`, domain libs start at molecules
- [ ] All interactive elements have `accessibilityRole` and `accessibilityLabel`
- [ ] Lists use `FlatList`, not `ScrollView` + `.map()`
- [ ] Barrel exports updated for any new files

---

## 5. Development Commands

```bash
# Start Expo dev server (Metro)
cd apps/mobile && npx expo start     # Scan QR with Expo Go app

# Run all tests
npx nx test

# NX project commands
npx nx run mobile:start             # Start via NX
```

No native build needed locally — Expo Go hot-reloads JS/TS changes instantly.

---

## 6. EAS Cloud Builds (from `apps/mobile/`)

```bash
eas build --platform android --profile preview     # APK — QA / testers
eas build --platform android --profile production  # AAB — Play Store
```

| Profile | Output | Use |
|---------|--------|-----|
| `preview` | APK | internal QA distribution |
| `production` | AAB | Play Store submission |

> `eas build --local` does NOT work on Windows (requires macOS/Linux).

---

## 7. Validation Gates

| Gate | Trigger | Checks |
|------|---------|--------|
| `pre-push` hook | every `git push` | TypeScript, ESLint, tests, Expo web bundle |
| GitHub Actions `validate` | every push/PR | same + coverage + security audit |
| GitHub Actions `eas-build` | push/PR to `master` | EAS cloud build |

Pre-push hook source: `.githooks/pre-push` (version-controlled).
On a fresh clone, run once: `git config core.hooksPath .githooks`

---

## 8. Git Workflow

### Branch model

| Branch | Purpose |
|--------|---------|
| `master` | Production-ready code only |
| `develop` | Integration — all features merge here |
| `feat/<scope>-<description>` | Feature branches (from `develop`) |
| `fix/<scope>-<description>` | Bug fixes (from `develop`) |
| `hotfix/<description>` | Critical fixes (from `master`) |
| `release/<version>` | Release prep (from `develop`) |

### Commit format (Conventional Commits)

```
feat(identity): add sign-up screen
fix(client): correct API response mapping
refactor(shared): extract api-client helper
chore(deps): add expo-crypto polyfill
```

### Daily rule

```bash
git checkout develop && git pull
git checkout -b feat/sprint-N-<what-you-are-doing>
# commit every logical change, push immediately
git add <specific-files>
git commit -m "feat(<scope>): description"
git push -u origin HEAD
```

---

## 9. Skill Sync Rule

After implementing any feature or change, update `.claude/skills/fit-mobile-overview/SKILL.md` and its specs if any of the following changed:
- Lib module or layer structure → update `specs/architecture.md`
- Dependencies or versions → update `specs/architecture.md`
- Patterns (hook, store, API client, component) → update `specs/patterns.md`
- UI components or atomic design → update `specs/ui-components.md`
- Rules or checklists → update `specs/rules-and-checklists.md`
- Screens or navigation routes → update `specs/architecture.md`
