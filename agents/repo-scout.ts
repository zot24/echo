import { Absurd, TaskContext } from "absurd-sdk";
import { runMercator } from "../tools/mercator";
import type { ProjectInfo } from "../state/types";

/**
 * Repo Scout Agent
 * 
 * Uses Mercator to discover and analyze projects on the machine.
 */
export function registerRepoScout(absurd: Absurd) {
  absurd.registerTask(
    { name: "repo-scout" },
    async (params: { requestId: string }, ctx: TaskContext) => {
      const rawOutput = await ctx.step("run-mercator", async () => {
        try {
          return await runMercator(["scan", "--json"]);
        } catch (e) {
          return JSON.stringify({ projects: [] });
        }
      });

      const projects: ProjectInfo[] = await ctx.step("normalize", async () => {
        try {
          const parsed = JSON.parse(rawOutput);
          return (parsed.projects || []).map((p: any) => ({
            name: p.name || "unknown",
            path: p.path || "",
            languages: p.languages || [],
            frameworks: p.frameworks || [],
            authPatterns: p.authPatterns || [],
            lastScanned: new Date().toISOString(),
          }));
        } catch {
          return [];
        }
      });

      return {
        projects,
        scannedAt: new Date().toISOString(),
      };
    },
  );
}
