# UI Component Workflow Guide
## fit-mobile

**Complete guide for creating UI components from Figma design to implementation**

---

## Quick Start

To create a new UI component:

1. **Request creation:** Tell Claude:
   ```
   "Create a new [ComponentName] component for [feature/module]"
   ```

2. **Claude uses specialized skills:**
   - `ui-workflow` - Routes the workflow
   - `analyze-mockup` - Validates against guidelines
   - `create-component` - Implements React Native component

3. **You approve at checkpoints:**
   - After Figma design fetch
   - After design analysis
   - Before final implementation

---

## Workflow Steps

### Step 1: Get Mockup from Figma

**When:** User provides Figma URL or has design ready in Figma

**Process:**
1. AI fetches design from Figma using `get_code`:
   - Design specifications
   - Component structure
   - Design tokens (colors, spacing, typography)
   - Assets references

2. If no URL provided, AI asks for Figma file/node URL

3. Uses `create_design_system_rules` if design system generation needed

**Your Action:** Ensure Figma URL is accessible and design is finalized

---

### Step 2: Design Analysis

**When:** Figma design specs retrieved

**Skill Used:** `analyze-mockup`

**Process:**
Skill analyzes mockup against:
- ✓ **UI_UX_GUIDELINES.md** - Design system compliance
- ✓ **DOMAIN_SPEC.md** - Data structure alignment
- ✓ **PRD.md** - Feature requirements
- ✓ **CODING_GUIDELINES.md** - Code standards

**Analysis Report includes:**
- Requirements validation
- Accessibility checklist (WCAG 2.1 AA)
- Design system compliance
- Responsive design review
- Recommendations

**Your Action:** Review analysis and approve or request changes

---

### Step 3: Component Implementation

**When:** Design analysis approved

**Skill Used:** `create-component`

**Process:**
1. Skill determines component location:
   ```
   Shared:  libs/shared/ui/src/components/{Name}.tsx
   Module:  libs/{module}/ui/src/components/{Name}.tsx
   Screen:  apps/mobile/src/app/(app)/{feature}/{name}.tsx
   ```

2. Generates files:
   - Component file (`{Name}.tsx`)
   - Test file (`{Name}.test.tsx`)
   - Updates exports (`index.ts`)

3. Applies patterns:
   - Props interface from mockup
   - Accessibility labels
   - Design system tokens
   - Responsive design
   - Error/loading states

4. Adds documentation:
   - JSDoc comments
   - Usage examples
   - Props table

**Outcome:** Production-ready component with tests and docs

---

## File Structure

```
fit-mobile/
├── docs/
│   ├── UI_PATTERNS.md           # React Native patterns
│   └── UI_COMPONENT_WORKFLOW_GUIDE.md  # This file
│
├── libs/
│   ├── shared/ui/               # Shared components
│   │   └── src/components/
│   └── {module}/ui/             # Module-specific components
│       └── src/components/
│
└── .claude/
    ├── mcp.json                 # Includes Figma MCP
    └── skills/
        ├── ui-workflow/               # Main workflow router
        ├── analyze-mockup/            # Design validation
        └── create-component/          # Component generation
```

---

## Resources

### 📘 Guidelines Central Authority

**See:** `.claude/skills/ui-workflow/SKILL.md` - **Guidelines Reference** section

The `ui-workflow` skill contains the comprehensive, centralized reference for all UI/UX guidelines:
- Complete list of all guideline documents
- What each guideline contains
- When each guideline is loaded (by workflow step)
- Which skill uses which guideline
- Loading strategy per step

**This is the single source of truth** for guideline locations and usage.

### 📚 Guidelines & Documentation

**Platform-wide** (via `fit-mobile-docs` MCP):
- **[DESIGN_SYSTEM.md](../../fit-common/docs/DESIGN_SYSTEM.md)** - Design tokens, colors, typography, spacing, accessibility
- **[DOMAIN_SPEC.md](../../fit-common/docs/DOMAIN_SPEC.md)** - Entities, enums, business rules
- **[PRD.md](../../fit-common/docs/PRD.md)** - Product requirements
- **[CODING_GUIDELINES.md](../../fit-common/docs/CODING_GUIDELINES.md)** - Code standards

**Mobile-specific** (fit-mobile local):
- **[UI_PATTERNS.md](UI_PATTERNS.md)** - React Native implementation patterns, code examples

**Deprecated:**
- ~~UI_UX_GUIDELINES.md~~ - See DESIGN_SYSTEM.md + UI_PATTERNS.md instead

### 🤖 Skills

