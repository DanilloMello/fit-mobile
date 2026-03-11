---
name: ui-workflow
description: Design-first UI component workflow — Figma design → monorepo implementation.
---

# UI Component Workflow

> **Design first.** Every component starts from a Figma design before any code is written.

---

## Step 0 — Get the Figma URL

If the user did **not** provide a Figma component/frame URL, **ask for it before proceeding**:

> Which Figma frame or component should I use as reference?
> Paste the URL (e.g. `https://www.figma.com/design/…?node-id=…`).

**Do not proceed until you have a valid Figma URL.**

---

## Step 1 — Fetch Design System

Before touching any component, load the current design system from Figma using the figma MCP:

1. Use `get_figma_data` on the design system page/node to load:
   - Color tokens
   - Typography scale
   - Spacing grid
   - Existing component variants and naming conventions
2. Keep these tokens as reference for the entire workflow.

---

## Step 2 — Fetch the Component Design

Use `get_figma_data` with the user-provided URL/node to extract:
- Visual specs (colors, spacing, typography, border radius, shadows)
- Variants (states, sizes, themes)
- Layout structure (flex direction, alignment, padding)
- Assets that need export (icons, illustrations) via `download_figma_images`

---

## Step 3 — Check Monorepo

Search for an existing implementation before creating anything:

```
libs/shared/ui/src/components/atoms/        ← primitives (Button, Icon, Skeleton)
libs/shared/ui/src/components/molecules/    ← functional units (Card, InputField)
libs/shared/ui/src/components/organisms/    ← complex sections (EmptyState, ClientList)
libs/{module}/ui/src/components/molecules/  ← domain-specific molecules
libs/{module}/ui/src/components/organisms/  ← domain-specific organisms
```

**If found and matches the design:** return the component's import path. Done.

**If found but outdated:** update the existing component to match the Figma design. Go to Step 5.

**If not found:** continue to Step 4.

```typescript
// Example result
import { Button } from '@connecthealth/shared/ui';
import { ClientCard } from '@connecthealth/client/ui';
```

---

## Step 4 — Create Component in Monorepo

### 4a. Check similar components
Search monorepo for components with overlapping responsibility. If one covers ≥ 80% of the need, extend it instead of creating a new file.

### 4b. Determine atomic level

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

### 4c. Create the component file

Place at the correct atomic path:

| Level | Path | Rule |
|-------|------|------|
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` | Primitive, no business logic. Only in `shared/ui`. |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` | Composes atoms; may have local UI state. |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` | Composes molecules/atoms; may accept domain props. |

Rules:
- Match the Figma design specs exactly — colors, spacing, typography from design tokens
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
- Use design tokens from `../tokens` (colors, spacing, typography)
- Add `accessibilityRole`, `accessibilityLabel`, `accessibilityState` to interactive elements
- Minimum touch target: 44×44pt
- Create a co-located test file `{Name}.test.tsx` using `@testing-library/react-native`; cover render, user interaction, and accessibility state

### 4d. Update monorepo exports

Add the export to the atomic barrel:

```typescript
// libs/{module}/ui/src/components/{atoms|molecules|organisms}/index.ts
export { ComponentName } from './ComponentName';
```

Verify the lib-level `index.ts` re-exports the atomic barrel.

---

## Step 5 — Design vs Design System Audit

Before writing any code, compare the fetched component design against the design system tokens loaded in Step 1.

### 5a. Spec deviations
If the component uses colors, spacing, typography, border radius, or shadows that **don't match** the design system:

> The design uses `[value]` for `[property]` but the design system defines `[token]` (`[ds-value]`).
> Should I:
> - **A) Create a new variant/token** in the design system to match this design?
> - **B) Stick with the design system** and use `[token]` instead?

**Wait for the user's answer before creating anything.**

- If **A**: add the new variant/token to the design system in Figma, then create the component using it.
- If **B**: implement the component using the existing design system token, ignoring the deviation.

### 5b. New component in design system
If the Figma file contains a component that **is not yet in the monorepo and was recently added to the design system** (new node, no existing code counterpart), treat it as a net-new component and proceed directly to Step 4 — no user prompt needed.

---

## Step 6 — Sync Back to Figma

After the component is created or updated in code, check if the design system in Figma needs updating:

- **New variants** added in code that don't exist in Figma → update Figma with the new variants
- **New component type** that didn't exist → add the component to the Figma design system
- **New tokens** (color, spacing, etc.) introduced → add them to the Figma design system page

Use figma MCP tools (`get_figma_data`, `download_figma_images`) to verify sync, and inform the user of any manual Figma updates needed (MCP currently supports read-only; write-back may require manual action).

---

## Figma MCP Tools Reference

| Tool | When to use |
|------|-------------|
| `get_figma_data` | Fetch design specs, component structure, design system tokens |
| `download_figma_images` | Export icons, illustrations, and assets from Figma frames |

---

## Rules

- **Design first** — always start from the Figma design, never from imagination
- **Always ask for the Figma URL** if not provided — do not guess or skip
- **Always fetch the design system first** — before creating any component
- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation
- **Always sync both ways** — monorepo change → Figma update; Figma find → monorepo creation
- **Always respect the Figma design system** — tokens, naming, variants

---

**Last Updated:** 2026-03-11
**Version:** 5.0
