import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Workflow Generator Agent
 * 
 * Takes a high-level task and generates a human-readable
 * dynamic workflow definition in YAML format.
 */
export function registerWorkflowGenerator(absurd: Absurd) {
  absurd.registerTask(
    { name: "workflow-generator" },
    async (params: { 
      task: string; 
      constraints?: {
        preferredModels?: string[];
        requireVerification?: boolean;
        maxIterations?: number;
      }
    }, ctx: TaskContext) => {
      const workflow = await ctx.step("generate", async () => {
        // In a real implementation, this would call a strong model
        // (e.g. claude-3.5-sonnet or grok-4.3) to generate the workflow.
        //
        // For now we return a sensible default structure.

        const requireVerification = params.constraints?.requireVerification ?? true;
        const maxIter = params.constraints?.maxIterations ?? 4;

        const steps: any[] = [
          {
            id: "scout",
            agent: "repo-scout",
            input: { request: params.task },
          },
          {
            id: "analyze",
            agent: "knowledge-keeper",
            depends_on: ["scout"],
            input: { projects: "{{scout.result.projects}}" },
          },
          {
            id: "plan",
            agent: "planner",
            depends_on: ["analyze"],
            model: "claude-3.5-sonnet",
            input: { context: "{{analyze.result.knowledge}}" },
          },
          {
            id: "implement",
            agent: "implementer",
            depends_on: ["plan"],
            model: "grok-4.3",
            executor: "pi-subagent",
            input: { task: "{{plan.result.plan}}" },
          },
        ];

        if (requireVerification) {
          steps.push({
            id: "review",
            agent: "reviewer",
            depends_on: ["implement"],
            input: { content: "{{implement.result.handoff}}" },
          });
        }

        return {
          kind: "feature-implementation",
          name: params.task.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
          description: params.task,
          version: 1,
          steps,
          control: requireVerification
            ? {
                loop_until: "review.issues.length == 0",
                max_iterations: maxIter,
              }
            : undefined,
        };
      });

      return {
        workflow,
        generatedAt: new Date().toISOString(),
      };
    },
  );
}
