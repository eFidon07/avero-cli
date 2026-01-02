export const apiTemplates = {
  packageJson: (
    name: string,
    language: "typescript" | "javascript",
    averoVersionCode: string
  ) => {
    const scripts =
      language === "typescript"
        ? {
            dev: "nodemon",
            build: "tsc",
            start: "node dist/index.js",
            test: "jest",
            lint: "eslint src --ext .ts",
            "lint:fix": "eslint src --ext .ts --fix",
          }
        : {
            dev: "nodemon",
            start: "node src/index.js",
            test: "jest",
            lint: "eslint src --ext .js",
            "lint:fix": "eslint src --ext .js --fix",
          };

    return JSON.stringify(
      {
        name,
        version: "1.0.0",
        avero: {
          version: averoVersionCode,
        },
        description: `Node.js ${
          language === "typescript" ? "TypeScript" : "JavaScript"
        } API service By Avero`,
        main: language === "typescript" ? "dist/index.js" : "src/index.js",
        scripts,
        keywords: ["nodejs", language, "express", "api", "avero"],
        author: "",
        license: "MIT",
        dependencies: {},
        devDependencies: {},
      },
      null,
      2
    );
  },

  nodemonConfig: (language: "typescript" | "javascript") => {
    const config =
      language === "typescript"
        ? {
            watch: ["src"],
            ext: "ts,json",
            ignore: ["node_modules"],
            exec: "tsx src/index.ts",
          }
        : {
            watch: ["src"],
            ext: "js,json",
            ignore: ["node_modules"],
            exec: "node src/index.js",
          };

    return JSON.stringify(config, null, 2);
  },

  tsConfig: (usePathAlias: boolean) => {
    const config: any = {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: "node",
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist", "tests"],
    };

    if (usePathAlias) {
      config.compilerOptions.baseUrl = ".";
      config.compilerOptions.paths = {
        "@/*": ["src/*"],
        "@app/*": ["src/app/*"],
        "@config/*": ["src/config/*"],
        "@infra/*": ["src/infra/*"],
        "@shared/*": ["src/shared/*"],
      };
    }

    return JSON.stringify(config, null, 2);
  },

  eslintConfig: JSON.stringify(
    {
      parser: "@typescript-eslint/parser",
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
    null,
    2
  ),

  eslintConfigJs: JSON.stringify(
    {
      env: {
        node: true,
        es2021: true,
        jest: true,
      },
      extends: "eslint:recommended",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "warn",
      },
    },
    null,
    2
  ),

  jestConfig: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/shared/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/shared/**/*.ts'],
  coverageDirectory: 'src/shared/coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  }
};`;
    } else {
      return `module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\\\.js$': 'babel-jest'
  }
};`;
    }
  },

  envFile: `PORT=5000
NODE_ENV=development`,

  gitignore: `node_modules/
dist/
.env
.env.local
coverage/
*.log
.DS_Store`,

  averoJson: (versionCode: string, language: "typescript" | "javascript") => {
    return JSON.stringify({
      version: versionCode,
      fileExt: language === "typescript" ? ".ts" : ".js",
      createdAt: new Date().toISOString(),
    });
  },

  indexFile: (language: "typescript" | "javascript", usePathAlias = false) => {
    if (language === "typescript") {
      const errorHandlerImport = usePathAlias
        ? "import { errorHandler } from '@shared/middlewares/errorHandler';"
        : "import { errorHandler } from './shared/middlewares/errorHandler';";

      const envConfigImport = usePathAlias
        ? "import { envVar } from '@config/env';"
        : "import { envVar } from './config/env';";

      return `import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
${envConfigImport}
${errorHandlerImport}
import v1AppRouter from './router';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes
app.use('/v1', v1AppRouter);

// Error handling
app.use(errorHandler);

