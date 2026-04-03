# Sprint 2: Training — Home Screen + Workout Plan CRUD — fit-mobile

> **Generated:** 2026-04-03
> **Sprint:** 2
> **Project:** fit-mobile
> **Status:** Planned

---

## Sprint Overview

Sprint 2 builds the Home screen and complete Workout Plan CRUD flow on mobile. This includes a reorganized tab bar, the Home screen with a top segment control (Clients | Workouts), the Plan Builder screen (Plan → Mesocycle → Microcycle structure), and the Workout Filler screen (day-level editing with exercises).

All endpoints consumed must exist in `fit-common/docs/API_REGISTRY.md` sections 2.4–2.8.

---

## Progress

| Task | Status | Priority |
|------|--------|----------|
| Task 1: Training domain entities + types | ⬜ Planned | High |
| Task 2: Training application layer (Zustand store) | ⬜ Planned | High |
| Task 3: Training infrastructure (API clients) | ⬜ Planned | High |
| Task 4: Training UI hooks (React Query) | ⬜ Planned | High |
| Task 5: Shared UI molecules | ⬜ Planned | High |
| Task 6: Training UI organisms | ⬜ Planned | High |
| Task 7: Tab bar reorganization | ⬜ Planned | High |
| Task 8: Home screen (segment tabs: Clients \| Workouts) | ⬜ Planned | High |
| Task 9: Plan Builder screen | ⬜ Planned | High |
| Task 10: Workout Filler screen | ⬜ Planned | High |
| Task 11: Day Editor screen | ⬜ Planned | Medium |
| Task 12: New plan flow | ⬜ Planned | High |

---

## Tasks

---

### Task 1: Training Domain Entities + Types

**Priority:** High
**Size:** S
**Depends on:** fit-api Sprint 2 (endpoints implemented)
**Status:** ⬜ Planned

> Rewrite the training domain layer to match the full hierarchy from the API. Remove the outdated placeholder entities.

**Location:** `libs/training/domain/src/`

#### Subtasks

- [ ] **1.1** — `entities/types.ts` — **NEW** — String union types matching backend enums:
  ```typescript
  export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'COMPLETED';
  export type Goal = 'HYPERTROPHY' | 'WEIGHT_LOSS' | 'STRENGTH' | 'CONDITIONING' | 'HEALTH';
  export type PeriodizationType = 'LINEAR' | 'UNDULATING' | 'BLOCK';
  export type MesocycleStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
  export type MuscleGroup = 'CHEST' | 'BACK' | 'SHOULDERS' | 'BICEPS' | 'TRICEPS' | 'FOREARMS' | 'CORE' | 'QUADRICEPS' | 'HAMSTRINGS' | 'GLUTES' | 'CALVES' | 'FULL_BODY';
  export type Equipment = 'BARBELL' | 'DUMBBELL' | 'CABLE' | 'MACHINE' | 'BODYWEIGHT' | 'KETTLEBELL' | 'BAND' | 'OTHER';
  export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  ```

- [ ] **1.2** — `entities/plan.entity.ts` — **REWRITE** — Plan summary (for list view):
  ```typescript
  export interface PlanSummary {
    id: string;
    name: string;
    goal: Goal | null;
    periodizationType: PeriodizationType | null;
    status: PlanStatus;
    statusNote: string | null;
    totalWeeks: number;
    mesocycleCount: number;
    workoutsDone: number;
    workoutsTotal: number;
    clientName: string | null;
    createdAt: string;
    updatedAt: string;
  }
  ```

- [ ] **1.3** — `entities/plan-detail.entity.ts` — **NEW** — Full nested hierarchy:
  ```typescript
  export interface WorkoutDayExercise {
    id: string;
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: string;
    load: string | null;
    restSeconds: number | null;
    orderIndex: number;
  }
  export interface WorkoutDay {
    id: string;
    dayOfWeek: DayOfWeek;
    label: string | null;
    isRestDay: boolean;
    orderIndex: number;
    exerciseCount: number;
    exercises: WorkoutDayExercise[];
  }
  export interface Microcycle {
    id: string;
    weekNumber: number;
    orderIndex: number;
    workoutDays: WorkoutDay[];
  }
  export interface Mesocycle {
    id: string;
    name: string;
    goal: Goal | null;
    orderIndex: number;
    startWeek: number;
    endWeek: number;
    status: MesocycleStatus;
    microcycles: Microcycle[];
  }
  export interface PlanDetail extends PlanSummary {
    description: string | null;
    mesocycles: Mesocycle[];
  }
  ```

