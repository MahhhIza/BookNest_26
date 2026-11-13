---
name: validacao-usuario
description: Valida e-mail, CPF e senha do usuário no BookNest reaproveitando o UserValidator.
---

# Validação de usuário

Use no cadastro e na edição de perfil.

## Passos

1. Importar `UserValidator` de `backend/src/modules/users/validators/userValidator.ts`.
2. Normalizar antes de validar: `name` e `email` com `trim()`, e-mail em minúsculas, CPF só com dígitos (`replace(/\D/g, '')`).
3. Chamar `UserValidator.validateEmail(email)`, `validateCPF(cpf)` e `validatePassword(password)`.
4. A senha precisa ter 8+ caracteres, maiúscula, minúscula, número e caractere especial.
5. Na edição, a senha é opcional: só valida e gera o hash se vier preenchida. O e-mail não muda.
6. Erro de validação vira `400` com `message`. E-mail ou CPF repetido vira `409`.

## Cuidados

- Não duplicar as regras: se mudar uma regra, muda só no `UserValidator`.
- Hash da senha com `bcrypt` e `BCRYPT_SALT_ROUNDS` (12), lido do ambiente.
