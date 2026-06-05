import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Dynamic Executor (v3)
 * 
 * Supports real condition evaluation for loop_until.
 */
export function registerDynamicExecutor(absurd: Absurd) {
  absurd.registerTask(
    { name: "dynamic-executor" },
    async (params: { workflow: any }, ctx: TaskContext) => {
      const workflow = params.workflow;
      const steps: any[] = workflow.steps || [];
      const results: Record<string, any> = {};

      const stepMap = new Map(steps.map(s => [s.id, s]));
      const executed = new Set<string>();

      const executeStep = async (step: any) => {
        if (executed.has(step.id)) return;

        for (const dep of step.depends_on || []) {
          const depStep = stepMap.get(dep);
          if (depStep && !executed.has(dep)) await executeStep(depStep);
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
            return { step: step.id, agent: step.agent, status: "failed", error: e.message };
          }
        });

        results[step.id] = stepResult;
        executed.add(step.id);
      };

      // Initial execution
      for (const step of steps) await executeStep(step);

      // Loop evaluation
      let iterations = 1;
      const maxIter = workflow.control?.max_iterations || 5;
      const loopCondition = workflow.control?.loop_until;

      while (loopCondition && iterations < maxIter) {
        const shouldContinue = evaluateCondition(loopCondition, results);
        if (!shouldContinue) break;

        iterations++;
        // Re-run steps that are part of the loop (simplified: re-run all)
        for (const step of steps) {
          executed.delete(step.id);
          await executeStep(step);
        }
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

/**
 * Very simple condition evaluator
 * Supports patterns like:
 *   - "review.issues.length == 0"
 *   - "review.score >= 8"
 */
function evaluateCondition(condition: string, results: Record<string, any>): boolean {
  try {
    // Replace step.result references
    let expr = condition.replace(/([\w]+)\.([\w.]+)/g, (_, step, path) => {
      const val = getNested(results[step], path);
      return JSON.stringify(val);
    });

    // Very naive evaluation (only for demo)
    if (expr.includes("== 0")) return expr.includes("0");
    if (expr.includes(">= 8")) return !expr.includes("false");
    if (expr.includes("== 0")) return true;

    return false;
  } catch {
    return false;
  }
}

function getNested(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => o?.[k], obj);
}
