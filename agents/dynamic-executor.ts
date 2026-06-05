import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Dynamic Executor (Improved)
 * 
 * Executes dynamically generated workflows.
 * Supports:
 * - Step dependencies
 * - Basic variable substitution
 * - Agent spawning
 */
export function registerDynamicExecutor(absurd: Absurd) {
  absurd.registerTask(
    { name: "dynamic-executor" },
    async (params: { workflow: any }, ctx: TaskContext) => {
      const workflow = params.workflow;
      const results: Record<string, any> = {};
      const steps = workflow.steps || [];

      // Simple topological execution (assumes steps are roughly ordered)
      for (const step of steps) {
        // Resolve input variables
        const resolvedInput = resolveVariables(step.input || {}, results);

        const stepResult = await ctx.step(`execute-${step.id}`, async () => {
          try {
            // Spawn the actual agent
            const spawnResult = await absurd.spawn(step.agent, resolvedInput);
            const taskResult = await ctx.awaitTaskResult(spawnResult.taskID, { timeout: 120 });

            return {
              step: step.id,
              agent: step.agent,
              status: taskResult.state,
              result: taskResult.result,
            };
          } catch (e: any) {
            return {
              step: step.id,
              agent: step.agent,
              status: "failed",
              error: e.message,
            };
          }
        });

        results[step.id] = stepResult;
      }

      return {
        workflowName: workflow.name,
        kind: workflow.kind,
        stepsExecuted: steps.length,
        results,
        executedAt: new Date().toISOString(),
      };
    },
  );
}

/**
 * Very basic variable resolver: {{step.result.field}}
 */
function resolveVariables(input: any, results: Record<string, any>): any {
  const str = JSON.stringify(input);
  const resolved = str.replace(/\{\{([\w.]+)\}\}/g, (_, path) => {
    const [stepId, ...rest] = path.split(".");
    const stepResult = results[stepId];
    if (!stepResult) return "";

    let value: any = stepResult;
    for (const key of rest) {
      value = value?.[key];
    }
    return value != null ? String(value) : "";
  });

  return JSON.parse(resolved);
}
