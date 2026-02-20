---
name: analyze-mockup
description: Validate UI mockups against design system, accessibility standards, and domain requirements
---

# Analyze Mockup Skill

> Specialized skill for validating mockups against ConnectHealth guidelines and standards

---

## Purpose

Thoroughly analyze UI mockups to ensure they meet:
- Design system compliance
- Accessibility standards (WCAG 2.1 AA)
- Domain alignment
- UX best practices
- Technical feasibility

---

## Prerequisites

- ✅ Figma design specifications retrieved
- ✅ Access to `fit-mobile-docs` MCP server

---

## Process

### 1. Load Design & Context

**Use Figma design specifications:**
- Design structure from `get_code`
- Component hierarchy
- Design tokens (colors, spacing, typography)
- Layout and constraints

**Load guidelines via `fit-mobile-docs` MCP:**
- `DESIGN_SYSTEM.md` - Design tokens, accessibility standards
- `DOMAIN_SPEC.md` - Entities, data structure
- `PRD.md` - Feature requirements
- `CODING_GUIDELINES.md` - Code standards

**Load mobile patterns from fit-mobile local:**
- `docs/UI_PATTERNS.md` - React Native implementation patterns

---

### 2. Design System Analysis

#### 2.1 Color Compliance

**Check:**
- ✓ Colors match design system tokens
- ✓ Semantic colors used correctly (success, error, warning)
- ✓ No hardcoded colors (all from design tokens)

**Validate:**
```
Primary: #007AFF (buttons, links, active)
Secondary: #5856D6
Success: #34C759 (confirmations, active status)
Error: #FF3B30 (errors, destructive)
Warning: #FF9500
Grays: #1C1C1E, #8E8E93, #FFFFFF
```

**Report:**
- ✅ Colors used correctly
- ⚠️ Non-standard color detected: [specify]
- ❌ Missing semantic color for [context]

---

#### 2.2 Typography Compliance

**Check:**
- ✓ Font sizes match typography scale
- ✓ Font weights appropriate (400, 600, 700)
- ✓ Line heights correct (1.5x minimum)
- ✓ Text hierarchy clear

**Validate:**
```
h1: 32px/700
h2: 24px/600
h3: 20px/600
body: 16px/400
bodyBold: 16px/600
caption: 14px/400
small: 12px/400
```

**Report:**
- ✅ Typography scale followed
- ⚠️ Non-standard size: [specify]
- ❌ Missing hierarchy: [specify]

---

#### 2.3 Spacing Compliance

**Check:**
- ✓ Spacing uses 8pt grid (4, 8, 16, 24, 32, 48)
- ✓ Padding consistent
- ✓ Margins appropriate
- ✓ Component spacing balanced

**Validate:**
```
xs: 4px, sm: 8px, md: 16px
lg: 24px, xl: 32px, xxl: 48px
```

**Report:**
- ✅ 8pt grid followed
- ⚠️ Non-grid spacing: [specify]
- ❌ Inconsistent spacing: [specify]

---

#### 2.4 Component Patterns

**Check:**
- ✓ Border radius: 8px (buttons) or 12px (cards)
- ✓ Shadows: iOS 0.1 opacity, Android elevation 3
- ✓ Standard component patterns used
- ✓ Consistent with existing components

**Report:**
- ✅ Component patterns match design system
- ⚠️ Non-standard pattern: [specify]
- ❌ Inconsistent with existing: [specify]

---

### 3. Accessibility Analysis (WCAG 2.1 AA)

#### 3.1 Color Contrast

**Check ratios:**
- ✓ Normal text (< 18px): 4.5:1 minimum
- ✓ Large text (≥ 18px): 3:1 minimum
- ✓ UI components: 3:1 minimum
- ✓ Not relying on color alone