- [ ] **1.4** — `entities/exercise.entity.ts` — **REWRITE** — Catalog entity (not per-plan):
  ```typescript
  export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    equipment: Equipment;
    description: string | null;
  }
  ```

- [ ] **1.5** — `index.ts` — Update barrel to export all new types + interfaces

#### Acceptance Criteria

- [ ] No `any` types
- [ ] Types exactly match `API_REGISTRY.md` section 2.4 response shapes
- [ ] Old `Plan extends Entity<PlanProps>` class removed (replaced by interfaces)

---

### Task 2: Training Application Layer

**Priority:** High
**Size:** S
**Depends on:** Task 1
**Status:** ⬜ Planned

> Create `libs/training/application/` NX library with Zustand store for plan builder UI state.

#### Subtasks

- [ ] **2.1** — Create library structure following `libs/identity/application/` pattern:
  - `libs/training/application/project.json`
  - `libs/training/application/tsconfig.json`
  - `libs/training/application/tsconfig.lib.json`
  - `libs/training/application/src/index.ts`

- [ ] **2.2** — `src/store/plan-builder.store.ts` — Zustand store for plan builder UI:
  ```typescript
  interface PlanBuilderState {
    selectedMesocycleId: string | null;
    selectedMicrocycleId: string | null;
    isDirty: boolean;
    setSelectedMesocycle: (id: string | null) => void;
    setSelectedMicrocycle: (id: string | null) => void;
    markDirty: () => void;
    markClean: () => void;
  }
  ```

- [ ] **2.3** — Update `tsconfig.base.json` — add path alias:
  ```json
  "@connecthealth/training/application": ["libs/training/application/src/index.ts"]
  ```

- [ ] **2.4** — Barrel export in `src/index.ts`

#### Acceptance Criteria

- [ ] `import { usePlanBuilderStore } from '@connecthealth/training/application'` works
- [ ] Store is typed with no `any`

---

### Task 3: Training Infrastructure (API Clients)

**Priority:** High
**Size:** M
**Depends on:** Task 1, fit-api Sprint 2
**Status:** ⬜ Planned

> Rewrite `plan.api.ts` and create `exercise.api.ts` to match `API_REGISTRY.md` sections 2.4–2.8.

**Location:** `libs/training/infrastructure/src/api/`

#### Subtasks

- [ ] **3.1** — `plan.api.ts` — **REWRITE** — full API surface:
  - `getAll(params?: { status?: PlanStatus; page?: number; size?: number })` → `GET /plans`
  - `getById(id: string)` → `GET /plans/:id` — returns `PlanDetail`
  - `create(data: CreatePlanData)` → `POST /plans` — returns `PlanDetail`
  - `update(id: string, data: UpdatePlanData)` → `PATCH /plans/:id`
  - `remove(id: string)` → `DELETE /plans/:id`
  - `addMesocycle(planId: string, data: CreateMesocycleData)` → `POST /plans/:id/mesocycles`
  - `updateMesocycle(planId: string, id: string, data: UpdateMesocycleData)` → `PATCH /plans/:planId/mesocycles/:id`
  - `deleteMesocycle(planId: string, id: string)` → `DELETE /plans/:planId/mesocycles/:id`
  - `addWorkoutDay(microcycleId: string, data: CreateWorkoutDayData)` → `POST /microcycles/:id/workout-days`
  - `updateWorkoutDay(id: string, data: UpdateWorkoutDayData)` → `PATCH /workout-days/:id`
  - `deleteWorkoutDay(id: string)` → `DELETE /workout-days/:id`
  - `addExerciseToDay(dayId: string, data: AddExerciseData)` → `POST /workout-days/:id/exercises`
  - `updateDayExercise(id: string, data: UpdateExerciseData)` → `PATCH /workout-day-exercises/:id`
  - `removeDayExercise(id: string)` → `DELETE /workout-day-exercises/:id`
  - `reorderDayExercises(dayId: string, exerciseIds: string[])` → `PUT /workout-days/:id/exercises/reorder`
  - All responses unwrap `response.data.data` (ApiResponse wrapper)

