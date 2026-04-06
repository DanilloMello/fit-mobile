---
name: ui-workflow
description: Design-first UI component workflow — Claude Visualizer (idealization) → Figma → monorepo implementation.
---

# UI Component Workflow

> **Three required stages — no skipping.**
> Visualizer (idealize) → Figma (design record) → Implementation (code)

---

## Step 1 — Describe the Component

If the user's request is ambiguous, ask:

> What should this component do and look like?
> Include: content (text, icons, images), states (default, pressed, disabled, empty), layout hints.

With a clear description, **go straight to Step 2 — do not ask for a Figma URL**.

---

## Step 2 — Visualizer: Idealization

**Before generating the mock, read the project tokens:**

```
libs/shared/ui/src/tokens/colors.ts
libs/shared/ui/src/tokens/spacing.ts
libs/shared/ui/src/tokens/typography.ts
```

Use the Claude built-in visualizer to render an HTML/SVG mockup in the conversation.

Requirements for the mock:
- Use **project token values** directly (actual hex/px numbers from the token files above) — never invent values
- Show **all relevant states** (default, pressed/active, disabled, loading, empty) as separate frames
- Include realistic content (labels, icons, data)
- Match mobile proportions (375px wide reference frame)
- Add a token legend below the mock listing which token maps to each visual value (e.g. `background: colors.surface (#1C1C1E)`)

Present the mock and ask:

> Here's the visual mock using project tokens. Does this match what you had in mind?
> - Approve → I'll transfer to Figma
> - Change [X] → I'll update the mock first

**Do not proceed to Step 3 until the mock is explicitly approved.**
Iterate as many times as needed — changes cost nothing here.

---

## Step 3 — Transfer to Figma

Once the mock is approved, create the component frame in Figma using the Figma MCP.

1. Use `mcp__Figma__use_figma` (or equivalent) to create/update the component frame in the project's Figma file
2. Reproduce the approved layout, states, and visual values faithfully
3. Share the Figma node URL with the user

Ask:

> The design is now in Figma: [URL]
> Does it look right there? Approve to proceed to implementation.

**Do not proceed to Step 4 until Figma is approved.**

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

- **Found and matches approved design:** return the import path. Done.
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
- Implement from the Figma design as source of truth — use project tokens, never hardcode values
- Domain libs (`client`, `identity`, `training`) never define atoms — import from `@connecthealth/shared/ui`
- `StyleSheet.create` only — no inline style objects
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

- **Three required stages** — Visualizer → Figma → Implementation, in that order
- **Never jump from Visualizer directly to code** — Figma is a required step
- **Never skip the mock** — even for "simple" components; ideation catches misalignments early
- **Figma is the source of truth** — implementation follows Figma, not the mock
- **Map to project tokens** — never hardcode color/spacing/typography in the final component
- **Never create components in `apps/`** — always in `libs/`
- **Never duplicate** — search monorepo before any creation

---

**Last Updated:** 2026-04-05
**Version:** 8.1
