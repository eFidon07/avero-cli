import * as path from "path";
import ts from "typescript";

export function hasPathAliasConfigured(cwd: string): boolean {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json");
  if (!configPath) return false;

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) return false;

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  const { baseUrl, paths } = parsed.options;

  return !!baseUrl && !!paths && Object.keys(paths).length > 0;
}