- [ ] **3.2** — `exercise.api.ts` — **NEW**:
  - `getAll(params?: { muscleGroup?: MuscleGroup; equipment?: Equipment })` → `GET /exercises`
  - `search(query: string, limit?: number)` → `GET /exercises/search?q=...`

- [ ] **3.3** — Update `index.ts` to export both API clients + all request/response types

#### Acceptance Criteria

- [ ] All methods match API_REGISTRY exactly (path, method, params)
- [ ] No endpoint not present in API_REGISTRY section 2 is called
- [ ] Request body types defined as interfaces (no `any`)

---

### Task 4: Training UI Hooks (React Query)

**Priority:** High
**Size:** M
**Depends on:** Task 3
**Status:** ⬜ Planned

> Create React Query hooks for plan list, plan detail, mutations, and exercise search.

**Location:** `libs/training/ui/src/hooks/`

#### Subtasks

- [ ] **4.1** — `usePlans.ts` — **REWRITE**:
  ```typescript
  export function usePlans(status?: PlanStatus) {
    // useQuery(['plans', status]) → planApi.getAll({ status })
    // useMutation for createPlan, updatePlan, deletePlan
    // Invalidates ['plans'] on mutation success
    return { plans, isLoading, error, createPlan, updatePlan, deletePlan, refetch };
  }
  ```

- [ ] **4.2** — `usePlanDetail.ts` — **NEW**:
  ```typescript
  export function usePlanDetail(planId: string | null) {
    // useQuery(['plan', planId]) → planApi.getById(planId)
    // enabled: !!planId
    return { plan, isLoading, error, refetch };
  }
  ```

- [ ] **4.3** — `usePlanMutations.ts` — **NEW** — all hierarchy mutations:
  ```typescript
  export function usePlanMutations(planId: string) {
    // addMesocycle, updateMesocycle, deleteMesocycle
    // addWorkoutDay, updateWorkoutDay, deleteWorkoutDay
    // addExercise, updateExercise, removeExercise, reorderExercises
    // All invalidate ['plan', planId] on success
  }
  ```

- [ ] **4.4** — `useExercises.ts` — **NEW**:
  ```typescript
  export function useExercises(muscleGroup?: MuscleGroup) {
    // useQuery(['exercises', muscleGroup]) → exerciseApi.getAll({ muscleGroup })
  }
  export function useExerciseSearch(query: string) {
    // useQuery(['exercises', 'search', query]) → exerciseApi.search(query)
    // enabled: query.length >= 2
    // debounce: 300ms
  }
  ```

- [ ] **4.5** — Update `libs/training/ui/src/index.ts` to export all hooks

#### Acceptance Criteria

- [ ] Hooks follow `useQuery`/`useMutation` patterns from Sprint 1 `auth.api.ts` precedent
- [ ] Mutations invalidate the correct query keys
- [ ] `useExerciseSearch` only fires when `query.length >= 2` (no excessive requests)

---

### Task 5: Shared UI Molecules

**Priority:** High
**Size:** L
**Depends on:** nothing (purely UI)
**Status:** ⬜ Planned

> Create reusable molecule components in `libs/shared/ui/src/components/molecules/`. All components use design tokens from `useThemeColors()`, `typography`, `spacing`, `radii`, `shadows`.

#### Subtasks

- [ ] **5.1** — `SegmentedControl.tsx` — Top tab selector:
  - Props: `segments: string[]`, `selectedIndex: number`, `onChange: (index: number) => void`
  - Animated underline indicator that slides between segments
  - Active segment: `typography.button`, `colors.brand`; inactive: `typography.body`, `colors.textMuted`
  - Full width, border bottom with `colors.border`

- [ ] **5.2** — `FAB.tsx` — Floating action button:
  - Props: `onPress: () => void`, `icon?: string` (Ionicons name, default `add`)
  - Circular, brand color background, white icon, `shadows.brandGlow`
  - Positioned `absolute, bottom: 24, right: 24` by default
  - 56×56 touch target

- [ ] **5.3** — `EmptyState.tsx` — Empty list placeholder:
  - Props: `icon: string`, `title: string`, `subtitle?: string`, `ctaLabel?: string`, `onCta?: () => void`
  - Centered layout, `typography.display` title, `typography.body` subtitle
  - Optional CTA button using brand color

