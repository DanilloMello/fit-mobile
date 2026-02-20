# UI Patterns (Mobile)
## React Native / Expo Implementation

**Extends:** [DESIGN_SYSTEM.md](../../fit-common/docs/DESIGN_SYSTEM.md)
**Platform:** fit-mobile (React Native, Expo, iOS/Android)

---

## 1. Mobile-Specific Considerations

### 1.1 Touch Interactions
- **Minimum touch target:** 44x44pt (iOS HIG / Android Material)
- **Optimal touch target:** 48x48pt
- **Thumb zones:** Place primary actions in easy-to-reach areas
- **Swipe gestures:** Common for delete, archive, navigate

### 1.2 Platform Guidelines
- **iOS:** Follow [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- **Android:** Follow [Material Design](https://m3.material.io/)
- **Cross-platform:** Adapt UI to feel native on each platform

### 1.3 Safe Areas
- Respect notches, home indicators, status bars
- Use `SafeAreaView` or `useSafeAreaInsets`
- Test on devices with different safe area configurations

---

## 2. Font Implementation

### 2.1 System Fonts
```typescript
// iOS: SF Pro (automatic)
// Android: Roboto (automatic)
// No custom fonts needed - use system default

fontFamily: Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});
```

### 2.2 Typography Tokens
```typescript
// libs/shared/ui/src/tokens/typography.ts
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Usage:
<Text style={typography.body}>Content</Text>
```

---

## 3. Component Patterns

### 3.1 Button

```typescript
// libs/shared/ui/src/components/Button.tsx
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../tokens';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function Button({
  title,
  variant = 'primary',
  isLoading,
  disabled,
  onPress,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
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
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4, // 12px
    paddingHorizontal: spacing.lg,   // 24px
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
    color: colors.white,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  textText: {
    color: colors.primary,
  },
});
```

### 3.2 Card

```typescript
// libs/shared/ui/src/components/Card.tsx
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { colors, spacing } from '../tokens';

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
      {...(onPress && {
        accessibilityRole: 'button',
        accessibilityHint: 'Double tap to open',
      })}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  default: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
});
```

### 3.3 Input

```typescript
// libs/shared/ui/src/components/Input.tsx
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../tokens';

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

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  required,
  disabled,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray[300]}
        editable={!disabled}
        accessibilityLabel={label}
        accessibilityHint={helper}
        accessibilityState={{ disabled }}
      />

      {(error || helper) && (
        <Text style={[styles.helper, error && styles.helperError]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  input: {
    ...typography.body,
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: spacing.sm + 4, // 12px
    backgroundColor: colors.white,
    color: colors.black,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: colors.gray[50],
    color: colors.gray[400],
  },
  helper: {
    ...typography.small,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  helperError: {
    color: colors.error,
  },
});
```

### 3.4 List Item

```typescript
// libs/shared/ui/src/components/ListItem.tsx
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../tokens';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
}: ListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={title}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4, // 12px
    paddingHorizontal: spacing.md,
    minHeight: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  pressed: {
    backgroundColor: colors.gray[50],
  },
  leftIcon: {
    marginRight: spacing.sm + 4, // 12px
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.black,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: spacing.xs / 2, // 2px
  },
  rightIcon: {
    marginLeft: spacing.sm,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## 4. Screen Layouts

### 4.1 Basic Screen

```typescript
// apps/mobile/src/app/(app)/example/index.tsx
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@connecthealth/shared/ui/tokens';

export default function ExampleScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {/* Content here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
});
```

### 4.2 List Screen

```typescript
// apps/mobile/src/app/(app)/example/list.tsx
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@connecthealth/shared/ui/tokens';
import { ListItem, LoadingSpinner } from '@connecthealth/shared/ui';

export default function ListScreen() {
  const { data, isLoading } = useData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={item.description}
            onPress={() => navigate(item.id)}
          />
        )}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingVertical: spacing.sm,
  },
});
```

---

## 5. Navigation Patterns

### 5.1 Tab Bar (Bottom Navigation)

```typescript
// apps/mobile/src/app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors, typography } from '@connecthealth/shared/ui/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarLabelStyle: typography.caption,
        tabBarStyle: {
          height: Platform.select({ ios: 80, android: 60 }),
          paddingBottom: Platform.select({ ios: 20, android: 8 }),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      {/* Other tabs */}
    </Tabs>
  );
}
```

### 5.2 Header

```typescript
// Custom header in screen options
<Stack.Screen
  name="details"
  options={{
    headerTitle: 'Client Details',
    headerStyle: {
      backgroundColor: colors.white,
    },
    headerTintColor: colors.primary,
    headerTitleStyle: typography.h3,
    headerShadowVisible: true,
  }}
