import chalk from "chalk";
import inquirer from "inquirer";

const availableServices = [
  {
    name: "Authentication Module",
    value: "auth",
    description: "JWT, OAuth, RBAC setup",
  },
  {
    name: "Database Configuration",
    value: "database",
    description: "Mongoose",
  },
];

export async function initService(service?: string) {
  let selectedService = service;

  // Interactive mode if no service specified
  if (!selectedService) {
    console.log(chalk.cyan.bold("\n🚀 Avero Service Initializer\n"));

    const answers = await inquirer.prompt([
      {
        type: "select",
        name: "service",
        message: "Select a service to initialize:",
        choices: availableServices.map((s) => ({
          name: `${s.name} - ${chalk.gray(s.description)}`,
          value: s.value,
          short: s.name,
        })),
      },
    ]);

    selectedService = answers.service;
  }

  const serviceLower = selectedService!.toLowerCase();
  const serviceNames = availableServices.map((s) => s.value);

  if (!serviceNames.includes(serviceLower)) {
    console.log(
      chalk.red(`\n❌ Error: Unknown service "${selectedService}"\n`)
    );
    console.log(chalk.white("Available services:"));
    availableServices.forEach((s) => {
      console.log(chalk.gray(`  - ${s.value.padEnd(10)} ${s.description}`));
    });
    console.log();
    return;
  }

  const serviceInfo = availableServices.find((s) => s.value === serviceLower);
  console.log(chalk.cyan.bold(`\n🚀 Avero ${serviceInfo?.name} Generator\n`));

  switch (serviceLower) {
    case "auth":
      console.log(
        chalk.yellow("⚠️  Authentication module generator is coming soon!\n")
      );
      console.log(
        chalk.gray(
          "This will help you set up authentication (JWT, OAuth, RBAC, etc.)."
        )
      );
      break;
    case "database":
      console.log(
        chalk.yellow("⚠️  Database configuration generator is coming soon!\n")
      );
      console.log(
        chalk.gray(
          "This will help you set up database connections (Prisma, MongoDB with mongoose, etc.)."
        )
      );
      break;
    default:
      console.log(
        chalk.yellow(`⚠️  ${selectedService} generator is coming soon!\n`)
      );
  }

  console.log();
}
