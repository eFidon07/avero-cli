# @avero/cli

**@avero/cli** is a modular command-line tool for scaffolding **production-ready Node.js API services**.  
It helps you bootstrap backend projects with best practices and modern tooling—configured out of the box.

---

## ✨ Features

- Generate Express-based API services
- TypeScript **or** JavaScript support
- Opinionated but flexible project structure
- Built-in tooling for testing, linting, and logging
- Designed for scalability and real-world production use

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @avero/cli
Local Development Setup
bash
Copy code
git clone <your-repo>
npm install
npm run build
npm link
🚀 Usage
Create an API Service (Main Feature)
Create a new Node.js API service using interactive or non-interactive modes.

Interactive Mode
bash
Copy code
avero create
Or via npx:

bash
Copy code
npx @avero/cli create
With Project Name
bash
Copy code
avero create my-api-project
Or:

bash
Copy code
npx @avero/cli create my-api-project
With Custom Directory
bash
Copy code
avero create my-api --dir ./custom-path
Or:

bash
Copy code
npx @avero/cli create my-api --dir ./custom-path
🧱 What Gets Generated
The API generator includes:

✅ Express.js server setup

✅ Health check endpoint

✅ Centralized error handling middleware

✅ Logger utility

✅ Jest testing configuration

✅ ESLint configuration

✅ Environment variable support

✅ Git repository initialization

🛠 Initialize Other Services
Initialize additional services for your project.

bash
Copy code
# Database initialization (coming soon)
avero init database
📖 Available Commands
Command	Description
avero create [name]	Create a new Node.js API service
avero generate [name]	Generate a new feature (auth, user, etc.)
avero init [service]	Initialize a service (database, etc.)
avero --help	Show help
avero -v	Show CLI version

🗂 Project Structure
text
Copy code
@avero/cli/
├── src/
│   ├── index.ts             # Main CLI entry point
│   ├── commands/
│   │   └── init.ts          # Init command for services
│   ├── core/
│   │   └── api/
│   │       ├── create.ts    # API generator logic
│   │       └── templates/
│   │           └── index.ts # API templates
├── package.json
├── tsconfig.json
└── README.md
📄 License
MIT
```
