---
name: ui-workflow
description: Design-first UI component workflow for solo dev — Claude Visualizer (HTML/SVG) → token mapping → monorepo implementation.
---

# UI Component Workflow (Solo Dev)

> **Visual approval first.** Every component starts with a Claude-rendered HTML/SVG mock. No Figma, no external tools — mock and implementation happen in the same session.

---

## Step 1 — Describe the Component

If the user did not describe the component clearly, ask:

> What should this component do and look like?
> Include: content (text, icons, images), states (default, pressed, disabled, empty), layout hints.

With a clear description, **generate the mock immediately — do not ask for a Figma URL**.

---

## Step 2 — Generate HTML/SVG Mock (Visualizer)

Use the Claude built-in visualizer to render an HTML/SVG mockup in the conversation.

Requirements for the mock:
- Use **freeform px/hex values** — visual accuracy matters here, tokens come later
- Show **all relevant states** (default, pressed/active, disabled, loading, empty) as separate frames
- Include realistic content (labels, icons, data)
- Match mobile proportions (375px wide reference frame)

Present the mock and ask:

> Here's the visual mock. Does this match what you had in mind?
> - Approve → I'll map to tokens and implement
> - Change [X] → I'll update the mock first

**Do not proceed to Step 3 until the mock is approved.**

---

## Step 3 — Map Mock Values to Project Tokens

Read the current token files before mapping:

```
libs/shared/ui/src/tokens/colors.ts
libs/shared/ui/src/tokens/spacing.ts
libs/shared/ui/src/tokens/typography.ts
```

For every visual value used in the mock:

| Scenario | Action |
|----------|--------|
| Mock value matches an existing token | Use the token |
| Mock value is close but not exact | Ask user: use existing token or create new one? |
| Mock value is completely new | Create new token in the appropriate file |

> The mock uses `#1A73E8` for the primary button but the closest token is `colors.brand.primary` (`#1B72E8`).
> A) Use `colors.brand.primary`  B) Create a new token?

Wait for user answer before proceeding.

---

## Step 4 — Check Monorepo for Existing Components

Search before creating anything:

```
libs/shared/ui/src/components/atoms/        ← primitives (Button, Icon, Skeleton)
libs/shared/ui/src/components/molecules/    ← functional units (Card, InputField)
libs/shared/ui/src/components/organisms/    ← complex sections (EmptyState, ClientList)
libs/{module}/ui/src/components/molecules/  ← domain-specific molecules
libs/{module}/ui/src/components/organisms/  ← domain-specific organisms
```

- **Found and matches approved mock:** return the import path. Done.
- **Found but outdated:** update existing component to match. Go to Step 5.
- **Not found:** continue to Step 5.

---

## Step 5 — Implement Component

### 5a. Determine atomic level

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

### 5b. Create the component file

| Level | Path |
|-------|------|
| Atom | `libs/shared/ui/src/components/atoms/{Name}.tsx` |
| Molecule | `libs/{module}/ui/src/components/molecules/{Name}.tsx` |
| Organism | `libs/{module}/ui/src/components/organisms/{Name}.tsx` |

Rules:
- Implement exactly what was approved in the mock — use project tokens, never hardcode values
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
- Use design tokens from `../tokens` (colors, spacing, typography)
- Add `accessibilityRole`, `accessibilityLabel`, `accessibilityState` to interactive elements
- Minimum touch target: 44×44pt
- Create a co-located test file `{Name}.test.tsx` using `@testing-library/react-native`

### 5c. Update monorepo exports

```typescript
// libs/{module}/ui/src/components/{atoms|molecules|organisms}/index.ts
export { ComponentName } from './ComponentName';
```

Verify the lib-level `index.ts` re-exports the atomic barrel.

---

## Rules

- **Visual approval first** — always generate and approve the HTML/SVG mock before coding
- **Never skip the mock** — even for "simple" components; the mock catches misalignments early
- **Map to project tokens** — never hardcode color/spacing/typography in the final component
- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation
- **No MCP Figma calls** — this workflow is Figma-free by design

---

**Last Updated:** 2026-04-02
**Version:** 7.0
