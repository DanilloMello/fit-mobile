---
name: create-component
description: Generate React Native components from approved mockups with tests and documentation
---

# Create Component Skill

> Specialized skill for generating production-ready React Native components

---

## Purpose

Generate complete, production-ready React Native components from approved mockup analysis, including:
- Component implementation
- TypeScript interfaces
- Accessibility features
- Tests
- Documentation

---

## Prerequisites

- ✅ Mockup analysis approved
- ✅ Analysis report exists
- ✅ Component reusability check completed (Step 2)
- ✅ `fit-mobile` skill patterns loaded
- ✅ Target module structure verified

---

## Process

### 1. Load Context

**Use Figma design specifications and analysis:**
- Design specs from Step 1 (Figma fetch)
- Component reusability report from Step 2 (existing components check)
- Analysis report from Step 3 (analyze-mockup)

**Load project patterns from `fit-mobile` skill:**
- Component structure
- Naming conventions
- File locations
- Import patterns
- Testing patterns

**Load design tokens from analysis:**
- Colors used
- Typography styles
- Spacing values
- Component patterns

---

### 2. Apply Reusability Decisions & Determine Component Location

**First: Check reusability report from Step 2**
- **Reuse:** Import existing component from NX lib
- **Extend:** Consider if component can be made more flexible
- **Create:** Proceed with new component creation

**Component Location Decision (NX Monorepo Structure):**

```
CRITICAL: ALL components MUST be in libs/, NEVER in apps/

Is it shared across modules?
├─ Yes → libs/shared/ui/src/components/{Name}.tsx
└─ No  → Is it domain-specific?
         ├─ Yes → libs/{module}/ui/src/components/{Name}.tsx
         └─ No  → Is it a full screen?
                  └─ Yes → libs/{module}/ui/src/screens/{Name}.tsx
```

**Module mapping:**
- `identity` → Authentication, profile components
- `client` → Client management components
- `training` → Plan, exercise components
- `shared` → **Reusable UI components (Button, Input, Card) - CHECK HERE FIRST**

**NX Reusability Rules:**
1. ✅ **DO:** Create all components in `libs/` directories
2. ✅ **DO:** Prefer `libs/shared/ui` for maximum reusability
3. ✅ **DO:** Compose screens from existing components when possible
4. ❌ **DON'T:** Create components in `apps/mobile/src/` - it's app config only
5. ❌ **DON'T:** Duplicate components - reuse existing ones

---

### 3. Generate Component File

**File structure:**
```typescript
// libs/{module}/ui/src/components/{ComponentName}.tsx

import { ... } from 'react-native';
import { ... } from '@connecthealth/{module}/domain'; // if needed

// ============================================================================
// Types
// ============================================================================

interface {ComponentName}Props {
  /** JSDoc for each prop */
  propName: PropType;
}

// ============================================================================
// Component
// ============================================================================

/**
 * [Brief description]
 *
 * [Longer description if needed]
 *
 * @example
 * <ComponentName prop1="value" onAction={handleAction} />
 */
export function {ComponentName}({
  prop1,
  prop2,
  ...rest
}: {ComponentName}Props) {
  // Hooks
  // State
  // Handlers
  // Effects

  // Render
  return (
    <View style={styles.container}>
      {/* Implementation */}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    // Styles using design tokens
  },
});
```

---

### 4. Apply Design System Tokens

**Colors:**
```typescript
// Use design token values from analysis
color: '#007AFF',        // colors.primary
color: '#34C759',        // colors.success
color: '#1C1C1E',        // colors.black
color: '#8E8E93',        // colors.gray[500]
```

**Typography:**
```typescript
fontSize: 16,            // typography.body
fontWeight: '600',       // typography.bodyBold
fontSize: 14,            // typography.caption
fontSize: 12,            // typography.small
```

**Spacing:**
```typescript
padding: 16,             // spacing.md
marginVertical: 8,       // spacing.sm
borderRadius: 8,         // buttons
borderRadius: 12,        // cards
```

---

### 5. Implement Accessibility

**Required attributes:**
```typescript
// Interactive elements
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Descriptive action"
  accessibilityHint="What happens when pressed" // optional
  accessibilityState={{ disabled: isDisabled }}
>

// Images
<Image
  accessibilityLabel="Description of image"
  accessible={true}
/>

// Text inputs
<TextInput
  accessibilityLabel="Field name"
  accessibilityHint="Format or requirement"
/>
```

