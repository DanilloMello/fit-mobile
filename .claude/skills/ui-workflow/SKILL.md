---
name: ui-workflow
description: Design-first UI component workflow for solo dev — Figma Make (free) → MCP Figma → monorepo implementation.
---

# UI Component Workflow (Solo Dev)

> **Design first.** Every component starts from a Figma design. Figma Make is used for visual approval; Claude Code implements directly via MCP Figma.

---

## Step 0 — Get the Figma URL

If the user did **not** provide a Figma component/frame URL, **ask for it before proceeding**:

> Which Figma frame or component should I use as reference?
> Paste the URL (e.g. `https://www.figma.com/design/…?node-id=…`).

**Do not proceed until you have a valid Figma URL.**

---

## Step 1 — Read Design via MCP Figma

Use MCP Figma tools to extract all visual specs from the provided frame:

1. **`get_design_context`** — structure, layout, spacing, colors, typography, border radius, shadows
2. **`get_variable_defs`** — any Figma Variables defined (may be empty on free tier)
3. **`get_screenshot`** — visual reference of the frame

Extract and note:
- Colors (hex values) → map to existing project tokens in `libs/shared/ui/src/tokens/`
- Spacing values → map to project spacing tokens
- Typography (font, size, weight) → map to project typography tokens
- Layout (flex direction, alignment, padding, gaps)
- Variants / states (if any)

**No Tokens Studio or Style Dictionary needed** — map Figma values directly to existing project tokens.

---

## Step 2 — Map to Project Tokens

Compare extracted values against existing tokens:

```
libs/shared/ui/src/tokens/colors.ts
libs/shared/ui/src/tokens/spacing.ts
libs/shared/ui/src/tokens/typography.ts
```

| Scenario | Action |
|----------|--------|
| Value matches an existing token | Use the token |
| Value is close but not exact | Ask user: use existing token or create new one? |
| Value is completely new | Create new token in the appropriate file |

---

## Step 3 — Check Monorepo for Existing Components

Search before creating anything:

```
libs/shared/ui/src/components/atoms/        ← primitives (Button, Icon, Skeleton)
libs/shared/ui/src/components/molecules/    ← functional units (Card, InputField)
libs/shared/ui/src/components/organisms/    ← complex sections (EmptyState, ClientList)
libs/{module}/ui/src/components/molecules/  ← domain-specific molecules
libs/{module}/ui/src/components/organisms/  ← domain-specific organisms
```

- **Found and matches design:** return the import path. Done.
- **Found but outdated:** update existing component to match. Go to Step 4.
- **Not found:** continue to Step 4.

---

## Step 4 — Implement Component

### 4a. Determine atomic level

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

### 4b. Create the component file

| Level | Path |
|-------|------|
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` |

Rules:
- Match the Figma design specs — use project tokens, not hardcoded values
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
- Use design tokens from `../tokens` (colors, spacing, typography)
- Add `accessibilityRole`, `accessibilityLabel`, `accessibilityState` to interactive elements
- Minimum touch target: 44×44pt
- Create a co-located test file `{Name}.test.tsx` using `@testing-library/react-native`

### 4c. Update monorepo exports

Add the export to the atomic barrel:

```typescript
// libs/{module}/ui/src/components/{atoms|molecules|organisms}/index.ts
export { ComponentName } from './ComponentName';
```

Verify the lib-level `index.ts` re-exports the atomic barrel.

---

## Step 5 — Token Deviation Check

If the Figma design uses values that don't match any existing token:

> The design uses `[value]` for `[property]` but the closest token is `[token]` (`[token-value]`).
> Should I:
> - **A) Create a new token** to match this design value?
> - **B) Use the existing token** `[token]` instead?

Wait for user answer before proceeding.

---

## MCP Figma Tools Reference

| Tool | When to use |
|------|-------------|
| `get_design_context` | Layout structure, visual specs, component properties |
| `get_variable_defs` | Figma Variables (tokens defined in Figma) |
| `get_screenshot` | Visual reference of the frame |
| `get_metadata` | File/node metadata |
| `download_figma_images` | Export icons, illustrations, assets |

---

## Rules

- **Design first** — always start from the Figma design, never from imagination
- **Always ask for the Figma URL** if not provided — do not guess or skip
- **Map to project tokens** — never hardcode color/spacing/typography values
- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation
- **No Tokens Studio / Style Dictionary pipeline** — map MCP-extracted values directly to project tokens (see memory `reference_design_workflow_with_designer` for the full pipeline when a designer joins)

---

**Last Updated:** 2026-03-15
**Version:** 6.0
