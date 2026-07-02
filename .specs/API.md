# SB-Flow — API Reference

**Base URL:** `http://localhost:3001` (dev) | `https://api.blessedstudio.com.br` (prod)

**Authentication:** 
- Dashboard routes: Cookie `access_token` (JWT, 15 min) + `refresh_token` (30 dias)
- Booking público: Sem autenticação

---

## Authentication

### POST /api/auth/login

Login de profissional com telefone e senha.

**Request:**
```json
{
  "phone": "11999887766",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Caroline",
    "phone": "11999887766",
    "role": "OWNER"
  }
}
```
*Sets cookies: `access_token` (15 min), `refresh_token` (30 dias)*

**Errors:**
- `401`: Credenciais inválidas

---

### POST /api/auth/refresh

Renova tokens de autenticação usando cookie `refresh_token`.

**Request:** (body vazio, cookie enviado automaticamente)

**Response (200):**
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "name": "Caroline",
    "phone": "11999887766",
    "role": "OWNER"
  }
}
```

**Errors:**
- `401`: Token expirado ou inválido

---

### POST /api/auth/logout

Encerra sessão limpando cookies.

**Response (200):**
```json
{ "ok": true }
```

---

## Professionals

### GET /api/professionals

Lista profissionais. OWNER vê todas, PARTNER vê apenas a si.

**Auth:** Cookie (OWNER/PARTNER)

**Query:** `?professional_id=` (opcional)

**Response (200):**
```json
[
  { "id": 1, "name": "Caroline", "role": "OWNER", "isActive": true },
  { "id": 2, "name": "Thalita", "role": "PARTNER", "isActive": true }
]
```

---

### POST /api/professionals

Cria profissional. Apenas OWNER.

**Auth:** Cookie (OWNER)

**Request:**
```json
{
  "name": "Nova Profissional",
  "cpf": "12345678901",
  "phone": "11999887766",
  "password": "senha123",
  "role": "PARTNER"
}
```

**Response (201):**
```json
{
  "id": 3,
  "name": "Nova Profissional",
  "cpf": "12345678901",
  "phone": "11999887766",
  "role": "PARTNER",
  "isActive": true
}
```

---

### PUT /api/professionals/:id

Atualiza profissional. OWNER atualiza qualquer campo, PARTNER apenas nome, telefone e horários.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

**Request:**
```json
{
  "name": "Nome Atualizado",
  "phone": "11988776655",
  "workHoursStart": "09:00",
  "workHoursEnd": "18:00"
}
```

---

### PATCH /api/professionals/:id/toggle-active

Ativa/inativa profissional. Apenas OWNER.

**Auth:** Cookie (OWNER)

---

## Services

### GET /api/services

Lista serviços. OWNER vê todos, PARTNER vê apenas os próprios.

**Auth:** Cookie (OWNER/PARTNER)

**Query:** `?professional_id=` (opcional para OWNER, ignorado para PARTNER)

**Response (200):**
```json
[
  {
    "id": 1,
    "professionalId": 1,
    "name": "Corte Feminino",
    "durationMinutes": 60,
    "price": "80.00",
    "description": "Corte personalizado",
    "isActive": true
  }
]
```

---

### POST /api/services

Cria serviço.

**Auth:** Cookie (OWNER/PARTNER - apenas para si)

**Request:**
```json
{
  "professionalId": 1,
  "name": "Escova",
  "durationMinutes": 45,
  "price": "60.00",
  "description": "Escova progressiva"
}
```

---

### PUT /api/services/:id

Atualiza serviço.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

---

### DELETE /api/services/:id

Soft delete (isActive=false) se tiver agendamentos, senão exclusão física.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

---

## Clients

### GET /api/clients

Busca clientes por nome ou telefone.

**Auth:** Cookie (OWNER/PARTNER)

**Query:** `?q=termo`

**Response (200):**
```json
[
  { "id": 1, "name": "Ana Silva", "phone": "11999887766" }
]
```

---

### POST /api/clients

Cria cliente. Apenas OWNER.

**Auth:** Cookie (OWNER)

**Request:**
```json
{
  "name": "Ana Silva",
  "phone": "11999887766"
}
```

---

### PUT /api/clients/:id

Atualiza cliente. Apenas OWNER.

**Auth:** Cookie (OWNER)

---

### GET /api/clients/:id/history

Histórico de agendamentos do cliente.

**Auth:** Cookie (OWNER/PARTNER)

**Response (200):**
```json
{
  "client": { "id": 1, "name": "Ana Silva", "phone": "11999887766" },
  "appointments": []
}
```

---

## Appointments

### GET /api/appointments

Lista agendamentos por período.

**Auth:** Cookie (OWNER/PARTNER)

**Query:**
- `?professional_id=` - Filtra por profissional
- `?start=` - Data inicial (ISO)
- `?end=` - Data final (ISO)

**Response (200):**
```json
[
  {
    "id": 1,
    "professionalId": 1,
    "clientId": 1,
    "serviceId": 1,
    "startTime": "2026-07-03T09:00:00Z",
    "endTime": "2026-07-03T10:00:00Z",
    "status": "confirmed",
    "clientName": "Ana Silva",
    "serviceName": "Corte",
    "price": "80.00"
  }
]
```

**Notas:**
- PARTNER vê apenas próprios agendamentos
- Valor financeiro ocultado quando PARTNER vê agendamento de outra

---

### POST /api/appointments

Cria agendamento com checagem de conflito.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

**Request:**
```json
{
  "professionalId": 1,
  "clientId": 1,
  "serviceId": 1,
  "startTime": "2026-07-03T09:00:00Z"
}
```

**Response (201):** Agendamento criado

**Errors:**
- `409`: Conflito de horário
- `403`: Sem permissão (PARTNER tentando criar para outra)

---

### PUT /api/appointments/:id

Atualiza agendamento.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

**Restrições:**
- Agendamento passado (startTime < now): `422` - apenas status pode ser alterado
- PARTNER só pode editar próprios agendamentos

---

### PATCH /api/appointments/:id/cancel

Cancela agendamento.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

**Notas:**
- Agendamento futuro: libera horário
- Agendamento passado: mantém horário ocupado (status = cancelled)

---

### PATCH /api/appointments/:id/status

Altera status para `completed` ou `no_show`.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

---

## Blocks

### GET /api/blocks

Lista bloqueios.

**Auth:** Cookie (OWNER/PARTNER)

**Query:** `?professional_id=&start=&end=`

---

### POST /api/blocks

Cria bloqueio de horário.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

**Request:**
```json
{
  "professionalId": 1,
  "startTime": "2026-07-03T14:00:00Z",
  "endTime": "2026-07-03T15:00:00Z",
  "reason": "Almoço"
}
```

---

### DELETE /api/blocks/:id

Remove bloqueio.

**Auth:** Cookie (OWNER/PARTNER - restrictions apply)

---

## SSE (Tempo Real)

### GET /api/sse

Conexão SSE para eventos em tempo real. Autenticado via cookie.

**Auth:** Cookie

**Headers:** `Accept: text/event-stream`

**Eventos:**

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `appointment:created` | `{ appointment }` | Novo agendamento |
| `appointment:updated` | `{ appointment }` | Agendamento editado |
| `appointment:cancelled` | `{ appointment }` | Agendamento cancelado |
| `appointment:status-changed` | `{ appointment }` | Status alterado |
| `block:created` | `{ block }` | Novo bloqueio |
| `block:deleted` | `{ block }` | Bloqueio removido |

**Notas:**
- Heartbeat a cada 30s
- OWNER recebe de todas profissionais
- PARTNER recebe apenas dos próprias

---

## Booking (Público)

Rotas públicas para autoatendimento do cliente. **Sem autenticação.**

### GET /api/booking/professionals

Lista profissionais ativas para agendamento.

**Response (200):**
```json
[
  { "id": 1, "name": "Caroline" },
  { "id": 2, "name": "Thalita" }
]
```

---

### GET /api/booking/professionals/:id/services

Lista serviços de uma profissional.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Corte Feminino",
    "durationMinutes": 60,
    "price": "80.00",
    "description": "Corte personalizado"
  }
]
```

