# BookNest – front-end

React 19 + TypeScript + Vite, com React Router, Axios e CSS puro (`src/styles/`).

## Rodar

```bash
npm install
npm run dev
```

Sem o back-end, crie `frontend/.env.local` com `VITE_MOCK=true` para usar dados de exemplo (só em desenvolvimento). Entre com `admin@booknest.com` para ver os botões de administrador.

## Comandos

- `npm run build`: confere os tipos e gera a pasta `dist/`
- `npm test`: testes do Vitest
- `npm run lint`: ESLint

## Pastas de `src/`

- `pages/`: uma pasta por tela, com `components/` só daquela tela
- `components/`: componentes reutilizáveis (lista, formulário, tabela, campos)
- `services/`: `api.ts` (Axios com interceptor do token), `BaseCrudService.ts` (classe abstrata) e um serviço por recurso
- `contexts/`, `hooks/`, `routes/`, `layouts/`, `types/`, `utils/`
- `styles/`: CSS global (`base.css`, `layout.css`, `paginas.css`)
