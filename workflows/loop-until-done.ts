import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Loop-Until-Done (Improved)
 * 
 * Keeps iterating while issues are found.
 * Stops when no new issues are detected or max iterations reached.
 */
export function registerLoopUntilDone(absurd: Absurd) {
  absurd.registerTask(
    { name: "loop-until-done" },
    async (params: { task: string; maxIterations?: number }, ctx: TaskContext) => {
      const max = params.maxIterations || 8;
      let iteration = 0;
      let issues: string[] = [];
      let done = false;

      while (!done && iteration < max) {
        iteration++;

        const result = await ctx.step(`iteration-${iteration}`, async () => {
          // Real agent-based condition: would invoke reviewer or domain-specific checker
          // For MVP, simulate by checking if previous step produced issues
          const foundIssues = iteration < 4 ? [`Issue-${iteration} (from reviewer agent)`] : [];
          return {
            issues: foundIssues,
            done: foundIssues.length === 0,
          };
        });

        issues.push(...result.issues);
        done = result.done;
      }

      return {
        originalTask: params.task,
        totalIterations: iteration,
        allIssues: issues,
        stoppedBecause: done ? "no-more-issues" : "max-iterations",
        completedAt: new Date().toISOString(),
      };
    },
  );
}
