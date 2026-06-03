import { Absurd, TaskContext } from "absurd-sdk";
import type { ProjectInfo } from "../state/types";

/**
 * Planner Agent — Lightweight
 */
export function registerPlanner(absurd: Absurd) {
  absurd.registerTask(
    { name: "planner" },
    async (params: { projects: ProjectInfo[] }, ctx: TaskContext) => {
      const plan = await ctx.step("plan", async () => ({
        summary: `Work across ${params.projects.length} projects`,
        steps: ["Analyze current state", "Define target", "Implement changes", "Review"],
      }));

      return { plan, createdAt: new Date().toISOString() };
    },
  );
}
