import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Lightweight test workflow
 * 
 * Keeps orchestration simple. Agents are composed flexibly.
 */
export function registerTestWorkflow(absurd: Absurd) {
  absurd.registerTask(
    { name: "test-swarm-scout-then-keeper" },
    async (params: { request: string }, ctx: TaskContext) => {
      // Spawn scout
      const scout = await absurd.spawn("repo-scout", { requestId: Date.now().toString() });
      const scoutResult = await ctx.awaitTaskResult(scout.taskID, { timeout: 120 });

      const projects = scoutResult.state === "completed" 
        ? scoutResult.result?.projects || [] 
        : [];

      // Spawn knowledge keeper with scout output
      const keeper = await absurd.spawn("knowledge-keeper", { projects });
      const keeperResult = await ctx.awaitTaskResult(keeper.taskID, { timeout: 60 });

      return {
        request: params.request,
        projectsFound: projects.length,
        knowledge: keeperResult.state === "completed" ? keeperResult.result?.knowledge : null,
      };
    },
  );
}
