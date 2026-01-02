#!/usr/bin/env node

import { Command } from "commander";
import { createApiProject } from "./core/api/create";
import { initService } from "./commands/init";
import { generateApiFeature } from "./core/api/generate";

const program = new Command();

program
  .name("avero")
  .description("CLI tool to generate various project templates")
  .version("1.0.0", "-v, --version", "output the current version");

// Main create command for API
program
  .command("create [project-name]")
  .description("Create a new Node.js API service")
  .option("-d, --dir <directory>", "specify target directory")
  .action(createApiProject);

program
  .command("generate [feature-name]")
  .description("Generate a new feature module")
  .option("-d, --dir <directory>", "specify target directory")
  .action(generateApiFeature);

// Init command for other services
program
  .command("init")
  .description("Initialize a service (database, etc.)")
  .argument("[service]", "service to initialize (database)")
  .action(initService);

// Show help if no command provided
// console.log("Argv:", process.argv);
// if (process.argv.length === 2) {
//   program.outputHelp();
// }

program.parse(process.argv);
