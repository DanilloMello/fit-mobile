---
name: ui-workflow
description: UI screen creation workflow from Figma mockup to React Native component
---

# UI Screen Workflow

> Complete workflow for creating UI screens from Figma designs to production-ready React Native components.

---

## Overview

This workflow manages the complete UI screen creation process using Figma designs with component reusability:

```
┌──────────────────────┐
│  UI Screen Workflow  │
└──────────┬───────────┘
           │
   ┌───────┴───────┬─────────────┬──────────────┐
   │               │             │              │
   ▼               ▼             ▼              ▼
┌────────┐  ┌─────────────┐  ┌────────┐  ┌──────────┐
│  Get   │  │   Check     │  │Analyze │  │  Create  │
│ Figma  │  │  Existing   │  │ Mockup │  │Component │
│ Mockup │  │ Components  │  │        │  │          │
└────────┘  └─────────────┘  └────────┘  └──────────┘
   │               │             │              │
   └───────────────┴─────────────┴──────────────┘
              Workflow Steps (NX Reusability)
```

---

## Workflow Steps

### Step 1: Get Mockup from Figma

**Action:** Fetch design from Figma using figma-mcp

**Process:**
1. Check if user provided Figma URL
2. If not provided, ask user for Figma file/node URL
3. Use `get_code` tool from figma-mcp to fetch design specs
4. Use `create_design_system_rules` if design system needs to be generated/updated

**Required Information:**
- Figma file URL or node URL
- Access token (if not configured in MCP)

**Output:**
- Design specifications
- Component structure
- Design tokens (colors, spacing, typography)
- Assets references

**Figma MCP Tools Used:**
- `get_code` - Fetch design specifications and component details
- `create_design_system_rules` - Generate design system rules if needed

---

### Step 2: Check for Existing Components (NX Reusability)

**Action:** Analyze Figma design to identify reusable components from NX repository

**Process:**
1. Break down Figma design into component parts (buttons, cards, inputs, etc.)
2. Search NX repository for existing matching components:
   - Check `libs/shared/ui/src/components/` for shared components
   - Check `libs/{module}/ui/src/components/` for module-specific components
   - Use Glob to find similar component names
   - Read component files to verify functionality match
3. Create component mapping:
   - **Reuse:** Components that exist and match requirements
   - **Extend:** Components that need minor modifications
   - **Create:** New components not in repository

**Search Locations (in order of preference):**
```
1. libs/shared/ui/src/components/**/*.tsx    (Highest priority - shared)
2. libs/{module}/ui/src/components/**/*.tsx  (Module-specific)
3. apps/mobile/src/components/**/*.tsx       (App-level components)
```

**Decision Criteria:**
- ✅ **Reuse if:** Component exists with 80%+ functionality match
- ⚠️ **Extend if:** Component exists but needs props/styling adjustments
- 🆕 **Create if:** No matching component or <50% functionality match

**Output:**
- Component reusability report
- List of components to reuse (with import paths)
- List of components to create
- Recommended NX lib location for new components

**Important:** Every new component MUST be created in a reusable NX library (`libs/`), never in `apps/` directory.

---

### Step 3: Analyze Mockup

**Delegate to:** `analyze-mockup` skill

**What it does:**
- Validates design against UI/UX guidelines
- Checks accessibility (WCAG 2.1 AA)
- Verifies domain alignment
- Ensures React Native feasibility
- Generates analysis report

**Input:**
- Figma design specifications
- Design system context

**Output:**
- Analysis report with checklist
- Recommendations
- Implementation notes
- Accessibility validation

**Wait for user approval before Step 4**

---

### Step 4: Generate Component

**Delegate to:** `create-component` skill

**What it does:**
- Determines component location
- Generates React Native component
- Adds TypeScript interfaces
- Implements accessibility features
- Applies design tokens from Figma
- Creates tests
- Updates exports

**Input:**
- Approved mockup analysis
- Figma design specifications

**Output:**
- Component file(s)
- Test file(s)
- Updated index.ts
- Documentation

---

## Usage Instructions

### For AI Agent:

**When user requests:**
- "Create UI screen from Figma"
- "Implement [ScreenName] from Figma design"
- "Build screen from [Figma URL]"

**Then:**
1. **Acknowledge request**
2. **Start at Step 1** (get Figma mockup)
   - If Figma URL provided: fetch design using `get_code`
   - If no URL: ask user for Figma URL using AskUserQuestion
   - Use `create_design_system_rules` if design system generation needed
