import { Absurd, TaskContext } from "absurd-sdk";
import yaml from "js-yaml";

/**
 * Dynamic Executor
 * 
 * Takes a generated workflow (YAML or object) and executes it.
 * This is the core of "Dynamic Workflows".
 */
export function registerDynamicExecutor(absurd: Absurd) {
  absurd.registerTask(
    { name: "dynamic-executor" },
    async (params: { workflow: any }, ctx: TaskContext) => {
      const workflow = params.workflow;

      const results: Record<string, any> = {};

      // Simple sequential execution for now
      for (const step of workflow.steps || []) {
        const stepResult = await ctx.step(`execute-${step.id}`, async () => {
          // In a real implementation, this would:
          // - Resolve input variables ({{...}})
          // - Call the correct agent
          // - Respect model/executor overrides
          // - Handle dependencies

          return {
            step: step.id,
            agent: step.agent,
            status: "executed",
            result: `Result from ${step.agent}`,
          };
        });

        results[step.id] = stepResult;
      }

      // Basic loop support (very simplified)
      if (workflow.control?.loop_until) {
        // In reality we would evaluate the condition properly
        // For now we just record that looping was requested
      }

      return {
        workflowName: workflow.name,
        kind: workflow.kind,
        stepsExecuted: workflow.steps?.length || 0,
        results,
        executedAt: new Date().toISOString(),
      };
    },
  );
}
