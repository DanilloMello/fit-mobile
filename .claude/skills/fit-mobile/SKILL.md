---
name: fit-mobile-skill
description: Frontend skill for fit-mobile. React Native/NX patterns and conventions.
---

# fit-mobile Skill

> **Prereq**: Use `fit-mobile-docs` MCP to read `DOMAIN_SPEC.md` and `API_REGISTRY.md` first

---

## 1. File Locations

| Creating | Path |
|----------|------|
| Entity | `libs/{m}/domain/src/entities/{name}.entity.ts` |
| Value Object | `libs/{m}/domain/src/value-objects/{name}.vo.ts` |
| Repository Port | `libs/{m}/application/src/ports/{name}.repository.ts` |
| Store | `libs/{m}/application/src/store/{name}.store.ts` |
| API Client | `libs/{m}/infrastructure/src/api/{name}.api.ts` |
| Component | `libs/{m}/ui/src/components/{Name}.tsx` |
| Hook | `libs/{m}/ui/src/hooks/use{Name}.ts` |
| Screen | `apps/mobile/src/app/(app)/{feature}/{name}.tsx` |

---

## 2. Modules

| Module | Import |
|--------|--------|
| identity | `@connecthealth/identity` |
| client | `@connecthealth/client` |
| training | `@connecthealth/training` |
| shared | `@connecthealth/shared` |

---

## 3. Patterns

### Entity
```typescript
export interface ClientProps {
  id: string; ownerId: string; name: string; active: boolean;
}
export class Client extends Entity<ClientProps> {
  get isLinked() { return !!this.props.linkedUserId; }
}
```

### API Client
```typescript
export class ClientApi implements ClientRepository {
  async getAll(): Promise<Client[]> {
    const res = await apiClient.get('/clients');
    return res.data.data.map(mapToClient);
  }
  async create(input: CreateClientInput): Promise<Client> {
    const res = await apiClient.post('/clients', input);
    return mapToClient(res.data.data);
  }
}
```

### Hook
```typescript
export function useClients() {
  const query = useQuery({ queryKey: ['clients'], queryFn: () => clientApi.getAll() });
  return { clients: query.data ?? [], isLoading: query.isLoading };
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => clientApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
```

### Store
```typescript
export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user: null, token: null, isAuthenticated: false,
    login: (user, token) => set({ user, token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  }), { name: 'auth-storage' })
);
```

### Screen
```typescript
export default function ClientListScreen() {
  const { clients, isLoading } = useClients();
  const router = useRouter();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <FlatList
      data={clients}
      keyExtractor={(item) => item.props.id}
      renderItem={({ item }) => (
        <ClientCard client={item} onPress={() => router.push(`/clients/${item.props.id}`)} />
      )}
    />
  );
}
```

---

## 4. API Integration

Use `fit-mobile-docs` MCP to read `API_REGISTRY.md` for fit-api endpoints to consume.

---

## 5. Checklist: New Feature

- [ ] Read `API_REGISTRY.md` via MCP for endpoint
- [ ] Entity in `domain/`
- [ ] API client in `infrastructure/`
- [ ] Hook in `ui/hooks/`
- [ ] Components in `ui/components/`
- [ ] Screen in `apps/mobile/`
