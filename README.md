# personalBudgetproject

Personal Budget

Aplicação completa de gerenciamento de orçamento pessoal com backend em Node.js e frontend em React. Permite criar, editar e remover receitas e despesas, além de calcular o saldo total por usuário autenticado.

Tecnologias utilizadas

Backend
- Node.js
- Express
- PostgreSQL
- bcrypt
- jsonwebtoken (JWT)

Frontend
- React
- Vite
- Axios
- React Router DOM
- Tailwind CSS

Estrutura do projeto

personal-budget/  
├── backend/  
│ ├── app.js  
│ ├── server.js  
│ ├── auth.js  
│ ├── middleware.js  
│ ├── database.js  
│ ├── .env  
│ └── package.json  
├── frontend/  
│ └── personal-budget-frontend/  
│ ├── src/  
│ └── package.json  
└── README.md


Como rodar o projeto:

Backend

1. Entre na pasta do backend

    cd personal-budget-backend

2. Instale as dependências

    npm install

3. Configure o arquivo .env

    DB_USER=postgres  
    DB_HOST=localhost  
    DB_NAME=personal_budget  
    DB_PASSWORD=sua_senha  
    DB_PORT=5432  
    JWT_SECRET=sua_chave_secreta

4. Inicie o servidor

    node server.js

O servidor vai rodar em http://localhost:3000

Frontend

1. Entre na pasta do frontend

    cd personal-budget-frontend

2. Instale as dependências

    npm install

3. Inicie o projeto

    npm run dev

Acesse em http://localhost:5173

Fluxo de uso

1. Crie uma conta em /register
2. Faça login em /login e receba o token JWT
3. Gerencie suas receitas e despesas no dashboard

Rotas da API

Autenticação

| Método | Rota      | Descrição                       |
| POST   | /register | Cadastra um novo usuário        |
| POST   | /login    | Autentica e retorna o token JWT |

Receitas e Despesas:

Todas as rotas abaixo exigem o token no header:

| Key           | Value                 |
| Authorization | Bearer seu_token_aqui |

| Método | Rota          | Descrição                                     |
| GET    | /             | Retorna todos os dados do usuário             |
| GET    | /receitas     | Lista todas as receitas                       |
| GET    | /receitas/:id | Busca uma receita pelo ID                     |
| POST   | /receitas     | Adiciona uma nova receita                     |
| PUT    | /receitas/:id | Atualiza uma receita                          |
| DELETE | /receitas/:id | Remove uma receita                            |
| GET    | /despesas     | Lista todas as despesas                       |
| GET    | /despesas/:id | Busca uma despesa pelo ID                     |
| POST   | /despesas     | Adiciona uma nova despesa                     |
| PUT    | /despesas/:id | Atualiza uma despesa                          |
| DELETE | /despesas/:id | Remove uma despesa                            |
| GET    | /total        | Retorna o total de receitas, despesas e saldo |

Requisitos

*Nome e valor são obrigatórios ao criar ou atualizar receitas e despesas
*O valor deve ser um número maior que zero
*O ID informado na URL deve ser um número válido
*Retorna erro 404 quando o item buscado não existe
*Cada usuário acessa apenas seus próprios dados