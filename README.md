# Projeto EJS Template

Um template de projeto fullstack construído com **Express.js** e **EJS** (Embedded JavaScript Templating), pré-configurado para conectar-se com banco de dados **MySQL** e gerenciar variáveis de ambiente de forma segura.

## 🎯 Sobre o Projeto

Este é um template pronto para uso que inclui:
- **Express.js**: Framework web rápido e minimalista para Node.js
- **EJS**: Template engine para renderizar páginas dinâmicas no servidor
- **MySQL**: Banco de dados relacional integrado
- **Variáveis de Ambiente**: Configuração segura com `.env`
- **Nodemon**: Recarga automática durante desenvolvimento

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18.x ou superior
- **npm** versão 9.x ou superior (incluído no Node.js)
- **MySQL Server** instalado e em execução

Para verificar suas versões instaladas, execute:
```bash
node --version
npm --version
```

## 🚀 Getting Started

### 1. Instalar Dependências

Na raiz do projeto, execute:
```bash
npm install
```

Isso vai instalar todas as dependências necessárias listadas em `package.json`.

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com suas configurações:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco_dados
PORT=3000
```

### 3. Iniciar o Desenvolvimento

Para iniciar o servidor com recarregamento automático:
```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

Qualquer alteração nos arquivos será detectada automaticamente pelo Nodemon, recarregando o servidor.

## 📚 Estrutura do Projeto

```
projeto-ejs/
├── server.js          # Arquivo principal do servidor
├── routes.js          # Definição de rotas
├── database.js        # Configuração do MySQL
├── package.json       # Dependências e scripts
├── .env               # Variáveis de ambiente (não versionado)
├── views/             # Templates EJS
│   └── index.ejs      # Página principal
└── public/            # Arquivos estáticos (CSS, JS, imagens)
```

## 📦 Dependências Principais

- **express**: Framework web
- **ejs**: Template engine
- **mysql2**: Driver MySQL
- **dotenv**: Gerenciamento de variáveis de ambiente
- **nodemon**: Recarga automática (desenvolvimento)

## 💡 Dicas de Desenvolvimento

- Use `npm run start` para executar em produção
- Configure seu `.env` antes de iniciar o servidor
- Os templates EJS ficam na pasta `views/`
- Arquivos estáticos (CSS, JS) vão em `public/`

---

**Pronto para começar? Execute `npm install` e depois `npm run dev`! 🎉**
