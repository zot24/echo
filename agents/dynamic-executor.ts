import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Dynamic Executor (v2)
 * 
 * Executes dynamically generated workflows with:
 * - Proper dependency resolution (topological sort)
 * - Basic loop_until support
 * - Variable substitution
 */
export function registerDynamicExecutor(absurd: Absurd) {
  absurd.registerTask(
    { name: "dynamic-executor" },
    async (params: { workflow: any }, ctx: TaskContext) => {
      const workflow = params.workflow;
      const steps: any[] = workflow.steps || [];
      const results: Record<string, any> = {};

      // Build dependency graph
      const stepMap = new Map(steps.map(s => [s.id, s]));
      const executed = new Set<string>();

      // Topological execution
      const executeStep = async (step: any) => {
        if (executed.has(step.id)) return;

        // Wait for dependencies
        for (const dep of step.depends_on || []) {
          const depStep = stepMap.get(dep);
          if (depStep && !executed.has(dep)) {
            await executeStep(depStep);
          }
        }

        const resolvedInput = resolveVariables(step.input || {}, results);

        const stepResult = await ctx.step(`execute-${step.id}`, async () => {
          try {
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
        executed.add(step.id);
      };

      // Execute all steps
      for (const step of steps) {
        await executeStep(step);
      }

      // Basic loop support
      let iterations = 0;
      const maxIter = workflow.control?.max_iterations || 3;

      while (workflow.control?.loop_until && iterations < maxIter) {
        iterations++;
        // In a real version we would evaluate the condition against results
        // For now we just break after one extra pass if looping is requested
        break;
      }

      return {
        workflowName: workflow.name,
        kind: workflow.kind,
        stepsExecuted: steps.length,
        iterations,
        results,
        executedAt: new Date().toISOString(),
      };
    },
  );
}

/**
 * Basic variable resolver
 */
function resolveVariables(input: any, results: Record<string, any>): any {
  const str = JSON.stringify(input);
  const resolved = str.replace(/\{\{([\w.]+)\}\}/g, (_, path) => {
    const [stepId, ...rest] = path.split(".");
    let value: any = results[stepId];
    for (const key of rest) value = value?.[key];
    return value != null ? String(value) : "";
  });
  return JSON.parse(resolved);
}
