---
name: crud-recurso
description: Cria um recurso novo do BookNest (rotas, controller, service, repository, entity) copiando o padrão do módulo users.
---

# Criar um recurso (CRUD)

Use quando pedirem um novo recurso (autores, categorias, livros, leituras).

## Passos

1. Criar `backend/src/modules/<recurso>/` com as pastas `controllers`, `services`, `repositories`, `entities`, `routes`.
2. **Entity:** classe com atributos `private readonly` e getters, como `User`.
3. **Repository:** usa `database` de `config/database.ts` e SQL com `?`. Métodos: `findAll(page, limit)` (com `COUNT(*)` para o total), `findById`, `create`, `update`, `delete`. As colunas do banco são `snake_case`; as propriedades da API são `camelCase`.
4. **Service:** valida os campos obrigatórios e lança erro com mensagem clara. Se o id não existir em `update`/`delete`/`findById`, lança "não encontrado" (vira 404).
5. **Controller:** devolve `201` ao criar, `200` ao editar, `204` ao excluir, `404` quando não existe, `400` na validação, `409` quando o MySQL recusar a exclusão por vínculo (`errno 1451`).
6. **Routes:** `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`. Registrar o router em `server.ts` com `app.use('/api', ...)`.
7. Listagem devolve `{ data, meta: { page, limit, total, totalPages } }`.
8. Rodar `npx tsc --noEmit`.

## Cuidados

- Sem `any`. Sem SQL concatenado.
- Se o recurso tiver chave estrangeira, conferir se o registro pai existe antes de gravar.
