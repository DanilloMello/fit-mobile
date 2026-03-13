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

## Step 1 — Load Design Tokens from Repo

Before touching any component, ensure the local tokens are up to date and read them:

1. Run `git pull` to ensure `tokens.json` reflects the latest version pushed by Tokens Studio.
2. Read `libs/shared/ui/src/tokens/tokens.json` — this is what the app actually consumes.
3. Extract and keep in memory the available token names from each category:
   - `global.colors.*` → e.g. `brand`, `background`, `surface`, `textPrimary`
   - `global.spacing.*` → e.g. `xs`, `sm`, `md`, `lg`, `xl`
   - `global.borderRadius.*` → e.g. `sm`, `card`
   - `global.typography.*` → e.g. `display`, `body`, `label`, `button`
   - `global.boxShadow.*` → e.g. `card`, `brandGlow`
4. These token names **must** be used when generating component code in Step 4.

> The source of truth for component code are the **generated TypeScript files** at `libs/shared/ui/src/tokens/`:
> `colors.ts`, `spacing.ts`, `typography.ts`, `radii.ts`, `shadows.ts`
> Import from these files — never from the raw JSON and never hardcode values.

```typescript
import { colors } from '@connecthealth/shared/ui/tokens';
import { spacing } from '@connecthealth/shared/ui/tokens';
import { typography } from '@connecthealth/shared/ui/tokens';
import { radii } from '@connecthealth/shared/ui/tokens';
import { shadows } from '@connecthealth/shared/ui/tokens';

// usage: colors.brand, spacing.md, radii.sm
```

> If `tokens.json` does not yet contain a value the design requires, note the gap and address it in Step 5.

---

## Step 2 — Fetch the Component Design from Figma

Use `get_design_context` (preferred) or `get_figma_data` with the user-provided URL/node to extract:
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

## Step 4 — Design vs Design System Audit

Before writing any code, compare the Figma design against the tokens loaded in Step 1.

### 4a. Spec deviations
If the component uses colors, spacing, typography, border radius, or shadows that **don't match** any token in `tokens.json`:

> The design uses `[value]` for `[property]` but the design system defines `[token]` (`[ds-value]`).
> Should I:
> - **A) Create a new token** in `tokens.json` to match this design, then run `npm run build:tokens`?
> - **B) Stick with the design system** and use `[token]` instead?

**Wait for the user's answer before creating anything.**

- If **A**: add the new token to `tokens.json`, run `npm run build:tokens` to regenerate the TS files, then proceed to Step 5 using the new token.
- If **B**: implement the component using the existing token, ignoring the deviation.

### 4b. New component in design system
If the Figma file contains a component that **is not yet in the monorepo and was recently added to the design system** (new node, no existing code counterpart), treat it as a net-new component and proceed directly to Step 5 — no user prompt needed.

---

## Step 5 — Create Component in Monorepo

### 5a. Check similar components
Search monorepo for components with overlapping responsibility. If one covers ≥ 80% of the need, extend it instead of creating a new file.

### 5b. Determine atomic level

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

### 5c. Create the component file

Place at the correct atomic path:

| Level | Path | Rule |
|-------|------|------|
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` | Primitive, no business logic. Only in `shared/ui`. |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` | Composes atoms; may have local UI state. |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` | Composes molecules/atoms; may accept domain props. |

Rules:
- Match the Figma design specs exactly — using tokens loaded in Step 1
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
- Only use token names that exist in `tokens.json` — never hardcode raw values
- Add `accessibilityRole`, `accessibilityLabel`, `accessibilityState` to interactive elements
- Minimum touch target: 44×44pt
- Create a co-located test file `{Name}.test.tsx` using `@testing-library/react-native`; cover render, user interaction, and accessibility state

### 5d. Update monorepo exports

Add the export to the atomic barrel:

```typescript
// libs/{module}/ui/src/components/{atoms|molecules|organisms}/index.ts
export { ComponentName } from './ComponentName';
```

Verify the lib-level `index.ts` re-exports the atomic barrel.

---

## Step 6 — Sync Back to Figma

After the component is created or updated in code, check if the design system in Figma needs updating:

- **New variants** added in code that don't exist in Figma → inform the user to add them manually in Figma
- **New tokens** introduced → inform the user to add them in Tokens Studio and push to GitHub

> The Figma MCP is read-only. Any write-back to Figma requires manual action by the user.

---

## Figma MCP Tools Reference

| Tool | When to use |
|------|-------------|
| `get_design_context` | Primary tool — fetch design specs, visual context, and component structure |
| `get_figma_data` | Fallback — use only if `get_design_context` is unavailable |
| `download_figma_images` | Export icons, illustrations, and assets from Figma frames |

---

## Rules

- **Design first** — always start from the Figma design, never from imagination
- **Always ask for the Figma URL** if not provided — do not guess or skip
- **Always pull and read tokens first** — `git pull` → read `tokens.json` before any code
- **Never hardcode values** — every color, spacing, radius, shadow must reference a token
- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation
- **Always sync both ways** — monorepo change → inform user of Figma updates needed
- **Always respect the token system** — if a value is missing, ask before adding a new token

---

**Last Updated:** 2026-03-12
**Version:** 5.2
