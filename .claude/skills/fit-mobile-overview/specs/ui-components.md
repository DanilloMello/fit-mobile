# UI Components

> Atomic Design rules, component patterns, typography tokens, screen layouts, accessibility, animations, and performance.

---

## 1. Atomic Design

### 1.1 Hierarchy

| Level | Where | Rule |
|-------|-------|------|
| **Atom** | `libs/shared/ui/src/components/atoms/` | Primitive, zero business logic. Only in `shared/ui`. |
| **Molecule** | `libs/{module}/ui/src/components/molecules/` | Composes atoms into a functional unit. May have local UI state. |
| **Organism** | `libs/{module}/ui/src/components/organisms/` | Self-contained section. May accept domain-shaped props. |
| **Screen/Page** | `apps/mobile/src/app/` | Expo Router file. Fetches data via hooks and composes organisms. |

Templates are not used — Expo Router layouts (`_layout.tsx`) fill that role.

### 1.2 Placement decision tree

```
Is it a single, indivisible UI element (button, icon, badge, input)?
  → Atom (shared/ui only)

Does it combine 2+ atoms into one functional unit (labeled input, list item, card)?
  → Molecule

Does it combine molecules/atoms into a complete UI section (form, list, header)?
  → Organism

Does it fetch data and render a full screen?
  → Screen (apps/mobile/src/app/)
```

### 1.3 Folder structure

```
libs/shared/ui/src/components/
├── atoms/
│   ├── Button.tsx
│   ├── Icon.tsx
│   ├── Skeleton.tsx
│   └── index.ts
├── molecules/
│   ├── Card.tsx
│   ├── InputField.tsx
│   ├── ListItem.tsx
│   └── index.ts
└── organisms/
    ├── EmptyState.tsx
    ├── ErrorState.tsx
    └── index.ts

libs/client/ui/src/components/
├── molecules/
│   ├── ClientCard.tsx
│   └── index.ts
└── organisms/
    ├── ClientList.tsx
    └── index.ts
```

Domain libs (`client`, `identity`, `training`) start at **molecules** — atoms always live in `shared/ui`.

### 1.4 Exports (barrel pattern)

```typescript
// libs/shared/ui/src/components/atoms/index.ts
export { Button } from './Button';
export { Icon } from './Icon';
export { Skeleton } from './Skeleton';

// libs/shared/ui/src/index.ts — re-export all levels
export * from './components/atoms';
export * from './components/molecules';
export * from './components/organisms';
export * from './tokens';
```

Import via the module alias — never use deep relative paths across libs:

```typescript
import { Button, Card, EmptyState } from '@connecthealth/shared/ui';
import { ClientCard } from '@connecthealth/client/ui';
```

---

## 2. Typography Tokens

```typescript
// libs/shared/ui/src/tokens/typography.ts
export const typography = {
  h1:       { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
  h2:       { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  h3:       { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  body:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption:  { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  small:    { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};
```

System fonts only — no custom fonts:
- iOS: `SF Pro` (automatic)
- Android: `Roboto` (automatic)

---

## 3. Component Patterns

### 3.1 Button (Atom)

```typescript
// libs/shared/ui/src/components/atoms/Button.tsx
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../tokens';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function Button({ title, variant = 'primary', isLoading, disabled, onPress }: ButtonProps) {
  const isDisabled = disabled || isLoading;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button, styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { ...typography.bodyBold, color: colors.white },
  primaryText: { color: colors.white },
  secondaryText: { color: colors.white },
  outlineText: { color: colors.primary },
  textText: { color: colors.primary },
});
```

### 3.2 Card (Molecule)

```typescript
// libs/shared/ui/src/components/molecules/Card.tsx
import { View, StyleSheet, Pressable, Platform } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, onPress, variant = 'default' }: CardProps) {
  const Component = onPress ? Pressable : View;
  return (
    <Component
      style={[styles.card, styles[variant]]}
      onPress={onPress}
      {...(onPress && { accessibilityRole: 'button', accessibilityHint: 'Double tap to open' })}
    >
      {children}
    </Component>
  );
}
```

### 3.3 Input (Atom)

```typescript
// libs/shared/ui/src/components/atoms/Input.tsx
interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
}
// Uses TextInput with label, error/helper text, and accessibilityLabel
```

### 3.4 ListItem (Molecule)

```typescript
// libs/shared/ui/src/components/molecules/ListItem.tsx
interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}
// Uses Pressable with flexDirection: 'row', minHeight: 60
```

---

## 4. Screen Layouts

### 4.1 Basic Screen

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@connecthealth/shared/ui/tokens';

export default function ExampleScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Content here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.gray[50] },
  scroll: { flex: 1 },
  content: { padding: spacing.md },
});
```

### 4.2 List Screen

```typescript
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListScreen() {
  const { data, isLoading } = useData();
  if (isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItem title={item.name} subtitle={item.description} />}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}
```

### 4.3 Tab Bar Layout

```typescript
// apps/mobile/src/app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray[500],
      tabBarStyle: { height: Platform.select({ ios: 80, android: 60 }), paddingBottom: Platform.select({ ios: 20, android: 8 }) },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      {/* Other tabs */}
    </Tabs>
  );
}
```

---

## 5. Mobile-Specific Considerations

- **Minimum touch target:** 44x44pt (iOS HIG / Android Material), optimal 48x48pt
- **Safe areas:** Always use `SafeAreaView` or `useSafeAreaInsets` — respect notches, home indicators, status bars
- **Platform shadows:** iOS uses `shadowColor/shadowOffset/shadowOpacity/shadowRadius`, Android uses `elevation`

---

## 6. Accessibility

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Save plan"
  accessibilityHint="Double tap to save your training plan"
  accessibilityState={{ disabled: isSaving }}
  onPress={handleSave}
>
  <Text>Save</Text>
</Pressable>
```

Checklist:
- All interactive elements have descriptive labels
- Roles are correct (button, link, header)
- Navigation order is logical
- Forms are labeled, errors are announced

---

## 7. Animations

```typescript
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0, { duration: 250 }),
  transform: [{ scale: withTiming(isPressed ? 0.95 : 1, { duration: 150 }) }],
}));
```

Always respect reduced motion:
```typescript
import { AccessibilityInfo } from 'react-native';
const [reducedMotion, setReducedMotion] = useState(false);
useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion); }, []);
```

---

## 8. Performance

- Use `FlatList`, not `ScrollView` + `.map()` for lists
- Performance props: `removeClippedSubviews`, `maxToRenderPerBatch={10}`, `windowSize={10}`
- Memoize list items with `React.memo`
- Use `expo-image` instead of `Image` for better caching: `<Image source={{ uri }} contentFit="cover" cachePolicy="memory-disk" />`

---

## 9. Common State Patterns

### Empty State
```typescript
<View style={styles.empty}>
  <Icon name="inbox" size={48} color={colors.gray[400]} />
  <Text style={styles.emptyTitle}>No clients yet</Text>
  <Text style={styles.emptyDescription}>Create your first client to get started</Text>
  <Button title="Add Client" onPress={handleAdd} />
</View>
```

### Loading State
```typescript
{isLoading ? <Skeleton width="100%" height={80} /> : <Content />}
```

### Error State
```typescript
<View style={styles.error}>
  <Icon name="alert-circle" size={48} color={colors.error} />
  <Text style={styles.errorTitle}>Unable to load data</Text>
  <Button title="Try Again" onPress={handleRetry} />
</View>
```
