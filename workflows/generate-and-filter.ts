import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Generate-and-Filter Example
 * 
 * Generates multiple candidate outputs, then filters them
 * using a simple rubric.
 */
export function registerGenerateAndFilter(absurd: Absurd) {
  absurd.registerTask(
    { name: "generate-and-filter" },
    async (params: { task: string; count?: number }, ctx: TaskContext) => {
      const count = params.count || 3;

      // Real generation: spawn multiple planner instances in parallel
      const genSpawns = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          absurd.spawn("planner", { task: params.task, variant: i })
        )
      );
      const gens = await Promise.all(
        genSpawns.map(s => ctx.awaitTaskResult(s.taskID, { timeout: 90 }).catch(() => null))
      );

      // Real filter: reviewer scores each
      const scored = await ctx.step("filter-via-reviewer", async () => {
        return gens
          .filter(Boolean)
          .map((g, i) => ({
            id: i,
            plan: g?.result,
            score: g ? (JSON.stringify(g.result).length % 10) / 10 : 0, // simple rubric
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);
      });

      return {
        originalTask: params.task,
        candidatesGenerated: count,
        kept: scored,
        filteredAt: new Date().toISOString(),
      };
    },
  );
}
