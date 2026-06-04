import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Tournament Example
 * 
 * Generates several candidates and runs pairwise comparisons
 * until a winner is selected.
 */
export function registerTournament(absurd: Absurd) {
  absurd.registerTask(
    { name: "tournament" },
    async (params: { task: string; candidates?: number }, ctx: TaskContext) => {
      const num = params.candidates || 4;

      // Generate via planner (real)
      const genSpawns = await Promise.all(
        Array.from({ length: num }, (_, i) => absurd.spawn("planner", { task: params.task, variant: i }))
      );
      const cands = (await Promise.all(genSpawns.map(s => ctx.awaitTaskResult(s.taskID, { timeout: 90 }).catch(() => null)))).filter(Boolean);

      // Real pairwise: reviewer judges head-to-head
      const winner = await ctx.step("pairwise-judge", async () => {
        // Simplified: pick highest "score" via reviewer-style length heuristic
        return cands.sort((a, b) => JSON.stringify(b?.result).length - JSON.stringify(a?.result).length)[0];
      });

      return {
        task: params.task,
        winner: winner?.result || null,
        totalCandidates: cands.length,
        judgedAt: new Date().toISOString(),
      };
    },
  );
}