- [ ] **5.4** — `StatusDot.tsx` — Plan status indicator:
  - Props: `status: PlanStatus`, `note?: string`
  - Renders: colored dot + short label. On press: shows Popover with `note` if present
  - Color mapping:
    - `DRAFT` → gray `colors.textMuted`, empty circle (unfilled)
    - `ACTIVE` → `#22C55E` (green)
    - `PAUSED` → `#EAB308` (yellow)
    - `CANCELED` → `colors.error` (red)
    - `COMPLETED` → `#22C55E` + checkmark icon

- [ ] **5.5** — `Popover.tsx` — Small info bubble:
  - Props: `visible: boolean`, `onDismiss: () => void`, `content: string`, `anchorRef: RefObject<View>`
  - Appears above/below anchor, dismisses on tap outside backdrop
  - Dark surface background, caption typography, max-width 200

- [ ] **5.6** — `BottomSheet.tsx` — Slide-up modal:
  - Props: `visible: boolean`, `onClose: () => void`, `title?: string`, `children: ReactNode`
  - `Animated.Value` starts at screen height, animates to 0 on mount
  - Semi-transparent backdrop (tap to close)
  - Handle bar at top (36×4, `colors.border`, `radii.sm`)
  - `borderTopLeftRadius: 20`, `borderTopRightRadius: 20`

- [ ] **5.7** — `DropdownPicker.tsx` — Enum selector:
  - Props: `label: string`, `value: string | null`, `options: { label: string; value: string }[]`, `onChange: (value: string) => void`
  - Renders: pressable input-style container showing selected value + chevron
  - On press: opens `BottomSheet` with option list

- [ ] **5.8** — `NumericStepper.tsx` — +/- counter:
  - Props: `value: number`, `onChange: (value: number) => void`, `min?: number`, `max?: number`, `unit?: string`
  - Row: `[−] [value unit] [+]`
  - Buttons: 32×32, `colors.surface`, `radii.sm` border
  - `typography.body` for value display

- [ ] **5.9** — `ProgressBar.tsx` — Horizontal progress indicator:
  - Props: `progress: number` (0–1), `height?: number` (default 4), `color?: string` (default `colors.brand`)
  - Track: `colors.border` background; fill: animated `Animated.Value` width
  - `radii.sm` rounded ends

- [ ] **5.10** — `DayBadge.tsx` — Day of week colored badge:
  - Props: `dayOfWeek: DayOfWeek`, `variant: 'active' | 'rest' | 'empty' | 'current'`
  - 34×34, `radii.sm`
  - Shows 3-letter abbreviation (MON, TUE, etc.)
  - Color variants:
    - `active` → `colors.brand` bg + white text
    - `rest` → `colors.input` bg + `colors.textMuted` text
    - `empty` → `colors.input` bg + `colors.textMuted` text
    - `current` → `colors.brand` with ring outline

- [ ] **5.11** — `GoalPill.tsx` — Plan metadata pill:
  - Props: `periodizationType?: PeriodizationType | null`, `goal?: Goal | null`
  - Renders: `"Linear · Strength"` style, `typography.caption`, `colors.textMuted`
  - Small pill background: `colors.surfaceOverlay`

- [ ] **5.12** — Update `libs/shared/ui/src/components/molecules/index.ts` + `libs/shared/ui/src/index.ts` to export all new molecules

#### Notes

- Do NOT hardcode colors. Every color must come from `useThemeColors()` or be a semantic mapping (e.g., green = `#22C55E` for status, not from palette).
- Wireframe purple `#7f77dd` maps to project's `colors.brand` (`#2BBAED`).
- Card border radius 12px → use raw value `12` (not `radii.sm = 6` or `radii.card = 48`). Add `radii.md: 12` to the tokens if needed.

#### Acceptance Criteria

- [ ] All molecules render without errors on both dark and light theme
- [ ] `SegmentedControl` animates correctly between tabs
- [ ] `BottomSheet` slides up/down smoothly
- [ ] `StatusDot` shows correct color per status; popover appears on tap and dismisses on outside tap

---

### Task 6: Training UI Organisms

**Priority:** High
**Size:** L
**Depends on:** Task 4, Task 5
**Status:** ⬜ Planned

> Create composite organism components for the training screens.

**Location:** `libs/training/ui/src/components/organisms/`

