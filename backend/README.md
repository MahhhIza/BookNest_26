# Backend — BookNest

Backend da aplicação BookNest, responsável pelas regras de negócio, autenticação, gerenciamento dos usuários, catálogo de livros e controle das estantes de leitura.

Desenvolvido com Node.js, Express, TypeScript e MySQL.

## Tecnologias

- **Node.js:** ambiente de execução.
- **Express:** framework para construção da API.
- **TypeScript:** tipagem estática e organização do código.
- **MySQL:** banco de dados relacional.
- **mysql2:** conexão e execução de consultas SQL.
- **JWT (jsonwebtoken):** autenticação baseada em tokens.
- **bcryptjs:** geração e verificação de hash de senhas.
- **tsx:** execução do TypeScript durante o desenvolvimento e os testes.

### Organização dos módulos

Os módulos de negócio são organizados, conforme sua necessidade, nas seguintes camadas:

| Camada | Responsabilidade |
|---|---|
| `entities` | Representação dos objetos e suas regras. |
| `repositories` | Acesso e persistência dos dados no banco. |
| `services` | Regras de negócio e validações. |
| `controllers` | Recebimento das requisições e envio das respostas. |
| `routes` | Definição dos endpoints da API. |
| `validators` | Validações específicas dos dados de entrada. |

O módulo `auth` concentra as funcionalidades de autenticação. Os módulos de usuários e recursos do catálogo possuem suas próprias responsabilidades.

### Módulos

- **auth:** autenticação e geração de tokens.
- **users:** cadastro, consulta e atualização de usuários.
- **categorias:** gerenciamento das categorias de livros.
- **autores:** gerenciamento dos autores.
- **livros:** gerenciamento do catálogo de livros.
- **leituras:** registro e gerenciamento das leituras dos usuários.
- **minhaEstante:** funcionalidades relacionadas à estante pessoal.

## Autenticação e autorização

A API utiliza JSON Web Token (JWT) para autenticar as requisições protegidas.

- As senhas são armazenadas utilizando hash com bcryptjs.
- O acesso às rotas protegidas exige um token válido.
- As permissões são verificadas conforme o perfil do usuário.
- Usuários comuns podem consultar o catálogo e gerenciar suas próprias leituras.
- Administradores podem gerenciar os recursos do catálogo compartilhado.

As leituras são vinculadas ao usuário autenticado, garantindo que cada conta tenha sua própria estante de leitura.

## Banco de dados

O backend utiliza MySQL e acessa o banco por meio da biblioteca `mysql2`.

A estrutura inicial das tabelas e seus relacionamentos está definida em:

```text
../mysql/init.sql
```

As consultas utilizam parâmetros para evitar a concatenação direta de valores fornecidos pelo usuário.

## Configuração do ambiente

Na execução integrada do projeto, as variáveis de ambiente são configuradas no arquivo `.env` localizado na raiz do repositório.

Consulte o arquivo `.env.example` da raiz para conhecer as variáveis necessárias.

Principais configurações utilizadas pelo backend:

| Variável | Finalidade |
|---|---|
| `PORT` | Porta de execução da API. |
| `DB_HOST` | Endereço do servidor MySQL. |
| `DB_PORT` | Porta do MySQL. |
| `DB_USER` | Usuário do banco de dados. |
| `DB_PASSWORD` | Senha do banco de dados. |
| `MYSQL_DATABASE` | Nome do banco utilizado. |
| `JWT_SECRET` | Chave secreta utilizada na assinatura dos tokens. |
| `JWT_EXPIRES_IN` | Tempo de validade dos tokens. |

Não versione o arquivo `.env` nem compartilhe suas credenciais.

## Instalação e execução

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Compilação

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`.

### Produção

```bash
npm start
```

O comando de produção executa a aplicação compilada.

## Testes

Para executar os testes automatizados:

```bash
npm test
```

Para verificar a compilação do TypeScript:

```bash
npm run build
```

## Execução integrada

Na configuração principal do BookNest, o backend é executado em container e se comunica com o banco de dados e o frontend por meio da rede interna do Compose.

Para iniciar todos os serviços, consulte as instruções do `README.md` localizado na raiz do projeto.

---

**BookNest — Backend**