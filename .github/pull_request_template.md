## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 🔧 Configuration change
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] 🎨 UI/UX change
- [ ] 🧪 Test update

## Related Issues

<!-- Link to related issues or tickets -->
Closes #

## Changes Made

<!-- List the main changes made in this PR -->

-
-
-

## Pre-Push Validation

- [ ] ✅ TypeScript type check passes (`tsc --noEmit`)
- [ ] ✅ ESLint passes (`nx lint`)
- [ ] ✅ All tests pass (`nx test`)
- [ ] ✅ Build succeeds (`nx build`)
- [ ] ✅ No console.log statements
- [ ] ✅ No debugger statements
- [ ] ✅ No TypeScript `any` types (or justified)
- [ ] ✅ Pre-push hook passes

## API Integration

- [ ] 🔗 Verified endpoints against `API_REGISTRY.md`
- [ ] ✅ API client code matches backend contracts
- [ ] ✅ Error handling for API failures implemented
- [ ] ✅ Loading states handled properly
- [ ] 🔄 TanStack Query used for server state

## UI/UX Changes

- [ ] 📱 Tested on iOS simulator/device
- [ ] 🤖 Tested on Android emulator/device
- [ ] ♿ Accessibility labels added for interactive elements
- [ ] 🎨 Follows design system/style guide
- [ ] 📐 Responsive on different screen sizes
- [ ] 🌓 Works in both light and dark mode (if applicable)

## State Management

- [ ] 🗃️ Zustand for client state (auth, UI state)
- [ ] 🔄 TanStack Query for server state
- [ ] ✅ No prop drilling (max 2 levels)
- [ ] 📦 State properly scoped (local vs global)

## Testing

<!-- Describe the testing performed -->

- [ ] 🧪 Unit tests added/updated
- [ ] 🔗 Component tests added/updated (if applicable)
- [ ] ✅ Test coverage maintained or improved
- [ ] 🎯 Edge cases covered
- [ ] 🔄 User flows tested end-to-end

## Code Quality Checklist

- [ ] 📦 Code follows DDD layered architecture (domain/application/infrastructure/ui)
- [ ] 🎯 Components are small and focused
- [ ] 🔒 Input validation and sanitization
- [ ] 🏷️ Proper error boundaries
- [ ] 📝 Complex logic is documented
- [ ] ♻️ No code duplication
- [ ] 🚫 No commented-out code
- [ ] 🎨 Consistent naming conventions

## Domain Changes

- [ ] 📝 Updated `DOMAIN_SPEC.md` if entities/enums were added/modified
- [ ] 🏗️ Domain entities match backend models
- [ ] 🧪 Domain logic has unit tests

## Performance

- [ ] ⚡ No unnecessary re-renders
- [ ] 📦 Large lists use virtualization (if applicable)
- [ ] 🎨 Images optimized
- [ ] 🔄 Proper memoization (useMemo, useCallback) where needed
- [ ] 📊 No memory leaks (cleanup in useEffect)

## Deployment Notes

<!-- Any special deployment considerations? -->

- [ ] Requires environment variable changes
- [ ] Requires app store update
- [ ] Requires native build (new dependencies)
- [ ] No special deployment steps needed

## Screenshots/Videos

<!-- Add screenshots or video recordings for UI changes -->

### Before


### After


## Device Testing

- [ ] iOS (version: _____)
- [ ] Android (version: _____)
- [ ] Tablet
- [ ] Web (if applicable)

## Additional Context

<!-- Add any other context about the PR here -->

---

## Reviewer Checklist

- [ ] Code follows established patterns and guidelines
- [ ] Tests are adequate and passing
- [ ] API calls verified against API_REGISTRY.md
- [ ] DOMAIN_SPEC.md updated if entities/enums changed
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Error handling is appropriate
- [ ] UI/UX matches design requirements
- [ ] Accessibility considerations addressed
- [ ] Documentation is sufficient

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