/>
```

---

## 6. Platform-Specific Patterns

### 6.1 iOS Specific

```typescript
// Swipe to delete (iOS pattern)
import Swipeable from 'react-native-gesture-handler/Swipeable';

<Swipeable
  renderRightActions={() => (
    <Pressable style={styles.deleteAction} onPress={handleDelete}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  )}
>
  <ListItem {...props} />
</Swipeable>

// Action sheet (iOS pattern)
import * as Haptics from 'expo-haptics';

const showActionSheet = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // Show action sheet
};
```

### 6.2 Android Specific

```typescript
// FAB (Floating Action Button - Android pattern)
import { FAB } from 'react-native-paper';

<FAB
  icon="plus"
  onPress={handleAdd}
  style={styles.fab}
  color={colors.white}
  backgroundColor={colors.primary}
/>

// Elevation instead of shadows
elevation: 3, // Android only
```

---

## 7. Animations

### 7.1 Simple Animations

```typescript
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0, { duration: 250 }),
  transform: [
    { scale: withTiming(isPressed ? 0.95 : 1, { duration: 150 }) },
  ],
}));

<Animated.View style={animatedStyle}>
  {/* Content */}
</Animated.View>
```

### 7.2 Respect Reduced Motion

```typescript
import { AccessibilityInfo } from 'react-native';

const [reducedMotion, setReducedMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
}, []);

const duration = reducedMotion ? 0 : 250;
```

---

## 8. Performance Optimizations

### 8.1 Lists

```typescript
// Use FlatList, not ScrollView + map
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
/>

// Memoize list items
const ListItem = React.memo(({ item }) => {
  return <View>{/* Item content */}</View>;
});
```

### 8.2 Images

```typescript
import { Image } from 'expo-image';

// Use expo-image for better performance
<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

---

## 9. Accessibility Implementation

### 9.1 Screen Reader Support

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

### 9.2 Testing with Screen Readers

- **iOS:** Enable VoiceOver (Settings > Accessibility > VoiceOver)
- **Android:** Enable TalkBack (Settings > Accessibility > TalkBack)

**Test checklist:**
- [ ] All interactive elements have labels
- [ ] Labels are descriptive ("Save plan" not "Save")
- [ ] Roles are correct (button, link, header, etc.)
- [ ] Navigation is logical
- [ ] Forms are properly labeled
- [ ] Errors are announced

---

## 10. Testing

### 10.1 Component Tests

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Test" onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    const { getByRole } = render(
      <Button title="Test" isLoading={true} onPress={() => {}} />
    );

    const button = getByRole('button');
    expect(button.props.accessibilityState.busy).toBe(true);
  });
});
```

---

## 11. Common Patterns Reference

### 11.1 Empty States

```typescript
<View style={styles.empty}>
  <Icon name="inbox" size={48} color={colors.gray[400]} />
  <Text style={styles.emptyTitle}>No clients yet</Text>
  <Text style={styles.emptyDescription}>
    Create your first client to get started
  </Text>
  <Button title="Add Client" onPress={handleAdd} />
</View>
```

### 11.2 Loading States

```typescript
// Skeleton screen
import { Skeleton } from '@connecthealth/shared/ui';

{isLoading ? (
  <Skeleton width="100%" height={80} />
) : (
  <Content />
)}
```

### 11.3 Error States

```typescript
<View style={styles.error}>
  <Icon name="alert-circle" size={48} color={colors.error} />
  <Text style={styles.errorTitle}>Unable to load data</Text>
  <Text style={styles.errorDescription}>{error.message}</Text>
  <Button title="Try Again" onPress={handleRetry} />
</View>
```

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)
- [React Navigation](https://reactnavigation.org/)

---

**Last Updated:** 2026-02-15
**Version:** 1.0
**Extends:** DESIGN_SYSTEM.md (fit-common)
