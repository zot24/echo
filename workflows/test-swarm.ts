import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Lightweight test workflow
 * 
 * Keeps orchestration simple. Agents are composed flexibly.
 */
// Basic test helpers (for manual verification / future vitest)
export async function testImplementerExecutors(absurd: Absurd) {
  // Would be called in a test runner
  console.log("[test] Implementer executor registry + retry ready");
}

export function registerDashboard(absurd: Absurd) {
  absurd.registerTask({ name: "swarm-dashboard" }, async () => {
    return { url: "http://localhost:7890", note: "Open Habitat for swarm tasks" };
  });
}

export function registerTestWorkflow(absurd: Absurd) {
  absurd.registerTask(
    { name: "test-swarm-scout-then-keeper" },
    async (params: { request: string }, ctx: TaskContext) => {
      // Spawn scout in a different queue to avoid deadlock
      const scout = await absurd.spawn("repo-scout", { requestId: Date.now().toString() }, { queue: "agents" });
      const scoutResult = await ctx.awaitTaskResult(scout.taskID, { timeout: 120 });

      const projects = scoutResult.state === "completed" 
        ? scoutResult.result?.projects || [] 
        : [];

      // Spawn knowledge keeper in agents queue
      const keeper = await absurd.spawn("knowledge-keeper", { projects }, { queue: "agents" });
      const keeperResult = await ctx.awaitTaskResult(keeper.taskID, { timeout: 60 });

      return {
        request: params.request,
        projectsFound: projects.length,
        knowledge: keeperResult.state === "completed" ? keeperResult.result?.knowledge : null,
      };
    },
  );
}
