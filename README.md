# BookNest

**BookNest** é uma biblioteca digital pessoal desenvolvida para organizar livros e acompanhar hábitos de leitura. A aplicação permite consultar um catálogo compartilhado de livros e manter uma estante individual, na qual cada usuário registra seu próprio progresso de leitura.

O projeto foi desenvolvido como parte de um trabalho acadêmico do curso de Análise e Desenvolvimento de Sistemas (TADS).

## Funcionalidades

- Cadastro de usuários com validação de nome, e-mail, CPF e senha.
- Autenticação com e-mail e senha, utilizando JWT.
- Senhas armazenadas com hash utilizando bcrypt.
- Edição dos dados do próprio perfil.
- Catálogo compartilhado de livros, autores e categorias.
- Gerenciamento administrativo de categorias, autores e livros.
- Estante de leitura individual para cada usuário.
- Registro de leituras com os status **Quero ler**, **Lendo** e **Lido**.
- Registro de notas e datas de conclusão.
- Operações CRUD para categorias, autores, livros e leituras.
- Paginação nas listagens.
- Controle de acesso conforme autenticação e perfil do usuário.

Cada usuário possui sua própria estante de leitura. Os registros de leitura não são compartilhados entre contas, enquanto o catálogo de livros permanece disponível para todos os usuários autenticados.

## Tecnologias utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express
- TypeScript
- MySQL2
- JSON Web Token (JWT)
- bcryptjs

### Banco de dados e infraestrutura
- MySQL 8.4
- Podman ou Docker com Compose
- Nginx
- Containers para execução dos serviços

## Como executar o projeto

### Pré-requisitos

- Git
- Podman ou Docker
- Compose compatível com o ambiente escolhido

### 1. Clonar o repositório

```bash
git clone https://github.com/MahhhIza/BookNest_26.git
cd BookNest_26
```

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` a partir do modelo:

**PowerShell:**
```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` e configure as credenciais do banco de dados e a chave JWT. Utilize uma chave secreta forte, com pelo menos 32 caracteres.

Não compartilhe nem envie o arquivo `.env` para o repositório.

### 3. Iniciar os serviços

Com Podman:

```bash
podman compose up -d --build
```

Com Docker:

```bash
docker compose up -d --build
```

O Compose inicia os serviços de banco de dados, backend, frontend e Nginx.

### 4. Acessar a aplicação

Após a inicialização, acesse:

- **Aplicação:** http://localhost:8080
- **Verificação de saúde da API:** http://localhost:8080/health

A porta padrão é `8080` e pode ser alterada pela variável `NGINX_PORT` no arquivo `.env`.

## Banco de dados

O projeto utiliza MySQL 8.4.

O arquivo `mysql/init.sql` contém a estrutura inicial das tabelas e seus relacionamentos. Os dados são persistidos no volume `db_data`, configurado no Compose.

As leituras possuem vínculo com o usuário responsável pelo registro, garantindo a separação das estantes pessoais.

## API e controle de acesso

A API é disponibilizada pelo backend Express e acessada pelo frontend por meio do Nginx.

As operações protegidas exigem autenticação por token JWT.

- **Usuários comuns:** podem consultar o catálogo e gerenciar suas próprias leituras.
- **Administradores:** podem gerenciar categorias, autores e livros do catálogo compartilhado.

Os registros de leitura são vinculados ao usuário autenticado, e não ao usuário informado pelo cliente.

## Testes e comandos de desenvolvimento

Os comandos abaixo devem ser executados dentro da respectiva pasta.

### Backend

```bash
cd backend
npm install
npm run build
npm test
```

Para iniciar o backend em modo de desenvolvimento:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm test
npm run lint
```

Para iniciar o frontend em modo de desenvolvimento:

```bash
npm run dev
```

O frontend também possui uma opção de dados simulados para desenvolvimento, documentada em `frontend/README.md`.

## Documentação para desenvolvimento

- `AGENTS.md`: orientações gerais de arquitetura, padrões e regras do projeto.
- `skills/`: instruções específicas para tarefas de validação, rotas autenticadas e operações CRUD.
- `frontend/README.md`: informações adicionais sobre a estrutura e o desenvolvimento do frontend.

---

**BookNest — sua biblioteca, seu ritmo de leitura.**