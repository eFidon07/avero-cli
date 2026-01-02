# @avero/cli

A modular CLI tool for scaffolding production-ready Node.js projects. Generate API services with best practices and modern tooling configured out of the box.

## Installation

### Global Installation

\`\`\`bash
npm install -g @avero/cli
\`\`\`

### Local Development

\`\`\`bash
git clone <your-repo>
npm install
npm run build
npm link
\`\`\`

## Usage

### Create API Service (Main Feature)

Create a new Node.js API service:

\`\`\`bash

# Interactive mode

avero create

# Or use npx

npx @avero/cli create

# With project name

avero create my-api-project

# Or use npx with project name

npx @avero/cli create my-api-project

# With custom directory

avero create my-api --dir ./custom-path

# Or use npx with custom directory

npx @avero/cli create my-api --dir ./custom-path
\`\`\`

The API generator supports both TypeScript and JavaScript, and includes:

- ✅ Express.js server setup
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ Logger utility
- ✅ Jest testing setup
- ✅ ESLint configuration
- ✅ Environment variables support
- ✅ Git repository initialization

### Initialize Other Services

Initialize additional services for your project:

\`\`\`bash

# Initialize database configuration (coming soon)

avero init database

## Available Commands

- \`avero create [name]\` - Create a new Node.js API service
- \`avero generate [name]\` - Generate a new feature (e.g., auth, user, etc.)
- \`avero init [service]\` - Initialize a service (database, etc.)
- \`avero --help\` - Show help
- \`avero -v\` - Show version

## Project Structure

\`\`\`
@avero/cli/
├── src/
│ ├── index.ts # Main CLI entry
│ ├── commands/
│ │ └── init.ts # Init command for services
│ ├── core/
│ │ └── api/
│ │ │ ├── create.ts # API generator logic
│ │ │ └── templates/
│ │ │ │ └── index.ts # API templates
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## License

MIT
