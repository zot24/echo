import { execSync } from "node:child_process";

/**
 * Wrapper for the Mercator Rust binary.
 * Mercator is used by the Repo Scout agent to discover and analyze projects.
 */
export async function runMercator(args: string[]): Promise<string> {
  const cmd = ["mercator", ...args].join(" ");
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
  } catch (error: any) {
    throw new Error(`Mercator failed: ${error.message}`);
  }
}

/**
 * Example usage:
 *   const output = await runMercator(["scan", "--json"]);
 */