**Touch targets:**
```typescript
// Minimum 44x44pt
minHeight: 44,
minWidth: 44,

// Or use hitSlop for visual < 44pt
hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
```

---

### 6. Implement States

**Loading state:**
```typescript
if (isLoading) {
  return <ActivityIndicator size="small" color="#007AFF" />;
}
```

**Error state:**
```typescript
if (error) {
  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{error.message}</Text>
      <Button title="Retry" onPress={handleRetry} />
    </View>
  );
}
```

**Empty state:**
```typescript
if (items.length === 0) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No items yet</Text>
      <Text style={styles.emptyDescription}>
        Create your first item to get started
      </Text>
      <Button title="Add Item" onPress={handleAdd} />
    </View>
  );
}
```

**Conditional rendering:**
```typescript
{isActive && <Badge text="Active" color="success" />}
{email && <Text style={styles.email}>{email}</Text>}
```

---

### 7. Generate Test File

**File:** `{ComponentName}.test.tsx`

**Template:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { {ComponentName} } from './{ComponentName}';

describe('{ComponentName}', () => {
  // Default props
  const defaultProps = {
    prop1: 'value1',
    prop2: 'value2',
  };

  it('renders correctly', () => {
    render(<{ComponentName} {...defaultProps} />);
    expect(screen.getByText('Expected text')).toBeTruthy();
  });

  it('handles press event', () => {
    const onPress = jest.fn();
    render(<{ComponentName} {...defaultProps} onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<{ComponentName} {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error state', () => {
    const error = { message: 'Test error' };
    render(<{ComponentName} {...defaultProps} error={error} />);
    expect(screen.getByText('Test error')).toBeTruthy();
  });

  it('has correct accessibility attributes', () => {
    render(<{ComponentName} {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBeDefined();
  });
});
```

---

### 8. Update Exports

**File:** `libs/{module}/ui/src/index.ts`

**Add export:**
```typescript
export * from './components/{ComponentName}';
```

**If new module, create barrel export:**
```typescript
// libs/{module}/ui/src/index.ts
export * from './components/{Component1}';
export * from './components/{Component2}';
export * from './hooks/use{Hook}';
```

---

### 9. Add Component Documentation

**JSDoc comments:**
```typescript
/**
 * Brief description of component
 *
 * Longer description with usage notes, if needed. Explain
 * any complex behavior or important considerations.
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   onAction={handleAction}
 * />
 * ```
 *
 * @example With optional props
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={someValue}
 *   isLoading={false}
 * />
 * ```
 */
```

**Prop documentation:**
```typescript
interface ComponentProps {
  /** Short description of what this prop does */
  title: string;

  /**
   * Longer description for complex props.
   * Can span multiple lines.
   */
  onPress: () => void;

  /**
   * Optional prop with default value
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
}
```

---

## Component Templates

### Shared UI Component (Button Example)

```typescript
// libs/shared/ui/src/components/Button.tsx
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button text */
  title: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Reusable button component following ConnectHealth design system
 *
 * @example
 * <Button title="Save" variant="primary" onPress={handleSave} />
 */
export function Button({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        styles[variant],
        (disabled || isLoading) && styles.disabled,
      ]}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      {...props}
    >
      <Text style={styles.text}>
        {isLoading ? 'Loading...' : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

### Module Component (Card Example)

```typescript
// libs/client/ui/src/components/ClientCard.tsx
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Client } from '@connecthealth/client/domain';

interface ClientCardProps {
  /** Client entity to display */
  client: Client;
  /** Callback when card is pressed */
  onPress: () => void;
}

/**
 * Card component for displaying client information in lists
 *
 * Shows client name, email (if available), and active status.
 * Tappable to navigate to client details.
 *
 * @example
 * <ClientCard client={client} onPress={() => navigate(`/clients/${client.id}`)} />
 */
export function ClientCard({ client, onPress }: ClientCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${client.props.name}`}
      accessibilityHint="Opens client profile"
    >
      <Text style={styles.name}>{client.props.name}</Text>

      {client.props.email && (
        <Text style={styles.email}>{client.props.email}</Text>
      )}

      <View style={styles.status}>
        <Text
          style={[
            styles.statusText,
            !client.props.active && styles.inactive,
          ]}
        >
          {client.props.active ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 80, // Ensure adequate touch target
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#34C759',
  },
  inactive: {
    color: '#FF3B30',
  },
});
```

---

### Screen Component Example

```typescript
// apps/mobile/src/app/(app)/clients/index.tsx
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useClients } from '@connecthealth/client/ui';
import { ClientCard } from '@connecthealth/client/ui';
import { LoadingSpinner } from '@connecthealth/shared/ui';

/**
 * Client list screen
 *
 * Displays all clients for the authenticated user.
 * Tapping a client navigates to their detail page.
 */
export default function ClientListScreen() {
  const { clients, isLoading } = useClients();
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.props.id}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => router.push(`/clients/${item.props.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    paddingVertical: 8,
  },
});
```

---

## Code Quality Checklist

Before completing, verify:

### TypeScript
- [ ] All props typed with interfaces
- [ ] No `any` types used
- [ ] Enums match DOMAIN_SPEC.md
- [ ] Optional props marked with `?`
- [ ] Default values documented

### React Native
- [ ] Functional components only
- [ ] Hooks used correctly
- [ ] StyleSheet.create for styles
- [ ] No inline styles (except dynamic)
- [ ] Proper key props in lists

### Accessibility
- [ ] All interactive elements have labels
- [ ] Roles assigned correctly
- [ ] Touch targets ≥ 44x44pt
- [ ] Color contrast passes
- [ ] States indicated

### Performance
- [ ] FlatList for long lists
- [ ] Memoization where needed
- [ ] No expensive operations in render
- [ ] Images optimized

### Testing
- [ ] Component renders
- [ ] Event handlers work
- [ ] States display correctly
- [ ] Accessibility attributes present

### Documentation
- [ ] JSDoc on component
- [ ] Props documented
- [ ] Examples provided
- [ ] Complex logic explained

---

## Implementation Notes

### Import Organization
```typescript
// 1. React/React Native
import { View, Text, StyleSheet } from 'react-native';

// 2. External libraries
import { useRouter } from 'expo-router';

// 3. Internal domain
import { Client } from '@connecthealth/client/domain';

// 4. Internal UI
import { Button } from '@connecthealth/shared/ui';

// 5. Hooks
import { useClients } from '@connecthealth/client/ui';

// 6. Types
import type { ClientProps } from './types';
```

### Naming Conventions
- **Components:** PascalCase (`ClientCard`, `Button`)
- **Functions:** camelCase (`handlePress`, `formatDate`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_LENGTH`, `DEFAULT_COLOR`)
- **Types/Interfaces:** PascalCase (`ClientCardProps`, `User`)
- **Files:** kebab-case (`client-card.tsx`, `use-clients.ts`)

### File Organization
```
ComponentName.tsx         # Component implementation
ComponentName.test.tsx    # Tests
ComponentName.types.ts    # Complex types (if needed)
```

---

## Output Deliverables

1. **Component File(s)**
   - `libs/{module}/ui/src/components/{ComponentName}.tsx`
   - Or `apps/mobile/src/app/(app)/{feature}/{name}.tsx`

2. **Test File**
   - `{ComponentName}.test.tsx`

3. **Updated Exports**
   - `libs/{module}/ui/src/index.ts`

4. **Implementation Summary**
   - List of created files
   - Component location
   - Usage examples
   - Any special notes

---

## Validation

After generation, verify:

```bash
# Type check
npx tsc --noEmit

# Lint
npx nx lint {module}-ui

# Tests
npx nx test {module}-ui

# Build
npx nx build {module}-ui
```

---

## Example Output

**User sees:**
```
✅ Component created successfully!

Files created:
- libs/client/ui/src/components/ClientCard.tsx
- libs/client/ui/src/components/ClientCard.test.tsx

Updated:
- libs/client/ui/src/index.ts

Usage:
import { ClientCard } from '@connecthealth/client/ui';

<ClientCard
  client={clientEntity}
  onPress={() => navigate('/clients/123')}
/>

Next steps:
- Run tests: npx nx test client-ui
- Check types: npx tsc --noEmit
- View in app: Import and use in your screen
```

---

**Last Updated:** 2026-02-15
**Version:** 2.0
