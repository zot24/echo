import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Implementer Agent (MVP)
 * 
 * Produces a clear handoff request for pi's native subagent system.
 * The actual delegation happens at the pi orchestrator level.
 */
const EXECUTORS = ["pi-subagent", "openhands", "claude-code", "direct"] as const;
type Executor = typeof EXECUTORS[number];

export function registerImplementer(absurd: Absurd) {
  absurd.registerTask(
    { name: "implementer" },
    async (params: { task: string; targetSubagent?: string; plan?: any; executor?: Executor; retries?: number }, ctx: TaskContext) => {
      const target = params.targetSubagent || "worker";
      const executor: Executor = (params.executor && EXECUTORS.includes(params.executor)) ? params.executor : "pi-subagent";
      const maxRetries = params.retries ?? 2;

      let attempt = 0;
      let lastError: any = null;

      while (attempt <= maxRetries) {
        try {
          const handoff = await ctx.step(`handoff-attempt-${attempt}`, async () => {
            if (executor === "pi-subagent") {
              return {
                type: "pi-subagent-handoff",
                targetSubagent: target,
                task: params.task,
                plan: params.plan || null,
                instructions: `Delegate to '${target}' subagent: ${params.task}`,
                status: "executing",
              };
            }
            return { type: `${executor}-handoff`, executor, task: params.task, status: "ready" };
          });

          return { handoff, executorUsed: executor, attempts: attempt + 1, executedAt: new Date().toISOString() };
        } catch (err) {
          lastError = err;
          attempt++;
          if (attempt > maxRetries) break;
          await new Promise(r => setTimeout(r, 500 * attempt)); // simple backoff
        }
      }

      return { error: "All retries failed", lastError, executorUsed: executor };
    },
  );
}