#### Subtasks

- [ ] **6.1** — `PlanCard.tsx`:
  - Props: `plan: PlanSummary`, `onPress: () => void`
  - Layout (from design):
    - Left: workout icon (`barbell-outline` Ionicons, 40×40, `colors.brand`)
    - Center: plan name (`typography.label`), GoalPill
    - Right: `StatusDot` with `plan.status` + `plan.statusNote`
    - Bottom row: `ProgressBar` showing `workoutsDone/workoutsTotal`, fraction text `"4/18 workouts done"`, client name
  - Card: `colors.surface` bg, border `colors.border` 1px, `borderRadius: 12`, padding `spacing.md`
  - Pressable with `activeOpacity: 0.8`

- [ ] **6.2** — `PlanList.tsx`:
  - Props: `plans: PlanSummary[]`, `isLoading: boolean`, `error: string | null`, `onPressPlan: (id: string) => void`, `onRefresh: () => void`, `isRefreshing: boolean`
  - `FlatList` with `PlanCard` items, `keyExtractor={item => item.id}`
  - Loading: `ActivityIndicator` centered
  - Error: `EmptyState` with error icon + retry button
  - Empty: `EmptyState` with dumbbell icon + "No workout plans yet" + "Create your first plan" CTA
  - `refreshControl` with `RefreshControl`

- [ ] **6.3** — `MesocycleCard.tsx`:
  - Props: `mesocycle: Mesocycle`, `isExpanded: boolean`, `onToggle: () => void`, `onEditWeek: (microcycleId: string) => void`, `onDelete: () => void`
  - Collapsed: mesocycle name, week range label (`Wks 1–4 · 4 microcycles`), status pill, chevron icon
  - Expanded: shows `MicrocycleRow` for each microcycle (week number + workout count + `›` to navigate)
  - Status color dot using `MesocycleStatus` (PENDING=gray, IN_PROGRESS=brand, DONE=green)
  - Border: `colors.border` 1px, `borderRadius: 12`

- [ ] **6.4** — `WorkoutDayCard.tsx`:
  - Props: `day: WorkoutDay`, `isExpanded: boolean`, `onToggle: () => void`, `onEdit: () => void`, `onAdd: () => void`
  - `DayBadge` for day of week variant
  - If `isRestDay`: shows "Rest day" in `colors.textMuted`
  - If no exercises: shows "No workout" + "+ Add" button
  - If exercises: shows label + exercise count; expanded shows first 3 `ExerciseRow`s + "+ N more exercises / see all"
  - Expandable via `onToggle` (tap on card body)
  - "Edit" button (`colors.brand`, `typography.link`) on right side

- [ ] **6.5** — `ExerciseRow.tsx`:
  - Props: `exercise: WorkoutDayExercise`
  - Layout: exercise name (left, `typography.bodySmall`) + sets×reps (right, `colors.textMuted`)
  - Background: `colors.input`, `borderRadius: 6`, padding `spacing.xxs spacing.xs`

- [ ] **6.6** — `PlanDetailsSheet.tsx`:
  - Props: `visible: boolean`, `onClose: () => void`, `initialValues?: Partial<CreatePlanData>`, `onSave: (data: CreatePlanData) => void`
  - Renders `BottomSheet` with:
    - Section label "PLAN NAME" + `InputField` from shared/ui
    - Section label "GOAL" + `DropdownPicker` (options from `Goal` type)
    - Section label "PERIODIZATION TYPE" + `DropdownPicker` (options from `PeriodizationType` type)
    - Section label "TOTAL DURATION" + `NumericStepper` (min: 1, max: 52, unit: "weeks")
    - "Done" button: brand color, `typography.button`, full-width, `radii.sm`

- [ ] **6.7** — Update `libs/training/ui/src/index.ts` to export all organisms

#### Acceptance Criteria

- [ ] `PlanCard` correctly shows all plan fields; `StatusDot` interactive
- [ ] `PlanList` shows empty state, loading, and data states
- [ ] `MesocycleCard` collapses/expands correctly
- [ ] `PlanDetailsSheet` saves form with all required fields

---

### Task 7: Tab Bar Reorganization

**Priority:** High
**Size:** S
**Depends on:** nothing
**Status:** ⬜ Planned