app.listen(envVar.port, () => {
  console.log(\`🚀 Server running on port \${envVar.port}\`);
});

export default app;`;
    } else {
      return `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { envVar } = require('./config/env');
const { errorHandler } = require('./shared/middlewares/errorHandler');
const v1AppRouter = require('./router');

dotenv.config();

const app = express();

// Express middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/v1', v1AppRouter);

// Error handling
app.use(errorHandler);

app.listen(envVar.port, () => {
  console.log(\`🚀 Server running on port \${envVar.port}\`);
});

module.exports = app;`;
    }
  },

  apiRouter: (language: "typescript" | "javascript", usePathAlias = false) => {
    if (language === "typescript") {
      const importApiRouter = usePathAlias
        ? "import { featureRoutes } from '@app/feature';"
        : "import { featureRoutes } from './app/feature';";

      return `import {Router, Request, Response} from 'express';
${importApiRouter}   
const router = Router();

router.use("/app", featureRoutes);

export default router;`;
    } else {
      return `const {Router, Request, Response} = require('express');
const { featureRoutes } = require('./app/feature');
const router = Router();

router.use("/app", featureRoutes);

module.exports = router;`;
    }
  },

  apiConfigEnv: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `enum Priority {
      LOW = "low",
      HIGH = "high",
}

const envValidator = (name: string, priority: Priority = Priority.HIGH) => {
      const variableValue = process.env[name];

      switch(priority) {
        case Priority.LOW:
          return variableValue ?? '';
        case Priority.HIGH:
          if (!variableValue) throw new Error(\`Missing env variable: \${name}\`);
          return variableValue;
        default:
          return '';
      }
}

export const envVar = {
      port: envValidator('PORT', Priority.LOW) || 5000,
      nodeEnv: envValidator('NODE_ENV', Priority.LOW) || "development",
      // Add other variables down here using the 'envValidator' function to ensure the env variables exist
}`;
    } else {
      return `const envValidator = (name, priority) => {
      const variableValue = process.env[name];

      switch(priority) {
        case 'low':
          return variableValue ?? '';
        case 'high':
          if (!variableValue) throw new Error(\`Missing env variable: \${name}\`);
          return variableValue;
        default:
          return '';
      }
}

export const envVar = {
      port: envValidator('PORT', 'low') || 5000,
      nodeEnv: envValidator('NODE_ENV', 'low') || "development",
      // Add other variables down here using the 'envValidator' function to ensure the env variables exist
}`;
    }
  },

  featureRoute: (
    language: "typescript" | "javascript",
    featureName: string = "feature"
  ) => {
    if (language === "typescript") {
      return `import { Router } from 'express';
import {${featureName}Controller} from './${featureName}.controller';

const router = Router();

router.get('/', ${featureName}Controller);

export default router;`;
    } else {
      return `const { Router } = require('express');
const {${featureName}Controller} = require('./${featureName}.controller');

const router = Router();

router.get('/', ${featureName}Controller);

module.exports = router;`;
    }
  },

  featureController: (
    language: "typescript" | "javascript",
    usePathAlias = false,
    featureName: string = "feature"
  ) => {
    if (language === "typescript") {
      const responseHandlerImport = usePathAlias
        ? "import {serverResponse} from '@shared/utils/response';"
        : "import {serverResponse} from '../../shared/utils/response';";

      return `import { Request, Response } from 'express';
import {checkServerState} from './${featureName}.service';
${responseHandlerImport}

export async function ${featureName}Controller(req: Request, res: Response): Promise<void> {
      try {
        const serverState = await checkServerState();
        return serverResponse.success(res, serverState)
      } catch (error) {
        serverResponse.error(res, error)
      }
}`;
    } else {
      return `const {Request, Response} = require('express');
const {checkServerState} = require('./${featureName}.service');
const {serverResponse} = require('../../shared/utils/response');

async function ${featureName}Controller(req, res) {
      try {
        const serverState = await checkServerState();
        return serverResponse.success(res, serverState)
      } catch (error) {
        serverResponse.error(res, error)
      }
};

module.exports = { ${featureName}Controller };`;
    }
  },

  featureService: (
    language: "typescript" | "javascript",
    featureName: string = "feature"
  ) => {
    if (language === "typescript") {
      return `import ${featureName}Repository from './${featureName}.repository';

export async function checkServerState(): Promise<string> {
      return await ${featureName}Repository.repositoryFunction("avero");
};`;
    } else {
      return `const ${featureName}Repository = require('./${featureName}.repository');

module.exports.checkServerState = async function () {
      return await ${featureName}Repository.repositoryFunction();
};`;
    }
  },

  featureSchema: (featureName: string = "feature") => {
    return `// Add data validation (using zod, joi, yup, etc.) in here
export const ${featureName}Schema = {
  // Add schema validation rules here
}`;
  },

  featureRepository: (
    language: "typescript" | "javascript",
    featureName: string = "feature"
  ) => {
    const exportStatement =
      language === "typescript"
        ? `export default ${featureName}Repository;`
        : `module.exports = ${featureName}Repository;`;
    const functionParameter =
      language === "typescript" ? "name: string" : "name";

    return `const ${featureName}Repository = {
    repositoryFunction: async (${functionParameter}) => {
      return \`Hello, \${name}. The server is functioning fine.\`
  }
};

${exportStatement}`;
  },

  featureExportFile: (
    language: "typescript" | "javascript",
    featureName: string = "feature",
    omittedFiles: string[] = ["schema"]
  ) => {
    if (language === "typescript") {
      return `export * as ${featureName}Controller from './${featureName}.controller';
export { default as ${featureName}Routes } from './${featureName}.routes';
export * as ${featureName}Service from './${featureName}.service';
${
  !omittedFiles.includes("repository")
    ? `export { default as ${featureName}Respository } from './${featureName}.repository';`
    : ""
}
${
  !omittedFiles.includes("schema")
    ? `export * as ${featureName}Schema from './${featureName}.schema';`
    : ""
}
`;
    } else {
      return `module.exports = {
  ${featureName}Controller: require('./${featureName}.controller'),
  ${featureName}Routes: require('./${featureName}.routes'),
  ${featureName}Service: require('./${featureName}.service'),
  ${
    !omittedFiles.includes("repository")
      ? `${featureName}Repository: require('./${featureName}.repository'),`
      : ""
  }
  ${
    !omittedFiles.includes("schema")
      ? `${featureName}Schema: require('./${featureName}.schema'),`
      : ""
  }
  ${
    !omittedFiles.includes("test")
      ? `${featureName}Test: require('./${featureName}.test'),`
      : ""
  }
}`;
    }
  },

  errorHandler: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};`;
    } else {
      return `const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = { errorHandler };`;
    }
  },

  logger: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `export const logger = {
  info: (message: string) => {
    console.log(\`[INFO] \${new Date().toISOString()}: \${message}\`);
  },
  error: (message: string, error?: Error) => {
    console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`, error);
  },
  warn: (message: string) => {
    console.warn(\`[WARN] \${new Date().toISOString()}: \${message}\`);
  }
};`;
    } else {
      return `const logger = {
  info: (message) => {
    console.log(\`[INFO] \${new Date().toISOString()}: \${message}\`);
  },
  error: (message, error) => {
    console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`, error);
  },
  warn: (message) => {
    console.warn(\`[WARN] \${new Date().toISOString()}: \${message}\`);
  }
};

module.exports = { logger };`;
    }
  },

  responseHandler: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `import type {Response} from 'express';

export const serverResponse = {
  success: (res: Response, message: string, status: number = 200, data?: unknown) => {
    console.log(\`[INFO] \${new Date().toISOString()}: \${message}\`);
    res.status(status).json({success: true, timestamp: new Date().toISOString(), message, data});
  },
  error: (res: Response, error: Error | unknown, message?: string, status: number = 500, data?: unknown) => {
    const errMsg = message ? message : error instanceof Error ? error.message : 'An unexpected error occurred';

    console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`, error);
    res.status(status).json({success: false, timestamp: new Date().toISOString(), message: errMsg, data});
  },
};`;
    } else {
      return `const serverResponse = {
  success: (res, message, status = 200, data) => {
    console.log(\`[INFO] \${new Date().toISOString()}: \${message}\`);
    res.status(status).json({success: true, timestamp: new Date().toISOString(), message, data});
  },
  error: (res, error, message, status = 500, data) => {
    console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`, error);
    res.status(status).json({success: false, timestamp: new Date().toISOString(), message: message ? message : error.message, data});
  },
};