---

### GET /api/booking/professionals/:id/slots

Horários disponíveis para uma profissional numa data.

**Query:** `?date=2026-07-03`

**Response (200):**
```json
[
  { "time": "08:00", "available": true },
  { "time": "08:30", "available": false },
  { "time": "09:00", "available": true }
]
```

**Notas:**
- Slots de 30 minutos
- Exclui horários com agendamentos confirmados e bloqueios
- Respeita `workHoursStart` e `workHoursEnd` da profissional

---

### POST /api/booking/appointments

Cria agendamento pelo cliente.

**Request:**
```json
{
  "professionalId": 1,
  "serviceId": 1,
  "startTime": "2026-07-03T09:00:00Z",
  "clientName": "Ana Silva",
  "clientPhone": "11999887766"
}
```

**Notas:**
- Cria cliente automaticamente se telefone não existir
- Sem verificação de WhatsApp
- Retorna `409` se horário ocupado

---

### GET /api/booking/appointments

Lista agendamentos futuros de um cliente.

**Query:** `?phone=11999887766`

**Response (200):**
```json
[
  {
    "id": 1,
    "professionalName": "Caroline",
    "serviceName": "Corte",
    "startTime": "2026-07-03T09:00:00Z",
    "endTime": "2026-07-03T10:00:00Z",
    "status": "confirmed"
  }
]
```

---

### POST /api/booking/appointments/:id/cancel

Cancela agendamento pelo cliente.

**Request:**
```json
{
  "phone": "11999887766"
}
```

**Notas:**
- Valida que telefone pertence ao cliente
- Apenas agendamentos futuros podem ser cancelados

---

## Error Responses

| Status | Significado |
|--------|-------------|
| `400` | Requisição inválida (validation error) |
| `401` | Não autenticado |
| `403` | Sem permissão (RBAC violation) |
| `404` | Recurso não encontrado |
| `409` | Conflito (horário ocupado) |
| `422` | Entidade não processável (ex: editar agendamento passado) |
| `500` | Erro interno |