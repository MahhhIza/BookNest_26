# AGENTS.md — BookNest

Biblioteca digital pessoal. Trabalho de dupla (Tech Academy 4). Front em `frontend/`, back em `backend/`, Nginx em `nginx/`, tudo orquestrado pelo `docker-compose.yml`.

## Stack do back

- Node 20, Express 5, TypeScript em modo `strict`, `mysql2` (SQL com `?`), `bcryptjs`, `dotenv`.
- Porta interna `3001`. Só o Nginx publica porta para fora.
- Todas as rotas ficam sob o prefixo `/api`.

## Comandos (dentro de `backend/`)

- `npm run dev`: servidor com recarga (`tsx watch`).
- `npm run build`: compila para `dist/` (`tsc`).
- `npm start`: roda `node dist/server.js`.
- `npm test`: testes do validador.
- `npx tsc --noEmit`: checa os tipos sem gerar arquivos.

## Pastas

Um módulo por recurso em `backend/src/modules/<recurso>/`:

- `controllers/` recebe a requisição e devolve a resposta.
- `services/` regras de negócio.
- `repositories/` acesso ao MySQL.
- `entities/` classes de domínio (atributos `private`, getters).
- `validators/` validações.
- `routes/` rotas do módulo.

O módulo `users` é o modelo a seguir.

## Variáveis de ambiente (só os nomes)

`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `MYSQL_DATABASE`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`.

## Contrato com o front

- Usuário em inglês (`name`, `email`, `password`, `cpf`, `role`). Recursos em português (`titulo`, `autorId`, `livroId`...).
- Listagem: `{ "data": [...], "meta": { "page", "limit", "total", "totalPages" } }`, `limit` até 100.
- Criar devolve 201, excluir devolve 204, id inexistente devolve 404, vínculo na exclusão devolve 409.
- Erros: `{ "message": "...", "errors": { "campo": "..." } }`.

## Guardrails

- Nunca ler, mostrar ou copiar o conteúdo do `.env`. Use só o `.env.example`.
- Nunca colocar senha, chave ou token no código ou nas respostas.
- Não instalar dependência nova sem perguntar.
- Não alterar `docker-compose.yml`, `nginx/` nem o `.env` sem pedir.
- Não usar `any`. Não escrever JavaScript: só TypeScript.
- SQL sempre parametrizado com `?`. Nunca montar SQL concatenando texto do usuário.
- Se o pedido estiver ambíguo, perguntar antes de agir.
- Antes de terminar, rodar `npx tsc --noEmit` e corrigir os erros.

## Skills

Estão em `skills/`: `crud-recurso`, `rota-autenticada`, `validacao-usuario`.
