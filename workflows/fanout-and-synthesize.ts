import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Fanout-and-Synthesize Example
 * 
 * Runs multiple agents in parallel on the same task,
 * then combines their outputs.
 */
export function registerFanoutAndSynthesize(absurd: Absurd) {
  absurd.registerTask(
    { name: "fanout-and-synthesize" },
    async (params: { task: string; agents?: string[] }, ctx: TaskContext) => {
      const agentsToRun = params.agents || ["repo-scout", "planner", "reviewer"];

      // Full parallel fanout via Absurd spawns + Promise.all
      const spawned = await Promise.all(
        agentsToRun.map(agent => absurd.spawn(agent, { task: params.task }))
      );

      const results = await Promise.all(
        spawned.map(s =>
          ctx.awaitTaskResult(s.taskID, { timeout: 180 }).catch(() => ({ state: "timeout", result: null }))
        )
      );

      // Real merge/synthesize step
      const synthesis = await ctx.step("synthesize", async () => {
        const successful = results
          .filter(r => r.state === "completed")
          .map((r, i) => ({ agent: agentsToRun[i], output: r.result }));

        return {
          task: params.task,
          parallelResults: successful,
          mergedSummary: `Synthesized ${successful.length}/${agentsToRun.length} agent outputs`,
          synthesizedAt: new Date().toISOString(),
        };
      });

      return synthesis;
    },
  );
}