module.exports = { serverResponse };`;
    }
  },

  healthTest: (
    language: "typescript" | "javascript",
    usePathAlias = false,
    featureName: string = "feature"
  ) => {
    if (language === "typescript") {
      const appImport = usePathAlias
        ? "import app from '@/index';"
        : "import app from '../src/index';";

      return `import request from 'supertest';
${appImport}

describe('${featureName.replace(/^./, (m) => m.toUpperCase())} Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/${featureName}');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});`;
    } else {
      return `const request = require('supertest');
const app = require('../src/index');

describe('${featureName.replace(/^./, (m) => m.toUpperCase())} Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/${featureName}');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});`;
    }
  },

  infraCache: (language: "typescript" | "javascript") => {
    if (language === "typescript") {
      return `export const cache = {
      // Export all cache setup and configuration in this directory ('src/infra/cache')
}`;
    } else {
      return `module.exports.cache = {
      // Export all cache setup and configuration in this directory ('src/infra/cache')
}`;
    }
  },

  infraDB: `// Export database setup, connections, and other db-related data and utilities from this directory ('src/infra/db')`,

  infraDBModels: `// Export all database models/schemas created in this directory ('src/infra/db/models')`,

  readme: (name: string, language: "typescript" | "javascript") => {
    const buildSection =
      language === "typescript"
        ? `### Build
\`\`\`bash
npm run build
\`\`\`

### Start production server
\`\`\`bash
npm start
\`\`\`

`
        : `### Start server
\`\`\`bash
npm start
\`\`\`

`;

    return `# ${name}

A Node.js + ${
      language === "typescript" ? "TypeScript" : "JavaScript"
    } API service created with @avero/cli.

## Getting Started

### Install dependencies
\`\`\`bash
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

${buildSection}
### Run tests
\`\`\`bash
npm test
\`\`\`

### Lint code
\`\`\`bash
npm run lint
npm run lint:fix
\`\`\`

## Project Structure

\`\`\`
${name}/
${language === "typescript" ? "├── dist/              # Compiled output\n" : ""}
├── src/
│   ├── api/           # Main API files (feature-based: controller, routes, service, repository, etc.)
│   ├── config/        # Project configurations
│   ├── infra/         # For external systems implementation (database setup/connections, cache setup, outbound HTTP calls to third-party services)
│   ├── shared/        # Shared utilities
│   ├── index.${language === "typescript" ? "ts" : "js"}       # Entry point
│   └── router.${
      language === "typescript" ? "ts" : "js"
    }      # Global router (calls individual feature routes)
├── .env               # Environment variables
${
  language === "typescript"
    ? "├── tsconfig.json      # TypeScript config\n"
    : ""
}└── package.json       # Dependencies
\`\`\`

## Environment Variables

- \`PORT\`: Server port (default: 5000)
- \`NODE_ENV\`: Environment (development/production)

## API Endpoints

- \`GET /v1/app/\`: Avero-default test endpoint
`;
  },
};