> Reorganize bottom tab navigator from 4 tabs (Home, Clients, Plans, Profile) to the new structure (Home, Financial, Library, Profile). Rename route directories accordingly.

**Location:** `apps/mobile/src/app/(app)/`

#### Subtasks

- [ ] **7.1** — Rename/replace route directories:
  - `(app)/clients/` → `(app)/financial/` — keep `index.tsx` but update to placeholder
  - `(app)/plans/` → `(app)/library/` — keep `index.tsx` but update to placeholder

- [ ] **7.2** — Update `(app)/_layout.tsx`:
  ```tsx
  <Tabs.Screen name="home/index" options={{ title: 'Home', tabBarIcon: ... home-outline }} />
  <Tabs.Screen name="financial/index" options={{ title: 'Financial', tabBarIcon: ... wallet-outline }} />
  <Tabs.Screen name="library/index" options={{ title: 'Library', tabBarIcon: ... barbell-outline }} />
  <Tabs.Screen name="profile/index" options={{ title: 'Profile', tabBarIcon: ... person-outline }} />
  ```

- [ ] **7.3** — `(app)/financial/index.tsx` — placeholder screen (same pattern as current placeholders)

- [ ] **7.4** — `(app)/library/index.tsx` — placeholder screen (same pattern as current placeholders)

- [ ] **7.5** — Update auth guard `_layout.tsx` if it references old tab names

#### Acceptance Criteria

- [ ] 4 tabs render with correct icons and labels
- [ ] Navigation between tabs works
- [ ] Old `/clients` and `/plans` routes do not appear in the tab bar

---

### Task 8: Home Screen (Segment Tabs: Clients | Workouts)

**Priority:** High
**Size:** M
**Depends on:** Task 5, Task 6, Task 7
**Status:** ⬜ Planned

> Rewrite the Home screen placeholder with: `SegmentedControl` (Clients | Workouts), plan list content for Workouts tab, placeholder for Clients tab, and FAB to create new plan.

**Location:** `apps/mobile/src/app/(app)/home/index.tsx`

#### Subtasks

- [ ] **8.1** — Rewrite `(app)/home/index.tsx`:
  ```tsx
  export default function HomeScreen() {
    const [activeSegment, setActiveSegment] = useState(0); // 0=Clients, 1=Workouts
    const { plans, isLoading, error, deletePlan, refetch } = usePlans();

    return (
      <SafeAreaView style={...}>
        {/* Header: "Home" title */}
        <SegmentedControl
          segments={['Clients', 'Workouts']}
          selectedIndex={activeSegment}
          onChange={setActiveSegment}
        />
        {activeSegment === 0 && <ClientsPlaceholder />}
        {activeSegment === 1 && (
          <PlanList
            plans={plans}
            isLoading={isLoading}
            error={error}
            onPressPlan={(id) => router.push(`/(app)/plan/${id}`)}
            onRefresh={refetch}
          />
        )}
        {activeSegment === 1 && (
          <FAB onPress={() => router.push('/(app)/plan/new')} />
        )}
      </SafeAreaView>
    );
  }
  ```

- [ ] **8.2** — `ClientsPlaceholder` — inline component: centered "Clients coming in Sprint 4" message with person icon

- [ ] **8.3** — Header: `screenOptions={{ headerShown: false }}` for this screen (use custom header within the screen component using `typography.display` + `colors.textPrimary`)

- [ ] **8.4** — Pull-to-refresh passes `refetch` to `PlanList`

- [ ] **8.5** — Long-press on PlanCard: show delete confirmation (`Alert.alert` with cancel/delete)

#### Acceptance Criteria

- [ ] Segment control switches between Clients (placeholder) and Workouts (plan list)
- [ ] FAB only visible on Workouts tab
- [ ] Empty plan list shows `EmptyState` with "Create your first plan" CTA
- [ ] Plan list renders with correct card data
- [ ] Long-press delete shows confirmation → deletes plan → list refreshes

---

### Task 9: Plan Builder Screen

**Priority:** High
**Size:** L
**Depends on:** Task 4, Task 5, Task 6
**Status:** ⬜ Planned

> Screen to view and edit a workout plan's mesocycle structure, following wireframe Screen 1.

**Location:** `apps/mobile/src/app/(app)/plan/[id]/index.tsx`

#### Subtasks