3. **Execute Step 2** (check existing components)
   - Break down design into component parts
   - Search NX repository (libs/shared/ui, libs/{module}/ui)
   - Create reusability mapping (reuse/extend/create)
   - Present findings to user
4. **Execute Step 3** (analyze mockup)
   - Delegate to `/analyze-mockup` skill
   - Wait for user approval
5. **Execute Step 4** (generate component)
   - Delegate to `/create-component` skill
   - Ensure new components go to NX libs, not apps
6. **Document all decisions**

---

## Figma Integration

### Required MCP Server
Add to `.claude/mcp.json`:
```json
{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_ACCESS_TOKEN"
      }
    }
  }
}
```

### Figma URL Formats

**File URL:**
```
https://www.figma.com/file/{file-key}/{file-name}
```

**Node URL (specific frame/component):**
```
https://www.figma.com/file/{file-key}/{file-name}?node-id={node-id}
```

**Design URL:**
```
https://www.figma.com/design/{file-key}/{file-name}?node-id={node-id}
```

---

## Specialized Skills

### analyze-mockup
**Purpose:** Validate design against guidelines
**Input:** Figma design specifications
**Output:** Analysis report with recommendations

### create-component
**Purpose:** Generate React Native component
**Input:** Approved mockup analysis + Figma specs
**Output:** Component implementation with tests

---

## Guidelines Reference

> **Central Authority:** This section is the single source of truth for all UI/UX guidelines and when to use them.
> Guidelines are loaded on-demand when specialized skills are called.

### Platform-Wide Guidelines (via `fit-mobile-docs` MCP)

**Location:** `fit-common/docs/` (accessed via MCP)

