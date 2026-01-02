import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";
import { apiTemplates } from "./templates";
import { averoVersion } from "../../lib/version";

interface CreateOptions {
  dir?: string;
}

export async function createApiProject(
  projectName?: string,
  options?: CreateOptions
) {
  console.log(chalk.cyan.bold("\n🚀 Avero API Generator\n"));

  // Get project configuration
  let language: "typescript" | "javascript" = "typescript";
  let usePathAlias = false;

  if (!projectName) {
    const currentDirName = path.basename(process.cwd());

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: currentDirName,
        validate: (input: string) => {
          if (/^[a-z0-9-_]+$/i.test(input)) return true;
          return "Project name can only contain letters, numbers, dashes, and underscores";
        },
      },
      {
        type: "select",
        name: "language",
        message: "Select language:",
        choices: ["TypeScript", "JavaScript"],
        default: "TypeScript",
      },
    ]);
    projectName = answers.projectName;
    language = answers.language.toLowerCase() as "typescript" | "javascript";

    // Ask about path aliases if TypeScript is selected
    if (language === "typescript") {
      const pathAliasAnswer = await inquirer.prompt([
        {
          type: "confirm",
          name: "usePathAlias",
          message: "Enable path aliases? (e.g., @/* for src/*)",
          default: true,
        },
      ]);
      usePathAlias = pathAliasAnswer.usePathAlias;
    }
  } else {
    const answers = await inquirer.prompt([
      {
        type: "select",
        name: "language",
        message: "Select language:",
        choices: ["TypeScript", "JavaScript"],
        default: "TypeScript",
      },
    ]);
    language = answers.language.toLowerCase() as "typescript" | "javascript";

    // Ask about path aliases if TypeScript is selected
    if (language === "typescript") {
      const pathAliasAnswer = await inquirer.prompt([
        {
          type: "confirm",
          name: "usePathAlias",
          message: "Enable path aliases? (e.g., @/* for src/*)",
          default: true,
        },
      ]);
      usePathAlias = pathAliasAnswer.usePathAlias;
    }
  }

  const targetDir = options?.dir || projectName!;
  const projectPath = path.join(process.cwd(), targetDir);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.error(
      chalk.red(`\n❌ Error: Directory ${targetDir} already exists\n`)
    );
    process.exit(1);
  }

  console.log(chalk.gray(`Creating project in ${projectPath}...\n`));

  // Create project directory
  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  // Create directory structure
  const dirs = [
    ".avero",
    "src",
    "src/app/feature",
    "src/config",
    "src/shared/middlewares",
    "src/shared/utils",
    "src/shared/tests",
    "src/infra/cache",
    "src/infra/db/models",
    "src/infra/http",
  ];
  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

  // Write all template files
  console.log(chalk.blue("📝 Generating files..."));

  fs.writeFileSync(
    "package.json",
    apiTemplates.packageJson(projectName!, language, averoVersion)
  );

  if (language === "typescript") {
    fs.writeFileSync("tsconfig.json", apiTemplates.tsConfig(usePathAlias));
    fs.writeFileSync(".eslintrc.json", apiTemplates.eslintConfig);
  } else {
    fs.writeFileSync(".eslintrc.json", apiTemplates.eslintConfigJs);
  }

  fs.writeFileSync("nodemon.json", apiTemplates.nodemonConfig(language));
  fs.writeFileSync("jest.config.js", apiTemplates.jestConfig(language));
  fs.writeFileSync(".env", apiTemplates.envFile);
  fs.writeFileSync(".gitignore", apiTemplates.gitignore);
  fs.writeFileSync("README.md", apiTemplates.readme(projectName!, language));
  fs.writeFileSync(
    ".avero/metadata.json",
    apiTemplates.averoJson(averoVersion, language)
  );

  const fileExt = language === "typescript" ? "ts" : "js";

  // src root files
  fs.writeFileSync(
    `src/index.${fileExt}`,
    apiTemplates.indexFile(language, usePathAlias)
  );
  fs.writeFileSync(
    `src/router.${fileExt}`,
    apiTemplates.apiRouter(language, usePathAlias)
  );

  // Config files
  fs.writeFileSync(
    `src/config/env.${fileExt}`,
    apiTemplates.apiConfigEnv(language)
  );

  // Feature files
  fs.writeFileSync(
    `src/app/feature/index.${fileExt}`,
    apiTemplates.featureExportFile(language)
  );

  fs.writeFileSync(
    `src/app/feature/feature.routes.${fileExt}`,
    apiTemplates.featureRoute(language)
  );

  fs.writeFileSync(
    `src/app/feature/feature.controller.${fileExt}`,
    apiTemplates.featureController(language, usePathAlias)
  );

  fs.writeFileSync(
    `src/app/feature/feature.service.${fileExt}`,
    apiTemplates.featureService(language)
  );

  fs.writeFileSync(
    `src/app/feature/feature.repository.${fileExt}`,
    apiTemplates.featureRepository(language)
  );

  fs.writeFileSync(
    `src/app/feature/feature.schema.${fileExt}`,
    apiTemplates.featureSchema()
  );

  fs.writeFileSync(
    `src/app/feature/feature.test.${fileExt}`,
    apiTemplates.healthTest(language, usePathAlias)
  );

  // Shared files
  fs.writeFileSync(
    `src/shared/middlewares/errorHandler.${fileExt}`,
    apiTemplates.errorHandler(language)
  );
  fs.writeFileSync(
    `src/shared/utils/logger.${fileExt}`,
    apiTemplates.logger(language)
  );
  fs.writeFileSync(
    `src/shared/utils/response.${fileExt}`,
    apiTemplates.responseHandler(language)
  );
  fs.writeFileSync(
    `src/shared/tests/api.test.${fileExt}`,
    apiTemplates.healthTest(language, usePathAlias)
  );

  // Infra files
  fs.writeFileSync(
    `src/infra/cache/index.${fileExt}`,
    apiTemplates.infraCache(language)
  );

  fs.writeFileSync(`src/infra/db/index.${fileExt}`, apiTemplates.infraDB);

  fs.writeFileSync(
    `src/infra/db/models/index.${fileExt}`,
    apiTemplates.infraDBModels
  );

  console.log(chalk.green("✅ Files generated successfully!\n"));

  // Install dependencies
  console.log(
    chalk.blue("📦 Installing dependencies (this may take a minute)...")
  );
  try {
    // Install production dependencies
    const prodDeps = "express dotenv cors cookie-parser";
    execSync(`npm install ${prodDeps}`, { stdio: "inherit" });

    // Install dev dependencies
    let devDeps = "@types/node @types/jest jest eslint supertest";

    if (language === "typescript") {
      devDeps +=
        " @types/express @types/cors @types/cookie-parser @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser ts-jest tsx typescript";
    } else {
      devDeps += " @babel/core @babel/preset-env babel-jest nodemon";
    }

    console.log(
      chalk.blue(
        "\n📦 Installing dev dependencies (this may take a minute)...\n"
      )
    );

    execSync(`npm install --save-dev ${devDeps}`, { stdio: "inherit" });

    console.log(chalk.green("\n✅ Dependencies installed successfully!\n"));
  } catch (error) {
    console.error(
      chalk.yellow(
        '⚠️  Failed to install dependencies. Run "npm install" manually.\n'
      )
    );
  }

  // Initialize git
  try {
    execSync("git init", { stdio: "ignore" });
    execSync("git add .", { stdio: "ignore" });
    execSync('git commit -m "Initial commit from @avero/cli"', {
      stdio: "ignore",
    });
    console.log(chalk.green("✅ Git repository initialized\n"));
  } catch (error) {
    console.log(chalk.yellow("⚠️  Git not initialized\n"));
  }

  // Success message
  console.log(
    chalk.green.bold("✨ Success!"),
    `Created ${chalk.cyan(projectName)} at ${chalk.cyan(projectPath)}\n`
  );
  console.log(chalk.white("Get started with:\n"));
  console.log(chalk.cyan(`  cd ${targetDir}`));
  console.log(chalk.cyan("  npm run dev\n"));
  console.log(chalk.gray("Available commands:"));
  console.log(chalk.gray("  npm run dev      - Start development server"));
  if (language === "typescript") {
    console.log(chalk.gray("  npm run build    - Build for production"));
  }
  console.log(chalk.gray("  npm start        - Start production server"));
  console.log(chalk.gray("  npm test         - Run tests"));
  console.log(chalk.gray("  npm run lint     - Lint code\n"));
  console.log(chalk.magenta("Happy coding! 🎉\n"));
}
