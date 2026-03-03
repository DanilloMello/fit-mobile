# Sprint 0: Foundation — fit-mobile

> **Generated:** 2026-02-26
> **Sprint:** 0
> **Project:** fit-mobile
> **Status:** Completed

---

## Sprint Overview

Sprint 0 estabelece a fundação técnica do frontend: workspace NX com Expo/React Native, estrutura de bibliotecas por domínio (identity, client, training, shared) e o cliente HTTP base configurado com Axios.

---

## Progress

| Task | Status | Priority |
|------|--------|----------|
| NX Workspace setup | ✅ Done | High |
| Library structure (DDD por domínio) | ✅ Done | High |
| API client (Axios + base URL) | ✅ Done | High |

---

## Tasks

### Task 1: NX Workspace + Expo App

**Priority:** High
**Size:** M
**Depends on:** nothing

> Criar workspace NX com app Expo/React Native e expo-router para file-based routing.

#### Subtasks

- [x] **1.1** — Inicializar workspace NX com preset `expo`
  - App em `apps/mobile/` usando Expo SDK + expo-router
- [x] **1.2** — Configurar TypeScript strict mode em `tsconfig.base.json`
- [x] **1.3** — Configurar routing por arquivo em `apps/mobile/src/app/`
  - Grupos de rotas: `(auth)/` e `(app)/`
  - Root `_layout.tsx` com `AuthGuard`
- [x] **1.4** — Instalar dependências base: `zustand`, `axios`, `@tanstack/react-query`, `react-hook-form`

#### Acceptance Criteria

- [x] `npx expo start` sobe o app sem erros
- [x] Rotas `(auth)` e `(app)` isoladas com layouts distintos

---

### Task 2: Library Structure (DDD por Domínio)

**Priority:** High
**Size:** M
**Depends on:** Task 1

> Criar a estrutura de bibliotecas NX com 4 camadas por módulo de domínio.

#### Subtasks

- [x] **2.1** — Criar bibliotecas para cada módulo com estrutura:
  - `libs/identity/{domain,application,infrastructure,ui}/`
  - `libs/client/{domain,application,infrastructure,ui}/`
  - `libs/training/{domain,application,infrastructure,ui}/`
  - `libs/shared/{domain,utils,ui}/`
- [x] **2.2** — Criar barrel exports (`index.ts`) em cada biblioteca
- [x] **2.3** — Criar entidades de domínio placeholder:
  - `libs/identity/domain/src/entities/user.entity.ts`
  - `libs/client/domain/src/entities/client.entity.ts`
  - `libs/training/domain/src/entities/plan.entity.ts`, `exercise.entity.ts`
  - `libs/shared/domain/src/entity.base.ts`
- [x] **2.4** — Configurar path aliases no `tsconfig.base.json` para cada lib

#### Acceptance Criteria

- [x] Cada módulo tem as 4 camadas criadas
- [x] Imports entre libs funcionam via path alias (`@fit-mobile/identity/domain`)

---

### Task 3: API Client (Axios)

**Priority:** High
**Size:** S
**Depends on:** Task 1

> Criar cliente HTTP base com Axios configurado com URL do ambiente e suporte a Bearer token.

#### Subtasks

- [x] **3.1** — Criar `api-client.ts` em `libs/shared/utils/src/`
  - Base URL: `process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'`
  - Interceptor de request: adiciona `Authorization: Bearer <token>` quando presente
- [x] **3.2** — Criar função `setAuthToken(token: string | null)` para injetar token após login
- [x] **3.3** — Configurar `.env.local` com `EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1`
- [x] **3.4** — Exportar `apiClient` via `libs/shared/utils/src/index.ts`

#### Acceptance Criteria

- [x] `apiClient.get('/health')` retorna 200 com servidor rodando
- [x] Token Bearer injetado automaticamente após `setAuthToken()`

---

## Dependencies on Other Projects

| Esta task | Depende de | Projeto |
|-----------|-----------|---------|
| Task 3 (API client) | Health endpoint disponível | fit-api (Sprint 0 ✅) |

---

## Notes

Sprint 0 concluída com sucesso. A estrutura de libs segue DDD por domínio, o que facilita a organização das sprints seguintes. O `LoadingSpinner` compartilhado já está disponível em `libs/shared/ui/`.
