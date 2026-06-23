# Frontend Conventions

## Gerenciamento de Estado

### Layout / UI state → Pinia Store (com persistência)

O estado de abertura/fechamento do menu lateral (sidebar) e qualquer outro estado de UI que precise ser persistido **nunca** deve acessar `localStorage` diretamente de um componente ou layout.

**Regra:** O componente Nuxt UI não acessa `localStorage` diretamente. O estado reside em uma Store do Pinia, que usa `useLocalStorage` do `@vueuse/core` internamente para persistência automática.

**Fluxo correto:**

```
Componente (layout)
  └── useLayoutStore()
        ├── isSidebarOpen (ref persistida via useLocalStorage)
        └── toggleSidebar()
```

**Implementação (stores/layout.ts):**

```ts
import { useLocalStorage } from "@vueuse/core";

export const useLayoutStore = defineStore("layout", () => {
  const isSidebarOpen = useLocalStorage("sidebar-open", true);

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  return { isSidebarOpen, toggleSidebar };
});
```

**No layout:**

```vue
<script setup lang="ts">
const layoutStore = useLayoutStore();
</script>

<template>
  <USidebar v-model:open="layoutStore.isSidebarOpen" collapsible="icon">
    ...
  </USidebar>
  <UButton @click="layoutStore.toggleSidebar()" />
</template>
```

Isso centraliza o estado, mantém a reatividade e persiste sem quebrar regras de ciclo de vida do Nuxt.

## Separação Estrita: Pinia vs TanStack Query

Mesmo como SPA, o projeto adota separação rigorosa entre estado de UI e estado do servidor.

### Pinia → Apenas Estado Global de UI

Stores do Pinia armazenam **exclusivamente** estados locais do cliente que persistem entre navegações:

- Preferências de UI (sidebar collapsado, tema, etc.)
- Sessão do usuário autenticado (user, role, tokens)
- Flags de layout

**Nunca** armazene respostas de API no Pinia.

### TanStack Query → Todo Estado do Servidor

Toda requisição assíncrona à API deve ser encapsulada em hooks do `@tanstack/vue-query`:

| Operação | Hook |
|----------|------|
| Listagens | `useQuery()` |
| Busca única | `useQuery()` |
| Criação | `useMutation()` |
| Edição | `useMutation()` |
| Exclusão | `useMutation()` |

Regras:

1. **Nada de fetch manual** — nenhum `$fetch`, `axios` ou `api.post()` solto em componente. Tudo passa por composables que usam TanStack Query.
2. **Cache do TanStack Query** — deixe o mecanismo de cache (`staleTime`, `gcTime`, invalidação via `queryClient.invalidateQueries`) gerenciar a retenção dos dados. Não duplique em Pinia.
3. **Composables por domínio** — cada domínio tem seu arquivo em `composables/` (ex: `useAppointments.ts`, `useClients.ts`, `useServices.ts`) exportando hooks `useQuery`/`useMutation`.
4. **Query keys consistentes** — use array com domínio e identificador: `["appointments", "list", filters]`, `["clients", id]`.
5. **Mutations invalidam queries relacionadas** — ao criar/editar/excluir, invalide as queries que dependem daquele dado.

Exemplo:

```ts
// composables/useAppointments.ts
export function useAppointments(date: Ref<string>) {
  return useQuery({
    queryKey: ["appointments", "list", date],
    queryFn: () => api.get(`/api/appointments?date=${date.value}`),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentInput) =>
      api.post("/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
```

### Fluxo de dados

```
Componente Vue
  ├── Pinia (useAuthStore, useLayoutStore) ← estado de UI/sessão
  └── TanStack Query (useAppointments, useClients) ← dados do servidor
        └── api.ts (fetch wrapper) ← única camada HTTP
              └── Fastify API
```

Isso mantém o Pinia leve (apenas estado efêmero de UI) e o TanStack Query responsável por cache, refetch, stale-while-revalidate e sincronização com o servidor.