#### DESIGN_SYSTEM.md
**Contains:**
- Design principles (clarity, efficiency, consistency, accessibility)
- Color system (primary: #007AFF, secondary: #5856D6, semantic colors)
- Typography scale (h1-h3, body, caption, small)
- Spacing system (8pt grid: 4, 8, 16, 24, 32, 48px)
- Iconography (sizes: 16, 24, 32, 48px)
- Layout & grid
- Accessibility standards (WCAG 2.1 AA)
- Content guidelines (tone, labels, errors)
- Component states (default, hover, focus, active, disabled, loading, error)
- Animation principles (150ms fast, 250ms default, 400ms slow)
- Data visualization

**Used by:**
- Step 2 (Analyze Mockup) - To validate color, typography, spacing compliance
- Step 3 (Generate Component) - To apply design tokens

**When to load:**
- Step 2 (Analyze Mockup) - Load for validation
- Step 3 (Generate Component) - Load for implementation

---

#### DOMAIN_SPEC.md
**Contains:**
- Bounded contexts (identity, client, training)
- Entities (User, Client, Plan, Exercise, etc.)
- Value objects (ClientProfile, etc.)
- Enums (Gender, Goal, PlanType, MuscleGroup, Equipment)
- Business rules
- API standards (headers, response format, error codes)

**Used by:**
- Step 2 (Analyze Mockup) - To validate domain alignment
- Step 3 (Generate Component) - To map entity fields to props

**When to load:**
- Step 2 (Analyze Mockup) - Load for domain validation
- Step 3 (Generate Component) - Load for entity mapping

---

#### PRD.md
**Contains:**
- Product vision
- Feature requirements (FR-001 to FR-032)
- Non-functional requirements (performance, security)
- Out of scope items

**Used by:**
- Step 2 (Analyze Mockup) - To validate requirements met

**When to load:**
- Step 2 (Analyze Mockup) - Load for requirements validation

---

#### CODING_GUIDELINES.md
**Contains:**
- General principles (DDD, single responsibility, testability)
- fit-api guidelines (Java/Spring patterns)
- fit-mobile guidelines (React Native patterns)
- Cross-project rules (API contract sync, commit format)
- Pre-push checklist

**Used by:**
- Step 2 (Analyze Mockup) - To check code standards alignment
- Step 3 (Generate Component) - To follow coding conventions

**When to load:**
- Step 2 (Analyze Mockup) - Load for code standards
- Step 3 (Generate Component) - Load for implementation patterns

---

### Mobile-Specific Guidelines (fit-mobile local)

**Location:** `fit-mobile/docs/`

#### UI_PATTERNS.md
**Contains:**
- Mobile-specific considerations (touch 44x44pt, safe areas, gestures)
- Font implementation (iOS: SF Pro, Android: Roboto)
- Component patterns with code (Button, Card, Input, ListItem)
- Screen layouts (Basic, List, with SafeAreaView)
- Navigation patterns (Tab Bar, Header)
- Platform-specific patterns (iOS swipe, Android FAB)
- Animations (react-native-reanimated, reduced motion)
- Performance optimizations (FlatList, Images)
- Accessibility implementation (VoiceOver, TalkBack)
- Testing examples (React Testing Library)

**Used by:**
- Step 2 (Analyze Mockup) - To validate React Native feasibility
- Step 3 (Generate Component) - To implement with correct patterns

**When to load:**
- Step 2 (Analyze Mockup) - Load for RN validation
- Step 3 (Generate Component) - Load for implementation

---

#### UI_COMPONENT_WORKFLOW_GUIDE.md
**Contains:**
- User-facing workflow guide
- Step-by-step process
- Examples with deliverables
- Design system quick reference
- Accessibility checklist
- Troubleshooting

**Used by:**
- User reference (not loaded by skills)
- Contains pointers to this skill

**When to reference:**
- User wants to understand workflow
- User has questions about process

---

### Loading Strategy by Workflow Step

```
Step 1: Get Figma Mockup
├─ Use Figma MCP tools:
│  ├─ get_code              (fetch design specifications)
│  └─ create_design_system_rules (generate design system if needed)
└─ Ask for Figma URL if not provided

Step 2: Check Existing Components (NX Reusability)
├─ Search NX repository:
│  ├─ Glob libs/shared/ui/src/components/**/*.tsx
│  ├─ Glob libs/{module}/ui/src/components/**/*.tsx
│  └─ Read matching components for verification
├─ Analyze component patterns
└─ Generate reusability report (reuse/extend/create)

Step 3: Analyze Mockup (analyze-mockup skill)
├─ Load from MCP:
│  ├─ DESIGN_SYSTEM.md     (validation criteria)
│  ├─ DOMAIN_SPEC.md       (domain alignment)
│  ├─ PRD.md               (requirements validation)
│  └─ CODING_GUIDELINES.md (code standards)
└─ Load from local:
   └─ UI_PATTERNS.md       (RN feasibility)

Step 4: Generate Component (create-component skill)
├─ Load from MCP:
│  ├─ DOMAIN_SPEC.md       (entity mapping)
│  └─ CODING_GUIDELINES.md (implementation patterns)
├─ Load from local:
│  └─ UI_PATTERNS.md       (React Native code patterns)
└─ Apply reusability decisions from Step 2
```

---

### Quick Reference: What Each Guideline Provides

| Guideline | Colors | Typography | Spacing | Accessibility | Code | Domain |
|-----------|--------|------------|---------|---------------|------|--------|
| **DESIGN_SYSTEM.md** | ✓ | ✓ | ✓ | ✓ | - | - |
| **UI_PATTERNS.md** | - | Code | Code | Code | ✓ | - |
| **DOMAIN_SPEC.md** | - | - | - | - | - | ✓ |
| **PRD.md** | - | - | - | - | - | - |
| **CODING_GUIDELINES.md** | - | - | - | - | ✓ | - |

---

### Deprecation Notice

**OLD:** `UI_UX_GUIDELINES.md` (fit-common)
- **Status:** Deprecated as of 2026-02-15
- **Replaced by:** DESIGN_SYSTEM.md + UI_PATTERNS.md
- **File contains:** Deprecation notice with redirect

**Do NOT load** `UI_UX_GUIDELINES.md` - it's a pointer document only.

---

## Example Execution

**User Request:** "Create LoginScreen from Figma"

**Workflow Actions:**

1. **Get Figma Mockup**
   - Check if Figma URL provided
   - If not: Ask user for URL
   - Use `get_code` to fetch design specs
   - Extract colors, typography, spacing, layout
   - Identified components: Button, Input, Logo, Card

2. **Check Existing Components**
   - Search NX repository:
     - ✅ Found: `libs/shared/ui/src/components/Button.tsx` (reuse)
     - ✅ Found: `libs/shared/ui/src/components/Input.tsx` (reuse)
     - ❌ Not Found: Logo component (create new in `libs/shared/ui`)
     - ✅ Found: `libs/shared/ui/src/components/Card.tsx` (reuse)
   - **Reusability Report:**
     - Reuse: 3 components (Button, Input, Card)
     - Create: 1 component (Logo)
   - *Present to user for approval*

3. **Delegate to analyze-mockup skill**
   ```
   /analyze-mockup
   Input: Figma design specs, design system context
   Output: Analysis report (validation results)
   ```
   *Wait for approval*

4. **Delegate to create-component skill**
   ```
   /create-component
   Input: Approved analysis + Figma specs + reusability report
   Output:
   - libs/identity/ui/src/screens/LoginScreen.tsx (composing existing components)
   - libs/shared/ui/src/components/Logo.tsx (new reusable component)
   - libs/shared/ui/src/components/Logo.test.tsx
   - Updated exports in both libs
   ```

**Result:** Production-ready screen maximizing component reuse (75% reused)

---

## Decision Matrix

| Scenario | Action |
|----------|--------|
| No Figma URL provided | Ask user for URL using AskUserQuestion |
| Figma specs don't match design system | Use create_design_system_rules to align |
| Mockup analysis fails | Request design changes or proceed with warnings |
| Component generation fails | Fix issues, retry Step 3 |
| User requests changes mid-workflow | Go back to relevant step |

---

## Best Practices

### Do's ✅
- Always fetch latest design from Figma
- Use `get_code` to get accurate design specifications
- **ALWAYS check for existing components in NX libs before creating new ones**
- Search `libs/shared/ui` first for maximum reusability
- Create all new components in NX libs (`libs/`), never in `apps/`
- Compose screens from reusable components
- Validate design against design system
- Wait for user approval at checkpoints
- Document component reusability decisions
- Use specialized skills for their specific tasks

### Don'ts ❌
- Don't skip Figma URL validation
- Don't proceed without design specs
- Don't skip component reusability check (Step 2)
- **Don't create components in `apps/` directory - always use `libs/`**
- **Don't create duplicate components - search NX repo first**
- Don't ignore existing components that could be reused
- Don't ignore design system mismatches
- Don't assume design details without fetching from Figma

---

## NX Reusability Architecture

### Component Placement Strategy

**Shared Components** (`libs/shared/ui/src/components/`)
- Use for: Components used across multiple modules
- Examples: Button, Input, Card, Avatar, Badge, Modal
- Highest priority for reuse

**Module-Specific Components** (`libs/{module}/ui/src/components/`)
- Use for: Components specific to a domain module
- Examples: ClientCard, ExerciseForm, WorkoutTimer
- Reusable within module

**Screen Components** (`libs/{module}/ui/src/screens/`)
- Use for: Full screen implementations
- Compose from shared + module components
- Not directly reusable

**NEVER Create in Apps** (`apps/mobile/src/`)
- App directory is for app configuration only
- All UI components must live in `libs/`

### Component Search Priority

1. **Check `libs/shared/ui/src/components/`** - Highest reuse potential
2. **Check `libs/{module}/ui/src/components/`** - Module-specific reuse
3. **Create in appropriate lib** - Never in apps

---

## Integration with Project

This workflow works within the fit-mobile NX monorepo structure:

```
fit-mobile/
├── .claude/
│   ├── mcp.json                     ← Configure figma-mcp here
│   └── skills/
│       ├── ui-workflow/             ← This skill (orchestrator)
│       ├── analyze-mockup/          ← Design validation
│       └── create-component/        ← Component generation
│
├── docs/
│   ├── UI_PATTERNS.md               ← Mobile patterns
│   └── UI_COMPONENT_WORKFLOW_GUIDE.md
│
├── libs/
│   ├── shared/ui/src/
│   │   ├── components/              ← **Shared components (check first)**
│   │   └── index.ts                 ← Export all shared UI
│   │
│   └── {module}/ui/src/
│       ├── screens/                 ← Screen compositions
│       ├── components/              ← Module-specific components
│       └── index.ts                 ← Export module UI
│
└── apps/mobile/                     ← **NO components here**
    └── src/app/                     ← App config only
```

---

## Troubleshooting

**Issue:** Figma MCP not available
**Solution:** Check `.claude/mcp.json` includes figma-mcp server with valid access token

**Issue:** Cannot fetch Figma design
**Solution:** Verify Figma URL format and access permissions

**Issue:** Design system mismatch
**Solution:** Use `create_design_system_rules` to generate/update design system

**Issue:** Analysis fails
**Solution:** Verify all guidelines are accessible via MCP

**Issue:** Component generation wrong location
**Solution:** Check module structure matches expected pattern

---

**Last Updated:** 2026-02-16
**Version:** 3.1 (Figma-first workflow + NX component reusability)