**Validate:**
- Primary (#007AFF) on white: 4.5:1 ✓
- Gray-500 (#8E8E93) on white: 4.5:1 ✓
- Success (#34C759) on white: 3.1:1 ✓
- Error (#FF3B30) on white: 4.5:1 ✓

**Report:**
- ✅ All contrast ratios pass
- ⚠️ Borderline contrast: [specify ratio]
- ❌ Fails contrast: [specify combination]

---

#### 3.2 Touch Targets

**Check:**
- ✓ Interactive elements ≥ 44x44pt
- ✓ Spacing between targets ≥ 8px
- ✓ Full hit areas (not just visual size)
- ✓ No overlapping touch zones

**Report:**
- ✅ All touch targets adequate
- ⚠️ Small target: [specify size]
- ❌ Too small: [specify element]

---

#### 3.3 Accessibility Labels

**Check:**
- ✓ All interactive elements have labels
- ✓ Labels are descriptive ("Save plan" not "Save")
- ✓ Roles defined (button, link, etc.)
- ✓ States indicated (disabled, selected)

**Required attributes:**
```typescript
accessibilityLabel="Descriptive action"
accessibilityRole="button"
accessibilityHint="What happens" // optional
accessibilityState={{ disabled, selected }}
```

**Report:**
- ✅ All elements labeled
- ⚠️ Label could be more specific: [specify]
- ❌ Missing label: [specify element]

---

#### 3.4 Visual Indicators

**Check:**
- ✓ Icons accompany color coding
- ✓ Error states have text messages
- ✓ Loading states are clear
- ✓ Focus states visible

**Report:**
- ✅ Visual indicators adequate
- ⚠️ Could improve: [specify]
- ❌ Missing indicator: [specify state]

---

### 4. Domain Alignment

#### 4.1 Data Mapping

**Check against DOMAIN_SPEC.md:**
- ✓ Entity fields correctly represented
- ✓ Required fields shown
- ✓ Optional fields handled
- ✓ Data types appropriate
- ✓ Enums match specification

**Example validation:**
```
Entity: Client
- name: string (required) → Displayed ✓
- email: string (optional) → Conditional rendering ✓
- active: boolean → Badge (success/error) ✓
- profile: ClientProfile → Expandable section ✓
```

**Report:**
- ✅ Domain mapping correct
- ⚠️ Missing optional field: [specify]
- ❌ Incorrect data type: [specify]

---

#### 4.2 Business Rules

**Check:**
- ✓ Business rules reflected in UI
- ✓ Permissions considered
- ✓ Validation rules apparent
- ✓ Workflows logical

**Report:**
- ✅ Business rules aligned
- ⚠️ Rule not visible: [specify]
- ❌ Violates rule: [specify]

---

### 5. UX Analysis

#### 5.1 User Flow

**Check:**
- ✓ Logical navigation
- ✓ Clear call-to-action
- ✓ Minimal steps to complete task
- ✓ Expected patterns (iOS/Android)

**Report:**
- ✅ User flow is clear
- ⚠️ Could simplify: [specify]
- ❌ Confusing flow: [specify]

---

#### 5.2 Feedback & States

**Check all states:**
- ✓ Default state
- ✓ Loading state (spinner/skeleton)
- ✓ Error state (message + recovery)
- ✓ Empty state (message + action)
- ✓ Success state (confirmation)

**Report:**
- ✅ All states designed
- ⚠️ State could be clearer: [specify]
- ❌ Missing state: [specify]

---

#### 5.3 Error Handling

**Check:**
- ✓ Error messages are helpful
- ✓ Recovery actions provided
- ✓ Validation is inline
- ✓ No technical jargon

**Report:**
- ✅ Error handling appropriate
- ⚠️ Message could be clearer: [specify]
- ❌ No recovery action: [specify]

---

### 6. Responsive Design

#### 6.1 Screen Sizes

**Check:**
- ✓ Small (< 375px): Content fits, readable
- ✓ Medium (375-414px): Optimal layout
- ✓ Large (> 414px): Utilizes space

**Report:**
- ✅ Responsive across sizes
- ⚠️ Tight on small screens: [specify]
- ❌ Breaks on [size]: [specify]

---

#### 6.2 Orientation

**Check:**
- ✓ Portrait: Primary design
- ✓ Landscape: Considered (if applicable)

**Report:**
- ✅ Orientation handled
- ⚠️ Landscape not optimal
- ❌ Breaks in landscape

---

### 7. Technical Feasibility

#### 7.1 React Native Compatibility

**Check:**
- ✓ Components exist in RN
- ✓ Patterns implementable
- ✓ Performance considerations
- ✓ No web-only features

**Report:**
- ✅ Technically feasible
- ⚠️ May need custom component: [specify]
- ❌ Not implementable: [specify]

---

#### 7.2 Dependencies

**Check:**
- ✓ No new major dependencies
- ✓ Existing libraries can handle
- ✓ Platform APIs available

**Report:**
- ✅ Uses existing stack
- ⚠️ May need library: [specify]
- ❌ Requires new dependency: [specify]

---

### 8. Generate Analysis Report

**Create report:**
`docs/wireframes/{module}/{component-name}-analysis.md`

**Template:**
```markdown
# [ComponentName] Analysis Report

**Component:** [Name]
**Module:** [Module]
**Analyzed:** [Date]
**Analyst:** Claude Sonnet 4.5
**Status:** [Approved | Needs Revision | Rejected]

---

## Executive Summary

[Brief overview of findings]

**Overall Score:** [X/10]

**Recommendation:** [Proceed to implementation | Revise design | Rethink approach]

---

## Design System Compliance

### Colors ✅ | ⚠️ | ❌
- [Finding 1]
- [Finding 2]

### Typography ✅ | ⚠️ | ❌
- [Finding 1]
- [Finding 2]

### Spacing ✅ | ⚠️ | ❌
- [Finding 1]
- [Finding 2]

### Components ✅ | ⚠️ | ❌
- [Finding 1]
- [Finding 2]

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast ✅ | ⚠️ | ❌
- [Ratio checks with specific values]

### Touch Targets ✅ | ⚠️ | ❌
- [Size validations]

### Labels ✅ | ⚠️ | ❌
- [Label completeness]

### Visual Indicators ✅ | ⚠️ | ❌
- [State visibility]

---

## Domain Alignment

### Data Mapping ✅ | ⚠️ | ❌
- [Entity field checks]

### Business Rules ✅ | ⚠️ | ❌
- [Rule compliance]

---

## UX Quality

### User Flow ✅ | ⚠️ | ❌
- [Navigation logic]

### States ✅ | ⚠️ | ❌
- Default: [Status]
- Loading: [Status]
- Error: [Status]
- Empty: [Status]
- Success: [Status]

### Error Handling ✅ | ⚠️ | ❌
- [Message quality]

---

## Responsive Design

### Screen Sizes ✅ | ⚠️ | ❌
- Small (< 375px): [Status]
- Medium (375-414px): [Status]
- Large (> 414px): [Status]

---

## Technical Feasibility

### Implementation ✅ | ⚠️ | ❌
- [Feasibility notes]

### Dependencies ✅ | ⚠️ | ❌
- [Required libraries]

---

## Recommendations

### Required Changes
1. [Critical issue to fix]
2. [Critical issue to fix]

### Suggested Improvements
1. [Nice-to-have enhancement]
2. [Nice-to-have enhancement]

### Implementation Notes
- [Technical consideration 1]
- [Technical consideration 2]

---

## Implementation Readiness

- [ ] Design system compliant
- [ ] Accessibility standards met
- [ ] Domain aligned
- [ ] UX patterns validated
- [ ] Responsive design confirmed
- [ ] Technically feasible

**Ready for implementation:** [Yes | No | With changes]

---

## Next Steps

[If approved]:
- Proceed to create-component skill
- Implement at: libs/{module}/ui/src/components/

[If needs revision]:
- Address required changes
- Re-submit for analysis

[If rejected]:
- Rethink approach
- Consult with user
```

---

### 9. Present Report to User

**Summary for user:**
```
Analysis Complete: [ComponentName]

Overall: [✅ Approved | ⚠️ Needs Changes | ❌ Rejected]

Highlights:
✅ [Positive finding]
✅ [Positive finding]
⚠️ [Warning/suggestion]

[If changes needed]:
Required Changes:
1. [Change 1]
2. [Change 2]

Full report: docs/wireframes/{module}/{component-name}-analysis.md

Ready to proceed? [Yes/No]
```

---

## Analysis Checklist

Use this checklist for every analysis:

### Design System
- [ ] Colors match tokens
- [ ] Typography follows scale
- [ ] Spacing uses 8pt grid
- [ ] Components match patterns
- [ ] Border radius correct
- [ ] Shadows/elevation correct

### Accessibility
- [ ] Color contrast ≥ ratios
- [ ] Touch targets ≥ 44x44pt
- [ ] All elements labeled
- [ ] Roles defined
- [ ] States indicated
- [ ] Visual indicators present

### Domain
- [ ] Entity fields mapped
- [ ] Required fields shown
- [ ] Optional fields handled
- [ ] Data types correct
- [ ] Enums match spec
- [ ] Business rules reflected

### UX
- [ ] User flow logical
- [ ] CTA clear
- [ ] All states designed
- [ ] Error handling helpful
- [ ] Feedback appropriate

### Responsive
- [ ] Small screens work
- [ ] Medium screens optimal
- [ ] Large screens utilize space

### Technical
- [ ] RN compatible
- [ ] No new major deps
- [ ] Performance considered

---

## Scoring Guide

**10/10:** Perfect - no issues
**8-9/10:** Excellent - minor suggestions
**6-7/10:** Good - some improvements needed
**4-5/10:** Needs revision - several issues
**2-3/10:** Major problems - significant rework
**0-1/10:** Reject - fundamental issues

---

## Common Issues & Solutions

### Issue: Low contrast ratio
**Solution:** Use darker gray (gray-600 instead of gray-500) or increase weight

### Issue: Small touch target
**Solution:** Increase padding or add invisible touchable area

### Issue: Missing state
**Solution:** Design loading/error/empty variations

### Issue: Non-standard spacing
**Solution:** Round to nearest 8pt grid value

### Issue: Domain mismatch
**Solution:** Re-read DOMAIN_SPEC.md and adjust fields

---

## Output Deliverables

1. **Analysis Report** (`docs/wireframes/{module}/{component-name}-analysis.md`)
2. **User Summary** (present to user)
3. **Approval Request** (proceed or revise?)

---

**Last Updated:** 2026-02-15
**Version:** 2.0
