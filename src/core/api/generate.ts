import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { averoVersion } from "../../lib/version";
import inquirer from "inquirer";
import { apiTemplates } from "./templates";
import { hasPathAliasConfigured } from "../../lib/utils";

interface CreateOptions {
  dir?: string;
}

export async function generateApiFeature(
  featureName?: string,
  options?: CreateOptions
) {
  let language: "typescript" | "javascript" = "typescript";
  const usePathAlias = hasPathAliasConfigured(process.cwd());

  if (!featureName) {
    const featureNameAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "featureName",
        message: "What should this feature be called:",
        default: "feature",
        validate: (input: string) => {
          if (/^[a-z0-9-_]+$/i.test(input)) return true;
          return "Project name can only contain letters, numbers, dashes, and underscores";
        },
      },
    ]);

    featureName = featureNameAnswer.featureName;
  }

  const targetDir = options?.dir || "src/app";
  const featurePath = path.join(process.cwd(), targetDir, featureName!);

  // Check if feature directory exists
  if (fs.existsSync(featurePath)) {
    console.error(
      chalk.red(
        `\n❌ Error: Feature directory '${featurePath}' already exists\n`
      )
    );
    process.exit(1);
  }

  if (!fs.existsSync(path.join(process.cwd(), "tsconfig.json"))) {
    language = "javascript";
  }

  const fileExt = language === "typescript" ? "ts" : "js";

  const omitFilesNameAnswer = await inquirer.prompt([
    {
      type: "checkbox",
      name: "omitFiles",
      message: "Select files to omit:",
      choices: [
        { name: `repository.${fileExt}`, checked: false },
        { name: `schema.${fileExt}`, checked: false },
      ],
    },
  ]);

  const omittedFiles = omitFilesNameAnswer.omitFiles.map(
    (file: string) => file.split(".")[0]
  );

  console.log(chalk.blue("\n📝 Generating files...\n"));

  // Create feature directory
  fs.mkdirSync(featurePath);

  // Create feature files
  fs.writeFileSync(
    `${featurePath}/index.${fileExt}`,
    apiTemplates.featureExportFile(language, featureName, omittedFiles)
  );

  fs.writeFileSync(
    `${featurePath}/${featureName}.routes.${fileExt}`,
    apiTemplates.featureRoute(language, featureName)
  );

  fs.writeFileSync(
    `${featurePath}/${featureName}.controller.${fileExt}`,
    apiTemplates.featureController(language, usePathAlias, featureName)
  );

  fs.writeFileSync(
    `${featurePath}/${featureName}.service.${fileExt}`,
    apiTemplates.featureService(language, featureName)
  );

  if (!omittedFiles.includes("repository")) {
    fs.writeFileSync(
      `${featurePath}/${featureName}.repository.${fileExt}`,
      apiTemplates.featureRepository(language, featureName)
    );
  }

  if (!omittedFiles.includes("schema")) {
    fs.writeFileSync(
      `${featurePath}/${featureName}.schema.${fileExt}`,
      apiTemplates.featureSchema(featureName)
    );
  }

  if (!omittedFiles.includes("test")) {
    fs.writeFileSync(
      `${featurePath}/${featureName}.test.${fileExt}`,
      apiTemplates.healthTest(language, usePathAlias, featureName)
    );
  }

  console.log(chalk.green("✅ Files generated successfully!\n"));
}