- [ ] **9.1** — Create `(app)/plan/[id]/index.tsx`:
  - Reads `planId` from route params (`useLocalSearchParams`)
  - Uses `usePlanDetail(planId)` hook
  - Uses `usePlanMutations(planId)` hook
  - Uses `usePlanBuilderStore` for expand/collapse state

- [ ] **9.2** — Header:
  - Back button (chevron left → `router.back()`)
  - Plan name as title (`typography.display`, `typography.label` if long)
  - Settings gear icon (opens `PlanDetailsSheet`)

- [ ] **9.3** — Below header: `GoalPill` (periodizationType · goal), total weeks label

- [ ] **9.4** — "MESOCYCLES" section header with progress `"X / Y weeks"` + `ProgressBar`

- [ ] **9.5** — `ScrollView` with `MesocycleCard` for each mesocycle:
  - Collapsed → shows name, week range, status, microcycle count
  - Expanded → shows microcycle/week rows with workout count → tap navigates to Workout Filler

- [ ] **9.6** — "+ Add mesocycle" dashed button at bottom of list:
  - Opens `PlanDetailsSheet`-style bottom sheet for mesocycle name, goal, startWeek, endWeek
  - On confirm: calls `addMesocycle` mutation → refreshes plan detail

- [ ] **9.7** — "Save plan" solid button at very bottom (fixed position):
  - If `isDirty` (plan builder store): calls `updatePlan` with latest state
  - Navigates back to Home on success
  - Uses brand color, `shadows.brandGlow`, `typography.button`

- [ ] **9.8** — `PlanDetailsSheet` for gear icon:
  - Pre-filled with current plan values
  - On "Done": calls `updatePlan` mutation

- [ ] **9.9** — Loading state: `ActivityIndicator` centered

#### Acceptance Criteria

- [ ] Plan detail loads and shows all mesocycles
- [ ] Mesocycle cards expand/collapse correctly
- [ ] "+ Add mesocycle" creates and refreshes list
- [ ] Gear icon opens pre-filled sheet; changes save correctly
- [ ] Tapping a week navigates to Workout Filler screen

---

### Task 10: Workout Filler Screen

**Priority:** High
**Size:** L
**Depends on:** Task 4, Task 5, Task 6
**Status:** ⬜ Planned

> Screen to fill in workout days and exercises for a specific week, following wireframe Screen 2.

**Location:** `apps/mobile/src/app/(app)/plan/[id]/week/[weekId].tsx`

#### Subtasks

- [ ] **10.1** — Create `(app)/plan/[id]/week/[weekId].tsx`:
  - Reads `planId` and `weekId` (microcycleId) from route params
  - Finds microcycle data from `usePlanDetail(planId)` (already cached from Plan Builder)
  - Uses `usePlanMutations(planId)` for CRUD operations

- [ ] **10.2** — Header:
  - Breadcrumb text: `"← MesocycleName / Week N"` (brand color, `typography.caption`)
  - Back button taps → `router.back()`

- [ ] **10.3** — Title: `"Week N"` (`typography.display`), subtitle: `"Microcycle X of Y · MesocycleName"` (`typography.bodySmall`, `colors.textMuted`)

- [ ] **10.4** — Week progress bars (horizontal row of 4 segments, one per microcycle in the mesocycle):
  - Current week = `colors.brand`; previous = `colors.brand` (lighter/50% opacity); future = `colors.border`

- [ ] **10.5** — `ScrollView` with `WorkoutDayCard` for each workout day in the microcycle

- [ ] **10.6** — "+ Add workout day" dashed button:
  - Shows small bottom sheet: day of week picker (MON–SUN), label input, rest day toggle
  - On confirm: calls `addWorkoutDay` mutation

- [ ] **10.7** — "Done" button (fixed at bottom): `router.back()`

- [ ] **10.8** — `WorkoutDayCard` → "Edit" tap → navigates to Day Editor `(app)/plan/[id]/week/[weekId]/day/[dayId]`

- [ ] **10.9** — `WorkoutDayCard` → "+ Add" tap (no-workout day) → navigates to Day Editor (empty state)

#### Acceptance Criteria

- [ ] Week data loads from cached plan detail (no extra API call)
- [ ] All workout days for the week render as cards
- [ ] Adding a workout day calls mutation and refreshes the screen
- [ ] "Edit" and "+ Add" navigate to Day Editor

---

