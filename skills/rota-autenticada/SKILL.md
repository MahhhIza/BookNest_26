---
name: rota-autenticada
description: Protege uma rota do BookNest com o authMiddleware (JWT) e confere que o usuário só mexe nos próprios dados.
---

# Rota autenticada

Use quando uma rota precisar de login.

## Passos

1. O token vem no header `Authorization: Bearer <token>`.
2. O `authMiddleware` lê o header, valida o token com `JWT_SECRET` e guarda o `id` do usuário na requisição. Sem token ou com token inválido, responde `401` com `{ "message": "..." }`.
3. Colocar o middleware antes do controller: `router.get('/', authMiddleware, controller.list)`.
4. Rotas de perfil (`/users/me`) usam o `id` que veio do token, nunca um `id` enviado pelo cliente.
5. Se alguém tentar editar outro usuário, responder `403`.

## Cuidados

- Nunca colocar senha nem hash dentro do token.
- A mensagem de erro de login é genérica ("E-mail ou senha inválidos"), sem dizer qual campo errou.
- `JWT_SECRET` vem do ambiente. Nunca escrever o valor no código.
