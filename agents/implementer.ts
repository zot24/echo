import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Implementer Agent
 * 
 * Produces a structured handoff request that pi can use
 * to delegate work to a real subagent (openhands-worker, etc.).
 */
export function registerImplementer(absurd: Absurd) {
  absurd.registerTask(
    { name: "implementer" },
    async (params: { task: string; targetSubagent?: string; plan?: any }, ctx: TaskContext) => {
      const target = params.targetSubagent || "openhands-worker";

      const handoff = await ctx.step("prepare-handoff", async () => {
        return {
          type: "pi-subagent-handoff",
          target,
          task: params.task,
          plan: params.plan || null,
          instructions: `Please hand off this task to the '${target}' subagent:\n\n${params.task}`,
          status: "ready",
          createdAt: new Date().toISOString(),
        };
      });

      return {
        handoff,
        modelUsed: "grok-4.3", // Will be replaced by router later
      };
    },
  );
}