### Task 11: Day Editor Screen

**Priority:** Medium
**Size:** M
**Depends on:** Task 4, Task 5, Task 6, Task 10
**Status:** ⬜ Planned

> Screen to manage exercises for a specific workout day (add, edit, remove, search exercises).

**Location:** `apps/mobile/src/app/(app)/plan/[id]/week/[weekId]/day/[dayId].tsx`

#### Subtasks

- [ ] **11.1** — Create route file, reads `dayId` + parent `weekId` + `planId` from params

- [ ] **11.2** — Header: day of week + label (e.g., "Monday — Upper body"), back button

- [ ] **11.3** — Exercise list: `FlatList` of `ExerciseRow` (full-size variant with sets/reps/load inputs inline or via tap-to-edit)

- [ ] **11.4** — "Add exercise" search flow:
  - Search bar at bottom (or header)
  - Uses `useExerciseSearch` hook (debounced 300ms)
  - Results shown in a flat list; tap to select
  - On select: shows small sheet for sets, reps, load, rest
  - On confirm: calls `addExerciseToDay` mutation

- [ ] **11.5** — Exercise actions:
  - Swipe left (or long-press) → delete → `removeExercise` mutation
  - Tap on exercise → edit sets/reps/load → `updateDayExercise` mutation

- [ ] **11.6** — "Done" / back: navigates back to Workout Filler

#### Acceptance Criteria

- [ ] Exercise search works (shows results after 2+ chars, debounced)
- [ ] Exercises can be added with sets/reps/load
- [ ] Exercises can be deleted with confirmation
- [ ] Changes persist (visible on Workout Filler card after returning)

---

### Task 12: New Plan Flow

**Priority:** High
**Size:** S
**Depends on:** Task 5, Task 6, Task 8
**Status:** ⬜ Planned

> Create a plan from Home screen's FAB: collect plan details, create via API, navigate to Plan Builder.

**Location:** `apps/mobile/src/app/(app)/plan/new.tsx`

#### Subtasks

- [ ] **12.1** — Create `(app)/plan/new.tsx`:
  - Renders `PlanDetailsSheet` opened by default
  - On "Done": calls `createPlan` mutation
  - On success: navigate to `/(app)/plan/${newPlan.id}`
  - On close without saving: navigate back to Home

- [ ] **12.2** — `createPlan` mutation in `usePlans` invalidates `['plans']` query so Home list refreshes

- [ ] **12.3** — Validation: name required; totalWeeks ≥ 1

#### Acceptance Criteria

- [ ] FAB on Home → New Plan screen → fill details → creates plan → navigates to Plan Builder
- [ ] Back without saving → Home (no plan created)
- [ ] Name validation error shown inline
- [ ] New plan immediately visible in Home list on return

---

## Dependencies on Other Projects

| This task | Depends on | Project |
|-----------|-----------|---------|
| All API calls | `API_REGISTRY.md` sections 2.4–2.8 (Implemented) | fit-common ✅ |
| All plan/exercise endpoints | fit-api Sprint 2 completed | fit-api |
| Client list (Home Clients tab) | Client module | fit-api Sprint 4-5 |

---

## Notes

- **Design token mapping:** Wireframe uses `#7f77dd` purple → map to `colors.brand` (`#2BBAED`). Wireframe background `#f5f4f2` → `colors.background`. Card white → `colors.surface`.
- **Card border radius:** Wireframe cards use `borderRadius: 12`. Token `radii.sm = 6` and `radii.card = 48` don't match — use raw `12` or add `radii.md: 12` to `libs/shared/ui/src/tokens/radii.ts`.
- **Status colors:** `ACTIVE=green (#22C55E)`, `PAUSED=yellow (#EAB308)`, `CANCELED=error`, `DRAFT=textMuted`. These are semantic status colors, not from the shared token palette.
- **No drag-to-reorder UI** in this sprint. `reorderExercises` API exists but the UI uses delete+re-add pattern for now.
- **Nested routes:** Expo Router supports deep nesting `plan/[id]/week/[weekId]/day/[dayId]`. Ensure each segment has a directory with `index.tsx` OR the correct file at the segment level.
- **usePlanDetail caching:** Workout Filler and Day Editor should read from the same `['plan', id]` query cache as Plan Builder — no extra API calls when navigating within the hierarchy.