- **ui-workflow** - Main workflow router and guidelines authority
- **analyze-mockup** - Validates designs against guidelines
- **create-component** - Generates React Native components
- **fit-mobile** - React Native patterns and conventions

### 🛠️ Tools

- **Figma** - Design tool with MCP integration for fetching designs

---

## Examples

### Example 1: Client Profile Header

**Request:**
```
"Create a ClientProfileHeader component"
```

**Workflow:**
1. 🎨 Fetches design from Figma:
   - Client name, photo, email
   - Active status badge
   - Edit button
   - Responsive layout
2. ✅ Analysis approved:
   - Accessibility ✓
   - Design system ✓
   - Domain alignment ✓
3. 💻 Generates component:
   - `libs/client/ui/src/components/ClientProfileHeader.tsx`
   - `libs/client/ui/src/components/ClientProfileHeader.test.tsx`
   - Updates `libs/client/ui/src/index.ts`

**Deliverables:**
- Figma design specs
- Analysis report
- Working component
- Tests
- Documentation

---

### Example 2: Exercise Card

**Request:**
```
"Create an ExerciseCard component for the training module"
```

**Workflow:**
1. 🎨 Fetches design from Figma:
   - Exercise name
   - Muscle group badge
   - Equipment icon
   - Sets x Reps
   - Swipeable actions (edit, delete)
2. ✅ Analysis approved
3. 💻 Generates component at:
   - `libs/training/ui/src/components/ExerciseCard.tsx`

---

## Design System Quick Reference

### Colors
```typescript
primary:    #007AFF (CTA buttons, links)
secondary:  #5856D6
success:    #34C759 (confirmations, active status)
error:      #FF3B30 (errors, destructive actions)
warning:    #FF9500
```

### Spacing (8pt grid)
```
xs:  4px   sm: 8px   md: 16px
lg:  24px  xl: 32px  xxl: 48px
```

### Typography
```
h1:       32px / 700
h2:       24px / 600
h3:       20px / 600
body:     16px / 400
bodyBold: 16px / 600
caption:  14px / 400
small:    12px / 400
```

### Touch Targets
```
Minimum: 44x44pt
Optimal: 48x48pt
```

---

## Accessibility Checklist

Every component must have:
- ✓ Color contrast ≥ 4.5:1 (text) or 3:1 (UI)
- ✓ Touch targets ≥ 44x44pt
- ✓ `accessibilityLabel` on all interactive elements
- ✓ `accessibilityRole` (button, link, etc.)
- ✓ `accessibilityState` (disabled, selected, etc.)
- ✓ Works with VoiceOver/TalkBack
- ✓ Supports text scaling

---

## Testing Checklist

Before component is complete:
- ✓ Props validation works
- ✓ Event handlers execute
- ✓ Conditional rendering (loading, error, success)
- ✓ Accessibility tested with screen reader
- ✓ Responsive on different screen sizes
- ✓ Error states handled gracefully
- ✓ Loading states implemented

---

## Best Practices

### Do's ✅
- Follow design system strictly
- Use design tokens (colors, spacing, typography)
- Add accessibility labels to all interactive elements
- Implement loading and error states
- Write tests for all components
- Document props and usage
- Keep components small and focused
- Use TypeScript strict mode

### Don'ts ❌
- Don't use hardcoded colors/spacing
- Don't skip accessibility features
- Don't use `any` type in TypeScript
- Don't create overly complex components
- Don't forget error handling
- Don't skip tests
- Don't use inline styles when design tokens exist

---

## Troubleshooting

### Cannot fetch Figma design?
- Check `.claude/mcp.json` has figma-mcp configured with valid access token
- Verify Figma URL format is correct
- Ensure you have access permissions to the Figma file
- Restart Claude Code to reload MCP servers

### Design analysis failing?
- Ensure `UI_UX_GUIDELINES.md` is accessible via MCP
- Check component requirements are clear
- Verify mockup link is accessible

### Component generation issues?
- Ensure `fit-mobile` skill is loaded
- Check target directory exists
- Verify module structure matches expected pattern

---

## Support

### Documentation
- [UI/UX Guidelines](../fit-common/docs/UI_UX_GUIDELINES.md)
- [Coding Guidelines](../fit-common/docs/CODING_GUIDELINES.md)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)

### Tools
- [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Changelog

- **2026-02-16:** Updated to Figma-first workflow
  - Replaced Stitch with Figma MCP integration
  - Streamlined to 3-step workflow
  - Direct design fetch from Figma
- **2026-02-15:** Initial workflow creation
  - Created UI/UX guidelines
  - Automated workflow from design to implementation

---

**Last Updated:** 2026-02-16
**Owner:** ConnectHealth Mobile Team
