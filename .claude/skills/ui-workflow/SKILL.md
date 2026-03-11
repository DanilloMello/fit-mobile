---
name: ui-workflow
description: Get or create a UI component — monorepo first, then Figma, then generate.
---

# UI Component Workflow

> Single entry point for getting or creating any UI component in the monorepo.

---

## Decision Flow

```
Request: get/create <ComponentName>
│
├─ 1. EXISTS in monorepo?
│     YES → return import path + usage. Done.
│
└─ NO → 2. EXISTS in Figma? (figma MCP: get_code / search)
          │
          YES → import specs → create in monorepo (atomic path) → Done.
          │
          └─ NO → 3. CREATE from scratch
                     a. Check similar components in monorepo
                     b. Fetch Figma design system (figma MCP)
                     c. Create component in monorepo following design system
                     d. Add component to Figma project (figma MCP)
                     e. Update Figma design system with new component (figma MCP)
                     f. Update monorepo exports (atomic index.ts barrels)
```

---

## Step 1 — Search Monorepo

Search in order:

```
libs/shared/ui/src/components/atoms/        ← primitives (Button, Icon, Skeleton)
libs/shared/ui/src/components/molecules/    ← functional units (Card, InputField)
libs/shared/ui/src/components/organisms/    ← complex sections (EmptyState, ClientList)
libs/{module}/ui/src/components/molecules/  ← domain-specific molecules
libs/{module}/ui/src/components/organisms/  ← domain-specific organisms
```

**If found:** return the component's import path and move on. No further steps.

```typescript
// Example result
import { Button } from '@connecthealth/shared/ui';
import { ClientCard } from '@connecthealth/client/ui';
```

---

## Step 2 — Search Figma (figma MCP)

Use `get_code` or search by component name in the Figma file.

**If found:**
1. Extract design specs (colors, spacing, typography, variants) from Figma
2. Determine atomic level (atom / molecule / organism) — see rules below
3. Create component file in the correct monorepo path
4. Add to the atomic `index.ts` barrel
5. Done — return import path

---

## Step 3 — Create from Scratch

Only reached when the component exists in neither monorepo nor Figma.

### 3a. Check similar components
Search monorepo for components with overlapping responsibility. If one covers ≥ 80% of the need, extend it instead of creating a new file.

### 3b. Fetch Figma design system
Use figma MCP (`create_design_system_rules` or `get_code` on the design system node) to load:
- Color tokens
- Typography scale
- Spacing grid
- Existing component variants and naming conventions

### 3c. Create component in monorepo
Place at the correct atomic path:

| Level | Path | Rule |
|-------|------|------|
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` | Primitive, no business logic. Only in `shared/ui`. |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` | Composes atoms; may have local UI state. |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` | Composes molecules/atoms; may accept domain props. |

Rules:
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
- Use design tokens from `../tokens` (colors, spacing, typography)
- Add `accessibilityRole`, `accessibilityLabel`, `accessibilityState` to interactive elements
- Minimum touch target: 44×44pt
- Create a co-located test file `{Name}.test.tsx` using `@testing-library/react-native`; cover render, user interaction, and accessibility state

### 3d. Add component to Figma project
Use figma MCP to publish the new component into the Figma file, matching the design system structure.

### 3e. Update Figma design system
Use figma MCP (`create_design_system_rules` or equivalent) to register the new component or any design token changes so Figma stays in sync with code.

### 3f. Update monorepo exports
Add the export to the atomic barrel:

```typescript
// libs/{module}/ui/src/components/{atoms|molecules|organisms}/index.ts
export { ComponentName } from './ComponentName';
```

Verify the lib-level `index.ts` re-exports the atomic barrel.

---

## Atomic Placement Decision

```
Single, indivisible element (button, icon, badge, input base)?
  → Atom  (shared/ui only)

2+ atoms forming one functional unit (labeled input, list row, card)?
  → Molecule

Atoms/molecules forming a self-contained UI section (form, list, header)?
  → Organism

Fetches data and renders a full screen?
  → Screen  (apps/mobile/src/app/(app)/{feature}/index.tsx)
```

---

## Figma MCP Tools Reference

| Tool | When to use |
|------|-------------|
| `get_code` | Fetch design specs for a specific component or frame |
| `create_design_system_rules` | Load or regenerate design system tokens/rules |
| *(publish)* | Push new component back into the Figma file |

---

## Rules

- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation
- **Always sync both ways** — monorepo change → Figma update; Figma find → monorepo creation
- **Always respect the Figma design system** — tokens, naming, variants

---

**Last Updated:** 2026-03-03
**Version:** 4.0
